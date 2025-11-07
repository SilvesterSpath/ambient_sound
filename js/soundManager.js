export class SoundManager {
  constructor() {
    this.audioElements = new Map();
    this.isPlaying = false;
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

  // Play a sound
  async playSound(soundId) {
    const audio = this.audioElements.get(soundId);

    if (audio) {
      try {
        await audio.play();
        return true;
      } catch (error) {
        console.error(`Failed to play sound ${soundId}:`, error);
        return false;
      }
    }
  }

  // Pause a sound
  async pauseSound(soundId) {
    const audio = this.audioElements.get(soundId);
    if (audio && !audio.paused) {
      try {
        await audio.pause();
        return true;
      } catch (error) {
        console.error(`Failed to pause sound ${soundId}:`, error);
        return false;
      }
    }
  }

  // Set volume for a sound (0-100)
  setVolume(soundId, volume) {
    const audio = this.audioElements.get(soundId);
    if (!audio) {
      console.error(`Sound ${soundId} not found`);
      return false;
    }

    // Convert volume to decimal (0-1)
    const volumeDecimal = volume / 100;
    audio.volume = volumeDecimal;
    console.log(`Sound ${soundId} volume set to ${volume}%`);
    return true;
  }
}
