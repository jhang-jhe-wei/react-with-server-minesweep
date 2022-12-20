import { generateRandMineMap, indexToCoord, getAdjacentCoordinates, coordToIndex, getAdjacentMinesCount } from './functions';
import { GAME_STATUS } from './data/constants';
import {
  generateRandMineMap,
  indexToCoord,
  getAdjacentCoordinates,
  coordToIndex,
  getAdjacentMinesCount,
  putFlagOrKeepDataMap,
} from './functions';
import { GAME_STATUS, MAP_OBJECT } from './data/constants';

interface ReducerState {
  dataMap: number[];
  minesMap: boolean[];
  gameStatus: string;
  mapIndex: number;
  totalCellsCount: number;
  totalMinesCount: number;
  hasCreatedMine: boolean;
}

export interface ReducerAction {
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

const Reducer = (state: ReducerState, action: ReducerAction) => {
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

      const targetIndex = action.payload.index
      const maxIndexOfRow = NUMBER_OF_CELLS_IN_A_ROW[mapIndex] - 1
      const numberOfCellsInARow = NUMBER_OF_CELLS_IN_A_ROW[mapIndex]

      const checkHitMine = () => minesMap[targetIndex];

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

      const sweep = () => {
        const scannedList = Array(dataMap.length).fill(false)
        const tempDataMap = dataMap.slice()
        const recursiveSweep = (index: number) => {
          if(scannedList[index]) return;
          const result = getAdjacentMinesCount(index, numberOfCellsInARow, minesMap);
          scannedList[index] = true;
          if(result !== MAP_OBJECT.NO_BOMB_ARROUND){
            tempDataMap[index] = result;
            return;
          }
          tempDataMap[index] = MAP_OBJECT.NO_BOMB_ARROUND;
          const coords = getAdjacentCoordinates(...indexToCoord(index, numberOfCellsInARow), maxIndexOfRow)
          coords.forEach(coord => {
            recursiveSweep(coordToIndex(coord, numberOfCellsInARow))
          })
        }
        recursiveSweep(targetIndex)
        return tempDataMap
      }

      const checkNoUncoveredCells = (currentDataMap: number[]) => {
        const uncoveredCellsCount = currentDataMap.filter(cell => (cell !== MAP_OBJECT.COVERED && cell >= 0 && cell <= 8)).length;
        return (uncoveredCellsCount === totalCellsCount - totalMinesCount)
      }

      const gameWin = () => ({
        ...state,
        gameStatus: GAME_STATUS.WIN
      })

      if(checkHitMine()) return gameOver()
      const nextDataMap = sweep()
      if(checkNoUncoveredCells(nextDataMap)) return gameWin()
      return {
        ...state,
        dataMap: nextDataMap
      }
    }
    default:
      throw Error('Unknown action: ' + action.type);
  }
}

export default Reducer;
