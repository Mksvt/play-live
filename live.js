const canvas = document.querySelector('.gameCanvas');
const ctx = canvas.getContext('2d');

const startButton = document.querySelector('.startGame');
const stopButton = document.querySelector('.stopGame');
const resetButton = document.querySelector('.resetGame');

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
resetButton.addEventListener('click', resetGame);

const rows = 30;
const cols = 30;
const cellSize = canvas.width / cols;

let grid = [];
let timer = null;
let gameOver = false;

function initializeGrid() {
    grid = Array.from({ length: rows }, () => Array(cols).fill(0));
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.strokeStyle = "#ccc";
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            if (grid[i][j] === 1) {
                ctx.fillStyle = "#4A5B6A";
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }
}

canvas.onclick = function (event) {
    const x = Math.floor(event.offsetX / cellSize);
    const y = Math.floor(event.offsetY / cellSize);
    grid[y][x] = grid[y][x] === 1 ? 0 : 1; 
    drawGrid();
};

function getNextGeneration(grid) {
    const next = Array.from({ length: rows }, () => Array(cols).fill(0));
    let hasAlive = false;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let neighbors = 0;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    const ni = i + dy;
                    const nj = j + dx;
                    if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                        neighbors += grid[ni][nj];
                    }
                }
            }
            const alive = grid[i][j] === 1;
            if (alive && (neighbors === 2 || neighbors === 3)) {
                next[i][j] = 1;
                hasAlive = true;
            } else if (!alive && neighbors === 3) {
                next[i][j] = 1;
                hasAlive = true;
            }
        }
    }

    return { next, hasAlive };
}

function startGame() {
    if (gameOver) {
        initializeGrid();
        drawGrid();
        gameOver = false;
    }

    clearTimeout(timer);

    const { next, hasAlive } = getNextGeneration(grid);
    grid = next;
    drawGrid();

    if (!hasAlive) {
        console.log("Game Over");
        gameOver = true;
        return;
    }

    timer = setTimeout(startGame, 200);
}

function stopGame() {
    clearTimeout(timer);
}

function resetGame() {
    clearTimeout(timer);
    initializeGrid();
    drawGrid();
    gameOver = false;
}

initializeGrid();
drawGrid();

