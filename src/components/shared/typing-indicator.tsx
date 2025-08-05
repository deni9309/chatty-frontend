import { useChatStore } from '../../store/use-chat.store'

const TypingIndicator = () => {
  const { typingUsers, selectedUser } = useChatStore()

  if (!selectedUser || !typingUsers.has(selectedUser._id)) return null

  return (
    <div className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-content">
      <div className="flex space-x-1">
        <div className="status status-neutral animate-bounce" />
        <div className="status status-neutral animate-bounce" />
        <div className="status status-neutral animate-bounce" />
      </div>

      <span>{selectedUser.fullName} is typing...</span>
    </div>
  )
}

export default TypingIndicator
