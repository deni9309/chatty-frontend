import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
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
import { Message } from '../../types/message'

interface ChatMessageProps {
  message: Message
  isOwnMessage: boolean
  authUserProfilePic: string
  selectedUserProfilePic: string
  isUnread: boolean
  messageEndRef: React.RefObject<HTMLDivElement | null>
}

const ChatMessage = memo(
  ({
    message,
    isOwnMessage,
    authUserProfilePic,
    selectedUserProfilePic,
    isUnread,
    messageEndRef,
  }: ChatMessageProps) => {
    const profilePic = isOwnMessage
      ? authUserProfilePic !== ''
        ? authUserProfilePic
        : '/user.svg'
      : selectedUserProfilePic !== ''
      ? selectedUserProfilePic
      : '/user.svg'

    return (
      <div
        data-message-id={message._id}
        className={cn('chat', isOwnMessage ? 'chat-end' : 'chat-start')}
        ref={!isUnread ? messageEndRef : null}
      >
        <div className="chat-image avatar">
          <div className="size-10 bg-base-300 rounded-full border">
            <img
              src={profilePic}
              className="size-full rounded-full p-0.5 object-cover"
              alt="Profile Image"
            />
          </div>
        </div>
        <div className="chat-header mb-1">
          <time className="text-xs opacity-50">{formatTimestamp(message.createdAt)}</time>
        </div>
        <div className="chat-bubble">
          {message.text !== '' && <p className="mb-1">{message.text}</p>}
          {message.image !== '' && (
            <img
              className="lg:chat-image w-full rounded sm:max-w-sm max-sm:max-w-xs"
              src={message.image}
              alt="Attached Image"
            />
          )}
        </div>
      </div>
    )
  },
)

ChatMessage.displayName = 'ChatMessage'

const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    areMessagesLoading,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
    findUnreadMessageIds,
    markMessagesAsRead,
  } = useChatStore()
  const authUser = useAuthStore((state) => state.authUser)
  const messageEndRef = useRef<HTMLInputElement>(null)

  const unreadMessageIds = useMemo(
    () => findUnreadMessageIds(messages),
    [messages, findUnreadMessageIds],
  )
  const isMobile = useMemo(() => window.innerWidth < 900, [])
  const messageContainerClass = useMemo(
    () =>
      cn(
        'flex-1 overflow-y-auto h-full p-2 space-y-2',
        isMobile ? 'max-h-[calc(100dvh-270px)]' : 'max-h-[calc(100dvh-220px)]',
      ),
    [isMobile],
  )
  const bottomContainerClass = useMemo(
    () => cn('w-full absolute', isMobile ? 'bottom-[50px]' : 'bottom-0'),
    [isMobile],
  )

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
    subscribeToTyping()

    return () => {
      unsubscribeFromMessages()
      unsubscribeFromTyping()
    }
  }, [
    fetchMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
  ])

  useEffect(() => {
    const markRead = async () => {
      if (selectedUser && unreadMessageIds.length > 0) {
        const firstUnreadMessageEl = document.querySelector(
          `[data-message-id="${unreadMessageIds[0]}"]`,
        )
        firstUnreadMessageEl?.scrollIntoView({ behavior: 'smooth' })
        await markMessagesAsRead(selectedUser._id)
      }
    }
    markRead()

    if (messageEndRef.current && messages.length > 0 && unreadMessageIds.length === 0) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, selectedUser, unreadMessageIds, markMessagesAsRead])

  if (!selectedUser || !authUser) return null

  return (
    <div className="relative h-full flex flex-col flex-1">
      <ChatHeaderContainer />

      <div className={messageContainerClass}>
        {areMessagesLoading ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <NoChatMessagesContainer />
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message._id}
              message={message}
              isOwnMessage={message.senderId === authUser._id}
              authUserProfilePic={authUser.profilePic}
              selectedUserProfilePic={selectedUser.profilePic}
              isUnread={unreadMessageIds.includes(message._id)}
              messageEndRef={messageEndRef}
            />
          ))
        )}
      </div>
      <div className={bottomContainerClass}>
        <TypingIndicator />
        <MessageInput />
      </div>
    </div>
  )
}

export default ChatContainer
