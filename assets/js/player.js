class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 3;
        this.speed = 6;
        this.inv = 0;

        this.bob = 0; // animación caminata
    }

    move(keys) {
        let moving = false;

        if (keys["w"]) { this.y -= this.speed; moving = true; }
        if (keys["s"]) { this.y += this.speed; moving = true; }
        if (keys["a"]) { this.x -= this.speed; moving = true; }
        if (keys["d"]) { this.x += this.speed; moving = true; }

        if (moving) {
            this.bob += 0.25;
        } else {
            this.bob *= 0.9;
        }

        this.x = Math.max(30, Math.min(1070, this.x));
        this.y = Math.max(30, Math.min(620, this.y));
    }

    draw(ctx) {
        ctx.save();

        // efecto invencibilidad
        ctx.globalAlpha = this.inv > 0 ? 0.6 : 1;

        let shake = this.inv > 0 ? Math.random() * 2 - 1 : 0;

        ctx.translate(this.x + shake, this.y + shake);
        ctx.rotate(Math.sin(this.bob) * 0.05);

        // ======================
        // 🐜 SOMBRA
        // ======================
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.ellipse(0, 18, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // ======================
        // 🐜 CUERPO (3 SEGMENTOS)
        // ======================
        let bodyColors = ["#2b2d42", "#1f2233", "#141622"];

        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.fillStyle = bodyColors[i];

            let sizeX = 7 + i * 2;
            let sizeY = 6 + i * 1.5;

            ctx.ellipse(i * 12, Math.sin(this.bob + i) * 1.5, sizeX, sizeY, 0, 0, Math.PI * 2);
            ctx.fill();

            // brillo
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.ellipse(i * 12 - 2, -2, sizeX / 2, sizeY / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = this.inv > 0 ? 0.6 : 1;
        }

        // ======================
        // 🐜 CABEZA DETALLADA
        // ======================
        ctx.fillStyle = this.inv > 0 ? "#ffd166" : "#2b2d42";
        ctx.beginPath();
        ctx.ellipse(34, Math.sin(this.bob) * 1.5, 9, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // ojos
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(37, -3 + Math.sin(this.bob) * 1.5, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(33, -3 + Math.sin(this.bob) * 1.5, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // pupilas
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(37, -3 + Math.sin(this.bob) * 1.5, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(33, -3 + Math.sin(this.bob) * 1.5, 1, 0, Math.PI * 2);
        ctx.fill();

        // antenas
        ctx.strokeStyle = "#1b1d2a";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(34, -6);
        ctx.quadraticCurveTo(28, -18, 22, -20);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(36, -6);
        ctx.quadraticCurveTo(42, -18, 48, -20);
        ctx.stroke();

        ctx.restore();

        // invencibilidad timer
        if (this.inv > 0) this.inv--;
    }
}