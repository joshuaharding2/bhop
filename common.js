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

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf("/") + 1);

    // ---------- HEADER ----------
    let headerHTML = `
      <div class="account">
        <img src="img/unknown.png" alt="pfp">
        <span class="username">Guest</span>
        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="240 -720 480 480" width="18px" fill="#FFFFFF">
          <path d="M480-360 280-560h400L480-360Z" />
        </svg>
        <div class="account-dropdown">
          <div class="dropdown-item">View Profile</div>
          <div class="dropdown-item">Change Username</div>
          <div class="dropdown-item logout">Log Out</div>
        </div>
      </div>
    `;

    // Add special buttons or variants depending on the page
    if (page !== "home.html" && page !== "home") {
        headerHTML = `
        <button class="back-btn" onclick="window.history.back()">
        <svg class="back-btn-svg" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#00ffa6"><path d="m315-433 232 232-67 66-345-345 345-346 67 67-232 232h511v94H315Z"/></svg>
        <span class="back-btn-text">Back</span>
        </button>
        ${headerHTML}
      `;
    }
    if (page === "login.html" || page === "login") {
        headerHTML = ``;
    }

    // ---------- FOOTER ----------
    const footerHTML = `
      <div class="footer-links">
        <button class="footer-btn" onclick="location.href='updates.html'">Update Log</button>
        <button class="footer-btn discord" onclick="window.open('https://discord.gg/TcTvmwxgJb', '_blank')">
          <img src="img/discord.png" alt="Discord" class="discord-icon">
          Join Discord
        </button>
      </div>
      <p class="footer-text">© 2025 Joshua Harding — All rights reserved.</p>
    `;

    // Inject them
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    if (header) {
        header.innerHTML = headerHTML;
        header.style.display = "flex";
    }

    if (footer) {
        footer.innerHTML = footerHTML;
        footer.style.display = "flex";
    }

    // ---------- Username handling ----------
    const usernameSpan = document.querySelector(".username");
    const username = localStorage.getItem("username") || "Guest";
    if (usernameSpan) usernameSpan.textContent = username;

    // ---------- Dropdown + log out ----------
    const account = document.querySelector(".account");
    const dropdown = document.querySelector(".account-dropdown");
    if (account && dropdown) {
        account.addEventListener("click", (e) => {
            console.log("test");
        });

        document.addEventListener("click", (e) => {
            if (!account.contains(e.target)) {
                account.classList.remove("show-dropdown");
            }
        });

        const logout = dropdown.querySelector(".logout");
        if (logout) {
            logout.addEventListener("click", () => {
                localStorage.removeItem("username");
                alert("You’ve been logged out.");
                location.reload();
            });
        }
    }
});

// ---- USERNAME DISPLAY ----
document.addEventListener("DOMContentLoaded", () => {
    const usernameSpan = document.querySelector(".username");
    const username = localStorage.getItem("username") || "Guest";
    if (usernameSpan) usernameSpan.textContent = username;
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
document.querySelector("main").style.display = "flex";
scaleUI();
