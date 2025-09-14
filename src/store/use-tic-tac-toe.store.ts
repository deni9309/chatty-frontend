import { create } from 'zustand'
import { TicTacToeState } from '../interfaces/use-tic-tac-toe.store.interface'
import { checkWinner, initialBoard } from '../lib/utils/tic-tac-toe.utils'

export const useTicTacToeStore = create<TicTacToeState>((set, get) => ({
  board: initialBoard(),
  currentPlayer: 'X',
  winner: null,
  winningCombination: null,
  isGameOver: false,
  humanPlayer: 'X', // Human is always 'X'
  computerPlayer: 'O',
  stats: { draws: 0, wins: 0, losses: 0 },

  startGame: () => {
    set({
      board: initialBoard(),
      currentPlayer: 'X',
      isGameOver: false,
      winner: null,
      winningCombination: null,
    })
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

    // Check for winner and update state
    const gameResult = checkWinner(newBoard)

    if (gameResult.winner) {
      set((state) => ({
        board: newBoard,
        winner: gameResult.winner,
        isGameOver: true,
        winningCombination: gameResult.combination,
        stats: {
          ...state.stats,
          wins: gameResult.winner === humanPlayer ? state.stats.wins + 1 : state.stats.wins,
          losses:
            gameResult.winner === computerPlayer ? state.stats.losses + 1 : state.stats.losses,
          draws: gameResult.winner === 'draw' ? state.stats.draws + 1 : state.stats.draws,
        },
      }))
      return // Game over, no computer move needed
    }

    set({ board: newBoard, currentPlayer: computerPlayer })

    // Computer's move (with a delay for better UX)
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
      const finalResult = checkWinner(boardAfterComputerMove)
      set((state) => ({
        board: boardAfterComputerMove,
        winner: finalResult.winner,
        isGameOver: !!finalResult.winner, // Coerce null to false, 'X'/'O'/'draw' to true
        winningCombination: finalResult.combination,
        currentPlayer: humanPlayer,
        stats: finalResult.winner
          ? {
              ...state.stats,
              wins: finalResult.winner === humanPlayer ? state.stats.wins + 1 : state.stats.wins,
              losses:
                finalResult.winner === computerPlayer ? state.stats.losses + 1 : state.stats.losses,
              draws: finalResult.winner === 'draw' ? state.stats.draws + 1 : state.stats.draws,
            }
          : state.stats,
      }))
    }, 500)
  },
}))
