const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let enemigos = [];
let eliminados = 0;
let nivel = 1;
let totalPorNivel = 10;
let scoreMax = 0;

let mouse = { x: 0, y: 0 };

canvas.addEventListener("mousemove", e => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});

canvas.addEventListener("click", () => {
    enemigos.forEach(e => {
        let dist = Math.hypot(mouse.x - e.x, mouse.y - e.y);
        if (dist < e.size) e.eliminando = true;
    });
});

class Enemigo {
    constructor() {
        this.reset();
        this.alpha = 1;
        this.eliminando = false;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        ctx.drawImage(img, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);

        ctx.restore();
    }

    update() {
        let dist = Math.hypot(mouse.x - this.x, mouse.y - this.y);

        if (dist < this.size) {
            ctx.shadowColor = "red";
            ctx.shadowBlur = 20;
        } else {
            ctx.shadowBlur = 0;
        }

        if (this.eliminando) {
            this.alpha -= 0.02;
            this.size -= 0.3;

            if (this.alpha <= 0) {
                eliminados++;
                this.reset();
            }
        }

        this.x += this.dx;
        this.y += this.dy;

        this.dx += (Math.random() - 0.5) * 0.2;

        if (this.y < -50) this.reset();

        this.draw();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 200;
        this.size = Math.random() * 30 + 20;

        let speed = 1 + nivel;
        this.dx = (Math.random() - 0.5) * speed;
        this.dy = -Math.random() * speed;

        this.alpha = 1;
        this.eliminando = false;
    }
}

const img = new Image();
img.src = "img/enemigo.png";

function crearEnemigos() {
    enemigos = [];
    for (let i = 0; i < 15; i++) {
        enemigos.push(new Enemigo());
    }
}

crearEnemigos();

function HUD() {
    let porcentaje = ((eliminados % totalPorNivel) / totalPorNivel * 100).toFixed(1);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText("Eliminados: " + eliminados, 20, 30);
    ctx.fillText("Nivel: " + nivel, 20, 60);
    ctx.fillText("Progreso: " + porcentaje + "%", 20, 90);
    ctx.fillText("Record: " + scoreMax, 20, 120);
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    enemigos.forEach(e => e.update());

    if (eliminados >= nivel * totalPorNivel) {
        nivel++;
        crearEnemigos();
    }

    if (eliminados > scoreMax) scoreMax = eliminados;

    HUD();
}

animate();