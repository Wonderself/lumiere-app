'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  width?: 'sm' | 'md' | 'lg' | 'xl'
}

const WIDTH_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export function SlideOver({ open, onClose, title, description, children, width = 'md' }: SlideOverProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 flex">
        <div
          ref={panelRef}
          className={`w-screen ${WIDTH_MAP[width]} bg-white shadow-2xl transform transition-transform duration-300 ease-out`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A2E]">{title}</h2>
              {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto h-[calc(100vh-80px)] px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
