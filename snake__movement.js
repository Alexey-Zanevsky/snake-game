'use strict';

function Game(gameSpeed) {
    const timeText = document.querySelector(".time-text");
    const timeEl = document.querySelector(".time");
    const scoreEl = document.querySelector(".score");
    const gameOverModal = document.getElementById("gameOverModal");
    const finalTime = document.getElementById("finalTime");
    const finalScore = document.getElementById("finalScore");

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const gridSize = 30;
    const rows = canvas.height / gridSize; // 20
    const cols = canvas.width / gridSize;  // 30
    let snake = [
        { x: 3 * gridSize, y: 0 },
        { x: 2 * gridSize, y: 0 },
        { x: gridSize, y: 0 }
    ];
    let direction = { x: gridSize, y: 0 };
    let food = generateFood();
    let gameOver = false;
    let score = 0;
    let gameTime = 0;
    let gameTimer;

    const foodImage = new Image();
    foodImage.src = "imgs/apple.png";

    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        if (key === "arrowup" || key === "w") {
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
        }
        if (key === "arrowdown" || key === "s") {
            if (direction.y === 0) direction = { x: 0, y: gridSize };
        }
        if (key === "arrowleft" || key === "a") {
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
        }
        if (key === "arrowright" || key === "d") {
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
        }
    });
    
    
    function startCountdown() {
        let count = 1;
        const countdownInterval = setInterval(() => {
            if(count == 1) {
                timeEl.textContent = "START!";
            } 
            if(count == 0) {
                clearInterval(countdownInterval);
                timeEl.textContent = "00:00";
                timeText.textContent = "time";
                startGameTimer();
                gameLoop();
            }
            count--;
        }, 800);
    }

    function startGameTimer() {
        gameTimer = setInterval(() => {
            gameTime++;
            let minutes = String(Math.floor(gameTime / 60)).padStart(2, '0');
            let seconds = String(gameTime % 60).padStart(2, '0');
            timeEl.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    function gameLoop() {
        if (gameOver) {
            clearInterval(gameTimer);
            showGameOverModal();
            return;
        }

        updateSnakePosition();
        checkCollisions();
        draw();
        setTimeout(gameLoop, gameSpeed);
    }

    function updateSnakePosition() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            food = generateFood();
            score++;
            scoreEl.textContent = score;
        } else {
            snake.pop();
        }
    }

    function checkCollisions() {
        const head = snake[0];
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameOver = true;
        }
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver = true;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color_3;
        ctx.strokeStyle = color_2;
        ctx.lineWidth = 1;

        snake.forEach(segment => {
            ctx.beginPath();
            ctx.roundRect(segment.x, segment.y, gridSize, gridSize, 5);
            ctx.fill();
            ctx.stroke();
            // ctx.drawImage(foodImage, segment.x, segment.y, gridSize, gridSize);
        });
        // ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);
        // color_ 4 i color_2
        ctx.fillStyle = color_5; 
        ctx.strokeStyle = color_6;
        ctx.beginPath();
        ctx.roundRect(food.x, food.y, gridSize, gridSize, 5);
        ctx.fill();
        ctx.stroke();
    }

    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * cols) * gridSize,
                y: Math.floor(Math.random() * rows) * gridSize
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }

    function showGameOverModal() {
        finalTime.textContent = timeEl.textContent;
        finalScore.textContent = score;
        gameOverModal.style.display = "block";
        gameOverModal.querySelectorAll("button")[0].addEventListener("click", restartGame);
        gameOverModal.querySelectorAll("button")[1].addEventListener("click", goToMenu);
    }

    function restartGame() {
        // Сброс значений переменных
        score = 0;
        scoreEl.textContent = score;
        gameTime = 0;
        let minutes = String(Math.floor(gameTime / 60)).padStart(2, '0');
        let seconds = String(gameTime % 60).padStart(2, '0');
        timeEl.textContent = `${minutes}:${seconds}`;
        direction = { x: gridSize, y: 0 };  // Начальное направление змейки (вправо)
        snake = [{ x: 2 * gridSize, y: 0 }, { x: gridSize, y: 0 }, { x: 0, y: 0 }]; // Начальная длина змейки (3 сегмента)
        food = generateFood();  // Сгенерировать еду в новом месте
        gameOver = false;  // Сброс состояния игры (игра не окончена)
        
        gameOverModal.style.display = "none";
        
        startGameTimer();
        gameLoop();  // Начать новый игровой цикл
    }
    

    function goToMenu() {
        alert("Returning to menu...");
    }

    startCountdown();
}


