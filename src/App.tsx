import { useState, useEffect, useMemo } from 'react';
import './App.css';
import Head from './Head';
import PlayField from './PlayField';
import ButtonField from './ButtonField';
import Footer from './Footer';

const App = () => {
  const [mapIndex, setMapIndex] = useState<number>(0);
  const [data, setData] = useState<number[]>([]);
  const NUMBER_OF_CELL_LIST = useMemo(() => [Math.pow(9, 2), Math.pow(16, 2), Math.pow(24, 2)], [])
  useEffect(()=>{
    setData(Array(NUMBER_OF_CELL_LIST[mapIndex]).fill(null))
  }, [mapIndex, NUMBER_OF_CELL_LIST])

  return (
    <div className="container">
      <Head/>
      <ButtonField clickHandler={setMapIndex}/>
      <PlayField data={data} />
      <Footer/>
    </div>
  );
}

export default App;
