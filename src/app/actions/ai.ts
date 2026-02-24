'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { generateSynopsis, analyzeScenario } from '@/lib/ai-review'

export async function generateSynopsisAction(
  _prev: { error?: string; logline?: string; synopsis?: string; genres?: string[] } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const title = (formData.get('title') as string)?.trim()
  const genre = (formData.get('genre') as string)?.trim()

  if (!title || title.length < 2) {
    return { error: 'Donnez un titre (minimum 2 caracteres).' }
  }
  if (!genre) {
    return { error: 'Choisissez un genre.' }
  }

  const result = await generateSynopsis(title, genre)
  if (!result) {
    return { error: "L'IA n'est pas disponible pour le moment. Reessayez plus tard." }
  }

  return {
    logline: result.logline,
    synopsis: result.synopsis,
    genres: result.genres,
  }
}

export async function analyzeScenarioAction(
  proposalId: string,
  title: string,
  logline: string,
  synopsis: string | null,
  genre: string | null
) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const result = await analyzeScenario(title, logline, synopsis, genre)
  if (!result) {
    return { error: "L'IA n'est pas disponible." }
  }

  return {
    score: result.score,
    analysis: result.analysis,
    suggestions: result.suggestions,
  }
}
