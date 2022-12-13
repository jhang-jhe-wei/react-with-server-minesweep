import { useState, useEffect } from 'react';
import './App.css';
import Head from './Head';
import PlayField from './PlayField';
import ButtonField from './ButtonField';
import Footer from './Footer';

const App = () => {
  const MapSizes = [Math.pow(9, 2), Math.pow(16, 2), Math.pow(24, 2)]
  const [mapSize, setMapSize] = useState<number>(MapSizes[0]);
  const [data, setData] = useState<number[]>([]);
  useEffect(()=>{
    setData(Array(mapSize).fill(0))
    console.log(mapSize)
  }, [mapSize])

  return (
    <div className="container">
      <Head/>
      <ButtonField/>
      <PlayField data={data} />
      <Footer/>
    </div>
  );
}

export default App;
