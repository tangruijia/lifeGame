import World from './World'
import 'babel-polyfill'

// const docElm = document.documentElement
// docElm.webkitRequestFullScreen()
const body = document.getElementsByTagName('body')[0]
const canvas = <HTMLCanvasElement>document.getElementById('cvs')
canvas.width = body.clientWidth
canvas.height = body.clientHeight
const ctx = canvas.getContext('2d')



// 煮汤
function makeSoup(minX: number, maxX: number, minY: number, maxY: number, probability: number): number[][] {
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

const gameWorld = new World(makeSoup(20, 300, 20, 300, 0.37))
// 
// [0, 0],
// [3, 0],
// [4, 1],
// [4, 2],
// [4, 3],
// [3, 3],
// [2, 3],
// [1, 3],
// [0, 2],
// ==========
// [0, 0],
// [1, 1],
// [1, 2],
// [2, 0],
// [2, 1]

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
