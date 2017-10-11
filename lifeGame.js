// {0_0:1,2_2:1}每个life的名字为x坐标_y坐标
class World {
  constructor(startArr) {
    // 记录游戏内的生命
    this.lives = {}
    // 游戏的区域，随着生命的坐标增长而增长
    this.region = {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
    }
    this.dyingStash = []
    this.beingBornStash = []
    this.initLives(startArr)
  }
  // 初始化lives稀疏数组
  initLives(startArr) {
    let self = this
    // 初始化lives
    startArr.forEach(positionArr => this.signBeingBorn(positionArr[0], positionArr[1]))
    this.beingBornStash.forEach(positionArr => this.born(...positionArr))
    this.beingBornStash.length = 0
    // 定义length
    Object.defineProperty(this.lives, 'length', {
      get() {
        return Object.keys(self.lives).length
      },
      set(){
        return
      }
    })
  }
  // 获取world中坐标xy处的值
  isAliveAt(x, y) {
    const key = `_${x}_${y}`
    return this.lives[key]
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
  }
  // 坐标xy处死亡
  kill(x, y) {
    const key = `_${x}_${y}`
    if (this.lives[key]) {
      delete this.lives[key]
    }
  }
  // 根据一个格子的周围8个格子标记生存死亡
  signBasisOfAround(x, y) {
    // 计算周围格子的坐标集合
    const posAround = ((x, y) => {
      let arr = []
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          arr.push([x + i, y + j])
        }
      }
      // 去除[x,y]
      arr.splice(4, 1)
      return arr
    })(x, y)
    // 数周围格子存活数
    const aliveNumAround = posAround.filter(positionArr => this.isAliveAt(...positionArr)).length

    if (aliveNumAround === 2) {
      // 如果一个细胞周围有2个细胞为生，则该细胞的生死状态保持不变
    } else if (aliveNumAround === 3) {
      // 如果一个细胞周围有3个细胞为生，则该细胞为生，即该细胞若原先为死，则转为生，若原先为生，则保持不变
      if (!this.isAliveAt(x, y)) {
        this.signBeingBorn(x, y)
      }
    } else {
      // 在其它情况下，该细胞为死，即该细胞若原先为生，则转为死，若原先为死，则保持不变
      if (this.isAliveAt(x, y)) {
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
    console.log({...this.lives})
  }
}
let gameWorld = new World([
  // 
  [0, 0],
  [3, 0],
  [4, 1],
  [4, 2],
  [4, 3],
  [3, 3],
  [2, 3],
  [1, 3],
  [0, 2],
  // ==========
  // [0,0],
  // [0,1],
  // [1,1],
  // [1,2],
  // [2,0]
])
// gameWorld.playGameTogether()
setInterval(function () {
  gameWorld.playGame()
}, 1000)
