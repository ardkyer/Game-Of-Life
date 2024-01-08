// index.js
// 게임 보드의 크기 설정
const boardSize = 10; // 10x10 격자
const cellSize = 40; // 각 셀의 크기는 40px

// 게임 보드 초기화 함수
function initBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = ''; // 기존에 있는 셀을 초기화
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', toggleCellState);
        gameBoard.appendChild(cell);
    }
}

// 셀 상태 토글 함수
function toggleCellState() {
    this.classList.toggle('alive'); // 'alive' 클래스 토글
}

let currentBoard = createRandomBoard(boardSize); // 현재 게임 보드 상태
let gameRunning = false;
let gameInterval;

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
    initBoard(currentBoard); // Reinitialize the board with the new state
    document.getElementById('statusDisplay').textContent = '';
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
