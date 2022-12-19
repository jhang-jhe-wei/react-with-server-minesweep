import { NUMBER_OF_CELLS_IN_A_ROW, GAMEING, MINE_LIST } from "./data/constants";
import { randMinesMap } from "./functions";

interface ReducerState {
  dataMap: number[];
  minesMap: boolean[];
  gameStatus: string;
  mapIndex: number;
  totalCellsCount: number;
  totalMinesCount: number;
  hasCreatedMine: boolean;
}

interface ReducerAction {
  type: string;
  payload?: any;
}

export const ReducerActions = {
  SET_MAP_INDEX: 'action$set_map_index',
  SET_GAME_STATUS: 'action$set_game_status',
  RESET_HAS_CREATED_MINES: 'action$reset_has_create_mines',
  GENERATE_MINES: 'action$generate_mines'
}

export const initReducer = (mapIndex: number) => {
  const totalCellsCount = Math.pow(NUMBER_OF_CELLS_IN_A_ROW[mapIndex], 2)
  const totalMinesCount = MINE_LIST[mapIndex]

  return {
    dataMap: Array(totalCellsCount).fill(null),
    minesMap: Array(totalMinesCount).fill(false),
    gameStatus: GAMEING,
    mapIndex: mapIndex,
    totalCellsCount,
    totalMinesCount,
    hasCreatedMine: false
  } }

const Reducer = (state: ReducerState, action: ReducerAction) => {
  switch (action.type) {
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
        minesMap: randMinesMap(
          state.totalCellsCount,
          state.totalMinesCount,
          action.payload.avoidIndex
        ),
        hasCreatedMine: true
      };
    }
    default:
      throw Error('Unknown action: ' + action.type);
  }
}

export default Reducer;
