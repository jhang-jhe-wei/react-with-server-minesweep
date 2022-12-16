import { NUMBER_OF_CELLS_IN_A_ROW } from './data/constants';

export const randMinesMap = (mapIndex:number, size: number, avoidIndex: number): boolean[] => {
  const random = (): number => {
    let random = Math.floor(Math.random() * size);
    while(random === avoidIndex) random = Math.floor(Math.random() * size);
    return random;
  }

  let map = Array(size).fill(false);
  [ ...Array(NUMBER_OF_CELLS_IN_A_ROW[mapIndex]) ].forEach(() => map[random()] = true);
  return map;
}

export const getAdjacentCoordinates = (x: number, y:number, max:number): [number, number][] => {
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

