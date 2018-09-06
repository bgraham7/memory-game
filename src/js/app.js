function Game() {

    let state = {
        turns: 0,
        matches: 0
    }

    this.intializeBoard = function() {
        createBoard();
        hookUpClickEvents();
    }

    /* Board Creation Functions */
    createBoard = function() {
        const inMemoryBoard = createInMemoryBoard();
        createBoardInDom(inMemoryBoard);
    }

    createInMemoryBoard = function() {
        let board = [];
        const cardTypeClasses = ['fa-birthday-cake', 'fa-space-shuttle', 'fa-car', 'fa-snowflake-o',
                                'fa-anchor', 'fa-bicycle', 'fa-diamond', 'fa-heartbeat'];
        const pairedTypes = cardTypeClasses.concat(cardTypeClasses);
        shuffle(pairedTypes);
        for(var x = 0; x < 4; x++) {
            var row = [];
            for(var y = 0; y < 4; y++) {
                row.push(pairedTypes[(x * 4) + y]);
            }
            board.push(row);
        }
        return board;
    }

    shuffle = function(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    let boardDiv = null;

    createBoardInDom = function(board) {
        var contentHolder = document.getElementById('content');
        // 1) Create Board
        const boardDiv = document.createElement('div');
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
                front.className = `front fa ${card} fa-4x`;
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
    hookUpClickEvents = function() {
        boardDiv = document.getElementById('game-board');
        boardDiv.addEventListener('click', clickHandler);
    }

    firstCardPick = null;
    
    clickHandler = function(e) {
        const selectedCard = e.target.closest('.card');
        if(!selectedCard || selectedCard.className.includes('show')){
            return;
        }

        boardDiv.removeEventListener('click', clickHandler);

        selectedCard.classList.add("show");
        if (firstCardPick == null) {
            firstCardPick = selectedCard;
        } else {
            checkPair(selectedCard);
        }

        boardDiv.addEventListener('click', clickHandler);
    }

    checkPair = function(selectedCard) {
        addTurn();
        const firstType = firstCardPick.dataset.type;
        const secondType = selectedCard.dataset.type;
        if( firstType === secondType) {
            state.matches++;
            // Check for a win
            if(state.matches == 8) {
                var modal = document.getElementById('modal');
                modal.classList.add('open');
            }
        } else {
            const unflipHolder = firstCardPick;
            setTimeout(function() {
                unflipHolder.classList.remove("show");
                selectedCard.classList.remove("show");
            }, 800);
        }
        firstCardPick = null;
    }
    

    addTurn = function() {
        state.turns++;
        document.getElementById('turns').innerText = state.turns;
        const stars = document.getElementsByClassName('star');
        if(state.turns > 12) {
            stars[2].className = 'fa fa-star-o star';
        }
        if (state.turns > 18) {
            stars[1].className = 'fa fa-star-o star';
        }
        if (state.turns > 24) {
            stars[0].className = 'fa fa-star-o star';
        }
    }
}

const game = new Game();
document.addEventListener("DOMContentLoaded", function(event) { 
    game.intializeBoard();
});