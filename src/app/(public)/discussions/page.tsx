'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import {
  DISCUSSION_TEMPLATES, DISCUSSION_CATEGORIES, DISCUSSION_AGENTS,
  DISCUSSION_TAGS, SENSITIVITY_TOPICS, DISCUSSION_SECTIONS,
  getTemplatesByCategory, getChallengeTemplates, getTemplateById,
} from '@/data/deep-discussions'
import type { DiscussionTemplate, DiscussionAgent } from '@/data/deep-discussions'
import {
  MessageSquare, Search, Bot, Flame, Shield, Send,
  Loader2, Copy, Check, Download, Share2, ArrowLeft,
  Brain, BookOpen, Eye, Users, PenTool, Rocket,
  Film, Cpu, Building, Star, Layers, Music, Camera,
  Globe, BookOpenIcon, Zap, AlertTriangle, ChevronRight,
  Twitter, Linkedin, Mail, X, Edit3, RefreshCcw,
} from 'lucide-react'

const AGENT_ICON_MAP: Record<string, typeof Brain> = {
  brain: Brain, 'book-open': BookOpen, eye: Eye, users: Users,
  'pen-tool': PenTool, rocket: Rocket, flame: Flame,
}

const CAT_ICON_MAP: Record<string, typeof Film> = {
  film: Film, brain: Brain, shield: Shield, 'book-open': BookOpen,
  'pen-tool': PenTool, users: Users, eye: Eye, cpu: Cpu,
  building: Building, star: Star, layers: Layers, music: Music,
  camera: Camera, book: BookOpen, globe: Globe, flame: Flame,
}

interface ChatMsg { role: 'user' | 'assistant'; content: string; depth?: string }

