// Create animated particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll progress indicator
function updateScrollIndicator() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('scrollIndicator').style.width = scrollPercent + '%';
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});



// CV download functionality
class CVModal {
    constructor() {
        this.modal = null;
        this.cvPaths = {
            english: 'files/Namorgha_CV_EN.pdf',
            french: 'files/Namorgha_CV_FR.pdf'
        };
        this.init();
    }

    init() {
        document.getElementById('cvBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.show();
        });
    }

    show() {
        this.createModal();
        this.bindEvents();
        document.body.appendChild(this.modal);

        // Add smooth fade-in animation
        requestAnimationFrame(() => {
            this.modal.style.opacity = '1';
            this.modal.querySelector('.cv-modal__content').style.transform = 'translateY(0) scale(1)';
        });
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'cv-modal';
        this.modal.innerHTML = this.getModalHTML();
        this.addStyles();
    }

    getModalHTML() {
        return `
            <div class="cv-modal__overlay" data-action="close">
                <div class="cv-modal__content">
                    <div class="cv-modal__header">
                        <h2 class="cv-modal__title">Select CV Language</h2>
                        <button class="cv-modal__close" data-action="close" aria-label="Close modal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="cv-modal__body">
                        <div class="cv-modal__buttons">
                            <button class="cv-modal__btn cv-modal__btn--primary" data-lang="english">
                                <span class="cv-modal__btn-icon">🇺🇸</span>
                                <span class="cv-modal__btn-text">English</span>
                            </button>
                            <button class="cv-modal__btn cv-modal__btn--secondary" data-lang="french">
                                <span class="cv-modal__btn-icon">🇫🇷</span>
                                <span class="cv-modal__btn-text">Français</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Close modal events
        this.modal.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'close') {
                this.hide();
            }
        });

        // Language selection events
        this.modal.querySelectorAll('[data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.downloadCV(lang);
                this.hide();
            });
        });

        // Handle close button click
        const closeBtn = this.modal.querySelector('.cv-modal__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hide();
            });
        }

        // Escape key to close
        document.addEventListener('keydown', this.handleEscape.bind(this));
    }

    handleEscape(e) {
        if (e.key === 'Escape' && this.modal) {
            this.hide();
        }
    }

    downloadCV(language) {
        const path = this.cvPaths[language];
        if (path) {
            window.open(path, '_blank');
        }
    }

    hide() {
        if (!this.modal) return;

        this.modal.style.opacity = '0';
        this.modal.querySelector('.cv-modal__content').style.transform = 'translateY(-20px) scale(0.95)';

        setTimeout(() => {
            if (this.modal && this.modal.parentNode) {
                document.body.removeChild(this.modal);
            }
            this.modal = null;
            document.removeEventListener('keydown', this.handleEscape.bind(this));
        }, 300);
    }

    addStyles() {
        if (document.getElementById('cv-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'cv-modal-styles';
        styles.textContent = `
            .cv-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .cv-modal__overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }

            .cv-modal__content {
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                max-width: 400px;
                width: 100%;
                transform: translateY(-20px) scale(0.95);
                transition: transform 0.3s ease;
                overflow: hidden;
            }

            .cv-modal__header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.5rem 1.5rem 0 1.5rem;
                margin-bottom: 1rem;
            }

            .cv-modal__title {
                font-size: 1.25rem;
                font-weight: 600;
                color: #1f2937;
                margin: 0;
            }

            .cv-modal__close {
                background: none;
                border: none;
                padding: 0.5rem;
                cursor: pointer;
                border-radius: 6px;
                color: #6b7280;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .cv-modal__close:hover {
                background: #f3f4f6;
                color: #1f2937;
            }

            .cv-modal__body {
                padding: 0 1.5rem 1.5rem 1.5rem;
            }

            .cv-modal__buttons {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .cv-modal__btn {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 1.25rem;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
                width: 100%;
            }

            .cv-modal__btn--primary {
                background: #3b82f6;
                color: #ffffff;
            }

            .cv-modal__btn--primary:hover {
                background: #2563eb;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            }

            .cv-modal__btn--secondary {
                background: #10b981;
                color: #ffffff;
            }

            .cv-modal__btn--secondary:hover {
                background: #059669;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            }

            .cv-modal__btn-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            .cv-modal__btn-text {
                font-weight: 600;
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .cv-modal__content {
                    background: #1f2937;
                    color: #f9fafb;
                }

                .cv-modal__title {
                    color: #f9fafb;
                }

                .cv-modal__close {
                    color: #9ca3af;
                }

                .cv-modal__close:hover {
                    background: #374151;
                    color: #f9fafb;
                }
            }

            /* Mobile responsiveness */
            @media (max-width: 480px) {
                .cv-modal__content {
                    margin: 1rem;
                    max-width: none;
                }

                .cv-modal__header {
                    padding: 1rem 1rem 0 1rem;
                }

                .cv-modal__body {
                    padding: 0 1rem 1rem 1rem;
                }

                .cv-modal__btn {
                    padding: 0.875rem 1rem;
                    font-size: 0.9rem;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Initialize the CV modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CVModal();
});

// Alternative: If you prefer a simple function approach
function initCVModal() {
    const cvModal = new CVModal();
    return cvModal;
}

// Export for module usage (if needed)
// export { CVModal };

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.15)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.1)';
    }
    updateScrollIndicator();
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect after page load
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 150);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    window.addEventListener('load', initTypingEffect);
});