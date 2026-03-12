'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'cinegen-create-progress'

/**
 * Hook to manage film creation progress across steps.
 * Persists completed steps in localStorage.
 */
export function useCreateProgress() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setCompletedSteps(JSON.parse(saved))
      }
    } catch {
      // Ignore parse errors
    }
    setLoaded(true)
  }, [])

  const markComplete = useCallback((stepId: string) => {
    setCompletedSteps((prev) => {
      if (prev.includes(stepId)) return prev
      const next = [...prev, stepId]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore storage errors
      }
      return next
    })
  }, [])

  const isStepUnlocked = useCallback((stepId: string, steps: { id: string }[]) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId)
    if (stepIndex === 0) return true
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.includes(steps[i].id)) return false
    }
    return true
  }, [completedSteps])

  const resetProgress = useCallback(() => {
    setCompletedSteps([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore
    }
  }, [])

  return { completedSteps, markComplete, isStepUnlocked, resetProgress, loaded }
}
