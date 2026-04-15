class BossFlower {
    constructor() {
        this.x = 550;
        this.y = 120;
        this.life = 30;
        this.angle = 0;
        this.flash = 0;
        this.scale = 1;
        this.rot = 0;
    }

    move() {
        this.x += Math.sin(this.angle) * 2;
        this.y += Math.cos(this.angle * 0.5) * 1.2;

        this.angle += 0.03;
        this.rot += 0.02;

        // efecto respiración
        this.scale = 1 + Math.sin(this.angle * 2) * 0.05;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.rotate(this.rot);

        // FLASH daño
        if (this.flash > 0) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "#fff";
            ctx.fillRect(-80, -80, 160, 160);
            ctx.globalAlpha = 1;
            this.flash--;
        }

        // =====================
        // 🌸 PETALOS
        // =====================
        for (let i = 0; i < 18; i++) {
            let a = (Math.PI * 2 / 18) * i;

            let px = Math.cos(a) * 55;
            let py = Math.sin(a) * 55;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(a + this.rot);

            let grad = ctx.createLinearGradient(-10, 0, 10, 0);
            grad.addColorStop(0, "#ff4d6d");
            grad.addColorStop(0.5, "#ff8fab");
            grad.addColorStop(1, "#ffc2d1");

            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.ellipse(0, 0, 14, 34, 0, 0, Math.PI * 2);
            ctx.fill();

            // brillo
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.ellipse(-3, -5, 6, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.restore();
        }

        // =====================
        // 🌼 CENTRO
        // =====================
        let grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 40);
        grad.addColorStop(0, "#fff3b0");
        grad.addColorStop(0.5, "#ffd166");
        grad.addColorStop(1, "#f4a261");

        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.shadowBlur = 0;

        // =====================
        // 👁 CARA
        // =====================
        ctx.fillStyle = "#222";

        ctx.beginPath();
        ctx.arc(-10, -5, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(10, -5, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 8, 10, 0, Math.PI);
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}

class Petal {
    constructor(x, y, a) {
        this.x = x;
        this.y = y;
        this.dx = Math.cos(a) * 4;
        this.dy = Math.sin(a) * 4;
        this.rot = Math.random() * Math.PI;
        this.spin = (Math.random() - 0.5) * 0.2;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
        this.rot += this.spin;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);

        let grad = ctx.createLinearGradient(-5, 0, 5, 0);
        grad.addColorStop(0, "#ffb3c6");
        grad.addColorStop(1, "#ffd6e0");

        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}