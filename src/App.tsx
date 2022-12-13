import React from 'react';
import './App.css';
import Head from './Head';
import PlayField from './PlayField';
import ButtonField from './ButtonField';
import Footer from './Footer';

const App = () => {
  return (
    <div className="container">
      <Head/>
      <PlayField/>
      <ButtonField/>
      <Footer/>
    </div>
  );
}

export default App;
