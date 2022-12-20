import {
  generateRandMineMap,
  putFlagOrKeepDataMap,
  checkNoUncoveredCells,
  sweep
} from './functions';
import { GAME_STATUS, MAP_OBJECT, GameStatusValue } from './data/constants';

export type DataMapType = (number|null)[]
export interface ReducerStateProps {
  dataMap: DataMapType;
  minesMap: boolean[];
  gameStatus: GameStatusValue;
  mapIndex: number;
  totalCellsCount: number;
  totalMinesCount: number;
  hasCreatedMine: boolean;
}

const NUMBER_OF_CELLS_IN_A_ROW = [9, 16, 24]
const MINE_LIST = [10, 40, 99]

export const ReducerActions = {
  SET_MAP_INDEX: 'action$set_map_index',
  SET_GAME_STATUS: 'action$set_game_status',
  RESET_HAS_CREATED_MINES: 'action$reset_has_create_mines',
  GENERATE_MINES: 'action$generate_mines',
  PUT_FLAG_ON_CELL: 'action$put_flag_on_cell',
  SWEEP_CELL: 'action$sweep_cell',
  NEW_GAME: 'action$new_game'
} as const

export type ReducerActionProps =
    | { type: typeof ReducerActions.SET_MAP_INDEX; payload: number }
    | { type: typeof ReducerActions.SET_GAME_STATUS; payload: GameStatusValue }
    | { type: typeof ReducerActions.RESET_HAS_CREATED_MINES }
    | { type: typeof ReducerActions.GENERATE_MINES; payload: number }
    | { type: typeof ReducerActions.PUT_FLAG_ON_CELL; payload: number }
    | { type: typeof ReducerActions.SWEEP_CELL; payload: number }
    | { type: typeof ReducerActions.NEW_GAME }

export const initReducer = (mapIndex: number): ReducerStateProps => {
  const totalCellsCount = Math.pow(NUMBER_OF_CELLS_IN_A_ROW[mapIndex], 2)
  const totalMinesCount = MINE_LIST[mapIndex]

  return {
    dataMap: Array(totalCellsCount).fill(null),
    minesMap: Array(totalMinesCount).fill(false),
    gameStatus: GAME_STATUS.IN_PROGRESS,
    mapIndex: mapIndex,
    totalCellsCount,
    totalMinesCount,
    hasCreatedMine: false
  }
}

const Reducer = (state: ReducerStateProps, action: ReducerActionProps) => {
  const {
    mapIndex,
    minesMap,
    dataMap,
    totalCellsCount,
    totalMinesCount
  } = state

  switch (action.type) {
    case ReducerActions.NEW_GAME: {
      return initReducer(mapIndex);
    }
    case ReducerActions.SET_MAP_INDEX: {
      return initReducer(action.payload);
    }
    case ReducerActions.SET_GAME_STATUS: {
      return {
        ...state,
        gameStatus: action.payload
      };
    }
    case ReducerActions.RESET_HAS_CREATED_MINES: {
      return {
        ...state,
        hasCreatedMine: false
      };
    }
    case ReducerActions.GENERATE_MINES: {
      return {
        ...state,
        minesMap: generateRandMineMap(
          state.totalCellsCount,
          state.totalMinesCount,
          action.payload
        ),
        hasCreatedMine: true
      };
    }
    case ReducerActions.PUT_FLAG_ON_CELL: {
      return {
        ...state,
        dataMap: putFlagOrKeepDataMap(dataMap, action.payload)
      };
    }
    case ReducerActions.SWEEP_CELL: {

      const targetIndex = action.payload;
      const checkHitMine = () => minesMap[targetIndex];
      const isGameWin = () => checkNoUncoveredCells(nextDataMap, totalCellsCount, totalMinesCount);
      const gameOver = () => {
        const tempDataMap = dataMap.map((cell, index) => {
          if(index === targetIndex) return MAP_OBJECT.HIT_MINE;
          return minesMap[index]? MAP_OBJECT.MINE: cell
        })
        return {
          ...state,
          dataMap: tempDataMap,
          gameStatus: GAME_STATUS.LOSE
        }
      }

      const gameWin = (nextDataMap: DataMapType) => ({
        ...state,
        dataMap: nextDataMap,
        gameStatus: GAME_STATUS.WIN
      })

      const continueGame = (nextDataMap: DataMapType) => ({
        ...state,
        dataMap: nextDataMap
      })

      if(checkHitMine()) return gameOver()
      const nextDataMap = sweep(targetIndex, dataMap, minesMap)
      if(isGameWin()) return gameWin(nextDataMap)
      return continueGame(nextDataMap)
    }
    default:
      return state
  }
}

export default Reducer;
