import { create } from 'zustand'
import { TicTacToeState } from '../interfaces/use-tic-tac-toe.store.interface'
import { checkWinner, initialBoard } from '../lib/utils/tic-tac-toe.utils'

export const useTicTacToeStore = create<TicTacToeState>((set, get) => ({
  board: initialBoard(),
  currentPlayer: 'X',
  winner: null,
  isGameOver: false,
  humanPlayer: 'X', // Human is always 'X'
  computerPlayer: 'O',
  stats: { draws: 0, wins: 0, losses: 0 },

  startGame: () => {
    set({ board: initialBoard(), currentPlayer: 'X', isGameOver: false, winner: null })
  },
  resetStats: () => {
    set({ stats: { draws: 0, wins: 0, losses: 0 } })
  },
  makeMove: (index: number) => {
    const { board, computerPlayer, currentPlayer, isGameOver, humanPlayer } = get()

    // Prevent moves if game is over, square is taken, or it's not the human's turn
    if (isGameOver || board[index] || currentPlayer !== humanPlayer) {
      return
    }

    // Human's move
    const newBoard = [...board]
    newBoard[index] = humanPlayer
    set({ board: newBoard, currentPlayer: computerPlayer })

    // Check for winner after human move
    const gameWinner = checkWinner(newBoard)

    if (gameWinner) {
      set((state) => ({
        winner: gameWinner,
        isGameOver: true,
        stats: {
          ...state.stats,
          wins: gameWinner === humanPlayer ? state.stats.wins + 1 : state.stats.wins,
          losses: gameWinner === computerPlayer ? state.stats.losses + 1 : state.stats.losses,
          draws: gameWinner === 'draw' ? state.stats.draws + 1 : state.stats.draws,
        },
      }))
      return // Game over, no computer move needed
    }

    // Trigger computer's move (with a delay for better UX)
    setTimeout(() => {
      const { board: currentBoard, computerPlayer: cp } = get()

      // Find all empty squares
      const availableMoves = currentBoard
        .map((square, i) => (square === null ? i : null))
        .filter((i): i is number => i !== null)

      if (availableMoves.length === 0) return // Safeguard, should be caught by draw condition

      // Simple AI: pick a random available spot
      const computerMoveIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)]
      const boardAfterComputerMove = [...currentBoard]
      boardAfterComputerMove[computerMoveIndex] = cp

      // Check for winner after computer move
      const finalWinner = checkWinner(boardAfterComputerMove)
      set((state) => ({
        board: boardAfterComputerMove,
        winner: finalWinner,
        isGameOver: !!finalWinner, // Coerce null to false, 'X'/'O'/'draw' to true
        currentPlayer: humanPlayer,
        stats: finalWinner
          ? {
              ...state.stats,
              wins: finalWinner === humanPlayer ? state.stats.wins + 1 : state.stats.wins,
              losses: finalWinner === computerPlayer ? state.stats.losses + 1 : state.stats.losses,
              draws: finalWinner === 'draw' ? state.stats.draws + 1 : state.stats.draws,
            }
          : state.stats,
      }))
    }, 500)
  },
}))
