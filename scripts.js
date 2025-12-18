// ======================================
// LOAD HEADER FOR STANDALONE PAGES
// ======================================
function loadStandaloneHeader() {
    (async () => {
      try {
        const res = await fetch("/partials/header.html");
        const html = await res.text();
        
        const navbarContainer = document.getElementById("navbar");
        navbarContainer.innerHTML = html;
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        let currentPath = window.location.pathname;
        if (currentPath === "/") currentPath = "/index.html";
        currentPath = currentPath.split("?")[0].split("#")[0];
        
        const links = navbarContainer.querySelectorAll('.nav-link');
        
        links.forEach(link => {
          let linkPath = new URL(link.href).pathname;
          linkPath = linkPath.split("?")[0].split("#")[0];
          
          if ((currentPath === "/index.html" && linkPath === "/index.html") ||
              currentPath === linkPath) {
            link.classList.add('active');
          }
        });
        
        navbarContainer.style.visibility = "visible";
        
        // Init après chargement du header
        initThemeToggle();
        initHeaderAndNavigation();
        
      } catch (err) {
        console.error("Erreur chargement navbar :", err);
      }
    })();
}

// ======================================
// DOM ELEMENTS AFTER HEADER LOAD
// ======================================
function initHeaderAndNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksAll = document.querySelectorAll('.nav-link');
    const logoLink = document.getElementById('logoLink');
    const backToHomeBtn = document.getElementById('backToHome');

    if (logoLink) {  
        logoLink.addEventListener('click', (e) => {  
            e.preventDefault();  
            navigateToPage('home');  
        });  
    }  

    if (mobileMenuBtn) {  
        mobileMenuBtn.addEventListener('click', () => {  
            if (navLinks) navLinks.classList.toggle('active');
        });  
    }  

    navLinksAll.forEach(link => {  
        link.addEventListener('click', (e) => {  
            const pageId = link.getAttribute('data-page');  
        if (!pageId || !document.body.classList.contains('spa-mode')) return;

        e.preventDefault();  
        navigateToPage(pageId);  
        });  
    });

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
// NAVIGATION AND PAGES
// ======================================
function navigateToPage(pageId) {
    pageSections.forEach(section => section.classList.remove('active'));
    const section = document.getElementById(pageId);
    if (section) section.classList.add('active');

    if (stickyBanner && backToHomeBtn) {
        if (pageId === 'home') {  
            stickyBanner.style.display = 'none';  
            backToHomeBtn.style.display = 'none';  
        } else {  
            stickyBanner.style.display = 'flex';  
            backToHomeBtn.style.display = 'block';  
        }  
    }

    const navLinks = document.querySelector('.nav-links');  
    if (navLinks) navLinks.classList.remove('active');  

    const navLinksAll = document.querySelectorAll('.nav-link');  
    navLinksAll.forEach(link => {  
        link.classList.remove('active');  
        const linkDataPage = link.getAttribute('data-page');
        
        const internalSections = ['duck1', 'mobygratis'];
        if (internalSections.includes(pageId)) {
            if (linkDataPage === 'home') {
                link.classList.add('active');
            }
        } else if (linkDataPage === pageId) {
            link.classList.add('active');
        }
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
// CONTACT MAIL STATUS
// ======================================   
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        formStatus.textContent = 'sending...';
        formStatus.style.color = '#666';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                formStatus.textContent = 'Message sent !';
                formStatus.style.color = 'green';
                form.reset();
            } else {
                throw new Error('Erreur');
            }
        } catch (error) {
            formStatus.textContent = 'Error. Please, retry.';
            formStatus.style.color = 'red';
        }
    });
}

// ======================================
// THEME TOGGLE (DARK/LIGHT MODE)
// ======================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) return;
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('light-mode');
        themeToggle.textContent = '🌙';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ======================================
// INITIALIZATION
// ======================================
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('spa-mode')) {
        // Mode SPA (index.html)
        fetch("/partials/header.html")
            .then(res => res.text())
            .then(html => {
                document.getElementById("navbar").innerHTML = html;
                initHeaderAndNavigation();
                navigateToPage('home');
                initThemeToggle();
            });
    } else if (document.body.classList.contains('standalone-mode')) {
        // Mode standalone - le header se chargera via loadStandaloneHeader()
        // (appelé depuis le HTML)
    }

    initCassetteFilter();
    initTrackNavigation();
    initVideoControls();
    initContactForm();
});