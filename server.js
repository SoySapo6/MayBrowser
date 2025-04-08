// MayBrowser Proxy Server
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// Debug requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Custom User Agent
const customUserAgent = 'Mozilla/5.0 (Linux; Android 13; TECNO BG6 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.38 Mobile Safari/537.36';

// Handle the proxy request
app.get('/proxy', async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log(`Proxying request to: ${url}`);
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': customUserAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'max-age=0'
            },
            timeout: 10000, // 10 second timeout
            maxRedirects: 5
        });
        
        let html = response.data;
        console.log(`Successfully fetched ${url}, content length: ${html.length}`);
        
        // Modify links to use our proxy
        const $ = cheerio.load(html);
        
        // Fix links
        $('a').each((i, link) => {
            const href = $(link).attr('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                let absoluteUrl;
                
                try {
                    if (href.startsWith('http')) {
                        absoluteUrl = href;
                    } else if (href.startsWith('//')) {
                        absoluteUrl = 'https:' + href;
                    } else {
                        const baseUrl = new URL(url);
                        if (href.startsWith('/')) {
                            absoluteUrl = `${baseUrl.protocol}//${baseUrl.host}${href}`;
                        } else {
                            const pathParts = baseUrl.pathname.split('/');
                            pathParts.pop();
                            const basePath = pathParts.join('/');
                            absoluteUrl = `${baseUrl.protocol}//${baseUrl.host}${basePath}/${href}`;
                        }
                    }
                    
                    // Use origin-based URL for proxy to work from any host
                    const hostUrl = `${req.protocol}://${req.get('host')}`;
                    $(link).attr('href', `${hostUrl}/proxy?url=${encodeURIComponent(absoluteUrl)}`);
                    $(link).attr('target', '_self');
                } catch (e) {
                    console.error(`Error processing link href: ${href}`, e);
                }
            }
        });
        
        // Fix image sources
        $('img').each((i, img) => {
            const src = $(img).attr('src');
            if (src && !src.startsWith('data:')) {
                let absoluteUrl;
                
                try {
                    if (src.startsWith('http')) {
                        absoluteUrl = src;
                    } else if (src.startsWith('//')) {
                        absoluteUrl = 'https:' + src;
                    } else {
                        const baseUrl = new URL(url);
                        if (src.startsWith('/')) {
                            absoluteUrl = `${baseUrl.protocol}//${baseUrl.host}${src}`;
                        } else {
                            const pathParts = baseUrl.pathname.split('/');
                            pathParts.pop();
                            const basePath = pathParts.join('/');
                            absoluteUrl = `${baseUrl.protocol}//${baseUrl.host}${basePath}/${src}`;
                        }
                    }
                    
                    $(img).attr('src', absoluteUrl);
                } catch (e) {
                    console.error(`Error processing image src: ${src}`, e);
                }
            }
        });
        
        // Add our styles to preserve dark theme
        $('head').append(`
            <style>
                body {
                    background-color: #181822 !important;
                    color: #f1f1f1 !important;
                    padding-top: 50px !important; /* Space for our header */
                }
                
                a {
                    color: #bb86fc !important;
                }
                
                .maybrowser-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background-color: #1a1a2e;
                    color: white;
                    padding: 10px;
                    z-index: 9999;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                }
                
                .maybrowser-back-btn {
                    background-color: #3a0ca3;
                    border: none;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                }
            </style>
        `);
        
        // Add a header to allow going back to MayBrowser
        $('body').prepend(`
            <div class="maybrowser-header">
                <button class="maybrowser-back-btn" onclick="window.location.href='${req.protocol}://${req.get('host')}/'">← Volver a MayBrowser</button>
                <span>Viendo: ${url}</span>
            </div>
        `);
        
        res.send($.html());
    } catch (error) {
        console.error('Proxy error:', error.message);
        
        // Create a nice error page
        let errorHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>MayBrowser - Error</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #181822;
                    color: #f1f1f1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    padding: 20px;
                    text-align: center;
                }
                
                .error-container {
                    max-width: 600px;
                }
                
                .error-icon {
                    font-size: 5rem;
                    color: #ff5555;
                    margin-bottom: 20px;
                }
                
                h1 {
                    color: #ff5555;
                    margin-bottom: 10px;
                }
                
                .url {
                    background-color: rgba(0,0,0,0.3);
                    padding: 10px;
                    border-radius: 5px;
                    margin: 20px 0;
                    word-break: break-all;
                }
                
                .error-details {
                    background-color: rgba(0,0,0,0.2);
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                    text-align: left;
                    font-family: monospace;
                    white-space: pre-wrap;
                    max-height: 150px;
                    overflow-y: auto;
                }
                
                .back-button {
                    background-color: #3a0ca3;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;
                    font-size: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h1>Error de Navegación</h1>
                <p>No se pudo cargar la página solicitada.</p>
                <div class="url">${url}</div>
                <p>Es posible que la web no esté disponible o que no se pueda acceder a través del proxy.</p>
                <div class="error-details">${error.message}</div>
                <button class="back-button" onclick="window.location.href='${req.protocol}://${req.get('host')}/'">Volver a MayBrowser</button>
            </div>
        </body>
        </html>
        `;
        
        res.status(500).send(errorHTML);
    }
});

// Serve static files and home page
app.get('/', (req, res) => {
    // Log the request
    console.log(`Serving index.html for home page`);
    
    // Serve the main HTML file
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle direct route access without query parameters
app.get('/proxy', (req, res) => {
    // If no URL specified, redirect to home
    if (!req.query.url) {
        console.log('Proxy request without URL, redirecting to home');
        return res.redirect('/');
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`MayBrowser proxy server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access MayBrowser`);
});