import React from 'react';
import './App.css';
import Head from './Head';
import PlayField from './PlayField';

const App = () => {
  return (
    <div className="container">
      <Head/>
      <div className="buttons-field">
        <button>Small</button>
        <button>Medium</button>
        <button>Large</button>
      </div>
      <div className="footer-field">
        <p className="footer">
          ©2022 by JHE-WEI, JHANG
        </p>
      </div>
      <PlayField/>
    </div>
  );
}

export default App;
