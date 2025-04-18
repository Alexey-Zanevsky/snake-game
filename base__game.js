'use strict';

import { goToMenu } from './script.js';

export class BaseGame {
  constructor(snakeSkin, gameSpeed, gameMode) {
    this.canvas = document.querySelector(".snake-field");
    this.ctx = this.canvas.getContext("2d");

    this.timeText = document.querySelector(".time-text");
    this.timeEl = document.querySelector(".time");
    this.scoreEl = document.querySelector(".score");
    this.gameOverModal = document.querySelector(".gameOverModal");
    this.finalTime = document.querySelector(".finalTime");
    this.finalScore = document.querySelector(".finalScore");
    this.pauseOverlay = document.querySelector(".pause-overlay");

    this.restartBtn = this.gameOverModal.querySelectorAll("button")[0];
    this.goToMenuBtn = this.gameOverModal.querySelectorAll("button")[1];
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.restartGameHandler = this.restartGameHandler.bind(this);
    this.goToMenuHandler = this.goToMenuHandler.bind(this);

    this.settings = {
      snake: {
        size: 30,
        snakeSkin: this.validateSnakeSkin(snakeSkin)
      }
    };

    this.game = {
      mode: gameMode,
      speed: gameSpeed,
      keyCodes: {
        38: 'up', 40: 'down', 39: 'right', 37: 'left',
        87: 'up', 83: 'down', 68: 'right', 65: 'left'
      }
    };
  }

  validateSnakeSkin(snakeSkin) {
    if (snakeSkin.type === 'image' && snakeSkin.src) {
      return { type: 'image', src: snakeSkin.src };
    } else if (snakeSkin.type === 'color' && snakeSkin.background && snakeSkin.border) {
      return { type: 'color', background: snakeSkin.background, border: snakeSkin.border };
    } else {
      console.warn("Error. Installed default snake skin.");
      return { type: 'color', background: colors.color_3, border: colors.color_2 };
    }
  }

  start() {
    this.setUpGame();
    let count = 1;
    const countdownInterval = setInterval(() => {
      if (count === 1) {
        this.timeEl.textContent = "START!";
      } 
      if (count === 0) {
        clearInterval(countdownInterval);
        this.timeEl.textContent = "00:00";
        this.timeText.textContent = "time";
        this.startGameTimer();
        this.startGame();
      }
      count--;
    }, 800);
    console.log("start base__game.js");
  }

  setUpGame() {
    this.snake = [
      { x: this.settings.snake.size * 3, y: 0 },
      { x: this.settings.snake.size * 2, y: 0 },
      { x: this.settings.snake.size, y: 0 }
    ];

    this.food = {
      active: false,
      background: colors.color_5,
      border: colors.color_6,
      coordinates: { x: 0, y: 0 }
    };

    this.game.gameTimer = 0;
    this.game.gameTime = 1;
    this.game.score = 0;
    this.game.isPaused = false;
    this.game.direction = 'right';
    this.game.nextDirection = 'right';

    document.addEventListener('keydown', this.handleKeyDown);
    this.restartBtn.addEventListener("click", this.restartGameHandler);
    this.goToMenuBtn.addEventListener("click", this.goToMenuHandler);
  }

  startGameTimer() {
    this.game.gameTimer = setInterval(() => {
      this.game.gameTime++;
      let minutes = String(Math.floor((this.game.gameTime - 1) / 60)).padStart(2, '0');
      let seconds = String((this.game.gameTime - 1) % 60).padStart(2, '0');
      this.timeEl.textContent = `${minutes}:${seconds}`;
    }, 1000);
  }

  startGame() {
    this.scoreEl.textContent = this.game.score;
    this.generateSnake();

    this.startGameInterval = setInterval(() => {
      if (!this.detectCollision() && this.game.gameTime != 0) {  // && this.gameTime != 0   for Hardcore Mode
        this.generateSnake();
      } else {
        this.endGame();
      }
    }, this.game.speed);
  }

  handleKeyDown(event) {
    if(event.keyCode === 32 && this.game.mode !== 'hardcore') { // 32 - space
      this.togglePause();
      return;
    }
    this.changeDirection(event.keyCode);
  }

  togglePause() {
    if (this.game.isPaused) {
      this.game.isPaused = false;
      this.pauseOverlay.classList.remove("visible");
      this.startGameTimer(); 
      this.startGameInterval = setInterval(() => {
        if (!this.detectCollision() && this.game.gameTime != 0) {
          this.generateSnake();
        } else {
          this.endGame();
        }
      }, this.game.speed);
      this.timeText.textContent = "time";
    } else {
      this.pauseOverlay.classList.add("visible");
      this.game.isPaused = true;
      clearInterval(this.game.gameTimer);
      clearInterval(this.startGameInterval);
    }
  }

