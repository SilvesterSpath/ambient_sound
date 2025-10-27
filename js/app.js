import { sounds, defaultPresets } from './soundData.js';
import { SoundManager } from './soundManager.js';

class AmbientMixer {
  // Initialize dependencies and default state
  constructor() {
    this.soundManager = new SoundManager();
    this.ui = null;
    this.presetManager = null;
    this.timer = null;
    this.currentSoundState = {};
    this.isInitialized = false;
  }

  init() {
    try {
      this.soundManager.loadSound('rain', 'audio/rain.mp3');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AmbientMixer();
  app.init();
});
