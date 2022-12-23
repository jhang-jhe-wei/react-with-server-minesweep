import { useContext } from 'react';
import AppContext from '../context';
import { ReducerActions } from '../reducer';
import { sweep } from '../serivce';
import { indexToCoord } from '../functions';
import {NUMBER_OF_CELLS_IN_A_ROW} from '../data/constants';

const CLICK_EVENTS = {
  SHORT_CLICK: 'short',
  LONG_CLICK: 'long',
  RIGHT_CLICK: 'right'
} as const
type CLICK_EVENTS_VALUES = typeof CLICK_EVENTS[keyof typeof CLICK_EVENTS]
const MAP_STYLES = ['grid-cols-9', 'grid-cols-16', 'grid-cols-24']
const getStyleBy = (value:number| null) => {
  if(value === null){
    return 'cell'
  }else if(value === 0){
    return ''
  }
  else if(value < 9){
    return `symbol-${value}`
  }else if(value === 9){
    return 'cell symbol-flag'
  }else if(value === 10){
    return 'symbol-bomb'
  }else if(value === 11){
    return 'symbol-bomb bg-red'
  }
}

const PlayField = () => {
  const [state, dispatch] = useContext(AppContext)
  const {
    mapIndex,
    dataMap,
    token
  } = state

  const rightClickCell = async (index: number) => {
      const [x, y] = indexToCoord(index, NUMBER_OF_CELLS_IN_A_ROW[mapIndex])
    await sweep(token, x, y).then(res => {
      const payload = { ...res.data, targetIndex: index }
        dispatch({type: ReducerActions.SWEEP_CELL, payload})
      })
  }

  const clickHandler = (index: number, event: CLICK_EVENTS_VALUES) => {
    if(event === CLICK_EVENTS.SHORT_CLICK) {
      rightClickCell(index)
    }else{
      dispatch({type: ReducerActions.PUT_FLAG_ON_CELL, payload: index})
    }
  }

  let targetIndex :number;
  let clickedAt: number;

  return (
    <div className={`play-field ${MAP_STYLES[mapIndex]}`}>
      {
        dataMap.map((value, index) =>
        <div
          key={index}
          className={`${getStyleBy(value)}`}
          onMouseDown={()=>{
            targetIndex = index;
            clickedAt = Date.now()
          }}
          onMouseUp={()=>{
            if(targetIndex === index){
              const duration = Date.now() - clickedAt;
              if(duration <= 500){
                clickHandler(index, CLICK_EVENTS.SHORT_CLICK)
              }else{
                clickHandler(index, CLICK_EVENTS.LONG_CLICK)
              }
            }
          }}
          onContextMenu={(e)=>{
            clickHandler(index, CLICK_EVENTS.RIGHT_CLICK)
            e.preventDefault();
            return false;
          }}
        />
        )
      }
    </div>
  );
}

export default PlayField;
