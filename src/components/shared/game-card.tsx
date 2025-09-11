import { ArrowRight } from 'lucide-react'

interface GameCardProps {
  title: string
  description: string
  onClick: () => void
}

const GameCard = ({ title, description, onClick }: GameCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group flex w-full transform flex-col items-start gap-2 rounded-box bg-base-100 p-6 text-left shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <h3 className="text-xl font-bold text-primary capitalize">{title}</h3>
      <hr className="h-0.5 w-full bg-primary/75 " />
      <p>{description}</p>
      <div className="f-center gap-2 my-4 font-semibold text-primary transition-colors group-hover:text-accent">
        <p>Play Now</p>
        <ArrowRight className="size-6" />
      </div>
    </button>
  )
}

export default GameCard
