function Game() {

    let state;
    let timer;

    this.startGame = function() {
        state = {
            turns: 0,
            matches: 0
        };
        const modal = document.getElementById('modal');
        modal.classList.remove('open');
        updateStatusBar();
        createBoard();
        hookUpClickEvents();
        timer = new Timer();
        timer.start();
    };

    /* Board Creation Functions */
    function createBoard() {
        const inMemoryBoard = createInMemoryBoard();
        createBoardInDom(inMemoryBoard);
    }

    function createInMemoryBoard() {
        let board = [];
        const cardTypeClasses = ['fa-birthday-cake', 'fa-space-shuttle', 'fa-car', 'fa-snowflake-o',
                                'fa-anchor', 'fa-bicycle', 'fa-diamond', 'fa-heartbeat'];
        const pairedTypes = cardTypeClasses.concat(cardTypeClasses);
        shuffle(pairedTypes);
        for(let x = 0; x < 4; x++) {
            let row = [];
            for(let y = 0; y < 4; y++) {
                row.push(pairedTypes[(x * 4) + y]);
            }
            board.push(row);
        }
        return board;
    }

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    let boardDiv = null;

    function createBoardInDom(board) {
        let contentHolder = document.getElementById('content');
        // Clear old board if exists;
        if(boardDiv) {
            boardDiv.remove();
        }
        // 1) Create Board
        boardDiv = document.createElement('div');
        boardDiv.id = 'game-board';
        board.forEach(row => {
            // 2) Create Each Row
            const rowDiv = document.createElement('div');
            rowDiv.className = 'card-row';
            row.forEach(card => {
                // 3) Create Each Card (card, flipper, front, back)
                const cardDiv = document.createElement('div');
                cardDiv.className = "card";
                cardDiv.dataset.type = card;

                const flipper = document.createElement('div');
                flipper.className = 'flipper';
                const front = document.createElement('div');
                front.className = `front fa ${card}`;
                flipper.appendChild(front);
                const back = document.createElement('div');
                back.className = 'back';
                flipper.appendChild(back);

                cardDiv.appendChild(flipper);

                rowDiv.appendChild(cardDiv);
            });
            boardDiv.appendChild(rowDiv);
        });
        contentHolder.appendChild(boardDiv);
    }

    

    /* Click Event */
    function hookUpClickEvents() {
        boardDiv = document.getElementById('game-board');
        boardDiv.addEventListener('click', cardClickHandler);
    }

    let firstCardPick = null;
    
    function cardClickHandler(e) {
        const selectedCard = e.target.closest('.card');
        if(!selectedCard || selectedCard.className.includes('show')){
            return;
        }

        boardDiv.removeEventListener('click', cardClickHandler);

        selectedCard.classList.add("show");
        if (firstCardPick == null) {
            firstCardPick = selectedCard;
        } else {
            checkPair(selectedCard);
        }

        boardDiv.addEventListener('click', cardClickHandler);
    }

    function checkPair(selectedCard) {
        state.turns++;
        updateStatusBar();
        const firstType = firstCardPick.dataset.type;
        const secondType = selectedCard.dataset.type;
        if( firstType === secondType) {
            state.matches++;
            firstCardPick.classList.add('matched');
            selectedCard.classList.add('matched');
            // Check for a win
            if(state.matches == 8) {
                openWinModal();
            }
        } else {
            firstCardPick.classList.add('mis-matched');
            selectedCard.classList.add('mis-matched');
            const unflipHolder = firstCardPick;
            setTimeout(function() {
                unflipHolder.classList.remove("show");
                selectedCard.classList.remove("show");
            }, 800);
            // Slightly longer timeout so cards remain styled during flip
            setTimeout(function() {
                unflipHolder.classList.remove("mis-matched");
                selectedCard.classList.remove("mis-matched");
            }, 1000);
        }
        firstCardPick = null;
    }

    function openWinModal() {
        const endMovesSpan = document.getElementById('end-moves');
        endMovesSpan.innerText = state.turns;

        const endStarsSpan = document.getElementById('end-stars');
        const stars = document.getElementsByClassName('fa-star');
        if(stars.length === 1) {
            endStarsSpan.innerText = "1 star!";
        } else {
            endStarsSpan.innerText = stars.length + " stars!";
        }
        let timeSpan = document.getElementById('end-time');
        timer.stop();
        let time = timer.getTime();
        timeSpan.innerHTML = time;

        const modal = document.getElementById('modal');
        modal.classList.add('open');
    }
    

    function updateStatusBar() {
        document.getElementById('turns').innerText = state.turns;
        const stars = document.getElementsByClassName('star');
        if(state.turns === 0) {
            stars[0].className = 'fa fa-star star';
            stars[1].className = 'fa fa-star star';
            stars[2].className = 'fa fa-star star';
        } else if (state.turns === 13) {
            stars[2].className = 'fa fa-star-o star';
        } else if (state.turns === 19) {
            stars[1].className = 'fa fa-star-o star';
        } else if (state.turns === 25) {
            stars[0].className = 'fa fa-star-o star';
        }
    }
}

/* Based on:
    https://codepen.io/cathydutton/pen/GBcvo */
function Timer() {
    let seconds = 0; 
    let minutes = 0;
    let secondsDiv = document.getElementById("seconds")
    let minutesDiv = document.getElementById("minutes");

    let interval;

    this.start = function() {
        clearInterval(interval);
        interval = setInterval(startTimer, 1000);
        secondsDiv.innerHTML = "00";
        minutesDiv.innerHTML = "00";
    };

    this.stop = function() {
        clearInterval(interval);
    };

    this.getTime = function() {
        return formatTime(minutes) + ":" + formatTime(seconds);
    };

    function startTimer() {
        seconds++; 
        secondsDiv.innerHTML = formatTime(seconds);
        
        if (seconds > 59) {
          minutes++;
          seconds = 0;
          secondsDiv.innerHTML = "00";
          minutesDiv.innerHTML = formatTime(minutes);
        }
    }

    function formatTime(time) {
        let formatted = "";
        if(time < 9){
            formatted =  "0" + time;
        }
         
         if (time > 9){
            formatted = time.toString();
        }
        return formatted;
    }
}

const game = new Game();

document.addEventListener("DOMContentLoaded", function(event) { 
    game.startGame();

    const newGameButtons = document.getElementsByClassName('new-game-btn');
    for(let i = 0; i < newGameButtons.length; i++) {
        newGameButtons[i].addEventListener('click', function() {
            game.startGame();
        });
    }
});