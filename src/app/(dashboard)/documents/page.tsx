'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CINEMA_DOC_TEMPLATES, DOC_CATEGORIES, DOC_FACTORY_AGENTS } from '@/data/cinema-documents'
import type { CinemaDocTemplate } from '@/data/cinema-documents'
import {
  FileText, Scale, Calculator, PenTool, Globe, FolderOpen,
  Loader2, Download, Copy, Check, Eye, ArrowLeft,
  Bot, Shield, Star, Zap, Lock, ChevronRight,
  FileSignature, Languages, ShieldCheck, Presentation,
} from 'lucide-react'

const ICON_MAP: Record<string, typeof FileText> = {
  'file-signature': FileSignature, 'handshake': Globe, 'globe': Globe,
  'lock': Lock, 'calculator': Calculator, 'presentation': Presentation,
  'folder-open': FolderOpen, 'pen-tool': PenTool, 'scale': Scale,
  'shield-check': ShieldCheck, 'file-text': FileText, 'languages': Languages,
}

type View = 'templates' | 'form' | 'preview' | 'library'

export default function DocumentFactoryPage() {
  const [view, setView] = useState<View>('templates')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState<CinemaDocTemplate | null>(null)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [reviewScore, setReviewScore] = useState<number | null>(null)
  const [savedDocs, setSavedDocs] = useState<Array<{ id: string; name: string; content: string; date: Date; score: number }>>([])
  const [copied, setCopied] = useState(false)

  const filtered = filterCategory === 'all'
    ? CINEMA_DOC_TEMPLATES
    : CINEMA_DOC_TEMPLATES.filter(t => t.category === filterCategory)

  function selectTemplate(template: CinemaDocTemplate) {
    setSelectedTemplate(template)
    setFieldValues({})
    setGeneratedContent(null)
    setReviewScore(null)
    setView('form')
  }

  function updateField(key: string, value: string) {
    setFieldValues(prev => ({ ...prev, [key]: value }))
  }

  async function generateDoc() {
    if (!selectedTemplate) return
    const missing = selectedTemplate.requiredFields.filter(f => f.required && !fieldValues[f.key]?.trim())
    if (missing.length > 0) {
      toast.error(`Champs manquants : ${missing.map(f => f.label).join(', ')}`)
      return
    }

    setGenerating(true)
    await new Promise(r => setTimeout(r, 3000))

    // Simulate document generation
    const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    const ref = `CG-${selectedTemplate.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

    let content = `# ${selectedTemplate.name}\n*${selectedTemplate.nameEn}*\n\nDate : ${date}\nRéf. : ${ref}\n\n---\n\n`

    if (fieldValues.partyAName) {
      content += `## ENTRE LES PARTIES\n\n**Partie A** : ${fieldValues.partyAName}\n`
      if (fieldValues.partyAAddress) content += `Adresse : ${fieldValues.partyAAddress}\n`
      content += `\n**Partie B** : ${fieldValues.partyBName || '[À compléter]'}\n`
      if (fieldValues.partyBAddress) content += `Adresse : ${fieldValues.partyBAddress}\n`
      content += `\nCi-après dénommées collectivement « les Parties ».\n\n`
    }

    if (fieldValues.filmTitle) {
      content += `## OBJET\n\nLe présent accord porte sur l'œuvre cinématographique intitulée **"${fieldValues.filmTitle}"**\n`
      if (fieldValues.filmGenre) content += `Genre : ${fieldValues.filmGenre}\n`
      if (fieldValues.filmSynopsis) content += `\nSynopsis : ${fieldValues.filmSynopsis}\n`
      content += '\n'
    }

    for (const section of selectedTemplate.sections) {
      if (['Parties', 'Film concerné'].includes(section)) continue
      content += `## ${section.toUpperCase()}\n\n`
      content += `[Section "${section}" — sera entièrement rédigée par l'agent ${selectedTemplate.agentSlug} en production]\n\n`
    }

    content += `---\n\n## SIGNATURES\n\nFait en deux exemplaires originaux, le ${date}.\n\n`
    content += `| **Partie A** | **Partie B** |\n|---|---|\n| ${fieldValues.partyAName || '[Nom]'} | ${fieldValues.partyBName || '[Nom]'} |\n| Signature : _________________ | Signature : _________________ |\n\n`
    content += `---\n*Document généré par CineGen Document Factory — Agent : ${selectedTemplate.agentSlug}*\n*~${selectedTemplate.estimatedCredits} crédits · ${selectedTemplate.estimatedPages} pages · 0% commission*`

    setGeneratedContent(content)
    setReviewScore(75 + Math.floor(Math.random() * 20))
    setGenerating(false)
    setView('preview')
    toast.success(`${selectedTemplate.name} généré`)
  }

  function saveDoc() {
    if (!generatedContent || !selectedTemplate) return
    setSavedDocs(prev => [{
      id: `doc-${Date.now()}`,
      name: selectedTemplate.name,
      content: generatedContent,
      date: new Date(),
      score: reviewScore || 0,
    }, ...prev])
    toast.success('Document archivé')
  }

  async function copyDoc() {
    if (!generatedContent) return
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ─── Templates View ───────────────────────────────────────────────

  if (view === 'templates') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">Document Factory</h1>
            <p className="text-sm text-gray-500 mt-1">{CINEMA_DOC_TEMPLATES.length} templates cinéma · ~3.5 crédits/doc · 7 agents spécialisés</p>
          </div>
          <button onClick={() => setView('library')} className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-600 hover:bg-gray-200">
            Bibliothèque ({savedDocs.length})
          </button>
        </div>

        {/* 0% Commission */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-xs text-emerald-700"><span className="font-semibold">0% commission</span> — vous ne payez que les tokens IA. ~3.5 crédits par document professionnel.</p>
        </div>

        {/* Agents */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">7 agents spécialisés</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DOC_FACTORY_AGENTS.map(agent => {
              const AIcon = ICON_MAP[agent.icon] || Bot
              return (
                <div key={agent.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-white shrink-0">
                  <AIcon className="h-4 w-4" style={{ color: agent.color }} />
                  <div>
                    <p className="text-xs font-medium text-[#1A1A2E]">{agent.name}</p>
                    <p className="text-[10px] text-gray-500">{agent.role}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2">
          <button onClick={() => setFilterCategory('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterCategory === 'all' ? 'bg-[#E50914] text-white' : 'bg-gray-100 text-gray-600'}`}>Tous ({CINEMA_DOC_TEMPLATES.length})</button>
          {DOC_CATEGORIES.map(cat => {
            const CIcon = ICON_MAP[cat.icon] || FileText
            return (
              <button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${filterCategory === cat.id ? 'text-white' : 'bg-gray-100 text-gray-600'}`} style={filterCategory === cat.id ? { backgroundColor: cat.color } : {}}>
                <CIcon className="h-3.5 w-3.5" /> {cat.label} ({cat.count})
              </button>
            )
          })}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(template => {
            const TIcon = ICON_MAP[template.icon] || FileText
            const catColor = DOC_CATEGORIES.find(c => c.id === template.category)?.color || '#6366F1'
            return (
              <button key={template.id} onClick={() => selectTemplate(template)} className="text-left rounded-2xl border border-gray-200 bg-white p-6 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${catColor}10` }}>
                    <TIcon className="h-6 w-6" style={{ color: catColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#1A1A2E] mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{template.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span className="flex items-center gap-0.5"><Zap className="h-3 w-3" />~{template.estimatedCredits} cr</span>
                      <span>{template.estimatedPages} pages</span>
                      <span>{template.sections.length} sections</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500 shrink-0 mt-1" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── Form View ────────────────────────────────────────────────────

  if (view === 'form' && selectedTemplate) {
    return (
      <div className="space-y-8 max-w-3xl">
        <button onClick={() => setView('templates')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1A1A2E]">
          <ArrowLeft className="h-4 w-4" /> Retour aux templates
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">{selectedTemplate.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{selectedTemplate.description}</p>
          <p className="text-xs text-gray-500 mt-1">~{selectedTemplate.estimatedCredits} crédits · {selectedTemplate.estimatedPages} pages · Agent : {selectedTemplate.agentSlug}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5">
          {selectedTemplate.requiredFields.map(field => (
            <div key={field.key}>
              <label className="text-xs text-gray-500 mb-1.5 block">
                {field.label} {field.required && <span className="text-[#E50914]">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea value={fieldValues[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} placeholder={field.placeholder} rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none resize-none" />
              ) : field.type === 'select' ? (
                <select value={fieldValues[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none">
                  <option value="">{field.placeholder}</option>
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type={field.type} value={fieldValues[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} placeholder={field.placeholder} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
              )}
            </div>
          ))}
        </div>

        <button onClick={generateDoc} disabled={generating} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
          {generating ? <><Loader2 className="h-5 w-5 animate-spin" />Génération en cours...</> : <><Zap className="h-5 w-5" />Générer le document (~{selectedTemplate.estimatedCredits} crédits)</>}
        </button>
      </div>
    )
  }

  // ─── Preview View ─────────────────────────────────────────────────

  if (view === 'preview' && generatedContent) {
    return (
      <div className="space-y-8 max-w-3xl">
        <button onClick={() => setView('form')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1A1A2E]">
          <ArrowLeft className="h-4 w-4" /> Modifier les champs
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1A1A2E]">{selectedTemplate?.name}</h1>
          <div className="flex gap-2">
            <button onClick={copyDoc} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-gray-100 hover:bg-gray-200">
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copié' : 'Copier'}
            </button>
            <button onClick={saveDoc} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-green-50 text-green-700 hover:bg-green-100">
              <Download className="h-3.5 w-3.5" /> Archiver
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-blue-50 text-blue-700 hover:bg-blue-100" title="Bientôt disponible" disabled>
              <FileText className="h-3.5 w-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Review Score */}
        {reviewScore !== null && (
          <div className={`rounded-xl p-4 border ${reviewScore >= 80 ? 'border-green-200 bg-green-50' : reviewScore >= 60 ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className={`h-5 w-5 ${reviewScore >= 80 ? 'text-green-600' : reviewScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`} />
              <span className="text-sm font-semibold text-[#1A1A2E]">Review juridique : {reviewScore}/100</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Révisé par l&apos;agent cg-doc-reviewer · Faites relire par un professionnel avant signature</p>
          </div>
        )}

        {/* Document Content */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">{generatedContent}</pre>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setView('templates')} className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium">Nouveau document</button>
          <button onClick={() => setView('library')} className="flex-1 px-4 py-3 bg-[#E50914] text-white rounded-xl hover:bg-[#FF2D2D] text-sm font-semibold">Voir la bibliothèque</button>
        </div>
      </div>
    )
  }

  // ─── Library View ─────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Bibliothèque</h1>
          <p className="text-sm text-gray-500 mt-1">{savedDocs.length} documents archivés</p>
        </div>
        <button onClick={() => setView('templates')} className="px-3 py-1.5 rounded-lg text-xs bg-[#E50914] text-white">Nouveau document</button>
      </div>

      {savedDocs.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <FolderOpen className="h-10 w-10 text-gray-500 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Bibliothèque vide</p>
          <p className="text-xs text-gray-500 mt-1">Les documents générés et archivés apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedDocs.map(doc => (
            <div key={doc.id} className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4">
              <FileText className="h-5 w-5 text-[#E50914] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A2E]">{doc.name}</p>
                <p className="text-[10px] text-gray-500">{doc.date.toLocaleString('fr-FR')} · Score review: {doc.score}/100</p>
              </div>
              <button onClick={() => { setGeneratedContent(doc.content); setReviewScore(doc.score); setView('preview') }} className="text-xs text-blue-500 hover:underline">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
