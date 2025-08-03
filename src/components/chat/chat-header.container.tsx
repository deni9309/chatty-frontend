import { X } from 'lucide-react'
import { useAuthStore } from '../../store/use-auth.store'
import { useChatStore } from '../../store/use-chat.store'

import UserAvatar from '../shared/user-avatar'

const ChatHeaderContainer = () => {
  const { selectedUser, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()

  if (!selectedUser) return null

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <UserAvatar user={selectedUser} />
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  )
}

export default ChatHeaderContainer
