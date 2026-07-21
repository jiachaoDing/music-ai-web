import type { SongMode } from '../types/song'

export const ECHO_COSTS = {
  song: 2,
  meme: 2,
  emotion: 2,
  photo: 2,
  foryou: 2,
  radio: 1,
  fortune: 1,
  remix: 1,
  album: 5,
} satisfies Record<SongMode, number>

export function getCreateCost(mode: SongMode) {
  return ECHO_COSTS[mode]
}

export function formatEchoCost(cost: number) {
  return `${cost} 🔊`
}
