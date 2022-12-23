import {useContext} from "react";
import AppContext from "../context";
import {GAME_STATUS} from "../data/constants";
import {ReducerActions} from "../reducer";
import { fetchToken } from "../serivce";
import { NUMBER_OF_CELLS_IN_A_ROW, MINE_LIST } from "../data/constants";

const Dialog = () => {
  const [state, dispatch] = useContext(AppContext)
  const { gameStatus } = state
  const newGame = async () => {
    const token = await fetchToken(NUMBER_OF_CELLS_IN_A_ROW[state.mapIndex], MINE_LIST[state.mapIndex])
    dispatch({type: ReducerActions.NEW_GAME, payload: token})
  }

  if(gameStatus === GAME_STATUS.IN_PROGRESS) return <></>
    return (
      <>
        <div className="dialog-mask">
        </div>
        <div
          className="dialog-message-area"
          onClick={() => newGame()}
        >
          <p className="dialog-message">
            {gameStatus}
          </p>
        </div>
      </>
    );
}

export default Dialog;
