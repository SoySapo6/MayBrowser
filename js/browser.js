// Browser functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const urlForm = document.getElementById('urlForm');
    const urlInput = document.getElementById('urlInput');
    const browserFrame = document.getElementById('browserFrame');
    const backButton = document.getElementById('backButton');
    const forwardButton = document.getElementById('forwardButton');
    const refreshButton = document.getElementById('refreshButton');
    const homeButton = document.getElementById('homeButton');
    const menuButton = document.getElementById('menuButton');
    const menuPanel = document.getElementById('menuPanel');
    const closeMenuPanel = document.getElementById('closeMenuPanel');
    const toggleSoundButton = document.getElementById('toggleSoundButton');
    
    // Browser history management
    let browserHistory = [];
    let currentHistoryIndex = -1;
    
    // Initialize browser
    function initializeBrowser() {
        // Set initial URL (Google)
        navigateToUrl('https://www.google.com');
        
        // Update UI state
        updateButtonStates();
        
        // Play startup sound
        SoundEffects.playStartup();
    }
    
    // Navigation functions
    function navigateToUrl(url) {
        // Check if URL has a protocol, if not add https://
        if (!/^https?:\/\//i.test(url)) {
            // Check if it's a valid domain pattern
            if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(url)) {
                url = 'https://' + url;
            } else {
                // If not a valid URL, treat as a Google search
                url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            }
        }
        
        try {
            // Update iframe src
            browserFrame.src = url;
            
            // Add to history (trim if going back and then navigating to a new page)
            if (currentHistoryIndex < browserHistory.length - 1) {
                browserHistory = browserHistory.slice(0, currentHistoryIndex + 1);
            }
            
            browserHistory.push(url);
            currentHistoryIndex = browserHistory.length - 1;
            
            // Update URL input
            urlInput.value = url;
            
            // Update navigation button states
            updateButtonStates();
            
            // Play navigation sound
            SoundEffects.playNavigation();
            
        } catch (error) {
            console.error('Navigation error:', error);
            SoundEffects.playError();
        }
    }
    
    function goBack() {
        if (currentHistoryIndex > 0) {
            currentHistoryIndex--;
            browserFrame.src = browserHistory[currentHistoryIndex];
            urlInput.value = browserHistory[currentHistoryIndex];
            
            updateButtonStates();
            SoundEffects.playClick();
        } else {
            SoundEffects.playError();
        }
    }
    
    function goForward() {
        if (currentHistoryIndex < browserHistory.length - 1) {
            currentHistoryIndex++;
            browserFrame.src = browserHistory[currentHistoryIndex];
            urlInput.value = browserHistory[currentHistoryIndex];
            
            updateButtonStates();
            SoundEffects.playClick();
        } else {
            SoundEffects.playError();
        }
    }
    
    function refreshPage() {
        browserFrame.src = browserFrame.src;
        SoundEffects.playClick();
    }
    
    function goHome() {
        navigateToUrl('https://www.google.com');
    }
    
    function updateButtonStates() {
        // Enable/disable back button
        if (currentHistoryIndex > 0) {
            backButton.classList.remove('disabled');
            backButton.disabled = false;
        } else {
            backButton.classList.add('disabled');
            backButton.disabled = true;
        }
        
        // Enable/disable forward button
        if (currentHistoryIndex < browserHistory.length - 1) {
            forwardButton.classList.remove('disabled');
            forwardButton.disabled = false;
        } else {
            forwardButton.classList.add('disabled');
            forwardButton.disabled = true;
        }
    }
    
    // Menu functions
    function toggleMenu() {
        if (menuPanel.style.display === 'none' || menuPanel.style.display === '') {
            menuPanel.style.display = 'flex';
            SoundEffects.playOpen();
        } else {
            menuPanel.style.display = 'none';
            SoundEffects.playClose();
        }
    }
    
    // Event Listeners
    urlForm.addEventListener('submit', (e) => {
        e.preventDefault();
        navigateToUrl(urlInput.value);
    });
    
    backButton.addEventListener('click', goBack);
    forwardButton.addEventListener('click', goForward);
    refreshButton.addEventListener('click', refreshPage);
    homeButton.addEventListener('click', goHome);
    menuButton.addEventListener('click', toggleMenu);
    closeMenuPanel.addEventListener('click', toggleMenu);
    
    toggleSoundButton.addEventListener('click', () => {
        SoundEffects.toggleMute();
        
        // Update icon based on mute state
        const icon = toggleSoundButton.querySelector('i');
        if (SoundEffects.isMuted()) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
            toggleSoundButton.querySelector('span').textContent = 'Unmute Sounds';
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            toggleSoundButton.querySelector('span').textContent = 'Mute Sounds';
            SoundEffects.playClick();
        }
    });
    
    // Browser frame load event for updating URL
    browserFrame.addEventListener('load', () => {
        try {
            urlInput.value = browserFrame.contentWindow.location.href;
        } catch (e) {
            // Security restrictions may prevent accessing the iframe URL
            console.log('Could not access iframe URL due to security restrictions');
        }
    });
    
    // Create animated stars in the background
    function createStars() {
        const starsContainer = document.querySelector('.stars');
        const starCount = window.innerWidth < 768 ? 50 : 100;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 3}px`;
            star.style.height = star.style.width;
            star.style.animationDelay = `${Math.random() * 2}s`;
            starsContainer.appendChild(star);
        }
    }
    
    // Initialize the browser
    initializeBrowser();
    createStars();
});
