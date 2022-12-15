import { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import Head from './Head';
import PlayField from './PlayField';
import ButtonField from './ButtonField';
import Footer from './Footer';
import Dialog from './Dialog';

const App = () => {
  const MINE_CODE = 10
  const NO_BOMB_ARROUND = 0
  const GAME_WIN = 'You Win!'
  const GAME_LOSE = 'You Lose!'
  const [mapIndex, setMapIndex] = useState<number>(0);
  const [targetIndex, setTargetIndex] = useState<number>();
  const [data, setData] = useState<number[]>([]);
  const [minesMap, setMinesMap] = useState<boolean[]>([]);
  const [init, setInit] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<string>()
  const NUMBER_OF_CELLS_IN_A_ROW = useMemo(() => [9, 16, 24], [])
  const randMinesMap = (size: number, avoidIndex: number): boolean[] => {
    const random = (): number => {
      let random = Math.floor(Math.random() * size);
      while(random === avoidIndex) random = Math.floor(Math.random() * size);
      return random;
    }

    let map = Array(size).fill(false);
    [ ...Array(NUMBER_OF_CELLS_IN_A_ROW[mapIndex]) ].forEach(() => map[random()] = true);
    return map;
  }

  const getAdjacentCoordinates = useCallback((x: number, y:number): [number, number][] => {
    // 定義一個空的座標陣列
    const coords: [number, number][] = [];
    const max = NUMBER_OF_CELLS_IN_A_ROW[mapIndex] - 1;

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
    // click mine
    if(minesMap[targetIndex]) {
      setData((cells: number[]) => cells.map((cell, index) => {
        if(index === targetIndex) return 11;
        return minesMap[index]? MINE_CODE: cell
      }))
      setGameStatus(GAME_LOSE);
    }else {
      setData(cells => {
        const tempCells = cells.slice();
        const scannedList = Array(cells.length).fill(false)
        const recursiveSweep = (index: number) => {
          console.log(index)
          if(scannedList[index]) return;
          const result = getArroundMinesCount(index);
          scannedList[index] = true;
          if(result !== NO_BOMB_ARROUND){
            tempCells[index] = result;
            return;
          }
          tempCells[index] = NO_BOMB_ARROUND;
          const coords = getAdjacentCoordinates(...indexToCoord(index))
          coords.forEach(coord => {
            recursiveSweep(coordToIndex(coord))
          })
        }
        recursiveSweep(targetIndex)
        return tempCells
      })
    }
  }, [targetIndex, minesMap, getArroundMinesCount, coordToIndex, getAdjacentCoordinates, getCellsSize, indexToCoord, mapIndex])

  useEffect(()=>{
    const count = data.slice().filter(cell => (cell !== null && cell >= 0 && cell <= 8)).length;
    if(count === Math.pow(NUMBER_OF_CELLS_IN_A_ROW[mapIndex], 2) - NUMBER_OF_CELLS_IN_A_ROW[mapIndex]){
      setGameStatus(GAME_WIN);
    }
  }, [data, NUMBER_OF_CELLS_IN_A_ROW, mapIndex])

  useEffect(()=>{
    setTargetIndex(undefined)
    setInit(false)
    setData(Array(getCellsSize(mapIndex)).fill(null))
  }, [mapIndex, NUMBER_OF_CELLS_IN_A_ROW, getCellsSize])

  return (
    <div className="container">
      <Head/>
      <div className="play-field-container">
        { gameStatus && <Dialog text={gameStatus} clickHandler={()=>{window.location.reload()}} /> }
        <PlayField data={data} mapIndex={mapIndex} clickHandler={clickHandler}/>
      </div>
      <ButtonField clickHandler={setMapIndex}/>
      <Footer/>
    </div>
  );
}

export default App;
