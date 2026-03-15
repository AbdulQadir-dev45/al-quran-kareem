// ===============================
// MUSHAF VIEWER SCRIPT
// ===============================
const totalPages = 604;
let currentPage = 1;

const container = document.getElementById('mushaf-container');
const pageNumberDisplay = document.getElementById('page-number');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const jumpInput = document.getElementById('jump-to-page');
const bookmarkBtn = document.getElementById('bookmark-btn');
const showBookmarksBtn = document.getElementById('show-bookmarks-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const body = document.body;
const modeToggle = document.getElementById('modeToggle');

// ===============================
// SHOW PAGE
// ===============================
function showPage(page) {
    const folder = "images/mushaf/";
    const fileName = `06 Al-madina Quran - Beautiful Fonts [www.Momeen.blogspot.com]_page-${String(page).padStart(4, '0')}.jpg`;
    const imgSrc = folder + encodeURI(fileName);
    container.innerHTML = `<img src="${imgSrc}" alt="Page ${page}" loading="lazy">`;
    pageNumberDisplay.textContent = page;
    updateImageMode();
    preloadPage(page - 1);
    preloadPage(page + 1);
}

// ===============================
// UPDATE IMAGE DARK MODE
// ===============================
function updateImageMode() {
    container.querySelectorAll('img').forEach(img => {
        img.style.filter = body.classList.contains('dark-mode') ? 'brightness(0.8)' : 'brightness(1)';
    });
}

// ===============================
// BUTTON EVENTS
// ===============================
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; showPage(currentPage); }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage++; showPage(currentPage); }
});

jumpInput.addEventListener('change', () => {
    const page = parseInt(jumpInput.value);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        showPage(currentPage);
    } else alert(`Enter a number 1-${totalPages}`);
});

bookmarkBtn.addEventListener('click', () => addBookmark(currentPage));
showBookmarksBtn.addEventListener('click', showBookmarks);
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Dark mode toggle
modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    updateImageMode();
    modeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// ===============================
// KEYBOARD EVENTS
// ===============================
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "ArrowLeft": if (currentPage > 1) { currentPage--; showPage(currentPage); } break;
        case "ArrowRight": if (currentPage < totalPages) { currentPage++; showPage(currentPage); } break;
        case "Home": currentPage = 1; showPage(currentPage); break;
        case "End": currentPage = totalPages; showPage(currentPage); break;
        case "b": case "B": addBookmark(currentPage); break;
        case "f": case "F": toggleFullscreen(); break;
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
// FULLSCREEN FUNCTION
// ===============================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) container.requestFullscreen();
        else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
}

// ===============================
// LAZY LOADING / PRELOAD
// ===============================
function preloadPage(page) {
    if (page < 1 || page > totalPages) return;
    const folder = "mushaf/";
    const fileName = `06 Al-madina Quran - Beautiful Fonts [www.Momeen.blogspot.com]_page-${String(page).padStart(4, '0')}.jpg`;
    const img = new Image();
    img.src = folder + encodeURI(fileName);
}

// ===============================
// SWIPE SUPPORT
// ===============================
let startX;
container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
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