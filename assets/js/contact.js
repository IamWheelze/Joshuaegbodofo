// Contact Form Handling with FormSpree

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Validate form before submitting to FormSpree
            if (!validateContactForm()) {
                e.preventDefault();
                alert('Please fill in all required fields correctly.');
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Store a copy in localStorage for demo purposes
            try {
                const formData = new FormData(contactForm);
                const contactData = {};

                for (let [key, value] of formData.entries()) {
                    if (!key.startsWith('_')) {
                        contactData[key] = value;
                    }
                }

                contactData.submittedAt = new Date().toISOString();

                const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                messages.push(contactData);
                localStorage.setItem('contactMessages', JSON.stringify(messages));
            } catch (error) {
                console.log('LocalStorage save failed (this is okay):', error);
            }

            // Let form submit naturally to FormSpree
        });

        // Handle FormSpree success redirect
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            alert('Thank you for your message! We will get back to you within 24-48 hours.');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});

function validateContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        // Skip honeypot
        if (input.name === '_gotcha') return;

        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff4444';

            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('small');
                errorMsg.className = 'error-message';
                errorMsg.style.color = '#ff4444';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.style.display = 'block';
                errorMsg.style.marginTop = '0.25rem';
                errorMsg.textContent = 'This field is required';
                input.parentNode.appendChild(errorMsg);
            }
        } else {
            input.style.borderColor = '';
            const errorMsg = input.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        }
    });

    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            emailInput.style.borderColor = '#ff4444';

            if (!emailInput.nextElementSibling || !emailInput.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('small');
                errorMsg.className = 'error-message';
                errorMsg.style.color = '#ff4444';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.style.display = 'block';
                errorMsg.style.marginTop = '0.25rem';
                errorMsg.textContent = 'Please enter a valid email address';
                emailInput.parentNode.appendChild(errorMsg);
            }
        }
    }

    return isValid;
}

// Clear errors on input
document.addEventListener('input', function(e) {
    if (e.target.closest('#contactForm')) {
        e.target.style.borderColor = '';
        const errorMsg = e.target.parentNode.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }
});
