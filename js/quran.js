const surahSelect = document.getElementById("surahSelect");
const quranDiv = document.getElementById("quran");
const surahTitle = document.getElementById("surahTitle");

// Global
let allAyahs = [];
let currentAudio = null;


// Load Surah List
async function loadSurahList() {
    try {
        let res = await fetch("https://api.alquran.cloud/v1/surah");
        let data = await res.json();

        data.data.forEach(surah => {
            let option = document.createElement("option");
            option.value = surah.number;
            option.textContent = `${surah.number} - ${surah.englishName}`;
            surahSelect.appendChild(option);
        });

    } catch {
        quranDiv.innerHTML = "❌ Surah list load nahi ho saki";
    }
}


// Load Surah + Audio
async function loadSurah(number) {

    quranDiv.innerHTML = "Loading...";

    try {

        let arabic = await fetch(`https://api.alquran.cloud/v1/surah/${number}`);
        let urdu = await fetch(`https://api.alquran.cloud/v1/surah/${number}/ur.jalandhry`);

        let arabicData = await arabic.json();
        let urduData = await urdu.json();

        surahTitle.textContent = `${arabicData.data.englishName} - ${arabicData.data.name}`;

        quranDiv.innerHTML = "";
        allAyahs = [];

        arabicData.data.ayahs.forEach((ayah, i) => {

            const div = document.createElement("div");
            div.className = "ayah";
            div.dataset.index = i;

            // Play Button
            const playBtn = document.createElement("button");
            playBtn.textContent = "▶";
            playBtn.className = "play-ayah";
            playBtn.style.marginBottom = "10px";

            let audio = new Audio(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`);

            playBtn.addEventListener("click", () => {

                // Pause previous audio
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    allAyahs.forEach(a => a.querySelector(".play-ayah").textContent = "▶");
                }

                // Toggle
                if (audio.paused) {
                    audio.play();
                    playBtn.textContent = "⏸";
                    currentAudio = audio;
                } else {
                    audio.pause();
                    playBtn.textContent = "▶";
                }

            });

            // Reset button when audio ends
            audio.addEventListener("ended", () => {
                playBtn.textContent = "▶";
            });

            div.innerHTML = `
                <span class="ayah-number">${i+1}</span>
                <span class="bookmark">⭐</span>
                <div class="arabic">${ayah.text}</div>
                <div class="urdu">${urduData.data.ayahs[i].text}</div>
            `;

            div.prepend(playBtn);

            // Bookmark
            div.querySelector(".bookmark").addEventListener("click", () => {

                let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
                let key = `${number}-${i}`;

                if (bookmarks.includes(key)) {
                    bookmarks = bookmarks.filter(b => b !== key);
                    div.querySelector(".bookmark").textContent = "⭐";
                } else {
                    bookmarks.push(key);
                    div.querySelector(".bookmark").textContent = "✅";
                }

                localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

            });

            quranDiv.appendChild(div);
            allAyahs.push(div);

        });

        window.scrollTo(0, 0);

    } catch {

        quranDiv.innerHTML = "❌ Surah load nahi ho saki";

    }

}


// Events
surahSelect.addEventListener("change", () => loadSurah(surahSelect.value));


// Initial Load
loadSurahList();
loadSurah(1);