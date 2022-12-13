const ButtonField = () => {
  const ButtonTextList = ['Small', 'Medium', 'Large'];

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
