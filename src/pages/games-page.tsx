import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { availableGames } from '../constants/games-list'
import GameCard from '../components/shared/game-card'
import { X } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const GamesPage = () => {
  // State to track which game dialog is open. `null` means no dialog is open.
  const [openGameId, setOpenGameId] = useState<string | null>(null)

  return (
    <div className="flex flex-col w-full h-full items-center mx-auto space-y-4">
      <h1 className="text-2xl font-bold my-4 uppercase">Games</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {availableGames.map((game) => (
          <Dialog.Root
            key={game.id}
            open={openGameId === game.id}
            onOpenChange={(isOpen) => setOpenGameId(isOpen ? game.id : null)}
          >
            <Dialog.Trigger asChild>
              <GameCard
                title={game.title}
                description={game.description}
                thumbnail={game.thumbnail}
                onClick={() => setOpenGameId(game.id)}
              />
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay fixed inset-0 z-40 bg-black/60" />
              <Dialog.Content
                aria-describedby={undefined}
                className="dialog-content w-11/12 max-w-md fixed left-1/2 top-1/2 z-50"
              >
                <VisuallyHidden asChild>
                  <Dialog.Title>Edit profile</Dialog.Title>
                </VisuallyHidden>
                {game.component()}
                <Dialog.Close asChild>
                  <button
                    className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        ))}
      </div>
    </div>
  )
}

export default GamesPage
