import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import Navbar from '../core/navbar'
import { usePath } from '../../hooks/use-path.hook'
import { isChatListVisible } from '../../lib/utils/routes.util'
import ChatListSidebar from '../chat/chat-list.sidebar'
import { cn } from '../../lib/utils/clsx'
import { useWindowSize } from '../../hooks/use-window-size'

const MainLayout: React.FC = () => {
  const { path } = usePath()
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const { isMobile } = useWindowSize()

  return (
    <div className="flex flex-col overflow-hidden h-screen w-full">
      <Navbar />
      {isChatListVisible(path) ? (
        isMobile ? (
          <>
            <div
              className={cn(
                'flex-grow overflow-y-auto h-full mb-0',
                path === '/games' && 'max-h-[calc(100vh-128px)]',
              )}
            >
              <Outlet />
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
              <button
                className="btn btn-block btn-primary"
                onClick={() => setDrawerOpen((prev) => !prev)}
              >
                <ArrowUpIcon className="w-5 h-5 mr-2" />
                Show Chats
              </button>
            </div>

            {/* Drawer */}
            <div
              className={cn(
                'fixed inset-0 z-40 transition-all duration-300 transform',
                isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
              )}
            >
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setDrawerOpen(false)}
              />
              <div className="absolute w-full h-full bottom-0 left-0 right-0 bg-base-100 max-h-[calc(100vh-72px)] overflow-y-auto">
                <ChatListSidebar handleDrawerOnClick={() => setDrawerOpen(false)} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-grow">
            <aside className="w-1/4 border-r border-base-300 overflow-y-auto h-[calc(100vh-72px)]">
              <ChatListSidebar />
            </aside>
            <div className="w-3/4 h-full overflow-y-auto max-h-[calc(100vh-72px)]">
              <Outlet />
            </div>
          </div>
        )
      ) : (
        <div className="flex h-full flex-grow overflow-y-auto p-4">
          <Outlet />
        </div>
      )}
    </div>
  )
}

export default MainLayout
