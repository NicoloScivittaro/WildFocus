export interface NavItem {
  label: string
  to: string
}

export interface Service {
  slug: string
  title: string
  outcomeStatement: string
  problemSolved: string
  includes: string[]
  examples: string[]
  ctaLabel: string
}

export interface PackagePlan {
  slug: string
  name: string
  description: string
  highlights: string[]
  priceLabel: 'Preventivo personalizzato'
}

export type ProjectCategory = 'video-editing' | 'fotografia' | 'social' | 'commercial' | 'eventi' | 'brand'

export interface ProjectTestimonial {
  quote: string
  author: string
  role: string
}

export interface ProjectBeforeAfter {
  before: string
  after: string
  note: string
}

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  coverImage?: string
  coverVideo?: string
  summary: string
  serviceProvided: string
  clientGoal: string
  result: string
  testimonial?: ProjectTestimonial
  beforeAfter?: ProjectBeforeAfter
}

export interface TeamSocial {
  platform: string
  url: string
}

export interface TeamMemberData {
  name: string
  role: string
  bio: string
  skills: string[]
  photo?: string
  socials?: TeamSocial[]
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  company?: string
}

export interface FaqItem {
  question: string
  answer: string
}
