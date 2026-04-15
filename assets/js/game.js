const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1100;
canvas.height = 650;

/* ===================== ESTADO ===================== */
let keys = {};
let bullets = [];
let petals = [];
let seeds = [];

let player, boss;
let gameState = "menu";
let mouse = { x: 0, y: 0 };

let seedCount = 0;
let superReady = false;

let t = 0;
let seedsLimit = 2;


/* ===================== CONTROLES ===================== */
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

canvas.addEventListener("mousemove", e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
});

canvas.addEventListener("click", handleClick);

/* ===================== CLICK ===================== */
function handleClick() {

    if (gameState === "gameover" || gameState === "victory") {
        startGame();
        return;
    }

    if (gameState === "menu") {
        startGame();
        return;
    }

    if (gameState === "play") {
        shoot();
    }
}

/* ===================== START ===================== */
function startGame() {
    player = new Player(200, 500);
    boss = new BossFlower();

    bullets = [];
    petals = [];
    seeds = [];

    seedCount = 0;
    superReady = false;

    gameState = "play";
}

/* ===================== DISPARO ===================== */
function shoot() {
    let a = Math.atan2(mouse.y - player.y, mouse.x - player.x);

    if (superReady) {
        for (let i = 0; i < 12; i++) {
            let ang = (Math.PI * 2 / 12) * i;

            bullets.push({
                x: player.x,
                y: player.y,
                dx: Math.cos(ang) * 6,
                dy: Math.sin(ang) * 6,
                size: 8,
                color: "#ffd166"
            });
        }

        superReady = false;
        seedCount = 0;
        return;
    }

    bullets.push({
        x: player.x,
        y: player.y,
        dx: Math.cos(a) * 10,
        dy: Math.sin(a) * 10,
        size: 6,
        color: "#00b4d8"
    });
}

/* ===================== ATAQUE BOSS (FIX) ===================== */
function bossAttack() {

    if (gameState !== "play") return;

    let diff = 1 + (30 - boss.life) / 20;

    if (Math.random() < 0.02 * diff) {

        let count = 6 + Math.floor(diff);

        for (let i = 0; i < count; i++) {
            let a = (Math.PI * 2 / count) * i;

            petals.push({
                x: boss.x,
                y: boss.y,
                dx: Math.cos(a) * (3 + diff),
                dy: Math.sin(a) * (3 + diff),
                rot: Math.random() * Math.PI
            });
        }
    }
}

/* ===================== SEMILLAS ===================== */
function spawnSeeds() {
    if (seeds.length >= seedsLimit) return;

    if (Math.random() < 0.01) {
        seeds.push({
            x: Math.random() * 1000,
            y: 120 + Math.random() * 350,
            r: 10
        });
    }
}



/* ===================== UPDATE ===================== */
function update() {

    if (gameState !== "play") return;

    player.move(keys);
    boss.move();

    bossAttack(); // 🔥 IMPORTANTE (PÉTALOS)

    spawnSeeds();

    bullets.forEach(b => {
        b.x += b.dx;
        b.y += b.dy;
    });

    petals.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < -100 || p.x > 1200 || p.y < -100 || p.y > 800) {
            petals.splice(i, 1);
        }
    });

    /* daño boss */
    bullets.forEach((b, i) => {
        let dx = b.x - boss.x;
        let dy = b.y - boss.y;

        if (Math.sqrt(dx * dx + dy * dy) < 50) {
            boss.life--;
            boss.flash = 5;
            bullets.splice(i, 1);
        }
    });

    /* daño player */
    petals.forEach(p => {
        if (collision(player, p) && player.inv <= 0) {
            player.life--;
            player.inv = 60;
        }
    });

    /* semillas */
    seeds.forEach((s, i) => {
        if (collision(player, s)) {
            seedCount++;
            seeds.splice(i, 1);

            if (seedCount >= 2) {
                superReady = true;
            }
        }
    });

    /* HUD */
    document.getElementById("hudPlayer").innerText = "❤️ Vidas: " + player.life;
    document.getElementById("hudBoss").innerText = "🌸 Flor: " + boss.life;
    document.getElementById("hudSeeds").innerText = "🌰 Semillas: " + seedCount + " / 2";

    /* win/lose */
    if (player.life <= 0) gameState = "gameover";
    if (boss.life <= 0) gameState = "victory";
}

