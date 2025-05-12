// Gemini AI Integration
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const aiButton = document.getElementById('aiButton');
    const aiPanel = document.getElementById('aiPanel');
    const closeAiPanel = document.getElementById('closeAiPanel');
    const aiForm = document.getElementById('aiForm');
    const aiInput = document.getElementById('aiInput');
    const aiMessages = document.getElementById('aiMessages');

    // Toggle AI Panel
    function toggleAiPanel() {
        if (aiPanel.style.display === 'none' || aiPanel.style.display === '') {
            aiPanel.style.display = 'flex';
            SoundEffects.playOpen();
            aiInput.focus();
        } else {
            aiPanel.style.display = 'none';
            SoundEffects.playClose();
        }
    }

    // Add a message to the AI chat
    function addMessage(content, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('ai-message');

        if (isUser) {
            messageElement.classList.add('user');
        }

        const messageText = document.createElement('p');
        messageText.textContent = content;
        messageElement.appendChild(messageText);

        aiMessages.appendChild(messageElement);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    // Send a query to the API
    async function sendToGemini(query) {
        try {
            addMessage('Pensando...');
            SoundEffects.playProcessing();

            const response = await fetch(`https://nightapioficial.onrender.com/api/gemini?message=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            aiMessages.removeChild(aiMessages.lastChild);

            const aiResponse = data.result || "Lo siento, no pude procesar tu solicitud.";
            addMessage(aiResponse);

            SoundEffects.playSuccess();

        } catch (error) {
            console.error('Error calling Gemini API:', error);

            if (aiMessages.lastChild && aiMessages.lastChild.textContent === 'Pensando...') {
                aiMessages.removeChild(aiMessages.lastChild);
            }

            addMessage("Lo siento, encontré un error al procesar tu solicitud. Por favor intenta más tarde.");
            SoundEffects.playError();
        }
    }

    // Handle user input form submission
    aiForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const query = aiInput.value.trim();
        if (!query) return;

        addMessage(query, true);
        aiInput.value = '';

        await sendToGemini(query);
    });

    // Event listeners
    aiButton.addEventListener('click', toggleAiPanel);
    closeAiPanel.addEventListener('click', toggleAiPanel);

    // Responsive behavior for AI panel
    function updateAiPanelPosition() {
        if (window.innerWidth <= 768) {
            aiPanel.style.width = '90%';
            aiPanel.style.left = '5%';
            aiPanel.style.right = '5%';
        } else {
            aiPanel.style.width = '350px';
            aiPanel.style.left = 'auto';
            aiPanel.style.right = '20px';
        }
    }

    window.addEventListener('resize', updateAiPanelPosition);
    updateAiPanelPosition();
});
