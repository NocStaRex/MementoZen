// ==========================================
// --- 1. CONFIGURATION ---
// ==========================================

const LIFE_SETTINGS_KEY = 'lifeSettings';
const defaultLifeSettings = {
    birthDate: '2004-09-10',
    birthTime: '20:15',
    useBirthTime: true,
    lifeExpectancyYears: 60,
    gridPrecision: 'weeks'
};

let lifeSettings = loadLifeSettings();
let birthDate = createBirthDate(lifeSettings);
let lifeExpectancyYears = lifeSettings.lifeExpectancyYears;
let deathDate = createDeathDate(birthDate, lifeExpectancyYears);

function loadLifeSettings() {
    const savedSettings = localStorage.getItem(LIFE_SETTINGS_KEY);
    if (!savedSettings) return { ...defaultLifeSettings };

    try {
        const parsed = JSON.parse(savedSettings);
        return normalizeLifeSettings(parsed);
    } catch (error) {
        return { ...defaultLifeSettings };
    }
}

function normalizeLifeSettings(settings) {
    settings = settings && typeof settings === 'object' ? settings : {};
    const birthDateValue = isValidDateInput(settings.birthDate) ? settings.birthDate : defaultLifeSettings.birthDate;
    const birthTimeValue = isValidTimeInput(settings.birthTime) ? settings.birthTime : defaultLifeSettings.birthTime;
    const yearsValue = Number(settings.lifeExpectancyYears);

    return {
        birthDate: birthDateValue,
        birthTime: birthTimeValue,
        useBirthTime: Boolean(settings.useBirthTime),
        lifeExpectancyYears: Number.isFinite(yearsValue) ? Math.min(Math.max(Math.round(yearsValue), 1), 150) : defaultLifeSettings.lifeExpectancyYears,
        gridPrecision: isValidGridPrecision(settings.gridPrecision) ? settings.gridPrecision : defaultLifeSettings.gridPrecision
    };
}

function isValidDateInput(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTimeInput(value) {
    return typeof value === 'string' && /^\d{2}:\d{2}$/.test(value);
}

function isValidGridPrecision(value) {
    return ['weeks', 'months', 'years'].includes(value);
}

function createBirthDate(settings) {
    const [year, month, day] = settings.birthDate.split('-').map(Number);
    const [hour, minute] = settings.useBirthTime ? settings.birthTime.split(':').map(Number) : [0, 0];
    return new Date(year, month - 1, day, hour, minute);
}

function createDeathDate(startDate, years) {
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + years);
    return endDate;
}

function saveLifeSettings(settings) {
    lifeSettings = normalizeLifeSettings(settings);
    localStorage.setItem(LIFE_SETTINGS_KEY, JSON.stringify(lifeSettings));
    birthDate = createBirthDate(lifeSettings);
    lifeExpectancyYears = lifeSettings.lifeExpectancyYears;
    deathDate = createDeathDate(birthDate, lifeExpectancyYears);
    generateGrid();
    updateTimers();
}

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
    } else {
        setTimerValues('left', { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0 });
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
    } else {
        setTimerValues('past', { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0 });
    }
}

function setTimerValues(type, values) {
    document.getElementById(`y-${type}`).innerText = String(values.years).padStart(2, '0');
    document.getElementById(`mo-${type}`).innerText = String(values.months).padStart(2, '0');
    document.getElementById(`d-${type}`).innerText = String(values.days).padStart(2, '0');
    document.getElementById(`h-${type}`).innerText = String(values.hours).padStart(2, '0');
    document.getElementById(`m-${type}`).innerText = String(values.minutes).padStart(2, '0');
    document.getElementById(`s-${type}`).innerText = String(values.seconds).padStart(2, '0');
    if (type === 'left') {
        document.getElementById('ms-left').innerText = String(Math.floor(values.ms / 10)).padStart(2, '0');
    }
}


// ==========================================
// --- 3. RENDERING FUNCTIONS ---
// ==========================================

function generateGrid() {
    const container = document.getElementById('grid-container');
    const gridUnits = getGridUnits();

    container.dataset.precision = lifeSettings.gridPrecision;
    container.innerHTML = ''; 
    for (let i = 0; i < gridUnits.total; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (i < gridUnits.lived) tile.classList.add('past');
        if (i === gridUnits.lived && gridUnits.partial > 0) {
            tile.classList.add('partial');
            tile.style.setProperty('--progress', `${gridUnits.partial * 100}%`);
        }
        container.appendChild(tile);
    }
}

