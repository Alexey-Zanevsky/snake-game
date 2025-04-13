import { BaseGame } from './base__game.js';

export class SpecialGame extends BaseGame {
  constructor(snakeSkin, gameSpeed, gameMode) {
    super(snakeSkin, gameSpeed, gameMode);
    this.specialObjects = [];
    this.specialObjectTimeout = null;
    this.specialObjectDuration = null;
  }

  generateFood() {
    if (this.food.active) {
      this.drawFood(this.food.coordinates.x, this.food.coordinates.y);
    } else {
      const { x, y } = this.getRandomCoordinates();
      this.drawFood(x, y);
    }
    
    if (this.specialObjectTimeout) clearTimeout(this.specialObjectTimeout);

    const { x, y } = this.getRandomCoordinates();
    const types = ['plus2', 'minus2', 'slow', 'fast'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const special = {
      x, y,
      type: randomType,
      background: this.getSpecialColor(randomType),
      border: '#000'
    };

    this.specialObjects.push(special);
    this.drawSpecialObject(special);

    this.specialObjectTimeout = setTimeout(() => {
      this.specialObjects = [];
    }, 5000);
  }

  getRandomCoordinates() {
    const gridSize = this.settings.snake.size;
    const xMax = this.canvas.width - gridSize;
    const yMax = this.canvas.height - gridSize;
    const x = Math.round((Math.random() * xMax) / gridSize) * gridSize;
    const y = Math.round((Math.random() * yMax) / gridSize) * gridSize;
    return { x, y };
  }

  getSpecialColor(type) {
    switch (type) {
      case 'plus2': return '#ff0000';      // red
      case 'minus2': return '#ff69b4';     // pink
      case 'slow': return '#3498db';       // blue
      case 'fast': return '#f1c40f';       // yellow
    }
  }

  drawFood(x, y) {
    const size = this.settings.snake.size;
    this.food.active = true;
    this.food.coordinates = { x, y };
    this.ctx.fillStyle = this.food.background;
    this.ctx.strokeStyle = this.food.border;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, size, size, 5);
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawSpecialObject(special) {
    const size = this.settings.snake.size;
    this.ctx.fillStyle = special.background;
    this.ctx.strokeStyle = special.border;
    this.ctx.beginPath();
    this.ctx.roundRect(special.x, special.y, size, size, 5);
    this.ctx.fill();
    this.ctx.stroke();
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
      this.generateFood();
    } else {
      this.snake.pop();
    }

    this.specialObjects.forEach((obj, index) => {
      if (this.snake[0].x === obj.x && this.snake[0].y === obj.y) {
        this.applySpecialEffect(obj.type);
        this.specialObjects.splice(index, 1);
      }
    });

    this.drawFood(this.food.coordinates.x, this.food.coordinates.y);
    this.specialObjects.forEach(obj => this.drawSpecialObject(obj));
    this.drawSnake();
  }

  applySpecialEffect(type) {
    switch (type) {
      case 'plus2':
        this.game.score += 2;
        this.scoreEl.textContent = this.game.score;
        break;
      case 'minus2':
        this.game.score = Math.max(0, this.game.score - 2);
        this.scoreEl.textContent = this.game.score;
        break;
      case 'slow':
        clearInterval(this.startGameInterval);
        const originalSpeed = this.game.speed;
        this.game.speed *= 2;
        this.startGame();
        setTimeout(() => {
          clearInterval(this.startGameInterval);
          this.game.speed = originalSpeed;
          this.startGame();
        }, 5000);
        break;
      case 'fast':
        clearInterval(this.startGameInterval);
        const prevSpeed = this.game.speed;
        this.game.speed *= 0.9;
        this.startGame();
        setTimeout(() => {
          clearInterval(this.startGameInterval);
          this.game.speed = prevSpeed;
          this.startGame();
        }, 5000);
        break;
    }
  }
  destroy() {
    super.destroy();
    clearInterval(this.specialObjectTimeout);
  }

}
