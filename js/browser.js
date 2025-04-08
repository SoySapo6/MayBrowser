// Browser.js - Main browser functionality for MayBrowser

// Browser state variables
let browserHistory = [];
let currentHistoryIndex = -1;
let browserFrame;
let urlInput;
let backButton;
let forwardButton;
let homeButton;
let refreshButton;
let menuPanel;
let browserContainer;

// Function to initialize browser functionality
function initializeBrowser() {
    console.log('Initializing MayBrowser...');
    
    // Get browser elements
    browserFrame = document.getElementById('browserContent');
    urlInput = document.getElementById('urlInput');
    backButton = document.getElementById('backButton');
    forwardButton = document.getElementById('forwardButton');
    homeButton = document.getElementById('homeButton');
    refreshButton = document.getElementById('refreshButton');
    menuButton = document.getElementById('menuButton');
    menuPanel = document.getElementById('menuPanel');
    browserContainer = document.getElementById('browserContainer');
    
    // Add event listeners
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            navigateToUrl(urlInput.value);
        }
    });
    
    // Browser control buttons
    backButton.addEventListener('click', goBack);
    forwardButton.addEventListener('click', goForward);
    homeButton.addEventListener('click', goHome);
    refreshButton.addEventListener('click', refreshPage);
    menuButton.addEventListener('click', toggleMenu);
    
    // Menu items
    document.getElementById('bookmarks').addEventListener('click', showBookmarks);
    document.getElementById('history').addEventListener('click', showHistory);
    document.getElementById('settings').addEventListener('click', showSettings);
    document.getElementById('about').addEventListener('click', showAbout);
    
    // Create stars background
    createStars();
    
    // Set initial button states
    updateButtonStates();
    
    // Show home screen
    goHome();
    
    // Play startup sound
    SoundEffects.playStartup();
    
    console.log('MayBrowser initialization complete');
}

// Function to handle navigation to a URL
function navigateToUrl(url) {
    // Empty URL, do nothing
    if (!url) return;
    
    // Add history if needed
    if (browserHistory.length === 0 || url !== browserHistory[currentHistoryIndex]) {
        // If we navigated back and then to a new page, truncate history
        if (currentHistoryIndex < browserHistory.length - 1) {
            browserHistory = browserHistory.slice(0, currentHistoryIndex + 1);
        }
        
        // Add new URL to history
        browserHistory.push(url);
        currentHistoryIndex = browserHistory.length - 1;
    }
    
    // Update URL input
    urlInput.value = url;
    
    // Show browser content
    showBrowserContent(url);
    
    // Update button states
    updateButtonStates();
}

