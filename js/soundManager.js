export class SoundManager {
  constructor() {
    this.audioElements = new Map();
    this.isPlaying = false;
    console.log('SoundManager initialized');
  }

  // Load a sound file
  loadSound(soundId, filePath) {
    try {
      const audio = new Audio(filePath);
      audio.src = filePath;
      audio.id = soundId;
      audio.loop = true;
      audio.preload = 'metadata';
      // add sound to audio elements map
      this.audioElements.set(soundId, audio);
      console.log(`Sound ${soundId} loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to load sound ${soundId}:`, error);
      return false;
    }
  }
}
