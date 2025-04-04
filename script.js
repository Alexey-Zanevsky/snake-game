'use strict'
const color_1 = "#6420AA";
const color_2 = "#FF3EA5";
const color_3 = "#FF7ED4";
const color_4 = "#FFB5DA";
const color_5 = "#8FD14F";
const color_6 = "#F5F5F5";


let gameSpeed = 100;

document.querySelectorAll('.level-section .button-style').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.level-section .button-style').forEach(btn => btn.classList.remove('active'));      
        button.classList.add('active');
        const level = button.textContent.toLowerCase();
        if (level === 'beginner') gameSpeed = 100;
        if (level === 'advanced') gameSpeed = 75;
        if (level === 'expert') gameSpeed = 50;
    });
});


document.querySelector(".start-button").addEventListener("click", function () {
    gsap.timeline()
        .to(".snake-title", { 
            opacity: 0, 
            scale: 0.8, 
            duration: .2, 
            ease: "power1.out", 
            onComplete: function() {
                document.querySelector(".snake-title").style.display = "none";
            }})
        .to(".rating", {  
            opacity: 0, 
            scale: 0.8, 
            duration: 0.2, 
            ease: "power1.out",
            onComplete: function() {
                document.querySelector(".rating").style.display = "none";
            }}) 
        .to(".menu", {  
            opacity: 0, 
            scale: 0.8, 
            duration: 0.1, 
            ease: "power1.out", 
            onComplete: function() {
                gsap.to(".menu-container", { 
                    opacity: 0, 
                    scale: 0.6, 
                    duration: 0.2, 
                    ease: "power1.out", 
                    onComplete: function() {
                        document.querySelector(".menu-container").style.display = "none";
                        document.querySelector(".flex-container").style.height = "100%";
                        document.querySelector(".flex-container").style.width = "100%";
                        gsap.set(".snake-field__container", { display: "flex" });
                    }});
        }})
        .to(".snake-field__container", { 
            opacity: 1, 
            scale: 1, 
            duration: 0.2, 
            ease: "power2.out" })
        .add(() => {
            document.querySelector(".snake-field").style.display = "flex";
            document.querySelector(".score-in-square").style.display = "flex";
            document.querySelector(".time-in-square").style.display = "flex";
        })
        .to(".snake-field", { 
            opacity: 1, 
            y: 0, 
            duration: 0.2, 
            ease: "power2.out" }, "+=0.2")
        .to(".time-in-square", { 
            opacity: 1, 
            y: 0, 
            duration: 0.2, 
            ease: "power2.out",
            onComplete: function() {
                Game(gameSpeed);
                // startGame(gameSpeed, gameMode, snakeSkin);
            }}, "+=0.2")
        .to(".score-in-square", { 
            opacity: 1, 
            y: 0, 
            duration: 0.2, 
            ease: "power2.out"}, "+=0.2");
        
});

function startGame(gameSpeed, gameMode, snakeSkin) {
    if(gameMode === "classic") new classicGame(gameSpeed, snakeSkin);
    // if(gameMode === "hardcore") hardcoreGame(snakeSkin);
    // if(gameMode === "special") specialGame(gameSpeed, snakeSkin);
    // if(gameMode === "pwp") pwpGame(gameSpeed, snakeSkin);
}

