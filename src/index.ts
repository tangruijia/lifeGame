import 'babel-polyfill'
import World from './World'
import { makeSoup } from './Factory'
import { handleMouseEvent, handleTouchEvent } from './EventHandler'
import { store } from './store'

const { body, canvas, ctx } = store

canvas.width = body.clientWidth
canvas.height = body.clientHeight
ctx.fillStyle = '#0077D2'

window.addEventListener('touchstart', handleTouchEvent, false)
window.addEventListener('touchmove', handleTouchEvent, false)
window.addEventListener('touchend', handleTouchEvent, false)

window.addEventListener('mousedown', handleMouseEvent, false)
window.addEventListener('mousemove', handleMouseEvent, false)
window.addEventListener('mouseup', handleMouseEvent, false)
window.addEventListener('dblclick', handleMouseEvent, false)

const gameWorld = new World(makeSoup(50, 200, 20, 120, 0.37))

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
    // 画方块
    ctx.fillRect(x * size + store.deltaPosArr[0], y * size + store.deltaPosArr[1], size, size)
  }
  // console.log(gameWorld.count);
  // console.timeEnd('time');
}

setInterval(go, 20)
