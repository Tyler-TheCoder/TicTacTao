
function Player(name,symbol)
{
    let wins = 0;
    const incrementWins = () => { wins ++ }
    const getWins = () => wins ;
    return {name,symbol,incrementWins,getWins};
}

const GameBoard = (()=> {
    const board = [
        ["","",""],
        ["","",""],
        ["","",""]
    ];

    const play = (player,position)=>{
        if(!(board[position[0]][position[1]]))
            {board[position[0]][position[1]] = player.symbol;}
        else {console.log("Error , case not empty !");}
    }
    const getWinner = () => {
            // left top corner
            let current = board[0][0];
            if (current) {
                if (current == board[0][1] && current == board[0][2])
                    return {symbol: current, line: [[0,0],[0,1],[0,2]]};
                if (current == board[1][0] && current == board[2][0])
                    return {symbol: current, line: [[0,0],[1,0],[2,0]]};
            }
            // right bottom corner
            current = board[2][2];
            if (current) {
                if (current == board[2][1] && current == board[2][0])
                    return {symbol: current, line: [[2,2],[2,1],[2,0]]};
                if (current == board[1][2] && current == board[0][2])
                    return {symbol: current, line: [[2,2],[1,2],[0,2]]};
            }
            // center
            current = board[1][1];
            if (current) {
                if (current == board[0][0] && current == board[2][2])
                    return {symbol: current, line: [[1,1],[0,0],[2,2]]};
                if (current == board[0][2] && current == board[2][0])
                    return {symbol: current, line: [[1,1],[0,2],[2,0]]};
                if (current == board[0][1] && current == board[2][1])
                    return {symbol: current, line: [[1,1],[0,1],[2,1]]};
                if (current == board[1][0] && current == board[1][2])
                    return {symbol: current, line: [[1,1],[1,0],[1,2]]};
            }
            return null;
        }
    const isFull = () => {
        for (let r = 0; r < 3; r++)
            for (let c = 0; c < 3; c++)
                if (board[r][c] === "") return false;
        return true;
    }
    const reset = ()=> {
        for (let r = 0; r < 3; r++)
            for (let c = 0; c < 3; c++)
                board[r][c] = "";
    }
        

    return {board,play,getWinner,isFull,reset};
})();

let player1, player2;

const DisplayController = (()=>{
    const setupPage = document.getElementById("setup-page");
    const gamePage = document.getElementById("game-page");
    const statusEl = document.getElementById("status");
    const p1NameEl = document.getElementById("p1-name-display");
    const p2NameEl = document.getElementById("p2-name-display");
    const p1WinsEl = document.getElementById("p1-wins");
    const p2WinsEl = document.getElementById("p2-wins");
    const drawDialog = document.getElementById("draw-dialog");

    let currentPlayer = null;
    let gameOver = false;

    const showPage = (page)=>{
        const pages = document.getElementsByClassName("page");
        for (let i = 0; i < pages.length; i++) {
            pages[i].classList.remove("active");
        }
        page.classList.add("active");
    }

    const highlightWin = (line)=>{
        const cells = document.getElementsByClassName("cell");
        for (let i = 0; i < line.length; i++) {
            let idx = line[i][0] * 3 + line[i][1];
            cells[idx].classList.add("win");
        }
    }

    const clearHighlights = ()=>{
        const cells = document.getElementsByClassName("cell");
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.remove("win");
        }
    }

    const updatePlayerInfo = ()=>{
        if (player1) {
            p1NameEl.textContent = player1.name;
            p1WinsEl.textContent = "Wins: " + player1.getWins();
        }
        if (player2) {
            p2NameEl.textContent = player2.name;
            p2WinsEl.textContent = "Wins: " + player2.getWins();
        }
    }

    const render = ()=>{
        const cells = document.getElementsByClassName("cell");
        for (let i = 0; i < 9; i++) {
            let row = Math.floor(i / 3);
            let col = i % 3;
            cells[i].textContent = GameBoard.board[row][col];
            cells[i].className = "cell";
            if (GameBoard.board[row][col] !== "") {
                cells[i].classList.add("taken");
                if (GameBoard.board[row][col] === "X")
                    cells[i].classList.add("x");
                else
                    cells[i].classList.add("o");
            }
        }
        if (currentPlayer && !gameOver) {
            statusEl.textContent = currentPlayer.name + " (" + currentPlayer.symbol + ")'s turn";
        } else if (!gameOver) {
            statusEl.textContent = "";
        }
        updatePlayerInfo();
    };

    const handleCellClick = (e)=>{
        if (gameOver || !currentPlayer) return;

        const cell = e.currentTarget;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (GameBoard.board[row][col] !== "") return;

        GameBoard.play(currentPlayer, [row, col]);
        render();

        let winner = GameBoard.getWinner();
        if (winner) {
            currentPlayer.incrementWins();
            statusEl.textContent = currentPlayer.name + " wins!";
            gameOver = true;
            highlightWin(winner.line);
            updatePlayerInfo();
        } else if (GameBoard.isFull()) {
            gameOver = true;
            drawDialog.classList.add("active");
        } else {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            render();
        }
    };

    const startGame = ()=>{
        let name1 = document.getElementById("player1-name").value;
        let name2 = document.getElementById("player2-name").value;
        if (name1 === "") name1 = "Player 1";
        if (name2 === "") name2 = "Player 2";
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        gameOver = false;
        GameBoard.reset();
        clearHighlights();
        render();
        showPage(gamePage);
    }

    const resetGame = ()=>{
        currentPlayer = player1;
        gameOver = false;
        GameBoard.reset();
        clearHighlights();
        render();
    }

    const changeNames = ()=>{
        document.getElementById("player1-name").value = player1.name;
        document.getElementById("player2-name").value = player2.name;
        showPage(setupPage);
    }

    const cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", handleCellClick);
    }

    document.getElementById("start-btn").addEventListener("click", startGame);
    document.getElementById("reset-btn").addEventListener("click", resetGame);
    document.getElementById("change-name-btn").addEventListener("click", changeNames);
    document.getElementById("draw-ok-btn").addEventListener("click", function() {
        drawDialog.classList.remove("active");
    });

    showPage(setupPage);
})();
