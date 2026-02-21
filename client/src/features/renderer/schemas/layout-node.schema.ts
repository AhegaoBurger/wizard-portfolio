import { z } from 'zod'
import { behaviorRefSchema } from './behavior.schema'

const responsiveHintsSchema = z.object({
  desktop: z.string().optional(),
  mobile: z.string().optional(),
})

export const layoutNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.string(),
    props: z.record(z.string(), z.unknown()).optional(),
    field: z.string().optional(),
    bind: z.string().optional(),
    children: z.array(layoutNodeSchema).optional(),
    itemLayout: layoutNodeSchema.optional(),
    behaviors: z.array(behaviorRefSchema).optional(),
    responsive: responsiveHintsSchema.optional(),
  })
)
