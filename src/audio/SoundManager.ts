/**
 * Mars Mission Web Audio Procedural Synthesizer
 * Provides atmospheric Martian soundscapes, engine hums, radio squelches, and GTA-style stingers.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private stormNoiseNode: AudioNode | null = null;
  private stormGain: GainNode | null = null;
  private stormFilter: BiquadFilterNode | null = null;
  private lastFootstepTime = 0;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Objective updated - GTA V style dramatic synth brass stinger
  public playObjectiveStinger() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    
    // Sub bass drop
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(110, t);
    subOsc.frequency.exponentialRampToValueAtTime(45, t + 0.8);

    subGain.gain.setValueAtTime(0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(t);
    subOsc.stop(t + 0.9);

    // High chord brass chime
    const chords = [330, 440, 554];
    chords.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + 0.05 * idx);

      gain.gain.setValueAtTime(0.2, t + 0.05 * idx);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + 0.05 * idx);
      osc.stop(t + 1.2);
    });
  }

  // Radio squelch / transmission beep
  public playRadioBeep() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.setValueAtTime(2100, t + 0.04);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Subtle typewriter click
  public playTypewriterTick() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, t);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  // Footstep crunch on Martian soil
  public playFootstep() {
    const now = Date.now();
    if (now - this.lastFootstepTime < 280) return;
    this.lastFootstepTime = now;

    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450 + Math.random() * 100, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
  }

  // Rover engine sound (pitch scaled with speed)
  public updateEngine(speedRatio: number, isDriving: boolean) {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted || !isDriving) {
      if (this.engineGain && this.ctx) {
        this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
      return;
    }

    const t = this.ctx.currentTime;
    if (!this.engineOsc) {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      this.engineOsc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, t);

      this.engineGain.gain.setValueAtTime(0, t);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.masterGain);
      this.engineOsc.start(t);
    }

    const targetFreq = 55 + speedRatio * 90;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, t, 0.08);
    const targetVolume = 0.08 + speedRatio * 0.16;
    this.engineGain!.gain.setTargetAtTime(targetVolume, t, 0.05);
  }

  public stopEngine() {
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }
  }

  // Rock collision metallic crash & thud
  public playCrash() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Metal thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.4);

    // Metal scrape noise
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(600, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t);
  }

  // Equipment pickup chime
  public playPickup() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0.18, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.35);
    });
  }

  // Relay repair hum & power up
  public playRepairHum() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 2.2);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 2.2);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 1.8);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 2.5);
  }

  // Warning alarm (Low Oxygen / Rover condition)
  public playWarningAlarm() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(659, t + 0.12);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  // Dust storm howling ambient wind
  public setStormWind(active: boolean) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    if (active && !this.stormNoiseNode) {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.2;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      this.stormFilter = this.ctx.createBiquadFilter();
      this.stormFilter.type = 'bandpass';
      this.stormFilter.frequency.setValueAtTime(320, t);
      this.stormFilter.Q.setValueAtTime(3.0, t);

      this.stormGain = this.ctx.createGain();
      this.stormGain.gain.setValueAtTime(0, t);
      this.stormGain.gain.setTargetAtTime(0.28, t, 1.5);

      noise.connect(this.stormFilter);
      this.stormFilter.connect(this.stormGain);
      this.stormGain.connect(this.masterGain);

      noise.start(t);
      this.stormNoiseNode = noise;
    } else if (!active && this.stormGain && this.ctx) {
      this.stormGain.gain.setTargetAtTime(0, t, 1.0);
    }
  }

  // Mission Complete Fanfare
  public playMissionSuccess() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const chords = [
      { freq: 261.63, delay: 0 },
      { freq: 329.63, delay: 0.12 },
      { freq: 392.00, delay: 0.24 },
      { freq: 523.25, delay: 0.36 },
      { freq: 659.25, delay: 0.6 },
      { freq: 783.99, delay: 0.8 },
      { freq: 1046.5, delay: 1.0 },
    ];

    chords.forEach(({ freq, delay }) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0.22, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + delay);
      osc.stop(t + delay + 1.3);
    });
  }

  // Mission Failed / Critical O2 loss
  public playMissionFailed() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const tones = [440, 415.3, 370, 311.13, 220];
    tones.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + idx * 0.3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, t + idx * 0.3);

      gain.gain.setValueAtTime(0.25, t + idx * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.3 + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + idx * 0.3);
      osc.stop(t + idx * 0.3 + 0.85);
    });
  }
}

export const sounds = new SoundManager();
