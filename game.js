
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = { x: 50, y: 150, width: 34, height: 24, gravity: 0.25, lift: -4.6, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let started = false;

const birdImg = new Image();
birdImg.src = 'bird.png';
const pipeNorth = new Image();
pipeNorth.src = 'pipe-north.png';
const pipeSouth = new Image();
pipeSouth.src = 'pipe-south.png';
const flySound = new Audio('fly.wav');
const scoreSound = new Audio('score.wav');

document.addEventListener('keydown', () => {
    if (!started) started = true;
    if (!gameOver) {
        bird.velocity = bird.lift;
        flySound.play();
    } else {
        document.location.reload();
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (started && !gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        if (frame % 100 === 0) {
            const gap = 120;
            const top = Math.floor(Math.random() * (canvas.height - gap - 100)) + 20;
            pipes.push({ x: canvas.width, top });
        }
        pipes.forEach((pipe, i) => {
            pipe.x -= 2;
            ctx.drawImage(pipeNorth, pipe.x, pipe.top - pipeNorth.height);
            ctx.drawImage(pipeSouth, pipe.x, pipe.top + 120);
            if (
                bird.x + bird.width > pipe.x &&
                bird.x < pipe.x + pipeNorth.width &&
                (bird.y < pipe.top || bird.y > pipe.top + 120)
            ) {
                gameOver = true;
            }
            if (pipe.x + pipeNorth.width < bird.x && !pipe.passed) {
                score++;
                pipe.passed = true;
                scoreSound.play();
            }
        });
    }

    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    ctx.fillStyle = "#fff";
    ctx.font = "24px sans-serif";
    ctx.fillText("Score: " + score, 10, 30);

    frame++;
    if (bird.y + bird.height >= canvas.height) gameOver = true;
    if (!gameOver) requestAnimationFrame(draw);
}

draw();
