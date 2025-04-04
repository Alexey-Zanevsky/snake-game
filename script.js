'use strict'

import { ClassicGame } from './classic__game.js';

globalThis.colors = {
    color_1: "#6420AA",
    color_2: "#FF3EA5",
    color_3: "#FF7ED4",
    color_4: "#FFB5DA",
    color_5: "#8FD14F",
    color_6: "#F5F5F5"
};

const gameMode = "classic";
let gameSpeed = 100;
const baseSnakeSkin = {
    type: 'color',
    background: colors.color_3,
    border: colors.color_2
};

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
                startGame(gameSpeed, baseSnakeSkin, gameMode);
            }}, "+=0.2")
        .to(".score-in-square", { 
            opacity: 1, 
            y: 0, 
            duration: 0.2, 
            ease: "power2.out"}, "+=0.2");
});

function startGame(gameSpeed, snakeSkin, gameMode) {
    console.log(`gameSpeed = ${gameSpeed}\nsnakeSkin = ${snakeSkin}\ngameMode = ${gameMode}`, snakeSkin);
    if(gameMode === "classic") new ClassicGame(snakeSkin, gameSpeed);
    // if(gameMode === "hardcore") hardcoreGame(snakeSkin);
    // if(gameMode === "special") specialGame(gameSpeed, snakeSkin);
    // if(gameMode === "pwp") pwpGame(gameSpeed, snakeSkin);
}

export function goToMenu() {
    const tl = gsap.timeline();
  
    // Скрыть элементы игры
    tl.to(".score-in-square", {
      opacity: 0,
      y: 30,
      duration: 0.2,
      ease: "power2.in"
    })
      .to(".time-in-square", {
        opacity: 0,
        y: 30,
        duration: 0.2,
        ease: "power2.in"
      }, "-=0.1")
      .to(".snake-field", {
        opacity: 0,
        y: 30,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          // Скрываем саму игровую область
          document.querySelector(".snake-field").style.display = "none";
          document.querySelector(".score-in-square").style.display = "none";
          document.querySelector(".time-in-square").style.display = "none";
  
          // Готовим элементы меню к появлению
          document.querySelector(".menu-container").style.display = "flex";
          document.querySelector(".flex-container").style.height = "70%";
          document.querySelector(".flex-container").style.width = "85%";
          document.querySelector(".snake-title").style.display = "block";
          document.querySelector(".rating").style.display = "flex";
          gsap.set(".menu", { display: "flex" });
        }
      })
      .to(".snake-field__container", {
        opacity: 0,
        scale: 0.6,
        duration: 0.2,
        ease: "power2.in",
        onComplete: function() {
            gsap.set(".snake-field__container", { display: "none" });
        }
      })
      // Показать меню
      .to(".menu-container", {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      })
      .to(".menu", {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "power1.out"
      })
      .to(".rating", {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "power1.out"
      })
      .to(".snake-title", {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "power1.out"
      });
}


