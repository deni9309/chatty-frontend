import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react'
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
import ChatMessage from './chat-message'
import { useWindowSize } from '../../hooks/use-window-size'

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
  const { isMobile } = useWindowSize()
  const authUser = useAuthStore((state) => state.authUser)

  const msgContainerRef = useRef<HTMLDivElement>(null)
  const firstUnreadRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const [isPaginating, setIsPaginating] = useState(false)
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | null>(null)
  const hasPerformedInitialScroll = useRef(false)

  // Intersection Observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.1 })

  const unreadMessageIds = useMemo(
    () => findUnreadMessageIds(messages),
    [messages, findUnreadMessageIds],
  )

  // --- EFFECT 1: Handle User Switching (Initial Load & Subscriptions) ---
  useEffect(() => {
    if (!selectedUser?._id) return
    hasPerformedInitialScroll.current = false
    const setupChat = async () => {
      resetMessages()
      try {
        await getMessages(selectedUser._id, 1)
      } catch (error) {
        const msg = handleApiError(error)
        toast.error(msg)
      }
    }

    setupChat()
    subscribeToMessages()
    subscribeToTyping()

    return () => {
      unsubscribeFromMessages()
      unsubscribeFromTyping()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser?._id]) // Runs ONLY when the user changes

  // --- EFFECT 2: Initial Scroll Logic --- runs after the initial messages are loaded for a new user.
  useEffect(() => {
    if (messages.length > 0 && !hasPerformedInitialScroll.current && msgContainerRef.current) {
      const timer = setTimeout(async () => {
        if (unreadMessageIds.length > 0 && firstUnreadRef.current) {
          firstUnreadRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          if (selectedUser?._id) {
            try {
              await markMessagesAsRead(selectedUser._id)
            } catch (error) {
              const msg = handleApiError(error)
              toast.error(msg)
            }
          }
        } else {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        hasPerformedInitialScroll.current = true
      }, 100)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length > 0 && messages[0]?._id]) // Runs when the first message of a conversation appears

  // --- EFFECT 3: Pagination Trigger ---
  useEffect(() => {
    const fetchMore = async () => {
      if (inView && hasMoreMessages && !areMessagesLoading && selectedUser?._id) {
        const container = msgContainerRef.current
        if (container) {
          setPrevScrollHeight(container.scrollHeight) // Store scroll height BEFORE fetching
          setIsPaginating(true)
          await loadMoreMessages(selectedUser._id)
        }
      }
    }
    fetchMore()
  }, [inView, hasMoreMessages, areMessagesLoading, selectedUser?._id, loadMoreMessages])

  // --- EFFECT 4: Preserve Scroll on Pagination --- useLayoutEffect runs after DOM mutations but before the browser paints.
  useLayoutEffect(() => {
    if (isPaginating && prevScrollHeight !== null && msgContainerRef.current) {
      const container = msgContainerRef.current
      container.scrollTop = container.scrollHeight - prevScrollHeight
      setPrevScrollHeight(null) // Reset for the next pagination
      setIsPaginating(false)
    }
  }, [messages, isPaginating, prevScrollHeight]) // Runs when messages are updated due to pagination

  // --- EFFECT 5: Auto-scroll for new incoming messages --- depends on the total number of messages
  useEffect(() => {
    if (isPaginating) return

    const container = msgContainerRef.current
    if (container) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 250
      if (isNearBottom) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [messages, isPaginating])

  const firstUnreadIndex =
    unreadMessageIds.length > 0 ? messages.findIndex((msg) => msg._id === unreadMessageIds[0]) : -1

  if (!selectedUser || !authUser) return null

  const msgContainerClass = cn(
    'flex-1 overflow-y-auto p-2 space-y-2',
    isMobile
      ? 'min-h-[calc(100dvh-270px)] max-h-[calc(100dvh-270px)]'
      : 'min-h-[calc(100dvh-225px)] max-h-[calc(100dvh-225px)]',
  )
  const bottomContainerClass = cn('w-full absolute', isMobile ? 'bottom-[50px]' : 'bottom-0')

  return (
    <div className="relative h-full flex flex-col flex-1">
      <ChatHeaderContainer />

      <div ref={msgContainerRef} className={msgContainerClass}>
        {hasMoreMessages && messages.length > 0 && (
          <div ref={loadMoreRef} className="flex justify-center py-2">
            {areMessagesLoading && <span className="loading loading-spinner loading-sm" />}
          </div>
        )}
        {areMessagesLoading && !isPaginating ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <NoChatMessagesContainer />
        ) : (
          messages.map((message, i) => (
            <ChatMessage
              key={`${message._id}-${i}`}
              ref={i === firstUnreadIndex ? firstUnreadRef : null}
              message={message}
              isOwnMessage={message.senderId === authUser._id}
              authUserProfilePic={authUser.profilePic}
              selectedUserProfilePic={selectedUser.profilePic}
              isUnread={unreadMessageIds.includes(message._id)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className={bottomContainerClass}>
        <TypingIndicator />
        <MessageInput />
      </div>
    </div>
  )
}

export default ChatContainer
