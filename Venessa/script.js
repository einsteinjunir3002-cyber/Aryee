// ===================================
// BIRTHDAY WEBSITE MAIN SCRIPT
// Interactive Features & Animations
// ===================================

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeWebsite();
});

function initializeWebsite() {
    // Detect device type and optimize
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = () => (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    
    // Store device info globally
    window.deviceInfo = {
        isMobile: isMobile || isTouch(),
        isLowPowerMode: navigator.deviceMemory ? navigator.deviceMemory <= 4 : false,
        isSlowConnection: navigator.connection ? navigator.connection.effectiveType === '4g' || navigator.connection.effectiveType === '3g' : false
    };
    
    // Apply mobile optimizations
    if (window.deviceInfo.isMobile) {
        document.documentElement.classList.add('mobile-device');
        optimizeForMobile();
    }
    
    // Hide loading screen after 3.5 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        
        loadingScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
    }, 3500);

    // Initialize all features
    setupMobileTouchOptimizations();
    setupParticles();
    setupHero();
    setupScrollAnimations();
    setupGallery();
    setupAudio();
    setupScrollToTop();
    setupCelebration();
    addScrollSpy();
    setupViewportHeightFix();
}

// ========== MOBILE OPTIMIZATIONS ==========
function optimizeForMobile() {
    // Disable animations on low-power devices
    if (window.deviceInfo.isLowPowerMode) {
        document.documentElement.style.setProperty('--epic', '0.2s');
        document.documentElement.style.setProperty('--slow', '0.2s');
        document.documentElement.style.setProperty('--smooth', '0.15s');
    }
    
    // Reduce particle effects on mobile
    if (window.deviceInfo.isMobile) {
        document.documentElement.style.setProperty('--particle-count', '3');
    }
    
    // Prevent tap delay and improve responsiveness
    document.addEventListener('touchstart', () => {}, { passive: true });
}

function setupMobileTouchOptimizations() {
    // Add touch feedback to interactive elements
    const buttons = document.querySelectorAll('button, .holographic-button, .neo-button, .gallery-card-2035');
    
    buttons.forEach(btn => {
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        btn.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Add touch visual feedback
        btn.addEventListener('touchstart', (e) => {
            btn.style.transform = btn.style.transform || 'scale(1)';
            btn.style.opacity = '0.8';
        });
        
        btn.addEventListener('touchend', () => {
            btn.style.opacity = '1';
        });
    });
    
    // Improve modal touch handling
    const modal = document.getElementById('imageModal');
    if (modal) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        modal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - next image
                    showNextImage();
                } else {
                    // Swiped right - previous image
                    showPreviousImage();
                }
            }
        }
    }
}

function setupViewportHeightFix() {
    // Fix viewport height on mobile (handles address bar hide/show)
    const updateViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateViewportHeight, 100);
    });
}

// ========== PARTICLE SYSTEM ==========
function setupParticles() {
    const container = document.getElementById('particlesContainer');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 6 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 5;
        const delay = Math.random() * 2;
        
        // Random gradient colors
        const gradients = [
            'linear-gradient(135deg, #00d4ff, #9d4edd)',
            'linear-gradient(135deg, #ff1493, #ffd700)',
            'linear-gradient(135deg, #ff69b4, #00d4ff)',
            'linear-gradient(135deg, #9d4edd, #ff1493)'
        ];
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.background = gradients[Math.floor(Math.random() * gradients.length)];
        particle.style.animation = `particleFloat ${duration}s ease-in-out ${delay}s`;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 ${size}px rgba(0, 212, 255, 0.6)`;
        
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), (duration + delay) * 1000);
    }
    
    // Reduce particle frequency on mobile
    const particleInterval = window.deviceInfo?.isMobile ? 1500 : 800;
    
    // Create particles periodically
    const interval = setInterval(createParticle, particleInterval);
    
    // Cleanup on page visibility change (save battery on mobile)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(interval);
        }
    });
}

// ========== FLOATING HEARTS ==========
function createFloatingHeart() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;
    
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = '❤️';
    
    const left = Math.random() * 90 + 5;
    const duration = Math.random() * 2 + 3;
    
    heart.style.left = left + '%';
    heart.style.bottom = '0%';
    heart.style.animation = `heartFloat ${duration}s ease-in infinite`;
    heart.style.animationDelay = Math.random() * 1 + 's';
    
    container.appendChild(heart);
    
    setTimeout(() => heart.remove(), duration * 1000);
}

// Start creating hearts on scroll
function startHeartAnimation() {
    const heartInterval = setInterval(createFloatingHeart, 600);
    
    // Stop after a while to not overwhelm
    setTimeout(() => clearInterval(heartInterval), 10000);
}

// ========== HERO SECTION SETUP ==========
function setupHero() {
    const beginBtn = document.getElementById('beginBtn');
    
    if (beginBtn) {
        beginBtn.addEventListener('click', () => {
            // Scroll to story section
            const storySection = document.getElementById('storySection');
            if (storySection) {
                storySection.scrollIntoView({ behavior: 'smooth' });
                startHeartAnimation();
            }
        });
    }
}

// ========== SCROLL ANIMATIONS ==========
function setupScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ========== GALLERY SETUP ==========
function setupGallery() {
    loadImages();
    setupImageModal();
}

function loadImages() {
    const galleryContainer = document.getElementById('galleryContainer');
    
    // Create image cards for all images in the images folder
    // The images will be auto-detected by the JavaScript
    const imageNames = [];
    
    // Fetch image list (this will require server support for production)
    // For now, we'll create a method to allow manual image addition
    
    // Create a placeholder that explains how to add images
    createImageCards();
}

function createImageCards() {
    const galleryContainer = document.getElementById('galleryContainer');
    
    // This function will be called after images are loaded
    // For development, we'll create sample cards
    
    // We'll use a fetch to get the images from the root folder
    // For a static site, images need to be manually added to the HTML
    // But we've set up the structure for auto-loading
    
    // Dynamic loading for images (requires server)
    fetch('./')
        .then(response => response.text())
        .then(html => {
            // This only works with directory listing enabled
            parseImageList(html, galleryContainer);
        })
        .catch(() => {
            // Fallback: display message about adding images
            displayImagePlaceholders(galleryContainer);
        });
}

function parseImageList(html, container) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const imageRegex = /href=["']([^"']+)["']/g;
    let match;
    let imageCount = 0;
    
    while ((match = imageRegex.exec(html)) !== null) {
        const filename = match[1];
        const isImage = imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
        
        if (isImage && !filename.includes('..')) {
            createImageCard(container, `${filename}`, imageCount);
            imageCount++;
        }
    }
}

function displayImagePlaceholders(container) {
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #b0b0b0;">
            <p style="font-size: 1.1rem; margin-bottom: 10px;">📁 Images Folder Empty</p>
            <p style="font-size: 0.9rem;">Add your images to the "images" folder to display them here!</p>
        </div>
    `;
}

