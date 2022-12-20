import {useContext} from "react";
import AppContext from "../context";
import {GAME_STATUS} from "../data/constants";
import {ReducerActions} from "../reducer";

const Dialog = () => {
  const [state, dispatch] = useContext(AppContext)
  const { gameStatus } = state

  if(gameStatus === GAME_STATUS.IN_PROGRESS) return <></>
  return (
    <>
      <div className="dialog-mask">
      </div>
      <div
        className="dialog-message-area"
        onClick={() => dispatch({type: ReducerActions.NEW_GAME})}
      >
        <p className="dialog-message">
          {gameStatus}
        </p>
      </div>
    </>
  );
}

export default Dialog;
