'use server'

import { Resend } from 'resend'

// ─── Resend client (lazy init, graceful degradation) ─────────
let _resend: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const FROM = process.env.RESEND_FROM_EMAIL || 'Lumière Cinema <noreply@lumiere.film>'

// ─── Generic send (logs in dev, sends in prod) ──────────────
async function send(to: string, subject: string, html: string): Promise<boolean> {
  const resend = getResend()
  if (!resend) {
    console.log(`[EMAIL][DEV] To: ${to} | Subject: ${subject}`)
    return true
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html })
    return true
  } catch (err) {
    console.error('[EMAIL] Send failed:', err)
    return false
  }
}

// ─── Shared layout wrapper ──────────────────────────────────
function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;color:#ffffff;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:28px;font-weight:700;color:#D4AF37;letter-spacing:1px;">LUMIÈRE</span>
      <span style="font-size:12px;display:block;color:#ffffff60;margin-top:2px;">CINEMA</span>
    </div>
    <!-- Content -->
    <div style="background:#111111;border:1px solid #ffffff10;border-radius:16px;padding:32px;margin-bottom:24px;">
      ${body}
    </div>
    <!-- Footer -->
    <div style="text-align:center;color:#ffffff30;font-size:12px;line-height:1.5;">
      <p>Lumière Brothers SAS — Paris, France</p>
      <p><a href="https://cinema.lumiere.film" style="color:#D4AF37;text-decoration:none;">cinema.lumiere.film</a></p>
    </div>
  </div>
</body>
</html>`
}

function goldButton(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;padding:14px 32px;background:#D4AF37;color:#000000;font-weight:700;font-size:14px;text-decoration:none;border-radius:12px;margin:16px 0;">${text}</a>`
}

// ─── Email Templates ─────────────────────────────────────────

/** Welcome email sent after registration (with optional verification link) */
export async function sendWelcomeEmail(to: string, displayName: string, verificationToken?: string): Promise<boolean> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cinema.lumiere.film'
  const verifySection = verificationToken
    ? `
    <div style="text-align:center;margin-bottom:24px;">
      ${goldButton('Vérifier mon Email', `${baseUrl}/verify-email?token=${verificationToken}`)}
    </div>
    <p style="color:#ffffff60;font-size:13px;margin:0 0 24px;text-align:center;">
      Ce lien expire dans <strong>24 heures</strong>.
    </p>`
    : ''

  const html = layout('Bienvenue sur Lumière', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#D4AF37;">Bienvenue, ${displayName} !</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 16px;">
      Vous faites maintenant partie de la communauté Lumière Cinema — le premier studio de cinéma collaboratif propulsé par l'IA.
    </p>
    ${verifySection}
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 24px;">
      Explorez les films en production, contribuez vos talents, et gagnez des récompenses pour chaque tâche validée.
    </p>
    <div style="text-align:center;">
      ${goldButton('Découvrir les Films', `${baseUrl}/films`)}
    </div>
    <div style="margin-top:24px;padding-top:20px;border-top:1px solid #ffffff10;">
      <p style="color:#ffffff60;font-size:13px;margin:0;">
        Complétez votre profil et vos compétences pour recevoir des recommandations de tâches personnalisées.
      </p>
    </div>
  `)
  return send(to, 'Bienvenue sur Lumière Cinema', html)
}

/** Password reset email */
export async function sendPasswordResetEmail(to: string, token: string): Promise<boolean> {
  const resetUrl = `https://cinema.lumiere.film/reset-password?token=${token}`
  const html = layout('Réinitialisation du mot de passe', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#D4AF37;">Mot de passe oublié ?</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 16px;">
      Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
    </p>
    <div style="text-align:center;">
      ${goldButton('Réinitialiser mon mot de passe', resetUrl)}
    </div>
    <p style="color:#ffffff60;font-size:13px;margin:24px 0 0;line-height:1.5;">
      Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez cet email.
    </p>
  `)
  return send(to, 'Réinitialiser votre mot de passe — Lumière', html)
}

/** Task validated — payment coming */
export async function sendTaskValidatedEmail(
  to: string,
  displayName: string,
  taskTitle: string,
  filmTitle: string,
  amountEur: number
): Promise<boolean> {
  const html = layout('Tâche validée', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#D4AF37;">Bravo, ${displayName} ! 🎬</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 16px;">
      Votre contribution a été validée avec succès.
    </p>
    <div style="background:#0A0A0A;border:1px solid #D4AF37/20;border-radius:12px;padding:20px;margin:16px 0;">
      <p style="margin:0 0 8px;color:#ffffff80;font-size:13px;">Tâche</p>
      <p style="margin:0 0 12px;color:#fff;font-weight:600;">${taskTitle}</p>
      <p style="margin:0 0 8px;color:#ffffff80;font-size:13px;">Film</p>
      <p style="margin:0 0 12px;color:#fff;font-weight:600;">${filmTitle}</p>
      <p style="margin:0 0 8px;color:#ffffff80;font-size:13px;">Rémunération</p>
      <p style="margin:0;color:#D4AF37;font-weight:700;font-size:20px;">${amountEur.toFixed(2)} €</p>
    </div>
    <div style="text-align:center;">
      ${goldButton('Voir mes revenus', 'https://cinema.lumiere.film/dashboard/earnings')}
    </div>
  `)
  return send(to, `Tâche validée — ${amountEur.toFixed(2)}€ crédités`, html)
}

