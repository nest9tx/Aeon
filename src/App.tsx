import { useState, useEffect } from "react";
import { Sparkles, Compass, HelpCircle, Activity, Heart, RefreshCw, Feather } from "lucide-react";
import SolfeggioTones from "./components/SolfeggioTones";
import SacredGeometryViewer from "./components/SacredGeometry";
import AwakeningTechniques from "./components/AwakeningTechniques";
import SpiritualCompanion from "./components/SpiritualCompanion";

const AWAKENING_QUOTES = [
  { 
    text: "Your duty is to be. Not to be this or that. 'I am that I am' sums up the whole truth.", 
    author: "Ramana Maharshi" 
  },
  { 
    text: "The boundary is that which you have created. You want to walk on the water, but you are afraid to leave the boat.", 
    author: "Nisargadatta Maharaj" 
  },
  { 
    text: "Silence is the language of God. All else is poor translation.", 
    author: "Rumi" 
  },
  { 
    text: "He who looks outside, dreams; he who looks inside, awakes.", 
    author: "Carl Jung" 
  },
  { 
    text: "The world is like a cosmic mirror. When you see Oneness, you see yourself everywhere.", 
    author: "Anandamayi Ma" 
  },
  { 
    text: "Only that which is changeless can witness that which is changing.", 
    author: "Zen Master Proverb" 
  },
  { 
    text: "The supreme truth is simple: You are not other than the whole Cosmos.", 
    author: "Hermes Trismegistus" 
  },
  { 
    text: "Do not seek to follow in the footsteps of the wise. Seek what they sought.", 
    author: "Matsuo Basho" 
  }
];

