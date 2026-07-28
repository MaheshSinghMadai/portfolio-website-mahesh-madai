// Mahesh Singh Madai Portfolio - Interactive Scripts

document.addEventListener('DOMContentLoaded', async function() {
    // 0. Initialize theme before loading components
    initTheme();

    // 1. Load Header Component
    try {
        const headerResponse = await fetch('header.html');
        if (headerResponse.ok) {
            const headerContent = await headerResponse.text();
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = headerContent;
                highlightActiveNav();
                setupMobileNav();
                setupThemeToggle();
            }
        }
    } catch (error) {
        console.error('Error loading header:', error);
    }

    // 2. Load Footer Component
    try {
        const footerResponse = await fetch('footer.html');
        if (footerResponse.ok) {
            const footerContent = await footerResponse.text();
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = footerContent;
            }
        }
    } catch (error) {
        console.error('Error loading footer:', error);
    }

    // 3. Initialize Metric Ticker Counters if present
    initMetricCounters();

    // 4. Initialize Project Filters if present
    initProjectFilters();

    // 5. Initialize Scroll Snap Side Dots if present
    initScrollSnapDots();
});

// Highlight active page link in navigation bar
function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page') || link.getAttribute('href');
        if (linkPage === currentPath || (currentPath === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Mobile Navbar Toggle Setup
function setupMobileNav() {
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const navList = document.getElementById('navbar-nav-list');
    if (toggleBtn && navList) {
        toggleBtn.addEventListener('click', () => {
            navList.classList.toggle('show');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                if (navList.classList.contains('show')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });
    }
}

// Animate numbers for stats highlights
function initMetricCounters() {
    const counters = document.querySelectorAll('.counter-val');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const duration = 1500; // ms
                const startTime = performance.now();
                const startVal = 0;
                const isFloat = counter.getAttribute('data-float') === 'true';

                function update(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quadratic
                    const currentVal = startVal + (target - startVal) * (1 - Math.pow(1 - progress, 2));

                    if (isFloat) {
                        counter.innerText = currentVal.toFixed(1);
                    } else {
                        counter.innerText = Math.floor(currentVal);
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        if (isFloat) {
                            counter.innerText = target.toFixed(1);
                        } else {
                            counter.innerText = target;
                        }
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Project filtering logic
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projCards = document.querySelectorAll('.proj-card');

    if (filterBtns.length === 0 || projCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Copy contact details to clipboard with toast notification
function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${label} copied to clipboard!`);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Theme Toggle & Mode Switcher Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    updateThemeToggleIcon();

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon();
    });
}

function updateThemeToggleIcon() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const icon = toggleBtn.querySelector('i');
    if (icon) {
        if (currentTheme === 'light') {
            icon.className = 'fa-solid fa-moon';
            toggleBtn.setAttribute('title', 'Switch to Dark Mode');
        } else {
            icon.className = 'fa-solid fa-sun';
            toggleBtn.setAttribute('title', 'Switch to Light Mode');
        }
    }
}

// Side dots navigation & scroll snap tracking
function initScrollSnapDots() {
    const snapContainer = document.getElementById('snap-container');
    const dots = document.querySelectorAll('.scroll-dot');
    const sections = document.querySelectorAll('.snap-section');

    if (dots.length === 0 || sections.length === 0) return;

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const observerOptions = {
        root: snapContainer || null,
        threshold: 0.4
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                dots.forEach(dot => {
                    if (dot.getAttribute('data-target') === id) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}


