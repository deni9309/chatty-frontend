import { useEffect } from 'react'
import { useChatStore } from '../../store/use-chat.store'
import Loader from '../shared/loader'
import NoChatMessagesContainer from './no-chat-messages.container'
import ChatHeaderContainer from './chat-header.container'

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

  if (messages?.length === 0) {
    return <NoChatMessagesContainer selectedUser={selectedUser} />
  }

  return (
    <div className="flex flex-col overflow-y-auto flex-1">
      <ChatHeaderContainer />
    </div>
  )
}

export default ChatContainer
