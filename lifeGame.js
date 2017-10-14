const body = document.getElementsByTagName('body')[0]
const canvas = document.getElementById('cvs')
canvas.width = body.clientWidth
canvas.height = body.clientHeight
const ctx = canvas.getContext('2d')

class World {
  constructor(startArr) {
    // 记录游戏内的生命 {_0_0:true,_2_2:true}每个life的名字为x坐标_y坐标
    this.lives = {}
    // 记录生命的个数
    this.count = 0
    // 游戏的区域，随着生命的坐标增长而增长
    this.region = {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
    }
    // 暂存一轮游戏中出生/死亡的坐标，在统一处理后清空。
    this.dyingStash = []
    this.beingBornStash = []

    this.initLives(startArr)
  }
  // 初始化lives稀疏数组
  initLives(startArr) {
    const self = this
    // 初始化lives
    startArr.forEach(positionArr => this.signBeingBorn(...positionArr))
    this.beingBornStash.forEach(positionArr => this.born(...positionArr))
    this.beingBornStash.length = 0
  }
  // 获取world中坐标xy处是否存在生命
  isAliveAt(posStr) {
    return this.lives[posStr] ? true : false
  }
  // 标记为将出生
  signBeingBorn(x, y) {
    const positionArr = [x, y]
    this.beingBornStash.push(positionArr)
    // 记录下最大最小xy
    const {
      minX,
      maxX,
      minY,
      maxY
    } = this.region
    if (x < minX) this.region.minX = x
    if (y < minY) this.region.minY = y
    if (x > maxX) this.region.maxX = x
    if (y > maxY) this.region.maxY = y
  }
  // 标记为将死亡
  signDying(x, y) {
    const positionArr = [x, y]
    this.dyingStash.push(positionArr)
  }
  // 坐标xy处生存
  born(x, y) {
    const key = `_${x}_${y}`
    this.lives[key] = true
    this.count++
  }
  // 坐标xy处死亡
  kill(x, y) {
    const key = `_${x}_${y}`
    if (this.lives[key]) {
      this.lives[key] = false
    }
    this.count--
  }
  // 根据一个格子的周围8个格子标记生存死亡
  signBasisOfAround(x, y) {
    // 计算周围格子的坐标集合
    const posAround = [
      `_${x - 1}_${y - 1}`, `_${x}_${y - 1}`, `_${x + 1}_${y - 1}`,
      `_${x - 1}_${y }`, `_${x + 1}_${y}`,
      `_${x - 1}_${y + 1}`, `_${x}_${y + 1}`, `_${x + 1}_${y + 1}`
    ]
    // 数周围格子存活数
    const aliveNumAround = (() => {
      let count = 0
      posAround.forEach(posStr => {
        if (this.isAliveAt(posStr)) {
          count++
        }
      })
      return count
    })()
    // 游戏规则
    if (aliveNumAround === 2) {
      // 如果一个细胞周围有2个细胞为生，则该细胞的生死状态保持不变
    } else if (aliveNumAround === 3) {
      // 如果一个细胞周围有3个细胞为生，则该细胞为生，即该细胞若原先为死，则转为生，若原先为生，则保持不变
      if (!this.isAliveAt(`_${x}_${y}`)) {
        this.signBeingBorn(x, y)
      }
    } else {
      // 在其它情况下，该细胞为死，即该细胞若原先为生，则转为死，若原先为死，则保持不变
      if (this.isAliveAt(`_${x}_${y}`)) {
        this.signDying(x, y)
      }
    }
  }
  // 玩游戏
  playGame() {
    const {
      minX,
      maxX,
      minY,
      maxY
    } = this.region
    // 在区域长宽加1内玩游戏
    for (let i = minX - 1; i <= maxX + 1; i++) {
      for (let j = minY - 1; j <= maxY + 1; j++) {
        this.signBasisOfAround(i, j)
      }
    }
    // 标记完成后,杀死或诞生
    this.beingBornStash.forEach(positionArr => this.born(...positionArr))
    this.dyingStash.forEach(positionArr => this.kill(...positionArr))
    // 清除stash
    this.beingBornStash.length = 0
    this.dyingStash.length = 0
    // console.log({ ...this.lives
    // })
  }
}

// 煮汤
function makeSoup(minX, maxX, minY, maxY, probability) {
  let resArr = []
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

const gameWorld = new World(makeSoup(20, 100, 20, 100, 0.37))
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

setInterval(function () {
  console.time('time');
  // 大小
  const size = 5
  // 获取刷新区域
  const {
    minX,
    maxX,
    minY,
    maxY
  } = gameWorld.region
  const regionRectArgs = [minX - 1, minY - 1, (maxX - minX + 2) * size, (maxY - minY + 2) * size]
  // 清空刷新区域画布
  ctx.clearRect(...regionRectArgs)
  // 下一次游戏
  gameWorld.playGame()
  // 获取有生命的坐标
  const lives = gameWorld.lives
  const livesPosStrArr = Object.keys(lives).filter(key => lives[key])
  // 依据坐标画图
  livesPosStrArr.forEach(posStr => {
    // _1_2=>1_2=>[1,2]
    const positionArr = posStr.slice(1).split('_')
    const [x, y] = positionArr
    // 画方块
    ctx.fillRect(parseInt(x) * size, parseInt(y) * size, size, size)
  })
  // console.log(gameWorld.count);
  console.timeEnd('time');
}, 100)
