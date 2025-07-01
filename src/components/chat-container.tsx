import { useEffect } from 'react'
import { useChatStore } from '../store/use-chat.store'
import Loader from './shared/loader'
import { MessageCircleOffIcon } from 'lucide-react'

const ChatContainer = () => {
  const { selectedUser, messages, areMessagesLoading, getMessages } = useChatStore()

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser, getMessages])

  if (areMessagesLoading) {
    return (
      <div className="f-center h-full">
        <Loader sm />
      </div>
    )
  }

  return messages.length > 0 ? (
    <div>Chat Container</div>
  ) : (
    <div className="f-center h-full relative overflow-hidden bg-gradient-to-br from-base-100 to-base-200">
      <div className="absolute inset-0 f-center">
        <div className="relative">
          <MessageCircleOffIcon
            className="w-full absolute text-accent/10 blur-sm max-sm:max-w-sm max-w-lg"
            size={600}
            strokeWidth={0.3}
          />
          <MessageCircleOffIcon
            className="w-full text-accent/10 max-sm:max-w-sm max-w-lg"
            size={600}
            strokeWidth={0.5}
          />
        </div>
      </div>
      {/* Content overlay */}
      <div className="relative z-20 flex flex-col items-center gap-6 max-w-md mx-auto px-6">
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-base-content/80">Start Chatting</h3>
          <p className="text-base-content/60">No messages yet. Begin your conversation!</p>
        </div>

        {selectedUser && (
          <div className="p-6 rounded-box bg-base-100/50 backdrop-blur-sm drop-shadow border border-base-content/10 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full">
                  {selectedUser.profilePic ? (
                    <img src={selectedUser.profilePic} alt={selectedUser.fullName} />
                  ) : (
                    <div className="bg-accent text-accent-content f-center w-full h-full text-sm font-semibold">
                      {selectedUser.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <span className="font-semibold text-base-content">{selectedUser.fullName}</span>
            </div>
            <p className="text-sm text-base-content/60">Send your first message to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatContainer
