// ==============================
// ELEMENTS
// ==============================
const surahSelect = document.getElementById("surahSelect");
const quranDiv = document.getElementById("quran");
const surahTitle = document.getElementById("surahTitle");

// ==============================
// GLOBAL VARIABLES
// ==============================
let allAyahs = [];
let currentAudio = null;

// ==============================
// LOAD SURAH LIST
// Fetches all surahs and populates the select dropdown
// ==============================
async function loadSurahList() {
    try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await res.json();

        data.data.forEach(surah => {
            const option = document.createElement("option");
            option.value = surah.number;
            option.textContent = `${surah.number} - ${surah.englishName}`;
            surahSelect.appendChild(option);
        });

    } catch (err) {
        console.error("Error loading surah list:", err);
        quranDiv.innerHTML = "❌ Surah list load nahi ho saki";
    }
}

// ==============================
// LOAD SURAH + TRANSLATION + BOOKMARKS
// Fetches a specific surah (Arabic + English translation)
// Displays ayahs with play & bookmark functionality
// ==============================
async function loadSurah(number) {
    quranDiv.innerHTML = "Loading...";
    try {
        const [arabicRes, englishRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${number}`),
            fetch(`https://api.alquran.cloud/v1/surah/${number}/en.asad`)
        ]);

        const arabicData = await arabicRes.json();
        const engData = await englishRes.json();

        surahTitle.textContent = `${arabicData.data.englishName} - ${arabicData.data.name}`;
        quranDiv.innerHTML = "";
        allAyahs = [];

        // Load bookmarks from localStorage
        let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

        arabicData.data.ayahs.forEach((ayah, i) => {
            // Create Ayah card
            const div = document.createElement("div");
            div.className = "ayah";
            div.dataset.index = i;

            // Create Audio button
            const playBtn = document.createElement("button");
            playBtn.textContent = "▶";
            playBtn.className = "play-ayah";
            playBtn.style.marginBottom = "10px";

            const audio = new Audio(
                `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`
            );

            // Play / Pause logic
            playBtn.addEventListener("click", () => {
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    allAyahs.forEach(a => a.querySelector(".play-ayah").textContent = "▶");
                }
                if (audio.paused) {
                    audio.play();
                    playBtn.textContent = "⏸";
                    currentAudio = audio;
                } else {
                    audio.pause();
                    playBtn.textContent = "▶";
                }
            });

            audio.addEventListener("ended", () => {
                playBtn.textContent = "▶";
            });

            // Set inner HTML for Ayah card
            div.innerHTML = `
                <span class="ayah-number">${i + 1}</span>
                <span class="bookmark">⭐</span>
                <div class="arabic">${ayah.text}</div>
                <div class="translation">${engData.data.ayahs[i].text}</div>
            `;
            div.prepend(playBtn);

            // ==============================
            // BOOKMARK LOGIC
            // ==============================
            const bookmarkBtn = div.querySelector(".bookmark");
            const key = `${number}-${i}`;

            if (bookmarks.includes(key)) {
                bookmarkBtn.textContent = "✅";
            }

            bookmarkBtn.addEventListener("click", () => {
                bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

                if (bookmarks.includes(key)) {
                    // Remove bookmark
                    bookmarks = bookmarks.filter(b => b !== key);
                    bookmarkBtn.textContent = "⭐";
                } else {
                    // Add bookmark
                    bookmarks.push(key);
                    bookmarkBtn.textContent = "✅";
                }

                localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            });

            quranDiv.appendChild(div);
            allAyahs.push(div);
        });

        // Scroll to top when surah loads
        window.scrollTo(0, 0);

    } catch (err) {
        console.error("Error loading surah:", err);
        quranDiv.innerHTML = "❌ Surah load nahi ho saki";
    }
}

// ==============================
// EVENTS
// ==============================
surahSelect.addEventListener("change", () => loadSurah(surahSelect.value));

// ==============================
// INITIAL LOAD
// ==============================
loadSurahList();
loadSurah(1);