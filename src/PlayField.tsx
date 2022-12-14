type PlayFieldProps = {
  data: number[];
  mapIndex: number;
  clickHandler: Function;
}

const PlayField = (props: PlayFieldProps) => {
  const {
    data,
    mapIndex,
    clickHandler
  } = props;
  const MAP_STYLES = ['grid-cols-9', 'grid-cols-16', 'grid-cols-24']

  const getStyleBy = (value:number) => {
    if(value === 0){
      return 'cell-checked'
    }else if(value < 9){
      return `cell-checked symbol-${value}`
    }else if(value === 9){
      return 'symbol-flag'
    }else if(value === 10){
      return 'cell-checked symbol-bomb'
    }else{
      return ''
    }
  }

  return (
    <div className={`play-field ${MAP_STYLES[mapIndex]}`}>
      {
        data.map((value, index) =>
        <div
          key={index}
          className={`cell ${typeof(value) === 'number' && getStyleBy(value)}`}
          onClick={() => clickHandler((cells: number[]) => [
            ...cells.slice(0, index),
            0,
            ...cells.slice(index + 1),
          ])}
        />
        )
      }
</div>
  );
}

export default PlayField;
