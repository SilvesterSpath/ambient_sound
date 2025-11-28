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
    this.masterVolume = 100;
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

      // Initialize sound states after loading sounds
      sounds.forEach((item) => {
        this.currentSoundState[item.id] = 0;
      });

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

      // Check if a default preset button was clicked
      if (event.target.closest('.preset-btn')) {
        const presetKey = event.target.closest('.preset-btn').dataset.preset;
        this.loadPreset(presetKey);
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

    // Handle the master volume slider
    const masterVolumeSlider = document.getElementById('masterVolume');
    if (masterVolumeSlider) {
      masterVolumeSlider.addEventListener('input', (event) => {
        const volume = parseInt(event.target.value);
        this.setMasterVolume(volume);
      });
    }

    // Handle master play/pause button
    if (this.ui.playPauseAllButton) {
      this.ui.playPauseAllButton.addEventListener('click', async () => {
        this.toggleAllSounds();
      });
    }

    // Handle reset button
    if (this.ui.resetButton) {
      this.ui.resetButton.addEventListener('click', () => {
        this.resetApp();
      });
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

  // Toggle a sound
  async toggleSound(soundId) {
    const audio = this.soundManager.audioElements.get(soundId);
    if (!audio) {
      console.warn(`Sound ${soundId} not found`);
      return;
    }

    if (audio.paused) {
      // Get current slider value
      const slider = document.querySelector(
        `[data-sound="${soundId}"] .volume-slider`
      );
      let volume = parseInt(slider.value, 10);

      // If slider is at 0, default to 50%
      if (volume === 0) {
        volume = 50;
        this.ui.updateSoundVolume(soundId, volume);
      }

      // Sound is off, turn it on
      this.soundManager.setVolume(soundId, volume);
      await this.soundManager.playSound(soundId);
      this.ui.updateSoundPlayButton(soundId, true);
    } else {
      await this.soundManager.pauseSound(soundId);
      this.ui.updateSoundPlayButton(soundId, false);
    }

    // Update the main play/pause button state
    this.updateMainPlayButtonState();
  }

  // Toggle all sounds
  toggleAllSounds() {
    if (this.soundManager.isPlaying) {
      this.soundManager.pauseAllSounds();
      this.ui.updateMainPlayButton(false);
      sounds.forEach((sound) => {
        this.ui.updateSoundPlayButton(sound.id, false);
      });
    } else {
      for (const [soundId, audio] of this.soundManager.audioElements) {
        const card = document.querySelector(`[data-sound="${soundId}"]`);
        const slider = card?.querySelector?.('.volume-slider');

        if (slider) {
          let volume = parseInt(slider.value);
          if (volume === 0) {
            volume = 50;
            slider.value = volume;
            this.ui.updateSoundVolume(soundId, volume);
          }
          this.currentSoundState[soundId] = volume;

          const effectiveVolume = (volume * this.masterVolume) / 100;
          audio.volume = effectiveVolume / 100;
          this.ui.updateSoundPlayButton(soundId, true);
        }
      }
      this.soundManager.playAllSounds();
      this.ui.updateMainPlayButton(true);
    }
  }

  // Set the volume of a sound
  setSoundVolume(soundId, volume) {
    // Set sound volume in state
    this.currentSoundState[soundId] = volume;

    console.log('Current sound state:', this.currentSoundState);

    // Apply the master volume to the sound
    const effectiveVolume = (volume * this.masterVolume) / 100;
    // Update the sound volume with the scaled volume
    this.soundManager.setVolume(soundId, effectiveVolume);
    // Update sound volume in the UI
    this.ui.updateSoundVolume(soundId, volume);

    // Sync sounds
    this.updateMainPlayButtonState();
  }

  // Set the master volume
  setMasterVolume(volume) {
    this.masterVolume = volume;
    // Update master volume in the UI
    const masterVolumeValue = document.getElementById('masterVolumeValue');
    if (masterVolumeValue) {
      masterVolumeValue.textContent = `${volume}%`;
    }

    // Apply the master volume to all playingsounds
    this.applyMasterVolumeToAll(volume);
  }

  // Apply the master volume to all sounds
  applyMasterVolumeToAll(volume) {
    for (const [soundId, audio] of this.soundManager.audioElements) {
      if (!audio.paused) {
        const card = document.querySelector(`[data-sound="${soundId}"]`);
        if (card) {
          const volumeSlider = card?.querySelector?.('.volume-slider');
          if (volumeSlider) {
            const individualVolume = parseInt(volumeSlider.value);
            const effectiveVolume =
              (individualVolume * this.masterVolume) / 100;

            // Apply to the actal audio element
            audio.volume = effectiveVolume / 100;
          }
        }
      }
    }
  }

  // Update main play/pause all button icon
  updateMainPlayButtonState() {
    // Check if any sound is playing
    let anySoundPlaying = false;
    for (const [soundId, audio] of this.soundManager.audioElements) {
      if (!audio.paused) {
        anySoundPlaying = true;
        break;
      }
    }
    // Update the main button and the internal state
    this.soundManager.isPlaying = anySoundPlaying;
    this.ui.updateMainPlayButton(anySoundPlaying);
  }

  // Reset the app to its initial state
  resetApp() {
    this.soundManager.stopAllSounds();
    this.masterVolume = 50;

    this.ui.resetUI();
  }

  // Load a preset config
  loadPreset(presetKey) {
    const preset = defaultPresets[presetKey];

    if (!preset) {
      console.error(`Preset ${presetKey} not found`);
      return;
    }

    // Stop all sounds
    this.soundManager.stopAllSounds();

    // Reset all volumes to 0
    sounds.forEach((item) => {
      this.currentSoundState[item.id] = 0;
      this.ui.updateSoundVolume(item.id, 0);
      this.ui.updateSoundPlayButton(item.id, false);
    });

    // Appply the preset volumes:
    for (const [soundId, volume] of Object.entries(preset.sounds)) {
      console.log(`Setting volume for ${soundId} to ${volume}`);
      // Set volume state
      this.currentSoundState[soundId] = volume;

      // Update the UI
      this.ui.updateSoundVolume(soundId, volume);

      // Calculate the effective volume
      const effectiveVolume = (volume * this.masterVolume) / 100;

      // Get the audio element
      const audio = this.soundManager.audioElements.get(soundId);

      if (audio) {
        audio.volume = effectiveVolume / 100;

        // Play the sound
        audio.play();
        this.ui.updateSoundPlayButton(soundId, true);
      }
    }

    // Update the main play/pause button state
    this.soundManager.isPlaying = true;
    this.ui.updateMainPlayButton(true);

    /*     // Reset the master volume
    this.masterVolume = 50;

    // Reset the UI
    this.ui.resetUI(); */
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AmbientMixer();
  app.init();

  // make app available for testing in browser
  window.app = app;
});
