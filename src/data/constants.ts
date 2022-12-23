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
export const NUMBER_OF_CELLS_IN_A_ROW = [9, 16, 24]
export const MINE_LIST = [10, 40, 99]
