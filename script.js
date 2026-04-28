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

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');
const galleryTriggers = document.querySelectorAll('.lightbox-trigger');

if (lightbox && lightboxImg) {
    galleryTriggers.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            lightbox.style.display = 'flex';
            lightboxImg.src = this.src;
        });
    });

    closeBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target !== lightboxImg) {
            lightbox.style.display = 'none';
        }
    });
}



// Multi-step Form Logic
const formSteps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
const nextBtns = document.querySelectorAll('.next-btn');
const prevBtns = document.querySelectorAll('.prev-btn');

function updateFormSteps(stepNumber) {
    // Hide all steps
    formSteps.forEach(step => step.style.display = 'none');
    // Show target step
    document.getElementById(`step-${stepNumber}`).style.display = 'block';

    // Update progress bar
    progressSteps.forEach(p => {
        if (parseInt(p.getAttribute('data-step')) <= stepNumber) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
}

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Basic validation before next
        const currentStep = btn.closest('.form-step');
        const requiredFields = currentStep.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value) {
                field.style.borderColor = 'red';
                isValid = false;
            } else {
                field.style.borderColor = '#E2E8F0';
            }
        });

        if (isValid) {
            const nextStep = parseInt(btn.getAttribute('data-next'));
            updateFormSteps(nextStep);
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const prevStep = parseInt(btn.getAttribute('data-prev'));
        updateFormSteps(prevStep);
    });
});

// Form submission handler
const consultationForm = document.getElementById('consultation-form');
if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.querySelector('.submit-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.8';
        
        // Normally we would use fetch here, simulating success for now
        setTimeout(() => {
            btn.textContent = 'Request Sent! 🌿';
            btn.style.background = 'var(--primary-green)';
            document.getElementById('form-success').style.display = 'block';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = ''; 
                btn.style.opacity = '1';
                document.getElementById('form-success').style.display = 'none';
                consultationForm.reset();
                updateFormSteps(1); // Go back to step 1
            }, 3000);
        }, 1500);
    });
}

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

// Bottom Navigation active state logic
const allSections = document.querySelectorAll('header.hero, section');
const bottomNavItems = document.querySelectorAll('.bottom-nav-mobile .nav-item');

if (bottomNavItems.length > 0) {
    const navObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                let activeIndex = -1;

                if (entry.target.tagName.toLowerCase() === 'header' || id === 'about' || id === 'vision') {
                    activeIndex = 0; // Home
                } else if (id === 'projects' || id === 'process') {
                    activeIndex = 1; // Gallery
                } else if (id === 'journal') {
                    activeIndex = 2; // Journal
                } else if (id === 'contact') {
                    activeIndex = 3; // Consult
                }

                if (activeIndex !== -1) {
                    bottomNavItems.forEach((item, index) => {
                        if (index === activeIndex) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                }
            }
        });
    }, navObserverOptions);

    allSections.forEach(section => {
        navObserver.observe(section);
    });
}
