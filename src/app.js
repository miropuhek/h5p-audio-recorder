import Vue from 'vue';
import RecordingWrapper from './views/RecordingWrapper.vue';
import Recorder from 'components/Recorder';

export default class {

  /**
   * @typedef {Object} Parameters
   *
   * @property {string} title Title
   * @property {Object} l10n Translations
   * @property {string} l10n.finishedRecording Finished recording audio
   * @property {string} l10n.microphoneInaccessible Microphone blocked
   */

  /**
   * @constructor
   *
   * @param {Parameters} params Content type parameters
   * @param {string} contentId
   * @param {object} contentData
   */
  constructor(params, contentId, contentData = {}) {
    const rootElement = document.createElement('div');
    rootElement.classList.add('h5p-audio-recorder');

    const statusMessages = {
      ready: 'Press a button below to record your answer',
      recording: 'Recording...',
      paused: 'Recording paused. Press a button to continue recording.',
      finished: params.l10n.finishedRecording,
      error: params.l10n.microphoneInaccessible
    };

    this.recorder = new Recorder();

    RecordingWrapper.data = () => ({
      title: params.title,
      state: 'ready',
      statusMessages
    });

    // Create recording wrapper view
    const recordingWrapper = new Vue({...RecordingWrapper});

    // Start recording when record button is pressed
    recordingWrapper.$on('recording', () => {
      this.recorder.start();
    });

    // Update UI when on recording events
    this.recorder.on('recording-started', () => {
      recordingWrapper.state = 'recording';
    });

    this.recorder.on('recording-blocked', () => {
      recordingWrapper.state = 'error';
    });

    /**
     * Attach library to wrapper
     *
     * @param {jQuery} $wrapper
     */
    this.attach = function ($wrapper) {
      $wrapper.get(0).appendChild(rootElement);
      recordingWrapper.$mount(rootElement);
    };
  }
}
