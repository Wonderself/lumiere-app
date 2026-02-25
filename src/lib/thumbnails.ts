/**
 * Thumbnail Generation Utilities
 *
 * Génère des commandes FFmpeg pour extraire des vignettes à des intervalles
 * spécifiques, créer des sprite sheets (aperçu au survol), et parser la
 * progression FFmpeg.
 *
 * Utilisé par le pipeline de transcodage pour générer les assets visuels
 * d'un film (preview images, sprite sheets pour le player vidéo).
 */

// ─── Types & Configuration ───────────────────────────────────

export interface ThumbnailConfig {
  intervals: number[]     // secondes auxquelles extraire les frames
  width: number           // largeur de la vignette (hauteur auto-calculée)
  format: 'jpg' | 'webp'  // format de sortie
  quality: number         // qualité 1-100
}

export const DEFAULT_THUMBNAIL_CONFIG: ThumbnailConfig = {
  intervals: [10, 30, 60, 120, 300, 600], // 10s, 30s, 1m, 2m, 5m, 10m
  width: 480,
  format: 'webp',
  quality: 80,
}

// ─── Single Thumbnail ────────────────────────────────────────

/**
 * Construit la commande FFmpeg pour extraire une vignette à un timestamp donné.
 *
 * @param inputPath - Chemin vers le fichier vidéo source
 * @param outputPath - Chemin de sortie pour la vignette
 * @param timestampSeconds - Position en secondes dans la vidéo
 * @param config - Configuration partielle (fusionnée avec les valeurs par défaut)
 * @returns La commande FFmpeg complète sous forme de string
 */
export function buildThumbnailCommand(
  inputPath: string,
  outputPath: string,
  timestampSeconds: number,
  config?: Partial<ThumbnailConfig>
): string {
  const cfg = { ...DEFAULT_THUMBNAIL_CONFIG, ...config }

  // Formater le timestamp en HH:MM:SS
  const hours = Math.floor(timestampSeconds / 3600)
  const minutes = Math.floor((timestampSeconds % 3600) / 60)
  const seconds = timestampSeconds % 60
  const timestamp = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const formatFlag = cfg.format === 'webp' ? 'webp' : 'mjpeg'
  const qualityFlag = cfg.format === 'webp'
    ? `-quality ${cfg.quality}`
    : `-q:v ${Math.max(1, Math.round((100 - cfg.quality) / 3.2))}` // FFmpeg JPEG quality: 1 (best) to 31 (worst)

  return [
    'ffmpeg',
    '-ss', timestamp,
    '-i', `"${inputPath}"`,
    '-vframes', '1',
    '-vf', `scale=${cfg.width}:-1`,
    '-f', formatFlag,
    qualityFlag,
    '-y',
    `"${outputPath}"`,
  ].join(' ')
}

// ─── Batch Thumbnails ────────────────────────────────────────

/**
 * Construit les commandes FFmpeg pour extraire des vignettes à tous les
 * intervalles configurés.
 *
 * @param inputPath - Chemin vers le fichier vidéo source
 * @param outputDir - Répertoire de sortie pour les vignettes
 * @param config - Configuration partielle
 * @returns Tableau de commandes FFmpeg
 */
export function buildThumbnailBatchCommands(
  inputPath: string,
  outputDir: string,
  config?: Partial<ThumbnailConfig>
): string[] {
  const cfg = { ...DEFAULT_THUMBNAIL_CONFIG, ...config }
  const ext = cfg.format === 'webp' ? 'webp' : 'jpg'

  return cfg.intervals.map(interval => {
    const outputPath = `${outputDir}/thumb_${interval}s.${ext}`
    return buildThumbnailCommand(inputPath, outputPath, interval, cfg)
  })
}

// ─── Sprite Sheet ────────────────────────────────────────────

/**
 * Construit la commande FFmpeg pour générer un sprite sheet.
 * Un sprite sheet est une mosaïque d'images extraites à intervalles réguliers,
 * utilisée pour l'aperçu au survol (comme YouTube/Netflix).
 *
 * @param inputPath - Chemin vers le fichier vidéo source
 * @param outputPath - Chemin de sortie pour le sprite sheet
 * @param options - Options de configuration
 * @returns La commande FFmpeg complète
 */
export function buildSpriteSheetCommand(
  inputPath: string,
  outputPath: string,
  options?: {
    interval?: number   // secondes entre chaque frame (défaut: 10)
    columns?: number    // nombre de colonnes dans la mosaïque (défaut: 10)
    width?: number      // largeur de chaque vignette (défaut: 160)
  }
): string {
  const interval = options?.interval ?? 10
  const columns = options?.columns ?? 10
  const width = options?.width ?? 160

  // fps=1/interval extrait une frame toutes les N secondes
  // scale redimensionne chaque frame
  // tile assemble les frames en mosaïque
  const filterComplex = `fps=1/${interval},scale=${width}:-1,tile=${columns}x0`

  return [
    'ffmpeg',
    '-i', `"${inputPath}"`,
    '-vf', `"${filterComplex}"`,
    '-q:v', '5',
    '-y',
    `"${outputPath}"`,
  ].join(' ')
}

// ─── FFmpeg Progress Parser ──────────────────────────────────

/**
 * Parse la sortie FFmpeg pour extraire le pourcentage de progression.
 * FFmpeg affiche "time=HH:MM:SS.ms" dans sa sortie stderr.
 *
 * @param output - Sortie brute de FFmpeg (stderr)
 * @param totalDurationSeconds - Durée totale de la vidéo en secondes
 * @returns Pourcentage de progression (0-100)
 */
export function parseFFmpegProgress(
  output: string,
  totalDurationSeconds: number
): number {
  if (totalDurationSeconds <= 0) return 0

  // Chercher la dernière occurrence de "time=HH:MM:SS.ms"
  const timePattern = /time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/g
  let lastMatch: RegExpExecArray | null = null
  let match: RegExpExecArray | null = null

  while ((match = timePattern.exec(output)) !== null) {
    lastMatch = match
  }

  if (!lastMatch) return 0

  const hours = parseInt(lastMatch[1], 10)
  const minutes = parseInt(lastMatch[2], 10)
  const seconds = parseInt(lastMatch[3], 10)
  const centiseconds = parseInt(lastMatch[4], 10)

  const currentSeconds = hours * 3600 + minutes * 60 + seconds + centiseconds / 100
  const progress = (currentSeconds / totalDurationSeconds) * 100

  // Clamp entre 0 et 100
  return Math.min(100, Math.max(0, Math.round(progress * 10) / 10))
}

// ─── Thumbnail URL Generator ─────────────────────────────────

/**
 * Génère les URLs attendues pour les vignettes d'un film.
 * Basé sur le slug du film et la configuration des intervalles.
 *
 * @param filmSlug - Slug unique du film
 * @param config - Configuration partielle
 * @returns Tableau d'URLs de vignettes
 */
export function getThumbnailUrls(
  filmSlug: string,
  config?: Partial<ThumbnailConfig>
): string[] {
  const cfg = { ...DEFAULT_THUMBNAIL_CONFIG, ...config }
  const ext = cfg.format === 'webp' ? 'webp' : 'jpg'

  return cfg.intervals.map(
    interval => `/media/thumbnails/${filmSlug}/thumb_${interval}s.${ext}`
  )
}

/**
 * Génère l'URL du sprite sheet pour un film.
 *
 * @param filmSlug - Slug unique du film
 * @returns URL du sprite sheet
 */
export function getSpriteSheetUrl(filmSlug: string): string {
  return `/media/thumbnails/${filmSlug}/sprite.jpg`
}
