import {
  generateRandMineMap,
  putFlagOrKeepDataMap,
  checkNoUncoveredCells,
  sweep,
  coordToIndex
} from './functions';
import {
  GAME_STATUS,
  MAP_OBJECT,
  GameStatusValue,
  NUMBER_OF_CELLS_IN_A_ROW,
  MINE_LIST
} from './data/constants';
import {SweepResponse} from './serivce';

export type DataMapType = (number|null)[]
export interface ReducerStateProps {
  dataMap: DataMapType;
  minesMap: boolean[];
  gameStatus: GameStatusValue;
  mapIndex: number;
  totalCellsCount: number;
  totalMinesCount: number;
  hasCreatedMine: boolean;
  token: string;
}

export const ReducerActions = {
  SET_MAP_INDEX: 'action$set_map_index',
  SET_GAME_STATUS: 'action$set_game_status',
  RESET_HAS_CREATED_MINES: 'action$reset_has_create_mines',
  GENERATE_MINES: 'action$generate_mines',
  PUT_FLAG_ON_CELL: 'action$put_flag_on_cell',
  SWEEP_CELL: 'action$sweep_cell',
  NEW_GAME: 'action$new_game',
  SET_TOKEN: 'action$set_token'
} as const

interface SweepParams extends SweepResponse {
  targetIndex: number
}

export type ReducerActionProps =
    | { type: typeof ReducerActions.SET_MAP_INDEX; payload: number }
    | { type: typeof ReducerActions.SET_GAME_STATUS; payload: GameStatusValue }
    | { type: typeof ReducerActions.RESET_HAS_CREATED_MINES }
    | { type: typeof ReducerActions.GENERATE_MINES; payload: number }
    | { type: typeof ReducerActions.PUT_FLAG_ON_CELL; payload: number }
    | { type: typeof ReducerActions.SWEEP_CELL; payload: SweepParams }
    | { type: typeof ReducerActions.NEW_GAME, payload: string }
    | { type: typeof ReducerActions.SET_TOKEN, payload: string }

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
    hasCreatedMine: false,
    token: ''
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
    case ReducerActions.SET_TOKEN: {
      return {
        ...state,
        token: action.payload
      };
    }
    case ReducerActions.NEW_GAME: {
      return {
        ...initReducer(mapIndex),
        token: action.payload
      };
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
      const {
        userwins,
        minehit,
        minesAround,
        emptyCells,
        mines,
        targetIndex
      } = action.payload

      const getGameStatus = () => {
        if(userwins) return GAME_STATUS.WIN
        if(minehit) return GAME_STATUS.LOSE
        return GAME_STATUS.IN_PROGRESS
      }

      const getDataMap = () => {
        const tempDataMap = dataMap.slice();
        if(minehit && mines) {
          mines.forEach(point => {
            const index = coordToIndex([point.x, point.y], NUMBER_OF_CELLS_IN_A_ROW[mapIndex])
            tempDataMap[index] = MAP_OBJECT.MINE
          })
        }else if(userwins) {
          tempDataMap[targetIndex] = minesAround
        }else {
          tempDataMap[targetIndex] = minesAround
          emptyCells.forEach(cell => {
            const index = coordToIndex([cell.x, cell.y], NUMBER_OF_CELLS_IN_A_ROW[mapIndex])
            tempDataMap[index] = cell.minesAround
          })
        }
        return tempDataMap;
      }

      return {
        ...state,
        gameStatus: getGameStatus(),
        dataMap: getDataMap()
      }
    }
    default:
      return state
  }
}

export default Reducer;
