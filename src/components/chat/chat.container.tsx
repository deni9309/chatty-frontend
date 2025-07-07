import { useEffect } from 'react'
import { useChatStore } from '../../store/use-chat.store'
import NoChatMessagesContainer from './no-chat-messages.container'
import ChatHeaderContainer from './chat-header.container'
import MessageInput from '../shared/message-input'
import MessageSkeleton from '../skeletons/message-skeleton'

const ChatContainer = () => {
  const { selectedUser, messages, areMessagesLoading, getMessages } = useChatStore()

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser, getMessages])

  if (areMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto">
        <ChatHeaderContainer />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  if (messages?.length > 0) {
    return <NoChatMessagesContainer selectedUser={selectedUser} />
  }

  return (
    <div className="flex flex-col overflow-y-auto flex-1">
      <ChatHeaderContainer />
      <div className="px-4 py-2">
        <p>Messages...</p>
        <MessageInput />
      </div>
    </div>
  )
}

export default ChatContainer
