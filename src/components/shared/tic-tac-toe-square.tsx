import { cn } from '../../lib/utils/clsx'
import { useThemeStore } from '../../store/use-theme.store'
import { Player } from '../../types/ticTacToe'

interface TicTacToeSquareProps {
  value: Player | null
  onClick: () => void
  disabled: boolean
}

const TicTacToeSquare = ({ value, onClick, disabled }: TicTacToeSquareProps) => {
  const { theme } = useThemeStore()

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'f-center size-20 sm:size-24 border border-base-300 text-5xl font-bold transition-colors disabled:cursor-not-allowed',
        theme === 'nord' && 'bg-accent',
      )}
    >
      <span className={cn(value === 'X' ? 'text-primary' : 'text-secondary')}>{value}</span>
    </button>
  )
}

export default TicTacToeSquare
