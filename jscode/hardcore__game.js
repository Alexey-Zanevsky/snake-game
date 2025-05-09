'use strict';

import { BaseGame } from './base__game.js';

export class HardcoreGame extends BaseGame {
    constructor(snakeSkin, gameMode) {
        super(snakeSkin, 50, gameMode);
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
      }

    startGameTimer() {
        this.game.gameTime = 300; // 5 minutes
        this.timeEl.textContent = '05:00';
        this.game.gameTimer = setInterval(() => {
        if (this.game.gameTime <= 0) {
            clearInterval(this.game.gameTimer);
            this.timeEl.textContent = '00:00';
            return;
        }
        this.game.gameTime--;
        let minutes = String(Math.floor(this.game.gameTime / 60)).padStart(2, '0');
        let seconds = String(this.game.gameTime % 60).padStart(2, '0');
        this.timeEl.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    endGame() {
        clearInterval(this.game.gameTimer);
        clearInterval(this.startGameInterval);
        document.removeEventListener('keydown', this.handleKeyDown);
        
        const [minutes, seconds] = this.timeEl.textContent.split(':').map(Number);
        const timeLeftInSeconds = minutes * 60 + seconds;
        const totalStartTime = 300;
        const elapsedTime = totalStartTime - timeLeftInSeconds;
        const elapsedMinutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
        const elapsedSeconds = String(elapsedTime % 60).padStart(2, '0');
        
        this.finalTime.textContent = `${elapsedMinutes}:${elapsedSeconds}`;
        this.finalScore.textContent = this.scoreEl.textContent;
        this.gameOverModal.style.display = "block";
      }

}