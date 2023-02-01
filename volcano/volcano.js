function random(min, max) {
    return min + (Math.floor(Math.random() * (1 + max - min)))
}
var canvas, ctx, background;
function hm(i) {
    return Math.ceil((canvas.height / 1000) * i);
}
function wm(i) {
    return Math.ceil((canvas.width / 1000) * i)
}
function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect()
    return [
        ((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width) - wm(500),
        ((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height) - hm(300)
    ]
}
const locations = []
async function react(e) {
    [x, y] = getMousePosition(e)
    if (x < wm(500)) {
        for (let location of locations) {
            let name
            if (name = location(e)) {
                document.getElementById("object").innerHTML = name
                await new Promise(r => setTimeout(r, 200))
                document.addEventListener("mousemove", react, {once: true})
                return
            }
        }
    }
    document.getElementById("object").innerHTML = ""
    document.addEventListener("mousemove", react, {once: true})
}
document.addEventListener("mousemove", react, {once: true})
function draw() {
    let background = document.getElementById("back");
    canvas = document.getElementById("canvas");
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth * 6 / 10
    ctx = canvas.getContext("2d");
    ctx.translate(wm(500), hm(300));
    for (let depth = 20; depth >= 1; depth--) {
        let multiplier = depth / 20;
        let down = hm(500) * ( 1 - multiplier)
        ctx.fillStyle = (depth % 2 == 0 ? "rgb(54, 40, 13)" : "grey");
        for (let side = -1; side < 2; side += 2) {
            ctx.beginPath();
            ctx.moveTo(side * multiplier * wm(-500), hm(500));
            ctx.lineTo(side * wm(-100), down);
            ctx.bezierCurveTo(side * wm(-75), hm(-50) + down, side * wm(-50), hm(-50) + down, side * wm(-50), down)
            ctx.lineTo(side * wm(-50), hm(500));
            ctx.fill();
        }
    }
    let gradient = (hm(-50) - hm(500)) / (wm(-500) - wm(-75))
    locations.push((e) => {
        [x, y] = getMousePosition(e)
        for (let side = -1; side < 2; side += 2) {
            if (side * x < wm(-50) && y < hm(500) && (side * gradient * x) + y > (gradient * wm(-75)) + hm(-50)) {
                return "Base"
            }
        }
        return ""
    })
    ctx.fillStyle = "#ffffff";
    ctx.beginPath()
    ctx.moveTo(wm(50), hm(0))
    ctx.bezierCurveTo(wm(100), hm(-100), wm(-100), hm(-100), wm(-50), hm(0))
    ctx.fill();
    locations.unshift((e) => {
        [x, y] = getMousePosition(e)
        if (y > hm(-50) && (x - wm(0)) ** 2 + (y - hm(20)) ** 2 < wm(70) ** 2) {
            return "Crator"
        }
        return ""
    })

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(wm(-50), hm(500));
    ctx.bezierCurveTo(wm(-200), hm(700), wm(200), hm(700), wm(50), hm(500))
    ctx.fill();
    locations.push((e) => {
        [x, y] = getMousePosition(e)
        if (x ** 2 + (y - hm(600)) ** 2 < wm(100) ** 2) {
            return "Magma Chamber"
        }
        return ""
    })
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.beginPath();
    ctx.moveTo(wm(-50), hm(500));
    ctx.lineTo(wm(50), hm(500))
    ctx.lineTo(wm(50), hm(0))
    ctx.lineTo(wm(-50), hm(0))
    ctx.fill();
    locations.unshift((e) => {
        [x, y] = getMousePosition(e)
        if (Math.abs(x) < wm(50) && y > hm(0) && y < hm(500)) {
            return "Main Vent"
        }
        return ""
    })
    ctx.beginPath();
    ctx.moveTo(wm(50), hm(180))
    ctx.lineTo(wm(50), hm(250))
    ctx.lineTo(wm(180), hm(100))
    ctx.lineTo(wm(150), hm(60))
    ctx.fill()
    let grad2 = (hm(250) - hm(100)) / (wm(50) - wm(180))
    let grad3 = (hm(180) - hm(60)) / (wm(50) - wm(150))
    locations.unshift((e) => {
        [x, y] = getMousePosition(e)
        if (x > wm(50) && (gradient * -x) + y > (gradient * wm(-75)) + hm(-50) && (grad2 * -x) + y < (grad2 * -wm(50)) + hm(250) && (grad3 * -x) + y > (grad3 * -wm(50)) + hm(180)) {
            return "Secondary Vent"
        }
        return ""
    })
    canvas.addEventListener("click", () => {
        background.style.backgroundImage = `url(${canvas.toDataURL()})`;
        ctx.clearRect(wm(-500), hm(-300), wm(1000), hm(1000))
        ctx.beginPath()
        ctx.moveTo(wm(-50), hm(500))
        ctx.lineTo(wm(-50), hm(0))
        ctx.lineTo(wm(50), hm(0))
        ctx.lineTo(wm(50), hm(180))
        ctx.lineTo(wm(150), hm(60))
        ctx.lineTo(wm(180), hm(100))
        ctx.lineTo(wm(50), hm(250))
        ctx.lineTo(wm(50), hm(500))
        let lavaHeight = 0.01;
        function download(event) {
            event.preventDefault();
            let img = new Image();
            img.src = getComputedStyle(document.getElementById("back")).backgroundImage.split('url("')[1].split('\")')[0]
            img.onload = () => {
                ctx.drawImage(img, wm(-500), hm(-300), wm(1000), hm(1000))
                lavaUp();
                let src = canvas.toDataURL();
                ctx.clearRect(wm(-500), hm(-300), wm(1000), hm(1000))
                let ima = document.createElement("img");
                ima.src = src;
                document.body.append(document.createElement("br"), ima);
            }
        }
        function downloader(event) {
            event.preventDefault();
            let img = new Image();
            img.src = getComputedStyle(document.getElementById("back")).backgroundImage.split('url("')[1].split('\")')[0]
            img.onload = () => {
                ctx.clearRect(wm(-500), hm(-300), wm(1000), hm(1000))
                ctx.drawImage(img, wm(-500), hm(-300), wm(1000), hm(1000))
                draw(false);
                let src = canvas.toDataURL();
                ctx.clearRect(wm(-500), hm(-300), wm(1000), hm(1000))
                let ima = document.createElement("img");
                ima.src = src;
                document.body.append(document.createElement("br"), ima);
            }
        }
        function lavaUp() {
            let grad = ctx.createLinearGradient(wm(0), hm(500), wm(0), hm(0))
            grad.addColorStop(0, "red");
            grad.addColorStop(lavaHeight, "red");
            grad.addColorStop(lavaHeight, "rgba(255,255,255,0)");
            grad.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = grad;
            ctx.fill();
            lavaHeight += 0.005
            if (lavaHeight < 1) {
                requestAnimationFrame(lavaUp)
            } else {
                {
                    let ranges = document.getElementById("ranges")
                    ranges.style.visibility = "visible"
                }
                {
                    let speedRange = document.getElementById("speedRange")
                    let speedDisplay = document.getElementById("speed")
                    speedRange.addEventListener("input", (e) => {
                        speed = 10 ** speedRange.value
                        speedDisplay.innerHTML = Math.round(speed * 100) / 100
                    })
                }
                
                timeRange.addEventListener("input", (e) => {
                    time = timeRange.value
                    timeDisplay.innerHTML = time
                })
                
                canvas.removeEventListener("contextmenu", download)
                requestAnimationFrame(draw)
                canvas.addEventListener("contextmenu", downloader)
                function addBomb() {
                    bombs.push(new VolcanicBomb())
                    setTimeout(addBomb, 200 / speed)
                }
                setTimeout(addBomb, 200)
            }
        }
        let speed = 1
        let timeDisplay = document.getElementById("time")
        requestAnimationFrame(lavaUp)
        canvas.addEventListener("contextmenu", download)
        let time = 0;
        let timeRange = document.getElementById("timeRange")
        let bombs = [], ashes = [];
        function drawLava() {
            ctx.beginPath()
            ctx.moveTo(wm(-50), hm(500))
            ctx.lineTo(wm(-50), hm(0))
            ctx.lineTo(wm(50), hm(0))
            ctx.lineTo(wm(50), hm(180))
            ctx.lineTo(wm(150), hm(60))
            ctx.lineTo(wm(180), hm(100))
            ctx.lineTo(wm(50), hm(250))
            ctx.lineTo(wm(50), hm(500))
            ctx.fillStyle = "red";
            ctx.fill();
        }
        function drawLavaFlow() {
            if (time <= 1) {
                let grad = ctx.createRadialGradient(0, 0, 1, 0, 0, (wm(500) ** 2 + hm(500) ** 2) ** 0.5)
                grad.addColorStop(1, "rgba(255, 255, 255, 0)")
                grad.addColorStop(0, "red")
                try {
                    grad.addColorStop(time, "red")
                    grad.addColorStop(time, "rgba(255, 255, 255, 0)")
                } catch {}
                ctx.beginPath();
                ctx.moveTo(wm(-500), hm(500));
                ctx.lineTo(wm(-100), 0);
                ctx.bezierCurveTo(wm(-75), hm(-50), wm(-50), hm(-50), wm(-50), 0)
                ctx.lineTo(wm(50), 0)
                ctx.bezierCurveTo(wm(50), hm(-50), wm(75), hm(-50), wm(100), 0)
                ctx.lineTo(wm(500), hm(500));
                ctx.lineTo(wm(500), hm(490))
                ctx.lineTo(wm(70), hm(-80));
                ctx.lineTo(wm(-70), hm(-80))
                ctx.lineTo(wm(-500), hm(490));
                ctx.fillStyle = grad;
                ctx.fill();
            } else {
                let grad = ctx.createRadialGradient(0, 0, 1, 0, 0, (wm(500) ** 2 + hm(500) ** 2) ** 0.5)
                grad.addColorStop(0, "red")
                try {
                    grad.addColorStop(Math.max(Number.EPSILON, 1 - (3 * (time - 1))), "red")
                    grad.addColorStop(1 - Math.min(1-Number.EPSILON, time - 1), "darkGrey")
                } catch {}
                grad.addColorStop(1, "darkGrey")
                ctx.beginPath();
                ctx.moveTo(wm(-500), hm(500));
                ctx.lineTo(wm(-100), 0);
                ctx.bezierCurveTo(wm(-75), hm(-50), wm(-50), hm(-50), wm(-50), 0)
                ctx.lineTo(wm(50), 0)
                ctx.bezierCurveTo(wm(50), hm(-50), wm(75), hm(-50), wm(100), 0)
                ctx.lineTo(wm(500), hm(500));
                ctx.lineTo(wm(500), hm(490))
                ctx.lineTo(wm(70), hm(-80));
                ctx.lineTo(wm(-70), hm(-80))
                ctx.lineTo(wm(-500), hm(490));
                ctx.fillStyle = grad;
                ctx.fill();
            }
        }
        locations.push((e) => {
            [x, y] = getMousePosition(e)
            let isAbove = gradient*x + y < gradient * wm(-75) + hm(-50) || -gradient*x + y < gradient * wm(-75) + hm(-50) || y < hm(-50)
            let newGrad = (hm(-80) - hm(490)) / (wm(-70) - wm(-500))
            let isBelow = newGrad * x + y > newGrad * -wm(-70) + hm(-80) && -newGrad * x + y > newGrad * -wm(-70) + hm(-80) && y > hm(-80)
            let dist = (wm(500) ** 2 + hm(500) ** 2) * (Math.min(1, time) ** 2)
            let isLava = x ** 2 + y ** 2 < dist
            if (isAbove && isBelow && isLava) {
                return "Lava"
            }
            return ""
        })
        function drawPyroclasticFlow() {
            let grad = ctx.createRadialGradient(0, 0, 1, 0, 0, (wm(500) ** 2 + hm(500) ** 2) ** 0.5)
            grad.addColorStop(1, "rgba(255, 255, 255, 0)")
            grad.addColorStop(0, "rgba(0, 0, 0, 0.75)")
            try {
                grad.addColorStop(Math.min(1-Number.EPSILON, time * 1.5), "rgba(0, 0, 0, 0.75)")
                grad.addColorStop(Math.min(1-Number.EPSILON, time * 4), "rgba(255, 255, 255, 0)")
            } catch {}
            ctx.beginPath();
            ctx.moveTo(wm(-500), hm(500));
            ctx.lineTo(wm(-100), 0);
            ctx.bezierCurveTo(wm(-75), hm(-50), wm(-50), hm(-50), wm(-50), 0)
            ctx.lineTo(wm(50), 0)
            ctx.bezierCurveTo(wm(50), hm(-50), wm(75), hm(-50), wm(100), 0)
            ctx.lineTo(wm(500), hm(500));
            ctx.lineTo(wm(500), hm(400))
            ctx.lineTo(wm(100), hm(-100));
            ctx.lineTo(wm(-100), hm(-100))
            ctx.lineTo(wm(-500), hm(400));
            ctx.fillStyle = grad;
            ctx.fill();
        }
        locations.push((e) => {
            [x, y] = getMousePosition(e)
            let isAbove = gradient*x + y < gradient * wm(-75) + hm(-50) || -gradient*x + y < gradient * wm(-75) + hm(-50) || y < hm(-50)
            let newGrad = (hm(-100) - hm(400)) / (wm(-100) - wm(-500))
            let isBelow = newGrad * x + y > newGrad * -wm(-100) + hm(-100) && -newGrad * x + y > newGrad * -wm(-100) + hm(-100) && y > hm(-100)
            let dist = (wm(500) ** 2 + hm(500) ** 2) * (Math.min(1, time * 4) ** 2)
            let isLava = x ** 2 + y ** 2 < dist
            if (isAbove && isBelow && isLava) {
                return "Pyroclastic Flow"
            }
            return ""
        })
        let attempts = 0
        function drawGas() {
            if (time < 1.8) {
                ashes.push(new Ash())
                ctx.fillStyle = "darkGrey";
                for (let ash of ashes) {
                    ash.x += ash.vx * speed;
                    ash.y += ash.vy * speed;
                    ctx.fillRect(ash.x, ash.y, ash.radius, ash.radius);
                    ash.vy -= hm(10) * speed;
                }
                period = Math.max(1, 1 / speed)
                if (++attempts >= period) {
                    attempts -= period
                    return
                }
                if (ashes.length >= 10) {
                    ashes.shift();
                }
            }
        }
        function drawBombs() {
            console.log(bombs)
            if (time < 1.8) {
                ctx.fillStyle = "rgb(210, 188, 188)";
                ctx.beginPath()
                for (let bomb of bombs) {
                    if (Math.floor(time * 1000) % 2 == 0) {
                        bomb.x += bomb.vx * speed;
                        bomb.y += bomb.vy * speed;
                        bomb.vy += hm(4) * speed;
                    }
                    ctx.rect(bomb.x, bomb.y, bomb.radius, bomb.radius);
                }
                ctx.fill();
                ctx.fillStyle = "rgba(255, 255, 255, 0)";
                ctx.beginPath()
                ctx.moveTo(wm(50), hm(0))
                ctx.bezierCurveTo(wm(100), hm(-100), wm(-100), hm(-100), wm(-50), hm(0))
                ctx.fill();
                if (bombs.length >= 5) {
                    bombs.shift();
                }
            }
        }
        locations.unshift((e) => {
            [x, y] = getMousePosition(e);
            for (let bomb of bombs) {
                if ((x - bomb.x) ** 2 + (y - bomb.y) ** 2 < 2 * bomb.radius ** 2) {
                    return "Volcanic Bomb"
                }
                return ""
            }
        })
        function drawAsh() {
            let grad = ctx.createRadialGradient(wm(10), hm(-200), hm(15), wm(300), hm(-200), hm(150));
            grad.addColorStop(1, "rgba(117, 117, 117, 0)");
            try {
                grad.addColorStop(Math.min(1-Number.EPSILON, time), `rgba(117, 117, 117, ${Math.min(1-Number.EPSILON, time)})`);
            } catch {}
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(wm(-10), hm(-200));
            ctx.bezierCurveTo(wm(200), hm(-300), wm(300), hm(-250), wm(400), hm(-150));
            ctx.bezierCurveTo(wm(300), hm(-100), wm(200), hm(-50), wm(10), hm(-150));
            ctx.fill();
            grad = ctx.createRadialGradient(wm(-10), hm(-200), hm(15), wm(-300), hm(-200), hm(150));
            grad.addColorStop(1, "rgba(117, 117, 117, 0)");
            try {
                grad.addColorStop(Math.min(1 - Number.EPSILON, time), `rgba(117, 117, 117, ${Math.min(1 - Number.EPSILON, time)})`);
            } catch {}
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(wm(10), hm(-200));
            ctx.bezierCurveTo(wm(-200), hm(-300), wm(-300), hm(-250), wm(-400), hm(-200));
            ctx.bezierCurveTo(wm(-300), hm(-100), wm(-200), hm(-50), wm(10), hm(-200));
            ctx.fill();
            grad = ctx.createRadialGradient(wm(0), hm(-200), hm(15), wm(0), hm(-200), wm(100));
            grad.addColorStop(1, "rgba(117, 117, 117, 0)");
            try {
                grad.addColorStop(Math.min(1 - Number.EPSILON, time), `rgba(117, 117, 117, ${Math.min(1 - Number.EPSILON, time)})`);
            } catch {}
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(wm(-150), hm(-200));
            ctx.quadraticCurveTo(wm(0), hm(-300), wm(150), hm(-200));
            ctx.quadraticCurveTo(wm(0), hm(-50), wm(-150), hm(-200));
            ctx.fill();
        }
        locations.push((e) => {
            [x, y] = getMousePosition(e)
            if (y < hm(-100) && Math.abs(x) < wm(250) && time > 0) {
                return "Ash Cloud"
            }
            return ""
        })
        function draw(a = true) {
            if (a) {
                ctx.clearRect(wm(-500), hm(-300), wm(1000), hm(1000))
            }
            time = Math.min(2, time + 0.001 * speed)
            if (isNaN(time)) {
                time = +timeDisplay.innerHTML
                requestAnimationFrame(draw)
                return
            }
            timeRange.value = time
            timeDisplay.innerHTML = Math.round(time * 1000) / 1000
            drawGas();
            drawPyroclasticFlow();
            drawLava();
            drawLavaFlow();
            drawBombs();
            drawAsh();
            requestAnimationFrame(draw)
        }
    }, { once: true })
}
class Ash {
    constructor() {
        this.vx = random(0, 1) ? random(wm(3), wm(10)) : -random(wm(3), wm(10));
        this.vy = random(hm(0), hm(4))
        this.radius = random(wm(10), wm(30))
        this.x = 0;
        this.y = 0;
    }
}
class VolcanicBomb {
    constructor() {
        this.vx = random(0, 1) ? random(wm(15), wm(30)) : -random(wm(15), wm(30));
        this.vy = -random(hm(30), hm(55))
        this.radius = random(wm(55), wm(90))
        this.x = 0;
        this.y = 0;
    }
}
document.addEventListener("DOMContentLoaded", draw, false);
