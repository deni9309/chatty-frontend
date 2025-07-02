import { Users } from 'lucide-react'

const ChatListSkeleton = () => {
  const skeletonContacts = Array(8).fill(null)

  return (
    <aside className="flex flex-col transition-all duration-200 w-full h-full">
      <div className="border-b border-base-300 w-full px-3 py-5">
        <div className="flex items-center px-4 gap-2">
          <Users className="size-6" />
          <span className="font-medium">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full p-3">
        {skeletonContacts.map((_, i) => (
          <div key={i} className="w-full p-3 flex items-center gap-3">
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default ChatListSkeleton
