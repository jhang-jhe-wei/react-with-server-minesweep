import { useState, useEffect, useMemo } from 'react';
import Head from './components/Head';
import PlayField from './components/PlayField';
import ButtonField from './components/ButtonField';
import Footer from './components/Footer';
import Dialog from './components/Dialog';
import { randMinesMap, indexToCoord, getAdjacentCoordinates, coordToIndex } from './functions';
import { SHORT_CLICK_EVENT } from './data/constants';

const MINE_CODE = 10
const HIT_MINE_CODE = 11
const NO_BOMB_ARROUND_CODE = 0
const FLAG_CODE = 9
const COVERD_CODE = null
const GAME_WIN = 'You Win!'
const GAME_LOSE = 'You Lose!'
const MINE_LIST = [10, 40, 99]
const NUMBER_OF_CELLS_IN_A_ROW = [9, 16, 24]
const App = () => {
  const [mapIndex, setMapIndex] = useState<number>(0);
  const [targetIndex, setTargetIndex] = useState<number>();
  const [data, setData] = useState<(number|null)[]>([]);
  const [minesMap, setMinesMap] = useState<boolean[]>([]);
  const [init, setInit] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<string>()
  const totalCellsCount = useMemo(() => Math.pow(NUMBER_OF_CELLS_IN_A_ROW[mapIndex], 2), [mapIndex])
  const totalMinesCount = useMemo(() => MINE_LIST[mapIndex], [mapIndex])
  const numberOfCellsInARow = useMemo(() => NUMBER_OF_CELLS_IN_A_ROW[mapIndex], [mapIndex])

  const clickHandler = (
    index: number,
    event: string
  ) => {
    if(event === SHORT_CLICK_EVENT) {
      if(!init){
        setMinesMap(randMinesMap(totalCellsCount, totalMinesCount, index))
        setInit(true)
      }
      setTargetIndex(index)
    }else{
      setData((cells) => {
        if(cells[index] !== COVERD_CODE && cells[index] !== FLAG_CODE) return cells;
        return [
          ...cells.slice(0, index),
          cells[index] === FLAG_CODE ? COVERD_CODE: FLAG_CODE,
          ...cells.slice(index + 1),
        ]
      })
    }
  }

  useEffect(() => {
    if(targetIndex === undefined) return;
    const maxIndexOfRow = NUMBER_OF_CELLS_IN_A_ROW[mapIndex] - 1
    const getArroundMinesCount = (index: number) => {
      const [x, y] = indexToCoord(index, numberOfCellsInARow)
      const adjacentArray = getAdjacentCoordinates(x, y, maxIndexOfRow)
      let count = 0
      adjacentArray.forEach((point) => {
        const position = coordToIndex(point, numberOfCellsInARow)
        if(minesMap[position]) count += 1
      })
      return count
    }
    const checkHitMine = () => minesMap[targetIndex];
    const gameOver = () => {
      setData((cells) => cells.map((cell, index) => {
        if(index === targetIndex) return HIT_MINE_CODE;
        return minesMap[index]? MINE_CODE: cell
      }))
      setGameStatus(GAME_LOSE);
    }
    const sweep = () => {
      setData(cells => {
        const tempCells = cells.slice();
        const scannedList = Array(cells.length).fill(false)
        const recursiveSweep = (index: number) => {
          if(scannedList[index]) return;
          const result = getArroundMinesCount(index);
          scannedList[index] = true;
          if(result !== NO_BOMB_ARROUND_CODE){
            tempCells[index] = result;
            return;
          }
          tempCells[index] = NO_BOMB_ARROUND_CODE;
          const coords = getAdjacentCoordinates(...indexToCoord(index, numberOfCellsInARow), maxIndexOfRow)
          coords.forEach(coord => {
            recursiveSweep(coordToIndex(coord, numberOfCellsInARow))
          })
        }
        recursiveSweep(targetIndex)
        return tempCells
      })
    }

    if(checkHitMine()){
      gameOver()
    }else{
      sweep()
    }
  }, [targetIndex, minesMap, mapIndex, numberOfCellsInARow])

  useEffect(()=>{
    const uncoveredCellsCount = data.slice().filter(cell => (cell !== COVERD_CODE && cell >= 0 && cell <= 8)).length;
    if(uncoveredCellsCount === totalCellsCount - totalMinesCount) setGameStatus(GAME_WIN);
  }, [data, totalCellsCount, numberOfCellsInARow, totalMinesCount])

  useEffect(()=>{
    setTargetIndex(undefined)
    setInit(false)
    setData(Array(totalCellsCount).fill(null))
  }, [totalCellsCount])

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