function createImageCard(container, imagePath, index) {
    const card = document.createElement('div');
    card.classList.add('gallery-card');
    card.style.animationDelay = (index * 0.1) + 's';
    
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = `Memory ${index + 1}`;
    img.onerror = function() {
        card.style.display = 'none';
    };
    
    card.appendChild(img);
    
    card.addEventListener('click', () => {
        openImageModal(imagePath, index);
    });
    
    container.appendChild(card);
}

// ========== IMAGE MODAL ==========
function setupImageModal() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (closeBtn) closeBtn.addEventListener('click', closeImageModal);
    if (prevBtn) prevBtn.addEventListener('click', showPreviousImage);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    
    // Close on background click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeImageModal();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal && !modal.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') showPreviousImage();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'Escape') closeImageModal();
        }
    });
}

let currentImageIndex = 0;
let allImages = [];

function openImageModal(imagePath, index) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    currentImageIndex = index;
    allImages = Array.from(document.querySelectorAll('.gallery-card img')).map(img => img.src);
    
    modalImage.src = imagePath;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function showNextImage() {
    if (allImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    document.getElementById('modalImage').src = allImages[currentImageIndex];
}

function showPreviousImage() {
    if (allImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    document.getElementById('modalImage').src = allImages[currentImageIndex];
}

// ========== AUDIO CONTROL ==========
function setupAudio() {
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    if (musicToggle && backgroundMusic) {
        // Set initial volume
        backgroundMusic.volume = 0.3;
        
        // Start playing immediately
        backgroundMusic.play().catch(err => {
            console.log('Autoplay failed, may need user interaction:', err);
            // On some browsers, autoplay is blocked until user interacts
            document.addEventListener('click', () => {
                if (backgroundMusic.paused) {
                    backgroundMusic.play().catch(e => console.log('Play failed:', e));
                }
            }, { once: true });
        });
        
        musicToggle.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(err => console.log('Audio play failed:', err));
                musicToggle.classList.add('playing');
                musicToggle.textContent = '🔊 Playing';
            } else {
                backgroundMusic.pause();
                musicToggle.classList.remove('playing');
                musicToggle.textContent = '🔇 Muted';
            }
        });
    }
}

// ========== SCROLL TO TOP BUTTON ==========
function setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== CELEBRATION SETUP ==========
function setupCelebration() {
    const replayBtn = document.getElementById('replayBtn');
    const canvas = document.getElementById('confettiCanvas');
    
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Initialize confetti when celebration section is viewed
    setupConfetti(canvas);
    setupFireworks();
}