/** Payment processed */
export async function sendPaymentEmail(
  to: string,
  displayName: string,
  amountEur: number,
  method: string
): Promise<boolean> {
  const html = layout('Paiement effectué', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#D4AF37;">Paiement envoyé 💰</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 16px;">
      ${displayName}, votre paiement a été traité avec succès.
    </p>
    <div style="background:#0A0A0A;border-radius:12px;padding:20px;margin:16px 0;text-align:center;">
      <p style="margin:0 0 4px;color:#ffffff80;font-size:13px;">Montant</p>
      <p style="margin:0 0 12px;color:#D4AF37;font-weight:700;font-size:28px;">${amountEur.toFixed(2)} €</p>
      <p style="margin:0;color:#ffffff60;font-size:13px;">via ${method}</p>
    </div>
    <div style="text-align:center;">
      ${goldButton('Voir l\'historique', 'https://cinema.lumiere.film/dashboard/earnings')}
    </div>
  `)
  return send(to, `Paiement de ${amountEur.toFixed(2)}€ envoyé`, html)
}

/** Screenplay accepted — deal proposed */
export async function sendScreenplayAcceptedEmail(
  to: string,
  displayName: string,
  screenplayTitle: string,
  revenueSharePct: number
): Promise<boolean> {
  const html = layout('Scénario accepté', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#D4AF37;">Félicitations, ${displayName} ! 📝</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 16px;">
      Votre scénario <strong>"${screenplayTitle}"</strong> a été sélectionné pour la production.
    </p>
    <div style="background:#0A0A0A;border-radius:12px;padding:20px;margin:16px 0;">
      <p style="margin:0 0 8px;color:#ffffff80;font-size:13px;">Votre part des revenus</p>
      <p style="margin:0 0 12px;color:#D4AF37;font-weight:700;font-size:24px;">${revenueSharePct}%</p>
      <p style="color:#ffffff60;font-size:13px;margin:0;">
        Vous recevrez ${revenueSharePct}% de tous les revenus générés par le film (streaming, VOD, licences).
        Un contrat détaillé vous sera proposé.
      </p>
    </div>
    <div style="text-align:center;">
      ${goldButton('Voir mon scénario', 'https://cinema.lumiere.film/screenplays')}
    </div>
  `)
  return send(to, `Scénario "${screenplayTitle}" accepté — Deal proposé`, html)
}

/** Weekly digest (summary of activity) */
export async function sendWeeklyDigest(
  to: string,
  displayName: string,
  stats: { tasksCompleted: number; lumensEarned: number; newFilms: number }
): Promise<boolean> {
  const html = layout('Résumé de la semaine', `
    <h1 style="font-size:24px;margin:0 0 16px;color:#D4AF37;">Cette semaine sur Lumière</h1>
    <p style="color:#ffffffcc;line-height:1.6;margin:0 0 24px;">
      Bonjour ${displayName}, voici votre résumé d'activité.
    </p>
    <div style="display:flex;gap:12px;margin:16px 0;">
      <div style="flex:1;background:#0A0A0A;border-radius:12px;padding:16px;text-align:center;">
        <p style="margin:0;color:#D4AF37;font-weight:700;font-size:24px;">${stats.tasksCompleted}</p>
        <p style="margin:4px 0 0;color:#ffffff60;font-size:12px;">Tâches</p>
      </div>
      <div style="flex:1;background:#0A0A0A;border-radius:12px;padding:16px;text-align:center;">
        <p style="margin:0;color:#D4AF37;font-weight:700;font-size:24px;">${stats.lumensEarned}</p>
        <p style="margin:4px 0 0;color:#ffffff60;font-size:12px;">Lumens</p>
      </div>
      <div style="flex:1;background:#0A0A0A;border-radius:12px;padding:16px;text-align:center;">
        <p style="margin:0;color:#D4AF37;font-weight:700;font-size:24px;">${stats.newFilms}</p>
        <p style="margin:4px 0 0;color:#ffffff60;font-size:12px;">Nouveaux films</p>
      </div>
    </div>
    <div style="text-align:center;margin-top:24px;">
      ${goldButton('Voir le Dashboard', 'https://cinema.lumiere.film/dashboard')}
    </div>
  `)
  return send(to, `Votre semaine Lumière — ${stats.tasksCompleted} tâches, ${stats.lumensEarned} Lumens`, html)
}
