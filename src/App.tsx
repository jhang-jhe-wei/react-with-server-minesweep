import { useState, useEffect, useCallback, useMemo } from 'react';
import Head from './components/Head';
import PlayField from './components/PlayField';
import ButtonField from './components/ButtonField';
import Footer from './components/Footer';
import Dialog from './components/Dialog';

const MINE_CODE = 10
const NO_BOMB_ARROUND = 0
const GAME_WIN = 'You Win!'
const GAME_LOSE = 'You Lose!'
const NUMBER_OF_CELLS_IN_A_ROW = [9, 16, 24]
const randMinesMap = (mapIndex:number, size: number, avoidIndex: number): boolean[] => {
  const random = (): number => {
    let random = Math.floor(Math.random() * size);
    while(random === avoidIndex) random = Math.floor(Math.random() * size);
    return random;
  }

  let map = Array(size).fill(false);
  [ ...Array(NUMBER_OF_CELLS_IN_A_ROW[mapIndex]) ].forEach(() => map[random()] = true);
  return map;
}

const getAdjacentCoordinates = (x: number, y:number, max:number): [number, number][] => {
    // 定義一個空的座標陣列
    const coords: [number, number][] = [];

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
  }

const indexToCoord = (index: number, numberOfCellsInARow: number): [number, number] => (
  [
    index % numberOfCellsInARow,
    Math.floor(index / numberOfCellsInARow)
  ]
)

const coordToIndex = (point: [number, number], numberOfCellsInARow: number): number => (
  point[1] * numberOfCellsInARow + point[0]
)

const App = () => {
  const [mapIndex, setMapIndex] = useState<number>(0);
  const [targetIndex, setTargetIndex] = useState<number>();
  const [data, setData] = useState<(number|null)[]>([]);
  const [minesMap, setMinesMap] = useState<boolean[]>([]);
  const [init, setInit] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<string>()
  const cellsSize = useMemo(() => Math.pow(NUMBER_OF_CELLS_IN_A_ROW[mapIndex], 2), [mapIndex])
  const maxIndexOfRow = useMemo(() => NUMBER_OF_CELLS_IN_A_ROW[mapIndex] - 1, [mapIndex])
  const numberOfCellsInARow = useMemo(() => NUMBER_OF_CELLS_IN_A_ROW[mapIndex], [mapIndex])

  const getArroundMinesCount = useCallback((index: number) => {
    const [x, y] = indexToCoord(index, numberOfCellsInARow)
    const adjacentArray = getAdjacentCoordinates(x, y, maxIndexOfRow)
    let count = 0
    adjacentArray.forEach((point) => {
      const position = coordToIndex(point, numberOfCellsInARow)
      if(minesMap[position]) count += 1
    })
    return count
  }, [minesMap, maxIndexOfRow, numberOfCellsInARow])

  const clickHandler = (
    index: number,
    event: 'long'| 'short'| 'right'
  ) => {
    if(event === 'short') {
      if(!init){
        setMinesMap(randMinesMap(mapIndex, cellsSize, index))
        setInit(true)
      }
      setTargetIndex(index)
    }else{
      setData((cells) => {
        if(cells[index] !== null && cells[index] !== 9) return cells;
        return [
          ...cells.slice(0, index),
          cells[index] === 9 ? null: 9,
          ...cells.slice(index + 1),
        ]
      })
    }
  }

  useEffect(() => {
    if(targetIndex === undefined) return;
    // click mine
    if(minesMap[targetIndex]) {
      setData((cells) => cells.map((cell, index) => {
        if(index === targetIndex) return 11;
        return minesMap[index]? MINE_CODE: cell
      }))
      setGameStatus(GAME_LOSE);
    }else {
      setData(cells => {
        const tempCells = cells.slice();
        const scannedList = Array(cells.length).fill(false)
        const recursiveSweep = (index: number) => {
          if(scannedList[index]) return;
          const result = getArroundMinesCount(index);
          scannedList[index] = true;
          if(result !== NO_BOMB_ARROUND){
            tempCells[index] = result;
            return;
          }
          tempCells[index] = NO_BOMB_ARROUND;
          const coords = getAdjacentCoordinates(...indexToCoord(index, numberOfCellsInARow), maxIndexOfRow)
          coords.forEach(coord => {
            recursiveSweep(coordToIndex(coord, numberOfCellsInARow))
          })
        }
        recursiveSweep(targetIndex)
        return tempCells
      })
    }
  }, [targetIndex, minesMap, getArroundMinesCount, mapIndex, maxIndexOfRow, numberOfCellsInARow])

  useEffect(()=>{
    const count = data.slice().filter(cell => (cell !== null && cell >= 0 && cell <= 8)).length;
    if(count === Math.pow(NUMBER_OF_CELLS_IN_A_ROW[mapIndex], 2) - NUMBER_OF_CELLS_IN_A_ROW[mapIndex]){
      setGameStatus(GAME_WIN);
    }
  }, [data, mapIndex])

  useEffect(()=>{
    setTargetIndex(undefined)
    setInit(false)
    setData(Array(cellsSize).fill(null))
  }, [mapIndex, cellsSize])

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
