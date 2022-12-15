import { useState, useEffect, useMemo, useCallback } from 'react';
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

  const getAdjacentCoordinates = useCallback((x: number, y:number): [number, number][] => {
    // 定義一個空的座標陣列
    const coords: [number, number][] = [];
    const max = NUMBER_OF_CELLS_IN_A_ROW[mapIndex];

    // 檢查 (x, y-1) 是否在邊界內
    if (y > 0) {
      coords.push([x, y-1]);
    }

    // 檢查 (x, y+1) 是否在邊界內
    if (y < max) {
      coords.push([x, y+1]);
    }

    // 檢查 (x-1, y) 是否在邊界內
    if (x > 0) {
      coords.push([x-1, y]);
    }

    // 檢查 (x+1, y) 是否在邊界內
    if (x < max) {
      coords.push([x+1, y]);
    }

    // 檢查 (x-1, y-1) 是否在邊界內
    if (x > 0 && y > 0) {
      coords.push([x-1, y-1]);
    }

    // 檢查 (x-1, y+1) 是否在邊界內
    if (x > 0 && y < max) {
      coords.push([x-1, y+1]);
    }

    // 檢查 (x+1, y-1) 是否在邊界內
    if (x < max && y > 0) {
      coords.push([x+1, y-1]);
    }

    // 檢查 (x+1, y+1) 是否在邊界內
    if (x < max && y < max) {
      coords.push([x+1, y+1]);
    }

    // 返回座標陣列
    return coords;
  }, [NUMBER_OF_CELLS_IN_A_ROW, mapIndex])

  const indexToCoord = useCallback((index: number): [number, number] => (
    [
      index % NUMBER_OF_CELLS_IN_A_ROW[mapIndex],
      Math.floor(index / NUMBER_OF_CELLS_IN_A_ROW[mapIndex])
    ]
  ),
    [NUMBER_OF_CELLS_IN_A_ROW, mapIndex]
  )

  const coordToIndex = useCallback((point: [number, number]): number => (
    point[1] * NUMBER_OF_CELLS_IN_A_ROW[mapIndex] + point[0]
  ),
    [NUMBER_OF_CELLS_IN_A_ROW, mapIndex]
  )

  const getArroundMinesCount = useCallback((index: number) => {
    const [x, y] = indexToCoord(index)
    const adjacentArray = getAdjacentCoordinates(x, y)
    let count = 0
    adjacentArray.forEach((point) => {
      const position = coordToIndex(point)
      if(minesMap[position]) count += 1
    })
    return count
  }, [minesMap, getAdjacentCoordinates, indexToCoord, coordToIndex])

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
        getArroundMinesCount(targetIndex),
        ...cells.slice(targetIndex + 1),
      ])
    }
  }, [targetIndex, minesMap, getArroundMinesCount])

  useEffect(()=>{
    setTargetIndex(undefined)
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
