import { useReducer } from 'react';
import Head from './components/Head';
import PlayField from './components/PlayField';
import ButtonField from './components/ButtonField';
import Footer from './components/Footer';
import Dialog from './components/Dialog';
import Reducer, { initReducer } from './reducer';
import AppContext from './context';

const App = () => {
  const [state, dispatch] = useReducer(Reducer, 0, initReducer)

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
