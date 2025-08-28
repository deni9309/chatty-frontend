const ChatListSkeleton = () => {
  const skeletonContacts = Array(4).fill(null)

  return (
    <aside className="flex flex-col transition-all duration-200 w-full h-full">
      <div className="overflow-y-auto lg:px-3 max-lg:px-1">
        {skeletonContacts.map((_, i) => (
          <div key={i} className="w-full p-3 flex items-center md:gap-3 max-md:gap-1">
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>
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
