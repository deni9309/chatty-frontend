import { RouterProvider } from 'react-router-dom'
import router from './Routes'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}

export default App
