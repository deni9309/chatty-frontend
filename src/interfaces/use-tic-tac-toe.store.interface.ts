import { Board, Player, Winner } from '../types/ticTacToe'

export interface GameStats {
  draws: number
  wins: number
  losses: number
}

export interface TicTacToeState {
  board: Board
  currentPlayer: Player
  winner: Winner
  winningCombination: number[] | null
  isGameOver: boolean
  humanPlayer: Player
  computerPlayer: Player
  stats: GameStats

  // Actions
  startGame: () => void

  /**
   * Handles a move by the human player and triggers the computer's response.
   * @param index The board index (0-8) where the player is making a move.
   */
  makeMove: (index: number) => void
  resetStats: () => void
}

export interface CheckWinnerResult {
  winner: Winner
  combination: number[] | null
}