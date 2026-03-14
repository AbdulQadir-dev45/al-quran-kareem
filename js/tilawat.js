// =============================
// ELEMENTS
// =============================
const surahList = document.getElementById("surahList");
const audio = document.getElementById("audioPlayer");
const qariSelect = document.getElementById("qariSelect");
const currentSurah = document.getElementById("currentSurah");
const searchInput = document.getElementById("searchSurah");

// =============================
// GLOBAL VARIABLES
// =============================
let surahs = [];
let currentPlaying = null;

// =============================
// LOAD SURAH LIST FROM API
// =============================
async function loadSurahs() {
    try {
        surahList.innerHTML = "<p>Loading Surahs...</p>";
        let res = await fetch("https://api.alquran.cloud/v1/surah");
        if (!res.ok) throw new Error("API response not OK");

        let data = await res.json();
        if (!data.data) throw new Error("Invalid API Data");

        surahs = data.data;
        displaySurahs(surahs);
    } catch (error) {
        console.error(error);
        surahList.innerHTML = `
            <p style="color:red">
            ❌ Surah list load nahi ho saki.<br>
            Check internet connection.
            </p>
        `;
    }
}

// =============================
// DISPLAY SURAH CARDS
// =============================
function displaySurahs(list) {
    surahList.innerHTML = "";

    list.forEach(surah => {
        let card = document.createElement("div");
        card.className = "surah-card";

        card.innerHTML = `
            <div class="surah-info">
                <h3>${surah.englishName}</h3>
                <p>${surah.englishNameTranslation}</p>
            </div>
            <button class="playBtn" data-id="${surah.number}">▶</button>
        `;

        surahList.appendChild(card);
    });
}

// =============================
// PLAY / PAUSE SURAH AUDIO
// =============================
surahList.addEventListener("click", (e) => {
    if (!e.target.classList.contains("playBtn")) return;

    let button = e.target;
    let surahNumber = button.dataset.id;
    let qari = qariSelect.value;

    let surah = surahs.find(s => s.number == surahNumber);
    if (!surah) {
        alert("❌ Surah nahi mili");
        return;
    }

    let audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${qari}/${surahNumber}.mp3`;

    // SAME SURAH → TOGGLE PLAY/PAUSE
    if (currentPlaying === surahNumber) {
        if (audio.paused) {
            audio.play();
            button.innerText = "⏸";
            currentSurah.innerText = `Playing: ${surah.englishName}`;
        } else {
            audio.pause();
            button.innerText = "▶";
            currentSurah.innerText = `Paused: ${surah.englishName}`;
        }
        return;
    }

    // RESET ALL BUTTONS
    document.querySelectorAll(".playBtn").forEach(btn => btn.innerText = "▶");

    // NEW SURAH PLAY
    audio.src = audioUrl;
    currentPlaying = surahNumber;
    button.innerText = "⏸";
    currentSurah.innerText = `Loading: ${surah.englishName}...`;

    audio.play().then(() => {
        currentSurah.innerText = `Playing: ${surah.englishName}`;
    }).catch(() => {
        button.innerText = "▶";
        currentSurah.innerText = "❌ Audio play nahi ho saki";
    });
});

// =============================
// SEARCH SURAH
// =============================
searchInput.addEventListener("input", () => {
    let keyword = searchInput.value.toLowerCase();
    let filtered = surahs.filter(surah =>
        surah.englishName.toLowerCase().includes(keyword) ||
        surah.englishNameTranslation.toLowerCase().includes(keyword)
    );
    displaySurahs(filtered);
});

// =============================
// AUDIO ERROR HANDLING
// =============================
audio.addEventListener("error", () => {
    currentSurah.innerText = "❌ Audio load nahi ho saki";
    document.querySelectorAll(".playBtn").forEach(btn => btn.innerText = "▶");
});

// =============================
// AUDIO END HANDLING
// =============================
audio.addEventListener("ended", () => {
    currentSurah.innerText = "Audio finished";
    currentPlaying = null;
    document.querySelectorAll(".playBtn").forEach(btn => btn.innerText = "▶");
});

// =============================
// INITIALIZE APP
// =============================
loadSurahs();