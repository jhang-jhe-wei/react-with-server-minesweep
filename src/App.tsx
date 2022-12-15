import { useState, useEffect, useMemo } from 'react';
import './App.css';
import Head from './Head';
import PlayField from './PlayField';
import ButtonField from './ButtonField';
import Footer from './Footer';

const App = () => {
  const NUMBER_OF_MINES = 10
  const [mapIndex, setMapIndex] = useState<number>(0);
  const [data, setData] = useState<number[]>([]);
  const [minesMap, setMinesMap] = useState<boolean[]>([]);
  const [init, setInit] = useState<boolean>(false);
  const NUMBER_OF_CELL_LIST = useMemo(() => [Math.pow(9, 2), Math.pow(16, 2), Math.pow(24, 2)], [])
  const randMinesMap = (size: number, avoidIndex: number): boolean[] => {
    const random = (): number => {
      let random = Math.floor(Math.random() * size);
      while(random === avoidIndex) random = Math.floor(Math.random() * size);
      return random;
    }

    let map = Array(size).fill(false);
    [ ...Array(NUMBER_OF_MINES) ].forEach(() => map[random()] = true);
    return map;
  }

  const clickHandler = (
    index: number,
    event: 'long'| 'short'| 'right'
  ) => {
    console.log(event)
    if(!init){
      setMinesMap(randMinesMap(NUMBER_OF_CELL_LIST[mapIndex], index))
      setInit(true)
    }
  }

  useEffect(()=>{
    setInit(false)
    setData(Array(NUMBER_OF_CELL_LIST[mapIndex]).fill(null))
  }, [mapIndex, NUMBER_OF_CELL_LIST])

  return (
    <div className="container">
      <Head/>
      <PlayField data={data} mapIndex={mapIndex} clickHandler={clickHandler}/>
      <ButtonField clickHandler={setMapIndex}/>
      <Footer/>
    </div>
  );
}

export default App;
