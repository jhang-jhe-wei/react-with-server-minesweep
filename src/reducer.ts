import {
  generateRandMineMap,
  putFlagOrKeepDataMap,
  checkNoUncoveredCells,
  sweep
} from './functions';
import { GAME_STATUS, MAP_OBJECT } from './data/constants';

export interface ReducerStateProps {
  dataMap: number[];
  minesMap: boolean[];
  gameStatus: string;
  mapIndex: number;
  totalCellsCount: number;
  totalMinesCount: number;
  hasCreatedMine: boolean;
}

export interface ReducerActionProps {
  type: string;
  payload?: any;
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
}

export const initReducer = (mapIndex: number) => {
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
      return initReducer(action.payload.mapIndex);
    }
    case ReducerActions.SET_GAME_STATUS: {
      return {
        ...state,
        gameStatus: action.payload.gameStatus
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
          action.payload.avoidIndex
        ),
        hasCreatedMine: true
      };
    }
    case ReducerActions.PUT_FLAG_ON_CELL: {
      return {
        ...state,
        dataMap: putFlagOrKeepDataMap(dataMap, action.payload.index)
      };
    }
    case ReducerActions.SWEEP_CELL: {

      const targetIndex = action.payload.index;
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

      const gameWin = (nextDataMap: number[]) => ({
        ...state,
        dataMap: nextDataMap,
        gameStatus: GAME_STATUS.WIN
      })

      const continueGame = (nextDataMap: number[]) => ({
        ...state,
        dataMap: nextDataMap
      })

      if(checkHitMine()) return gameOver()
      const nextDataMap = sweep(targetIndex, dataMap, minesMap)
      if(isGameWin()) return gameWin(nextDataMap)
      return continueGame(nextDataMap)
    }
    default:
      throw Error('Unknown action: ' + action.type);
  }
}

export default Reducer;
