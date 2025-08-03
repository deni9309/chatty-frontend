import {
  HomeIcon,
  LogOut,
  MenuIcon,
  MessageSquareIcon,
  Settings,
  User,
  UserIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../store/use-auth.store'
import ChattyLogo from '../shared/chatty-logo-component'
import { cn } from '../../lib/utils/clsx'

const Navbar = () => {
  const { authUser, logout } = useAuthStore()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
      toast.success('Logged out successfully')
    } catch (error) {
      
      console.error('Error logging out user', error)
      toast.error('Something went wrong')
    }
  }

  return (
    <header className="navbar shadow-sm border-b border-base-300 z-20 bg-base-100">
      <div className="navbar-start">
        {authUser && (
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <MenuIcon className="size-6" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow transition-all duration-300"
            >
              <li>
                <Link to="/home" onClick={(e) => e.currentTarget.blur()}>
                  <HomeIcon />
                  Home
                </Link>
              </li>
              <hr className="my-1 border-base-300" />
              <li>
                <Link to="#" onClick={(e) => e.currentTarget.blur()}>
                  <MessageSquareIcon />
                  Chats
                </Link>
              </li>
            </ul>
          </div>
        )}
        <Link
          to={authUser ? '/' : '/login'}
          className="btn btn-ghost max-sm:px-1 hover:bg-transparent"
        >
          <ChattyLogo showTitle className="text-primary size-8 max-sm:size-6" />
        </Link>
      </div>
      {authUser && (
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 [&_svg]:size-6">
            <li>
              <Link to="/home">
                <HomeIcon />
                Home
              </Link>
            </li>
            <li>
              <Link to="#">
                <MessageSquareIcon />
                Chats
              </Link>
            </li>
          </ul>
        </div>
      )}
      <div className="navbar-end sm:mr-3 [&_svg]:size-6">
        {authUser && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className={cn(
                'btn btn-ghost btn-circle transition-all duration-300',
                authUser.profilePic !== '' && 'avatar flex',
              )}
            >
              {authUser.profilePic !== '' ? (
                <img alt="User" src={authUser.profilePic} className="rounded-full" />
              ) : (
                <UserIcon />
              )}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content [&_svg]:size-5 bg-base-100 rounded-box z-1 mt-3 w-48 p-2 shadow"
            >
              <li>
                <Link to="/profile" onClick={(e) => e.currentTarget.blur()}>
                  <User />
                  Profile
                </Link>
              </li>
              <hr className="my-1 border-base-300" />
              <li>
                <p
                  onClick={(e) => {
                    e.currentTarget.blur()
                    handleLogout()
                  }}
                >
                  <LogOut />
                  Logout
                </p>
              </li>
            </ul>
          </div>
        )}
        <div className="menu menu-horizontal px-0 sm:px-1">
          <ul>
            <span className="tooltip tooltip-bottom" data-tip="Settings">
              <li className="flex items-center md:gap-1">
                <Link to="/settings">
                  <Settings />
                  <span className="hidden md:block">Settings</span>
                </Link>
              </li>
            </span>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Navbar
