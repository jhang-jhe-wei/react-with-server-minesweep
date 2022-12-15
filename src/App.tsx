import { useState, useEffect, useMemo } from 'react';
import './App.css';
import Head from './Head';
import PlayField from './PlayField';
import ButtonField from './ButtonField';
import Footer from './Footer';

const App = () => {
  const NUMBER_OF_MINES = 10
  const [mapIndex, setMapIndex] = useState<number>(0);
  const [targetIndex, setTargetIndex] = useState<number>();
  const [data, setData] = useState<number[]>([]);
  const [minesMap, setMinesMap] = useState<boolean[]>([]);
  const [init, setInit] = useState<boolean>(false);
  const NUMBER_OF_CELLS_IN_A_ROW = useMemo(() => [9, 16, 24], [])
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


  const getCellsSize = useCallback((mapIndex: number): number => {
    return Math.pow(NUMBER_OF_CELLS_IN_A_ROW[mapIndex], 2)
  },
    [NUMBER_OF_CELLS_IN_A_ROW]
  )

  const clickHandler = (
    index: number,
    event: 'long'| 'short'| 'right'
  ) => {
    console.log(event)
    if(!init){
      setMinesMap(randMinesMap(getCellsSize(mapIndex), index))
      setInit(true)
    }
    setTargetIndex(index)
  }

  useEffect(() => {
    if(targetIndex === undefined) return;
    if(minesMap[targetIndex]) {
      setData((cells: number[]) => cells.map((cell, index) => (
        minesMap[index]? 10: cell
      )))
    }else {
      setData((cells: number[]) => [
        ...cells.slice(0, targetIndex),
        0,
        ...cells.slice(targetIndex + 1),
      ])
    }
  }, [targetIndex, minesMap])

  useEffect(()=>{
    setInit(false)
    setData(Array(getCellsSize(mapIndex)).fill(null))
  }, [mapIndex, NUMBER_OF_CELLS_IN_A_ROW, getCellsSize])

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
