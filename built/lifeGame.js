const body = document.getElementsByTagName('body')[0];
const canvas = document.getElementById('cvs');
canvas.width = body.clientWidth;
canvas.height = body.clientHeight;
const ctx = canvas.getContext('2d');
class World {
    constructor(startArr) {
        this.lives = new Map();
        this.count = 0;
        this.dyingStash = [];
        this.beingBornStash = [];
        this.initLives(startArr);
    }
    initLives(startArr) {
        const self = this;
        startArr.forEach(posArr => this.signBeingBorn(`_${posArr[0]}_${posArr[1]}`));
        this.beingBornStash.forEach(posStr => this.born(posStr));
        this.beingBornStash.length = 0;
    }
    isAliveAt(posStr) {
        return this.lives.get(posStr) ? true : false;
    }
    signBeingBorn(posStr) {
        this.beingBornStash.push(posStr);
    }
    signDying(posStr) {
        this.dyingStash.push(posStr);
    }
    born(posStr) {
        this.lives.set(posStr, true);
        this.count++;
    }
    kill(posStr) {
        this.lives.delete(posStr);
        this.count--;
    }
    getArdSqrPosStrArr(x, y) {
        const posStrArr = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                posStrArr.push(`_${x + i}_${y + j}`);
            }
        }
        return posStrArr;
    }
    signBasisOfAround(x, y) {
        const posStr = `_${x}_${y}`;
        const posAround = this.getArdSqrPosStrArr(x, y);
        posAround.splice(4, 1);
        const aliveNumAround = (() => {
            let count = 0;
            posAround.forEach(posStr => {
                if (this.isAliveAt(posStr)) {
                    count++;
                }
            });
            return count;
        })();
        if (aliveNumAround === 2) {
        }
        else if (aliveNumAround === 3) {
            if (!this.isAliveAt(posStr)) {
                this.signBeingBorn(posStr);
            }
        }
        else {
            if (this.isAliveAt(posStr)) {
                this.signDying(posStr);
            }
        }
    }
    playGame() {
        const activeRegion = new Set();
        const livesPosStrArr = this.lives.keys();
        for (let posStr of livesPosStrArr) {
            const posArr = posStr.slice(1).split('_').map(numStr => parseInt(numStr));
            const ardSqrPosStrArr = this.getArdSqrPosStrArr(posArr[0], posArr[1]);
            ardSqrPosStrArr.forEach(posStr => {
                activeRegion.add(posStr);
            });
        }
        activeRegion.forEach(posStr => {
            const posArr = posStr.slice(1).split('_').map(numStr => parseInt(numStr));
            this.signBasisOfAround(posArr[0], posArr[1]);
        });
        this.beingBornStash.forEach(posStr => this.born(posStr));
        this.dyingStash.forEach(posStr => this.kill(posStr));
        this.beingBornStash.length = 0;
        this.dyingStash.length = 0;
    }
}
function makeSoup(minX, maxX, minY, maxY, probability) {
    let resArr = [];
    let randomNum = 0;
    for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
            randomNum = Math.random();
            if (randomNum <= probability) {
                resArr.push([i, j]);
            }
        }
    }
    return resArr;
}
const gameWorld = new World(makeSoup(20, 300, 20, 300, 0.37));
function go() {
    console.time('time');
    const size = 5;
    let minX = 0;
    let maxX = 1000;
    let minY = 0;
    let maxY = 1000;
    const regionRectArgs = [minX - 1, minY - 1, (maxX - minX + 2) * size, (maxY - minY + 2) * size];
    ctx.clearRect(...regionRectArgs);
    gameWorld.playGame();
    const lives = gameWorld.lives;
    const livesPosStrArr = lives.keys();
    for (let posStr of livesPosStrArr) {
        const posArr = posStr.slice(1).split('_');
        const [x, y] = posArr;
        ctx.fillRect(parseInt(x) * size, parseInt(y) * size, size, size);
    }
    console.log(gameWorld.count);
    console.timeEnd('time');
}
setInterval(go, 100);
//# sourceMappingURL=lifeGame.js.map