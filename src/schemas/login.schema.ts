import * as z from 'zod'

export const LoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  email: z.string().email('Provide a valid email address'),
})

export type LoginFormType = z.infer<typeof LoginSchema>
