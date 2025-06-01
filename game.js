
// === Переменные игры ===
let canvas, context;
let frames = 0;
const DEGREE = Math.PI / 180;
let score = 0, best = parseInt(localStorage.getItem("best")) || 0;
let currentState = 0; // 0: стартовое меню, 1: игра, 2: конец игры

// === Настройки ===
const gravity = 0.15;
const jump = -6;
const pipesDistance = 120;
const pipeSpeed = 2;

// === Спрайты ===
const sprite = new Image();
sprite.src = "https://raw.githubusercontent.com/rohitdhas/flappy-bird-assets/main/spritesheet.png";

const sounds = {
  flap: new Audio("https://freesound.org/data/previews/234/234515_4019028-lq.mp3"),
  hit: new Audio("https://freesound.org/data/previews/151/151022_2637717-lq.mp3"),
  point: new Audio("https://freesound.org/data/previews/320/320181_4939433-lq.mp3")
};

// === Объекты ===
const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  frame: 0,
  gravity,
  jump,
  speed: 0,
  rotation: 0,
  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.drawImage(sprite, 276, 112, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);
    context.restore();
  },
  flap() {
    this.speed = this.jump;
    sounds.flap.play();
  },
  update() {
    this.speed += this.gravity;
    this.y += this.speed;
    if (this.y + this.h / 2 >= canvas.height) {
      this.y = canvas.height - this.h / 2;
      if (currentState === 1) {
        currentState = 2;
        sounds.hit.play();
        best = Math.max(score, best);
        localStorage.setItem("best", best);
      }
    }

    if (this.speed >= jump) this.rotation = 90 * DEGREE;
    else this.rotation = -25 * DEGREE;
  },
  reset() {
    this.y = 150;
    this.speed = 0;
  }
};

const pipes = {
  position: [],
  top: { sX: 553, sY: 0 },
  bottom: { sX: 502, sY: 0 },
  w: 53,
  h: 400,
  draw() {
    for (let p of this.position) {
      let topY = p.y;
      let bottomY = p.y + this.h + pipesDistance;
      context.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topY, this.w, this.h);
      context.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomY, this.w, this.h);
    }
  },
  update() {
    if (frames % 100 === 0) {
      this.position.push({ x: canvas.width, y: -Math.floor(Math.random() * 150 + 100) });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.x -= pipeSpeed;

      if (p.x + this.w <= 0) {
        this.position.shift();
        score++;
        sounds.point.play();
      }

      if (
        bird.x + bird.w / 2 >= p.x &&
        bird.x - bird.w / 2 <= p.x + this.w &&
        (
          bird.y - bird.h / 2 <= p.y + this.h ||
          bird.y + bird.h / 2 >= p.y + this.h + pipesDistance
        )
      ) {
        currentState = 2;
        sounds.hit.play();
        best = Math.max(score, best);
        localStorage.setItem("best", best);
      }
    }
  },
  reset() {
    this.position = [];
  }
};

function drawStartScreen() {
  context.fillStyle = "#fff";
  context.font = "bold 28px Arial";
  context.textAlign = "center";
  context.fillText("Flappy Bird", canvas.width / 2, 100);
  context.font = "20px Arial";
  context.fillText("Нажми чтобы начать", canvas.width / 2, 150);
}

function drawScore() {
  context.fillStyle = "#fff";
  context.font = "20px Arial";
  context.fillText("Счёт: " + score, 60, 30);
  context.fillText("Рекорд: " + best, canvas.width - 100, 30);
}

function drawGameOver() {
  context.fillStyle = "#fff";
  context.font = "bold 24px Arial";
  context.fillText("Игра окончена", canvas.width / 2, 150);
  context.font = "18px Arial";
  context.fillText("Кликни чтобы сыграть снова", canvas.width / 2, 190);
}

function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

function update() {
  if (currentState === 1) {
    bird.update();
    pipes.update();
  }
}

function draw() {
  context.fillStyle = "#66a6ff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  pipes.draw();
  bird.draw();

  if (currentState === 0) drawStartScreen();
  if (currentState === 1) drawScore();
  if (currentState === 2) drawGameOver();
}

window.onload = function () {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  canvas.addEventListener("click", function () {
    switch (currentState) {
      case 0:
        currentState = 1;
        score = 0;
        pipes.reset();
        bird.reset();
        break;
      case 1:
        bird.flap();
        break;
      case 2:
        currentState = 0;
        break;
    }
  });

  loop();
};
