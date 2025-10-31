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
      this.loadAllSounds();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }

  // Load all sound files
  loadAllSounds() {
    sounds.forEach((item) => {
      const audioUrl = `audio/${item.file}`;
      const success = this.soundManager.loadSound(item.id, audioUrl);

      if (!success) {
        console.warn(
          `Could not load sound: ${item.name} from file: ${audioUrl}`
        );
      } else {
        console.log(`Sound ${item.name} loaded successfully`);
      }
    });
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AmbientMixer();
  app.init();
});
