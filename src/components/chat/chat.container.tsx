import { useEffect } from 'react'
import { useChatStore } from '../../store/use-chat.store'
import NoChatMessagesContainer from './no-chat-messages.container'
import ChatHeaderContainer from './chat-header.container'
import MessageInput from '../shared/message-input'
import MessageSkeleton from '../skeletons/message-skeleton'
import { cn } from '../../lib/utils/clsx'

const ChatContainer = () => {
  const { selectedUser, messages, areMessagesLoading, getMessages } = useChatStore()

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser, getMessages])

  if (areMessagesLoading) {
    return (
      <div className="flex flex-1 overflow-y-auto flex-col">
        <ChatHeaderContainer />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className="relative h-full flex flex-col flex-1">
      <ChatHeaderContainer />

      <div
        className={cn(
          'flex-1 overflow-y-auto h-full p-2 space-y-2',
          window.innerWidth < 900 ? 'max-h-[calc(100dvh-280px)]' : 'max-h-[calc(100dvh-220px)]',
        )}
      >
        {messages.length === 0 ? (
          <NoChatMessagesContainer selectedUser={selectedUser} />
        ) : (
          messages.map((m) => (
            <div key={m._id}>
              {m.text !== '' && <p className="chat-bubble">{m.text}</p>}
              {m.image !== '' && <img className="chat-image" src={m.image} />}
            </div>
          ))
        )}
      </div>
      <div className="w-full absolute bottom-0">
        <MessageInput />
      </div>
    </div>
  )
}

export default ChatContainer
