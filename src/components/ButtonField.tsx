type ButtonFieldProps = {
  clickHandler: Function;
}

const BUTTON_TEXT_LIST = ['Small', 'Medium', 'Large'];
const ButtonField = (props: ButtonFieldProps) => {
  const {
    clickHandler
  } = props

  return (
    <div className="buttons-field">
      {
        BUTTON_TEXT_LIST.map( (buttonText, index) => (
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
