import { useEffect, useState } from 'react'
import { TriangleAlert } from 'lucide-react'

import { useChatStore } from '../../store/use-chat.store'
import { AuthUser } from '../../types/authUser'
import { cn } from '../../lib/utils/clsx'
import { handleApiError } from '../../lib/utils/handle-api-errors'
import ChatListSkeleton from '../skeletons/chat-list-skeleton'
import UserAvatar from '../shared/user-avatar'

interface ChatListSidebarProps {
  handleDrawerOnClick?: () => void
}

const ChatListSidebar = ({ handleDrawerOnClick }: ChatListSidebarProps) => {
  const { users, selectedUser, areUsersLoading, getUsers, setSelectedUser } = useChatStore()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setErrorMessage(null)
        await getUsers()
      } catch (error) {
        const message = handleApiError(error)
        setErrorMessage(message)
      }
    }
    fetchUsers()
  }, [getUsers])

  const handleUserSelect = (user: AuthUser) => {
    if (selectedUser?._id === user._id) {
      setSelectedUser(null)
    } else {
      setSelectedUser(user)
    }
    handleDrawerOnClick?.()
  }

  if (areUsersLoading) {
    return <ChatListSkeleton />
  }

  if (errorMessage) {
    return (
      <div className="f-center h-full">
        <p className="alert border-error text-sm w-auto">
          <TriangleAlert size={20} />
          {errorMessage}
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col items-stretch w-full h-full">
      <h2 className="text-lg font-semibold mb-4 text-base-content">Chats</h2>
      {users.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-base-content/70">No users found</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className={cn(
                'p-3 rounded-lg cursor-pointer transition-all duration-200',
                selectedUser?._id === user._id
                  ? 'bg-primary text-primary-content'
                  : 'hover:bg-base-300 bg-base-100',
              )}
            >
              <div className="flex items-center space-x-3">
                <UserAvatar user={user} onlineIndicator />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.fullName}</p>
                  <p className="text-sm opacity-70 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChatListSidebar
