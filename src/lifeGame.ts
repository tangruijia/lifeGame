import 'babel-polyfill'
import World from './World'
import {makeSoup} from './Factory'

// const docElm = document.documentElement
// docElm.webkitRequestFullScreen()
const body = document.getElementsByTagName('body')[0]
const canvas = <HTMLCanvasElement>document.getElementById('cvs')
canvas.width = body.clientWidth
canvas.height = body.clientHeight
const ctx = canvas.getContext('2d')


const gameWorld = new World(makeSoup(20, 300, 20, 300, 0.37))

function go(): void {
  console.time('time');
  // 大小
  const size = 5
  // 获取刷新区域
  let minX = 0
  let maxX = 1000
  let minY = 0
  let maxY = 1000
  // 清空刷新区域画布
  ctx.clearRect(minX - 1, minY - 1, (maxX - minX + 2) * size, (maxY - minY + 2) * size)
  // 下一次游戏
  gameWorld.playGame()
  // 获取有生命的坐标
  const lives = gameWorld.lives
  const livesPosStrArr = lives.keys()
  // 依据坐标画图
  for (let posStr of livesPosStrArr) {
    // _1_2=>1_2=>[1,2]
    const posArr = posStr.split('_')
    const [x, y] = posArr
    // 画方块
    ctx.fillRect(parseInt(x) * size, parseInt(y) * size, size, size)
  }
  console.log(gameWorld.count);
  console.timeEnd('time');
}

setInterval(go, 100)
