import type { Metadata } from 'next'
import { ForgotPasswordForm } from './forgot-password-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mot de passe oublié — CINEGEN',
  description: 'Réinitialisez votre mot de passe CINEGEN.',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
