import ChatBubbleLeftEllipsisIcon from '@heroicons/react/24/solid/ChatBubbleLeftEllipsisIcon'
import { HomeIcon } from 'lucide-react'

const ChattyHomeIcon = () => {
  return (
    <div className="relative size-6">
      <HomeIcon />
      <ChatBubbleLeftEllipsisIcon className="absolute -top-0.5 left-3 !size-4" />
    </div>
  )
}

export default ChattyHomeIcon
