import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import Navbar from '../core/navbar'
//import ChatList from '../chat-list/chat-list'
import { usePath } from '../../hooks/use-path.hook'

const MainLayout: React.FC = () => {
  const { path } = usePath()
  const showChatList = path !== '/profile'
 // const isHomePage = path === '/'

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
      {showChatList ? (
        isMobile ? (
          <>
            <div className="flex-grow overflow-hidden mb-16">
              <Outlet />
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-50">
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
              className={`fixed inset-0 z-40 transition-transform transform ${
                isDrawerOpen ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setDrawerOpen(false)}
              ></div>
              <div className="absolute bottom-0 left-0 right-0 bg-base-100 p-4 rounded-t-lg shadow-lg max-h-3/4 overflow-y-auto">
                {/* <ChatList
                  handleDrawerOnClick={() => {
                    isMobile && setDrawerOpen(false)
                  }}
                /> */}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-grow">
            <div className="w-1/3 border-r border-base-300">
              {/* <ChatList /> */}
            </div>
            <div className="w-2/3 overflow-hidden">
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
