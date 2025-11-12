// ===========================
// common.js — BHOP UI Shared Logic
// ===========================

// ---- PARTICLE BACKGROUND ----
const particleContainer = document.createElement("div");
particleContainer.classList.add("particles");
document.body.appendChild(particleContainer);

// common.js - Particle generator
function initParticles() {
    const container = document.querySelector(".particles");
    const particleCount = window.innerWidth / scale / 10;

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("div");
        p.classList.add("particle");

        const size = Math.random() * 5 + 3;
        p.style.width = p.style.height = `${size}px`;
        p.style.left = `${Math.random() * window.innerWidth / scale}px`;
        p.style.top = `${Math.random() * window.innerHeight / scale}px`;

        p.style.animationDuration = `${12 + Math.random() * 10}s`;
        p.style.animationDelay = `${Math.random() * -15}s`; // desync movement
        container.appendChild(p);
    }
}

// ---- USERNAME DISPLAY ----
document.addEventListener("DOMContentLoaded", () => {
    const usernameSpan = document.querySelector(".username");
    const username = localStorage.getItem("username") || "Guest";
    if (usernameSpan) usernameSpan.textContent = username;
});

// ---- BACK BUTTON LOGIC ----
document.addEventListener("DOMContentLoaded", () => {
    const backBtn = document.querySelector(".back-btn");
    if (backBtn) {
        backBtn.addEventListener("click", () => window.history.back());
    }
});

// ---- ACCOUNT DROPDOWN ----
document.addEventListener("DOMContentLoaded", () => {
    const account = document.querySelector(".account");
    const dropdown = document.querySelector(".account-dropdown");
    if (!account || !dropdown) return;

    account.addEventListener("click", (e) => {
        e.stopPropagation();
        account.classList.toggle("show-dropdown");
    });

    document.addEventListener("click", (e) => {
        if (!account.contains(e.target)) {
            account.classList.remove("show-dropdown");
        }
    });

    dropdown.querySelector(".logout").addEventListener("click", () => {
        localStorage.removeItem("username");
        alert("You’ve been logged out.");
        location.reload();
    });
});

window.addEventListener("load", initParticles);

// Scale based on height
let scale = window.innerHeight / 1020;

function scaleUI() {
    scale = window.innerHeight / 1020;
    document.documentElement.style.setProperty('--scale', scale);
    const main = document.querySelector("main");
    const mainTy = (window.innerHeight - main.getBoundingClientRect().height) / 5 / scale;
    //main.style.setProperty('--main-ty', `${mainTy}px`);
    /*const wrapper = document.getElementById("ui-scale-wrapper");

    // Compute scaled size
    const scaledWidth = baseWidth * scale;

    // Compute offset to center the wrapper
    const offsetX = (window.innerWidth - scaledWidth) / 2;
    const offsetY = window.innerHeight * -0.1;

    // Apply transform
    wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    wrapper.getBoundingClientRect(); // force layout flush
    wrapper.style.willChange = 'transform';

    const btn = document.querySelector('.back-btn');
    if (btn) {
        btn.style.transition = 'none';
        btn.style.setProperty('--btn-scale', scale);
        btn.style.setProperty('--btn-tx', `${-91.4 * (1 - scale)}px`);
        btn.style.setProperty('--btn-ty', `${-47.3 * (1 - scale)}px`);
        //btn.style.left = `${30 * scale}px`;
        //btn.style.top = `${20 * scale}px`;
        btn.offsetHeight;
        btn.style.transition = '';
    }
    
    const div = document.querySelector('.account');
    if (div) {
        div.style.transition = 'none';
        div.style.setProperty('--div-scale', scale);
        div.style.setProperty('--div-tx', `${103 * (1 - scale)}px`);
        div.style.setProperty('--div-ty', `${-47.3 * (1 - scale)}px`);
        //div.style.right = `${30 * scale}px`;
        //div.style.top = `${20 * scale}px`;
        div.offsetHeight;
        div.style.transition = '';
    }*/

    // Reset Particles
    const particleContainer = document.querySelector(".particles");
    particleContainer.innerHTML = "";
    initParticles();
}

window.addEventListener("resize", scaleUI);
document.querySelector("header").style.display = "flex";
document.querySelector("main").style.display = "flex";
document.querySelector("footer").style.display = "flex";
scaleUI();

async function loadHTML(selector, file) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        el.innerHTML = await response.text();
    } catch (err) {
        console.error(err);
    }
}

// Load header and footer automatically
document.addEventListener("DOMContentLoaded", () => {
    loadHTML("header", "header.html");
    loadHTML("footer", "footer.html");
});  