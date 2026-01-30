
function Rank(name, time, lives, mode) {
    this.name = name;
    this.time = time;
    this.lives = lives;
    this.mode = mode;
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
            // Basic validation to ensure it's a game rank object
            if (obj && obj.name && obj.time && obj.lives && obj.mode) {
                ranks.push(obj);
            }
        } catch (e) {
            console.warn(`Skipping invalid localStorage item: ${key}`, e);
        }
    }

    // Sort ranks by time in ascending order
    ranks.sort((a, b) => a.time - b.time);

    ranks.forEach(obj => {
        let li = document.createElement('li');
        li.textContent = `Name: ${obj.name}, Best Time: ${obj.time} sec, Lives: ${obj.lives}, Level: ${obj.mode}`;

        const btnRemove = document.createElement('button');
        btnRemove.id = 'remove'
        btnRemove.textContent = 'Remove';
        btnRemove.addEventListener('click', function () {
            localStorage.removeItem(obj.name);
            rankBoard(); // Refresh the list after removal
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



document.addEventListener('DOMContentLoaded', () => {

    rankBoard(); // Refresh


    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('timer');
    const livesDisplay = document.getElementById('lives');
    const restartBtn = document.getElementById('restart-btn');
    const restartHardBtn = document.getElementById('restart-hard-btn');
    const restartEasyBtn = document.getElementById('restart-easy-btn');
    const blurBackground = document.getElementById('blur-background');
    const messageContainer = document.getElementById('message-container');

    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    let lives = 4;
    let timer;
    let seconds = 0;
    let mode = 'easy'; // Default mode
    let cardValues = ['circle', 'circle', 'square', 'square', 'star', 'star', 'triangle', 'triangle']; // Default cards

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

    function createGameBoard() {
        // Start the game immediately
        shuffle(cardValues);
        cardValues.forEach(value => {
            const card = createCard(value);
            gameBoard.appendChild(card);
        });
        startTimer();
    }


    function createCard(value) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        // Front of the card (the cover, initially visible)
        // Wait, for 3D CSS flip:
        // Container (card) -> Inner (preserves 3d) -> Front (default visible) & Back (flipped visible)
        // The "Front" face in CSS is typically the COVER. The "Back" face is the IMAGE.

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        // Optional: Add a pattern or logo to the back cover if you want

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        const cardImage = document.createElement('img');
        cardImage.src = `assets/${value}.gif`;
        cardImage.alt = "Memory Game Card";

        cardBack.appendChild(cardImage);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        card.addEventListener('click', flipCard);

        return card;
    }

    function startTimer() {
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

    function showMessage(message, gifSrc) {
        messageContainer.innerHTML = `${message}  <img height = 60px src="assets/${gifSrc}" alt="Win GIF">`;
        blurBackground.style.display = 'flex';
        const nameModal = document.getElementById('name-modal');
        if (nameModal) nameModal.style.display = 'none'; // Ensure modal is hidden
        messageContainer.style.display = 'flex'; // Ensure message is visible
        blurBackground.style.fontSize = '25px';


        setTimeout(() => {
            blurBackground.style.display = 'none';
            stopTimer();
            // If it's a win, we don't reset immediately, we wait for name input if it matches all cards
            // Wait, existing logic resetGame() here. But checkMatch calls requestPlayerNameAndSaveRank

            // Correction: showMessage is called for Game Over AND Win in the original code.
            // If it's a WIN, checkMatch calls requestPlayerNameAndSaveRank immediately after showMessage?
            // Actually, in original checkMatch:
            // showMessage(...); requestPlayerNameAndSaveRank();

            // The Original showMessage had a timeout of 3500ms to resetGame.
            // If we want to show the Name Modal, we shouldn't resetGame or hide background if it's a win.

            // Let's modify logic: Only reset if it's NOT a win (i.e. Game Over). 
            // OR let the showMessage timeout run, but if the Name Modal is active, don't hide blurBackground?

            if (message.includes('Game Over')) {
                resetGame();
            }
            // For win, do nothing here, let the modal handle it

        }, 3500);
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
            showMessage('Game Over! You ran out of lives.', 'game-over.gif');
        }
    }

    function flipCard() {
        // 'this' refers to the .card element
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                moves++;
                checkMatch();
            }
        }
    }


    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            matchedCards.push(card1, card2);
            if (matchedCards.length === cardValues.length) {
                showMessage(`Congratulations! You matched all the cards in ${moves} moves and ${seconds} seconds.`, 'big-win.gif');
                requestPlayerNameAndSaveRank();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);

            lives--;
            updateLives();
        }

        flippedCards = [];
    }

    function requestPlayerNameAndSaveRank() {
        // Show modal instead of prompt
        blurBackground.style.display = 'flex';
        messageContainer.style.display = 'none'; // Hide win message if it's there
        const nameModal = document.getElementById('name-modal');
        nameModal.style.display = 'flex';

        const input = document.getElementById('player-name-input');
        const saveBtn = document.getElementById('save-name-btn');

        input.value = ''; // Clear previous input
        input.focus();

        // One-time event listener for saving (to avoid duplicates)
        saveBtn.onclick = function () {
            const name = input.value.trim();
            if (name) {
                let rank = new Rank(name, seconds, lives, mode);
                localStorage.setItem(rank.name, JSON.stringify(rank));

                // Close modal
                nameModal.style.display = 'none';
                blurBackground.style.display = 'none';

                // Show ranks
                rankBoard();
                displayRankBoard();
            } else {
                alert("Please enter a name!"); // Fallback validation
            }
        };
    }

    function displayRankBoard() {
        const rankList = document.querySelector('.rank');


        stopTimer();
        rankList.style.display = 'flex';
    }


    function resetGame() {
        document.querySelector('.rank').style.display = 'none';
        gameBoard.innerHTML = '';
        matchedCards = [];
        moves = 0;
        lives = 4;
        seconds = 0;
        timerDisplay.textContent = 'Time: 0s';
        stopTimer();
        updateLives();
        createGameBoard();
    }

    restartBtn.addEventListener('click', () => {
        stopTimer();
        resetGame();
    });

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

    createGameBoard();


});


