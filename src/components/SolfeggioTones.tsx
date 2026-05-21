import { useState, useEffect, useRef } from "react";
import { Play, Square, Radio, Activity, Sparkles, Volume2 } from "lucide-react";
import { SolfeggioTone } from "../types";

export const SOLFEGGIO_TONES: SolfeggioTone[] = [
  {
    id: "174",
    frequency: 174,
    name: "Foundation",
    syllable: "Pain Relief",
    translation: "Grounding & Security",
    description: "Acts as a natural anesthetic, relieves physical pain, tension, and creates a secure foundation for healing.",
    chakra: "Sub-Root / Grounding Link",
    color: "#475569", // slate
    colorName: "Slate",
  },
  {
    id: "285",
    frequency: 285,
    name: "Quantum Rejuvenation",
    syllable: "Cognitive Healing",
    translation: "Cellular Restoration",
    description: "Heals damaged tissue, organs, and restructures cellular fields. Restores energetic blueprint and physical vitality.",
    chakra: "Root / Bio-field",
    color: "#b45309", // amber-700
    colorName: "Amber",
  },
  {
    id: "396",
    frequency: 396,
    name: "UT",
    syllable: "Liberate Guilt & Fear",
    translation: "Turning Grief into Joy",
    description: "Clears guilt, subconscious blocks, and deep-seated fears. Empowers seekers to realize personal truth and divine alignment.",
    chakra: "Root (Muladhara)",
    color: "#dc2626", // red
    colorName: "Ruby Red",
  },
  {
    id: "417",
    frequency: 417,
    name: "RE",
    syllable: "Facilitate Change",
    translation: "Undoing Karma & Traumas",
    description: "Clears negative energy, destructive mental blocks, and habitual patterns. Helps embrace cosmic transitions.",
    chakra: "Sacral (Svadhisthana)",
    color: "#ea580c", // orange
    colorName: "Saffron Orange",
  },
  {
    id: "528",
    frequency: 528,
    name: "MI",
    syllable: "Transformation & Miracles",
    translation: "DNA repair & Love",
    description: "The vibration of love, miracles, and cell renewal. Brings clarity, peace, increases spiritual receptivity and light.",
    chakra: "Solar Plexus (Manipura)",
    color: "#ca8a04", // yellow-600
    colorName: "Solar Gold",
  },
  {
    id: "639",
    frequency: 639,
    name: "FA",
    syllable: "Harmonize Connection",
    translation: "Relationships & Unity",
    description: "Bridges relationship splits, expands empathy, and restores interpersonal harmony. Cultivates true soul connections.",
    chakra: "Heart (Anahata)",
    color: "#16a34a", // green
    colorName: "Emerald Green",
  },
  {
    id: "741",
    frequency: 741,
    name: "SOL",
    syllable: "Awaken Intuition",
    translation: "Expression & Purification",
    description: "Clears toxins, viral layers, and heavy energetic blockages. Promotes pure creative expression and verbal power.",
    chakra: "Throat (Vishuddha)",
    color: "#0284c7", // sky
    colorName: "Celestial Blue",
  },
  {
    id: "852",
    frequency: 852,
    name: "LA",
    syllable: "Spiritual Order",
    translation: "Lucid Vision & Deep Sight",
    description: "Awakens the third eye to see through illusions. Reconnects the individual intellect to supreme stellar consciousness.",
    chakra: "Third Eye (Ajna)",
    color: "#4f46e5", // indigo
    colorName: "Cosmic Indigo",
  },
  {
    id: "963",
    frequency: 963,
    name: "TI",
    syllable: "Pure Oneness",
    translation: "Crown Crown Consciousness",
    description: "Connects to infinite universal energy. Restores the crown chakra, revealing that you are not separate from the Cosmos.",
    chakra: "Crown (Sahasrara)",
    color: "#9333ea", // purple
    colorName: "Lotus Violet",
  },
];

interface SolfeggioTonesProps {
  onToneChange?: (frequency: number, color: string) => void;
  activeFrequencyOverride?: number;
}

