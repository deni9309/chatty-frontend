import * as z from 'zod'

export const UpdateProfileSchema = z.object({
  email: z.string().email('Provide a valid email address').optional(),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters')
    .optional(),
  profilePic: z.any().optional(),
})

export type UpdateProfileFormType = z.infer<typeof UpdateProfileSchema>
