// Browser.js - Main browser functionality for MayBrowser

// Browser state variables
let browserHistory = [];
let currentHistoryIndex = -1;
let browserFrame;
let browserContent;
let urlInput;
let backButton;
let forwardButton;
let homeButton;
let refreshButton;
let menuPanel;

// Debugging helper
function debugLog(message) {
    console.log(`[MayBrowser] ${message}`);
}

// Function to initialize browser functionality
function initializeBrowser() {
    debugLog('Initializing MayBrowser...');
    
    // Get browser elements
    browserFrame = document.getElementById('browserFrame');
    browserContent = document.getElementById('browserContent');
    urlInput = document.getElementById('urlInput');
    backButton = document.getElementById('backButton');
    forwardButton = document.getElementById('forwardButton');
    homeButton = document.getElementById('homeButton');
    refreshButton = document.getElementById('refreshButton');
    menuButton = document.getElementById('menuButton');
    menuPanel = document.getElementById('menuPanel');
    
    if (!browserContent) {
        debugLog('Error: browserContent element not found!');
        return;
    }
    
    // Add event listeners
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            navigateToUrl(urlInput.value);
        }
    });
    
    // URL form submission
    document.getElementById('urlForm').addEventListener('submit', (e) => {
        e.preventDefault();
        navigateToUrl(urlInput.value);
        return false;
    });
    
    // Browser control buttons
    backButton.addEventListener('click', () => {
        debugLog('Back button clicked');
        goBack();
    });
    
    forwardButton.addEventListener('click', () => {
        debugLog('Forward button clicked');
        goForward();
    });
    
    homeButton.addEventListener('click', () => {
        debugLog('Home button clicked');
        goHome();
    });
    
    refreshButton.addEventListener('click', () => {
        debugLog('Refresh button clicked');
        refreshPage();
    });
    
    // Menu toggle
    menuButton.addEventListener('click', () => {
        debugLog('Menu button clicked');
        toggleMenu();
    });
    
    // Close menu button
    document.getElementById('closeMenuPanel').addEventListener('click', () => {
        menuPanel.style.display = 'none';
    });
    
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
    if (typeof SoundEffects !== 'undefined' && SoundEffects.playStartup) {
        SoundEffects.playStartup();
    }
    
    console.log('MayBrowser initialization complete');
}

