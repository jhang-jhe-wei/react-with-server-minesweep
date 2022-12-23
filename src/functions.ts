import { MAP_OBJECT } from './data/constants'
import { DataMapType } from './reducer';
export const indexToCoord = (index: number, numberOfCellsInARow: number): [number, number] => (
  [
    index % numberOfCellsInARow,
    Math.floor(index / numberOfCellsInARow)
  ]
)

export const coordToIndex = (point: [number, number], numberOfCellsInARow: number): number => (
  point[1] * numberOfCellsInARow + point[0]
)

export const putFlagOrKeepDataMap = (dataMap: DataMapType, index: number) => {
  if(dataMap[index] !== MAP_OBJECT.COVERED && dataMap[index] !== MAP_OBJECT.FLAG) return dataMap;
  return [
    ...dataMap.slice(0, index),
    dataMap[index] === MAP_OBJECT.FLAG ? MAP_OBJECT.COVERED: MAP_OBJECT.FLAG,
    ...dataMap.slice(index + 1),
  ]
}
