//index.js
let boardSize = 10; // 기본 10x10 보드
let cellSize = 40; // 각 셀의 크기는 40px

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
    // 업데이트된 보드 크기에 맞게 grid-template-columns 스타일을 설정합니다.
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;
    gameBoard.innerHTML = ''; // 기존에 있는 셀을 초기화합니다.

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = '40px'; // 셀의 가로 크기를 고정합니다.
            cell.style.height = '40px'; // 셀의 세로 크기를 고정합니다.
            cell.setAttribute('data-index', i * boardSize + j);
            cell.addEventListener('click', toggleCellState);
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
    initBoard(createEmptyBoard(boardSize)); // 빈 게임 보드로 초기화

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

function applyNewBoardSize() {
    const newSize = parseInt(document.getElementById('boardSizeInput').value);
    if (newSize >= 1 && newSize <= 1000) {
        boardSize = newSize; // 새로운 보드 크기 적용
        currentBoard = createEmptyBoard(boardSize); // 새 빈 보드 생성
        initBoard(currentBoard); // 보드 초기화
    } else {
        alert('Board size must be between 1 and 1000.');
    }
}

function calculateCellSize(boardSize) {
    // 게임 보드의 최대 크기를 고려하여 셀 크기를 계산합니다.
    const gameBoardContainer = document.getElementById('gameBoard');
    const gameBoardMaxWidth = gameBoardContainer.clientWidth; // 게임 보드 컨테이너의 너비
    if (boardSize * cellSize > gameBoardMaxWidth) {
        return gameBoardMaxWidth / boardSize; // 너비에 맞춰 셀 크기 조정
    }
    return cellSize; // 기본 셀 크기 사용
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
