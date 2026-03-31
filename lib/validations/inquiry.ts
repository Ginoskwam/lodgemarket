import { z } from 'zod'

export const inquiryCreateSchema = z.object({
  propertyId: z.string().uuid(),
  message: z.string().min(10).max(5000),
})

export type InquiryCreateInput = z.infer<typeof inquiryCreateSchema>

export const visitRequestSchema = z.object({
  propertyId: z.string().uuid(),
  message: z.string().min(10).max(5000).optional(),
  preferredSlots: z.string().max(2000).optional(),
})

export type VisitRequestInput = z.infer<typeof visitRequestSchema>