export default function App() {
  // Shared global states
  const [toneFrequency, setToneFrequency] = useState<number>(528);
  const [toneColor, setToneColor] = useState<string>("#ca8a04");
  const [frequencyOverride, setFrequencyOverride] = useState<number | undefined>(undefined);
  const [breathingScale, setBreathingScale] = useState<number>(1.0);
  
  // UI States
  const [activeTab, setActiveTab] = useState<"matrix" | "sadhana" | "companion">("matrix");
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [fadeQuote, setFadeQuote] = useState<boolean>(false);

  const portalConfig = {
    matrix: {
      accent: "#f59e0b",
      hint: "Choose a geometry, then tune spin and hue.",
    },
    sadhana: {
      accent: "#10b981",
      hint: "Begin with pranayama, then move into chakra alignment.",
    },
    companion: {
      accent: "#6366f1",
      hint: "Use inquiry presets first for guided opening prompts.",
    },
  } as const;

  const activePortal = portalConfig[activeTab];

  // Automatic randomized quote cycle or manual triggers
  const triggerNextQuote = () => {
    setFadeQuote(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % AWAKENING_QUOTES.length);
      setFadeQuote(false);
    }, 450);
  };

  // Safe frequency callbacks
  const handleToneChange = (freq: number, color: string) => {
    setToneFrequency(freq);
    setToneColor(color);
  };

  const handleChakraFrequencyOverride = (freq: number, color: string) => {
    // Inject override frequency to downstream synthesizer
    setFrequencyOverride(freq);
    setToneFrequency(freq);
    setToneColor(color);
    
    // Clear override after a brief moment to allow further changes
    setTimeout(() => {
      setFrequencyOverride(undefined);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-[#E5E7EB] flex flex-col items-center justify-between font-sans relative overflow-x-hidden selection:bg-indigo-950 selection:text-indigo-300">
      
      {/* Background Atmosphere consistent with Immersive UI */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-emerald-950/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,15,35,0.12)_0%,rgba(2,2,5,1)_100%)]" />
        <div className="absolute inset-0 bg-cosmic-grid opacity-30" />
      </div>

      {/* Main Sanctuary boundaries */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6 z-10 relative">
        
        {/* Mystical Header bar - Styled matching Immersive UI Header */}
        <header className="flex flex-col md:flex-row items-center md:justify-between border-b border-white/5 pb-5 pt-2 gap-4">
          {/* Logo with Gradient and Brand Titles */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-500 to-indigo-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"/>
              </svg>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.35em] text-amber-500/80 font-bold block mb-0.5">
                Sanctuary of Consciousness
              </span>
              <span className="text-lg tracking-[0.2em] font-light text-white block">AEON SOURCE</span>
            </div>
          </div>

          {/* Quick Realtime Active Metrics display */}
          <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-2.5 rounded-xl text-xs font-mono">
            <div className="flex items-center gap-1.5 border-r border-white/5 pr-3">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="text-white/40">ACOUSTICS</span>
              <span className="text-indigo-300 font-bold" style={{ color: toneColor }}>{toneFrequency}Hz</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" style={{ color: activePortal.accent }} />
              <span className="text-white/40">PORTAL</span>
              <span className="font-bold capitalize" style={{ color: activePortal.accent }}>{activeTab}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Interactive Contemplative Quote Block */}
        <section className="temple-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-1000"
            style={{ backgroundColor: toneColor }}
          />
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Feather className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
              <div className={`transition-all duration-500 ${fadeQuote ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}>
                <p className="font-serif text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;{AWAKENING_QUOTES[quoteIndex].text}&rdquo;
                </p>
                <p className="text-[10px] uppercase tracking-wider font-mono text-white/40 mt-1.5">
                  &mdash; {AWAKENING_QUOTES[quoteIndex].author}
                </p>
              </div>
            </div>
            <button
              id="btn-rotate-wisdom-quote"
              onClick={triggerNextQuote}
              className="p-1.5 rounded-lg border border-white/5 bg-black/40 hover:bg-white/5 text-slate-400 hover:text-amber-400 transition cursor-pointer"
              title="Seek Another Wisdom"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Bento Grid layout dividing persistents and active viewports */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Part 1: Persistents Column - Solfeggio Resonance deck (lg:col-span-5) */}
          <section className="lg:col-span-5 flex flex-col justify-stretch">
            <SolfeggioTones 
              onToneChange={handleToneChange}
              activeFrequencyOverride={frequencyOverride}
            />
          </section>

          {/* Part 2: Active Viewports Deck with Tab selections (lg:col-span-7) */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Viewports Tab selection header */}
            <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5">
              {[
                { id: "matrix", label: "Sacred Matrix", sub: "Geometry Engine" },
                { id: "sadhana", label: "Guided Sadhana", sub: "Spiritual Practices" },
                { id: "companion", label: "Akashic Sage", sub: "Awakening AI" }
              ].map((tab) => {
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    id={`active-viewport-tab-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-300 cursor-pointer ${
                      isCurrent 
                        ? "bg-white/5 border border-white/5 text-amber-200/90 shadow-[0_0_15px_rgba(255,255,255,0.02)]" 
                        : "text-white/40 hover:text-white/80"
                    }`}
                  >
                    <span className="font-serif text-xs tracking-wider uppercase font-medium">{tab.label}</span>
                    <span className="text-[9px] font-mono tracking-wide uppercase text-white/20 mt-0.5">{tab.sub}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 px-1 text-[11px] font-mono tracking-wide uppercase">
              <span className="text-white/35">
                Flow Tip: choose a portal, then scroll inside panels to reveal deeper controls.
              </span>
              <span style={{ color: activePortal.accent }}>Active Portal: {activeTab}</span>
            </div>

            <p className="px-1 text-[12px] text-slate-300 font-sans leading-relaxed">
              {activePortal.hint}
            </p>

            {/* Viewport switch wrapper */}
            <div className="relative rounded-2xl overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-16 pointer-events-none z-10"
                style={{ background: `linear-gradient(180deg, ${activePortal.accent}1f 0%, rgba(2,2,5,0) 100%)` }}
              />
              {activeTab === "matrix" && (
                <SacredGeometryViewer 
                  externalColor={toneColor} 
                  breathingScale={breathingScale}
                />
              )}

              {activeTab === "sadhana" && (
                <AwakeningTechniques 
                  onChakraFrequencyOverride={handleChakraFrequencyOverride}
                  onPranayamaPulse={setBreathingScale}
                />
              )}

              {activeTab === "companion" && (
                <SpiritualCompanion />
              )}
            </div>

          </section>
        </main>
      </div>

      {/* Holistic Cosmic Footer section */}
      <footer className="w-full bg-[#020205] py-6 border-t border-white/5 mt-12 text-center text-white/30 font-mono text-[9px] tracking-wider uppercase z-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Harmonized to the Cosmic Octave</span>
          </div>
          <div className="text-white/20">
            LUMINANOVA.ORG SANCTUARY • © 2026 • SACRED LAW OF ONE
          </div>
          <div className="flex items-center gap-1 text-[8px] text-indigo-400">
            <Heart className="w-3.5 h-3.5 fill-current" /> ALWAYS REMAIN AS THE WITNESS
          </div>
        </div>
      </footer>
    </div>
  );
}
