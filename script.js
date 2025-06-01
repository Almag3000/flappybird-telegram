
const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
let score = 0;
let grid = [];

function init() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    addRandomTile();
    addRandomTile();
    drawGrid();
}

function drawGrid() {
    gridContainer.innerHTML = "";
    grid.flat().forEach(value => {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = value === 0 ? "" : value;
        gridContainer.appendChild(tile);
    });
    scoreDisplay.textContent = score;
}

function addRandomTile() {
    const empty = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) empty.push([r, c]);
        }
    }
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function slide(row) {
    let arr = row.filter(v => v);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i + 1] = 0;
        }
    }
    return [...arr.filter(v => v), ...Array(4 - arr.filter(v => v).length).fill(0)];
}

function rotateGrid(g) {
    return g[0].map((_, i) => g.map(row => row[i])).reverse();
}

function move(dir) {
    let moved = false;
    for (let i = 0; i < dir; i++) grid = rotateGrid(grid);
    for (let r = 0; r < 4; r++) {
        const newRow = slide(grid[r]);
        if (grid[r].join() !== newRow.join()) moved = true;
        grid[r] = newRow;
    }
    for (let i = dir; i < 4; i++) grid = rotateGrid(grid);
    if (moved) addRandomTile();
    drawGrid();
}

window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") move(0);
    else if (e.key === "ArrowUp") move(1);
    else if (e.key === "ArrowRight") move(2);
    else if (e.key === "ArrowDown") move(3);
});

init();
