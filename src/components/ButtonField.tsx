import {useContext} from "react";
import AppContext from "../context";
import { ReducerActions } from "../reducer";

const BUTTON_TEXT_LIST = ['Small', 'Medium', 'Large'];
const ButtonField = () => {
  const [, dispatch] = useContext(AppContext)
  const clickHandler = (mapIndex: number) => {
    dispatch({
      type: ReducerActions.SET_MAP_INDEX,
      payload: mapIndex
    })
  }

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
