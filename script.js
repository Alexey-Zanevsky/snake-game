'use strict'

const loadTimerEl = document.querySelector(".load-timer");

document.querySelector(".start-button").addEventListener("click",function () {
    gsap.to(".snake-title", {
        opacity: 0,
        scale: .8,
        duration: .5,
        ease: "power1.out",
        onComplete: function() {
            document.querySelector(".snake-title").style.display = "none"
        }
    })
    gsap.to(".rating", {
        opacity: 0,
        scale: .8,
        duration: .5,
        ease: "power1.out",
        onComplete: function() {
            document.querySelector(".rating").style.display = "none";
        }
    })
    gsap.to(".flex-container", {
        width: "100%", 
        height: "100%", 
        duration: .8,
        ease: "power2.out",
        onComplete: function() {
            document.querySelector(".flex-container").style.justifyContent = "center";
            document.querySelector(".flex-container").style.alignItems = "center";
            document.querySelector(".snake-field").style.height = "90%";
        }
    })
    gsap.to(".menu", {
        opacity: 0,
        scale: .8,
        duration: .8,
        ease: "power3.out",
        onComplete: function() {
            document.querySelector(".menu").style.display = "none";
        }
    })
    loadTimerEl.style.display = "flex";
    loadTimer(loadTimerEl);
});

function loadTimer() {
    let timeLeft = 4;
    loadTimerEl.style.display = "flex"; 
    
    const countDown = setInterval(() => {
        timeLeft--; 
        if (timeLeft === 0) 
            loadTimerEl.innerHTML = "START!";
         else 
            loadTimerEl.innerHTML = timeLeft;

        if (timeLeft < 0) { 
            clearInterval(countDown);
            loadTimerEl.style.display = "none";
        }
    }, 1000);
}