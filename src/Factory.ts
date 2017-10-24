// 煮汤
export const makeSoup = function makeSoup(minX: number, maxX: number, minY: number, maxY: number, probability: number): number[][] {
  let resArr: number[][] = []
  let randomNum = 0
  for (let i = minX; i <= maxX; i++) {
    for (let j = minY; j <= maxY; j++) {
      randomNum = Math.random()
      if (randomNum <= probability) {
        resArr.push([i, j])
      }
    }
  }
  return resArr
}
// 飞船
export const makeLWSS = function (): number[][] {
  const resArr = [
    [0, 0],
    [3, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [3, 3],
    [2, 3],
    [1, 3],
    [0, 2],
  ]
  return resArr
}
// 滑翔机
export const makeGlider = function (): number[][] {
  const resArr = [
    [0, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
  ]
  return resArr
}