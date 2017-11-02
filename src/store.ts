const deltaPosArr: [number, number] =[0,0]
const body = document.body
const canvas = <HTMLCanvasElement>document.getElementById('cvs')
const ctx = canvas.getContext('2d')

export const store = {
  deltaPosArr,
  body,
  canvas,
  ctx
}