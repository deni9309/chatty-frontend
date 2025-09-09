import { cn } from '../../lib/utils/clsx'
import { Player } from '../../types/ticTacToe'

interface TicTacToeSquareProps {
  value: Player | null
  onClick: () => void
  disabled: boolean
}

const TicTacToeSquare = ({ value, onClick, disabled }: TicTacToeSquareProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="f-center size-20 sm:size-24 border border-base-300 text-5xl font-bold transition-colors disabled:cursor-not-allowed"
    >
      <span className={cn(value === 'X' ? 'text-primary' : 'text-secondary')}>{value}</span>
    </button>
  )
}

export default TicTacToeSquare
