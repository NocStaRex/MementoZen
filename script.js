// ==========================================
// --- 1. CONFIGURATION ---
// ==========================================

const birthDate = new Date(2004, 8, 10, 20, 15); 
const lifeExpectancyYears = 60;

const deathDate = new Date(birthDate);
deathDate.setFullYear(birthDate.getFullYear() + lifeExpectancyYears);

// Shortcuts (Top Center)
const myShortcuts = [
    { name: "YouTube", url: "https://www.youtube.com" },
    { name: "Gmail",   url: "https://mail.google.com" }, 
    { name: "Udemy",   url: "https://www.udemy.com" },
    { name: "GoogleSkills", url: "https://www.skills.google" },
    { name: "Google",  url: "https://www.google.com" },
    { name: "Drive",   url: "https://drive.google.com/drive/home" },
    { name: "Arcade",   url: "https://go.cloudskillsboost.google/arcade" }, 
];

// AI Apps (Right Sidebar)
const aiApps = [
    { name: "ChatGPT", url: "https://chatgpt.com", icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
    { name: "Gemini", url: "https://gemini.google.com", icon: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" },
    { name: "Perplexity", url: "https://www.perplexity.ai" },
    { name: "Claude", url: "https://claude.ai" },
];


// ==========================================
// --- 2. TIMER LOGIC ---
// ==========================================

function getPreciseDiff(startDate, endDate) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();
    let hours = endDate.getHours() - startDate.getHours();
    let minutes = endDate.getMinutes() - startDate.getMinutes();
    let seconds = endDate.getSeconds() - startDate.getSeconds();
    let ms = endDate.getMilliseconds() - startDate.getMilliseconds();

    if (ms < 0) { ms += 1000; seconds--; }
    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
        const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) { months += 12; years--; }

    return { years, months, days, hours, minutes, seconds, ms };
}

function updateTimers() {
    const now = new Date();

    // Life Left
    if (deathDate > now) {
        const t = getPreciseDiff(now, deathDate);
        document.getElementById('y-left').innerText = String(t.years).padStart(2, '0');
        document.getElementById('mo-left').innerText = String(t.months).padStart(2, '0');
        document.getElementById('d-left').innerText = String(t.days).padStart(2, '0');
        document.getElementById('h-left').innerText = String(t.hours).padStart(2, '0');
        document.getElementById('m-left').innerText = String(t.minutes).padStart(2, '0');
        document.getElementById('s-left').innerText = String(t.seconds).padStart(2, '0');
        document.getElementById('ms-left').innerText = String(Math.floor(t.ms / 10)).padStart(2, '0');
    }

    // Current Life
    if (now > birthDate) {
        const p = getPreciseDiff(birthDate, now);
        document.getElementById('y-past').innerText = String(p.years).padStart(2, '0');
        document.getElementById('mo-past').innerText = String(p.months).padStart(2, '0');
        document.getElementById('d-past').innerText = String(p.days).padStart(2, '0');
        document.getElementById('h-past').innerText = String(p.hours).padStart(2, '0');
        document.getElementById('m-past').innerText = String(p.minutes).padStart(2, '0');
        document.getElementById('s-past').innerText = String(p.seconds).padStart(2, '0');
    }
}


// ==========================================
// --- 3. RENDERING FUNCTIONS ---
// ==========================================

function generateGrid() {
    const container = document.getElementById('grid-container');
    const totalWeeks = lifeExpectancyYears * 52; 
    const now = new Date();
    const weeksLived = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 7));

    container.innerHTML = ''; 
    for (let i = 0; i < totalWeeks; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (i < weeksLived) tile.classList.add('past');
        container.appendChild(tile);
    }
}

function renderShortcuts() {
    const container = document.getElementById('shortcuts');
    container.innerHTML = '';

    myShortcuts.forEach(site => {
        const link = document.createElement('a');
        link.href = site.url;
        link.className = 'shortcut-item';

        let iconSrc = `https://www.google.com/s2/favicons?domain=${site.url}&sz=64`;
        if (site.url.includes("mail.google.com")) {
            iconSrc = "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg";
        }

        link.innerHTML = `
            <div class="icon-box"><img src="${iconSrc}" alt="${site.name}" style="width: 32px; height: 32px;"></div>
            <span class="shortcut-label">${site.name}</span>
        `;
        container.appendChild(link);
    });
}

function renderAIApps() {
    const container = document.getElementById('ai-grid-container');
    if (!container) return;
    container.innerHTML = ''; 

    const totalSlots = 8; 

    aiApps.forEach(app => {
        const link = document.createElement('a');
        link.href = app.url;
        link.className = 'ai-item';
        let iconSrc = app.icon ? app.icon : `https://www.google.com/s2/favicons?domain=${app.url}&sz=64`;
        link.innerHTML = `<img src="${iconSrc}" alt="${app.name}">`;
        container.appendChild(link);
    });

    for (let i = 0; i < totalSlots - aiApps.length; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'ai-item empty';
        emptyDiv.innerText = '+';
        container.appendChild(emptyDiv);
    }
}


// ==========================================
// --- 4. ZEN MODE LOGIC ---
// ==========================================

const zenToggleBtn = document.getElementById('zen-toggle');
const iconMinimize = `<svg viewBox="0 0 24 24"><path d="M19 13h-2v4H5V5h14v8h2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6z"/><path d="M14 13h4v-2h-4V7l-4 4 4 4v-2z" transform="rotate(-45, 14, 11)"/></svg>`; 
const iconMaximize = `<svg viewBox="0 0 24 24"><path d="M5 11h2V7h14v10h-8v2h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v4z"/><path d="M10 11H6v2h4v4l4-4-4-4v2z" transform="rotate(135, 10, 13)"/></svg>`;

function updateZenState() {
    const isZen = document.documentElement.classList.contains('zen-active');
    if (zenToggleBtn) {
        zenToggleBtn.innerHTML = isZen ? iconMaximize : iconMinimize;
    }
}

if (zenToggleBtn) {
    zenToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('zen-active');
        updateZenState();
        const isZen = document.documentElement.classList.contains('zen-active');
        localStorage.setItem('zenMode', isZen ? 'active' : 'inactive');
    });
}

// --- INITIALIZE EVERYTHING ---
generateGrid();
renderShortcuts();
renderAIApps();
updateZenState();
setInterval(updateTimers, 50); 
updateTimers();


// ==========================================
// --- SETTINGS MODAL LOGIC (New) ---
// ==========================================

const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings');

// Open Modal
if(settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('show');
    });
}

// Close Modal
if(closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('show');
    });
}

// Close if clicked outside the box
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove('show');
    }
});