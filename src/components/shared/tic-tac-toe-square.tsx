import { cn } from '../../lib/utils/clsx'
import { Player } from '../../types/ticTacToe'

interface TicTacToeSquareProps {
  value: Player | null
  onClick: () => void
  disabled: boolean
  isWinningSquare: boolean
}

const TicTacToeSquare = ({ value, onClick, disabled, isWinningSquare }: TicTacToeSquareProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'tic-tac-toe-square',
        isWinningSquare ? 'bg-accent/10' : 'bg-primary/10 hover:bg-base-200/50',
      )}
    >
      <span
        className={cn(
          value === 'X' ? 'text-primary' : 'text-secondary',
          isWinningSquare && 'scale-110',
        )}
      >
        {value}
      </span>
    </button>
  )
}

export default TicTacToeSquare
