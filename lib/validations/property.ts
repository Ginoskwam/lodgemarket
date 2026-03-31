import { z } from 'zod'

/** Statuts publication — plan produit §5. */
export const propertyStatusSchema = z.enum([
  'draft',
  'pending_review',
  'published',
  'rejected',
  'archived',
])

export type PropertyStatus = z.infer<typeof propertyStatusSchema>

/** Brouillon wizard vendeur — champs MVP à raffiner avec le schéma SQL. */
export const propertyDraftSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(10).max(20000),
  price: z.number().positive(),
  currency: z.string().length(3).default('EUR'),
  capacity: z.number().int().positive().optional(),
})

export type PropertyDraftInput = z.infer<typeof propertyDraftSchema>
