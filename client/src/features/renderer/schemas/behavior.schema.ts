import { z } from 'zod'

export const behaviorRefSchema = z.object({
  preset: z.string(),
})
