import { useReducer } from 'react';
import Head from './components/Head';
import PlayField from './components/PlayField';
import ButtonField from './components/ButtonField';
import Footer from './components/Footer';
import Dialog from './components/Dialog';
import { SHORT_CLICK_EVENT, GAME_STATUS } from './data/constants';
import Reducer, { initReducer, ReducerActions } from './reducer';
import AppContext from './context';

const App = () => {
  const [state, dispatch] = useReducer(Reducer, 0, initReducer)

  const {
    mapIndex,
    gameStatus,
    hasCreatedMine,
    dataMap
  } = state

  const clickHandler = (index: number, event: string) => {
    if(event === SHORT_CLICK_EVENT) {
      if(!hasCreatedMine){
        dispatch({type: ReducerActions.GENERATE_MINES, payload: {
          avoidIndex: index
        }})
      }
      dispatch({type: ReducerActions.SWEEP_CELL, payload: {
        index: index
      }})
    }else{
      dispatch({type: ReducerActions.PUT_FLAG_ON_CELL, payload: {
        index
      }})
    }
  }

  return (
    <AppContext.Provider value={dispatch}>
    <div className="container">
      <Head/>
      <div className="play-field-container">
        { gameStatus !== GAME_STATUS.IN_PROGRESS && <Dialog text={gameStatus} /> }
        <PlayField data={dataMap} mapIndex={mapIndex} clickHandler={clickHandler}/>
      </div>
      <ButtonField/>
      <Footer/>
    </div>
    </AppContext.Provider>
  );
}

export default App;
