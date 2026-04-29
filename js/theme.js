// =============================
// ELEMENT REFERENCES
// =============================
const toggle = document.getElementById("modeToggle");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

// =============================
// THEME TOGGLE LOGIC
// =============================
if (toggle) {

    // Set initial theme based on localStorage
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
        toggle.textContent = "Theme";
    } else {
        toggle.textContent = "Theme";
    }

    // Toggle theme on button click
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light");

        if (document.body.classList.contains("light")) {
            localStorage.setItem("theme", "light");
            toggle.textContent = "Theme";
        } else {
            localStorage.setItem("theme", "dark");
            toggle.textContent = "Theme";
        }
    });
}

// =============================
// HAMBURGER MENU LOGIC
// =============================
if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        // Toggle navigation menu visibility
        navLinks.classList.toggle("active");

        // Animate hamburger to X
        hamburger.classList.toggle("toggle");
    });
}