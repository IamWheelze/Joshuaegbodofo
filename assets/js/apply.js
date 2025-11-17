// Application Form Handling with FormSpree

document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('applicationForm');

    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            // Validate form before submitting to FormSpree
            if (!validateForm('applicationForm')) {
                e.preventDefault();
                alert('Please fill in all required fields correctly.');
                return;
            }

            // Show loading state
            const submitButton = document.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            // Also store a copy in localStorage for demo purposes
            // (The real data goes to FormSpree)
            try {
                const formData = new FormData(applicationForm);
                const applicationData = {};

                for (let [key, value] of formData.entries()) {
                    // Skip FormSpree internal fields
                    if (!key.startsWith('_')) {
                        applicationData[key] = value;
                    }
                }

                applicationData.submittedAt = new Date().toISOString();

                const applications = JSON.parse(localStorage.getItem('applications') || '[]');
                applications.push(applicationData);
                localStorage.setItem('applications', JSON.stringify(applications));
            } catch (error) {
                console.log('LocalStorage save failed (this is okay):', error);
            }

            // Let the form submit naturally to FormSpree
            // FormSpree will handle the submission and show a confirmation page
        });

        // Handle FormSpree success redirect
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            // Show success message if redirected back from FormSpree
            alert('Thank you for your application! We will review it and get back to you within 5-7 business days.');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});

// Form validation helper
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        // Skip hidden honeypot fields
        if (input.name === '_gotcha') return;

        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff4444';

            // Add error message if not exists
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('small');
                errorMsg.className = 'error-message';
                errorMsg.style.color = '#ff4444';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.style.marginTop = '0.25rem';
                errorMsg.textContent = 'This field is required';
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
        } else {
            input.style.borderColor = '';

            // Remove error message if exists
            if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                input.nextElementSibling.remove();
            }
        }
    });

    // Email validation
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailRegex.test(input.value)) {
            isValid = false;
            input.style.borderColor = '#ff4444';

            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('small');
                errorMsg.className = 'error-message';
                errorMsg.style.color = '#ff4444';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.style.marginTop = '0.25rem';
                errorMsg.textContent = 'Please enter a valid email address';
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
        }
    });

    // Scroll to first error if form is invalid
    if (!isValid) {
        const firstError = form.querySelector('input[style*="border-color: rgb(255, 68, 68)"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    return isValid;
}

// Clear error on input
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('form-input') ||
        e.target.classList.contains('form-textarea') ||
        e.target.classList.contains('form-select')) {
        e.target.style.borderColor = '';
        if (e.target.nextElementSibling && e.target.nextElementSibling.classList.contains('error-message')) {
            e.target.nextElementSibling.remove();
        }
    }
});
