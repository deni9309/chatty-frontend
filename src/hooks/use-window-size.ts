import { useEffect, useState } from 'react'
import { MOBILE_BREAKPOINT } from '../constants/app-constants'

interface WindowSize {
  width: number
  height: number
  isMobile: boolean
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < MOBILE_BREAKPOINT,
  }
}
