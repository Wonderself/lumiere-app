/**
 * CDN Configuration Module
 *
 * Configuration et utilitaires pour la distribution de vidéos via CDN.
 * Supporte: Cloudflare Stream, Mux, ou self-hosted.
 *
 * Variables d'environnement:
 *   CDN_PROVIDER     - 'cloudflare' | 'mux' | 'self-hosted' (défaut: self-hosted)
 *   CDN_BASE_URL     - URL de base du CDN (ex: https://media.lumiere.film)
 *   CDN_API_KEY      - Clé API du CDN
 *   CDN_ACCOUNT_ID   - ID du compte (Cloudflare) ou Token ID (Mux)
 *   CDN_SIGNING_SECRET - Secret pour signer les URLs privées
 */

import crypto from 'crypto'

// ─── Types ───────────────────────────────────────────────────

export type CDNProvider = 'cloudflare' | 'mux' | 'self-hosted'

export interface CDNConfig {
  provider: CDNProvider
  baseUrl: string
  apiKey?: string
  accountId?: string    // Cloudflare account ID
  tokenId?: string      // Mux token ID
  signingSecret?: string
}

// ─── Configuration ───────────────────────────────────────────

/**
 * Récupère la configuration CDN depuis les variables d'environnement.
 * Par défaut: self-hosted si aucun provider n'est configuré.
 */
export function getCDNConfig(): CDNConfig {
  const provider = (process.env.CDN_PROVIDER || 'self-hosted') as CDNProvider
  const baseUrl = process.env.CDN_BASE_URL || ''
  const apiKey = process.env.CDN_API_KEY
  const accountId = process.env.CDN_ACCOUNT_ID
  const signingSecret = process.env.CDN_SIGNING_SECRET

  return {
    provider,
    baseUrl: baseUrl.replace(/\/+$/, ''), // Retirer le trailing slash
    apiKey,
    accountId,
    tokenId: accountId, // Mux utilise le même champ
    signingSecret,
  }
}

/**
 * Vérifie si le CDN est correctement configuré.
 */
export function isCDNConfigured(): boolean {
  const config = getCDNConfig()

  if (config.provider === 'self-hosted') {
    return !!config.baseUrl
  }

  if (config.provider === 'cloudflare') {
    return !!config.baseUrl && !!config.accountId && !!config.apiKey
  }

  if (config.provider === 'mux') {
    return !!config.apiKey && !!config.accountId
  }

  return false
}

// ─── Video URLs ──────────────────────────────────────────────

/**
 * Construit l'URL de lecture vidéo pour un film.
 * Adapte le format selon le provider CDN configuré.
 *
 * @param filmSlug - Slug unique du film
 * @param quality - Qualité souhaitée (ex: '720p', '1080p'). Si absent: adaptive.
 * @returns URL de lecture
 */
export function getVideoPlaybackUrl(filmSlug: string, quality?: string): string {
  const config = getCDNConfig()

  switch (config.provider) {
    case 'cloudflare':
      // Cloudflare Stream utilise un format spécifique
      // https://customer-{accountId}.cloudflarestream.com/{videoId}/manifest/video.m3u8
      return quality
        ? `${config.baseUrl}/films/${filmSlug}/${quality}/playlist.m3u8`
        : `${config.baseUrl}/films/${filmSlug}/master.m3u8`

    case 'mux':
      // Mux utilise stream.mux.com/{playback-id}.m3u8
      return quality
        ? `https://stream.mux.com/${filmSlug}.m3u8?max_resolution=${quality}`
        : `https://stream.mux.com/${filmSlug}.m3u8`

    case 'self-hosted':
    default:
      // Self-hosted: HLS files dans /media/
      if (config.baseUrl) {
        return quality
          ? `${config.baseUrl}/media/films/${filmSlug}/${quality}/playlist.m3u8`
          : `${config.baseUrl}/media/films/${filmSlug}/master.m3u8`
      }
      return quality
        ? `/media/films/${filmSlug}/${quality}/playlist.m3u8`
        : `/media/films/${filmSlug}/master.m3u8`
  }
}

