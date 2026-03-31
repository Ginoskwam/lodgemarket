import { z } from 'zod'

/** Profil app — à aligner avec la table profiles + migration rôles. */
export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(120).optional(),
  phone: z.string().max(32).optional(),
  avatarUrl: z.string().url().optional().nullable(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

export const userRoleSchema = z.enum(['buyer', 'seller', 'agency', 'admin'])

export type UserRole = z.infer<typeof userRoleSchema>
