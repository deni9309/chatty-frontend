import { JSX } from 'react'

export type Player = 'X' | 'O'
export type Board = (Player | null)[]
export type Winner = Player | 'draw' | null


export type AvailableGames = {
  id: string
  title: string
  description: string
  thumbnail: string
  component: () => JSX.Element
}