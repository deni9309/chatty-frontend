import { memo, forwardRef } from 'react'

import { cn } from '../../lib/utils/clsx'
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
  forwardRef<HTMLDivElement, ChatMessageProps>(
    ({ message, isOwnMessage, authUserProfilePic, selectedUserProfilePic, isUnread }, ref) => {
      const profilePic = isOwnMessage
        ? authUserProfilePic !== ''
          ? authUserProfilePic
          : '/user.svg'
        : selectedUserProfilePic !== ''
        ? selectedUserProfilePic
        : '/user.svg'

      return (
        <div
          ref={ref}
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
  ),
)

ChatMessage.displayName = 'ChatMessage'

export default ChatMessage
