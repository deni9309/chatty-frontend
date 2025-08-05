import { useCallback, useEffect, useRef } from 'react'
import { useChatStore } from '../../store/use-chat.store'
import NoChatMessagesContainer from './no-chat-messages.container'
import ChatHeaderContainer from './chat-header.container'
import MessageInput from '../shared/message-input'
import MessageSkeleton from '../skeletons/message-skeleton'
import { cn } from '../../lib/utils/clsx'
import { useAuthStore } from '../../store/use-auth.store'
import { formatTimestamp } from '../../lib/utils/date-format.util'
import toast from 'react-hot-toast'
import { handleApiError } from '../../lib/utils/handle-api-errors'
import TypingIndicator from '../shared/typing-indicator'

const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    areMessagesLoading,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore()

  const authUser = useAuthStore((state) => state.authUser)
  const messageEndRef = useRef<HTMLInputElement>(null)

  const fetchMessages = useCallback(async () => {
    if (!selectedUser?._id) return

    try {
      await getMessages(selectedUser._id)
    } catch (error) {
      const msg = handleApiError(error)
      toast.error(msg)
    }
  }, [selectedUser?._id, getMessages])

  useEffect(() => {
    fetchMessages()

    subscribeToMessages()

    return () => {
      unsubscribeFromMessages()
    }
  }, [fetchMessages, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="relative h-full flex flex-col flex-1">
      <ChatHeaderContainer />

      <div
        className={cn(
          'flex-1 overflow-y-auto h-full p-2 space-y-2',
          window.innerWidth < 900 ? 'max-h-[calc(100dvh-270px)]' : 'max-h-[calc(100dvh-220px)]',
        )}
      >
        {areMessagesLoading ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <NoChatMessagesContainer />
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={cn('chat', m.senderId === authUser?._id ? 'chat-end' : 'chat-start')}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 bg-base-300 rounded-full border">
                  <img
                    key={m._id}
                    src={
                      m.senderId === authUser?._id
                        ? authUser?.profilePic !== ''
                          ? authUser?.profilePic
                          : '/user.svg'
                        : selectedUser?.profilePic !== ''
                        ? selectedUser?.profilePic
                        : '/user.svg'
                    }
                    className="size-full rounded-full p-0.5 object-cover"
                    alt="Profile Image"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50">{formatTimestamp(m.createdAt)}</time>
              </div>
              <div className="chat-bubble">
                {m.text !== '' && <p className="mb-1">{m.text}</p>}
                {m.image !== '' && (
                  <img
                    className="lg:chat-image w-full rounded sm:max-w-sm max-sm:max-w-xs"
                    src={m.image}
                    alt="Attached Image"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div
        className={cn('w-full absolute', window.innerWidth < 900 ? 'bottom-[50px]' : 'bottom-0')}
      >
        <TypingIndicator />
        <MessageInput />
      </div>
    </div>
  )
}

export default ChatContainer
