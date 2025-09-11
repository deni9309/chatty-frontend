import { useTicTacToeStore } from '../../store/use-tic-tac-toe.store'
import TicTacToeSquare from '../shared/tic-tac-toe-square'

const TicTacToeGame = () => {
  const { board, currentPlayer, startGame, makeMove, stats, winner, isGameOver } =
    useTicTacToeStore()

  const getStatusMessage = () => {
    if (winner) {
      if (winner === 'draw') return <p>It's a draw!</p>

      return winner === 'X' ? <p>You win! 🎉</p> : <p>Computer wins! 🤖</p>
    }

    return (
      <p className="leading-4">
        Your turn.
        <br />
        <span className="font-normal text-xs text-base-content/80">
          (Click on a square to make a move.)
        </span>
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md gap-4 rounded-box bg-base-200 p-6 shadow text-base-content">
      <h2 className="text-xl font-bold">Tic-Tac-Toe vs. Computer</h2>

      {/* Game Status Display */}
      <div className="font-semibold text-center h-8">{getStatusMessage()}</div>

      {/* Game Board */}
      <div className="grid grid-cols-3 bg-primary/10 rounded-box">
        {board.map((square, index) => (
          <TicTacToeSquare
            key={index}
            value={square}
            onClick={() => makeMove(index)}
            // Disable button if game is over, square is filled, or it's computer's turn
            disabled={isGameOver || !!square || currentPlayer !== 'X'}
          />
        ))}
      </div>

      {/* Game Controls and Stats */}
      <div className="flex flex-col gap-4">
        <div className="text-sm text-base-content/80 flex gap-x-3">
          <p>Wins: {stats.wins}</p>
          <p>Losses: {stats.losses}</p>
          <p>Draws: {stats.draws}</p>
        </div>
        <button onClick={startGame} className="btn btn-primary btn-sm">
          {isGameOver ? 'Play Again' : 'Restart Game'}
        </button>
      </div>
    </div>
  )
}

export default TicTacToeGame
