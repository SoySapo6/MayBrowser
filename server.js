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

// Custom User Agent
const customUserAgent = 'Mozilla/5.0 (Linux; Android 13; TECNO BG6 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.38 Mobile Safari/537.36';

// Handle the proxy request
app.get('/proxy', async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': customUserAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'max-age=0'
            }
        });
        
        let html = response.data;
        
        // Modify links to use our proxy
        const $ = cheerio.load(html);
        
        // Fix links
        $('a').each((i, link) => {
            const href = $(link).attr('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                let absoluteUrl;
                
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
                
                $(link).attr('href', `/proxy?url=${encodeURIComponent(absoluteUrl)}`);
                $(link).attr('target', '_self');
            }
        });
        
        // Fix image sources
        $('img').each((i, img) => {
            const src = $(img).attr('src');
            if (src && !src.startsWith('data:')) {
                let absoluteUrl;
                
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
            }
        });
        
        // Add our styles to preserve dark theme
        $('head').append(`
            <style>
                body {
                    background-color: #181822 !important;
                    color: #f1f1f1 !important;
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
                <button class="maybrowser-back-btn" onclick="window.location.href='/'">← Back to MayBrowser</button>
                <span>Viewing: ${url}</span>
            </div>
        `);
        
        res.send($.html());
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: 'Failed to fetch the requested URL', details: error.message });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`MayBrowser proxy server running on port ${PORT}`);
});