/**
 * Construit l'URL du master playlist HLS pour le streaming adaptatif.
 *
 * @param filmSlug - Slug unique du film
 * @returns URL du master playlist M3U8
 */
export function getHLSUrl(filmSlug: string): string {
  return getVideoPlaybackUrl(filmSlug)
}

// ─── Thumbnail URLs ──────────────────────────────────────────

/**
 * Construit l'URL d'une vignette via CDN.
 *
 * @param filmSlug - Slug unique du film
 * @param timestamp - Position en secondes (optionnel, défaut: 10s)
 * @returns URL de la vignette
 */
export function getCDNThumbnailUrl(filmSlug: string, timestamp?: number): string {
  const config = getCDNConfig()
  const ts = timestamp ?? 10

  switch (config.provider) {
    case 'cloudflare':
      // Cloudflare Stream permet de demander un thumbnail à un timestamp
      return `${config.baseUrl}/films/${filmSlug}/thumbnails/thumbnail.jpg?time=${ts}s`

    case 'mux':
      // Mux: image.mux.com/{playback-id}/thumbnail.webp?time=30
      return `https://image.mux.com/${filmSlug}/thumbnail.webp?time=${ts}`

    case 'self-hosted':
    default:
      if (config.baseUrl) {
        return `${config.baseUrl}/media/thumbnails/${filmSlug}/thumb_${ts}s.webp`
      }
      return `/media/thumbnails/${filmSlug}/thumb_${ts}s.webp`
  }
}

// ─── Signed URLs (contenu privé) ─────────────────────────────

/**
 * Génère une URL signée pour le contenu vidéo privé.
 * Le contenu premium nécessite un abonnement actif.
 *
 * Utilise HMAC-SHA256 pour signer l'URL avec un timestamp d'expiration.
 *
 * @param filmSlug - Slug unique du film
 * @param expiresInSeconds - Durée de validité en secondes (défaut: 4h)
 * @returns URL signée avec token et expiration
 */
export function getSignedVideoUrl(
  filmSlug: string,
  expiresInSeconds: number = 14400 // 4 heures par défaut
): string {
  const config = getCDNConfig()

  // Si pas de secret de signature, retourner l'URL publique
  if (!config.signingSecret) {
    return getVideoPlaybackUrl(filmSlug)
  }

  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds
  const path = `/media/films/${filmSlug}/master.m3u8`

  // Créer le token HMAC
  const payload = `${path}:${expires}`
  const token = crypto
    .createHmac('sha256', config.signingSecret)
    .update(payload)
    .digest('hex')

  switch (config.provider) {
    case 'cloudflare':
      return `${config.baseUrl}${path}?token=${token}&expires=${expires}`

    case 'mux':
      // Mux a son propre système de signed URLs, mais on fournit notre fallback
      return `https://stream.mux.com/${filmSlug}.m3u8?token=${token}&expires=${expires}`

    case 'self-hosted':
    default:
      if (config.baseUrl) {
        return `${config.baseUrl}${path}?token=${token}&expires=${expires}`
      }
      return `${path}?token=${token}&expires=${expires}`
  }
}

/**
 * Vérifie si une URL signée est encore valide.
 *
 * @param url - URL signée à vérifier
 * @returns true si le token est valide et non expiré
 */
export function verifySignedUrl(url: string): boolean {
  const config = getCDNConfig()
  if (!config.signingSecret) return true

  try {
    const parsed = new URL(url, 'http://localhost')
    const token = parsed.searchParams.get('token')
    const expiresStr = parsed.searchParams.get('expires')

    if (!token || !expiresStr) return false

    const expires = parseInt(expiresStr, 10)
    if (isNaN(expires)) return false

    // Vérifier l'expiration
    if (Math.floor(Date.now() / 1000) > expires) return false

    // Recalculer le token attendu
    const path = parsed.pathname
    const payload = `${path}:${expires}`
    const expectedToken = crypto
      .createHmac('sha256', config.signingSecret)
      .update(payload)
      .digest('hex')

    // Comparaison timing-safe pour éviter les attaques timing
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(expectedToken, 'hex')
    )
  } catch {
    return false
  }
}
