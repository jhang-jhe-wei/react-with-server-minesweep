import { useState, useEffect, useCallback, useReducer } from 'react';
import Head from './components/Head';
import PlayField from './components/PlayField';
import ButtonField from './components/ButtonField';
import Footer from './components/Footer';
import Dialog from './components/Dialog';
import { randMinesMap, indexToCoord, getAdjacentCoordinates, coordToIndex } from './functions';
import { SHORT_CLICK_EVENT, NUMBER_OF_CELLS_IN_A_ROW, GAMEING } from './data/constants';
import Reducer, { initReducer, ReducerActions } from './reducer';

const MINE_CODE = 10
const HIT_MINE_CODE = 11
const NO_BOMB_ARROUND_CODE = 0
const FLAG_CODE = 9
const COVERD_CODE = null
const GAME_WIN = 'You Win!'
const GAME_LOSE = 'You Lose!'

const App = () => {
  const [state, dispatch] = useReducer(Reducer, 0, initReducer)
  const {
    mapIndex,
    totalCellsCount,
    totalMinesCount,
    gameStatus,
    hasCreatedMine: init
  } = state
  const [targetIndex, setTargetIndex] = useState<number>();
  const [data, setData] = useState<(number|null)[]>([]);
  const [minesMap, setMinesMap] = useState<boolean[]>([]);

  const initGame = useCallback(() => {
    setTargetIndex(undefined)
    dispatch({type: ReducerActions.SET_HAS_CREATED_MINES, payload: {
      hasCreatedMine: false
    }})
    setData(Array(totalCellsCount).fill(null))
    dispatch({type: ReducerActions.SET_GAME_STATUS, payload: {
      gameStatus: GAMEING
    }})
  }, [totalCellsCount])

  useEffect(() => {
    initGame()
  }, [initGame])

  const buttonClickHandler = (mapIndex: number) => {
    dispatch({type: ReducerActions.SET_MAP_INDEX, payload: {
      mapIndex
    }})
  }

  const clickHandler = (
    index: number,
    event: string
  ) => {
    if(event === SHORT_CLICK_EVENT) {
      if(!init){
        setMinesMap(randMinesMap(totalCellsCount, totalMinesCount, index))
        dispatch({type: ReducerActions.SET_HAS_CREATED_MINES, payload: {
          hasCreatedMine: true
        }})
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
    const numberOfCellsInARow = NUMBER_OF_CELLS_IN_A_ROW[mapIndex]
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
    setData(cells => {
      const gameOver = () => {
        cells = cells.map((cell, index) => {
          if(index === targetIndex) return HIT_MINE_CODE;
          return minesMap[index]? MINE_CODE: cell
        })
        dispatch({type: ReducerActions.SET_GAME_STATUS, payload: {
          gameStatus: GAME_LOSE
        }})
      }
      const sweep = () => {
        const scannedList = Array(cells.length).fill(false)
        const recursiveSweep = (index: number) => {
          if(scannedList[index]) return;
          const result = getArroundMinesCount(index);
          scannedList[index] = true;
          if(result !== NO_BOMB_ARROUND_CODE){
            cells[index] = result;
            return;
          }
          cells[index] = NO_BOMB_ARROUND_CODE;
          const coords = getAdjacentCoordinates(...indexToCoord(index, numberOfCellsInARow), maxIndexOfRow)
          coords.forEach(coord => {
            recursiveSweep(coordToIndex(coord, numberOfCellsInARow))
          })
        }
        recursiveSweep(targetIndex)
      }
      const checkNoUncoveredCells = () => {
        const uncoveredCellsCount = cells.filter(cell => (cell !== COVERD_CODE && cell >= 0 && cell <= 8)).length;
        return (uncoveredCellsCount === totalCellsCount - totalMinesCount)
      }

      if(checkHitMine()){
        gameOver()
      }else{
        sweep()
        if(checkNoUncoveredCells())
          dispatch({type: ReducerActions.SET_GAME_STATUS, payload: {
            gameStatus: GAME_WIN
          }})

      }
      return [...cells]
    })
  }, [targetIndex, minesMap, mapIndex, totalCellsCount, totalMinesCount])

  return (
    <div className="container">
      <Head/>
      <div className="play-field-container">
        { gameStatus !== GAMEING && <Dialog text={gameStatus} clickHandler={()=>initGame()} /> }
        <PlayField data={data} mapIndex={mapIndex} clickHandler={clickHandler}/>
      </div>
      <ButtonField clickHandler={buttonClickHandler}/>
      <Footer/>
    </div>
  );
}

export default App;
