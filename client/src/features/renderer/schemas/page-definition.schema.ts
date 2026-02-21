import { z } from 'zod'
import { schemaFieldSchema } from './schema-field.schema'
import { layoutNodeSchema } from './layout-node.schema'

const pageMetaSchema = z.object({
  id: z.string(),
  route: z.string(),
  title: z.string(),
  version: z.number().optional(),
})

export const pageDefinitionSchema = z.object({
  meta: pageMetaSchema,
  schema: z.record(z.string(), schemaFieldSchema),
  layout: layoutNodeSchema,
  data: z.record(z.string(), z.unknown()),
})

export type ValidatedPageDefinition = z.infer<typeof pageDefinitionSchema>
