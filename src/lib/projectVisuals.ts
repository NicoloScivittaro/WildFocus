import { Film, Camera, Share2, Megaphone, PartyPopper, Sparkles } from 'lucide-react'
import type { ProjectCategory } from '@/types/content'

export const categoryLabels: Record<ProjectCategory, string> = {
  'video-editing': 'Video Editing',
  fotografia: 'Fotografia',
  social: 'Social Content',
  commercial: 'Commercial',
  eventi: 'Eventi',
  brand: 'Brand',
}

export const categoryIcons: Record<ProjectCategory, typeof Film> = {
  'video-editing': Film,
  fotografia: Camera,
  social: Share2,
  commercial: Megaphone,
  eventi: PartyPopper,
  brand: Sparkles,
}

// Each category gets its own barely-there dark tint — enough to break the
// "every cover looks identical" monotony while keeping the premium,
// cinematic dark treatment consistent across the whole grid.
export const categoryGradient: Record<ProjectCategory, string> = {
  'video-editing': 'from-zinc-900 via-zinc-950 to-black',
  fotografia: 'from-stone-900 via-neutral-950 to-black',
  social: 'from-sky-950 via-slate-950 to-black',
  commercial: 'from-amber-950 via-zinc-950 to-black',
  eventi: 'from-violet-950 via-zinc-950 to-black',
  brand: 'from-emerald-950 via-zinc-950 to-black',
}
