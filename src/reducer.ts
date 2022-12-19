import { NUMBER_OF_CELLS_IN_A_ROW, GAMEING, MINE_LIST } from "./data/constants";

interface ReducerState {
  dataMap: number[];
  minesMap: boolean[];
  gameStatus: string;
  mapIndex: number;
  totalCellsCount: number;
  totalMinesCount: number;
  hasCreatedMine: boolean;
}

interface SetMapIndexActionProps {
  mapIndex: number
}

interface ReducerAction {
  type: string;
  payload: SetMapIndexActionProps;
}

export const SET_MAP_INDEX_ACTION = 'action$set_map_index'

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
    case SET_MAP_INDEX_ACTION: {
      return initReducer(action.payload.mapIndex);
    }
    default:
      throw Error('Unknown action: ' + action.type);
  }
}

export default Reducer;
