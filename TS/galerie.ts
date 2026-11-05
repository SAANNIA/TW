const images: string[] = [
  "../MEDIA/g1.jpg",
  "../MEDIA/g2.jpg",
  "../MEDIA/g3.jpg",
  "../MEDIA/g4.jpg",
];

const mainImage = document.getElementById("carousel-image") as HTMLImageElement;

if (!mainImage) throw new Error("Elementul #carousel-image nu a fost găsit în pagină.");

let currentIndex = 0;

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  mainImage.src = images[currentIndex]!;
  mainImage.alt = `Imaginea ${currentIndex + 1} din ${images.length}`;
}

setInterval(showNextImage, 3000);
