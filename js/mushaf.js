// ===============================
// GLOBAL VARIABLES
// ===============================
const totalPages = 604;
let currentPage = 1;
let zoomLevel = 1;

const MIN_ZOOM = 1;   // 👈 zoom out limit
const MAX_ZOOM = 3;     // 👈 zoom in limit

const container = document.getElementById('mushaf-container');
const pageNumberDisplay = document.getElementById('page-number');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const jumpInput = document.getElementById('jump-to-page');
const bookmarkBtn = document.getElementById('bookmark-btn');
const showBookmarksBtn = document.getElementById('show-bookmarks-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const body = document.body;

// ZOOM BUTTONS
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const zoomResetBtn = document.getElementById("zoom-reset");

// ===============================
// SHOW PAGE FUNCTION
// ===============================
function showPage(page) {
    const folder = "images/mushaf/";
    const fileName = `06 Al-madina Quran - Beautiful Fonts [www.Momeen.blogspot.com]_page-${String(page).padStart(4, '0')}.jpg`;
    const imgSrc = folder + encodeURI(fileName);

    container.innerHTML = `<img src="${imgSrc}" alt="Page ${page}" loading="lazy">`;
    pageNumberDisplay.textContent = page;

    updateImageMode();
    applyZoom();

    preloadPage(page - 1);
    preloadPage(page + 1);
}

// ===============================
// ZOOM FUNCTION
// ===============================
function applyZoom() {
    const img = container.querySelector('img');
    if (img) {
        img.style.transform = `scale(${zoomLevel})`;
        img.style.transformOrigin = "center center";
    }
}

// ===============================
// BUTTON EVENTS
// ===============================
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
    }
});

jumpInput.addEventListener('change', () => {
    const page = parseInt(jumpInput.value);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        showPage(currentPage);
    } else {
        alert(`Enter a number between 1 and ${totalPages}`);
    }
});

bookmarkBtn.addEventListener('click', () => addBookmark(currentPage));
showBookmarksBtn.addEventListener('click', showBookmarks);
fullscreenBtn.addEventListener('click', toggleFullscreen);

// ===============================
// ZOOM BUTTON EVENTS
// ===============================
zoomInBtn.addEventListener("click", () => {
    if (zoomLevel < MAX_ZOOM) {
        zoomLevel += 0.2;
        applyZoom();
    }
});

zoomOutBtn.addEventListener("click", () => {
    if (zoomLevel > MIN_ZOOM) {
        zoomLevel -= 0.2;
        if (zoomLevel < MIN_ZOOM) zoomLevel = MIN_ZOOM;
        applyZoom();
    }
});

zoomResetBtn.addEventListener("click", () => {
    zoomLevel = 1;
    applyZoom();
});

// ===============================
// MOUSE WHEEL ZOOM
// ===============================
container.addEventListener("wheel", (e) => {
    e.preventDefault();

    if (e.deltaY < 0) {
        zoomLevel += 0.1;
        if (zoomLevel > MAX_ZOOM) zoomLevel = MAX_ZOOM;
    } else {
        zoomLevel -= 0.1;
        if (zoomLevel < MIN_ZOOM) zoomLevel = MIN_ZOOM;
    }

    applyZoom();
});

// ===============================
// KEYBOARD NAVIGATION
// ===============================
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "ArrowLeft":
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
            }
            break;

        case "ArrowRight":
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
            }
            break;

        case "Home":
            currentPage = 1;
            showPage(currentPage);
            break;

        case "End":
            currentPage = totalPages;
            showPage(currentPage);
            break;

        case "b":
        case "B":
            addBookmark(currentPage);
            break;

        case "f":
        case "F":
            toggleFullscreen();
            break;
    }
});

// ===============================
// BOOKMARK FUNCTIONS
// ===============================
function addBookmark(page) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    if (!bookmarks.includes(page)) bookmarks.push(page);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    alert(`Page ${page} bookmarked!`);
}

function showBookmarks() {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    alert(bookmarks.length ? 'Bookmarked Pages: ' + bookmarks.join(', ') : 'No bookmarks found.');
}

// ===============================
// FULLSCREEN
// ===============================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        container.requestFullscreen?.() || container.webkitRequestFullscreen?.();
    } else {
        document.exitFullscreen?.();
    }
}

// ===============================
// PRELOAD
// ===============================
function preloadPage(page) {
    if (page < 1 || page > totalPages) return;
    const folder = "images/mushaf/";
    const fileName = `06 Al-madina Quran - Beautiful Fonts [www.Momeen.blogspot.com]_page-${String(page).padStart(4, '0')}.jpg`;
    const img = new Image();
    img.src = folder + encodeURI(fileName);
}

// ===============================
// SWIPE SUPPORT
// ===============================
let startX;

container.addEventListener('touchstart', e => startX = e.touches[0].clientX);

container.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 50 && currentPage < totalPages) currentPage++;
    if (endX - startX > 50 && currentPage > 1) currentPage--;

    showPage(currentPage);
});

// ===============================
// INITIAL LOAD
// ===============================
showPage(currentPage);