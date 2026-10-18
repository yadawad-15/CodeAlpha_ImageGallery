
const buttons = document.querySelectorAll(".filter-btn");
const sections = document.querySelectorAll(".collection");

const lightbox = document.getElementById("lightbox");
const largePhoto = document.getElementById("largePhoto");
const photoCaption = document.getElementById("photoCaption");

const closeButton = document.getElementById("closeButton");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");

let photos = [];
let photoIndex = 0;

// Filter the gallery when a button is clicked.
buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        const category = button.dataset.filter;

        buttons.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        sections.forEach(function(section) {
            if (category === "all" ||
                section.dataset.category === category) {
                section.style.display = "";
            } else {
                section.style.display = "none";
            }
        });

        updatePhotoCount();
    });
});

// Count the photos currently visible.
function updatePhotoCount() {
    let count = 0;

    sections.forEach(function(section) {
        if (section.style.display !== "none") {
            count += section.querySelectorAll(".photo-card").length;
        }
    });

    document.getElementById("photoCount").textContent =
        "Showing " + count + " photos";
}

// Get the photos from the visible sections.
function getVisiblePhotos() {
    photos = [];

    sections.forEach(function(section) {
        if (section.style.display !== "none") {
            photos.push(...section.querySelectorAll(".photo-card img"));
        }
    });
}

// Open a large photo when clicked.
document.querySelectorAll(".photo-card img").forEach(function(photo) {
    photo.addEventListener("click", function() {
        getVisiblePhotos();

        photoIndex = photos.indexOf(photo);
        showPhoto();

        lightbox.classList.add("show");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeButton.focus();
    });
});

// Display the selected photo.
function showPhoto() {
    if (photos.length === 0) return;

    const photo = photos[photoIndex];

    largePhoto.src = photo.src;
    largePhoto.alt = photo.alt;
    photoCaption.textContent =
        photo.closest(".photo-card").querySelector("h3").textContent;
}

// Move to another photo.
function changePhoto(step) {
    if (photos.length === 0) return;

    photoIndex = (photoIndex + step + photos.length) % photos.length;
    showPhoto();
}

nextButton.addEventListener("click", function() {
    changePhoto(1);
});

previousButton.addEventListener("click", function() {
    changePhoto(-1);
});

// Close the large photo.
function closePhoto() {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    largePhoto.src = "";
    document.body.style.overflow = "";
}

closeButton.addEventListener("click", closePhoto);

// Close when clicking outside the photo.
lightbox.addEventListener("click", function(event) {
    if (event.target === lightbox) {
        closePhoto();
    }
});

// Keyboard controls.
document.addEventListener("keydown", function(event) {
    if (!lightbox.classList.contains("show")) return;

    if (event.key === "Escape") {
        closePhoto();
    } else if (event.key === "ArrowRight") {
        changePhoto(1);
    } else if (event.key === "ArrowLeft") {
        changePhoto(-1);
    }
});

updatePhotoCount();
