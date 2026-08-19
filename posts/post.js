// Zero Blog - Auto Header/Footer Injector for Posts

document.addEventListener('DOMContentLoaded', function() {
    
    // Remove loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.remove(), 500);
        }, 500);
    }
    
    // Inject Navigation Header
    const headerHTML = `
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="https://blog.zero.ma" class="nav-brand">
                <span class="brand-icon">Z</span>
                <span class="brand-text">Zero</span>
            </a>
            <div class="nav-menu" id="nav-menu">
                <a href="https://zero.ma" class="nav-link">Home</a>
                <a href="https://blog.zero.ma" class="nav-link active">Blog</a>
                <a href="https://zero.ma/#skills" class="nav-link">Skills</a>
                <a href="https://zero.ma/#projects" class="nav-link">Projects</a>
                <a href="https://zero.ma/#contact" class="nav-link">Contact</a>
            </div>
            <div class="nav-controls">
                <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                    <i class="fas fa-moon"></i>
                </button>
                <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    
    // Inject Footer
    const footerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <span class="brand-icon">Z</span>
                    <span class="brand-text">Zero</span>
                </div>
                <p class="footer-text">I learn by doing — one command at a time.</p>
                <nav class="footer-links">
                    <a href="https://zero.ma">Home</a>
                    <a href="https://blog.zero.ma">Blog</a>
                    <a href="https://zero.ma/#contact">Contact</a>
                </nav>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Zero. All rights reserved.</p>
            </div>
        </div>
    </footer>
    <button class="back-to-top" id="back-to-top" aria-label="Back to top">
        <i class="fas fa-arrow-up"></i>
    </button>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('zero-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('zero-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Mobile nav toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Back to top
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});