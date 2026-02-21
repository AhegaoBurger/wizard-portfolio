export interface Profile {
  name: string
  title: string
  tagline?: string
  location: string
  email: string
  avatar?: {
    type: string
    animation: string
  }
}
