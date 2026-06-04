const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const menuIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;


const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');
const typingIndicator = document.getElementById('typing-indicator');
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-links-mobile');

let messages = [];

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    userInput.disabled = true;
    typingIndicator.style.display = 'block';

    messages.push({ role: 'user', content: text });

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: text, messages })
        });
        const data = await response.json();

        if (data.generated_text) {
            addMessage(data.generated_text, 'bot');
            messages.push({ role: 'assistant', content: data.generated_text });
        } else {
            addMessage(data.error, 'bot');
        }
    } catch (error) {
        addMessage('Erro de conexão com o servidor. Tente novamente.', 'bot');
        console.error('Chat API error:', error);
    } finally {
        userInput.disabled = false;
        userInput.focus();
        typingIndicator.style.display = 'none';
    }
});

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    msgDiv.textContent = text;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        chatForm.dispatchEvent(new Event('submit'));
        e.preventDefault();
    }
});

themeToggle.addEventListener('click', async () => {
    document.body.classList.toggle('light-theme');
    updateThemeToggleIcon();
});

function updateThemeToggleIcon() {
    if (document.body.classList.contains('light-theme')) {
        themeToggle.innerHTML = sunIcon;
        themeToggle.setAttribute('aria-label', 'Alternar para tema escuro');
    } else {
        themeToggle.innerHTML = moonIcon;
        themeToggle.setAttribute('aria-label', 'Alternar para tema claro');
    }
}

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    if (navLinks.classList.contains('active')) {
        menuToggle.innerHTML = closeIcon;
        menuToggle.setAttribute('aria-label', 'Fechar menu de navegação');
    } else {
        menuToggle.innerHTML = menuIcon;
        menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    }
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = menuIcon;
            menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    updateThemeToggleIcon();
});