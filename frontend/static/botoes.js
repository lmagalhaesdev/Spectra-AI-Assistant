//botão hamburguer para mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-links-mobile'); // Changed to getElementById

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // Toggle 'active' class
    menuToggle.innerHTML = navLinks.classList.contains('active') ? '✖' : '☰'; // Update icon based on class
});

//trocas de tema
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', async () => {
    document.body.classList.toggle('light-theme');
    // Troca ícone do botão
    themeToggle.innerHTML = document.body.classList.contains('light-theme') ? '☀️' : '🌙';

    // Determine the current theme
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';

    // Send theme preference to the backend
    try {
        const response = await fetch('/api/user/preferences', { // Hypothetical endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ theme: currentTheme }),
        });

        if (!response.ok) {
            console.error('Failed to save theme preference:', response.statusText);
        } else {
            console.log('Theme preference saved:', currentTheme);
        }
    } catch (error) {
        console.error('Network error while saving theme preference:', error);
    }
});

// Load theme preference from backend on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/user/preferences', { // Hypothetical endpoint
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data.theme) {
                if (data.theme === 'light') {
                    document.body.classList.add('light-theme');
                } else {
                    document.body.classList.remove('light-theme');
                }
                // Update theme toggle icon based on loaded theme
                themeToggle.innerHTML = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
                console.log('Theme preference loaded:', data.theme);
            }
        } else {
            console.warn('Could not load theme preference from backend:', response.statusText);
            // Default to dark theme if not found or error
            document.body.classList.remove('light-theme');
            themeToggle.innerHTML = '🌙';
        }
    } catch (error) {
        console.error('Network error while loading theme preference:', error);
        // Default to dark theme on network error
        document.body.classList.remove('light-theme');
        themeToggle.innerHTML = '🌙';
    }
});