/* ===================== DRAW ===================== */
function draw() {

    drawBackground();

    if (gameState === "play") {

        player.draw(ctx);
        boss.draw(ctx);

        bullets.forEach(b => {
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
            ctx.fill();
        });

        petals.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);

            let grad = ctx.createLinearGradient(-5, 0, 5, 0);
            grad.addColorStop(0, "#ff4d6d");
            grad.addColorStop(1, "#ffc2d1");

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 18, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        });

    seeds.forEach(s => {
    ctx.save();
    ctx.translate(s.x, s.y);

    // 🔥 sombra fuerte (para que resalte del fondo)
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(2, 4, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 🌾 glow exterior (para visibilidad)
    let glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
    glow.addColorStop(0, "rgba(255,255,255,0.9)");
    glow.addColorStop(0.3, "rgba(255,209,102,0.8)");
    glow.addColorStop(1, "rgba(255,209,102,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // 🌾 cuerpo principal (más saturado y grande)
    let grad = ctx.createLinearGradient(-10, 0, 10, 0);
    grad.addColorStop(0, "#fff176");
    grad.addColorStop(0.5, "#ffd166");
    grad.addColorStop(1, "#ffb703");

    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.quadraticCurveTo(10, -5, 7, 5);
    ctx.quadraticCurveTo(0, 12, -7, 5);
    ctx.quadraticCurveTo(-10, -5, 0, -12);
    ctx.fill();

    // 🖤 borde (esto es lo que hace que “sí o sí se vea”)
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.quadraticCurveTo(10, -5, 7, 5);
    ctx.quadraticCurveTo(0, 12, -7, 5);
    ctx.quadraticCurveTo(-10, -5, 0, -12);
    ctx.stroke();

    // 🌟 highlight superior
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.ellipse(-3, -4, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    s.blink = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
ctx.globalAlpha = s.blink;
});
    }

    if (gameState === "gameover") {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, 1100, 650);

        ctx.fillStyle = "#fff";
        ctx.font = "60px Fredoka";
        ctx.fillText("💀 GAME OVER", 350, 280);

        ctx.font = "25px Fredoka";
        ctx.fillText("Click para reiniciar", 380, 340);
    }

    if (gameState === "victory") {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, 1100, 650);

        ctx.fillStyle = "#fff";
        ctx.font = "60px Fredoka";
        ctx.fillText("🎉 VICTORIA", 380, 280);

        ctx.font = "25px Fredoka";
        ctx.fillText("Click para reiniciar", 380, 340);
    }

    drawCursor();
}

/* ===================== BACKGROUND ===================== */
function drawBackground() {
    t += 0.02;

    let sky = ctx.createLinearGradient(0, 0, 0, 650);
    sky.addColorStop(0, "#a2d2ff");
    sky.addColorStop(1, "#cdb4db");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 1100, 650);
}

/* ===================== CURSOR ===================== */
let mouseTrail = [];

function drawCursor() {

    // guardar rastro
    mouseTrail.push({ x: mouse.x, y: mouse.y });
    if (mouseTrail.length > 8) mouseTrail.shift();

    // dibujar estela
    for (let i = 0; i < mouseTrail.length; i++) {
        let p = mouseTrail[i];

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,175,204,${i / mouseTrail.length})`;
        ctx.arc(p.x, p.y, i * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }

    // núcleo del cursor
    let glow = ctx.createRadialGradient(mouse.x, mouse.y, 2, mouse.x, mouse.y, 25);
    glow.addColorStop(0, "#ffffff");
    glow.addColorStop(0.3, "#ffafcc");
    glow.addColorStop(1, "rgba(255,175,204,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 7, 0, Math.PI * 2);
    ctx.fill();

    // anillo externo
    ctx.strokeStyle = "#ffafcc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
    ctx.stroke();
}

/* ===================== LOOP ===================== */
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();