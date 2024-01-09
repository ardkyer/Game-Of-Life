//index.js
let boardSize = 10; // 기본 10x10 보드
let cellSize; // 셀의 크기는 동적으로 계산될 것입니다.
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasSize = canvas.width; // 캔버스 크기 설정

function createEmptyBoard(size) {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

function createRandomBoard(size) {
    const board = [];
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = Math.floor(Math.random() * 2);
        }
    }
    return board;
}

let currentBoard = createRandomBoard(boardSize); // 현재 게임 보드 상태
let gameRunning = false;
let gameInterval;

// 캔버스에 보드를 그리는 함수
function drawBoard(board) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the cells
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            ctx.fillStyle = board[i][j] ? '#4caf50' : '#ffffff';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

// 셀의 크기를 계산하는 함수
function calculateCellSize() {
    cellSize = canvasSize / boardSize;
}

document.addEventListener('DOMContentLoaded', () => {
    calculateCellSize();
    drawBoard(createEmptyBoard(boardSize)); // 캔버스에 빈 게임 보드를 그립니다.

    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        if (startButton.textContent === 'Start Game') {
            startGame();
            startButton.textContent = 'Pause';
        } else if (startButton.textContent === 'Pause') {
            pauseGame();
            startButton.textContent = 'Resume';
        } else if (startButton.textContent === 'Resume') {
            startGame();
            startButton.textContent = 'Pause';
        } else if (startButton.textContent === 'Restart') {
            restartGame();
            startButton.textContent = 'Start Game';
        }
    });

    // 보드 크기 적용 버튼 이벤트 리스너
    document.getElementById('applyBoardSize').addEventListener('click', applyNewBoardSize);
});

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasLeft = (event.clientX - rect.left) * scaleX;
    const canvasTop = (event.clientY - rect.top) * scaleY;

    const x = Math.floor(canvasLeft / cellSize);
    const y = Math.floor(canvasTop / cellSize);

    currentBoard[y][x] = currentBoard[y][x] ? 0 : 1; // Toggle the cell state
    drawBoard(currentBoard); // Redraw the board
});

function applyNewBoardSize() {
    const newSize = parseInt(document.getElementById('boardSizeInput').value);
    if (newSize >= 1 && newSize <= 1000) {
        boardSize = newSize;
        calculateCellSize();
        currentBoard = createEmptyBoard(boardSize);
        drawBoard(currentBoard);
    } else {
        alert('Board size must be between 1 and 1000.');
    }
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        runGame();
        document.getElementById('statusDisplay').textContent = 'Game Started!';
    }
}

function pauseGame() {
    if (gameRunning) {
        clearInterval(gameInterval);
        gameRunning = false;
        document.getElementById('statusDisplay').textContent = 'Game Paused!';
    }
}

function restartGame() {
    clearInterval(gameInterval);
    currentBoard = createRandomBoard(boardSize);
    drawBoard(currentBoard); // 캔버스에 보드를 다시 그립니다.
    document.getElementById('statusDisplay').textContent = 'Game Restarted!';
    gameRunning = false;
}

function runGame() {
    gameInterval = setInterval(() => {
        const previousBoard = currentBoard.map(row => [...row]);
        currentBoard = calculateNextGeneration(currentBoard);
        drawBoard(currentBoard); // 캔버스에 보드를 그립니다.
        if (isBoardStatic(previousBoard, currentBoard)) {
            clearInterval(gameInterval);
            gameRunning = false;
            const startButton = document.getElementById('startButton');
            startButton.textContent = 'Restart';
            document.getElementById('statusDisplay').textContent = 'Game Over!';
        }
    }, 1000);
}

function isBoardStatic(previousBoard, currentBoard) {
    return previousBoard.every((row, rowIndex) => {
        return row.every((cell, cellIndex) => {
            return cell === currentBoard[rowIndex][cellIndex];
        });
    });
}

// 여기에 calculateNextGeneration 및 관련 게임 로직 함수를 추가합니다.
