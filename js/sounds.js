// Sound Effects for MayBrowser
const SoundEffects = (() => {
    // Audio context
    let audioContext = null;
    let muted = false;
    
    // Initialize audio context
    function initAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API is not supported in this browser', e);
        }
    }
    
    // Play a tone with specific parameters
    function playTone(frequency, duration, type = 'sine', volume = 0.5, delay = 0) {
        if (!audioContext || muted) return;
        
        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(audioContext.currentTime + delay);
            oscillator.stop(audioContext.currentTime + duration + delay);
        } catch (e) {
            console.error('Error playing tone:', e);
        }
    }
    
    // Create a sound effect for startup
    function playStartup() {
        if (!audioContext) initAudio();
        if (muted) return;
        
        playTone(440, 0.1, 'sine', 0.2, 0);
        playTone(587.33, 0.1, 'sine', 0.2, 0.1);
        playTone(659.25, 0.1, 'sine', 0.2, 0.2);
        playTone(880, 0.3, 'sine', 0.3, 0.3);
    }
    
    // Create a sound effect for navigation
    function playNavigation() {
        if (!audioContext) initAudio();
        if (muted) return;
        
        playTone(440, 0.1, 'sine', 0.1, 0);
        playTone(660, 0.1, 'sine', 0.1, 0.1);
    }
    
    // Create a sound effect for clicking buttons
    function playClick() {
        if (!audioContext) initAudio();
        if (muted) return;
        
        playTone(880, 0.05, 'sine', 0.1);
    }
    
    // Create a sound effect for errors
    function playError() {
        if (!audioContext) initAudio();
        if (muted) return;
        
        playTone(280, 0.1, 'sawtooth', 0.1, 0);
        playTone(220, 0.2, 'sawtooth', 0.1, 0.1);
    }
    
    // Create a sound effect for success
    function playSuccess() {
        if (!audioContext) initAudio();
        if (muted) return;
        
        playTone(523.25, 0.1, 'sine', 0.1, 0);
        playTone(659.25, 0.1, 'sine', 0.1, 0.1);
        playTone(783.99, 0.2, 'sine', 0.1, 0.2);
    }
    
    // Create a sound effect for opening panels
    function playOpen() {
        if (!audioContext) initAudio();
        if (muted) return;
        
        playTone(440, 0.1, 'sine', 0.1, 0);
        playTone(587.33, 0.1, 'sine', 0.1, 0.1);
    }
    
    // Create a sound effect for closing panels
    function playClose() {
        if (!audioContext) initAudio();
        if (muted) return;
        
        playTone(587.33, 0.1, 'sine', 0.1, 0);
        playTone(440, 0.1, 'sine', 0.1, 0.1);
    }
    
    // Create a sound effect for AI processing
    function playProcessing() {
        if (!audioContext) initAudio();
        if (muted) return;
        
        playTone(587.33, 0.1, 'sine', 0.05, 0);
        playTone(659.25, 0.1, 'sine', 0.05, 0.2);
        playTone(587.33, 0.1, 'sine', 0.05, 0.4);
    }
    
    // Toggle mute state
    function toggleMute() {
        muted = !muted;
        return muted;
    }
    
    // Check if sounds are muted
    function isMuted() {
        return muted;
    }
    
    // Initialize on load
    document.addEventListener('DOMContentLoaded', initAudio);
    
    // Public API
    return {
        playStartup,
        playNavigation,
        playClick,
        playError,
        playSuccess,
        playOpen,
        playClose,
        playProcessing,
        toggleMute,
        isMuted
    };
})();
