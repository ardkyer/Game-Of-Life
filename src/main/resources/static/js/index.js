document.addEventListener('DOMContentLoaded', function() {
    var gameBoard = document.getElementById('gameBoard');
    var startButton = document.getElementById('startButton');
    var statusDisplay = document.getElementById('statusDisplay');

    // 게임 보드 초기화
    for (var i = 0; i < 100; i++) { // 예시로 10x10 격자를 만듭니다
        var cell = document.createElement('div');
        cell.addEventListener('click', function() {
            // 셀 클릭 시 이벤트
            this.classList.toggle('alive');
        });
        gameBoard.appendChild(cell);
    }

    // 게임 시작 버튼 이벤트
    startButton.addEventListener('click', function() {
        // 게임 시작 로직
        statusDisplay.textContent = 'Game Started!';
    });
});

