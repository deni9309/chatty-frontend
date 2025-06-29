import ChatContainer from '../components/chat-container'
import AnimateSquares from '../components/shared/animate-squares'
import { useChatStore } from '../store/use-chat.store'

const HomePage = () => {
  const { selectedUser } = useChatStore()
  return (
    <div className="w-full h-full">
      {selectedUser ? (
        <ChatContainer />
      ) : (
        <AnimateSquares title="CHATTY" subtitle="The best place to chat" />
      )}
    </div>
  )
}

export default HomePage
