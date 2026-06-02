const chatform = document.getElementById('chat-form');
const userinput = document.getElementById('user-input');
const chathistory = document.getElementById('chat-history');
const typingindicator = document.getElementById('typing-indicator');

let messages = [];

chatform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userinput.value.trim();
    if (!text) return;
    //adiciona mensagem do usuário
    addMessage(text, 'user');
    userinput.value = '';
    userinput.disabled = true;
    typingindicator.style.display = 'block';
    //adiciona ao historico para enviar ao back
    messages.push({role: 'user', content: text});

    try {
        const response = await fetch('http://127.0.0.1:5000/api/generate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({prompt: text, messages})
        });
        const data = await response.json();
        if (data.code === 400) {
            addMessage('Você precisa inserir mais de 5 caracteres.', 'bot')
        } else if (data.code === 200) {
            addMessage(data.generated_text, 'bot');
            messages.push({role: 'assistant', content: data.generated_text});
        } else {
            addMessage('Erro ao obter sua resposta. Tente novamente.', 'bot');
        }
    } catch (error) {
        addMessage('Erro de conexão com o servidor. Tente novamente.', 'bot');
    } finally {
        userinput.disabled = false;
        userinput.focus();
        typingindicator.style.display = 'none';
    }
});

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    msgDiv.textContent = text;
    chathistory.appendChild(msgDiv);
    chathistory.scrollTop = chathistory.scrollHeight;
}

//permitir o envio com enter
userinput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        chatform.dispatchEvent(new Event('submit'));
        e.preventDefault();
    }
});