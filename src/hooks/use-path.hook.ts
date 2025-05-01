import { useEffect, useState } from 'react'
import router from '../Routes'

const usePath = () => {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const unsubscribe = router.subscribe((state) => {
      setPath(state.location.pathname)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return { path }
}

export { usePath }
