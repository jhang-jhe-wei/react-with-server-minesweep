import { CLICK_EVENTS } from '../data/constants';

type PlayFieldProps = {
  data: (number|null)[];
  mapIndex: number;
  clickHandler: Function;
}

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

const PlayField = (props: PlayFieldProps) => {
  const {
    data,
    mapIndex,
    clickHandler
  } = props;


  let targetIndex :number;
  let clickedAt: number;

  return (
    <div className={`play-field ${MAP_STYLES[mapIndex]}`}>
      {
        data.map((value, index) =>
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
