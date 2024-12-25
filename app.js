document.addEventListener('DOMContentLoaded', () => {
    rankBoard(); // Refresh the rank list on page load

    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('timer');
    const livesDisplay = document.getElementById('lives');
    const restartBtn = document.getElementById('restart-btn');
    const restartHardBtn = document.getElementById('restart-hard-btn');
    const restartEasyBtn = document.getElementById('restart-easy-btn');
    const showRankBoardBtn = document.getElementById('show-rank-board');
    const blurBackground = document.getElementById('blur-background');
    const messageContainer = document.getElementById('message-container');

    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    let lives = 4;
    let timer;
    let seconds = 0;
    let mode = 'easy';
    let cardValues = ['circle', 'circle', 'square', 'square', 'star', 'star', 'triangle', 'triangle'];

    function shuffle(array) {
        let m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    function startTimer() {
        clearInterval(timer);
        seconds = 0;
        timer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerDisplay.textContent = `Time: ${minutes}m ${remainingSeconds}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function rankBoard() {
        const rankList = document.querySelector('.rank');
        rankList.innerHTML = '<h2> <img height="40px" src="assets/rank.gif" alt="Rank Image"> Rank List </h2>';

        let ranks = [];
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let item = localStorage.getItem(key);

            try {
                let obj = JSON.parse(item);
                if (obj && obj.name && obj.time !== undefined) {
                    ranks.push(obj);
                }
            } catch (error) {
                console.warn(`Invalid JSON for key: ${key}`, error);
            }
        }

        ranks.sort((a, b) => a.time - b.time);

        ranks.forEach(obj => {
            let li = document.createElement('li');
            li.textContent = `Name: ${obj.name}, Best Time: ${obj.time} sec, Lives: ${obj.lives}, Level: ${obj.mode}`;

            const btnRemove = document.createElement('button');
            btnRemove.textContent = 'Remove';
            btnRemove.addEventListener('click', () => {
                localStorage.removeItem(obj.name);
                rankBoard();
            });

            li.appendChild(btnRemove);
            rankList.appendChild(li);
        });

        const closeRankBtn = document.createElement('button');
        closeRankBtn.textContent = 'Close';
        closeRankBtn.addEventListener('click', () => {
            rankList.style.display = 'none';
        });

        rankList.appendChild(closeRankBtn);
    }

    function resetGame() {
        matchedCards = [];
        flippedCards = [];
        moves = 0;
        lives = 4;
        seconds = 0;
        stopTimer();
        timerDisplay.textContent = 'Time: 0s';
        updateLives();
        createGameBoard();
    }

    function updateLives() {
        livesDisplay.innerHTML = '';
        for (let i = 0; i < lives; i++) {
            const heartImage = document.createElement('img');
            heartImage.src = 'assets/heart.png';
            heartImage.height = 50;
            livesDisplay.appendChild(heartImage);
        }
        if (lives === 0) {
            stopTimer();
            showMessage('Game Over! You ran out of lives.', 'game-over.gif');
            setTimeout(resetGame, 3000);
        }
    }

    function showMessage(message, gifSrc) {
        messageContainer.innerHTML = `${message} <img height="60px" src="assets/${gifSrc}" alt="Game Result">`;
        blurBackground.style.display = 'flex';

        setTimeout(() => {
            blurBackground.style.display = 'none';
        }, 3000);
    }

    restartBtn.addEventListener('click', resetGame);
    restartHardBtn.addEventListener('click', () => {
        cardValues = ['circle', 'circle', 'square', 'square', 'star', 'star', 'triangle', 'triangle', 'diamond', 'diamond', 'trapezium', 'trapezium'];
        mode = 'hard';
        resetGame();
    });
    restartEasyBtn.addEventListener('click', () => {
        cardValues = ['circle', 'circle', 'square', 'square', 'star', 'star', 'triangle', 'triangle'];
        mode = 'easy';
        resetGame();
    });

    showRankBoardBtn.addEventListener('click', () => {
        const rankList = document.querySelector('.rank');
        rankList.style.display = 'block';
        rankBoard();
    });

    resetGame();
});
