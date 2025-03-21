document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email-address').value;
        const password = document.getElementById('password').value;
        
        if (window.app.login(email, password)) {
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials. Please try again.\n\nHint: Use admin@edoms.com / admin123');
        }
    });
});