// memory.js - Ye file page load hone se pehle chalegi
const savedMode = localStorage.getItem('zenMode');
if (savedMode === 'active') {
    document.documentElement.classList.add('zen-active');
}