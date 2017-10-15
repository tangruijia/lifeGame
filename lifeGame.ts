const body:any = document.getElementsByTagName('body')[0]
const canvas:any = document.getElementById('cvs')
canvas.width = body.clientWidth
canvas.height = body.clientHeight
const ctx = canvas.getContext('2d')

class World {
  lives: Map<string,boolean>
  count: number
  beingBornStash: string[]
  dyingStash: string[]
  constructor(startArr: number[][]) {
    // 记录游戏内的生命 {_0_0:true,_2_2:true}每个life的名字为x坐标_y坐标
    this.lives = new Map<string,boolean>()
    // 记录生命的个数
    this.count = 0
    // 暂存一轮游戏中出生/死亡的坐标，在统一处理后清空。
    this.dyingStash = []
    this.beingBornStash = []

    this.initLives(startArr)
  }
  // 初始化lives稀疏数组
  initLives(startArr: number[][]) {
    const self = this
    // 初始化lives
    startArr.forEach(posArr => this.signBeingBorn(`_${posArr[0]}_${posArr[1]}`))
    this.beingBornStash.forEach(posStr => this.born(posStr))
    this.beingBornStash.length = 0
  }
  // 获取world中坐标xy处是否存在生命
  isAliveAt(posStr: string) {
    return this.lives.get(posStr) ? true : false
  }
  // 标记为将出生
  signBeingBorn(posStr: string) {
    this.beingBornStash.push(posStr)
  }
  // 标记为将死亡
  signDying(posStr: string) {
    this.dyingStash.push(posStr)
  }
  // 坐标xy处生存
  born(posStr: string) {
    this.lives.set(posStr,true)
    this.count++
  }
  // 坐标xy处死亡
  kill(posStr: string) {
    this.lives.delete(posStr)
    this.count--
  }
  // xy坐标=>以坐标为中间坐标的一个9宫格的位置_x_y格式数组
  getArdSqrPosStrArr(x: number, y: number) {
    const posStrArr: string[] = []
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        posStrArr.push(`_${x + i}_${y + j}`)
      }
    }
    return posStrArr
  }
  // 根据一个格子的周围8个格子标记生存死亡
  signBasisOfAround(x: number, y: number) {
    const posStr = `_${x}_${y}`
    // 计算周围格子的坐标集合(不包含中心)
    const posAround = this.getArdSqrPosStrArr(x, y)
    // 去除中心
    posAround.splice(4, 1)
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
      if (!this.isAliveAt(posStr)) {
        this.signBeingBorn(posStr)
      }
    } else {
      // 在其它情况下，该细胞为死，即该细胞若原先为生，则转为死，若原先为死，则保持不变
      if (this.isAliveAt(posStr)) {
        this.signDying(posStr)
      }
    }
  }
  // 玩游戏
  playGame() {
    // activeRegion存放需要检测的单元格
    const activeRegion: Set<string> = new Set()
    const livesPosStrArr = this.lives.keys()

    for(let posStr of livesPosStrArr){
      // 获取生命的xy
      const posArr = posStr.slice(1).split('_').map(numStr => parseInt(numStr))
      // 获取生命的周围9格坐标
      const ardSqrPosStrArr = this.getArdSqrPosStrArr(posArr[0],posArr[1])
      // 将一个生命的周围9格加入activeRegion(自动去重)
      ardSqrPosStrArr.forEach(posStr => {
        activeRegion.add(posStr)
      })
    }
    // 确定所有需要检测的单元格后，遍历标记
    activeRegion.forEach(posStr => {
      const posArr = posStr.slice(1).split('_').map(numStr => parseInt(numStr))
      this.signBasisOfAround(posArr[0],posArr[1])
    })
    // 标记完成后,杀死或诞生
    this.beingBornStash.forEach(posStr => this.born(posStr))
    this.dyingStash.forEach(posStr => this.kill(posStr))
    // 清除stash
    this.beingBornStash.length = 0
    this.dyingStash.length = 0
  }
}

// 煮汤
function makeSoup(minX: number, maxX: number, minY: number, maxY: number, probability: number) {
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

function go() {
  console.time('time');
  // 大小
  const size = 5
  // 获取刷新区域
  let minX = 0
  let maxX = 1000
  let minY = 0
  let maxY = 1000
  const regionRectArgs = [minX - 1, minY - 1, (maxX - minX + 2) * size, (maxY - minY + 2) * size]
  // 清空刷新区域画布
  ctx.clearRect(...regionRectArgs)
  // 下一次游戏
  gameWorld.playGame()
  // 获取有生命的坐标
  const lives = gameWorld.lives
  const livesPosStrArr = lives.keys()
  // 依据坐标画图
  for(let posStr of livesPosStrArr){
    // _1_2=>1_2=>[1,2]
    const posArr = posStr.slice(1).split('_')
    const [x, y] = posArr
    // 画方块
    ctx.fillRect(parseInt(x) * size, parseInt(y) * size, size, size)
  }
  console.log(gameWorld.count);
  console.timeEnd('time');
}

setInterval(go, 100)