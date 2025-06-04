document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                if (response.status === 200) {
                    // Replace form with thank you message
                    contactForm.innerHTML = `
                        <div class="text-center">
                            <h3 class="mb-4">Thank You!</h3>
                            <p class="lead mb-4">We've received your message and will get back to you soon.</p>
                        </div>
                    `;
                } else {
                    alert('Something went wrong. Please try again.');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Something went wrong. Please try again.');
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            });
        });
    }

    const fixedBar = document.querySelector('.fixed-bottom-bar');
    const contactSection = document.querySelector('#contact');

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                fixedBar.classList.add('hidden');
            } else {
                fixedBar.classList.remove('hidden');
            }
        },
        {
            root: null,
            threshold: 0.1 // When 10% of the contact section is visible
        }
    );

    if (contactSection) {
        observer.observe(contactSection);
    }
});

// Mobile Navigation
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 60) {
        // Scrolling down & past header - hide nav
        navbar.classList.add('nav-hidden');
    } else {
        // Scrolling up - show nav
        navbar.classList.remove('nav-hidden');
    }
    
    lastScrollTop = scrollTop;
});

// Mobile Benefits Accordion
document.querySelectorAll('.benefits-section .col-md-3').forEach(benefit => {
    const heading = benefit.querySelector('h4');
    
    heading.addEventListener('click', () => {
        // Close other open items
        document.querySelectorAll('.benefits-section .expanded').forEach(item => {
            if (item !== benefit) {
                item.classList.remove('expanded');
            }
        });
        
        // Toggle current item
        benefit.classList.toggle('expanded');
    });
});

// Hide CTA when contact form is visible
const heroButton = document.querySelector('.hero-section .btn-primary');

if (heroButton) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroButton.style.opacity = '0';
                heroButton.style.pointerEvents = 'none';
            } else {
                heroButton.style.opacity = '1';
                heroButton.style.pointerEvents = 'auto';
            }
        });
    }, {
        threshold: 0.1 // Start transition when 10% of contact section is visible
    });

    observer.observe(contactSection);
} 