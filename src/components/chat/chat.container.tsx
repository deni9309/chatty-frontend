import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useChatStore } from '../../store/use-chat.store'
import NoChatMessagesContainer from './no-chat-messages.container'
import ChatHeaderContainer from './chat-header.container'
import MessageInput from '../shared/message-input'
import MessageSkeleton from '../skeletons/message-skeleton'
import { cn } from '../../lib/utils/clsx'
import { useAuthStore } from '../../store/use-auth.store'
import toast from 'react-hot-toast'
import { handleApiError } from '../../lib/utils/handle-api-errors'
import TypingIndicator from '../shared/typing-indicator'
import { useInView } from 'react-intersection-observer'
import { formatTimestamp } from '../../lib/utils/date-format.util'
import { Message } from '../../types/message'

interface ChatMessageProps {
  message: Message
  isOwnMessage: boolean
  authUserProfilePic: string
  selectedUserProfilePic: string
  isUnread: boolean
}

const ChatMessage = memo(
  ({
    message,
    isOwnMessage,
    authUserProfilePic,
    selectedUserProfilePic,
    isUnread,
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
        <div className={cn('chat-bubble', isUnread && 'chat-bubble-primary')}>
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
    hasMoreMessages,
    getMessages,
    loadMoreMessages,
    resetMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
    findUnreadMessageIds,
    markMessagesAsRead,
  } = useChatStore()
  const authUser = useAuthStore((state) => state.authUser)
  const msgEndRef = useRef<HTMLDivElement>(null)
  const msgContainerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '50px',
  })

  const unreadMessageIds = useMemo(
    () => findUnreadMessageIds(messages),
    [messages, findUnreadMessageIds],
  )
  const isMobile = useMemo(() => window.innerWidth < 900, [])
  const msgContainerClass = useMemo(
    () =>
      cn(
        'flex-1 overflow-y-auto p-2 space-y-2',
        isMobile
          ? 'min-h-[calc(100dvh-270px)] max-h-[calc(100dvh-270px)]'
          : 'min-h-[calc(100dvh-225px)] max-h-[calc(100dvh-225px)]',
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
      resetMessages()

      await getMessages(selectedUser._id, 1)
    } catch (error) {
      const msg = handleApiError(error)
      toast.error(msg)
    }
  }, [selectedUser?._id, getMessages, resetMessages])

  useEffect(() => {
    if (inView && hasMoreMessages && !areMessagesLoading && selectedUser?._id) {
      loadMoreMessages(selectedUser._id)
    }
  }, [inView, hasMoreMessages, areMessagesLoading, selectedUser?._id, loadMoreMessages])

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
    let timeout1: NodeJS.Timeout
    let timeout2: NodeJS.Timeout
    const markRead = async () => {
      if (selectedUser && unreadMessageIds.length > 0) {
        const firstUnreadMsg = document.querySelector(`[data-message-id="${unreadMessageIds[0]}"]`)
        timeout1 = setTimeout(() => firstUnreadMsg?.scrollIntoView({ behavior: 'smooth' }), 100)

        await markMessagesAsRead(selectedUser._id)
      } else if (msgEndRef.current && messages.length > 0) {
        timeout2 = setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
    markRead()

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
    }
  }, [selectedUser, unreadMessageIds, markMessagesAsRead, messages.length])

  useEffect(() => {
    if (msgContainerRef.current && messages.length > 20) {
      const container = msgContainerRef.current
      const prevHeight = container.scrollHeight

      requestAnimationFrame(() => {
        const newHeight = container.scrollHeight
        container.scrollTop = newHeight - prevHeight
      })
    }
  }, [messages.length])

  if (!selectedUser || !authUser) return null

  return (
    <div className="relative h-full flex flex-col flex-1">
      <ChatHeaderContainer />

      <div ref={msgContainerRef} className={msgContainerClass}>
        {hasMoreMessages && messages.length > 0 && (
          <div ref={loadMoreRef} className="flex justify-center py-2">
            {areMessagesLoading && <span className="loading loading-spinner loading-sm" />}
          </div>
        )}
        {areMessagesLoading ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <NoChatMessagesContainer />
        ) : (
          messages.map((message, i) => (
            <ChatMessage
              key={`${message._id}-${i}`}
              message={message}
              isOwnMessage={message.senderId === authUser._id}
              authUserProfilePic={authUser.profilePic}
              selectedUserProfilePic={selectedUser.profilePic}
              isUnread={unreadMessageIds.includes(message._id)}
            />
          ))
        )}
        <div ref={msgEndRef} />
      </div>
      <div className={bottomContainerClass}>
        <TypingIndicator />
        <MessageInput />
      </div>
    </div>
  )
}

export default ChatContainer
