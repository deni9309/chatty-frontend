import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { AtSign, KeyRound } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

import { useAuthStore } from '../store/use-auth.store'
import { LoginFormType, LoginSchema } from '../schemas/login.schema'
import { loginFormDefaultValues } from '../constants/form-default-values'
import ChattyLogo from '../components/shared/chatty-logo-component'
import FormInputText from '../components/shared/form-input-text'
import { handleApiError } from '../lib/utils/handle-api-errors'
import { useChatStore } from '../store/use-chat.store'

const LoginPage = () => {
  const { isLoggingIn, login } = useAuthStore()
  const setSelectedUser = useChatStore((state) => state.setSelectedUser)

  const [errorText, setErrorText] = useState<string | null>(null)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: loginFormDefaultValues,
  })

  async function onSubmit(values: LoginFormType) {
    try {
      setSelectedUser(null)
      await login(values)
      toast.success('Welcome back!')
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
        <h1>Log in to your account</h1>
        <p>We are glad to have you back.</p>
      </div>

      {errorText && <p className="text-red-500 my-4">{errorText}</p>}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
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

        <button disabled={isLoggingIn} className="btn btn-primary text-primary-content">
          Login
        </button>
      </form>
      <div className="flex w-full max-w-md text-sm gap-1 my-2">
        <span>Don&apos;t have an account?</span>
        <Link className="link link-primary" to="/register">
          Register
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