// Function to handle navigation to a URL
function navigateToUrl(url) {
    debugLog(`Navegando a URL: ${url}`);
    
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

// Function to handle showing browser content
function showBrowserContent(url) {
    debugLog(`Showing browser content for: ${url}`);
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
    
    try {
        // Handle home page specially
        if (url === 'home') {
            goHome();
            return;
        }
        
        // Create and load iframe with actual website content
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.backgroundColor = '#fff';  
        
        // Add event listeners for success and failure
        iframe.addEventListener('load', () => {
            // When loaded, remove the loading indicator
            loadingContainer.style.display = 'none';
            
            // Play success sound effect
            if (typeof SoundEffects !== 'undefined' && SoundEffects.playSuccess) {
                SoundEffects.playSuccess();
            }
        });
        
        iframe.addEventListener('error', () => {
            loadingContainer.style.display = 'none';
            showErrorMessage(`No se pudo cargar ${url}. Es posible que el sitio no permita ser mostrado en un iframe.`);
            if (typeof SoundEffects !== 'undefined' && SoundEffects.playError) {
                SoundEffects.playError();
            }
        });
        
        // Process the URL correctly
        let processedUrl;
        let showNotification = false;
        let notificationMessage = '';
        
        if (!url.includes('://') && !url.startsWith('www.')) {
            // Treat as a search query if not a URL
            if (url.toLowerCase().includes('yahoo')) {
                processedUrl = `https://www.bing.com/search?q=${encodeURIComponent(url)}`;
            } else {
                // Use DuckDuckGo instead of Google
                processedUrl = `https://www.bing.com/search?q=${encodeURIComponent(url)}`;
                showNotification = true;
                notificationMessage = 'Utilizando Bing como motor de búsqueda alternativo por limitaciones de iFrame con Google.';
            }
        } else {
            // Standardize URL format
            let formattedUrl;
            if (url.startsWith('www.')) {
                formattedUrl = 'https://' + url;
            } else if (!url.includes('://')) {
                formattedUrl = 'https://' + url;
            } else {
                formattedUrl = url;
            }
            
            // Check for YouTube and redirect to Invidious
            if (formattedUrl.includes('youtube.com') || formattedUrl.includes('youtu.be')) {
                // Extract video ID if present
                let videoId = '';
                if (formattedUrl.includes('watch?v=')) {
                    videoId = formattedUrl.split('watch?v=')[1].split('&')[0];
                    processedUrl = `https://www.bitchute.com/search?query=${videoId}/`;
                } else if (formattedUrl.includes('youtu.be/')) {
                    videoId = formattedUrl.split('youtu.be/')[1].split('?')[0];
                    processedUrl = `https://www.bitchute.com/search?query=${videoId}/`;
                } else {
                    // Just go to the homepage
                    processedUrl = 'https://www.bitchute.com/';
                }
                
                showNotification = true;
                notificationMessage = 'Utilizando bitchute como alternativa a YouTube, ya que YouTube no permite ser mostrado en iFrames.';
            } else if (formattedUrl.includes('google.com')) {
                // Redirect Google searches to DuckDuckGo
                if (formattedUrl.includes('search?q=')) {
                    const searchQuery = formattedUrl.split('search?q=')[1].split('&')[0];
                    processedUrl = `https://www.bing.com/search?q=${searchQuery}`;
                } else {
                    processedUrl = 'https://www.bing.com/';
                }
                
                showNotification = true;
                notificationMessage = 'Utilizando Bing como alternativa a Google, ya que Google no permite ser mostrado en iFrames.';
            } else {
                processedUrl = formattedUrl;
            }
        }
        
        // Try to validate URL format
        try {
            new URL(processedUrl);
            
            // Set iframe source to the actual website
            iframe.src = processedUrl;
            browserFrame.appendChild(iframe);
            
            // Add a message about possible CORS issues
            const corsWarning = document.createElement('div');
            corsWarning.style.position = 'absolute';
            corsWarning.style.bottom = '10px';
            corsWarning.style.left = '10px';
            corsWarning.style.right = '10px';
            corsWarning.style.backgroundColor = 'rgba(0,0,0,0.7)';
            corsWarning.style.color = 'white';
            corsWarning.style.padding = '10px';
            corsWarning.style.borderRadius = '5px';
            corsWarning.style.fontSize = '12px';
            corsWarning.style.textAlign = 'center';
            corsWarning.style.zIndex = '1000';
            corsWarning.textContent = showNotification ? notificationMessage : 'Si la página no carga, es posible que tenga restricciones de seguridad (CORS) que impidan mostrarla en un iframe.';
            corsWarning.style.opacity = '0';
            corsWarning.style.transition = 'opacity 0.5s';
            
            // Show the warning after a delay
            setTimeout(() => {
                if (corsWarning.parentNode) { // Check if still in DOM
                    corsWarning.style.opacity = '1';
                    
                    // For notification messages about alternative sites, keep them visible longer
                    const hideTimeout = showNotification ? 10000 : 5000;
                    
                    // Hide after timeout
                    setTimeout(() => {
                        if (corsWarning.parentNode) {
                            corsWarning.style.opacity = '0';
                            // Remove after fade out
                            setTimeout(() => {
                                if (corsWarning.parentNode) {
                                    corsWarning.parentNode.removeChild(corsWarning);
                                }
                            }, 500);
                        }
                    }, hideTimeout);
                }
            }, 1000);
            
            browserFrame.appendChild(corsWarning);
            
        } catch (error) {
            // URL inválida
            showErrorMessage(`La URL ${url} no es válida. Por favor, verifique la dirección e intente de nuevo.`);
            if (typeof SoundEffects !== 'undefined' && SoundEffects.playError) {
                SoundEffects.playError();
            }
        }
    } catch (error) {
        console.error('Navigation error:', error);
        showErrorMessage(`Error al cargar la página: ${error.message}`);
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playError) {
            SoundEffects.playError();
        }
    }
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
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
                        min-height: 300px;
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
                <div class="content-preview">
                    ${getSimulatedContent(url, hostname)}
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
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playNavigation) {
            SoundEffects.playNavigation();
        }
    }, 1000); // Simulate loading time of 1 second
}