export default function DeepDiscussionsPage() {
  const [view, setView] = useState<'browse' | 'chat'>('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showChallengeOnly, setShowChallengeOnly] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState<DiscussionTemplate | null>(null)
  const [activeAgent, setActiveAgent] = useState<DiscussionAgent | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [depth, setDepth] = useState<'exploration' | 'approfondissement' | 'synthese'>('exploration')
  const [challengeMode, setChallengeMode] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [copied, setCopied] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Filter templates
  let filtered = DISCUSSION_TEMPLATES
  if (selectedCategory) filtered = filtered.filter(t => t.category === selectedCategory)
  if (selectedTag) filtered = filtered.filter(t => t.tags.includes(selectedTag))
  if (showChallengeOnly) filtered = filtered.filter(t => t.challengeMode)
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
  }

  function startDiscussion(template: DiscussionTemplate) {
    const agent = DISCUSSION_AGENTS.find(a => a.slug === template.agent) || DISCUSSION_AGENTS[0]
    setActiveTemplate(template)
    setActiveAgent(agent)
    setChallengeMode(template.challengeMode || false)
    setCustomTitle(template.title)
    setMessages([])
    setDepth('exploration')
    setView('chat')
    // Auto-send first prompt
    setTimeout(() => sendWithPrompt(template.prompts.exploration), 300)
  }

  async function sendWithPrompt(promptText: string) {
    setMessages(prev => [...prev, { role: 'user', content: promptText, depth }])
    setStreaming(true)
    await new Promise(r => setTimeout(r, 2000))
    const agentName = activeAgent?.name || 'Agent'
    const modeTag = challengeMode ? '\n\n⚔️ *Mode Challenge activé — je jouerai l\'avocat du diable.*' : ''
    const response = `[${agentName} · ${depth} · Opus + Extended Thinking]\n\n${promptText.substring(0, 40)}...\n\nCeci est une réponse simulée en profondeur. En production, cette analyse sera générée par Claude Opus avec Extended Thinking pour une réflexion de qualité maximale.\n\n**Points clés :**\n• Analyse contextuelle approfondie\n• Références cinématographiques pertinentes\n• Nuances et contre-arguments\n• Pistes de réflexion supplémentaires${modeTag}\n\n---\n*Passez au niveau suivant pour approfondir.*`
    setMessages(prev => [...prev, { role: 'assistant', content: response, depth }])
    setStreaming(false)
  }

  async function sendMessage() {
    if (!input.trim() || streaming) return
    const msg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg, depth }])
    setStreaming(true)
    await new Promise(r => setTimeout(r, 1800))
    const response = `[${activeAgent?.name} · Réponse]\n\n${msg.substring(0, 50)}...\n\nAnalyse approfondie en cours. En production, réponse streaming via Opus.`
    setMessages(prev => [...prev, { role: 'assistant', content: response, depth }])
    setStreaming(false)
  }

  function advanceDepth() {
    if (!activeTemplate) return
    if (depth === 'exploration') {
      setDepth('approfondissement')
      sendWithPrompt(activeTemplate.prompts.approfondissement)
    } else if (depth === 'approfondissement') {
      setDepth('synthese')
      sendWithPrompt(activeTemplate.prompts.synthese)
    }
  }

  function exportMarkdown() {
    const md = `# ${customTitle}\n\n${messages.map(m => `**${m.role === 'user' ? 'Vous' : activeAgent?.name}** (${m.depth}):\n${m.content}\n`).join('\n---\n\n')}`
    navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Discussion exportée en Markdown')
  }

  function shareUrl(platform: string) {
    const text = `Discussion cinéma : "${customTitle}" sur CineGen`
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
    }
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank')
  }

  // ─── BROWSE VIEW ──────────────────────────────────────────────────

  if (view === 'browse') {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">{DISCUSSION_TEMPLATES.length} discussions</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
              Deep <span className="text-[#E50914]">Discussions</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Explorez le cinéma en profondeur avec 7 agents experts. Philosophie, histoire, éthique, narration, et plus.
            </p>
            <p className="text-xs text-gray-600 mt-2">Opus + Extended Thinking · 16 catégories · 17 tags · Mode Challenge</p>
          </div>

          {/* Agents */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
            {DISCUSSION_AGENTS.map(agent => {
              const AIcon = AGENT_ICON_MAP[agent.icon] || Bot
              return (
                <div key={agent.slug} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/50 shrink-0">
                  <AIcon className="h-4 w-4" style={{ color: agent.color }} />
                  <div>
                    <p className="text-xs font-medium text-white">{agent.name}</p>
                    <p className="text-[10px] text-gray-500">{agent.role}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Search + Filters */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Rechercher une discussion..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <button onClick={() => { setSelectedCategory(null); setShowChallengeOnly(false) }} className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${!selectedCategory && !showChallengeOnly ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400'}`}>Tous ({DISCUSSION_TEMPLATES.length})</button>
              <button onClick={() => setShowChallengeOnly(!showChallengeOnly)} className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1 ${showChallengeOnly ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}><Flame className="h-3 w-3" />Challenge</button>
              {DISCUSSION_CATEGORIES.map(cat => {
                const CIcon = CAT_ICON_MAP[cat.icon] || MessageSquare
                return (
                  <button key={cat.id} onClick={() => { setSelectedCategory(cat.id === selectedCategory ? null : cat.id); setShowChallengeOnly(false) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1 ${selectedCategory === cat.id ? 'text-white' : 'bg-gray-800 text-gray-400'}`}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}>
                    <CIcon className="h-3 w-3" />{cat.label}
                  </button>
                )
              })}
            </div>

            {/* Tags */}
            <div className="flex gap-1.5 flex-wrap">
              {DISCUSSION_TAGS.map(tag => (
                <button key={tag} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`text-[10px] px-2 py-1 rounded-full border ${selectedTag === tag ? 'border-[#E50914] bg-[#E50914]/10 text-[#E50914]' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.slice(0, 30).map(template => {
              const agent = DISCUSSION_AGENTS.find(a => a.slug === template.agent)
              const cat = DISCUSSION_CATEGORIES.find(c => c.id === template.category)
              return (
                <button key={template.id} onClick={() => startDiscussion(template)}
                  className="text-left rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-gray-600 hover:bg-gray-800/50 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    {template.challengeMode && <Flame className="h-3.5 w-3.5 text-red-500" />}
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}>{cat?.label}</span>
                    {template.sensitivityFlags && template.sensitivityFlags.length > 0 && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{template.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">{agent?.name}</span>
                    <div className="flex gap-1">
                      {template.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {filtered.length > 30 && <p className="text-center text-xs text-gray-600 mt-6">+{filtered.length - 30} discussions supplémentaires...</p>}
        </div>
      </div>
    )
  }

  // ─── CHAT VIEW ────────────────────────────────────────────────────

  const AIcon = AGENT_ICON_MAP[activeAgent?.icon || 'brain'] || Bot

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800">
        <button onClick={() => setView('browse')} className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></button>
        <AIcon className="h-5 w-5" style={{ color: activeAgent?.color }} />
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} onBlur={() => setEditingTitle(false)} onKeyDown={e => { if (e.key === 'Enter') setEditingTitle(false) }} autoFocus className="bg-transparent text-sm font-semibold text-white border-b border-[#E50914] focus:outline-none w-full" />
          ) : (
            <button onClick={() => setEditingTitle(true)} className="text-sm font-semibold text-white hover:text-[#E50914] flex items-center gap-1 truncate">
              {customTitle} <Edit3 className="h-3 w-3 text-gray-500" />
            </button>
          )}
          <p className="text-[10px] text-gray-500">{activeAgent?.name} · Opus + Extended Thinking</p>
        </div>

        {/* Depth level */}
        <div className="flex gap-1">
          {(['exploration', 'approfondissement', 'synthese'] as const).map(d => (
            <span key={d} className={`text-[10px] px-2 py-1 rounded-full ${depth === d ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-500'}`}>{d}</span>
          ))}
        </div>

        {/* Challenge mode */}
        <button onClick={() => setChallengeMode(!challengeMode)} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] ${challengeMode ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
          <Flame className="h-3 w-3" /> {challengeMode ? 'Challenge ON' : 'Challenge'}
        </button>

        {/* Sensitivity flags */}
        {activeTemplate?.sensitivityFlags && activeTemplate.sensitivityFlags.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-yellow-500">
            <AlertTriangle className="h-3 w-3" /> Sensible
          </span>
        )}

        {/* Actions */}
        <button onClick={exportMarkdown} className="text-gray-400 hover:text-white" title="Export MD">
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Download className="h-4 w-4" />}
        </button>
        <div className="flex gap-1">
          {[
            { platform: 'twitter', icon: Twitter },
            { platform: 'linkedin', icon: Linkedin },
            { platform: 'email', icon: Mail },
          ].map(s => {
            const SIcon = s.icon
            return <button key={s.platform} onClick={() => shareUrl(s.platform)} className="p-1 text-gray-500 hover:text-white"><SIcon className="h-3.5 w-3.5" /></button>
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: `${activeAgent?.color}15` }}>
                  <AIcon className="h-4 w-4" style={{ color: activeAgent?.color }} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-200'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.depth && <p className="text-[10px] mt-2 opacity-50">Niveau: {msg.depth}</p>}
              </div>
            </div>
          ))}
          {streaming && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${activeAgent?.color}15` }}>
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: activeAgent?.color }} />
              </div>
              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1"><div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" /><div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:'150ms'}} /><div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:'300ms'}} /></div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input + Depth Advance */}
      <div className="px-6 pb-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {depth !== 'synthese' && messages.length > 0 && !streaming && (
            <button onClick={advanceDepth} className="w-full py-2 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm text-purple-400 hover:bg-purple-500/10 transition-colors flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              Passer au niveau : {depth === 'exploration' ? 'Approfondissement' : 'Synthèse'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Votre réflexion..."
              rows={1}
              className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none min-h-[44px] max-h-[120px]"
              onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px' }}
            />
            <button onClick={sendMessage} disabled={!input.trim() || streaming} className="h-11 w-11 rounded-xl bg-[#E50914] text-white disabled:opacity-30 flex items-center justify-center shrink-0">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-600 text-center">
            Opus + Extended Thinking · {depth} · {challengeMode ? '⚔️ Challenge Mode' : 'Discussion'} · 0% commission
          </p>
        </div>
      </div>
    </div>
  )
}
