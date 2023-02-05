let canvas, ctx
function hm(i) {
    return Math.ceil((canvas.height / 1000) * i);
}
function wm(i) {
    return Math.ceil((canvas.width / 1000) * i)
}
//function getMousePosition(e) {
//    const rect = canvas.getBoundingClientRect()
//    return [
//        ((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width) - wm(500),
//        ((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height) - hm(300)
//    ]
//}
let waves = []
addEventListener("load", () => {
	canvas = document.getElementById("canvas")
	canvas.height = window.innerHeight * 19 / 20
	canvas.width = window.innerWidth * 7 / 10
	ctx = canvas.getContext("2d")
	ctx.lineWidth = hm(2)
	checkbox = document.getElementById("full")
	draw()
})
let timer = 0
let checkbox
function draw() {
	if (timer == 0) {
		waves.push(checkbox.checked?new SimpleWavefront([wm(-100), hm(-150)], [wm(1300), hm(-500)]):new SimpleWavefront([wm(100), hm(150)], [wm(300), hm(50)]))
	}
	timer = (timer + 1) % 50
	ctx.clearRect(0, 0, wm(1000), hm(1000))
	ctx.fillStyle = "blue"
	ctx.fillRect(0, hm(400), wm(1000), hm(350))
	waves.forEach(x => x.render())
	waves = waves.map(x => x.move())
	requestAnimationFrame(draw)
}


function getSpeed(x, y) {
	if (y > hm(400) && y <= hm(750)) {
		return Math.max(wm(0.5), wm(1000)/canvas.width)
	}
	return Math.max(wm(1), wm(2000)/canvas.width)
}

class Wavefront {} 
class SimpleWavefront extends Wavefront {
	constructor(start, end, color = "#000000") {
		super()
		this.start = start
		this.end = end
		this.color = color
	}
	render() {
		if (this.start[1] > hm(1000) && this.end[1] > hm(1000)) {
			waves.push()
			return
		}
		ctx.strokeStyle = this.color
		ctx.beginPath()
		ctx.moveTo(...this.start)
		ctx.lineTo(...this.end)
		ctx.stroke()
	}
	move() {
		let gradient = (this.end[0] - this.start[0]) / (this.end[1] - this.start[1]) //I know this is technically the recipricol of the gradient as its ∆x/∆y, not ∆y/∆x, but it makes things easier later on
		let direction = -1 / gradient
		let newpoints = [[...this.start], [...this.end]]
		let past
		for (let point of [newpoints[0], newpoints[1]]) {
			let dist = getSpeed(...point) / (Math.abs(direction) + 1)
			point[0] += direction * dist
			point[1] += dist
			let speed = getSpeed(...point)
			if (speed != (past ?? speed)) {
				if (point[1] < newpoints[0][1]) {		
					point = newpoints[0]
				}
				let diffy = hm(750) - point[1]
				if (diffy > 0) {
					diffy = hm(400) - point[1]
				}
				let diffx = diffy * gradient
				newpoints.splice(1, 0, [point[0] + diffx, point[1] + diffy])
			}
			past = speed
		}
		if (newpoints.length == 3) {
			return new RefractedWavefront(...newpoints, this.color)
		}
		return new SimpleWavefront(...newpoints, this.color)
	}


}
class RefractedWavefront extends Wavefront {
	constructor(start, middle, end, color = "#000000") {
		super()
		this.start = start
		this.middle = middle
		this.end = end
		this.color = color
	}
	render() {
		ctx.strokeStyle = this.color
		ctx.beginPath()
		ctx.moveTo(...this.start)
		ctx.lineTo(...this.middle)
		ctx.lineTo(...this.end)
		ctx.stroke()
	}
	move() {
		let waves = [new SimpleWavefront(this.start, this.middle), new SimpleWavefront(this.middle, this.end)]
		waves = waves.map(x => x.move())
		if (waves[1] instanceof RefractedWavefront || waves[0] instanceof RefractedWavefront) {
			return new RefractedWavefront(waves[0].start, waves[0].middle ?? waves[1].middle, waves[1].end, this.color)
		}
		return new SimpleWavefront(waves[0].start, waves[1].end, this.color)
	}
}
