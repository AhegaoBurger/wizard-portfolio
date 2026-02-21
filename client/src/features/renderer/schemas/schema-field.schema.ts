import { z } from 'zod'

const fieldTypeSchema = z.enum(['string', 'number', 'date', 'image', 'url', 'boolean', 'object', 'array'])

export const schemaFieldSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: fieldTypeSchema,
    label: z.string().optional(),
    required: z.boolean().optional(),
    items: schemaFieldSchema.optional(),
    fields: z.record(z.string(), schemaFieldSchema).optional(),
  })
)
