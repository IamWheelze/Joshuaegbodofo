// Contact Form Handling

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(contactForm);
            const contactData = {};

            for (let [key, value] of formData.entries()) {
                contactData[key] = value;
            }

            // Add timestamp
            contactData.submittedAt = new Date().toISOString();

            // Submit contact message
            submitContactMessage(contactData);
        });
    }
});

function submitContactMessage(data) {
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Store in localStorage as a demo
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(data);
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        // Show success message
        alert('Thank you for your message! We will get back to you within 24-48 hours.');

        // Reset form
        document.getElementById('contactForm').reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}