// Helper function to generate simulated content based on the website
function getSimulatedContent(url, hostname) {
    // Verificar si es una búsqueda o URL de error
    if (url.includes('error=')) {
        return generateErrorPage(url);
    }
    
    // Generate different content based on the hostname
    if (hostname.includes('youtube.com')) {
        return generateYouTubeUI(url);
    } else if (hostname.includes('google.com')) {
        return generateGoogleUI(url);
    } else if (hostname.includes('yahoo.com')) {
        return generateYahooUI(url);
    } else if (hostname.includes('facebook.com')) {
        return generateFacebookUI();
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return generateTwitterUI();
    } else if (hostname.includes('instagram.com')) {
        return generateInstagramUI();
    } else if (hostname.includes('amazon')) {
        return generateAmazonUI();
    } else if (hostname.includes('netflix')) {
        return generateNetflixUI();
    } else if (hostname.includes('spotify')) {
        return generateSpotifyUI();
    } else if (hostname.includes('wikipedia')) {
        return generateWikipediaUI(url);
    } else {
        // Sitio genérico
        return generateGenericWebsiteUI(url, hostname);
    }
}

// Páginas de errores
function generateErrorPage(url) {
    const params = new URLSearchParams(url.split('?')[1]);
    const errorType = params.get('error');
    const errorUrl = params.get('url') || 'unknown site';
    
    let errorTitle = "Error de navegación";
    let errorMessage = "No se pudo acceder a la página solicitada.";
    let errorDetails = "Se ha producido un error desconocido.";
    let errorIcon = "fa-exclamation-triangle";
    
    if (errorType === 'cors') {
        errorTitle = "Error de Acceso (CORS)";
        errorMessage = `No se puede acceder a ${errorUrl}`;
        errorDetails = "Las políticas de seguridad del navegador (CORS) impiden acceder directamente a este sitio web desde un host estático.";
        errorIcon = "fa-lock";
    } else if (errorType === 'network') {
        errorTitle = "Error de Conexión";
        errorMessage = `No se puede conectar a ${errorUrl}`;
        errorDetails = "Verifica tu conexión a Internet o intenta de nuevo más tarde.";
        errorIcon = "fa-wifi";
    } else if (errorType === 'blocked') {
        errorTitle = "Sitio Bloqueado";
        errorMessage = `El acceso a ${errorUrl} está restringido`;
        errorDetails = "Este sitio ha sido bloqueado por políticas de seguridad. Contacta al administrador para más información.";
        errorIcon = "fa-ban";
    } else if (errorType === 'notfound') {
        errorTitle = "Página No Encontrada";
        errorMessage = `No se encontró la página ${errorUrl}`;
        errorDetails = "La URL solicitada no existe. Verifica que hayas escrito correctamente la dirección.";
        errorIcon = "fa-question-circle";
    }
    
    return `
        <div style="background-color: #f8f9fa; padding: 40px 20px; height: 100%; font-family: Arial, sans-serif; color: #333; display: flex; align-items: center; justify-content: center;">
            <div style="max-width: 600px; background-color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); padding: 30px; text-align: center;">
                <div style="font-size: 40px; margin-bottom: 20px; color: #e74c3c;">
                    <i class="fas ${errorIcon}"></i>
                </div>
                <h1 style="font-size: 24px; margin-bottom: 15px; color: #e74c3c;">${errorTitle}</h1>
                <h2 style="font-size: 18px; margin-bottom: 20px; color: #555;">${errorMessage}</h2>
                <p style="color: #777; margin-bottom: 30px; line-height: 1.6;">${errorDetails}</p>
                <div style="margin: 30px 0;">
                    <button onclick="window.parent.goBack()" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-arrow-left"></i> Volver atrás
                    </button>
                    <button onclick="window.parent.goHome()" style="background-color: #2ecc71; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-home"></i> Ir al inicio
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Plantillas para diferentes sitios web
function generateYouTubeUI(url) {
    // Extraer la búsqueda o ID del video de la URL
    let searchQuery = "";
    let videoId = "";
    
    if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('search?q=')) {
        searchQuery = decodeURIComponent(url.split('search?q=')[1].split('&')[0]);
    }
    
    if (videoId) {
        // Simulación de página de reproducción de video
        return `
            <div style="background-color: #181818; color: white; font-family: Roboto, Arial, sans-serif; height: 100%;">
                <div style="display: flex; padding: 15px 20px; background-color: #202020; align-items: center;">
                    <div style="color: #FF0000; font-size: 24px; margin-right: 20px;">
                        <i class="fab fa-youtube"></i>
                    </div>
                    <div style="flex-grow: 1;">
                        <input type="text" value="MayBrowser YouTube Simulation" style="width: 100%; background-color: #121212; color: white; border: 1px solid #303030; padding: 8px; border-radius: 2px;">
                    </div>
                    <div style="margin-left: 20px;">
                        <i class="fas fa-user-circle" style="font-size: 24px;"></i>
                    </div>
                </div>
                
                <div style="padding: 20px;">
                    <div style="background-color: #000; width: 100%; max-width: 800px; margin: 0 auto; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; position: relative;">
                        <div style="position: absolute; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                            <div style="width: 70px; height: 50px; background-color: #FF0000; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                                <div style="width: 0; height: 0; border-style: solid; border-width: 12px 0 12px 20px; border-color: transparent transparent transparent #ffffff;"></div>
                            </div>
                            <div style="font-size: 18px; margin-bottom: 10px;">Video ID: ${videoId}</div>
                            <div style="color: #aaa; font-size: 14px;">Simulación de reproductor de video</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Simulación de página principal o resultados de búsqueda
        return `
            <div style="background-color: #181818; color: white; font-family: Roboto, Arial, sans-serif; height: 100%;">
                <div style="display: flex; padding: 15px 20px; background-color: #202020; align-items: center;">
                    <div style="color: #FF0000; font-size: 24px; margin-right: 20px;">
                        <i class="fab fa-youtube"></i>
                    </div>
                    <div style="flex-grow: 1;">
                        <input type="text" value="${searchQuery || 'MayBrowser YouTube'}" style="width: 100%; background-color: #121212; color: white; border: 1px solid #303030; padding: 8px; border-radius: 2px;">
                    </div>
                    <div style="margin-left: 20px;">
                        <i class="fas fa-user-circle" style="font-size: 24px;"></i>
                    </div>
                </div>
                
                <div style="display: flex; height: calc(100% - 60px);">
                    <!-- Sidebar -->
                    <div style="width: 200px; background-color: #212121; padding: 15px;">
                        <div style="padding: 10px; margin-bottom: 10px; display: flex; align-items: center;">
                            <i class="fas fa-home" style="margin-right: 20px;"></i>
                            <span>Inicio</span>
                        </div>
                        <div style="padding: 10px; margin-bottom: 10px; display: flex; align-items: center;">
                            <i class="fas fa-compass" style="margin-right: 20px;"></i>
                            <span>Explorar</span>
                        </div>
                        <div style="padding: 10px; margin-bottom: 10px; display: flex; align-items: center;">
                            <i class="fas fa-play-circle" style="margin-right: 20px;"></i>
                            <span>Shorts</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function generateGoogleUI(url) {
    // Extraer la consulta de búsqueda si existe
    let searchQuery = "";
    if (url.includes('search?q=')) {
        searchQuery = decodeURIComponent(url.split('search?q=')[1].split('&')[0]);
    }
    
    if (searchQuery) {
        // Página de resultados de búsqueda
        return `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: white; color: #333;">
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div style="margin-right: 20px;">
                        <span style="color: #4285F4; font-size: 24px; font-weight: bold;">G</span>
                        <span style="color: #EA4335; font-size: 24px; font-weight: bold;">o</span>
                        <span style="color: #FBBC05; font-size: 24px; font-weight: bold;">o</span>
                        <span style="color: #4285F4; font-size: 24px; font-weight: bold;">g</span>
                        <span style="color: #34A853; font-size: 24px; font-weight: bold;">l</span>
                        <span style="color: #EA4335; font-size: 24px; font-weight: bold;">e</span>
                    </div>
                    <div style="flex-grow: 1;">
                        <div style="display: flex; width: 100%; border: 1px solid #dfe1e5; border-radius: 24px; padding: 10px 15px;">
                            <input type="text" value="${searchQuery}" style="flex-grow: 1; border: none; outline: none; font-size: 16px;">
                            <div style="margin-left: 15px; color: #4285F4;">
                                <i class="fas fa-search"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="color: #666; font-size: 14px; margin-bottom: 30px; border-bottom: 1px solid #ebebeb; padding-bottom: 10px;">
                    Aproximadamente 1,450,000 resultados (0.62 segundos)
                </div>
            </div>
        `;
    } else {
        // Página principal de Google
        return `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; background-color: white; flex-direction: column;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="margin-bottom: 30px;">
                        <span style="color: #4285F4; font-size: 72px; font-weight: bold;">G</span>
                        <span style="color: #EA4335; font-size: 72px; font-weight: bold;">o</span>
                        <span style="color: #FBBC05; font-size: 72px; font-weight: bold;">o</span>
                        <span style="color: #4285F4; font-size: 72px; font-weight: bold;">g</span>
                        <span style="color: #34A853; font-size: 72px; font-weight: bold;">l</span>
                        <span style="color: #EA4335; font-size: 72px; font-weight: bold;">e</span>
                    </div>
                    <div style="position: relative; max-width: 580px; margin: 0 auto;">
                        <div style="display: flex; border: 1px solid #dfe1e5; border-radius: 24px; padding: 10px 15px; flex-direction: row; align-items: center;">
                            <i class="fas fa-search" style="color: #9aa0a6; margin-right: 10px;"></i>
                            <input type="text" placeholder="Buscar en Google" style="flex-grow: 1; border: none; outline: none; font-size: 16px;">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function generateYahooUI(url) {
    // Extraer la consulta de búsqueda si existe
    let searchQuery = "";
    if (url.includes('search?p=')) {
        searchQuery = decodeURIComponent(url.split('search?p=')[1].split('&')[0]);
    }
    
    if (searchQuery) {
        // Resultados de búsqueda de Yahoo
        return `
            <div style="font-family: Arial, sans-serif; background-color: white; color: #333; height: 100%;">
                <div style="background-color: #5f01d1; padding: 15px; display: flex; align-items: center;">
                    <div style="color: white; font-size: 24px; font-weight: bold; margin-right: 20px;">Yahoo!</div>
                    <div style="flex-grow: 1;">
                        <div style="display: flex; width: 100%; background-color: white; border-radius: 4px; padding: 8px 15px;">
                            <input type="text" value="${searchQuery}" style="flex-grow: 1; border: none; outline: none; font-size: 16px;">
                            <div style="margin-left: 15px; color: #5f01d1;">
                                <i class="fas fa-search"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Página principal de Yahoo
        return `
            <div style="font-family: Arial, sans-serif; background-color: white; height: 100%;">
                <div style="background-color: #5f01d1; padding: 15px; display: flex; align-items: center;">
                    <div style="color: white; font-size: 24px; font-weight: bold; margin-right: 20px;">Yahoo!</div>
                    <div style="margin-left: auto; color: white;">
                        <i class="fas fa-user-circle" style="font-size: 24px;"></i>
                    </div>
                </div>
                
                <div style="padding: 40px 20px; text-align: center;">
                    <div style="font-size: 48px; font-weight: bold; color: #5f01d1; margin-bottom: 30px;">Yahoo!</div>
                    
                    <div style="max-width: 580px; margin: 0 auto;">
                        <div style="display: flex; border: 1px solid #ccc; border-radius: 4px; padding: 10px 15px;">
                            <input type="text" placeholder="Buscar en la web" style="flex-grow: 1; border: none; outline: none; font-size: 16px;">
                            <div style="margin-left: 15px; color: #5f01d1; cursor: pointer;">
                                <i class="fas fa-search"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function generateFacebookUI() {
    return `
        <div style="font-family: Arial, sans-serif; background-color: #f0f2f5; height: 100%; display: flex; flex-direction: column;">
            <div style="background-color: white; padding: 10px 15px; display: flex; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="color: #1877F2; font-size: 36px; font-weight: bold; margin-right: 15px;">f</div>
                <div style="flex-grow: 1;">
                    <div style="display: flex; background-color: #f0f2f5; border-radius: 50px; padding: 8px 15px;">
                        <i class="fas fa-search" style="color: #65676b; margin-right: 10px;"></i>
                        <input type="text" placeholder="Buscar en Facebook" style="background: transparent; border: none; outline: none; flex-grow: 1;">
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateTwitterUI() {
    return `
        <div style="font-family: Arial, sans-serif; background-color: #15202B; color: white; height: 100%; display: flex;">
            <!-- Sidebar -->
            <div style="width: 250px; padding: 20px; border-right: 1px solid #38444d;">
                <div style="font-size: 28px; margin-bottom: 30px; color: white;">𝕏</div>
                
                <div style="margin-bottom: 20px; display: flex; align-items: center; color: white; font-weight: bold; font-size: 18px;">
                    <i class="fas fa-home" style="margin-right: 15px; font-size: 24px;"></i>
                    <span>Inicio</span>
                </div>
            </div>
        </div>
    `;
}

function generateInstagramUI() {
    return `
        <div style="font-family: Arial, sans-serif; background-color: #fafafa; height: 100%; display: flex; flex-direction: column;">
            <!-- Header -->
            <div style="background-color: white; padding: 15px; display: flex; align-items: center; border-bottom: 1px solid #dbdbdb;">
                <div style="font-family: 'Brush Script MT', cursive; font-size: 24px; font-weight: bold; flex-grow: 1;">Instagram</div>
                <div style="display: flex; gap: 20px;">
                    <i class="far fa-plus-square" style="font-size: 24px;"></i>
                    <i class="far fa-heart" style="font-size: 24px;"></i>
                    <i class="far fa-paper-plane" style="font-size: 24px;"></i>
                </div>
            </div>
        </div>
    `;
}

function generateAmazonUI() {
    return `
        <div style="font-family: Arial, sans-serif; background-color: #EAEDED; height: 100%;">
            <!-- Header -->
            <div style="background-color: #131921; padding: 15px; display: flex; align-items: center; color: white;">
                <div style="font-size: 24px; font-weight: bold; margin-right: 15px;">amazon</div>
                
                <div style="display: flex; flex-grow: 1; margin: 0 15px;">
                    <input type="text" placeholder="Buscar en Amazon" style="flex-grow: 1; padding: 8px; border: none; outline: none;">
                    <button style="background-color: #febd69; border: none; padding: 0 10px;">
                        <i class="fas fa-search" style="color: #333;"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateNetflixUI() {
    return `
        <div style="font-family: Arial, sans-serif; background-color: #141414; color: white; height: 100%;">
            <!-- Header -->
            <div style="padding: 15px; display: flex; align-items: center; position: relative; z-index: 1;">
                <div style="color: #e50914; font-size: 30px; font-weight: bold; margin-right: 30px;">NETFLIX</div>
                
                <div style="display: flex; gap: 20px; font-size: 14px;">
                    <div style="font-weight: bold;">Inicio</div>
                    <div>Series</div>
                    <div>Películas</div>
                    <div>Novedades populares</div>
                    <div>Mi lista</div>
                </div>
            </div>
        </div>
    `;
}

function generateSpotifyUI() {
    return `
        <div style="font-family: Arial, sans-serif; background-color: #121212; color: white; height: 100%; display: flex;">
            <!-- Sidebar -->
            <div style="width: 250px; background-color: #000; padding: 20px;">
                <div style="color: #1DB954; font-size: 24px; font-weight: bold; margin-bottom: 30px;">Spotify</div>
            </div>
        </div>
    `;
}

function generateWikipediaUI(url) {
    // Extraer el término de búsqueda o artículo de la URL
    let article = "Página principal";
    if (url.includes('/wiki/')) {
        article = decodeURIComponent(url.split('/wiki/')[1]);
    }
    
    return `
        <div style="font-family: Arial, sans-serif; background-color: white; color: #222; height: 100%; display: flex; flex-direction: column;">
            <!-- Header -->
            <div style="padding: 0.5em 1em; display: flex; align-items: center; border-bottom: 1px solid #a7d7f9; background-color: #f6f6f6;">
                <div style="font-size: 24px; font-weight: bold; margin-right: 20px;">Wikipedia</div>
                
                <div style="flex-grow: 1;">
                    <div style="display: flex;">
                        <input type="text" value="${article}" style="flex-grow: 1; padding: 8px; border: 1px solid #a2a9b1; border-right: none;">
                        <button style="background-color: #f8f9fa; border: 1px solid #a2a9b1; padding: 0 10px;">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateGenericWebsiteUI(url, hostname) {
    return `
        <div style="font-family: Arial, sans-serif; height: 100%; display: flex; flex-direction: column;">
            <!-- Header -->
            <div style="background-color: #333; color: white; padding: 15px; display: flex; align-items: center;">
                <div style="font-size: 24px; font-weight: bold;">${hostname}</div>
                <div style="margin-left: auto; display: flex; gap: 20px;">
                    <div>Inicio</div>
                    <div>Acerca de</div>
                    <div>Servicios</div>
                    <div>Contacto</div>
                </div>
            </div>
            
            <!-- Hero section -->
            <div style="background-color: #f5f5f5; padding: 50px 20px; text-align: center;">
                <h1 style="font-size: 36px; margin-bottom: 20px;">Bienvenido a ${hostname}</h1>
                <p style="font-size: 18px; color: #666; max-width: 800px; margin: 0 auto 30px auto;">
                    Esta es una simulación de un sitio web genérico en MayBrowser. El contenido real de ${url} no puede cargarse debido a limitaciones técnicas en hosts estáticos.
                </p>
                <button style="background-color: #007bff; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px;">Saber más</button>
            </div>
        </div>
    `;
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
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playClick) {
            SoundEffects.playClick();
        }
    } else {
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playError) {
            SoundEffects.playError();
        }
    }
}

function goForward() {
    if (currentHistoryIndex < browserHistory.length - 1) {
        currentHistoryIndex++;
        showBrowserContent(browserHistory[currentHistoryIndex]);
        urlInput.value = browserHistory[currentHistoryIndex];
        
        updateButtonStates();
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playClick) {
            SoundEffects.playClick();
        }
    } else {
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playError) {
            SoundEffects.playError();
        }
    }
}

function refreshPage() {
    if (browserHistory.length > 0) {
        showBrowserContent(browserHistory[currentHistoryIndex]);
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playClick) {
            SoundEffects.playClick();
        }
    } else {
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playError) {
            SoundEffects.playError();
        }
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
        { url: 'https://www.instagram.com', icon: 'fab fa-instagram', name: 'Instagram' },
        { url: 'https://www.bing.com/search?q=Busca!', icon: 'fab fa-yahoo', name: 'Yahoo' },
        { url: 'https://www.amazon.com', icon: 'fab fa-amazon', name: 'Amazon' }
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
    if (typeof SoundEffects !== 'undefined' && SoundEffects.playNavigation) {
        SoundEffects.playNavigation();
    }
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
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playOpen) {
            SoundEffects.playOpen();
        }
    } else {
        menuPanel.style.display = 'none';
        if (typeof SoundEffects !== 'undefined' && SoundEffects.playClose) {
            SoundEffects.playClose();
        }
    }
}

// Bookmark functions
function showBookmarks() {
    // For now just show a message
    showInfoMessage("Bookmarks", "Esta función estará disponible próximamente.");
    if (typeof SoundEffects !== 'undefined' && SoundEffects.playClick) {
        SoundEffects.playClick();
    }
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
    
    if (typeof SoundEffects !== 'undefined' && SoundEffects.playClick) {
        SoundEffects.playClick();
    }
}

// Settings functions
function showSettings() {
    // For now just show a message
    showInfoMessage("Configuración", "Esta función estará disponible próximamente.");
    if (typeof SoundEffects !== 'undefined' && SoundEffects.playClick) {
        SoundEffects.playClick();
    }
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
    description.style.maxWidth = '600px';
    description.style.margin = '0 auto 40px';
    description.style.lineHeight = '1.6';
    description.style.color = 'var(--text-color)';
    description.innerHTML = `
        <p>MayBrowser es un navegador web experimental con temática espacial y de juegos, 
        diseñado para proporcionar una experiencia de navegación inmersiva y visual.</p>
        
        <p>Este navegador simula el funcionamiento de un navegador web real en un entorno 
        de host estático, utilizando tecnologías web estándar para recrear la experiencia 
        de navegación.</p>
    `;
    aboutContainer.appendChild(description);
    
    const featuresTitle = document.createElement('h2');
    featuresTitle.textContent = 'Características';
    featuresTitle.style.fontSize = '1.8rem';
    featuresTitle.style.marginBottom = '20px';
    featuresTitle.style.color = 'var(--accent-color)';
    aboutContainer.appendChild(featuresTitle);
    
    const featuresList = document.createElement('ul');
    featuresList.style.listStyleType = 'none';
    featuresList.style.padding = '0';
    featuresList.style.maxWidth = '600px';
    featuresList.style.margin = '0 auto 40px';
    featuresList.style.textAlign = 'left';
    
    const features = [
        { icon: 'fa-moon', text: 'Tema oscuro con estrellas animadas.' },
        { icon: 'fa-robot', text: 'Integración con IA para asistencia de navegación.' },
        { icon: 'fa-volume-up', text: 'Efectos de sonido inmersivos.' },
        { icon: 'fa-history', text: 'Historial de navegación.' },
        { icon: 'fa-desktop', text: 'Simulación de sitios web populares.' }
    ];
    
    features.forEach(feature => {
        const item = document.createElement('li');
        item.style.margin = '15px 0';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        
        const icon = document.createElement('i');
        icon.className = `fas ${feature.icon}`;
        icon.style.color = 'var(--accent-color)';
        icon.style.fontSize = '1.2rem';
        icon.style.marginRight = '15px';
        icon.style.width = '20px';
        item.appendChild(icon);
        
        const text = document.createElement('span');
        text.textContent = feature.text;
        item.appendChild(text);
        
        featuresList.appendChild(item);
    });
    
    aboutContainer.appendChild(featuresList);
    
    const creditsTitle = document.createElement('h2');
    creditsTitle.textContent = 'Créditos';
    creditsTitle.style.fontSize = '1.5rem';
    creditsTitle.style.marginBottom = '20px';
    creditsTitle.style.color = 'var(--accent-color)';
    aboutContainer.appendChild(creditsTitle);
    
    const credits = document.createElement('p');
    credits.style.fontSize = '0.9rem';
    credits.style.color = 'var(--text-secondary)';
    credits.innerHTML = 'Creado con ❤️ por el equipo de MayBrowser<br>2025';
    aboutContainer.appendChild(credits);
    
    // Add a back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Volver';
    backButton.style.marginTop = '40px';
    backButton.style.padding = '10px 30px';
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
        if (browserHistory.length > 0) {
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
    
    if (typeof SoundEffects !== 'undefined' && SoundEffects.playClick) {
        SoundEffects.playClick();
    }
}

// Utility function to show info message
function showInfoMessage(title, message) {
    browserFrame.innerHTML = '';
    
    const messageContainer = document.createElement('div');
    messageContainer.style.display = 'flex';
    messageContainer.style.flexDirection = 'column';
    messageContainer.style.alignItems = 'center';
    messageContainer.style.justifyContent = 'center';
    messageContainer.style.height = '100%';
    messageContainer.style.padding = '20px';
    messageContainer.style.textAlign = 'center';
    
    const titleElem = document.createElement('h2');
    titleElem.textContent = title;
    titleElem.style.marginBottom = '20px';
    titleElem.style.color = 'var(--accent-color)';
    messageContainer.appendChild(titleElem);
    
    const messageElem = document.createElement('p');
    messageElem.textContent = message;
    messageElem.style.fontSize = '1.1rem';
    messageElem.style.marginBottom = '30px';
    messageElem.style.maxWidth = '600px';
    messageContainer.appendChild(messageElem);
    
    const backButton = document.createElement('button');
    backButton.textContent = 'Volver';
    backButton.style.padding = '10px 20px';
    backButton.style.backgroundColor = 'var(--primary-color)';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '5px';
    backButton.style.cursor = 'pointer';
    
    backButton.addEventListener('click', () => {
        if (browserHistory.length > 0) {
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
    
    messageContainer.appendChild(backButton);
    browserFrame.appendChild(messageContainer);
}

// Function to create stars
function createStars() {
    const starBackground = document.getElementById('starBackground');
    if (!starBackground) return;
    
    // Remove any existing stars
    starBackground.innerHTML = '';
    
    // Create stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        // Random size for the stars
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        starBackground.appendChild(star);
    }
}

// Expose global functions for access from iframe or HTML
window.navigateToUrl = navigateToUrl;
window.goBack = goBack;
window.goForward = goForward;
window.refreshPage = refreshPage;
window.goHome = goHome;
