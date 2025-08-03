import { cn } from '../../lib/utils/clsx'
import { useAuthStore } from '../../store/use-auth.store'
import { AuthUser } from '../../types/authUser'
import { ClassNameValue } from 'tailwind-merge'

interface UserAvatarProps {
  user: AuthUser
  onlineIndicator?: boolean
  classNames?: ClassNameValue
}

const UserAvatar = ({ user, classNames, onlineIndicator = false }: UserAvatarProps) => {
  const { onlineUsers } = useAuthStore()

  return (
    <div
      className={cn(
        'avatar',
        onlineIndicator
          ? onlineUsers.includes(user._id)
            ? 'online avatar-online'
            : 'offline avatar-offline'
          : '',
      )}
    >
      <div className={cn('size-10 rounded-full', classNames ?? '')}>
        {user.profilePic ? (
          <img src={user.profilePic} alt={user.fullName} className="size-full object-cover" />
        ) : (
          <div className="bg-accent text-accent-content f-center size-full text-sm font-semibold">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserAvatar
