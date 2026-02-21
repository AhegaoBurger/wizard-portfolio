// Engine
export { PageRenderer } from './engine/page-renderer'
export { NodeRenderer } from './engine/node-renderer'
export { DataProvider, useDataContext, resolveField } from './engine/data-context'
export { BehaviorWrapper } from './engine/behavior-wrapper'

// Registry
export { register, getComponent, getRegisteredTypes } from './registry/component-registry'
export { registerDefaults } from './registry/register-defaults'
export { behaviorPresets, getBehaviorPreset } from './registry/behavior-presets'

// Schemas
export { pageDefinitionSchema } from './schemas/page-definition.schema'
export { layoutNodeSchema } from './schemas/layout-node.schema'
export { schemaFieldSchema } from './schemas/schema-field.schema'
export { behaviorRefSchema } from './schemas/behavior.schema'

// Types
export type {
  PageDefinition,
  PageMeta,
  LayoutNode,
  SchemaField,
  FieldType,
  BehaviorRef,
  ResponsiveHints,
  RendererComponentProps,
  ComponentRegistryEntry,
} from './types'
