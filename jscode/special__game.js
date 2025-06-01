'use strict';

import { BaseGame } from './base__game.js';
/**
 * Class representing the special game mode.
 * Extends the base game functionality with special food items that have various effects.
 */
export class SpecialGame extends BaseGame {
  constructor(snakeSkin, gameSpeed, gameMode) {
    super(snakeSkin, gameSpeed, gameMode);
    this.specialFoodInterval = null;
    this.specialFood = {
      timeSpentOnTheField: 0,
      effectOn: false,
      active: false,
      type: null,
      coordinates: { x: 0, y: 0 },
      types: [
        { type: 'blue',    effect: 'addPoints',    value: 2,     background: '#007bff', border: '#0056b3' },
        { type: 'red',     effect: 'subtractPoints', value: -2,    background: '#dc3545', border: '#a71d2a' },
        { type: 'yellow',  effect: 'speedUp',       value: -25, background: '#ffc107', border: '#b38600' },
        { type: 'white',   effect: 'slowDown',      value: +25, background: '#f8f9fa', border: '#ced4da' }
      ]
    };
  }

  startGame() {
    this.scoreEl.textContent = this.game.score;
    this.generateSnake();

    this.startGameInterval = setInterval(() => {
      if (!this.detectCollision() && this.game.gameTime != 0) {
        this.generateSnake();
      } else {
        this.endGame();
      }
    }, this.game.speed);

    this.specialFoodInterval = setInterval(() => {
      // Если еда есть на поле и не активна (не съедена)
      if (this.specialFood.active && !this.specialFood.effectOn) {
        this.specialFood.timeSpentOnTheField++;
  
        // Удалить и пересоздать еду, если прошло 5 секунд
        if (this.specialFood.timeSpentOnTheField >= 5) {
          this.specialFood.active = false;
          this.specialFood.timeSpentOnTheField = 0;
          this.generateSpecialFood();
        }
  
      // Если еды нет и эффект не активен — сгенерировать
      } else if (!this.specialFood.active && !this.specialFood.effectOn) {
        this.generateSpecialFood();
      }
    }, 1000);
  }

