type ButtonFieldProps = {
  mapSizes: number[];
  setMapSize: Function;
}

const ButtonField = (props: ButtonFieldProps) => {
  const ButtonTextList = ['Small', 'Medium', 'Large'];
  const {
    mapSizes,
    setMapSize
  } = props

  return (
    <div className="buttons-field">
      {
        ButtonTextList.map( (buttonText, index) => (
          <button key={buttonText} onClick={ () => setMapSize(mapSizes[index]) } >{ buttonText }</button>
        ))
      }
    </div>

  );
}

export default ButtonField;
