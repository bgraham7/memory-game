function Game() {
    this.board = [];

    this.intializeBoard = function() {

        var contentHolder = document.getElementById('content')

        this.board = createInMemoryBoard();
        const boardDiv = document.createElement('div');
        boardDiv.className = 'game-board';
        this.board.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'card-row';
            row.forEach(card => {
                const cardDiv = document.createElement('div');
                cardDiv.className = `card fa ${card} fa-4x`;
                rowDiv.appendChild(cardDiv);
            });
            boardDiv.appendChild(rowDiv);
        });
        contentHolder.appendChild(boardDiv);
    }

    createInMemoryBoard = function() {
        let board = [];
        const cardTypeClasses = ['fa-birthday-cake', 'fa-space-shuttle', 'fa-car-side', 'fa-chess',
                                'fa-crown', 'fa-frog', 'fa-grin', 'fa-kiwi-bird'];
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
}

const game = new Game();

document.addEventListener("DOMContentLoaded", function(event) { 
    game.intializeBoard();
});