  restartGameHandler = () => {
    this.gameOverModal.style.display = "none";
    this.timeEl.textContent = "READY?";
    this.scoreEl.textContent = 0;
    this.destroy();
    this.start();
  };
  
  goToMenuHandler = () => {
    this.gameOverModal.style.display = "none";
    this.destroy();
    goToMenu();
  };

  changeDirection(keyCode) {
    const validKeyPress = Object.keys(this.game.keyCodes).includes(keyCode.toString());
    if (validKeyPress && this.validateDirectionChange(this.game.keyCodes[keyCode], this.game.direction)) {
      this.game.nextDirection = this.game.keyCodes[keyCode];
    }
  }

  validateDirectionChange(keyPress, currentDirection) {
    return (keyPress === 'left' && currentDirection !== 'right') || 
           (keyPress === 'right' && currentDirection !== 'left') ||
           (keyPress === 'up' && currentDirection !== 'down') ||
           (keyPress === 'down' && currentDirection !== 'up');
  }

  generateSnake() {
    let coordinate;
    switch (this.game.direction) {
      case 'right': coordinate = { x: this.snake[0].x + this.settings.snake.size, y: this.snake[0].y }; break;
      case 'up':    coordinate = { x: this.snake[0].x, y: this.snake[0].y - this.settings.snake.size }; break;
      case 'left':  coordinate = { x: this.snake[0].x - this.settings.snake.size, y: this.snake[0].y }; break;
      case 'down':  coordinate = { x: this.snake[0].x, y: this.snake[0].y + this.settings.snake.size }; break;
    }

    this.snake.unshift(coordinate);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const ateFood = this.snake[0].x === this.food.coordinates.x && this.snake[0].y === this.food.coordinates.y;
    if (ateFood) {
      this.food.active = false;
      this.game.score += 1;
      this.scoreEl.textContent = this.game.score;
    } else {
      this.snake.pop();
    }

    this.generateFood();
    this.drawSnake();
  }

  drawSnake() {
    const size = this.settings.snake.size;
    this.ctx.fillStyle = this.settings.snake.snakeSkin.background;
    this.ctx.strokeStyle = this.settings.snake.snakeSkin.border;

    this.snake.forEach(segment => {
      this.ctx.beginPath();
      this.ctx.roundRect(segment.x, segment.y, size, size, 5);
      this.ctx.fill();
      this.ctx.stroke();
    });

    this.game.direction = this.game.nextDirection;
  }

  generateFood() {
    if (this.food.active) {
      this.drawFood(this.food.coordinates.x, this.food.coordinates.y);
      return;
    }
  
    const gridSize = this.settings.snake.size;
    const columns = this.canvas.width / gridSize;
    const rows = this.canvas.height / gridSize;
    const totalCells = columns * rows;
  
    if (this.snake.length >= totalCells) {
      this.endGame(true); 
      return;
    }
  
    let x, y, isOnSnake;
    do {
      x = Math.floor(Math.random() * columns) * gridSize;
      y = Math.floor(Math.random() * rows) * gridSize;
      isOnSnake = this.snake.some(segment => segment.x === x && segment.y === y);
    } while (isOnSnake);
  
    this.drawFood(x, y);
  }
  

  drawFood(x, y) {
    const size = this.settings.snake.size;
    this.ctx.fillStyle = this.food.background;
    this.ctx.strokeStyle = this.food.border;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, size, size, 5);
    this.ctx.fill();
    this.ctx.stroke();

    this.food.active = true;
    this.food.coordinates.x = x;
    this.food.coordinates.y = y;
  }

  detectCollision() {
    for (let i = 4; i < this.snake.length; i++) {
      if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
        return true;
      }
    }
    const left = this.snake[0].x < 0;
    const top = this.snake[0].y < 0;
    const right = this.snake[0].x > this.canvas.width - this.settings.snake.size;
    const bottom = this.snake[0].y > this.canvas.height - this.settings.snake.size;

    return left || top || right || bottom;
  }

  destroy() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.restartBtn.removeEventListener("click", this.restartGameHandler);
    this.goToMenuBtn.removeEventListener("click", this.goToMenuHandler);
  }

  endGame() {
    clearInterval(this.game.gameTimer);
    clearInterval(this.startGameInterval);
    document.removeEventListener('keydown', this.handleKeyDown);
    this.finalTime.textContent = this.timeEl.textContent;
    this.finalScore.textContent = this.scoreEl.textContent;
    this.gameOverModal.style.display = "block";

    const title = this.gameOverModal.querySelector(".game-over-title");
    if (title) {
      title.textContent = victory ? "YOU WIN!" : "GAME OVER";
    }
  }
}
