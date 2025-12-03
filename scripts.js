// ======================================
// DOM ELEMENTS AFTER HEADER LOAD
// ======================================
function initHeaderAndNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksAll = document.querySelectorAll('.nav-link');
    const logoLink = document.getElementById('logoLink');
    const backToHomeBtn = document.getElementById('backToHome');

    // LOGO REDIRECT TO HOME  
    if (logoLink) {  
        logoLink.addEventListener('click', (e) => {  
            e.preventDefault();  
            navigateToPage('home');  
        });  
    }  

    // MOBILE MENU TOGGLE  
    if (mobileMenuBtn) {  
        mobileMenuBtn.addEventListener('click', () => {  
            if (navLinks) navLinks.classList.toggle('active');
        });  
    }  

    // NAVIGATION EVENT LISTENERS  
   navLinksAll.forEach(link => {  
    link.addEventListener('click', (e) => {  
        const pageId = link.getAttribute('data-page');  

        if (!pageId) return; // ← allow normal navigation

        e.preventDefault();  
        navigateToPage(pageId);  
    });  
});

    // BACK TO HOME BUTTON
    if (backToHomeBtn) {  
        backToHomeBtn.addEventListener('click', () => navigateToPage('home'));  
    }  
}

// ======================================
// PAGE SECTIONS, STICKY BANNER, VIDEO, BACK BUTTON
// ======================================
const pageSections = document.querySelectorAll('.page-section');
const stickyBanner = document.querySelector('.sticky-banner');
const backToHomeBtn = document.getElementById('backToHome');
const heroVideo = document.getElementById('heroVideo');
const videoFallback = document.getElementById('videoFallback');

// ======================================
// NAVIGATION ET PAGES
// ======================================
function navigateToPage(pageId) {
    pageSections.forEach(section => section.classList.remove('active'));
    const section = document.getElementById(pageId);
    if (section) section.classList.add('active');

    // Sticky banner / back button  
    if (stickyBanner && backToHomeBtn) {
        if (pageId === 'home') {  
            stickyBanner.style.display = 'none';  
            backToHomeBtn.style.display = 'none';  
        } else {  
            stickyBanner.style.display = 'flex';  
            backToHomeBtn.style.display = 'block';  
        }  
    }

    // Close mobile menu  
    const navLinks = document.querySelector('.nav-links');  
    if (navLinks) navLinks.classList.remove('active');  

    // Active nav link  
    const navLinksAll = document.querySelectorAll('.nav-link');  
    navLinksAll.forEach(link => {  
        link.classList.remove('active');  
        if (link.getAttribute('data-page') === pageId) link.classList.add('active');  
    });  

    window.scrollTo(0, 0);  
}

// ======================================
// CASSETTE FILTERING
// ======================================
function initTrackNavigation() {
    const tracks = document.querySelectorAll('.cassette-track');
    tracks.forEach(track => {
        track.addEventListener('click', () => {
            const pageId = track.getAttribute('data-target'); 
            if (pageId) navigateToPage(pageId);
        });
    });
}

function initCassetteFilter() {
    const cassetteButtons = document.querySelectorAll('.cassette-button');
    cassetteButtons.forEach(button => {  
        button.addEventListener('click', () => {  
            const category = button.getAttribute('data-category');  
            filterContent(category, button);  
        });  
    });  
}

function filterContent(category, btn) {
    const tracks = document.querySelectorAll('.cassette-track');
    const cassetteButtons = document.querySelectorAll('.cassette-button');

    cassetteButtons.forEach(button => button.classList.remove('active'));  
    if (btn) btn.classList.add('active');  

    tracks.forEach(track => {  
        track.style.display = (category === 'all' || track.classList.contains(`${category}-content`)) ? 'flex' : 'none';  
    });  

    const noBlog = document.getElementById('noBlogMessage');  
    const noProjects = document.getElementById('noProjectsMessage');  
    const noTalks = document.getElementById('noTalksMessage');  
    if (noBlog) noBlog.style.display = 'none';  
    if (noProjects) noProjects.style.display = 'none';  
    if (noTalks) noTalks.style.display = 'none';  

    if (category === 'blog' && ![...document.querySelectorAll('.blog-content')].some(t => t.style.display !== 'none')) if (noBlog) noBlog.style.display = 'block';  
    if (category === 'projects' && ![...document.querySelectorAll('.projects-content')].some(t => t.style.display !== 'none')) if (noProjects) noProjects.style.display = 'block';  
    if (category === 'talks' && ![...document.querySelectorAll('.talks-content')].some(t => t.style.display !== 'none')) if (noTalks) noTalks.style.display = 'block';  
}

// ======================================
// VIDEO INIT
// ======================================
function initVideoControls() {
    if (!heroVideo) return;
    heroVideo.removeAttribute('controls');
    heroVideo.controls = false;
    heroVideo.style.setProperty('--media-controls-display', 'none', 'important');
    heroVideo.play().catch(() => { if (videoFallback) videoFallback.style.display = 'flex'; });
    heroVideo.addEventListener('contextmenu', e => e.preventDefault());
    heroVideo.addEventListener('error', () => { if (videoFallback) videoFallback.style.display = 'flex'; });
}

// ======================================
// INITIALIZATION
// ======================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. Load header first
    fetch("./partials/header.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("navbar").innerHTML = html;
            initHeaderAndNavigation(); // init header nav
            navigateToPage('home');    // <-- ATTENTION: on attend le header
        });

    // 2. Initialize cassette buttons + track clicks
    initCassetteFilter();
    initTrackNavigation();

    // 3. Initialize video controls
    initVideoControls();
});
