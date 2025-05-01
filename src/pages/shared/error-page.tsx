import router from '../../Routes'

interface ErrorPageProps {
  errorMessage?: string | undefined
}

const ErrorPage = ({ errorMessage = undefined }: ErrorPageProps) => {
  return (
    <div className="flex flex-col items-center gap-4 overflow-y-auto">
      <h5 className="text-2xl font-bold">{errorMessage || 'Oops, Something went wrong...'}</h5>

      <img src="/error.svg" alt="Error" />
      <button onClick={() => router.navigate('/home')}>Go Back to Home</button>
    </div>
  )
}

export default ErrorPage
