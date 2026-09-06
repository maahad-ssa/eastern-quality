/* =========================================
   SETTINGS
========================================= */

// Time between automatic slides
const SLIDE_INTERVAL = 5000;

// Fade transition time
const TRANSITION_TIME = 800;


/* =========================================
   ELEMENTS
========================================= */

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

const slideCounter = document.getElementById("slideCounter");

const fullscreenButton =
    document.getElementById("fullscreenButton");

const slideshow =
    document.getElementById("slideshow");


/* =========================================
   VARIABLES
========================================= */

let currentSlide = 0;

let autoSlideTimer;

let isFullscreen = false;


/* =========================================
   SHOW SLIDE
========================================= */

function showSlide(index) {

    // Make sure the index stays within the slide range
    if (index >= slides.length) {
        index = 0;
    }

    if (index < 0) {
        index = slides.length - 1;
    }

    currentSlide = index;


    /* Remove active class from all slides */

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });


    /* Add active class to current slide */

    slides[currentSlide].classList.add("active");


    /* Update dots */

    dots.forEach((dot, dotIndex) => {

        dot.classList.toggle(
            "active",
            dotIndex === currentSlide
        );

    });


    /* Update counter */

    slideCounter.textContent =
        `${currentSlide + 1} / ${slides.length}`;
}


/* =========================================
   NEXT SLIDE
========================================= */

function nextSlide() {

    showSlide(currentSlide + 1);

    restartAutoSlide();
}


/* =========================================
   PREVIOUS SLIDE
========================================= */

function previousSlide() {

    showSlide(currentSlide - 1);

    restartAutoSlide();
}


/* =========================================
   AUTOMATIC SLIDESHOW
========================================= */

function startAutoSlide() {

    autoSlideTimer = setInterval(() => {

        showSlide(currentSlide + 1);

    }, SLIDE_INTERVAL);
}


/* =========================================
   RESTART AUTO SLIDE
========================================= */

function restartAutoSlide() {

    clearInterval(autoSlideTimer);

    startAutoSlide();
}


/* =========================================
   BUTTON EVENTS
========================================= */

nextButton.addEventListener(
    "click",
    nextSlide
);

prevButton.addEventListener(
    "click",
    previousSlide
);


/* =========================================
   DOT EVENTS
========================================= */

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

        restartAutoSlide();

    });

});


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener("keydown", (event) => {

    switch (event.key) {

        case "ArrowRight":
        case "ArrowDown":
        case " ":

            event.preventDefault();

            nextSlide();

            break;


        case "ArrowLeft":
        case "ArrowUp":

            event.preventDefault();

            previousSlide();

            break;


        case "Home":

            event.preventDefault();

            showSlide(0);

            restartAutoSlide();

            break;


        case "End":

            event.preventDefault();

            showSlide(slides.length - 1);

            restartAutoSlide();

            break;


        case "f":
        case "F":

            toggleFullscreen();

            break;

    }

});


/* =========================================
   FULLSCREEN
========================================= */

function toggleFullscreen() {

    if (!document.fullscreenElement) {

        if (slideshow.requestFullscreen) {

            slideshow.requestFullscreen();

        }

        isFullscreen = true;

    } else {

        if (document.exitFullscreen) {

            document.exitFullscreen();

        }

        isFullscreen = false;

    }

}


/* =========================================
   FULLSCREEN BUTTON
========================================= */

fullscreenButton.addEventListener(
    "click",
    toggleFullscreen
);


/* =========================================
   UPDATE FULLSCREEN ICON
========================================= */

document.addEventListener(
    "fullscreenchange",
    () => {

        if (document.fullscreenElement) {

            fullscreenButton.textContent = "⛶";

            fullscreenButton.title =
                "Exit Fullscreen";

        } else {

            fullscreenButton.textContent = "⛶";

            fullscreenButton.title =
                "Fullscreen";

        }

    }
);


/* =========================================
   PRELOAD IMAGES
========================================= */

slides.forEach((slide) => {

    const image = new Image();

    image.src = slide.src;

});


/* =========================================
   START
========================================= */

showSlide(0);

startAutoSlide();