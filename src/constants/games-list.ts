import TicTacToeGame from '../components/games/tic-tac-toe.game'
import { AvailableGames } from '../types/ticTacToe'

export const availableGames: AvailableGames[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic game of Tic Tac Toe',
    thumbnail: '/tic-tac-toe.svg',
    component: TicTacToeGame,
  },
]
