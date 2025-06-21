import { useEffect, useState } from 'react'
import ChattyLogo from '../components/shared/chatty-logo-component'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { UpdateProfileFormType, UpdateProfileSchema } from '../schemas/update-profile.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInputText from '../components/shared/form-input-text'
import { AtSign, LucideUser } from 'lucide-react'
import { useAuthStore } from '../store/use-auth.store'
import toast from 'react-hot-toast'
import { handleApiError } from '../lib/utils/handle-api-errors'
import ProfileImageUpload from '../components/shared/profile-image-upload'
import { PROFILE_IMAGE_DELETED } from '../constants/profile-image-delete.constant'

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
  const [errorText, setErrorText] = useState<string | null>(null)
  const form = useForm<z.infer<typeof UpdateProfileSchema>>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      email: '',
      fullName: '',
      profilePic: null,
    },
  })

  useEffect(() => {
    if (authUser) {
      form.reset({
        email: authUser.email || '',
        fullName: authUser.fullName || '',
        profilePic: null,
      })
    }
  }, [authUser, form])

  async function onSubmit(values: UpdateProfileFormType) {
    try {
      await updateProfile(values)
      toast.success('Profile updated successfully')
    } catch (error) {
      const message = handleApiError(error)
      toast.error(message)
      setErrorText(message)
    }
  }

  return (
    <div className="flex flex-col w-full items-center justify-center mx-auto sm:bg-base-content/10 sm:p-10 sm:rounded-2xl max-w-xl">
      <div className="text-center my-8">
        <ChattyLogo className="text-primary size-10" />
        <p>Update your profile information here</p>
      </div>

      {errorText && <p className="text-red-500 my-4">{errorText}</p>}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="space-y-4 w-full max-w-md"
      >
        <div className="f-center">
          <ProfileImageUpload
            initialImageUrl={authUser?.profilePic || ''}
            onFileSelect={(file) => form.setValue('profilePic', file)}
            onDeleteImage={() => form.setValue('profilePic', PROFILE_IMAGE_DELETED)}
          />
        </div>
        <FormInputText
          name="email"
          control={form.control}
          label="Email"
          showLabel
          type="email"
          icon={AtSign}
        />
        <FormInputText
          name="fullName"
          control={form.control}
          label="Full Name"
          showLabel
          icon={LucideUser}
        />

        <button disabled={isUpdatingProfile} className="btn btn-primary">
          Update Profile
        </button>
      </form>
    </div>
  )
}

export default ProfilePage
