import { RouterProvider } from 'react-router-dom'
import router from './Routes'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div className='bg-base-100'>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}

export default App
