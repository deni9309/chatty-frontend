import { cn } from '../../lib/utils/clsx'

const Loader = ({ sm = false }: { sm?: boolean }) => {
  return (
    <p className="text-neutral/70 flex justify-center gap-3 items-center">
      <span className={cn('animate-ping duration-500', sm ? 'text-sm' : 'text-xl')}>○</span>
      <span className={cn('animate-ping duration-700', sm ? 'text-lg' : 'text-3xl')}>○</span>
      <span className={cn('animate-ping duration-1000', sm ? 'text-2xl' : 'text-5xl')}>○</span>
    </p>
  )
}

export default Loader
