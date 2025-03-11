'use strict'

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

document.querySelector(".start-button").addEventListener("click", async function () {
    gsap.to(".snake-title", {
        opacity: 0,
        scale: .8,
        duration: .5,
        ease: "power1.out",
        onComplete: function() {
            document.querySelector(".snake-title").style.display = "none"
        }
    })
    // await sleep(500); 
    gsap.to(".rating", {
        opacity: 0,
        scale: .8,
        duration: .5,
        ease: "power1.out",
        onComplete: function() {
            document.querySelector(".rating").style.display = "none";
        }
    })
    // await sleep(500); 
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
});
