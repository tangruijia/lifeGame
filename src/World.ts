export default class World {
  lives: Map<string, boolean>
  count: number
  beingBornStash: string[]
  dyingStash: string[]
  constructor(startArr: number[][]) {
    // 记录游戏内的生命Map{0_0=>true,2_2=>true}每个life的key为_x坐标_y坐标
    this.lives = new Map<string, boolean>()
    // 记录生命的个数
    this.count = 0
    // 暂存一轮游戏中出生/死亡的坐标，在统一处理后清空。
    this.beingBornStash = []
    this.dyingStash = []
    // 初始化生命
    this.initLives(startArr)
  }
  // 初始化lives稀疏矩阵
  initLives(startArr: number[][]): void {
    const self = this
    // 初始化lives
    startArr.forEach(posArr => this.signBeingBorn(`${posArr[0]}_${posArr[1]}`))
    this.beingBornStash.forEach(posStr => this.born(posStr))
    this.beingBornStash.length = 0
  }
  // 坐标xy处是否存在生命
  isAliveAt(posStr: string): boolean {
    return this.lives.has(posStr) ? true : false
  }
  // 坐标xy处生存
  born(posStr: string): void {
    this.lives.set(posStr, true)
    this.count++
  }
  // 坐标xy处死亡
  kill(posStr: string): void {
    this.lives.delete(posStr)
    this.count--
  }
  // 标记为将出生
  signBeingBorn(posStr: string): void {
    this.beingBornStash.push(posStr)
  }
  // 标记为将死亡
  signDying(posStr: string): void {
    this.dyingStash.push(posStr)
  }
  // xy坐标=>以坐标为中间坐标的一个9宫格的位置x_y格式数组
  getArdSqrPosStrArr(x: number, y: number): string[] {
    const posStrArr: string[] = []
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        posStrArr.push(`${x + i}_${y + j}`)
      }
    }
    return posStrArr
  }
  // 根据一个格子的周围8个格子标记生存死亡
  signBasisOfAround(x: number, y: number): void {
    const posStr = `${x}_${y}`
    // 计算周围格子的坐标集合(包含中心)
    const posAround = this.getArdSqrPosStrArr(x, y)
    // 去除中心
    posAround.splice(4, 1)
    // 数周围格子存活数
    const aliveNumAround: number = (() => {
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
  playGame(): void {
    // activeRegion存放需要检测的单元格
    const activeRegion: Set<string> = new Set<string>()
    // 获取所有生命的坐标集合
    const livesPosStrArr = this.lives.keys()
    // 遍历所有生命的做标集合获得活动区域
    for (let posStr of livesPosStrArr) {
      // 获取生命的xy
      const posArr = <[number,number]>posStr.split('_').map(numStr => parseInt(numStr))
      // 获取生命的周围9格坐标
      const ardSqrPosStrArr = this.getArdSqrPosStrArr(posArr[0], posArr[1])
      // 将一个生命的周围9格加入activeRegion(自动去重)
      ardSqrPosStrArr.forEach(posStr => {
        activeRegion.add(posStr)
      })
    }
    // 确定所有需要检测的单元格后，遍历标记
    activeRegion.forEach(posStr => {
      const posArr = <[number,number]>posStr.split('_').map(numStr => parseInt(numStr))
      this.signBasisOfAround(posArr[0], posArr[1])
    })
    // 标记完成后,杀死或诞生
    this.beingBornStash.forEach(posStr => this.born(posStr))
    this.dyingStash.forEach(posStr => this.kill(posStr))
    // 清除stash
    this.beingBornStash.length = 0
    this.dyingStash.length = 0
  }
}