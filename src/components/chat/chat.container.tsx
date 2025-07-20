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

const ChatContainer = () => {
  const selectedUser = useChatStore((state) => state.selectedUser)
  const messages = useChatStore((state) => state.messages)
  const areMessagesLoading = useChatStore((state) => state.areMessagesLoading)
  const getMessages = useChatStore((state) => state.getMessages)

  const { authUser } = useAuthStore()
  const inputRef = useRef<HTMLInputElement>(null)

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
  }, [fetchMessages])

  if (areMessagesLoading || !authUser || !selectedUser) {
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
          window.innerWidth < 900 ? 'max-h-[calc(100dvh-270px)]' : 'max-h-[calc(100dvh-220px)]',
        )}
      >
        {messages.length === 0 ? (
          <NoChatMessagesContainer />
        ) : (
          messages.map((m) => {
            console.log('authUser.profilePic', authUser.profilePic)
            return (
              <div
                key={m._id}
                className={cn('chat', m.senderId === authUser._id ? 'chat-end' : 'chat-start')}
              >
                <div className="chat-image avatar">
                  <div className="size-10 bg-base-300 rounded-full border">
                    <img
                      src={
                        m.senderId === authUser._id
                          ? authUser.profilePic !== ''
                            ? authUser.profilePic
                            : '/user.svg'
                          : selectedUser.profilePic !== ''
                          ? selectedUser.profilePic
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
            )
          })
        )}
      </div>
      <div
        className={cn('w-full absolute', window.innerWidth < 900 ? 'bottom-[50px]' : 'bottom-0')}
      >
        <MessageInput />
      </div>
    </div>
  )
}

export default ChatContainer
