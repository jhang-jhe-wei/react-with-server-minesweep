import {useContext} from "react";
import AppContext from "../context";
import {ReducerActions} from "../reducer";

type DialogProps = {
  text: string;
}

const Dialog = (props: DialogProps) => {
  const { text } = props
  const dispatch = useContext(AppContext)

  return (
    <>
      <div className="dialog-mask">
      </div>
      <div
        className="dialog-message-area"
        onClick={() => dispatch({type: ReducerActions.NEW_GAME})}
      >
        <p className="dialog-message">
          {text}
        </p>
      </div>
    </>
  );
}

export default Dialog;
