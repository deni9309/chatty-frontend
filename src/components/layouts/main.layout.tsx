import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import Navbar from '../core/navbar'
import { usePath } from '../../hooks/use-path.hook'
import { isChatListVisible } from '../../lib/utils/routes.util'
import ChatList from '../chat-list'
import { cn } from '../../lib/utils/clsx'

const MainLayout: React.FC = () => {
  const { path } = usePath()

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 900

  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      {isChatListVisible(path) ? (
        isMobile ? (
          <>
            <div className="flex-grow overflow-hidden mb-0">
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
                <ChatList handleDrawerOnClick={() => setDrawerOpen(false)} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-grow">
            <aside className="w-1/4 border-r border-base-300">
              <ChatList />
            </aside>
            <div className="w-3/4 overflow-hidden">
              <Outlet />
            </div>
          </div>
        )
      ) : (
        <div className="flex-grow overflow-y-auto p-4">
          <Outlet />
        </div>
      )}
    </div>
  )
}

export default MainLayout
