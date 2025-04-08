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
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const quickLinks = document.querySelectorAll('.quick-link');
    const bookmarksButton = document.getElementById('bookmarksButton');
    const historyButton = document.getElementById('historyButton');
    const settingsButton = document.getElementById('settingsButton');
    const aboutButton = document.getElementById('aboutButton');
    
    // Browser history management
    let browserHistory = [];
    let currentHistoryIndex = -1;
    
    // Initialize browser
    function initializeBrowser() {
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
            // Since we can't use iframe for direct navigation, show a message
            showBrowserContent(url);
            
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
            showErrorMessage("No se pudo navegar a la URL especificada");
        }
    }
    
    function showBrowserContent(url) {
        // Clear current content
        browserFrame.innerHTML = '';
        
        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'browser-content-display';
        contentContainer.style.padding = '20px';
        contentContainer.style.height = '100%';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.color = 'white';
        
        // Display message about navigation
        const messageElem = document.createElement('div');
        messageElem.style.textAlign = 'center';
        messageElem.style.marginTop = '50px';
        
        const iconElem = document.createElement('i');
        iconElem.className = 'fas fa-globe';
        iconElem.style.fontSize = '4rem';
        iconElem.style.color = 'var(--accent-color)';
        iconElem.style.marginBottom = '20px';
        messageElem.appendChild(iconElem);
        
        const headingElem = document.createElement('h2');
        headingElem.textContent = 'Navegación Simulada';
        headingElem.style.marginBottom = '20px';
        headingElem.style.color = 'var(--text-color)';
        messageElem.appendChild(headingElem);
        
        const urlElem = document.createElement('div');
        urlElem.textContent = url;
        urlElem.style.fontSize = '1.2rem';
        urlElem.style.padding = '10px';
        urlElem.style.background = 'rgba(0,0,0,0.2)';
        urlElem.style.borderRadius = '5px';
        urlElem.style.marginBottom = '20px';
        urlElem.style.wordBreak = 'break-all';
        messageElem.appendChild(urlElem);
        
        const infoElem = document.createElement('p');
        infoElem.textContent = 'En un entorno real, este navegador abriría la página web solicitada. Por limitaciones técnicas, estamos simulando la navegación.';
        infoElem.style.maxWidth = '600px';
        infoElem.style.margin = '0 auto';
        infoElem.style.lineHeight = '1.6';
        messageElem.appendChild(infoElem);
        
        contentContainer.appendChild(messageElem);
        browserFrame.appendChild(contentContainer);
    }
    
    function showErrorMessage(message) {
        // Clear current content
        browserFrame.innerHTML = '';
        
        // Create error container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'browser-error-display';
        errorContainer.style.padding = '20px';
        errorContainer.style.height = '100%';
        errorContainer.style.display = 'flex';
        errorContainer.style.flexDirection = 'column';
        errorContainer.style.alignItems = 'center';
        errorContainer.style.justifyContent = 'center';
        
        const iconElem = document.createElement('i');
        iconElem.className = 'fas fa-exclamation-triangle';
        iconElem.style.fontSize = '4rem';
        iconElem.style.color = 'var(--secondary-color)';
        iconElem.style.marginBottom = '20px';
        errorContainer.appendChild(iconElem);
        
        const messageElem = document.createElement('h2');
        messageElem.textContent = message;
        messageElem.style.marginBottom = '20px';
        messageElem.style.color = 'var(--text-color)';
        messageElem.style.textAlign = 'center';
        errorContainer.appendChild(messageElem);
        
        browserFrame.appendChild(errorContainer);
    }
    
    function goBack() {
        if (currentHistoryIndex > 0) {
            currentHistoryIndex--;
            showBrowserContent(browserHistory[currentHistoryIndex]);
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
            showBrowserContent(browserHistory[currentHistoryIndex]);
            urlInput.value = browserHistory[currentHistoryIndex];
            
            updateButtonStates();
            SoundEffects.playClick();
        } else {
            SoundEffects.playError();
        }
    }
    
    function refreshPage() {
        if (browserHistory.length > 0) {
            showBrowserContent(browserHistory[currentHistoryIndex]);
            SoundEffects.playClick();
        } else {
            SoundEffects.playError();
        }
    }
    
    function goHome() {
        // Show the default browser content
        browserFrame.innerHTML = '';
        const defaultContent = document.createElement('div');
        defaultContent.className = 'browser-default-content';
        
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        const heading = document.createElement('h2');
        heading.textContent = 'MayBrowser';
        searchContainer.appendChild(heading);
        
        const searchBox = document.createElement('div');
        searchBox.className = 'search-box';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'searchInput';
        input.placeholder = 'Buscar en Google o escribir URL';
        searchBox.appendChild(input);
        
        const button = document.createElement('button');
        button.id = 'searchButton';
        const icon = document.createElement('i');
        icon.className = 'fas fa-search';
        button.appendChild(icon);
        searchBox.appendChild(button);
        
        searchContainer.appendChild(searchBox);
        
        const quickLinks = document.createElement('div');
        quickLinks.className = 'quick-links';
        
        const sites = [
            { url: 'https://www.youtube.com', icon: 'fab fa-youtube', name: 'YouTube' },
            { url: 'https://www.facebook.com', icon: 'fab fa-facebook', name: 'Facebook' },
            { url: 'https://www.twitter.com', icon: 'fab fa-twitter', name: 'Twitter' },
            { url: 'https://www.instagram.com', icon: 'fab fa-instagram', name: 'Instagram' }
        ];
        
        sites.forEach(site => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'quick-link';
            link.dataset.url = site.url;
            
            const linkIcon = document.createElement('i');
            linkIcon.className = site.icon;
            link.appendChild(linkIcon);
            
            const span = document.createElement('span');
            span.textContent = site.name;
            link.appendChild(span);
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToUrl(site.url);
            });
            
            quickLinks.appendChild(link);
        });
        
        searchContainer.appendChild(quickLinks);
        defaultContent.appendChild(searchContainer);
        browserFrame.appendChild(defaultContent);
        
        // Reset URL input
        urlInput.value = '';
        
        // Attach event listeners to new search input and button
        const newSearchInput = document.getElementById('searchInput');
        const newSearchButton = document.getElementById('searchButton');
        
        if (newSearchInput && newSearchButton) {
            newSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    navigateToUrl(newSearchInput.value);
                }
            });
            
            newSearchButton.addEventListener('click', () => {
                if (newSearchInput.value) {
                    navigateToUrl(newSearchInput.value);
                }
            });
        }
        
        // Update history if needed
        if (browserHistory.length === 0 || browserHistory[currentHistoryIndex] !== 'home') {
            if (currentHistoryIndex < browserHistory.length - 1) {
                browserHistory = browserHistory.slice(0, currentHistoryIndex + 1);
            }
            browserHistory.push('home');
            currentHistoryIndex = browserHistory.length - 1;
        }
        
        updateButtonStates();
        SoundEffects.playNavigation();
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
    
    // Bookmark functions
    function showBookmarks() {
        // For now just show a message
        showInfoMessage("Bookmarks", "Esta función estará disponible próximamente.");
        SoundEffects.playClick();
    }
    
    // History functions
    function showHistory() {
        // Create a temporary history display
        browserFrame.innerHTML = '';
        
        const historyContainer = document.createElement('div');
        historyContainer.className = 'history-container';
        historyContainer.style.padding = '30px';
        historyContainer.style.height = '100%';
        historyContainer.style.overflowY = 'auto';
        
        const historyHeader = document.createElement('h2');
        historyHeader.textContent = 'Historial de Navegación';
        historyHeader.style.marginBottom = '30px';
        historyHeader.style.textAlign = 'center';
        historyHeader.style.color = 'var(--accent-color)';
        historyContainer.appendChild(historyHeader);
        
        if (browserHistory.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No hay historial de navegación';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = 'var(--text-secondary)';
            historyContainer.appendChild(emptyMessage);
        } else {
            const historyList = document.createElement('div');
            historyList.className = 'history-list';
            
            [...browserHistory].reverse().forEach((url, index) => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.style.padding = '15px';
                historyItem.style.marginBottom = '10px';
                historyItem.style.borderRadius = '10px';
                historyItem.style.backgroundColor = 'rgba(42, 42, 64, 0.6)';
                historyItem.style.cursor = 'pointer';
                historyItem.style.transition = 'all 0.2s ease';
                
                historyItem.innerHTML = `<i class="fas fa-history" style="margin-right: 10px; color: var(--accent-color);"></i> ${url === 'home' ? 'MayBrowser Home' : url}`;
                
                historyItem.addEventListener('mouseover', () => {
                    historyItem.style.backgroundColor = 'rgba(62, 62, 84, 0.6)';
                });
                
                historyItem.addEventListener('mouseout', () => {
                    historyItem.style.backgroundColor = 'rgba(42, 42, 64, 0.6)';
                });
                
                historyItem.addEventListener('click', () => {
                    if (url === 'home') {
                        goHome();
                    } else {
                        navigateToUrl(url);
                    }
                });
                
                historyList.appendChild(historyItem);
            });
            
            historyContainer.appendChild(historyList);
        }
        
        // Add a back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Volver';
        backButton.style.display = 'block';
        backButton.style.margin = '30px auto 0';
        backButton.style.padding = '10px 20px';
        backButton.style.backgroundColor = 'var(--primary-color)';
        backButton.style.border = 'none';
        backButton.style.borderRadius = '5px';
        backButton.style.cursor = 'pointer';
        backButton.style.transition = 'all 0.2s ease';
        
        backButton.addEventListener('mouseover', () => {
            backButton.style.backgroundColor = 'var(--button-hover)';
        });
        
        backButton.addEventListener('mouseout', () => {
            backButton.style.backgroundColor = 'var(--primary-color)';
        });
        
        backButton.addEventListener('click', () => {
            if (currentHistoryIndex >= 0) {
                const currentUrl = browserHistory[currentHistoryIndex];
                if (currentUrl === 'home') {
                    goHome();
                } else {
                    showBrowserContent(currentUrl);
                }
            } else {
                goHome();
            }
        });
        
        historyContainer.appendChild(backButton);
        browserFrame.appendChild(historyContainer);
        
        SoundEffects.playClick();
    }
    
    // Settings functions
    function showSettings() {
        // For now just show a message
        showInfoMessage("Configuración", "Esta función estará disponible próximamente.");
        SoundEffects.playClick();
    }
    
    // About functions
    function showAbout() {
        browserFrame.innerHTML = '';
        
        const aboutContainer = document.createElement('div');
        aboutContainer.className = 'about-container';
        aboutContainer.style.padding = '30px';
        aboutContainer.style.height = '100%';
        aboutContainer.style.overflowY = 'auto';
        aboutContainer.style.textAlign = 'center';
        
        const logoContainer = document.createElement('div');
        logoContainer.style.marginBottom = '30px';
        
        const logoIcon = document.createElement('div');
        logoIcon.innerHTML = `<svg class="browser-icon" viewBox="0 0 24 24" width="120" height="120">
            <use href="assets/browser-icon.svg#icon"></use>
        </svg>`;
        logoContainer.appendChild(logoIcon);
        
        const logoText = document.createElement('h1');
        logoText.textContent = 'MayBrowser';
        logoText.style.fontSize = '2.5rem';
        logoText.style.background = 'linear-gradient(to right, var(--primary-color), var(--accent-color))';
        logoText.style.webkitBackgroundClip = 'text';
        logoText.style.backgroundClip = 'text';
        logoText.style.color = 'transparent';
        logoText.style.textShadow = '0 0 10px rgba(0, 238, 255, 0.3)';
        logoContainer.appendChild(logoText);
        
        aboutContainer.appendChild(logoContainer);
        
        const versionInfo = document.createElement('p');
        versionInfo.textContent = 'Versión 1.0.0';
        versionInfo.style.fontSize = '1.2rem';
        versionInfo.style.marginBottom = '30px';
        versionInfo.style.color = 'var(--text-secondary)';
        aboutContainer.appendChild(versionInfo);
        
        const description = document.createElement('div');
        description.className = 'about-description';
        description.style.maxWidth = '700px';
        description.style.margin = '0 auto 40px';
        description.style.backgroundColor = 'rgba(42, 42, 64, 0.6)';
        description.style.padding = '25px';
        description.style.borderRadius = '15px';
        
        const descriptionText = document.createElement('p');
        descriptionText.textContent = 'MayBrowser es un navegador web con temática gaming diseñado para ofrecer una experiencia de navegación única con un ambiente nocturno con estrellas y luna. Cuenta con integración de IA Gemini para asistencia en la navegación.';
        descriptionText.style.lineHeight = '1.6';
        descriptionText.style.marginBottom = '20px';
        description.appendChild(descriptionText);
        
        const features = document.createElement('div');
        features.innerHTML = `
            <h3 style="margin-bottom: 15px; color: var(--accent-color);">Características</h3>
            <ul style="list-style: none; text-align: left; padding: 0;">
                <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                    <i class="fas fa-check" style="color: var(--accent-color); position: absolute; left: 0;"></i>
                    Interfaz de usuario con tema nocturno
                </li>
                <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                    <i class="fas fa-check" style="color: var(--accent-color); position: absolute; left: 0;"></i>
                    Efectos de sonido durante la navegación
                </li>
                <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                    <i class="fas fa-check" style="color: var(--accent-color); position: absolute; left: 0;"></i>
                    Asistente IA Gemini integrado
                </li>
                <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                    <i class="fas fa-check" style="color: var(--accent-color); position: absolute; left: 0;"></i>
                    Diseño responsive para todos los dispositivos
                </li>
            </ul>
        `;
        description.appendChild(features);
        
        aboutContainer.appendChild(description);
        
        // Add a back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Volver';
        backButton.style.display = 'block';
        backButton.style.margin = '0 auto';
        backButton.style.padding = '10px 20px';
        backButton.style.backgroundColor = 'var(--primary-color)';
        backButton.style.border = 'none';
        backButton.style.borderRadius = '5px';
        backButton.style.cursor = 'pointer';
        backButton.style.transition = 'all 0.2s ease';
        
        backButton.addEventListener('mouseover', () => {
            backButton.style.backgroundColor = 'var(--button-hover)';
        });
        
        backButton.addEventListener('mouseout', () => {
            backButton.style.backgroundColor = 'var(--primary-color)';
        });
        
        backButton.addEventListener('click', () => {
            if (currentHistoryIndex >= 0) {
                const currentUrl = browserHistory[currentHistoryIndex];
                if (currentUrl === 'home') {
                    goHome();
                } else {
                    showBrowserContent(currentUrl);
                }
            } else {
                goHome();
            }
        });
        
        aboutContainer.appendChild(backButton);
        browserFrame.appendChild(aboutContainer);
        
        SoundEffects.playClick();
    }
    
    function showInfoMessage(title, message) {
        browserFrame.innerHTML = '';
        
        const infoContainer = document.createElement('div');
        infoContainer.className = 'info-container';
        infoContainer.style.display = 'flex';
        infoContainer.style.flexDirection = 'column';
        infoContainer.style.alignItems = 'center';
        infoContainer.style.justifyContent = 'center';
        infoContainer.style.height = '100%';
        infoContainer.style.padding = '20px';
        
        const titleElem = document.createElement('h2');
        titleElem.textContent = title;
        titleElem.style.marginBottom = '20px';
        titleElem.style.color = 'var(--accent-color)';
        infoContainer.appendChild(titleElem);
        
        const messageElem = document.createElement('p');
        messageElem.textContent = message;
        messageElem.style.fontSize = '1.1rem';
        messageElem.style.marginBottom = '30px';
        messageElem.style.maxWidth = '600px';
        messageElem.style.textAlign = 'center';
        infoContainer.appendChild(messageElem);
        
        // Add a back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Volver';
        backButton.style.padding = '10px 20px';
        backButton.style.backgroundColor = 'var(--primary-color)';
        backButton.style.border = 'none';
        backButton.style.borderRadius = '5px';
        backButton.style.cursor = 'pointer';
        backButton.style.transition = 'all 0.2s ease';
        
        backButton.addEventListener('mouseover', () => {
            backButton.style.backgroundColor = 'var(--button-hover)';
        });
        
        backButton.addEventListener('mouseout', () => {
            backButton.style.backgroundColor = 'var(--primary-color)';
        });
        
        backButton.addEventListener('click', () => {
            if (currentHistoryIndex >= 0) {
                const currentUrl = browserHistory[currentHistoryIndex];
                if (currentUrl === 'home') {
                    goHome();
                } else {
                    showBrowserContent(currentUrl);
                }
            } else {
                goHome();
            }
        });
        
        infoContainer.appendChild(backButton);
        browserFrame.appendChild(infoContainer);
    }

    // Event Listeners for URL bar
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
    
    // Event listeners for search input on home page
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            if (searchInput && searchInput.value) {
                navigateToUrl(searchInput.value);
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value) {
                e.preventDefault();
                navigateToUrl(searchInput.value);
            }
        });
    }
    
    // Event listeners for quick links
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.getAttribute('data-url');
            if (url) {
                navigateToUrl(url);
            }
        });
    });
    
    // Menu item event listeners
    if (bookmarksButton) {
        bookmarksButton.addEventListener('click', () => {
            showBookmarks();
            toggleMenu(); // Close menu after selection
        });
    }
    
    if (historyButton) {
        historyButton.addEventListener('click', () => {
            showHistory();
            toggleMenu(); // Close menu after selection
        });
    }
    
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            showSettings();
            toggleMenu(); // Close menu after selection
        });
    }
    
    if (aboutButton) {
        aboutButton.addEventListener('click', () => {
            showAbout();
            toggleMenu(); // Close menu after selection
        });
    }
    
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
    
    // Go to home page by default
    goHome();
});