// Function to create simulated content for static environment
function createSimulatedContent(url, iframe, loadingContainer) {
    // Set a timeout to simulate loading
    setTimeout(() => {
        // Remove loading indicator
        loadingContainer.style.display = 'none';
        
        // Parse hostname from URL
        let hostname = '';
        try {
            hostname = new URL(url).hostname;
        } catch (e) {
            hostname = url;
        }
        
        // Set iframe content with website simulation
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${hostname}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #181822;
                        color: #f0f0f0;
                    }
                    .site-container {
                        padding: 20px;
                        text-align: center;
                    }
                    .site-header {
                        margin-bottom: 30px;
                    }
                    .site-header h1 {
                        color: #00eeff;
                        margin-bottom: 10px;
                    }
                    .site-url {
                        background-color: rgba(42, 42, 64, 0.8);
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                        display: inline-block;
                    }
                    .preview-box {
                        background-color: rgba(42, 42, 64, 0.8);
                        border-radius: 10px;
                        padding: 20px;
                        margin-bottom: 30px;
                        text-align: left;
                    }
                    .preview-header {
                        background-color: #2a2a40;
                        padding: 10px;
                        border-radius: 5px 5px 0 0;
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                    }
                    .circle {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        display: inline-block;
                        margin-right: 5px;
                    }
                    .red { background-color: #FF5F57; }
                    .yellow { background-color: #FFBD2E; }
                    .green { background-color: #28CA41; }
                    .url-bar {
                        flex: 1;
                        background-color: #1e1e2e;
                        border-radius: 5px;
                        padding: 5px 10px;
                        margin: 0 10px;
                        font-size: 12px;
                        color: #aaa;
                    }
                    .content-preview {
                        padding: 15px;
                        min-height: 300px;
                        background-color: white;
                        color: #333;
                        border-radius: 0 0 5px 5px;
                    }
                    .preview-note {
                        background-color: rgba(255, 193, 7, 0.2);
                        border-radius: 5px;
                        padding: 15px;
                        margin-top: 20px;
                        text-align: center;
                    }
                    .back-button {
                        background-color: #7957f3;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background-color 0.2s;
                        margin-top: 20px;
                    }
                    .back-button:hover {
                        background-color: #9168ff;
                    }
                </style>
            </head>
            <body>
                <div class="site-container">
                    <div class="site-header">
                        <h1>Simulación de Navegación</h1>
                        <div class="site-url">${url}</div>
                    </div>
                    
                    <div class="preview-box">
                        <div class="preview-header">
                            <div class="circle red"></div>
                            <div class="circle yellow"></div>
                            <div class="circle green"></div>
                            <div class="url-bar">${url}</div>
                        </div>
                        <div class="content-preview">
                            ${getSimulatedContent(url, hostname)}
                        </div>
                    </div>
                    
                    <div class="preview-note">
                        <p><strong>Nota:</strong> MayBrowser está funcionando en modo de simulación para compatibilidad con hosts estáticos.
                        Se muestra una vista previa del sitio, pero la navegación completa no está disponible en este entorno.</p>
                    </div>
                    
                    <button class="back-button" onclick="window.parent.goHome()">Volver a la Página de Inicio</button>
                </div>
                
                <script>
                    // Notify parent when iframe content is fully loaded
                    window.onload = function() {
                        window.parent.postMessage('iframeLoaded', '*');
                    };
                </script>
            </body>
            </html>
        `);
        iframeDoc.close();
        
        // Play success sound
        SoundEffects.playNavigation();
    }, 1500); // Simulate loading time of 1.5 seconds
}

// Helper function to generate simulated content based on the website
function getSimulatedContent(url, hostname) {
    // Generate different content based on the hostname
    if (hostname.includes('youtube.com')) {
        return `
            <div style="text-align: center; padding-top: 30px;">
                <div style="width: 120px; height: 90px; margin: 0 auto; background-color: #FF0000; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 0; height: 0; border-style: solid; border-width: 15px 0 15px 30px; border-color: transparent transparent transparent #ffffff;"></div>
                </div>
                <h3 style="margin-top: 20px; font-size: 18px;">YouTube</h3>
                <p style="color: #666; font-size: 14px;">Contenido de video no disponible en vista previa</p>
            </div>
        `;
    } else if (hostname.includes('google.com')) {
        return `
            <div style="display: flex; justify-content: center; padding-top: 30px;">
                <div style="text-align: center;">
                    <div style="margin-bottom: 30px;">
                        <span style="color: #4285F4; font-size: 24px; font-weight: bold;">G</span>
                        <span style="color: #EA4335; font-size: 24px; font-weight: bold;">o</span>
                        <span style="color: #FBBC05; font-size: 24px; font-weight: bold;">o</span>
                        <span style="color: #4285F4; font-size: 24px; font-weight: bold;">g</span>
                        <span style="color: #34A853; font-size: 24px; font-weight: bold;">l</span>
                        <span style="color: #EA4335; font-size: 24px; font-weight: bold;">e</span>
                    </div>
                    <div style="width: 80%; max-width: 300px; margin: 0 auto; border: 1px solid #ddd; border-radius: 24px; padding: 10px 15px; text-align: left;">
                        <div style="display: flex; align-items: center;">
                            <div style="margin-right: 10px;">🔍</div>
                            <div style="color: #666; flex: 1;">Buscar en Google</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (hostname.includes('facebook.com')) {
        return `
            <div style="padding-top: 20px; background-color: #f0f2f5;">
                <div style="text-align: center; padding: 10px;">
                    <div style="color: #1877F2; font-size: 24px; font-weight: bold; margin-bottom: 20px;">facebook</div>
                    <div style="background-color: white; width: 80%; max-width: 300px; margin: 0 auto; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="text-align: left; margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; color: #606770; font-size: 12px;">Correo electrónico o teléfono</label>
                            <div style="height: 20px; border: 1px solid #dddfe2; border-radius: 5px;"></div>
                        </div>
                        <div style="text-align: left; margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; color: #606770; font-size: 12px;">Contraseña</label>
                            <div style="height: 20px; border: 1px solid #dddfe2; border-radius: 5px;"></div>
                        </div>
                        <button style="background-color: #1877F2; color: white; border: none; border-radius: 6px; padding: 8px; width: 100%; font-weight: bold; cursor: pointer;">Iniciar sesión</button>
                    </div>
                </div>
            </div>
        `;
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return `
            <div style="background-color: #fff; padding-top: 20px;">
                <div style="text-align: center; padding: 10px;">
                    <div style="font-size: 28px; margin-bottom: 20px;">𝕏</div>
                    <h3 style="margin-bottom: 20px; font-size: 18px;">Happening now</h3>
                    <div style="background-color: white; width: 80%; max-width: 300px; margin: 0 auto; border-radius: 8px; padding: 15px;">
                        <div style="margin-bottom: 15px;">
                            <button style="background-color: #1DA1F2; color: white; border: none; border-radius: 20px; padding: 8px; width: 100%; font-weight: bold; cursor: pointer; margin-bottom: 10px;">Create account</button>
                            <button style="background-color: white; color: black; border: 1px solid #ddd; border-radius: 20px; padding: 8px; width: 100%; font-weight: bold; cursor: pointer;">Sign in</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (hostname.includes('instagram.com')) {
        return `
            <div style="padding-top: 20px; background-color: #fff;">
                <div style="text-align: center; padding: 10px;">
                    <div style="font-family: 'Brush Script MT', cursive; font-size: 28px; margin-bottom: 20px;">Instagram</div>
                    <div style="background-color: white; width: 80%; max-width: 300px; margin: 0 auto; border: 1px solid #dbdbdb; border-radius: 1px; padding: 15px;">
                        <div style="text-align: left; margin-bottom: 15px;">
                            <div style="height: 20px; background-color: #fafafa; border: 1px solid #dbdbdb; border-radius: 3px; padding: 8px; font-size: 12px; color: #8e8e8e;">Teléfono, usuario o correo electrónico</div>
                        </div>
                        <div style="text-align: left; margin-bottom: 15px;">
                            <div style="height: 20px; background-color: #fafafa; border: 1px solid #dbdbdb; border-radius: 3px; padding: 8px; font-size: 12px; color: #8e8e8e;">Contraseña</div>
                        </div>
                        <button style="background-color: #0095F6; color: white; border: none; border-radius: 4px; padding: 8px; width: 100%; font-weight: bold; cursor: pointer;">Iniciar sesión</button>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Generic website layout
        return `
            <div style="padding-top: 10px;">
                <div style="height: 30px; background-color: #f8f9fa; display: flex; margin-bottom: 15px;">
                    <div style="width: 60px; height: 100%; background-color: #e9ecef; margin-right: 10px;"></div>
                    <div style="width: 60px; height: 100%; background-color: #e9ecef; margin-right: 10px;"></div>
                    <div style="width: 60px; height: 100%; background-color: #e9ecef;"></div>
                </div>
                <div style="display: flex; gap: 20px;">
                    <div style="width: 70%;">
                        <div style="height: 30px; background-color: #e9ecef; margin-bottom: 10px; width: 80%;"></div>
                        <div style="height: 10px; background-color: #e9ecef; margin-bottom: 5px; width: 100%;"></div>
                        <div style="height: 10px; background-color: #e9ecef; margin-bottom: 5px; width: 95%;"></div>
                        <div style="height: 10px; background-color: #e9ecef; margin-bottom: 5px; width: 98%;"></div>
                        <div style="height: 10px; background-color: #e9ecef; margin-bottom: 15px; width: 90%;"></div>
                        <div style="height: 80px; background-color: #e9ecef; margin-bottom: 15px; width: 100%;"></div>
                        <div style="height: 10px; background-color: #e9ecef; margin-bottom: 5px; width: 100%;"></div>
                        <div style="height: 10px; background-color: #e9ecef; margin-bottom: 5px; width: 92%;"></div>
                        <div style="height: 10px; background-color: #e9ecef; margin-bottom: 5px; width: 96%;"></div>
                    </div>
                    <div style="width: 30%;">
                        <div style="height: 100px; background-color: #e9ecef; margin-bottom: 15px;"></div>
                        <div style="height: 20px; background-color: #e9ecef; margin-bottom: 5px; width: 80%;"></div>
                        <div style="height: 10px; background-color: #e9ecef; margin-bottom: 5px; width: 90%;"></div>
                        <div style="height: 10px; background-color: #e9ecef; margin-bottom: 5px; width: 85%;"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Function to handle showing browser content
function showBrowserContent(url) {
    // Clear current content
    browserFrame.innerHTML = '';
    
    // Create loading indicator
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    loadingContainer.style.display = 'flex';
    loadingContainer.style.flexDirection = 'column';
    loadingContainer.style.alignItems = 'center';
    loadingContainer.style.justifyContent = 'center';
    loadingContainer.style.height = '100%';
    
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.style.border = '5px solid rgba(0, 0, 0, 0.1)';
    loadingSpinner.style.borderTop = '5px solid var(--accent-color)';
    loadingSpinner.style.borderRadius = '50%';
    loadingSpinner.style.width = '50px';
    loadingSpinner.style.height = '50px';
    loadingSpinner.style.animation = 'spin 1s linear infinite';
    loadingContainer.appendChild(loadingSpinner);
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Cargando página...';
    loadingText.style.marginTop = '20px';
    loadingText.style.color = 'var(--text-color)';
    loadingContainer.appendChild(loadingText);
    
    // Add the loading animation keyframes if not already added
    if (!document.querySelector('#spinner-animation')) {
        const spinnerStyle = document.createElement('style');
        spinnerStyle.id = 'spinner-animation';
        spinnerStyle.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinnerStyle);
    }
    
    browserFrame.appendChild(loadingContainer);
    
    // Use real navigation through our proxy
    try {
        // Create and load iframe with proxied content
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.backgroundColor = '#181822';  // Match our dark theme
        
        // Add event listener for when iframe loads
        iframe.addEventListener('load', () => {
            // When loaded, remove the loading indicator
            loadingContainer.style.display = 'none';
            
            // Play sound effect
            SoundEffects.playSuccess();
        });
        
        // Set iframe source - we need to use special handling for static hosts
        if (url === 'home') {
            // For home, just go to home screen
            goHome();
            return;
        } else if (!url.includes('://') && !url.startsWith('www.')) {
            // Treat as a search query if not a URL
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
            createSimulatedContent(searchUrl, iframe, loadingContainer);
        } else {
            // Standardize URL format
            let fullUrl = url;
            if (url.startsWith('www.')) {
                fullUrl = 'https://' + url;
            } else if (!url.includes('://')) {
                fullUrl = 'https://' + url;
            }
            
            // For static host environment, simulate the navigation
            createSimulatedContent(fullUrl, iframe, loadingContainer);
        }
        
        // Add iframe to the browser frame
        browserFrame.appendChild(iframe);
    } catch (error) {
        console.error('Navigation error:', error);
        showErrorMessage(`Error al cargar la página: ${error.message}`);
        SoundEffects.playError();
    }
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
                Efectos de sonido inmersivos
            </li>
            <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                <i class="fas fa-check" style="color: var(--accent-color); position: absolute; left: 0;"></i>
                Asistente IA Gemini integrado
            </li>
            <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                <i class="fas fa-check" style="color: var(--accent-color); position: absolute; left: 0;"></i>
                Navegación web rápida
            </li>
            <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                <i class="fas fa-check" style="color: var(--accent-color); position: absolute; left: 0;"></i>
                Diseño adaptable para dispositivos móviles
            </li>
        </ul>
    `;
    description.appendChild(features);
    aboutContainer.appendChild(description);
    
    // Add home button
    const backButton = document.createElement('button');
    backButton.textContent = 'Volver a la Página de Inicio';
    backButton.style.padding = '10px 20px';
    backButton.style.backgroundColor = 'var(--primary-color)';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '5px';
    backButton.style.color = 'white';
    backButton.style.cursor = 'pointer';
    backButton.style.transition = 'all 0.2s ease';
    
    backButton.addEventListener('mouseover', () => {
        backButton.style.backgroundColor = 'var(--button-hover)';
    });
    
    backButton.addEventListener('mouseout', () => {
        backButton.style.backgroundColor = 'var(--primary-color)';
    });
    
    backButton.addEventListener('click', () => {
        goHome();
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
    messageElem.style.textAlign = 'center';
    infoContainer.appendChild(messageElem);
    
    const backButton = document.createElement('button');
    backButton.textContent = 'Volver';
    backButton.style.padding = '10px 20px';
    backButton.style.backgroundColor = 'var(--primary-color)';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '5px';
    backButton.style.color = 'white';
    backButton.style.cursor = 'pointer';
    
    backButton.addEventListener('click', () => {
        goHome();
    });
    
    infoContainer.appendChild(backButton);
    
    browserFrame.appendChild(infoContainer);
}

// Create animated stars background
function createStars() {
    const starContainer = document.getElementById('starBackground');
    if (!starContainer) return;
    
    // Clear existing stars
    starContainer.innerHTML = '';
    
    // Create small star SVG elements
    const smallStarCount = Math.floor(window.innerWidth / 15);
    for (let i = 0; i < smallStarCount; i++) {
        const star = document.createElement('div');
        star.className = 'star small';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 8}s`;
        star.style.animationDuration = `${3 + Math.random() * 4}s`;
        
        const starSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        starSvg.setAttribute("viewBox", "0 0 24 24");
        starSvg.setAttribute("width", "100%");
        starSvg.setAttribute("height", "100%");
        
        const starUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
        starUse.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/star.svg#star");
        starSvg.appendChild(starUse);
        
        star.appendChild(starSvg);
        starContainer.appendChild(star);
    }
    
    // Create medium star SVG elements
    const mediumStarCount = Math.floor(window.innerWidth / 40);
    for (let i = 0; i < mediumStarCount; i++) {
        const star = document.createElement('div');
        star.className = 'star medium';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 8}s`;
        star.style.animationDuration = `${4 + Math.random() * 4}s`;
        
        const starSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        starSvg.setAttribute("viewBox", "0 0 24 24");
        starSvg.setAttribute("width", "100%");
        starSvg.setAttribute("height", "100%");
        
        const starUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
        starUse.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/star.svg#star");
        starSvg.appendChild(starUse);
        
        star.appendChild(starSvg);
        starContainer.appendChild(star);
    }
    
    // Create large star SVG elements
    const largeStarCount = Math.floor(window.innerWidth / 100);
    for (let i = 0; i < largeStarCount; i++) {
        const star = document.createElement('div');
        star.className = 'star large';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 8}s`;
        star.style.animationDuration = `${5 + Math.random() * 4}s`;
        
        const starSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        starSvg.setAttribute("viewBox", "0 0 24 24");
        starSvg.setAttribute("width", "100%");
        starSvg.setAttribute("height", "100%");
        
        const starUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
        starUse.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "assets/star.svg#star");
        starSvg.appendChild(starUse);
        
        star.appendChild(starSvg);
        starContainer.appendChild(star);
    }
    
    // Set up moon
    const moon = document.createElement('div');
    moon.className = 'moon';
    moon.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%">
        <use href="assets/moon.svg#moon"></use>
    </svg>`;
    starContainer.appendChild(moon);
}