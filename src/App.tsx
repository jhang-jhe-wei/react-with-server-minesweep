import { useEffect, useReducer } from 'react';
import Head from './components/Head';
import PlayField from './components/PlayField';
import ButtonField from './components/ButtonField';
import Footer from './components/Footer';
import Dialog from './components/Dialog';
import Reducer, { initReducer } from './reducer';
import AppContext from './context';
import { fetchToken } from './serivce';
import { ReducerActions } from './reducer';
import { NUMBER_OF_CELLS_IN_A_ROW, MINE_LIST } from './data/constants';

const App = () => {
  const [state, dispatch] = useReducer(Reducer, 0, initReducer)
  useEffect(() => {
    const initGame = async () => {
      const token = await fetchToken(NUMBER_OF_CELLS_IN_A_ROW[state.mapIndex], MINE_LIST[state.mapIndex])
      dispatch({type: ReducerActions.SET_TOKEN, payload: token})
    }
    initGame()
  }, [state.mapIndex])

  return (
    <AppContext.Provider value={[state, dispatch]}>
    <div className="container">
      <Head/>
      <div className="play-field-container">
        <Dialog/>
        <PlayField/>
      </div>
      <ButtonField/>
      <Footer/>
    </div>
    </AppContext.Provider>
  );
}

export default App;
