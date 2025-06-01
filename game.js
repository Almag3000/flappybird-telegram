
document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const scoreDisplay = document.getElementById('score');
  let boardArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  let score = 0;

  function createBoard() {
    board.innerHTML = '';
    boardArray.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        if (cell !== 0) {
          cellDiv.textContent = cell;
          cellDiv.classList.add(`tile-${cell}`);
        }
        board.appendChild(cellDiv);
      });
    });
    scoreDisplay.textContent = score;
  }

  function generate() {
    let empty = [];
    boardArray.forEach((row, i) => row.forEach((cell, j) => {
      if (cell === 0) empty.push([i, j]);
    }));
    if (empty.length === 0) return;
    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    boardArray[i][j] = Math.random() > 0.1 ? 2 : 4;
  }

  function moveLeft() {
    for (let i = 0; i < 4; i++) {
      let row = boardArray[i].filter(x => x !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          score += row[j];
          row[j + 1] = 0;
        }
      }
      row = row.filter(x => x !== 0);
      while (row.length < 4) row.push(0);
      boardArray[i] = row;
    }
    generate();
    createBoard();
  }

  function rotateBoard() {
    boardArray = boardArray[0].map((_, i) => boardArray.map(row => row[i])).reverse();
  }

  function moveRight() {
    boardArray = boardArray.map(row => row.reverse());
    moveLeft();
    boardArray = boardArray.map(row => row.reverse());
  }

  function moveUp() {
    rotateBoard();
    moveLeft();
    rotateBoard();
    rotateBoard();
    rotateBoard();
  }

  function moveDown() {
    rotateBoard();
    rotateBoard();
    rotateBoard();
    moveLeft();
    rotateBoard();
  }

  function handleKey(e) {
    if (e.key === 'ArrowLeft') moveLeft();
    else if (e.key === 'ArrowRight') moveRight();
    else if (e.key === 'ArrowUp') moveUp();
    else if (e.key === 'ArrowDown') moveDown();
  }

  function handleTouch() {
    let xStart = null, yStart = null;
    document.addEventListener('touchstart', e => {
      xStart = e.touches[0].clientX;
      yStart = e.touches[0].clientY;
    });
    document.addEventListener('touchend', e => {
      if (!xStart || !yStart) return;
      let xEnd = e.changedTouches[0].clientX;
      let yEnd = e.changedTouches[0].clientY;
      let dx = xEnd - xStart;
      let dy = yEnd - yStart;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) moveRight();
        else moveLeft();
      } else {
        if (dy > 0) moveDown();
        else moveUp();
      }
      xStart = yStart = null;
    });
  }

  document.addEventListener('keydown', handleKey);
  handleTouch();
  generate();
  generate();
  createBoard();
});
