import { sounds, defaultPresets } from './soundData.js';
import { SoundManager } from './soundManager.js';
import { UI } from './ui.js';

class AmbientMixer {
  // Initialize dependencies and default state
  constructor() {
    this.soundManager = new SoundManager();
    this.ui = new UI();
    this.presetManager = null;
    this.timer = null;
    this.currentSoundState = {};
    this.isInitialized = false;
  }

  init() {
    try {
      // initialize UI
      this.ui.init();

      // render all sound cards
      this.ui.renderSoundCards(sounds);

      // setup all event listeners
      this.setupEventListeners();

      // load all sound files
      this.loadAllSounds();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }

  // Setup all event listeners
  setupEventListeners() {
    // Handle all clicks with event delegation
    document.addEventListener('click', async (event) => {
      // Check if play button was clicked
      if (event.target.closest('.play-btn')) {
        const soundId = event.target.closest('.play-btn').dataset.sound;
        await this.toggleSound(soundId);
      }
    });

    // Handle all volume changes with event delegation
    document.addEventListener('input', async (event) => {
      if (event.target.closest('.volume-slider')) {
        const soundId = event.target.closest('.volume-slider').dataset.sound;
        const volume = parseInt(event.target.value);
        this.setSoundVolume(soundId, volume);
      }
    });
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

  // Toggle a sound
  async toggleSound(soundId) {
    const audio = this.soundManager.audioElements.get(soundId);
    if (!audio) {
      console.warn(`Sound ${soundId} not found`);
      return;
    }

    if (audio.paused) {
      this.soundManager.setVolume(soundId, 50);
      await this.soundManager.playSound(soundId);
      this.ui.updateSoundPlayButton(soundId, true);
    } else {
      await this.soundManager.pauseSound(soundId);
      this.ui.updateSoundPlayButton(soundId, false);
    }
  }

  // Set the volume of a sound
  setSoundVolume(soundId, volume) {
    // Update sound volume in the sound manager
    this.soundManager.setVolume(soundId, volume);
    // Update sound volume in the UI
    this.ui.updateSoundVolume(soundId, volume);
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AmbientMixer();
  app.init();

  const playPauseBtn = document.getElementById('playPauseAll');

  playPauseBtn.addEventListener('click', async () => {
    // Example: play one sound to “unlock” audio via a real user gesture
    await app.soundManager.playSound('rain');
    // Later: start/stop multiple sounds as needed
  });

  // make app available for testing in browser
  window.app = app;
});
