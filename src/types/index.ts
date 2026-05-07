export interface Project {
  title: string
  description: string
  tags: string[]
  imageUrl: string
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

export interface Experience {
  role: string
  company: string
  period: string
  logoUrl: string
}

export interface AboutData {
  bio: string
  secondParagraph: string
  photoUrl: string
}

export interface Skill {
  name: string
  category: 'frontend' | 'backend' | 'styling'
  featured: boolean
}
