type DialogProps = {
  text: string;
  clickHandler: () => void;
}

const Dialog = (props: DialogProps) => {
  const {
    text,
    clickHandler
  } = props

  return (
    <>
      <div className="dialog-mask">
      </div>
      <div className="dialog-message-area" onClick={clickHandler}>
        <p className="dialog-message">
          {text}
        </p>
      </div>
    </>
  );
}

export default Dialog;
