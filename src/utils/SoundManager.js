class SoundManager {
    constructor() {
        this.audioContext = null;
        this.noiseSource = null;
        this.noiseGain = null;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // --- Tone Generation (Beeps) ---
    playTone(frequency, type, duration) {
        if (!this.audioContext) this.init();
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + duration);
    }

    playStart() {
        this.playTone(600, 'sine', 0.1);
        setTimeout(() => this.playTone(800, 'sine', 0.2), 100);
    }

    playPause() {
        this.playTone(800, 'sine', 0.1);
        setTimeout(() => this.playTone(600, 'sine', 0.2), 100);
    }

    playComplete() {
        this.playTone(523.25, 'sine', 0.6); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.6), 200); // E5
        setTimeout(() => this.playTone(783.99, 'sine', 0.8), 400); // G5
        setTimeout(() => this.playTone(1046.50, 'sine', 1.2), 600); // C6
    }

    playTaskComplete() {
        this.playTone(1200, 'triangle', 0.1);
    }

    // --- Noise Generation (Ambience) ---
    toggleNoise(shouldPlay) {
        if (!this.audioContext) this.init();
        if (this.audioContext.state === 'suspended') this.audioContext.resume();

        if (shouldPlay) {
            if (this.noiseSource) return; // Already playing

            const bufferSize = this.audioContext.sampleRate * 2; // 2 seconds
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                // Simple white noise
                data[i] = Math.random() * 2 - 1;
            }

            this.noiseSource = this.audioContext.createBufferSource();
            this.noiseSource.buffer = buffer;
            this.noiseSource.loop = true;

            // Filter to make it softer (Pink/Brown noise-like)
            const biquadFilter = this.audioContext.createBiquadFilter();
            biquadFilter.type = "lowpass";
            biquadFilter.frequency.value = 400;

            this.noiseGain = this.audioContext.createGain();
            this.noiseGain.gain.value = 0.05; // Low volume

            this.noiseSource.connect(biquadFilter);
            biquadFilter.connect(this.noiseGain);
            this.noiseGain.connect(this.audioContext.destination);

            this.noiseSource.start();
        } else {
            if (this.noiseSource) {
                this.noiseSource.stop();
                this.noiseSource.disconnect();
                this.noiseSource = null;
            }
        }
    }
}

export default new SoundManager();
