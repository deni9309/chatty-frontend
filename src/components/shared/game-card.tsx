import { ArrowRight } from 'lucide-react'

interface GameCardProps {
  title: string
  description: string
  thumbnail: string
  onClick: () => void
}

const GameCard = ({ title, description, thumbnail, onClick }: GameCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group flex w-full transform flex-col items-start gap-2 rounded-box bg-primary/50 p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <h3 className="text-xl font-bold text-primary-content capitalize">{title}</h3>
      <hr className="h-0.5 rounded-box w-full bg-primary-content border-0" />
      <img alt={title} src={thumbnail} className="mt-2 size-36 mx-auto" />
      <p className="text-primary-content text-sm">{description}</p>

      <div className="f-center gap-2 mt-2 font-semibold text-primary-content transition-colors group-hover:text-accent">
        <p>Play Now</p>
        <ArrowRight className="size-6" />
      </div>
    </button>
  )
}

export default GameCard
