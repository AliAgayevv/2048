const BOARD_SIZE = 4;
const CELL_SIZE = 100;
const CELL_GAP = 10;

const highScore = (document.getElementById("highScore").textContent =
  localStorage.getItem("highScore") || 0);

class Game {
  constructor() {
    this.board = [];
    this.score = 0;
    this.highScore = localStorage.getItem("highScore") || 0;
    this.gameWon = false;
    this.gameOver = false;
    this.isAnimating = false;
    this.markForMergeAnimation = [];

    this.initializeBoard();
    this.setupEventListeners();
    this.setupTouchControls();
    this.updateHighScore();
  }

  initializeBoard() {
    this.board = Array(BOARD_SIZE)
      .fill()
      .map(() => Array(BOARD_SIZE).fill(0));

    this.createBoardDOM();

    this.addRandomCell();
    this.addRandomCell();

    this.updateDisplay();
  }

  createBoardDOM() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    const containerWidth = Math.min(400, window.innerWidth - 40);
    const cellSize = Math.floor((containerWidth - 50) / 4);
    const gap = Math.max(5, Math.floor(cellSize * 0.1));

    const boardSize = BOARD_SIZE * cellSize + (BOARD_SIZE + 1) * gap;
    boardElement.style.width = `${boardSize}px`;
    boardElement.style.height = `${boardSize}px`;
    boardElement.style.display = "grid";
    boardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, ${cellSize}px)`;
    boardElement.style.gridTemplateRows = `repeat(${BOARD_SIZE}, ${cellSize}px)`;
    boardElement.style.gap = `${gap}px`;

    document.documentElement.style.setProperty("--cell-size", `${cellSize}px`);
    document.documentElement.style.setProperty("--gap-size", `${gap}px`);

    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `cell-${Math.floor(i / BOARD_SIZE)}-${i % BOARD_SIZE}`;
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      boardElement.appendChild(cell);
    }
  }

  addRandomCell() {
    const emptyCells = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      const value = Math.random() < 0.9 ? 2 : 4;
      this.board[randomCell.row][randomCell.col] = value;

      setTimeout(() => {
        this.createTileElement(randomCell.row, randomCell.col, value, true);
      }, 50);
    }
  }

  createTileElement(row, col, value, isNew = false, isMerged = false) {
    const boardElement = document.getElementById("board");
    const cellSize =
      parseInt(
        document.documentElement.style.getPropertyValue("--cell-size")
      ) || 90;
    const gap =
      parseInt(document.documentElement.style.getPropertyValue("--gap-size")) ||
      5;

    const tile = document.createElement("div");
    tile.classList.add("tile");
    if (isNew) tile.classList.add("tile-new");
    if (isMerged) tile.classList.add("tile-merged");

    tile.id = `tile-${row}-${col}`;
    tile.textContent = value;

    const x = col * (cellSize + gap);
    const y = row * (cellSize + gap);

    tile.style.left = `${x}px`;
    tile.style.top = `${y}px`;
    tile.style.width = `${cellSize}px`;
    tile.style.height = `${cellSize}px`;

    const colors = this.getCellColors(value);
    tile.style.backgroundColor = colors.cellColor;
    tile.style.color = colors.textColor;
    tile.style.fontSize = colors.fontSize || `${Math.floor(cellSize * 0.6)}px`;
    tile.style.boxShadow = colors.boxShadow || "none";

    boardElement.appendChild(tile);

    if (isMerged) {
      setTimeout(() => {
        tile.classList.remove("tile-merged");
      }, 150);
    }
  }

  updateDisplay() {
    const existingTiles = document.querySelectorAll(".tile");
    existingTiles.forEach((tile) => tile.remove());

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const value = this.board[i][j];
        if (value !== 0) {
          const isMerged =
            this.markForMergeAnimation &&
            this.markForMergeAnimation.includes(value);
          this.createTileElement(i, j, value, false, isMerged);
        }
      }
    }

    this.markForMergeAnimation = [];

    document.getElementById("score").textContent = this.score;
  }

  getCellColors(value) {
    const colors = {
      0: {
        cellColor: "rgba(238, 228, 218, 0.35)",
        textColor: "#776e65",
      },
      2: {
        cellColor: "#eee4da",
        textColor: "#776e65",
      },
      4: {
        cellColor: "#ede0c8",
        textColor: "#776e65",
      },
      8: {
        cellColor: "#f2b179",
        textColor: "#f9f6f2",
      },
      16: {
        cellColor: "#f59563",
        textColor: "#f9f6f2",
      },
      32: {
        cellColor: "#f67c5f",
        textColor: "#f9f6f2",
      },
      64: {
        cellColor: "#f65e3b",
        textColor: "#f9f6f2",
      },
      128: {
        cellColor: "#edcf72",
        textColor: "#f9f6f2",
        fontSize: "45px",
      },
      256: {
        cellColor: "#edcc61",
        textColor: "#f9f6f2",
        fontSize: "45px",
      },
      512: {
        cellColor: "#edc850",
        textColor: "#f9f6f2",
        fontSize: "45px",
      },
      1024: {
        cellColor: "#edc53f",
        textColor: "#f9f6f2",
        fontSize: "35px",
      },
      2048: {
        cellColor: "#edc22e",
        textColor: "#f9f6f2",
        fontSize: "35px",
        boxShadow: "0 0 30px 10px rgba(243, 215, 116, 0.2)",
      },
      4096: {
        cellColor: "#3c39a4",
        textColor: "#f9f6f2",
        fontSize: "30px",
      },
      8192: {
        cellColor: "#a939a4",
        textColor: "#f9f6f2",
        fontSize: "30px",
      },
    };

    return colors[value] || colors[8192];
  }

  async move(direction) {
    if (this.gameOver || this.isAnimating) return;

    this.isAnimating = true;
    let moved = false;
    const previousBoard = this.board.map((row) => [...row]);

    switch (direction) {
      case "left":
        moved = this.moveLeft();
        break;
      case "right":
        moved = this.moveRight();
        break;
      case "up":
        moved = this.moveUp();
        break;
      case "down":
        moved = this.moveDown();
        break;
    }

    if (moved) {
      this.updateDisplay();

      await this.sleep(150);

      this.addRandomCell();

      this.checkGameStatus();
    }

    this.isAnimating = false;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  moveLeft() {
    let moved = false;
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = this.board[i];
      const newRow = this.processRow(row);
      if (!this.arraysEqual(row, newRow)) {
        moved = true;
        this.board[i] = newRow;
      }
    }
    return moved;
  }

  moveRight() {
    let moved = false;
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = this.board[i].slice().reverse();
      const newRow = this.processRow(row).reverse();
      if (!this.arraysEqual(this.board[i], newRow)) {
        moved = true;
        this.board[i] = newRow;
      }
    }
    return moved;
  }

  moveUp() {
    let moved = false;
    for (let j = 0; j < BOARD_SIZE; j++) {
      const column = [];
      for (let i = 0; i < BOARD_SIZE; i++) {
        column.push(this.board[i][j]);
      }
      const newColumn = this.processRow(column);

      let columnChanged = false;
      for (let i = 0; i < BOARD_SIZE; i++) {
        if (this.board[i][j] !== newColumn[i]) {
          columnChanged = true;
          this.board[i][j] = newColumn[i];
        }
      }
      if (columnChanged) moved = true;
    }
    return moved;
  }

  moveDown() {
    let moved = false;
    for (let j = 0; j < BOARD_SIZE; j++) {
      const column = [];
      for (let i = BOARD_SIZE - 1; i >= 0; i--) {
        column.push(this.board[i][j]);
      }
      const newColumn = this.processRow(column);

      let columnChanged = false;
      for (let i = 0; i < BOARD_SIZE; i++) {
        if (this.board[BOARD_SIZE - 1 - i][j] !== newColumn[i]) {
          columnChanged = true;
          this.board[BOARD_SIZE - 1 - i][j] = newColumn[i];
        }
      }
      if (columnChanged) moved = true;
    }
    return moved;
  }

  processRow(row) {
    let newRow = row.filter((val) => val !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;

        this.markForMergeAnimation = this.markForMergeAnimation || [];
        this.markForMergeAnimation.push(newRow[i]);
      }
    }

    newRow = newRow.filter((val) => val !== 0);

    while (newRow.length < BOARD_SIZE) {
      newRow.push(0);
    }

    return newRow;
  }

  arraysEqual(arr1, arr2) {
    return (
      arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i])
    );
  }

  checkGameStatus() {
    if (!this.gameWon) {
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (this.board[i][j] === 2048) {
            this.gameWon = true;
            this.showMessage("Kazandınız! 🎉", "2048'e ulaştınız! Tebrikler!");
            return;
          }
        }
      }
    }

    if (!this.canMove()) {
      this.gameOver = true;
      this.showMessage("Oyun Bitti! 😞", "Daha fazla hamle yapamıyorsunuz.");
    }
  }

  canMove() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const current = this.board[i][j];

        if (j < BOARD_SIZE - 1 && this.board[i][j + 1] === current) {
          return true;
        }

        if (i < BOARD_SIZE - 1 && this.board[i + 1][j] === current) {
          return true;
        }
      }
    }

    return false;
  }

  showMessage(title, text) {
    document.getElementById("messageTitle").textContent = title;
    document.getElementById("messageText").textContent = text;
    document.getElementById("gameMessage").style.display = "flex";
  }

  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore);
    }
    document.getElementById("highScore").textContent = this.highScore;
  }

  setupEventListeners() {
    document.addEventListener("keydown", (event) => {
      if (this.gameOver) return;

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          this.move("up");
          break;
        case "ArrowDown":
          event.preventDefault();
          this.move("down");
          break;
        case "ArrowLeft":
          event.preventDefault();
          this.move("left");
          break;
        case "ArrowRight":
          event.preventDefault();
          this.move("right");
          break;
      }
      this.updateHighScore();
    });

    document.querySelectorAll(".control-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const direction = e.target.getAttribute("data-direction");
        this.move(direction);
        this.updateHighScore();
      });
    });
  }

  setupTouchControls() {
    const boardElement = document.getElementById("board");
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const minSwipeDistance = 50;

    boardElement.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
      },
      { passive: false }
    );

    boardElement.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    boardElement.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        if (e.changedTouches.length === 0) return;

        const touch = e.changedTouches[0];
        endX = touch.clientX;
        endY = touch.clientY;

        this.handleSwipe(startX, startY, endX, endY, minSwipeDistance);
      },
      { passive: false }
    );

    let isMouseDown = false;

    boardElement.addEventListener("mousedown", (e) => {
      isMouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    boardElement.addEventListener("mousemove", (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
    });

    boardElement.addEventListener("mouseup", (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;

      endX = e.clientX;
      endY = e.clientY;

      this.handleSwipe(startX, startY, endX, endY, minSwipeDistance);
    });

    boardElement.addEventListener("mouseleave", () => {
      isMouseDown = false;
    });
  }

  handleSwipe(startX, startY, endX, endY, minDistance) {
    if (this.gameOver || this.isAnimating) return;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance < minDistance) return;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
      if (deltaX > 0) {
        this.move("right");
      } else {
        this.move("left");
      }
    } else {
      if (deltaY > 0) {
        this.move("down");
      } else {
        this.move("up");
      }
    }

    this.updateHighScore();
  }

  restart() {
    this.score = 0;
    this.gameWon = false;
    this.gameOver = false;
    this.isAnimating = false;
    this.markForMergeAnimation = [];
    document.getElementById("gameMessage").style.display = "none";
    this.initializeBoard();
  }

  resize() {
    this.createBoardDOM();
    this.updateDisplay();
  }
}

let game;

function startGame() {
  document.getElementById("startGame").style.display = "none";
  document.getElementById("restartGame").style.display = "inline-block";
  game = new Game();
}

function restartGame() {
  if (game) {
    game.restart();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startGame").addEventListener("click", startGame);
  document.getElementById("restartGame").addEventListener("click", restartGame);
  document.getElementById("tryAgain").addEventListener("click", () => {
    document.getElementById("gameMessage").style.display = "none";
    restartGame();
  });

  window.addEventListener("resize", () => {
    if (game) {
      game.resize();
    }
  });

  if (window.innerWidth <= 768) {
    document.body.classList.add("mobile");
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (game) {
      game.isAnimating = false;
    }
  }
});

window.addEventListener("error", (e) => {
  console.error("Oyun hatası:", e.error);
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedResize = debounce(() => {
  if (game) {
    game.resize();
  }
}, 250);

window.addEventListener("resize", debouncedResize);
