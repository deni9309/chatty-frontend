import { useChatStore } from '../../store/use-chat.store'

const TypingIndicator = () => {
  const { typingUsers, selectedUser } = useChatStore()

  if (!selectedUser || !typingUsers.has(selectedUser._id)) return null

  return (
    <div className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-content">
      <div className="flex space-x-1">
        <div className="size-2 rounded-full bg-neutral animate-bounce" />
        <div className="size-2 rounded-full bg-neutral animate-bounce delay-75" />
        <div className="size-2 rounded-full bg-neutral animate-bounce delay-100" />
      </div>

      <span>{selectedUser.fullName} is typing...</span>
    </div>
  )
}

export default TypingIndicator
