import { useReducer } from 'react';
import Head from './components/Head';
import PlayField from './components/PlayField';
import ButtonField from './components/ButtonField';
import Footer from './components/Footer';
import Dialog from './components/Dialog';
import { SHORT_CLICK_EVENT } from './data/constants';
import Reducer, { initReducer, ReducerActions } from './reducer';

const App = () => {
  const [state, dispatch] = useReducer(Reducer, 0, initReducer)
  const {
    mapIndex,
    gameStatus,
    hasCreatedMine: init,
    dataMap: data
  } = state
  const buttonClickHandler = (mapIndex: number) => {
    dispatch({type: ReducerActions.SET_MAP_INDEX, payload: {
      mapIndex
    }})
  }

  const clickHandler = (
    index: number,
    event: string
  ) => {
    if(event === SHORT_CLICK_EVENT) {
      if(!init){
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
    <div className="container">
      <Head/>
      <div className="play-field-container">
        { gameStatus !== GAMEING && <Dialog text={gameStatus} clickHandler={()=>console.log('reload')} /> }
        <PlayField data={data} mapIndex={mapIndex} clickHandler={clickHandler}/>
      </div>
      <ButtonField clickHandler={buttonClickHandler}/>
      <Footer/>
    </div>
  );
}

export default App;