function getGridUnits() {
    const now = new Date();
    const precision = lifeSettings.gridPrecision;

    if (precision === 'years') {
        const yearsLived = now > birthDate ? getPreciseDiff(birthDate, now).years : 0;
        const currentYearStart = addYears(birthDate, yearsLived);
        const nextYearStart = addYears(birthDate, yearsLived + 1);
        return {
            total: lifeExpectancyYears,
            lived: clampGridProgress(yearsLived, lifeExpectancyYears),
            partial: getUnitProgress(now, currentYearStart, nextYearStart, yearsLived, lifeExpectancyYears)
        };
    }

    if (precision === 'months') {
        const totalMonths = lifeExpectancyYears * 12;
        const livedDiff = now > birthDate ? getPreciseDiff(birthDate, now) : { years: 0, months: 0 };
        const monthsLived = livedDiff.years * 12 + livedDiff.months;
        const currentMonthStart = addMonths(birthDate, monthsLived);
        const nextMonthStart = addMonths(birthDate, monthsLived + 1);
        return {
            total: totalMonths,
            lived: clampGridProgress(monthsLived, totalMonths),
            partial: getUnitProgress(now, currentMonthStart, nextMonthStart, monthsLived, totalMonths)
        };
    }

    const totalWeeks = lifeExpectancyYears * 52;
    const weeksLived = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 7));
    const currentWeekStart = addDays(birthDate, weeksLived * 7);
    const nextWeekStart = addDays(birthDate, (weeksLived + 1) * 7);
    return {
        total: totalWeeks,
        lived: clampGridProgress(weeksLived, totalWeeks),
        partial: getUnitProgress(now, currentWeekStart, nextWeekStart, weeksLived, totalWeeks)
    };
}

function clampGridProgress(value, total) {
    return Math.min(Math.max(value, 0), total);
}

function getUnitProgress(now, startDate, endDate, completedUnits, totalUnits) {
    if (now <= birthDate || completedUnits >= totalUnits) return 0;
    const progress = (now - startDate) / (endDate - startDate);
    return Math.min(Math.max(progress, 0), 1);
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

function addYears(date, years) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
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
const settingsTabs = document.querySelectorAll('.settings-tab');
const settingsPanels = document.querySelectorAll('.settings-panel');
const lifeSettingsForm = document.getElementById('life-settings-form');
const birthDateInput = document.getElementById('birth-date');
const birthTimeInput = document.getElementById('birth-time');
const useBirthTimeInput = document.getElementById('use-birth-time');
const lifeExpectancyInput = document.getElementById('life-expectancy');
const gridPrecisionButtons = document.querySelectorAll('.precision-option');
const resetLifeSettingsBtn = document.getElementById('reset-life-settings');
const settingsStatus = document.getElementById('settings-status');

function syncSettingsForm() {
    if (!lifeSettingsForm) return;
    birthDateInput.value = lifeSettings.birthDate;
    birthTimeInput.value = lifeSettings.birthTime;
    useBirthTimeInput.checked = lifeSettings.useBirthTime;
    birthTimeInput.disabled = !lifeSettings.useBirthTime;
    lifeExpectancyInput.value = lifeSettings.lifeExpectancyYears;
    gridPrecisionButtons.forEach(button => {
        const isActive = button.dataset.gridPrecision === lifeSettings.gridPrecision;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-checked', String(isActive));
    });
}

function getSettingsFormValues(precisionOverride) {
    return {
        birthDate: birthDateInput.value,
        birthTime: birthTimeInput.value || defaultLifeSettings.birthTime,
        useBirthTime: useBirthTimeInput.checked,
        lifeExpectancyYears: lifeExpectancyInput.value,
        gridPrecision: precisionOverride || document.querySelector('.precision-option.active')?.dataset.gridPrecision || defaultLifeSettings.gridPrecision
    };
}

function showSettingsStatus(message) {
    if (!settingsStatus) return;
    settingsStatus.innerText = message;
    window.clearTimeout(showSettingsStatus.timeoutId);
    showSettingsStatus.timeoutId = window.setTimeout(() => {
        settingsStatus.innerText = '';
    }, 2200);
}

function setActiveSettingsTab(tabName) {
    settingsTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.settingsTab === tabName);
    });
    settingsPanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.settingsPanel === tabName);
    });
}

// Open Modal
if(settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        syncSettingsForm();
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

settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        setActiveSettingsTab(tab.dataset.settingsTab);
    });
});

if (useBirthTimeInput) {
    useBirthTimeInput.addEventListener('change', () => {
        birthTimeInput.disabled = !useBirthTimeInput.checked;
    });
}

gridPrecisionButtons.forEach(button => {
    button.addEventListener('click', () => {
        saveLifeSettings(getSettingsFormValues(button.dataset.gridPrecision));
        syncSettingsForm();
        showSettingsStatus(`Grid changed to ${button.dataset.gridPrecision}.`);
    });
});

if (lifeSettingsForm) {
    lifeSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveLifeSettings(getSettingsFormValues());
        syncSettingsForm();
        showSettingsStatus('Saved. Your time canvas is updated.');
    });
}

if (resetLifeSettingsBtn) {
    resetLifeSettingsBtn.addEventListener('click', () => {
        saveLifeSettings(defaultLifeSettings);
        syncSettingsForm();
        showSettingsStatus('Reset to the original setup.');
    });
}

syncSettingsForm();
