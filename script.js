'use strict'

const loadTimerEl = document.querySelector(".load-timer");

let canvas;
let t1 = gsap.timeline();

document.querySelector(".start-button").addEventListener("click",function () {
    gsap.to(".menu", {
        opacity: 0,
        scale: .8,
        duration: .3,
        ease: "power1.out",
        onComplete: function() {
            document.querySelector(".menu").style.display = "none";
        }
    })
    gsap.to(".snake-title", {
        delay: .2,
        opacity: 0,
        scale: .8,
        duration: .3,
        ease: "power1.out"
    })
    gsap.to(".rating", {
        delay: .4,
        opacity: 0,
        scale: .8,
        duration: .3,
        ease: "power1.out",
        onComplete: function() {
            document.querySelector(".rating").style.display = "none";
            loadTimer(loadTimerEl, canvas);
            gsap.to(".snake-field", {
                flexGrow: 5,
                duration: .8,
                ease: "power1.in",
                onComplete: function() {
                    document.querySelector(".snake-title").style.display = "none";
                    gsap.to(".flex-container", {
                        height: "90%",
                        duration: .8,
                        ease: "back.inOut(3)",
                    })
                }       
            });
            

        }   
    })
    
});

function loadTimer(loadTimerEl, canvas) {
    let timeLeft = 6;
    loadTimerEl.style.display = "flex"; 
    
    const countDown = setInterval(() => {
        timeLeft--; 
        console.log(timeLeft);
        if (timeLeft == 2) 
            loadTimerEl.innerHTML = "START!";
        if(timeLeft == 5 || timeLeft == 4 || timeLeft == 3)
            loadTimerEl.innerHTML = timeLeft - 2;
        if (timeLeft == 1) { 
            loadTimerEl.style.display = "none";
            clearInterval(countDown);
            createCanvasElement(canvas);
        }
        // if(timeLeft == 0) {
        // }
    }, 1000); 
}

function createCanvasElement(canvas) {
    const parent = document.querySelector(".snake-field");

    canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.height = "100%";
    canvas.style.width = "100%";
    
    parent.appendChild(canvas);

    drawSnake(canvas);
    // Устанавливаем размеры canvas (чтобы совпадал с родителем)
    // function updateCanvasSize() {
    //     canvas.width = parent.clientWidth;
    //     canvas.height = parent.clientHeight;
    //     drawSquare(canvas); // Перерисовываем квадрат при изменении размеров
    // }

    // updateCanvasSize(); // Первоначальная настройка размеров

    // // Если размеры блока меняются (например, анимация GSAP), обновляем canvas
    // parent.addEventListener("resize", updateCanvasSize);
}

function drawSnake(canvas) {
    const ctx = canvas.getContext("2d");

    const squareSize = canvas.width / 30;

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, squareSize, squareSize);
    ctx.fillRect(squareSize, 0, squareSize, squareSize);
}

function drawSquare(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "red"; 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2 - 25, 50, 50); 
}
