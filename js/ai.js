// Gemini AI Integration
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const aiButton = document.getElementById('aiButton');
    const aiPanel = document.getElementById('aiPanel');
    const closeAiPanel = document.getElementById('closeAiPanel');
    const aiForm = document.getElementById('aiForm');
    const aiInput = document.getElementById('aiInput');
    const aiMessages = document.getElementById('aiMessages');
    
    // API configuration
    const GEMINI_API_KEY = 'AIzaSyCYWNbM2ZgdDSp9NlFxTgp0Wtwaaw7dyRc'; // Clave API
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
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
    
    // Send a query to Gemini AI
    async function sendToGemini(query) {
        try {
            // Show loading indicator
            addMessage('Pensando...');
            
            // Play AI thinking sound
            SoundEffects.playProcessing();
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: query
                    }]
                }]
            };
            
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Remove loading message
            aiMessages.removeChild(aiMessages.lastChild);
            
            let aiResponse = '';
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                aiResponse = data.candidates[0].content.parts[0].text;
            } else {
                aiResponse = "Lo siento, no pude procesar tu solicitud.";
            }
            
            // Add AI response
            addMessage(aiResponse);
            
            // Play AI response sound
            SoundEffects.playSuccess();
            
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            
            // Remove loading message
            if (aiMessages.lastChild && aiMessages.lastChild.textContent === 'Pensando...') {
                aiMessages.removeChild(aiMessages.lastChild);
            }
            
            // Show error message
            addMessage("Lo siento, encontré un error al procesar tu solicitud. Por favor intenta más tarde.");
            
            // Play error sound
            SoundEffects.playError();
        }
    }
    
    // Handle user input form submission
    aiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const query = aiInput.value.trim();
        if (!query) return;
        
        // Add user message
        addMessage(query, true);
        
        // Clear input
        aiInput.value = '';
        
        // Send to Gemini
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
    
    // Update AI panel position on resize
    window.addEventListener('resize', updateAiPanelPosition);
    
    // Initialize AI panel position
    updateAiPanelPosition();
});