// ========== CONFETTI ANIMATION ==========
function setupConfetti(canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    
    // Reduce confetti count on mobile
    const maxConfetti = window.deviceInfo?.isMobile ? 20 : 100;
    
    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = Math.random() * 3 + 2;
            this.rotation = Math.random() * Math.PI * 2;
            this.angularVelocity = (Math.random() - 0.5) * 0.2;
            this.width = Math.random() * 8 + 4;
            this.height = Math.random() * 8 + 4;
            
            const colors = ['#ff1493', '#9d4edd', '#00d4ff', '#ffd700', '#ff69b4'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.1; // Gravity
            this.rotation += this.angularVelocity;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
        
        isOffScreen() {
            return this.y > canvas.height;
        }
    }
    
    function createConfetti() {
        for (let i = 0; i < 5 && confettiPieces.length < maxConfetti; i++) {
            confettiPieces.push(new ConfettiPiece());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = confettiPieces.length - 1; i >= 0; i--) {
            confettiPieces[i].update();
            confettiPieces[i].draw();
            
            if (confettiPieces[i].isOffScreen()) {
                confettiPieces.splice(i, 1);
            }
        }
        
        if (confettiPieces.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    // Trigger confetti when celebration section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Create confetti burst multiple times (less frequent on mobile)
                const burstCount = window.deviceInfo?.isMobile ? 10 : 20;
                const burstDelay = window.deviceInfo?.isMobile ? 300 : 200;
                
                for (let i = 0; i < burstCount; i++) {
                    setTimeout(() => createConfetti(), i * burstDelay);
                }
                animate();
            }
        });
    }, { threshold: 0.3 });
    
    const celebrationSection = document.getElementById('celebrationSection');
    if (celebrationSection) {
        observer.observe(celebrationSection);
    }
    
    // Handle window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, 250);
    });
}

// ========== FIREWORKS ANIMATION ==========
function setupFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    if (!fireworksContainer) return;
    
    function createFirework() {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        
        const hue = Math.random() * 60 - 30; // Pink to Purple range
        const saturation = 100;
        const lightness = 50;
        
        firework.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        firework.style.boxShadow = `0 0 ${Math.random() * 10 + 10}px hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        const angle = (Math.random() * Math.PI * 2);
        const velocity = Math.random() * 200 + 100;
        
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        firework.style.setProperty('--tx', tx + 'px');
        firework.style.setProperty('--ty', ty + 'px');
        
        fireworksContainer.appendChild(firework);
        
        setTimeout(() => firework.remove(), 1000);
    }
    
    // Trigger fireworks when celebration section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                for (let i = 0; i < 30; i++) {
                    setTimeout(() => createFirework(), i * 80);
                }
            }
        });
    }, { threshold: 0.3 });
    
    const celebrationSection = document.getElementById('celebrationSection');
    if (celebrationSection) {
        observer.observe(celebrationSection);
    }
}

// ========== SCROLL SPY & ANIMATIONS ==========
function addScrollSpy() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation when section comes into view
                entry.target.style.animation = 'fadeIn 0.8s ease';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => observer.observe(section));
}

// ========== SMOOTH SCROLL FOR BUTTONS ==========
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.scroll) {
        const targetId = e.target.dataset.scroll;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ========== TYPING EFFECT FOR POEM ==========
function addTypingEffect() {
    const poemLines = document.querySelectorAll('.poem-line');
    poemLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '0';
        
        setTimeout(() => {
            let charIndex = 0;
            line.style.opacity = '1';
            
            function typeChar() {
                if (charIndex < text.length) {
                    line.textContent += text[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 20);
                }
            }
            typeChar();
        }, index * 400);
    });
}

// ========== PARALLAX EFFECT ==========
function setupParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const parallaxElements = document.querySelectorAll('.animated-background');
                
                parallaxElements.forEach(el => {
                    el.style.backgroundPosition = `0% ${scrolled * 0.5}px`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Call parallax setup
setupParallax();

// ========== EASTER EGGS ==========
function setupEasterEggs() {
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        
        if (key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                triggerSpecialEffect();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function triggerSpecialEffect() {
        // Rainbow hearts everywhere!
        const container = document.body;
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = '💜';
                heart.style.position = 'fixed';
                heart.style.left = Math.random() * 100 + '%';
                heart.style.top = Math.random() * 100 + '%';
                heart.style.fontSize = Math.random() * 30 + 20 + 'px';
                heart.style.animation = 'heartFloat 4s ease-in forwards';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '9998';
                container.appendChild(heart);
                
                setTimeout(() => heart.remove(), 4000);
            }, i * 100);
        }
    }
}

setupEasterEggs();

// ========== UTILITY FUNCTIONS ==========
function getRandomValue(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Add smooth scrolling behavior
function smoothScroll(duration) {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

smoothScroll(300);

// ========== PERFORMANCE OPTIMIZATION ==========
// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Handle window resize efficiently
window.addEventListener('resize', debounce(() => {
    // Update any calculations needed on resize
}, 250));

// ========== ANALYTICS & TRACKING ==========
// Log when sections come into view
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page hidden
    } else {
        // Page visible
    }
});

// ========== CONSOLE EASTER EGG ==========
console.log('%c🎉 Happy Birthday Venessa! 🎉', 'color: #ff1493; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00d4ff;');
console.log('%cThank you for being amazing! ❤️', 'color: #9d4edd; font-size: 16px; font-weight: bold;');
console.log('%cThis website was created with love and CSS magic ✨', 'color: #00d4ff; font-size: 14px; font-style: italic;');