export default function SolfeggioTones({ onToneChange, activeFrequencyOverride }: SolfeggioTonesProps) {
  const [selectedTone, setSelectedTone] = useState<SolfeggioTone>(SOLFEGGIO_TONES[4]); // 528Hz standard

  useEffect(() => {
    if (activeFrequencyOverride) {
      const match = SOLFEGGIO_TONES.find((t) => t.frequency === activeFrequencyOverride);
      if (match) {
        setSelectedTone(match);
      }
    }
  }, [activeFrequencyOverride]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.4);
  const [binauralEnabled, setBinauralEnabled] = useState<boolean>(true);
  const [brainwaveState, setBrainwaveState] = useState<string>("theta"); // theta (4Hz), alpha (10Hz), delta (2Hz)
  const [shimmerEnabled, setShimmerEnabled] = useState<boolean>(true);
  const [waveShape, setWaveShape] = useState<OscillatorType>("sine");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Audio nodes refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);
  const leftGainRef = useRef<GainNode | null>(null);
  const rightGainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);

  // Frequency mapping for brainwaves
  const getBrainwaveOffset = (state: string) => {
    switch (state) {
      case "delta": return 2.0; // sleep, cosmic connection
      case "theta": return 4.5; // deep meditation, subconscious healing
      case "alpha": return 9.6; // creative calm, mental presence
      default: return 4.5;
    }
  };

  useEffect(() => {
    if (onToneChange) {
      onToneChange(selectedTone.frequency, selectedTone.color);
    }
    // If playing, update oscillators frequency dynamically without clicking stop
    if (isPlaying) {
      updateOscillatorFrequency();
    }
  }, [selectedTone]);

  useEffect(() => {
    if (isPlaying) {
      updateOscillatorFrequency();
    }
  }, [binauralEnabled, brainwaveState, waveShape]);

  useEffect(() => {
    if (mainGainRef.current && audioCtxRef.current) {
      mainGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      reconfigureLFO();
    }
  }, [shimmerEnabled]);

  const updateOscillatorFrequency = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const baseFreq = selectedTone.frequency;
    const offset = binauralEnabled ? getBrainwaveOffset(brainwaveState) : 0;

    const leftFreq = baseFreq - (binauralEnabled ? offset / 2 : 0);
    const rightFreq = baseFreq + (binauralEnabled ? offset / 2 : 0);

    const now = ctx.currentTime;
    if (leftOscRef.current) {
      leftOscRef.current.type = waveShape;
      leftOscRef.current.frequency.setTargetAtTime(leftFreq, now, 0.1);
    }
    if (rightOscRef.current) {
      rightOscRef.current.type = waveShape;
      rightOscRef.current.frequency.setTargetAtTime(rightFreq, now, 0.1);
    }
  };

  const reconfigureLFO = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (shimmerEnabled) {
      // Create LFO if config changed
      if (!lfoRef.current) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        // 0.12Hz slow swell
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.15, ctx.currentTime); // modulate up to 15%

        // Connect LFO oscillation to the main gain node's gain parameter
        if (mainGainRef.current) {
          lfo.connect(lfoGain);
          lfoGain.connect(mainGainRef.current.gain);
          lfo.start();
          lfoRef.current = lfo;
        }
      }
    } else {
      if (lfoRef.current) {
        try {
          lfoRef.current.stop();
        } catch (e) {}
        lfoRef.current.disconnect();
        lfoRef.current = null;
      }
    }
  };

  const startTones = () => {
    try {
      // 1. Initialize Audio Context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // 2. Main Gain Control
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(volume, ctx.currentTime);
      mainGainRef.current = mainGain;

      // 3. Low Pass Filter to make it warmer & cut digital harshness
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(selectedTone.frequency * 3.5, ctx.currentTime); // allow up to third harmonic
      filterRef.current = filter;

      // 4. Analyser Node for Visual Osmosis
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Connect path: sound sources -> filter -> mainGain -> Analyser -> Output
      filter.connect(mainGain);
      mainGain.connect(analyser);
      analyser.connect(ctx.destination);

      // 5. Left and Right Channel Splitters (For Binaural Beats separation)
      const splitter = ctx.createChannelMerger(2);
      splitter.connect(filter);

      const leftGain = ctx.createGain();
      const rightGain = ctx.createGain();

      // Pan Left to channel 0, Pan Right to channel 1
      leftGain.connect(splitter, 0, 0);
      rightGain.connect(splitter, 0, 1);

      leftGainRef.current = leftGain;
      rightGainRef.current = rightGain;

      // 6. Creating Oscillators
      const leftOsc = ctx.createOscillator();
      const rightOsc = ctx.createOscillator();

      leftOscRef.current = leftOsc;
      rightOscRef.current = rightOsc;

      leftOsc.connect(leftGain);
      rightOsc.connect(rightGain);

      // Apply initial shapes and frequencies
      updateOscillatorFrequency();

      // Start sound
      leftOsc.start();
      rightOsc.start();

      // Enable LFO for organic Tibetan singing-bowl "Shimmering swell"
      reconfigureLFO();

      setIsPlaying(true);
      drawOscilloscope();
    } catch (e) {
      console.error("Web Audio API start error", e);
    }
  };

  const stopTones = () => {
    if (leftOscRef.current) {
      try { leftOscRef.current.stop(); } catch (e) {}
      leftOscRef.current.disconnect();
      leftOscRef.current = null;
    }
    if (rightOscRef.current) {
      try { rightOscRef.current.stop(); } catch (e) {}
      rightOscRef.current.disconnect();
      rightOscRef.current = null;
    }
    if (lfoRef.current) {
      try { lfoRef.current.stop(); } catch (e) {}
      lfoRef.current.disconnect();
      lfoRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    clearAnalyserCanvas();
  };

  const clearAnalyserCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawOscilloscope = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      // Loop request
      animationFrameId.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "rgba(10, 10, 15, 0.4)"; // slight trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = selectedTone.color;

      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // value centered around 128
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Subtle glow matching the tone's chakra
      ctx.shadowBlur = 10;
      ctx.shadowColor = selectedTone.color;
    };

    draw();
  };

  // Safe release on component unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (leftOscRef.current) { leftOscRef.current.disconnect(); }
      if (rightOscRef.current) { rightOscRef.current.disconnect(); }
      if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}); }
    };
  }, []);

  return (
    <div id="solfeggio-audio" className="temple-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-500">
      {/* Background glow matching chakra */}
      <div 
        className="absolute -right-24 -top-24 w-56 h-56 rounded-full blur-[80px] pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: selectedTone.color, opacity: isPlaying ? 0.22 : 0.08 }}
      />

      <div className="flex flex-col gap-8">
        {/* Solfeggio Menu Selector - Left Column */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <Radio className="w-5 h-5" style={{ color: selectedTone.color }} />
            <h3 className="font-serif text-lg tracking-wider text-slate-100 font-medium">
              Solfeggio Frequencies
            </h3>
          </div>
          
          <p className="text-xs text-slate-400 mb-5 leading-relaxed font-sans">
            Spiritual frequencies used for millennia to restore core biological harmony, release fear, and trigger energetic awakening. Select a harmonic center:
          </p>

          <div className="mb-3 text-[10px] font-mono uppercase tracking-wider text-indigo-300/80">
            Start Here: pick a tone tile, then tune and play in the control deck below.
          </div>

          <div className="grid grid-cols-2 2xl:grid-cols-3 gap-2.5">
            {SOLFEGGIO_TONES.map((tone) => {
              const isCurrent = tone.id === selectedTone.id;
              return (
                <button
                  id={`tone-select-${tone.id}`}
                  key={tone.id}
                  onClick={() => setSelectedTone(tone)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                    isCurrent 
                      ? "border-indigo-500/40 bg-indigo-500/10 scale-[1.02] shadow-[0_0_15px_rgba(99,102,241,0.15)]" 
                      : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm font-bold" style={{ color: tone.color }}>
                      {tone.frequency} Hz
                    </span>
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: tone.color, boxShadow: `0 0 6px ${tone.color}` }}
                    />
                  </div>
                  <span className="text-[10px] font-serif uppercase tracking-wide leading-snug text-slate-200">
                    {tone.name} • {tone.syllable}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans leading-tight">
                    {tone.chakra}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Audio Controls & Visualizer - Right Column */}
        <div className="w-full flex flex-col justify-between border-t border-slate-800/80 pt-6">
          <div className="flex flex-col items-center">
            {/* Visualizer Circle representation */}
            <div className="relative w-44 h-24 mb-4 rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60 shadow-inner">
              <canvas 
                ref={canvasRef} 
                width={176} 
                height={96}
                className="w-full h-full block"
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <Activity className="w-5 h-5 text-slate-600 animate-pulse" />
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest">SILENT SPIRIT</span>
                </div>
              )}
              {isPlaying && (
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                  <span className="text-[9px] text-green-400 font-mono uppercase tracking-wider">Acoustic Resonance Pure</span>
                </div>
              )}
            </div>

            {/* Current Selection details */}
            <div className="text-center w-full mb-4 px-2">
              <h4 className="font-serif text-base text-slate-200 mt-1">
                {selectedTone.frequency}Hz • {selectedTone.syllable}
              </h4>
              <p className="text-[11px] text-amber-500 font-serif tracking-widest uppercase mb-1.5">
                {selectedTone.translation}
              </p>
              <p className="text-[9px] font-mono uppercase tracking-wider text-white/35 mb-1">
                Scroll description if truncated
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed max-h-16 overflow-y-auto pr-1">
                {selectedTone.description}
              </p>
            </div>

            {/* Volume Control */}
            <div className="w-full mb-4 px-1">
              <div className="flex justify-between items-center mb-1 text-[11px] font-sans text-slate-400">
                <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> Resonance Amplification</span>
                <span className="font-mono">{Math.floor(volume * 100)}%</span>
              </div>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="0.8" // capped at 0.8 to prevent excessive volume clipping
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:bg-white/20 transition"
              />
            </div>

            {/* Entrainment toggles */}
            <div className="w-full space-y-2 mb-4 bg-black/40 p-2.5 rounded-xl border border-white/5">
              {/* Binaural Entrainment */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <button
                  id="toggle-binaural"
                  onClick={() => setBinauralEnabled(!binauralEnabled)}
                  className={`flex items-center gap-1.5 text-xs text-left font-serif cursor-pointer ${
                    binauralEnabled ? "text-indigo-400" : "text-white/40"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Binaural Beats</span>
                </button>
                
                {binauralEnabled && (
                  <select
                     id="select-brainwave-state"
                     value={brainwaveState}
                     onChange={(e) => setBrainwaveState(e.target.value)}
                     className="w-full sm:w-auto text-[10px] bg-[#020205] text-slate-300 border border-white/10 rounded px-1.5 py-0.5 font-mono cursor-pointer outline-none focus:border-indigo-500"
                  >
                    <option value="delta">Delta (2.0Hz • Astral Sleep)</option>
                    <option value="theta">Theta (4.5Hz • Awakening)</option>
                    <option value="alpha">Alpha (9.6Hz • Present Calm)</option>
                  </select>
                )}
              </div>

              {/* LFO Modulation Shimmer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <button
                  id="toggle-shimmer"
                  onClick={() => setShimmerEnabled(!shimmerEnabled)}
                  className={`flex items-center gap-1.5 text-xs text-left font-serif cursor-pointer ${
                    shimmerEnabled ? "text-indigo-400" : "text-white/40"
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Ambient Shimmer (LFO)</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <select
                     id="select-osc-shape"
                     value={waveShape}
                     onChange={(e) => setWaveShape(e.target.value as OscillatorType)}
                     className="w-full sm:w-auto text-[10px] bg-[#020205] text-slate-300 border border-white/10 rounded px-1 py-0.5 font-mono cursor-pointer outline-none focus:border-indigo-500"
                  >
                    <option value="sine">Sine (Pure)</option>
                    <option value="triangle">Triangle (Warm)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Master Play Button */}
          <div className="mt-2">
            {!isPlaying ? (
              <button
                id="btn-play-acoustic-tone"
                onClick={startTones}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-serif font-bold text-sm tracking-widest shadow-lg shadow-indigo-950/20 hover:shadow-indigo-500/10 cursor-pointer active:scale-95 transition-all duration-300"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>INITIATE RESONANCE</span>
              </button>
            ) : (
              <button
                id="btn-stop-acoustic-tone"
                onClick={stopTones}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-rose-800 hover:border-rose-600 bg-rose-950/30 text-rose-400 font-serif font-bold text-sm tracking-widest cursor-pointer active:scale-95 transition-all duration-300"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>SILENCE CHANT</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
