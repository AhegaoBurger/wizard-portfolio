// Static JSON imports — bundler always includes these, works reliably on Vercel
import homePageDef from '../../../content/pages/home.json'
import grimoirePageDef from '../../../content/pages/grimoire.json'
import spellsPageDef from '../../../content/pages/spells.json'
import potionsPageDef from '../../../content/pages/potions.json'
import trashPageDef from '../../../content/pages/trash.json'

interface PageDefinition {
  meta: { id: string; route: string; title: string }
  schema: Record<string, unknown>
  layout: Record<string, unknown>
  data: Record<string, unknown>
}

interface PageSummary {
  id: string
  route: string
  title: string
  version: number
  updated_at: string
}

const pages: PageDefinition[] = [
  homePageDef,
  grimoirePageDef,
  spellsPageDef,
  potionsPageDef,
  trashPageDef,
] as PageDefinition[]

export function listPages(): PageSummary[] {
  return pages
    .map(p => ({
      id: p.meta.id,
      route: p.meta.route,
      title: p.meta.title,
      version: 1,
      updated_at: new Date().toISOString(),
    }))
    .sort((a, b) => a.route.localeCompare(b.route))
}

export function getPageById(id: string): PageDefinition | null {
  return pages.find(p => p.meta.id === id) ?? null
}

export function getPageByRoute(route: string): PageDefinition | null {
  return pages.find(p => p.meta.route === route) ?? null
}
