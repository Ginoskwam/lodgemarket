import { z } from 'zod'

export const organizationCreateSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})

export type OrganizationCreateInput = z.infer<typeof organizationCreateSchema>
