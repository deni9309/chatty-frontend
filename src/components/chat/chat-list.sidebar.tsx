import { useEffect, useState } from 'react'
import { TriangleAlert } from 'lucide-react'

import { useChatStore } from '../../store/use-chat.store'
import { AuthUser } from '../../types/authUser'
import { cn } from '../../lib/utils/clsx'
import { handleApiError } from '../../lib/utils/handle-api-errors'
import ChatListSkeleton from '../skeletons/chat-list-skeleton'
import UserAvatar from '../shared/user-avatar'
import { EnvelopeIcon } from '@heroicons/react/24/solid'
import { useAuthStore } from '../../store/use-auth.store'
import { useDebounce } from '../../hooks/use-debounce'
import toast from 'react-hot-toast'
import SearchInput from '../shared/search-input'
import PaginationControls from '../shared/pagination-controls'
import { useWindowSize } from '../../hooks/use-window-size'

interface ChatListSidebarProps {
  handleDrawerOnClick?: () => void
}

const ChatListSidebar = ({ handleDrawerOnClick }: ChatListSidebarProps) => {
  const { isMobile } = useWindowSize()
  const {
    users,
    selectedUser,
    setSelectedUser,
    areUsersLoading,
    searchUsers,
    changeUserPage,
    userPagination,
    unreadMessages,
    getUnreadMessages,
    onlineOnlyFilter,
    toggleOnlineOnlyFilter,
  } = useChatStore()
  const onlineUsers = useAuthStore((state) => state.onlineUsers)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  //  const [showOnlineUsersOnly, setShowOnlineUsersOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    const fetch = async () => {
      try {
        setErrorMessage(null)
        await searchUsers(debouncedSearchTerm)
      } catch (error) {
        const message = handleApiError(error)
        setErrorMessage(message)
      }
    }
    fetch()
  }, [debouncedSearchTerm, searchUsers])

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        await getUnreadMessages()
      } catch (error) {
        const message = handleApiError(error)
        toast.error(message)
      }
    }

    fetchUnread()
  }, [getUnreadMessages])

  function highlightUnreadMessages(user: AuthUser) {
    return unreadMessages.filter((message) => message.senderId === user._id)
  }

  const handleUserSelect = (user: AuthUser) => {
    if (selectedUser?._id === user._id) {
      setSelectedUser(null)
    } else {
      setSelectedUser(user)
    }
    handleDrawerOnClick?.()
  }

  if (errorMessage) {
    return (
      <div className="f-center h-full">
        <p className="alert border-error text-sm w-auto">
          <TriangleAlert size={20} />
          {errorMessage}
        </p>
      </div>
    )
  }

  // const filteredUsers = showOnlineUsersOnly
  //   ? users.filter((user) => onlineUsers.includes(user._id))
  //   : users

  return (
    <div className="p-4 flex flex-col items-stretch w-full h-full">
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex max-sm:flex-col max-sm:items-start lg:flex-col lg:items-start items-center gap-x-2 mt-2 mb-4">
        <h2 className="text-lg leading-5 xl:text-xl font-semibold mb-1 text-base-content">
          My contacts
        </h2>
        <div className="flex items-center bg-base-300 rounded-badge border border-base-300">
          <label className="label px-2 cursor-pointer bg-base-100 rounded-badge">
            <input
              type="checkbox"
              checked={onlineOnlyFilter}
              onChange={toggleOnlineOnlyFilter}
              className="checkbox-primary checkbox checkbox-sm me-1"
            />
            <span className="leading-4 text-primary font-semibold label-text">
              Show online only
            </span>
          </label>
          <span className="text-xs text-base-content/75 font-semibold px-2 hidden max-md:flex lg:flex">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      {areUsersLoading ? (
        <ChatListSkeleton />
      ) : users.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-base-content/70">No users found</p>
        </div>
      ) : (
        <div
          className={cn(
            'flex-col flex flex-1 justify-between overflow-y-auto',
            isMobile && 'max-h-[calc(100vh-290px)]',
          )}
        >
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className={cn(
                'chat-list-user',
                selectedUser?._id === user._id
                  ? 'chat-list-user__selected'
                  : 'chat-list-user__default',
              )}
            >
              <div
                className={cn(
                  highlightUnreadMessages(user).length > 0
                    ? 'badge badge-lg badge-ghost'
                    : 'hidden',
                )}
              >
                <div className="indicator">
                  <EnvelopeIcon className="size-5" />
                  <div className="chat-list-user__indicator">
                    {highlightUnreadMessages(user).length}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-2 w-full">
                <UserAvatar user={user} onlineIndicator />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.fullName}</p>
                  <p className="text-sm opacity-70 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          ))}

          <PaginationControls
            currentPage={userPagination.currentPage}
            totalPages={userPagination.totalPages}
            onPageChange={changeUserPage}
          />
        </div>
      )}
    </div>
  )
}

export default ChatListSidebar
