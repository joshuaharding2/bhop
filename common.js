// ===========================
// common.js — BHOP UI Shared Logic
// ===========================
// -----------------------------
// Supabase client bootstrap (robust)
// -----------------------------

const SUPABASE_URL = "https://xzygrzrfbqlnobjwadtx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6eWdyenJmYnFsbm9iandhZHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNjA4MDUsImV4cCI6MjA3OTgzNjgwNX0.pDXh2ClwIcNI9ToOU4NlkvCPgtKm6LLiB-GktKiH_58";

let __client_init_promise = null;

function createClientOnce() {
  // If client already exists on window, reuse it
  if (window.client) return window.client;

  // If supabase global is present and has createClient, create immediately
  if (typeof window.supabase !== "undefined" && typeof window.supabase.createClient === "function") {
    window.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return window.client;
  }

  // Otherwise, return null — caller should await ensureClient()
  return null;
}

/**
 * ensureClient waits for the supabase CDN global to become available,
 * then creates and attaches the client to window.client. Returns the client.
 * It only creates one promise, so multiple callers share the same waiter.
 */
function ensureClient({ timeout = 3000, interval = 50 } = {}) {
  if (window.client) return Promise.resolve(window.client);
  if (__client_init_promise) return __client_init_promise;

  __client_init_promise = new Promise((resolve, reject) => {
    // try immediate creation first
    const immediate = createClientOnce();
    if (immediate) {
      resolve(immediate);
      return;
    }

    // poll until timeout
    const start = Date.now();
    const tick = () => {
      const c = createClientOnce();
      if (c) {
        resolve(c);
        return;
      }
      if (Date.now() - start >= timeout) {
        reject(new Error("Supabase global not available within timeout. Ensure the CDN script is loaded before common.js or import supabase as a module."));
        return;
      }
      setTimeout(tick, interval);
    };
    tick();
  });

  return __client_init_promise;
}

// attempt a best-effort immediate create (for the common case where CDN was loaded before)
try { createClientOnce(); } catch (e) { /* ignore */ }

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
        <button class="footer-btn" onclick="location.href='updates.html'"><p class="update-text">Update Log</p></button>
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

    // ---------- Dropdown + log out ----------
    const account = document.querySelector(".account");
    const dropdown = document.querySelector(".account-dropdown");
    if (account && dropdown) {
        document.addEventListener("click", (e) => {
            if (!account.contains(e.target)) {
                account.classList.remove("show-dropdown");
            }
        });

        // Attach logout handler
        const logout = document.querySelector(".logout");

        if (logout) {
            logout.addEventListener("click", async () => {
                // Supabase logout (server-side session destroy)
                const client = await ensureClient();
                const { error } = await client.auth.signOut();
                if (error) {
                    console.error("Error logging out:", error);
                    alert("Logout failed. Check console.");
                    return;
                }

                // Remove any local stuff you used
                localStorage.removeItem("username");
                localStorage.removeItem("user_id");
                localStorage.removeItem("session");

                // Full reload or redirect to login
                window.location.href = "/login.html"; // or: location.reload();
            });
        }
    }
});

// ---- USERNAME DISPLAY ----
async function getDisplayName() {
    const client = await ensureClient();
    const { data: { user } } = await client.auth.getUser();
    return user?.user_metadata?.display_name || "Guest";
}
document.addEventListener("DOMContentLoaded", async () => {
    const usernameSpan = document.querySelector(".username");
    const username = await getDisplayName();
    if (usernameSpan) usernameSpan.textContent = username;
    if (username === "Guest") {
        const div = document.querySelector(".account-dropdown");
        div.innerHTML = `<div class="dropdown-item" onclick="location.href='login.html'">Log In</div>`;
    }
    // Set account div right
    const accountDiv = document.querySelector(".account");
    if (accountDiv) {
        const rect = usernameSpan.getBoundingClientRect();
        accountDiv.style.transition = "none";
        accountDiv.style.right = `${80 + ((rect.width - 68.73748779296875) / 3.97059)}px`;
        accountDiv.style.transtion = "0.2s";
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
