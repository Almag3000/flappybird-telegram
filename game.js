const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
const DEGREE = Math.PI / 180;

// Звук отключен для простоты
const sprite = new Image();
sprite.src = "https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/spritesheet.png";

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
};

canvas.addEventListener("click", function () {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            break;
        case state.over:
            pipes.reset();
            bird.reset();
            score.reset();
            state.current = state.getReady;
            break;
    }
});

function drawText(text, x, y, size = "20px", color = "#FFF") {
    ctx.fillStyle = color;
    ctx.font = `${size} Arial`;
    ctx.fillText(text, x, y);
}

const bird = {
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    radius: 12,

    gravity: 0.25,
    jump: 4.6,
    speed: 0,
    rotation: 0,

    draw: function () {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    },

    flap: function () {
        this.speed = -this.jump;
    },

    update: function () {
        if (state.current === state.getReady) {
            this.y = 150;
            this.rotation = 0;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.radius >= canvas.height) {
                this.y = canvas.height - this.radius;
                if (state.current === state.game) {
                    state.current = state.over;
                }
            }
        }
    },

    reset: function () {
        this.speed = 0;
        this.y = 150;
    }
};

const pipes = {
    position: [],

    top: { y: 0 },
    bottom: { y: 0 },

    w: 50,
    h: 200,
    gap: 100,
    dx: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            ctx.fillStyle = "#228B22";
            ctx.fillRect(p.x, p.y, this.w, this.h);
            ctx.fillRect(p.x, p.y + this.h + this.gap, this.w, this.h);
        }
    },

    update: function () {
        if (state.current !== state.game) return;

        if (frames % 100 === 0) {
            this.position.push({
                x: canvas.width,
                y: -Math.floor(Math.random() * 150)
            });
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= this.dx;

            let bottomPipeYPos = p.y + this.h + this.gap;

            // столкновение
            if (
                bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
                (bird.y - bird.radius < p.y + this.h || bird.y + bird.radius > bottomPipeYPos)
            ) {
                state.current = state.over;
            }

            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value += 1;
                score.best = Math.max(score.value, score.best);
            }
        }
    },

    reset: function () {
        this.position = [];
    }
};

const score = {
    best: 0,
    value: 0,

    draw: function () {
        drawText("Счёт: " + this.value, 10, 30);
        if (state.current === state.over) {
            drawText("Лучший: " + this.best, 10, 60);
        }
    },

    reset: function () {
        this.value = 0;
    }
};

function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    pipes.draw();
    bird.draw();
    score.draw();
}

function update() {
    bird.update();
    pipes.update();
}

function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();