  async generateSnake() {
    this.game.direction = this.game.nextDirection;
    let coordinate;
    switch (this.game.direction) {
      case 'right': coordinate = { x: this.snake[0].x + this.settings.snake.size, y: this.snake[0].y }; break;
      case 'up':    coordinate = { x: this.snake[0].x, y: this.snake[0].y - this.settings.snake.size }; break;
      case 'left':  coordinate = { x: this.snake[0].x - this.settings.snake.size, y: this.snake[0].y }; break;
      case 'down':  coordinate = { x: this.snake[0].x, y: this.snake[0].y + this.settings.snake.size }; break;
    }

    this.snake.unshift(coordinate);
    this.game.inputLocked = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // if (this.specialFood.onField && !this.specialFood.active) {
    //   const { x, y } = this.specialFood.coordinates;
    //   const { background, border } = this.specialFood.type;
    //   this.drawSpecialFood(x, y, background, border);
    // }

    const ateFood = this.snake[0].x === this.food.coordinates.x && this.snake[0].y === this.food.coordinates.y;
    const ateSpecialFood = this.snake[0].x === this.specialFood.coordinates.x && this.snake[0].y === this.specialFood.coordinates.y;
    if (ateFood) {
      this.food.active = false;
      this.game.score += 1;
      this.scoreEl.textContent = this.game.score;

      this.popups.push({
        x: this.food.coordinates.x,
        y: this.food.coordinates.y,
        value: '+1',
        lifetime: 1000,            
        created: Date.now()
      });
    } 
    else if(ateSpecialFood) {
      console.log("eated");
      this.specialFood.timeSpentOnTheField = 0;

      this.specialFood.active = false;
      const { effect, value } = this.specialFood.type;

      let popupText = '';
      switch (effect) {
        case 'addPoints':
          console.log("addPoints");
          popupText = '+2';
          this.game.score += value;
          this.snake.unshift(coordinate);
          break;
        case 'subtractPoints':
          console.log("substractPoints");
          popupText = '-2';
          this.game.score += value;
          this.snake.pop();
          this.snake.pop();
          break;
        case 'speedUp':
          console.log("speedUp");
          this.snake.pop();
          popupText = 'boost!';
          this.specialFood.effectOn = true;

          await this.changeSpeedTemporarily(this.game.speed + value, 3000);
          this.specialFood.effectOn = false;
          break;
        case 'slowDown':
          console.log("slowDown");
          this.snake.pop();
          popupText = 'slow!';
          this.specialFood.effectOn = true;

          await this.changeSpeedTemporarily(this.game.speed + value, 3000);
          this.specialFood.effectOn = false;
          break;
      }
      this.scoreEl.textContent = this.game.score;
      // this.popups.push({
      //   x: this.specialFood.coordinates.x,
      //   y: this.specialFood.coordinates.y,
      //   value: popupText,
      //   color: specialType.background,
      //   lifetime: 1000,
      //   created: Date.now()
      // });
    } else {
      this.snake.pop();
    }
    this.generateFood();
    if (this.specialFood.active && !this.specialFood.effectOn) {
      const { x, y } = this.specialFood.coordinates;
      const { background, border } = this.specialFood.type;
      this.drawSpecialFood(x, y, background, border);
    }
    this.drawSnake();
    this.drawPopups();
  }
/**
 * Generates a special food item at a random position on the field.
 * Ensures the food does not overlap with the snake or the regular food.
 * Each special food has a type that determines its effect.
 */
  generateSpecialFood() {
    if (this.specialFood.active) {
      return;
    }
    const gridSize = this.settings.snake.size;
    const columns = this.canvas.width / gridSize;
    const rows = this.canvas.height / gridSize;

    let x, y, isOnSnake;
    do {
      x = Math.floor(Math.random() * columns) * gridSize;
      y = Math.floor(Math.random() * rows) * gridSize;
      isOnSnake = this.snake.some(segment => segment.x === x && segment.y === y);
    } while (isOnSnake || (x === this.food.coordinates.x && y === this.food.coordinates.y));

    const specialType = this.specialFood.types[Math.floor(Math.random() * this.specialFood.types.length)];
    this.specialFood.type = specialType;
    this.specialFood.coordinates = { x, y };
    this.specialFood.active = true;
    this.specialFood.timeSpentOnTheField = 0;

    this.drawSpecialFood(x, y, specialType.background, specialType.border);
  }

  drawSpecialFood(x, y, fill, border) {
    const size = this.settings.snake.size;
    this.ctx.fillStyle = fill;
    this.ctx.strokeStyle = border;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, size, size, 5);
    this.ctx.fill();
    this.ctx.stroke();
  }
/**
 * Changes the snake's movement speed.
 * Used when a special food item with a speed effect is consumed.
 * 
 * @param {number} changedSpeed - The new speed to apply to the game loop.
 */
  changeSpeed(changedSpeed) {
    clearInterval(this.startGameInterval);
    this.startGameInterval = setInterval(() => {
      if (!this.detectCollision() && this.game.gameTime != 0) {
        this.generateSnake();
      } else {
        this.endGame();
      }
    }, changedSpeed);
  }

  // ⬇️ делаем временную смену скорости
  async changeSpeedTemporarily(newSpeed, duration) {
    const oldSpeed = this.game.speed;

    this.changeSpeed(newSpeed); // смена скорости (очищаем + пересоздаём интервал)

    await new Promise(resolve => setTimeout(resolve, duration)); // ждём duration мс

    this.changeSpeed(oldSpeed); // возвращаем старую скорость
  }

  endGame() {
    if (this.specialFoodInterval) clearInterval(this.specialFoodInterval);
    if (this.specialFood.timeOnTheField) clearTimeout(this.specialFood.timeOnTheField);
    if (this.specialFood.actionInterval) clearTimeout(this.specialFood.actionInterval);
    super.endGame();
  }
}
