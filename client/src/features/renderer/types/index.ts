// === Schema Layer ===
export type FieldType = 'string' | 'number' | 'date' | 'image' | 'url' | 'boolean' | 'object' | 'array'

export interface SchemaField {
  type: FieldType
  label?: string
  required?: boolean
  items?: SchemaField       // for arrays
  fields?: Record<string, SchemaField> // for objects
}

// === Layout Layer ===
export interface LayoutNode {
  type: string              // Registry key: 'window', 'grid', 'text', 'list', etc.
  props?: Record<string, unknown>
  field?: string            // Dot-path data binding: 'profile.name'
  bind?: string             // Dot-path for container binding: 'projects'
  children?: LayoutNode[]
  itemLayout?: LayoutNode   // For list/repeater components
  behaviors?: BehaviorRef[]
  responsive?: ResponsiveHints
}

export interface BehaviorRef {
  preset: string            // Key into preset registry
}

export interface ResponsiveHints {
  desktop?: string          // Layout strategy: 'grid-2col', 'grid-3col', 'flex-row'
  mobile?: string           // Layout strategy: 'stack', 'tabs', 'accordion'
}

// === Page Definition (unified) ===
export interface PageMeta {
  id: string
  route: string
  title: string
  version?: number
}

export interface PageDefinition {
  meta: PageMeta
  schema: Record<string, SchemaField>
  layout: LayoutNode
  data: Record<string, unknown>
}

// === Component Registry ===
export interface RendererComponentProps {
  node: LayoutNode
  data: unknown
  children?: React.ReactNode
}

export interface ComponentRegistryEntry {
  component: React.ComponentType<RendererComponentProps>
}
