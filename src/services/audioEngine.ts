class HarmonicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Synthesize a pure 432Hz harmonic bell chime
   * @param phase 'inhale' | 'hold' | 'exhale' | 'complete'
   */
  public playChime(phase: 'inhale' | 'hold' | 'exhale' | 'complete' = 'inhale') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Master gain for safety & softness
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.2, now);
      masterGain.connect(this.ctx.destination);

      let frequencies: number[] = [432, 864]; // Fundamental & octave

      if (phase === 'inhale') {
        // Uplifting warm chord: 432Hz, 540Hz (Major third approx), 648Hz (fifth)
        frequencies = [432, 540, 648];
      } else if (phase === 'hold') {
        // Steady grounded octave: 216Hz, 432Hz
        frequencies = [216, 432];
      } else if (phase === 'exhale') {
        // Soft descending release: 432Hz, 324Hz (descending fourth)
        frequencies = [324, 432];
      } else if (phase === 'complete') {
        // Triumphant soothing triad: 216Hz, 432Hz, 648Hz, 864Hz
        frequencies = [216, 432, 648, 864];
      }

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Soft attack envelope (0.05s) to avoid clicks, then exponential decay
        const attack = 0.06;
        const decay = phase === 'complete' ? 3.0 : 1.8;
        const baseVolume = 0.15 / (idx + 1);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(baseVolume, now + attack);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + decay);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch {
      // Audio playback fails gracefully if browser tab is restricted
    }
  }

  /**
   * Optional continuous gentle binaural drone (432Hz Left, 436Hz Right = 4Hz Theta wave)
   */
  private droneOscL: OscillatorNode | null = null;
  private droneOscR: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  public startThetaDrone() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.droneGain) return;

    try {
      const now = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.05, now + 2);
      this.droneGain.connect(this.ctx.destination);

      // Left: 216 Hz
      this.droneOscL = this.ctx.createOscillator();
      this.droneOscL.type = 'sine';
      this.droneOscL.frequency.setValueAtTime(216, now);

      // Right: 220 Hz (4Hz theta differential)
      this.droneOscR = this.ctx.createOscillator();
      this.droneOscR.type = 'sine';
      this.droneOscR.frequency.setValueAtTime(220, now);

      this.droneOscL.connect(this.droneGain);
      this.droneOscR.connect(this.droneGain);

      this.droneOscL.start(now);
      this.droneOscR.start(now);
    } catch {
      // Graceful fallback
    }
  }

  public stopThetaDrone() {
    if (!this.ctx || !this.droneGain) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        try {
          this.droneOscL?.stop();
          this.droneOscR?.stop();
          this.droneOscL?.disconnect();
          this.droneOscR?.disconnect();
          this.droneGain?.disconnect();
        } catch {}
        this.droneOscL = null;
        this.droneOscR = null;
        this.droneGain = null;
      }, 900);
    } catch {
      this.droneGain = null;
    }
  }
}

export const audioEngine = new HarmonicAudioEngine();
