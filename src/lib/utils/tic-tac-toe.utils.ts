import { ClassNameValue } from 'tailwind-merge'
import { CheckWinnerResult } from '../../interfaces/use-tic-tac-toe.store.interface'
import { Board } from '../../types/ticTacToe'

export const initialBoard = (): Board => Array(9).fill(null)

export const checkWinner = (board: Board): CheckWinnerResult => {
  const winningCombinations = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (const combination of winningCombinations) {
    const [a, b, c] = combination

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combination }
    }
  }

  // Check for a draw (if all squares are filled and no winner)
  if (board.every((square) => square !== null)) {
    return { winner: 'draw', combination: null }
  }

  return { winner: null, combination: null } // No winner yet, game continues
}

/**
 * Helper function to get the CSS for the strike line
 * @param combination
 * @returns tailwind classes as a string or an empty string
 */
export const getStrikeLineClass = (combination: number[]): string | ClassNameValue => {
  const [a, b, c] = combination
  // Horizontal
  if (a === 0 && b === 1 && c === 2) return 'h-1.5 w-full top-[16.66%]'
  if (a === 3 && b === 4 && c === 5) return 'h-1.5 w-full top-1/2 -translate-y-1/2'
  if (a === 6 && b === 7 && c === 8) return 'h-1.5 w-full top-[83.33%] -translate-y-1/2'
  // Vertical
  if (a === 0 && b === 3 && c === 6) return 'w-1.5 h-full left-[16.66%] -translate-x-1/2'
  if (a === 1 && b === 4 && c === 7) return 'w-1.5 h-full left-1/2 -translate-x-1/2'
  if (a === 2 && b === 5 && c === 8) return 'w-1.5 h-full left-[83.33%] -translate-x-1/2'
  // Diagonal
  if (a === 0 && b === 4 && c === 8)
    return 'h-1.5 w-[125%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45'
  if (a === 2 && b === 4 && c === 6)
    return 'h-1.5 w-[125%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45'

  return ''
}
