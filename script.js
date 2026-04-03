// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if(mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        if(navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenu.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });
}

// Scroll Sequence Logic for Galleries
document.querySelectorAll('.scroll-sequence').forEach(sequence => {
    const container = sequence.querySelector('.carousel-container');
    const track = sequence.querySelector('.carousel-track');
    if (!track) return;
    
    const slides = Array.from(track.children);
    const dotsContainer = sequence.querySelector('.carousel-nav');
    let dots = dotsContainer ? Array.from(dotsContainer.children) : [];
    
    // Skip all sticky-scroll sequence logic on mobile, opting for native CSS layout instead
    if (window.innerWidth <= 992) {
        sequence.style.height = 'auto'; // ensure it does not expand to multiple screens height
        slides.forEach(slide => slide.classList.add('active')); // enable all natively
        return; 
    }

    // Set sequence height based on number of slides (100vh per slide)
    sequence.style.height = `${slides.length * 100}vh`;

    function updateScrollSequence() {
        const rect = sequence.getBoundingClientRect();
        const sequenceTop = rect.top;
        const sequenceHeight = rect.height;
        const viewportHeight = window.innerHeight;

        const scrollRange = sequenceHeight - viewportHeight;
        
        if (scrollRange <= 0) return;

        let scrolled = -sequenceTop;
        let progress = scrolled / scrollRange;
        progress = Math.max(0, Math.min(1, progress));
        
        let activeIndex = Math.min(Math.floor(progress * slides.length), slides.length - 1);

        // Update slides classes
        slides.forEach((slide, index) => {
            if (index === activeIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update dots
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    // Add scroll listener
    window.addEventListener('scroll', updateScrollSequence, { passive: true });
    
    // Dot click functionality
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const scrollRange = sequence.offsetHeight - window.innerHeight;
                // Add a small offset so it's safely within the target slide's range
                const targetScroll = sequence.offsetTop + ((index + 0.5) / slides.length) * scrollRange;
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            });
        });
    }

    // Initial call
    updateScrollSequence();
});


// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Mobile: Tap to show/hide plant labels
if (window.innerWidth <= 992) {
    document.querySelectorAll('.carousel-slide').forEach(slide => {
        slide.addEventListener('click', (e) => {
            // Don't toggle if tapping a link or button
            if (e.target.closest('a') || e.target.closest('button')) return;
            
            // Toggle labels on this slide
            slide.classList.toggle('label-visible');
        });
    });
}

// Form submission handler using Formsubmit for actual email delivery
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = document.querySelector('.submit-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.8';
    
    const formData = new FormData(form);

    fetch("https://formsubmit.co/ajax/exerevnomyspace@gmail.com", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        btn.textContent = 'Message Sent! 🌿';
        btn.style.background = 'var(--primary-green)';
        form.reset(); // clear form
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = ''; // restore gradient
            btn.style.opacity = '1';
        }, 3000);
    })
    .catch(error => {
        console.error("Form submission error:", error);
        btn.textContent = 'Error Sending';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.opacity = '1';
        }, 3000);
    });
});
