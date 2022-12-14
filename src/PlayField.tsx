type PlayFieldProps = {
  data: number[];
  mapIndex: number;
}

const PlayField = (props: PlayFieldProps) => {
  const {
    data,
    mapIndex
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
        data.map(value =>
          <div className={`cell ${value && getStyleBy(value)}`}></div>
        )
      }
</div>
  );
}

export default PlayField;
