export const GAME_STATUS = {
  WIN: 'You Win!',
  LOSE: 'You Lose!',
  IN_PROGRESS: 'in progress'
} as const
type GameStatusKeys = keyof typeof GAME_STATUS
export type GameStatusValue = typeof GAME_STATUS[GameStatusKeys]

export const MAP_OBJECT = {
  COVERED: null,
  NO_BOMB_ARROUND: 0,
  FLAG: 9,
  MINE: 10,
  HIT_MINE: 11
}
