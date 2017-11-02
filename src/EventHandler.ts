import {store} from './store'

// 鼠标是否按下的标志
let isMouseDown = false
// 记录鼠标按下位置
let mouseDownPosArr: [number, number] = [0, 0]
// 记录因一次鼠标拖动造成的偏移量
let deltaPosArrThis: [number, number] = [0, 0]
// 记录积累的鼠标拖动造成的偏移量
let deltaPosArrSofar: [number, number] = [0, 0]


export function handleMouseEvent(e: MouseEvent) {
  switch (e.type) {
    case 'mousedown':
      isMouseDown = true
      mouseDownPosArr[0] = e.x
      mouseDownPosArr[1] = e.y
      break
    case 'mousemove':
      e.preventDefault()
      if (isMouseDown) {
        deltaPosArrThis[0] = e.x - mouseDownPosArr[0]
        deltaPosArrThis[1] = e.y - mouseDownPosArr[1]
        store.deltaPosArr = [deltaPosArrThis[0] + deltaPosArrSofar[0], deltaPosArrThis[1] + deltaPosArrSofar[1]]
      }
      break
    case 'mouseup':
      deltaPosArrSofar[0] += deltaPosArrThis[0]
      deltaPosArrSofar[1] += deltaPosArrThis[1]
      deltaPosArrThis = [0, 0]
      isMouseDown = false
      store.deltaPosArr = [deltaPosArrThis[0] + deltaPosArrSofar[0], deltaPosArrThis[1] + deltaPosArrSofar[1]]
      break
    case 'dblclick':
      store.body.webkitRequestFullScreen()
      // 不知道为什么10毫秒好使
      setTimeout(() => {
        store.canvas.width = store.body.clientWidth
        store.canvas.height = store.body.clientHeight
        store.ctx.fillStyle = '#0077D2'
      }, 10)
      break
  }
}

export function handleTouchEvent(e: TouchEvent) {
  switch (e.type) {
    case 'touchstart':
      isMouseDown = true
      mouseDownPosArr[0] = e.touches[0].clientX
      mouseDownPosArr[1] = e.touches[0].clientY
      break
    case 'touchmove':
      e.preventDefault()
      if (isMouseDown) {
        deltaPosArrThis[0] = e.touches[0].clientX - mouseDownPosArr[0]
        deltaPosArrThis[1] = e.touches[0].clientY - mouseDownPosArr[1]
        store.deltaPosArr = [deltaPosArrThis[0] + deltaPosArrSofar[0], deltaPosArrThis[1] + deltaPosArrSofar[1]]
      }
      break
    case 'touchend':
      deltaPosArrSofar[0] += deltaPosArrThis[0]
      deltaPosArrSofar[1] += deltaPosArrThis[1]
      deltaPosArrThis = [0, 0]
      isMouseDown = false
      store.deltaPosArr = [deltaPosArrThis[0] + deltaPosArrSofar[0], deltaPosArrThis[1] + deltaPosArrSofar[1]]
      break
  }
}