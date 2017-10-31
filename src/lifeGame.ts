import 'babel-polyfill'
import World from './World'
import { makeSoup } from './Factory'

// 鼠标是否按下的标志
let isMouseDown = false
// 记录鼠标按下位置
let mouseDownPosArr: [number, number] = [0, 0]
// 记录因一次鼠标拖动造成的偏移量
let deltaPosArrOnce: [number, number] = [0, 0]
// 记录积累的鼠标拖动造成的偏移量
let deltaPosArrSofar: [number, number] = [0, 0]
const body = document.getElementsByTagName('body')[0]
const canvas = <HTMLCanvasElement>document.getElementById('cvs')
canvas.width = body.clientWidth
canvas.height = body.clientHeight
const ctx = canvas.getContext('2d')
canvas.addEventListener('mousedown', (e) => {
  isMouseDown = true
  mouseDownPosArr[0] = e.x
  mouseDownPosArr[1] = e.y
})
canvas.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    deltaPosArrOnce[0] = e.x - mouseDownPosArr[0]
    deltaPosArrOnce[1] = e.y - mouseDownPosArr[1]
  }
})
canvas.addEventListener('mouseup', (e) => {
  deltaPosArrSofar[0] += deltaPosArrOnce[0]
  deltaPosArrSofar[1] += deltaPosArrOnce[1]
  deltaPosArrOnce = [0, 0]
  isMouseDown = false
})


const gameWorld = new World(makeSoup(20, 300, 20, 300, 0.37))

function go(): void {
  // console.time('time');
  // 大小
  const size = 5
  // 清空刷新区域画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // 下一次游戏
  gameWorld.playGame()
  // 获取有生命的坐标
  const lives = gameWorld.lives
  const livesPosStrArr = lives.keys()
  // 依据坐标画图
  for (let posStr of livesPosStrArr) {
    // _1_2=>1_2=>[1,2]
    const posArr = <[number, number]>posStr.split('_').map(numStr => parseInt(numStr))
    const [x, y] = posArr
    const deltaX = deltaPosArrOnce[0] + deltaPosArrSofar[0]
    const deltaY = deltaPosArrOnce[1] + deltaPosArrSofar[1]
    // 画方块
    ctx.fillRect(x * size + deltaX, y * size + deltaY, size, size)
  }
  // console.log(gameWorld.count);
  // console.timeEnd('time');
}

setInterval(go, 60)
