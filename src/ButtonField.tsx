type ButtonFieldProps = {
  clickHandler: Function;
}

const ButtonField = (props: ButtonFieldProps) => {
  const ButtonTextList = ['Small', 'Medium', 'Large'];
  const {
    clickHandler
  } = props

  return (
    <div className="buttons-field">
      {
        ButtonTextList.map( (buttonText, index) => (
          <button
            key={buttonText}
            onClick={ () => clickHandler(index) }
          >
            { buttonText }
          </button>
        ))
      }
    </div>

  );
}

export default ButtonField;
