import { Board, Winner } from '../../types/ticTacToe'

export const initialBoard = (): Board => Array(9).fill(null)

export const checkWinner = (board: Board): Winner => {
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
      return board[a] // We have a winner
    }
  }

  // Check for a draw (if all squares are filled and no winner)
  if (board.every((square) => square !== null)) {
    return 'draw'
  }

  return null // No winner yet, game continues
}
