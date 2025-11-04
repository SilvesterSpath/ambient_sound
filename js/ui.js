export class UI {
  constructor() {
    this.soundCardsContainer = null;
    this.masterVolumeSlider = null;
    this.masterVolumeValue = null;
    this.playPauseAllButton = null;
    this.resetButton = null;
    this.modal = null;
    this.customPresetsContainer = null;
    this.timerDisplay = null;
    this.timerSelect = null;
    this.themeToggle = null;
  }

  init() {
    this.soundCardsContainer = document.querySelector('.grid');
    this.masterVolumeSlider = document.getElementById('masterVolume');
    this.masterVolumeValue = document.getElementById('masterVolumeValue');
    this.playPauseAllButton = document.getElementById('playPauseAll');
    this.resetButton = document.getElementById('resetAll');
    this.modal = document.getElementById('savePresetModal');
    this.customPresetsContainer = document.getElementById('customPresets');
    this.timerDisplay = document.getElementById('timerDisplay');
    this.timerSelect = document.getElementById('timerSelect');
    this.themeToggle = document.getElementById('themeToggle');
  }
}
