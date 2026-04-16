const size = 10;
const minesCount = 15;

let board = [];
let gameOver = false;

// Initialize game
function startGame() {
    gameOver = false;
    board = [];
    document.getElementById("status").innerText = "";

    createBoard();
    placeMines();
    renderBoard();
}

// Create empty board
function createBoard() {
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = {
                mine: false,
                revealed: false,
                flagged: false,
                count: 0
            };
        }
    }
}

// Place mines randomly
function placeMines() {
    let placed = 0;

    while (placed < minesCount) {
        let r = Math.floor(Math.random() * size);
        let c = Math.floor(Math.random() * size);

        if (!board[r][c].mine) {
            board[r][c].mine = true;
            placed++;
        }
    }

    // Calculate numbers
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!board[r][c].mine) {
                board[r][c].count = countMines(r, c);
            }
        }
    }
}

// Count nearby mines
function countMines(r, c) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let nr = r + i;
            let nc = c + j;

            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                if (board[nr][nc].mine) count++;
            }
        }
    }
    return count;
}

// Render board
function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            cell.addEventListener("click", () => reveal(r, c));
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                flag(r, c);
            });

            if (board[r][c].revealed) {
                cell.classList.add("revealed");

                if (board[r][c].mine) {
                    cell.classList.add("mine");
                    cell.innerText = "💣";
                } else if (board[r][c].count > 0) {
                    cell.innerText = board[r][c].count;
                }
            }

            if (board[r][c].flagged) {
                cell.classList.add("flag");
                cell.innerText = "🚩";
            }

            boardDiv.appendChild(cell);
        }
    }
}

// Reveal cell
function reveal(r, c) {
    if (gameOver || board[r][c].revealed || board[r][c].flagged) return;

    board[r][c].revealed = true;

    if (board[r][c].mine) {
        gameOver = true;
        revealAll();
        document.getElementById("status").innerText = "💥 Game Over!";
        return;
    }

    if (board[r][c].count === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let nr = r + i;
                let nc = c + j;

                if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                    reveal(nr, nc);
                }
            }
        }
    }

    checkWin();
    renderBoard();
}

// Flag cell
function flag(r, c) {
    if (gameOver || board[r][c].revealed) return;

    board[r][c].flagged = !board[r][c].flagged;
    renderBoard();
}

// Reveal all mines
function revealAll() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            board[r][c].revealed = true;
        }
    }
    renderBoard();
}

// Check win
function checkWin() {
    let safeCells = size * size - minesCount;
    let revealed = 0;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c].revealed && !board[r][c].mine) {
                revealed++;
            }
        }
    }

    if (revealed === safeCells) {
        gameOver = true;
        document.getElementById("status").innerText = "🎉 You Win!";
    }
}

// Start game
startGame();