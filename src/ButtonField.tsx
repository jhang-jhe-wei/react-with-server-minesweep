const ButtonTextList = ['Small', 'Medium', 'Large'];

const ButtonField = () => {
  return (
    <div className="buttons-field">
      {
        ButtonTextList.map( buttonText => (
          <button>{ buttonText }</button>
        ))
      }
    </div>

  );
}

export default ButtonField;
