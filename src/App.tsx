import React from 'react';
import './App.css';
import Head from './Head';
import PlayField from './PlayField';
import ButtonField from './ButtonField';

const App = () => {
  return (
    <div className="container">
      <Head/>
      <div className="footer-field">
        <p className="footer">
          ©2022 by JHE-WEI, JHANG
        </p>
      </div>
      <PlayField/>
      <ButtonField/>
    </div>
  );
}

export default App;
