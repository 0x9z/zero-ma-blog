// Zero Blog - Fetch Medium Posts via RSS

'use strict';

class BlogApp {
    constructor() {
        this.mediumRSS = 'https://medium.com/feed/@0x9z';
        this.apiURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(this.mediumRSS)}&cache=${Date.now()}`;
        this.init();
    }

    init() {
        this.removeLoadingScreen();
        this.setupEventListeners();
        this.initializeTheme();
        this.fetchPosts();
    }

    removeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.remove(), 500);
            }, 1000);
        }
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile nav toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Back to top
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('zero-theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('zero-theme', theme);
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    async fetchPosts() {
        try {
            const response = await fetch(this.apiURL);
            const data = await response.json();
            
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                this.renderPosts(data.items);
            } else {
                this.showError();
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            this.showError();
        }
    }

    renderPosts(posts) {
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;

        // Clear skeleton
        blogGrid.innerHTML = '';

        posts.forEach(post => {
            const card = this.createPostCard(post);
            blogGrid.appendChild(card);
        });
    }

    createPostCard(post) {
        const card = document.createElement('article');
        card.className = 'blog-card';

        // Extract thumbnail
        const thumbnail = this.extractThumbnail(post);

        // Extract excerpt
        const excerpt = this.extractExcerpt(post);

        // Format date
        const formattedDate = this.formatDate(post.pubDate);

        // Determine category from title or content
        const category = this.determineCategory(post);

        card.innerHTML = `
            <div class="blog-card-thumbnail">
                ${thumbnail ? `<img src="${thumbnail}" alt="${post.title}" loading="lazy">` : `<div class="no-image"><i class="fas fa-file-alt"></i></div>`}
            </div>
            <div class="blog-card-content">
                <span class="blog-card-category">${category}</span>
                <h2 class="blog-card-title">${post.title}</h2>
                <p class="blog-card-excerpt">${excerpt}</p>
                <div class="blog-card-meta">
                    <span class="blog-card-date">
                        <i class="far fa-calendar"></i>
                        ${formattedDate}
                    </span>
                    <span class="blog-card-read">
                        Read More
                        <i class="fas fa-arrow-right"></i>
                    </span>
                </div>
            </div>
        `;

        // Make entire card clickable
        card.addEventListener('click', () => {
            window.open(post.link, '_blank', 'noopener,noreferrer');
        });
        card.style.cursor = 'pointer';

        return card;
    }

    extractThumbnail(post) {
        // Try to get thumbnail from description
        const imgRegex = /<img[^>]+src="([^">]+)"/;
        const match = post.description.match(imgRegex);
        
        if (match && match[1]) {
            return match[1];
        }
        
        // Try thumbnail field
        if (post.thumbnail) {
            return post.thumbnail;
        }
        
        return null;
    }

    extractExcerpt(post) {
        // Remove HTML tags
        const plainText = post.description
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
        
        // Truncate
        return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    determineCategory(post) {
        const title = post.title.toLowerCase();
        const content = post.description.toLowerCase();
        
        if (title.includes('linux') || content.includes('linux')) return 'Linux';
        if (title.includes('ccna') || title.includes('cisco') || content.includes('ccna') || content.includes('cisco')) return 'Networking';
        if (title.includes('bash') || title.includes('shell') || content.includes('bash') || content.includes('shell')) return 'Shell Scripting';
        if (title.includes('python') || content.includes('python')) return 'Programming';
        if (title.includes('security') || title.includes('cyber') || content.includes('security')) return 'Cybersecurity';
        if (title.includes('docker') || content.includes('docker')) return 'DevOps';
        if (title.includes('firefox') || title.includes('terminal')) return 'Linux';
        
        return 'IT';
    }

    showError() {
        const blogGrid = document.getElementById('blog-grid');
        const blogError = document.getElementById('blog-error');
        
        if (blogGrid) blogGrid.style.display = 'none';
        if (blogError) blogError.style.display = 'block';
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BlogApp());
} else {
    new BlogApp();
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered');
            })
            .catch(error => {
                console.log('SW registration failed');
            });
    });
}
