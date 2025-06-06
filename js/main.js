// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

if (hamburger && navLinks && navbar) {
    // Toggle mobile menu
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navbar.contains(e.target);
        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Sticky navbar on scroll
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Add shadow to navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .contact-card, .hero-image, .hero-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const sendAnotherBtn = document.getElementById('sendAnother');
    const submitBtn = contactForm?.querySelector('.btn-submit');

    if (!contactForm) return;

    // Form validation
    function validateField(field, isSubmit = false) {
        const value = field.value.trim();
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        let isValid = true;

        // Clear previous states
        formGroup.classList.remove('error', 'success');
        errorMessage.textContent = '';

        // Skip validation for empty fields on blur (unless submitting)
        if (!isSubmit && !field.required && !value) {
            return true;
        }

        // Check required fields
        if (field.required && !value) {
            errorMessage.textContent = 'This field is required';
            formGroup.classList.add('error');
            isValid = false;
        } 
        // Validate email format
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage.textContent = 'Please enter a valid email address';
                formGroup.classList.add('error');
                isValid = false;
            } else {
                formGroup.classList.add('success');
            }
        } else if (value) {
            formGroup.classList.add('success');
        }
        
        return isValid;
    }

    // Add input event listeners for real-time validation
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        // Validate on blur
        field.addEventListener('blur', () => validateField(field));
        
        // Add input event for real-time feedback
        field.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                const formGroup = e.target.closest('.form-group');
                formGroup.classList.remove('success', 'error');
                formGroup.querySelector('.error-message').textContent = '';
            } else {
                validateField(e.target);
            }
        });
    });
    
    // For select elements, only validate on change
    contactForm.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => validateField(select));
    });

    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        const firstInvalidField = null;
        
        // Reset all fields and validate
        formFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('error', 'success');
                const errorMessage = formGroup.querySelector('.error-message');
                if (errorMessage) errorMessage.textContent = '';
            }
            
            // Validate field with isSubmit flag
            if (!validateField(field, true)) {
                isFormValid = false;
                // Track first invalid field
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });

        if (!isFormValid) {
            // Scroll to first error with smooth animation
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
                
                // Add focus to the first invalid field
                setTimeout(() => {
                    firstInvalidField.focus({ preventScroll: true });
                    
                    // Add shake animation to the invalid field
                    const formGroup = firstInvalidField.closest('.form-group');
                    if (formGroup) {
                        formGroup.classList.remove('shake');
                        // Trigger reflow
                        void formGroup.offsetWidth;
                        formGroup.classList.add('shake');
                        
                        // Remove animation class after it completes
                        setTimeout(() => {
                            formGroup.classList.remove('shake');
                        }, 500);
                    }
                }, 500);
            }
            
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Add loading class to form
        contactForm.classList.add('loading');
        
        // Disable all form fields during submission
        formFields.forEach(field => {
            field.disabled = true;
            field.setAttribute('aria-disabled', 'true');
        });
        
        // Add loading indicator to the submit button if not already present
        let spinner = submitBtn.querySelector('.spinner');
        if (!spinner) {
            spinner = document.createElement('span');
            spinner.className = 'spinner';
            submitBtn.appendChild(spinner);
        }

        try {
            // Simulate API call (replace with actual form submission)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message with animation
            contactForm.style.opacity = '0';
            contactForm.style.transform = 'translateY(10px)';
            
            // Wait for fade out animation
            await new Promise(resolve => setTimeout(resolve, 300));
            
            contactForm.style.display = 'none';
            formSuccess.classList.add('visible');
            
            // Reset form
            contactForm.reset();
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'form-error-message';
            errorMessage.innerHTML = `
                <div class="error-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="error-content">
                    <h4>Something went wrong</h4>
                    <p>There was an error submitting the form. Please try again later.</p>
                </div>
            `;
            
            contactForm.insertBefore(errorMessage, contactForm.firstChild);
            
            // Scroll to error message
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                errorMessage.style.opacity = '0';
                setTimeout(() => {
                    errorMessage.remove();
                }, 300);
            }, 5000);
            
        } finally {
            // Remove loading state with a small delay for smooth transition
            setTimeout(() => {
                contactForm.classList.remove('loading');
                
                // Re-enable form fields
                formFields.forEach(field => {
                    field.disabled = false;
                    field.removeAttribute('aria-disabled');
                });
                
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Reset form state if needed
                if (contactForm.style.display === 'none') {
                    contactForm.style.opacity = '1';
                    contactForm.style.transform = 'translateY(0)';
                }
            }, 300); // Match this with the CSS transition duration
        }
    });

    // Handle "Send Another" button
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', () => {
            formSuccess.classList.remove('visible');
            contactForm.style.display = 'block';
            // Scroll to form
            contactForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Set initial styles for animation
window.addEventListener('load', () => {
    const elements = document.querySelectorAll('.feature-card, .contact-card, .hero-image, .hero-content');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Trigger initial animation
    setTimeout(animateOnScroll, 100);
});

// Add animation on scroll
window.addEventListener('scroll', animateOnScroll);
