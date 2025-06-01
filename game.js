
const canvas = document.getElementById("flappy");
const ctx = canvas.getContext("2d");

const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeUp = new Image();
const pipeBottom = new Image();

bird.src = "assets/bird.png";
bg.src = "assets/background.png";
fg.src = "assets/fg.png";
pipeUp.src = "assets/pipeUp.png";
pipeBottom.src = "assets/pipeBottom.png";

const flySound = new Audio("assets/fly.wav");
const scoreSound = new Audio("assets/score.wav");

let gap = 90;
let xPos = 10;
let yPos = 150;
let gravity = 1.2;
let score = 0;

document.addEventListener("keydown", moveUp);
document.addEventListener("click", moveUp);

function moveUp() {
  yPos -= 30;
  flySound.play();
}

let pipes = [];
pipes[0] = {
  x: canvas.width,
  y: 0
};

function draw() {
  ctx.drawImage(bg, 0, 0);

  for (let i = 0; i < pipes.length; i++) {
    ctx.drawImage(pipeUp, pipes[i].x, pipes[i].y);
    ctx.drawImage(pipeBottom, pipes[i].x, pipes[i].y + pipeUp.height + gap);

    pipes[i].x--;

    if (pipes[i].x == 125) {
      pipes.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
      });
    }

    if (
      xPos + bird.width >= pipes[i].x &&
      xPos <= pipes[i].x + pipeUp.width &&
      (yPos <= pipes[i].y + pipeUp.height ||
        yPos + bird.height >= pipes[i].y + pipeUp.height + gap) ||
      yPos + bird.height >= canvas.height - fg.height
    ) {
      location.reload();
    }

    if (pipes[i].x == 5) {
      score++;
      scoreSound.play();
    }
  }

  ctx.drawImage(fg, 0, canvas.height - fg.height);
  ctx.drawImage(bird, xPos, yPos);

  yPos += gravity;

  ctx.fillStyle = "#000";
  ctx.font = "20px Verdana";
  ctx.fillText("Score: " + score, 10, canvas.height - 20);

  requestAnimationFrame(draw);
}

pipeBottom.onload = draw;
