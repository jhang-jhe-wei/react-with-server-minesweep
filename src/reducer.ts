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

const Reducer = (state: ReducerState, action: ReducerAction) => {
  switch (action.type) {
    case 'pending': {
      return state;
    }
    default:
      throw Error('Unknown action: ' + action.type);
  }
}

export default Reducer;
