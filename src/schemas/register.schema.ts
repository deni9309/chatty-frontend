import * as z from 'zod'

export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be at most 100 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    email: z.string().email('Provide a valid email address'),
  })
  .refine(
    (data) => {
      const PassRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^_/&*])(?=.{6,})')
      return PassRegex.test(data.password)
    },
    { message: 'Password must be strong', path: ['password'] },
  )

export type RegisterFormType = z.infer<typeof RegisterSchema>
