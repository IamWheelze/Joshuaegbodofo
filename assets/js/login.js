// Login Authentication

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Demo authentication
        if (authenticateUser(email, password)) {
            // Redirect to dashboard
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials. Please try again.\n\nDemo credentials:\nMember: member@demo.com / password123\nMentor: mentor@demo.com / mentor123');
        }
    });
});

function authenticateUser(email, password) {
    // Demo users
    const users = {
        'member@demo.com': {
            password: 'password123',
            name: 'Demo Member',
            role: 'member',
            id: 1
        },
        'mentor@demo.com': {
            password: 'mentor123',
            name: 'Egbodofo Joshua',
            role: 'mentor',
            id: 2
        }
    };

    const user = users[email];

    if (user && user.password === password) {
        // Store user data
        const userData = {
            id: user.id,
            name: user.name,
            email: email,
            role: user.role
        };

        localStorage.setItem('wc_user', JSON.stringify(userData));

        // Redirect based on role
        if (user.role === 'mentor') {
            window.location.href = 'mentor.html';
            return false; // Prevent default redirect
        }

        return true;
    }

    return false;
}
