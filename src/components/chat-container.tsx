import { useEffect } from 'react'
import { useChatStore } from '../store/use-chat.store'
import Loader from './shared/loader'
import NoChatMessagesContainer from './no-chat-messages-container'

const ChatContainer = () => {
  const { selectedUser, messages, areMessagesLoading, getMessages } = useChatStore()

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser, getMessages])

  if (areMessagesLoading) {
    return (
      <div className="f-center h-full">
        <Loader sm />
      </div>
    )
  }

  return messages.length === 0 ? (
    <div className='flex flex-col overflow-y-auto flex-1'>Chat Container</div>
  ) : (
    <NoChatMessagesContainer selectedUser={selectedUser} />
  )
}

export default ChatContainer
