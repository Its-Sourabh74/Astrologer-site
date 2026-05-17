// ==================== DOM ELEMENTS ==================== //

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Testimonials Carousel
const testimonialsTrack = document.getElementById('testimonialsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');

// FAQ
const faqQuestions = document.querySelectorAll('.faq-question');

// ==================== NAVBAR FUNCTIONALITY ==================== //

// Sticky navbar with blur effect on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ==================== TESTIMONIALS CAROUSEL ==================== //

class TestimonialsCarousel {
    constructor(trackElement, prevBtn, nextBtn, dotsContainer) {
        this.track = trackElement;
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
        this.dotsContainer = dotsContainer;
        this.currentIndex = 0;
        this.itemsPerView = this.getItemsPerView();
        this.autoSlideInterval = null;

        this.init();
    }

    init() {
        this.createDots();
        this.attachEventListeners();
        this.startAutoSlide();
        window.addEventListener('resize', () => this.handleResize());
    }

    getItemsPerView() {
        if (window.innerWidth <= 767) return 1;
        if (window.innerWidth <= 1023) return 2;
        return 3;
    }

    handleResize() {
        const newItemsPerView = this.getItemsPerView();
        if (newItemsPerView !== this.itemsPerView) {
            this.itemsPerView = newItemsPerView;
            this.currentIndex = 0;
            this.updateCarousel();
            this.createDots();
        }
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        const totalSlides = document.querySelectorAll('.testimonial-slide').length;
        const dotsCount = Math.ceil(totalSlides / this.itemsPerView);

        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.track.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.track.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    nextSlide() {
        const totalSlides = document.querySelectorAll('.testimonial-slide').length;
        const maxIndex = Math.ceil(totalSlides / this.itemsPerView) - 1;
        
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateCarousel();
    }

    prevSlide() {
        const totalSlides = document.querySelectorAll('.testimonial-slide').length;
        const maxIndex = Math.ceil(totalSlides / this.itemsPerView) - 1;

        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = maxIndex;
        }
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const offset = this.currentIndex * 100;
        this.track.style.transform = `translateX(-${offset}%)`;

        // Update dots
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }
}

// Initialize carousel
const carousel = new TestimonialsCarousel(
    testimonialsTrack,
    prevBtn,
    nextBtn,
    carouselDots
);

// ==================== FAQ ACCORDION ==================== //

class FAQAccordion {
    constructor(questions) {
        this.questions = questions;
        this.init();
    }

    init() {
        this.questions.forEach(question => {
            question.addEventListener('click', () => this.toggleQuestion(question));
        });
    }

    toggleQuestion(question) {
        const isActive = question.classList.contains('active');
        
        // Close all other questions
        this.questions.forEach(q => {
            if (q !== question) {
                q.classList.remove('active');
                const answer = q.nextElementSibling;
                if (answer) {
                    answer.classList.remove('open');
                }
            }
        });

        // Toggle current question
        question.classList.toggle('active');
        const answer = question.nextElementSibling;
        if (answer) {
            answer.classList.toggle('open');
        }
    }
}

// Initialize FAQ
const faqAccordion = new FAQAccordion(faqQuestions);

// ==================== SMOOTH SCROLL BEHAVIOR ==================== //

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== SCROLL ANIMATIONS ==================== //

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('[class*="animate"]').forEach(el => {
    observer.observe(el);
});

// ==================== BUTTON INTERACTIONS ==================== //

// Apply ripple effect ONLY to action buttons (not navbar, hamburger, carousel, or FAQ)
const rippleButtons = document.querySelectorAll('.primary-btn, .secondary-btn, .service-cta');

rippleButtons.forEach(button => {
    button.addEventListener('mousedown', function(e) {
        // Don't create ripple if button is disabled
        if (this.disabled) return;

        // Create ripple effect
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Remove old ripple if it exists
        const oldRipple = this.querySelector('.ripple');
        if (oldRipple) {
            oldRipple.remove();
        }

        this.appendChild(ripple);

        // Remove ripple after animation completes (600ms)
        setTimeout(() => {
            if (ripple.parentElement) {
                ripple.remove();
            }
        }, 600);
    });
});

// ==================== FLOATING CARD ANIMATION ==================== //

const floatingCard = document.getElementById('floatingCard');

if (floatingCard) {
    // Add hover effect listener
    floatingCard.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 30px 80px rgba(75, 93, 74, 0.15)';
    });

    floatingCard.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.12)';
    });
}

// ==================== SERVICE CARDS HOVER ==================== //

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 25px 60px rgba(143, 165, 142, 0.15)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
    });
});

// ==================== PARALLAX EFFECT ==================== //

window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.hero-image');
    
    parallaxElements.forEach(element => {
        const scrollPosition = window.scrollY;
        element.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    });
});

// ==================== FORM HANDLING ==================== //

const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('.newsletter-input');
        
        if (emailInput.value) {
            // Simulate form submission
            const button = newsletterForm.querySelector('.newsletter-btn');
            const originalText = button.textContent;
            button.textContent = 'Subscribed!';
            button.disabled = true;

            setTimeout(() => {
                emailInput.value = '';
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }
    });
}

// ==================== GALLERY HOVER EFFECT ==================== //

const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.querySelector('.gallery-svg').style.transform = 'scale(1.08)';
    });

    item.addEventListener('mouseleave', function() {
        this.querySelector('.gallery-svg').style.transform = 'scale(1)';
    });
});

// ==================== ACTIVE LINK DETECTION ==================== //

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ==================== UTILITIES ==================== //

// Smooth scroll to top on page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Prevent multiple rapid form submissions
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Log page loaded
console.log('✨ Welcome to Divinepraise - Transformative Spiritual Counseling');

// ==================== MODAL/POPUP HANDLERS ==================== //

// CTA button handlers
const ctaButtons = document.querySelectorAll('.primary-btn, .secondary-btn, .cta-button');

ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Show alert for demo purposes
        // In a real application, this would open a booking modal or redirect to booking page
        const buttonText = this.textContent.trim();
        
        if (buttonText.includes('Book') || buttonText.includes('Start') || buttonText.includes('Schedule') || buttonText.includes('Join')) {
            e.preventDefault();
            showNotification('Thank you for your interest! A booking form would appear here.');
        }
    });
});

// Simple notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #8FA58E;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(75, 93, 74, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-size: 0.95rem;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== PERFORMANCE OPTIMIZATION ==================== //

// Lazy load images (if needed in future)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== ACCESSIBILITY ==================== //

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ==================== PAGE LIFECYCLE ==================== //

document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Divinepraise website loaded successfully');
    
    // Initialize animations
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'running';
    });
});

// Page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        carousel.stopAutoSlide();
    } else {
        carousel.startAutoSlide();
    }
});
