"use strict";
const mainImage = document.getElementById("carousel-image");
if (!mainImage)
    throw new Error("Elementul #carousel-image nu a fost găsit în pagină.");
const mediaUrl = mainImage.dataset.mediaUrl ?? "../MEDIA/";
const images = ["g1.jpg", "g2.jpg", "g3.jpg", "g4.jpg"].map((name) => mediaUrl + name);
let currentIndex = 0;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fadeDuration = reduceMotion ? 0 : 400;
function fade(from, to) {
    return mainImage.animate([{ opacity: from }, { opacity: to }], {
        duration: fadeDuration,
        easing: "ease-in-out",
        fill: "forwards",
    }).finished;
}
let isAnimating = false;
async function showNextImage() {
    if (isAnimating)
        return;
    isAnimating = true;
    await fade(1, 0);
    currentIndex = (currentIndex + 1) % images.length;
    mainImage.src = images[currentIndex];
    mainImage.alt = `Imaginea ${currentIndex + 1} din ${images.length}`;
    try {
        await mainImage.decode();
    }
    catch {
        console.warn(`Imaginea ${images[currentIndex]} nu s-a putut încărca.`);
    }
    await fade(0, 1);
    isAnimating = false;
}
setInterval(showNextImage, 3000);
