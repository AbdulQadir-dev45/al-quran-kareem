// ===============================
// GLOBAL VARIABLES
// ===============================

const totalPages = 604;
let currentPage = parseInt(localStorage.getItem("lastPage")) || 1;

const container = document.getElementById('mushaf-container');
const pageNumberDisplay = document.getElementById('page-number');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const jumpInput = document.getElementById('jump-to-page');

const bookmarkBtn = document.getElementById('bookmark-btn');
const showBookmarksBtn = document.getElementById('show-bookmarks-btn');

const fullscreenBtn = document.getElementById('fullscreen-btn');

// ===============================
// SHOW PAGE
// ===============================

function showPage(page) {

    container.innerHTML = `<div class="loading">Loading Page...</div>`;

    const folder = "images/mushaf/";

    const fileName =
        `06 Al-madina Quran - Beautiful Fonts [www.Momeen.blogspot.com]_page-${String(page).padStart(4, '0')}.jpg`;

    const imgSrc = folder + encodeURI(fileName);

    const img = new Image();

    img.src = imgSrc;

    img.alt = `Quran Page ${page}`;

    img.onload = () => {

        container.innerHTML = '';

        container.appendChild(img);

        pageNumberDisplay.textContent = `${page} / ${totalPages}`;

        localStorage.setItem("lastPage", page);

        updateButtons();

        preloadPage(page + 1);
        preloadPage(page - 1);
    };

    img.onerror = () => {
        container.innerHTML = `<div class="loading">Failed to load page.</div>`;
    };
}

// ===============================
// BUTTON STATES
// ===============================

function updateButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// ===============================
// NAVIGATION
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

// ===============================
// JUMP TO PAGE
// ===============================

jumpInput.addEventListener('keypress', (e) => {

    if (e.key === "Enter") {

        const page = parseInt(jumpInput.value);

        if (page >= 1 && page <= totalPages) {

            currentPage = page;

            showPage(currentPage);

            jumpInput.value = '';

        } else {
            alert(`Enter page between 1 - ${totalPages}`);
        }
    }
});

// ===============================
// BOOKMARKS
// ===============================

function addBookmark(page) {

    let bookmarks =
        JSON.parse(localStorage.getItem('bookmarks')) || [];

    if (!bookmarks.includes(page)) {

        bookmarks.push(page);

        bookmarks.sort((a, b) => a - b);

        localStorage.setItem(
            'bookmarks',
            JSON.stringify(bookmarks)
        );

        alert(`Page ${page} bookmarked`);
    } else {
        alert("Already bookmarked");
    }
}

function showBookmarks() {

    let bookmarks =
        JSON.parse(localStorage.getItem('bookmarks')) || [];

    if (bookmarks.length === 0) {
        alert("No bookmarks found");
        return;
    }

    const selected = prompt(
        `Bookmarks:\n${bookmarks.join(", ")}\n\nEnter page number to open:`
    );

    if (selected) {

        const page = parseInt(selected);

        if (bookmarks.includes(page)) {
            currentPage = page;
            showPage(page);
        }
    }
}

bookmarkBtn.addEventListener('click', () => addBookmark(currentPage));

showBookmarksBtn.addEventListener('click', showBookmarks);

// ===============================
// FULLSCREEN
// ===============================

function toggleFullscreen() {

    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);

// ===============================
// KEYBOARD SUPPORT
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
    }
});

// ===============================
// PRELOAD
// ===============================

function preloadPage(page) {

    if (page < 1 || page > totalPages) return;

    const folder = "images/mushaf/";

    const fileName =
        `06 Al-madina Quran - Beautiful Fonts [www.Momeen.blogspot.com]_page-${String(page).padStart(4, '0')}.jpg`;

    const img = new Image();

    img.src = folder + encodeURI(fileName);
}

// ===============================
// TOUCH SWIPE
// ===============================

let startX = 0;

container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

container.addEventListener('touchend', (e) => {

    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50 && currentPage < totalPages) {

        currentPage++;

        showPage(currentPage);
    }

    if (endX - startX > 50 && currentPage > 1) {

        currentPage--;

        showPage(currentPage);
    }
});

// ===============================
// INITIAL LOAD
// ===============================

showPage(currentPage);