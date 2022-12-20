import { MAP_OBJECT } from './data/constants'
export const generateRandMineMap = (
  cellsCount:number,
  minesCount: number,
  avoidIndex: number
):boolean[] => {

  let map = Array(cellsCount).fill(false);
  const random = (): number => {
    let random = Math.floor(Math.random() * cellsCount);
    while(random === avoidIndex || map[random]) random = Math.floor(Math.random() * cellsCount);
    return random;
  }
  [ ...Array(minesCount) ].forEach(() => map[random()] = true);
  return map;
}

export const getAdjacentCoordinates = (
  x: number,
  y:number,
  max:number
): [number, number][] => {
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

export const indexToCoord = (index: number, numberOfCellsInARow: number): [number, number] => (
  [
    index % numberOfCellsInARow,
    Math.floor(index / numberOfCellsInARow)
  ]
)

export const coordToIndex = (point: [number, number], numberOfCellsInARow: number): number => (
  point[1] * numberOfCellsInARow + point[0]
)

export const getAdjacentMinesCount = (
  index: number,
  numberOfCellsInARow: number,
  minesMap: boolean[]
) => {
  const maxIndexOfRow = numberOfCellsInARow - 1
  const [x, y] = indexToCoord(index, numberOfCellsInARow)
  const adjacentArray = getAdjacentCoordinates(x, y, maxIndexOfRow)
  let count = 0
  adjacentArray.forEach((point) => {
    const position = coordToIndex(point, numberOfCellsInARow)
    if(minesMap[position]) count += 1
  })
  return count
}

export const putFlagOrKeepDataMap = (dataMap: number[], index: number) => {
  if(dataMap[index] !== MAP_OBJECT.COVERED && dataMap[index] !== MAP_OBJECT.FLAG) return dataMap;
  return [
    ...dataMap.slice(0, index),
    dataMap[index] === MAP_OBJECT.FLAG ? MAP_OBJECT.COVERED: MAP_OBJECT.FLAG,
    ...dataMap.slice(index + 1),
  ]
}

export const checkNoUncoveredCells = (
  dataMap: number[],
  totalCellsCount: number,
  totalMinesCount: number
) => {
  const uncoveredCellsCount = dataMap.filter(cell => (cell !== MAP_OBJECT.COVERED && cell >= 0 && cell <= 8)).length;
  return (uncoveredCellsCount === totalCellsCount - totalMinesCount)
}

export const sweep = (
  targetIndex: number,
  dataMap: number[],
  minesMap: boolean[],
): number[] => {
  const scannedList = Array(dataMap.length).fill(false)
  const tempDataMap = dataMap.slice()
  const numberOfCellsInARow = Math.sqrt(dataMap.length)
  const maxIndexOfARow = numberOfCellsInARow - 1
  const recursiveSweep = (index: number) => {
    if(scannedList[index]) return;
    const result = getAdjacentMinesCount(index, numberOfCellsInARow, minesMap);
    scannedList[index] = true;
    if(result !== MAP_OBJECT.NO_BOMB_ARROUND){
      tempDataMap[index] = result;
      return;
    }
    tempDataMap[index] = MAP_OBJECT.NO_BOMB_ARROUND;
    const coords = getAdjacentCoordinates(...indexToCoord(index, numberOfCellsInARow), maxIndexOfARow)
    coords.forEach(coord => {
      recursiveSweep(coordToIndex(coord, numberOfCellsInARow))
    })
  }
  recursiveSweep(targetIndex)
  return tempDataMap
}


