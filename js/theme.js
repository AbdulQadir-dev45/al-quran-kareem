const toggle = document.getElementById("modeToggle");
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');


// Theme Toggle Logic

if(toggle){
    if(localStorage.getItem("theme")==="light"){
        document.body.classList.add("light");
        toggle.textContent="☀️";
    }

    toggle.addEventListener("click", ()=>{
        document.body.classList.toggle("light");
        if(document.body.classList.contains("light")){
            localStorage.setItem("theme","light");
            toggle.textContent="☀️";
        }else{
            localStorage.setItem("theme","dark");
            toggle.textContent="🌙";
        }
    });
}


// Hamburger Menu Logic

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate hamburger to X
    hamburger.classList.toggle('toggle');
});