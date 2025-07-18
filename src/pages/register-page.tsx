import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AtSign, KeyRound, LucideUser } from 'lucide-react'
import toast from 'react-hot-toast'

import { RegisterFormType, RegisterSchema } from '../schemas/register.schema'
import { registerFormDefaultValues } from '../constants/form-default-values'
import FormInputText from '../components/shared/form-input-text'
import ChattyLogo from '../components/shared/chatty-logo-component'
import { useAuthStore } from '../store/use-auth.store'
import { handleApiError } from '../lib/utils/handle-api-errors'

const RegisterPage = () => {
  const { isSigningUp, register } = useAuthStore()
  const [errorText, setErrorText] = useState<string | null>(null)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: registerFormDefaultValues,
  })

  async function onSubmit(values: RegisterFormType) {
    try {
      await register(values)
      toast.success('Welcome to Chatty!')
      navigate('/')
    } catch (error) {
      const message = handleApiError(error)
      setErrorText(message)
    }
  }

  return (
    <div className="flex flex-col w-full items-center mx-auto max-sm:mx-0.5">
      <div className="text-center my-8">
        <ChattyLogo className="text-primary size-10" />
        <h1>Create an account</h1>
        <p>Get started with your free Chatty account</p>
      </div>

      {errorText && <p className="text-red-500 my-4">{errorText}</p>}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
        <FormInputText name="fullName" control={form.control} label="Full Name" icon={LucideUser} />
        <FormInputText
          name="email"
          control={form.control}
          label="Email"
          type="email"
          icon={AtSign}
        />
        <FormInputText
          name="password"
          control={form.control}
          label="Password"
          type="password"
          icon={KeyRound}
        />

        <button disabled={isSigningUp} className="btn btn-primary text-primary-content">
          Register
        </button>
      </form>

      <div className="flex w-full max-w-md text-sm gap-1 my-2">
        <span>Already have an account?</span>
        <Link className="link link-primary" to="/login">
          Login
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage
