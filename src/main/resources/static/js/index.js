//index.js
const boardSize = 10; // 10x10 격자
const cellSize = 40; // 각 셀의 크기는 40px

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

function initBoard(board) {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = ''; // 기존에 있는 셀을 초기화
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.setAttribute('data-index', i * boardSize + j);
            cell.addEventListener('click', toggleCellState);
            if (board[i][j] === 1) {
                cell.classList.add('alive');
            }
            gameBoard.appendChild(cell);
        }
    }
}

function toggleCellState() {
    const cellIndex = parseInt(this.getAttribute('data-index'));
    const x = Math.floor(cellIndex / boardSize);
    const y = cellIndex % boardSize;
    this.classList.toggle('alive');
    currentBoard[x][y] = this.classList.contains('alive') ? 1 : 0;
}

document.addEventListener('DOMContentLoaded', () => {
    initBoard(currentBoard); // 게임 보드 초기화

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
});

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
    initBoard(currentBoard);
    document.getElementById('statusDisplay').textContent = 'Game Restarted!';
    gameRunning = false;
}

function runGame() {
    gameInterval = setInterval(() => {
        const previousBoard = currentBoard.map(row => [...row]);
        currentBoard = calculateNextGeneration(currentBoard);
        renderBoard(currentBoard);
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
