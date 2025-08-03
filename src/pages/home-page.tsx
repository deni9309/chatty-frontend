import ChatContainer from '../components/chat/chat.container'
import AnimateSquares from '../components/shared/animate-squares'
import { useAuthStore } from '../store/use-auth.store'
import { useChatStore } from '../store/use-chat.store'

const HomePage = () => {
  const { selectedUser } = useChatStore()
  const { userStatus, onlineUsers } = useAuthStore()

  console.log('onlineUsers', onlineUsers)
  console.log('userStatus', userStatus)
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
