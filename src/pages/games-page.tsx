import TicTacToeGame from '../components/games/tic-tac-toe.game'

const GamesPage = () => (
  <div className="flex flex-col w-full h-full items-center mx-auto space-y-4">
    <h1 className="text-2xl font-bold my-4 uppercase">Games</h1>
    <TicTacToeGame />
  </div>
)
export default GamesPage
