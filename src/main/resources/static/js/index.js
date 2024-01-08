// 게임 보드의 크기 설정
const boardSize = 10; // 10x10 격자
const cellSize = 40; // 각 셀의 크기는 40px
const gameBoard = document.getElementById('gameBoard');

// 게임 보드 초기화 함수
function initBoard() {
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

// 게임 시작 함수
function startGame() {
    runGame();
    document.getElementById('statusDisplay').textContent = 'Game Started!';
}

// 게임 보드 및 시작 버튼 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    initBoard(); // 게임 보드 초기화
    document.getElementById('startButton').addEventListener('click', startGame);
    // runGame 함수를 여기서 호출하거나, 필요한 로직을 여기에 추가합니다.
});
