function random(min, max) {
    return min + (Math.floor(Math.random() * (1 + max - min)))
}
var canvas, ctx, background;
let multiplier = 1;
function hm(i) {
    return Math.ceil((canvas.height / 1000) * i);
}
function wm(i) {
    i *= multiplier;
    return Math.ceil((canvas.width / 1000) * i)
}
function draw() {
    let background = document.getElementById("back");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.translate(wm(500), hm(300));
    for (let depth = 10; depth >= 1; depth--) {
        multiplier = depth / 10;
        ctx.fillStyle = (depth % 2 == 0 ? "rgb(54, 40, 13)" : "grey");
        for (let side of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(side * wm(-500), hm(500));
            ctx.lineTo(side * wm(-100), 0);
            ctx.bezierCurveTo(side * wm(-75), hm(-50), side * wm(-50), hm(-50), side * wm(-50), 0)
            ctx.lineTo(side * wm(-50), hm(500));
            ctx.fill();
        }
    }
    multiplier = 1
    ctx.fillStyle = "#ffffff";
    ctx.beginPath()
    ctx.moveTo(wm(50), hm(0))
    ctx.bezierCurveTo(wm(100), hm(-100), wm(-100), hm(-100), wm(-50), hm(0))
    ctx.fill();

    //ctx.addHitRegion({id: "Crator"})
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(wm(-50), hm(500));
    ctx.bezierCurveTo(wm(-200), hm(700), wm(200), hm(700), wm(50), hm(500))
    ctx.fill();
    //ctx.addHitRegion({id: "MagmaChamber"})
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.beginPath();
    ctx.moveTo(wm(-50), hm(500));
    ctx.lineTo(wm(50), hm(500))
    ctx.lineTo(wm(50), hm(0))
    ctx.lineTo(wm(-50), hm(0))
    ctx.fill();
    //ctx.addHitRegion({id: "MainVent"})
    ctx.beginPath();
    ctx.moveTo(wm(50), hm(180))
    ctx.lineTo(wm(50), hm(250))
    ctx.lineTo(wm(180), hm(100))
    ctx.lineTo(wm(150), hm(60))
    ctx.fill()
    //ctx.addHitRegion({id: "SecondaryVent"})
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
        let i = 0.01;
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
            grad.addColorStop(i, "red");
            grad.addColorStop(i, "rgba(255,255,255,0)");
            grad.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = grad;
            ctx.fill();
            i += 0.005
            if (i < 1) {
                requestAnimationFrame(lavaUp)
            } else {
                canvas.removeEventListener("contextmenu", download)
                requestAnimationFrame(draw)
                canvas.addEventListener("contextmenu", downloader)
                setInterval(() => {
                    bombs.push(new VolcanicBombs());
                }, 200)
            }
        }
        requestAnimationFrame(lavaUp)
        canvas.addEventListener("contextmenu", download)
        let ii = 0;
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
            if (ii > 2) {
                ii = 1.999;
            }
            if (ii <= 1) {
                let grad = ctx.createRadialGradient(wm(0), hm(0), wm(1), wm(0), hm(0), wm(700))
                grad.addColorStop(1, "rgba(255, 255, 255, 0)")
                grad.addColorStop(0, "red")
                grad.addColorStop(ii, "red")
                grad.addColorStop(ii, "rgba(255, 255, 255, 0)")
                ii += 0.001;
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
                //ctx.addHitRegion({id: "LavaFlow"});
            } else {
                let grad = ctx.createRadialGradient(wm(0), hm(0), wm(1), wm(0), hm(0), wm(700))
                grad.addColorStop(0, "red")
                grad.addColorStop(Math.max(0, 1 - (3 * (ii - 1))), "red")
                grad.addColorStop(1 - (ii - 1), "darkGrey")
                grad.addColorStop(1, "darkGrey")
                ii += 0.001;
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
                //ctx.addHitRegion({id: "LavaFlow"});
            }
        }
        let iiiii = 0
        function drawPyroclasticFlow() {
            if (iiiii > 0.5) {
                iiiii = 0.499999;
            }
            let grad = ctx.createRadialGradient(wm(0), hm(0), wm(1), wm(0), hm(0), wm(700))
            grad.addColorStop(1, "rgba(255, 255, 255, 0)")
            grad.addColorStop(0, "rgba(0, 0, 0, 0.75)")
            grad.addColorStop(iiiii * 1.5, "rgba(0, 0, 0, 0.75)")
            grad.addColorStop(Math.min(1, iiiii * 4), "rgba(255, 255, 255, 0)")
            iiiii += 0.001;
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
        function drawGas() {
            if (ii < 1.8) {
                ashes.push(new Ash())
                ctx.fillStyle = "darkGrey";
                for (let ash of ashes) {
                    ash.x += ash.vx;
                    ash.y += ash.vy;
                    ctx.fillRect(ash.x, ash.y, ash.radius, ash.radius);
                    ash.vy -= hm(1);
                }
                if (ashes.length >= 10) {
                    ashes.shift();
                }
            }
        }
        function drawBombs() {
            if (ii < 1.8) {
                ctx.fillStyle = "rgb(210, 188, 188)";
                ctx.beginPath()
                for (let bomb of bombs) {
                    bomb.x += bomb.vx;
                    bomb.y += bomb.vy;
                    ctx.rect(bomb.x, bomb.y, bomb.radius, bomb.radius);
                    bomb.vy += hm(0.5);
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
        let iii = 0;
        let iiii = 0;
        function drawAsh() {
            if (iii >= 0.999) {
                iii = 0.99;
            }
            if (iiii >= 0.999) {
                iiii = 0.99;
            }
            let grad = ctx.createRadialGradient(wm(10), hm(-200), hm(15), wm(300), hm(-200), hm(150));
            grad.addColorStop(1, "rgba(117, 117, 117, 0)");
            grad.addColorStop(iii, `rgba(117, 117, 117, ${iiii})`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(wm(-10), hm(-200));
            ctx.bezierCurveTo(wm(200), hm(-300), wm(300), hm(-250), wm(400), hm(-150));
            ctx.bezierCurveTo(wm(300), hm(-100), wm(200), hm(-50), wm(10), hm(-150));
            ctx.fill();
            grad = ctx.createRadialGradient(wm(-10), hm(-200), hm(15), wm(-300), hm(-200), hm(150));
            grad.addColorStop(1, "rgba(117, 117, 117, 0)");
            grad.addColorStop(iii, `rgba(117, 117, 117, ${iiii})`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(wm(10), hm(-200));
            ctx.bezierCurveTo(wm(-200), hm(-300), wm(-300), hm(-250), wm(-400), hm(-200));
            ctx.bezierCurveTo(wm(-300), hm(-100), wm(-200), hm(-50), wm(10), hm(-200));
            ctx.fill();
            grad = ctx.createRadialGradient(wm(0), hm(-200), hm(15), wm(0), hm(-200), wm(100));
            grad.addColorStop(1, "rgba(117, 117, 117, 0)");
            grad.addColorStop(iii, `rgba(117, 117, 117, ${iiii})`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(wm(-150), hm(-200));
            ctx.quadraticCurveTo(wm(0), hm(-300), wm(150), hm(-200));
            ctx.quadraticCurveTo(wm(0), hm(-50), wm(-150), hm(-200));
            ctx.fill();
            iii += 0.001;
            iiii += 0.005;
        }
        function draw(a = true) {
            if (a) {
                ctx.clearRect(wm(-500), hm(-300), wm(1000), hm(1000))
            }
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
        this.vy = random(hm(1), hm(10))
        this.radius = random(wm(10), wm(30))
        this.x = 0;
        this.y = 0;
    }
}
class VolcanicBombs {
    constructor() {
        this.vx = random(0, 1) ? random(wm(20), wm(40)) : -random(wm(20), wm(40));
        this.vy = -random(hm(40), hm(70))
        this.radius = random(wm(40), wm(80))
        this.x = 0;
        this.y = 0;
    }
}
document.addEventListener("DOMContentLoaded", draw, false);