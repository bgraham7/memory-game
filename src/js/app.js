function Game() {
    this.board = [];

    this.intializeBoard = function() {
        //TODO HardCoding Cards to Start, Just Simple Numbers
        var contentHolder = document.getElementById('content')

        this.board = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16]
        ]

        const boardDiv = document.createElement('div');
        boardDiv.classList = ['game-board'];
        this.board.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.classList = ['card-row'];
            row.forEach(card => {
                const cardDiv = document.createElement('div');
                cardDiv.classList = ['card'];
                cardDiv.textContent = card.toString();
                rowDiv.appendChild(cardDiv);
            });
            boardDiv.appendChild(rowDiv);
        });
        contentHolder.appendChild(boardDiv);
    }
}

const game = new Game();

document.addEventListener("DOMContentLoaded", function(event) { 
    game.intializeBoard();
});