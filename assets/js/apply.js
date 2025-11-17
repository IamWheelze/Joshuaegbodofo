// Application Form Handling

document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('applicationForm');

    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            if (!validateForm('applicationForm')) {
                alert('Please fill in all required fields correctly.');
                return;
            }

            // Collect form data
            const formData = new FormData(applicationForm);
            const applicationData = {};

            for (let [key, value] of formData.entries()) {
                applicationData[key] = value;
            }

            // Add timestamp
            applicationData.submittedAt = new Date().toISOString();

            // Here you would typically send this to your backend
            // For now, we'll simulate a successful submission
            submitApplication(applicationData);
        });
    }
});

function submitApplication(data) {
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Store in localStorage as a demo
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        applications.push(data);
        localStorage.setItem('applications', JSON.stringify(applications));

        // Show success message
        alert('Thank you for your application! We will review it and get back to you within 5-7 business days.');

        // Reset form
        document.getElementById('applicationForm').reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Optionally redirect to home page
        // window.location.href = '../index.html';
    }, 1500);
}

// Form validation helper (extends main.js)
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '';
        }
    });

    // Email validation
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailRegex.test(input.value)) {
            isValid = false;
            input.style.borderColor = '#ff4444';
        }
    });

    return isValid;
}
