import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import '../../index.css'
import Navbar from '../core/navbar'
import GeometricPattern from '../shared/geometric-pattern'

const AuthLayout: React.FC = () => {
  const captureRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const capture = captureRef.current
    const overlay = overlayRef.current

    if (!capture || !overlay) return

    const handleMouseMove = (event: MouseEvent) => {
      const x = event.pageX - capture.offsetLeft
      const y = event.pageY - capture.offsetTop

      overlay.style.setProperty('--glow-x', `${x}px`)
      overlay.style.setProperty('--glow-y', `${y}px`)
      overlay.style.setProperty('--glow-opacity', '1')
      overlay.style.setProperty('--glow-color', '#121212')
    }

    const handleMouseLeave = () => {
      overlay.style.setProperty('--glow-opacity', '0')
    }

    capture.addEventListener('mousemove', handleMouseMove)
    capture.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      capture.removeEventListener('mousemove', handleMouseMove)
      capture.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar />
      <div className="flex max-lg:flex-col max-sm:px-1 my-auto w-full">
        <div className="flex-1 max-lg:flex py-4 my-auto max-h-[100dvh] overflow-y-auto">
          <Outlet />
        </div>

        <div
          ref={captureRef}
          className="relative glow-capture max-lg:hidden w-auto flex-1 max-w-[40%]"
        >
          <GeometricPattern className="w-full h-[calc(100vh-72px)] border-l-4 border-accent/50" />
          <div ref={overlayRef} className="glow-overlay bg-primary/50" />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
