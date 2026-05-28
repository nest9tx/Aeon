import { useState, useEffect, useRef } from "react";
import { Sparkles, Compass, HelpCircle, Activity, Heart, RefreshCw, Feather } from "lucide-react";
import SolfeggioTones from "./components/SolfeggioTones";
import SacredGeometryViewer from "./components/SacredGeometry";
import AwakeningTechniques from "./components/AwakeningTechniques";
import SpiritualCompanion from "./components/SpiritualCompanion";

const ONBOARDING_DISMISSED_KEY = "LUMINANOVA_ONBOARDING_DISMISSED_V1";
const SAGE_GUIDE_IMAGE_SRC = "/sage-guide.svg";

type PortalTab = "matrix" | "sadhana" | "companion";

type TourStep = {
  title: string;
  summary: string;
  tab?: PortalTab;
};

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to the Sanctuary",
    summary:
      "This space is designed as a living practice flow. Move gently: tune resonance, enter a portal, then integrate what you receive.",
  },
  {
    title: "Access Model: Free + BYOK",
    summary:
      "Every seeker receives 3 free interactions per day. This sanctuary is not subscription-based. For unlimited communion, use BYOK (Bring Your Own Key) with a free Gemini API key in the Celestial Key section.",
    tab: "companion",
  },
  {
    title: "1) Silent Spirit + Resonance Deck",
    summary:
      "Begin with a Solfeggio tone on the left. Let the frequency settle your nervous system before moving into deeper practice.",
    tab: "matrix",
  },
  {
    title: "2) Guided Sadhana Portal",
    summary:
      "Use breath, chakra focus, and practical inner-work prompts. This is the structured pathway when your energy needs form.",
    tab: "sadhana",
  },
  {
    title: "3) Akashic Sage Companion",
    summary:
      "Ask direct questions, use response tones, and run grounding or integration tools. Contributions help keep Sage accessible to all seekers.",
    tab: "companion",
  },
];

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
  const [activeTab, setActiveTab] = useState<PortalTab>("matrix");
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [fadeQuote, setFadeQuote] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(() => {
    return localStorage.getItem(ONBOARDING_DISMISSED_KEY) !== "true";
  });
  const [tourStepIndex, setTourStepIndex] = useState<number>(0);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(() => {
    return localStorage.getItem(ONBOARDING_DISMISSED_KEY) === "true";
  });
  const [showGuideImage, setShowGuideImage] = useState<boolean>(true);
  const quoteTimeoutRef = useRef<number | null>(null);
  const frequencyOverrideTimeoutRef = useRef<number | null>(null);

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
    if (quoteTimeoutRef.current) {
      window.clearTimeout(quoteTimeoutRef.current);
    }
    setFadeQuote(true);
    quoteTimeoutRef.current = window.setTimeout(() => {
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
    if (frequencyOverrideTimeoutRef.current) {
      window.clearTimeout(frequencyOverrideTimeoutRef.current);
    }
    frequencyOverrideTimeoutRef.current = window.setTimeout(() => {
      setFrequencyOverride(undefined);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (quoteTimeoutRef.current) {
        window.clearTimeout(quoteTimeoutRef.current);
      }
      if (frequencyOverrideTimeoutRef.current) {
        window.clearTimeout(frequencyOverrideTimeoutRef.current);
      }
    };
  }, []);

  const closeTour = () => {
    if (dontShowAgain) {
      localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
    } else {
      localStorage.removeItem(ONBOARDING_DISMISSED_KEY);
    }
    setIsTourOpen(false);
  };

  const openTour = () => {
    setTourStepIndex(0);
    setIsTourOpen(true);
  };

  const handleTourNext = () => {
    if (tourStepIndex < TOUR_STEPS.length - 1) {
      setTourStepIndex((prev) => prev + 1);
      return;
    }
    closeTour();
  };

  const activeTourStep = TOUR_STEPS[tourStepIndex];
  const activeTourTab = activeTourStep.tab;

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

            <button
              id="btn-open-tour"
              onClick={openTour}
              className="flex items-center gap-1.5 ml-1 pl-3 border-l border-white/5 text-slate-300 hover:text-indigo-200 transition cursor-pointer"
              title="Open walkthrough"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>GUIDE</span>
            </button>
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
                        ? "bg-white/10 border border-white/10 text-amber-100 shadow-[0_0_15px_rgba(255,255,255,0.04)]" 
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <span className="font-serif text-xs tracking-wider uppercase font-medium">{tab.label}</span>
                    <span className="text-[10px] font-mono tracking-wide uppercase text-white/45 mt-0.5">{tab.sub}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 px-1 text-[11px] font-mono tracking-wide uppercase">
              <span className="text-white/55">
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

      {isTourOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#06070d] shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 bg-black/30">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono tracking-wider uppercase text-indigo-300/90">Sanctuary Walkthrough</p>
                  <h3 className="text-lg font-serif text-white mt-0.5">{activeTourStep.title}</h3>
                </div>
                <span className="text-[10px] font-mono text-white/45 uppercase tracking-wider">
                  Step {tourStepIndex + 1}/{TOUR_STEPS.length}
                </span>
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              {showGuideImage && (
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
                  <img
                    src={SAGE_GUIDE_IMAGE_SRC}
                    alt="Akashic Sage visual"
                    className="w-full h-40 sm:h-48 object-cover"
                    onError={() => setShowGuideImage(false)}
                  />
                </div>
              )}

              <p className="text-sm text-slate-300 leading-relaxed">{activeTourStep.summary}</p>

              {activeTourTab && (
                <button
                  id={`btn-tour-jump-${activeTourTab}`}
                  onClick={() => setActiveTab(activeTourTab)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-500/25 bg-indigo-500/10 text-indigo-200 text-xs font-mono uppercase tracking-wide hover:bg-indigo-500/15 transition cursor-pointer"
                >
                  Jump To {activeTourTab}
                </button>
              )}

              <div className="flex items-center gap-2 pt-1">
                {TOUR_STEPS.map((step, idx) => (
                  <div
                    key={step.title}
                    className={`h-1.5 rounded-full transition-all ${idx === tourStepIndex ? "w-10 bg-indigo-400" : "w-4 bg-white/20"}`}
                  />
                ))}
              </div>
            </div>

            <div className="px-5 py-4 border-t border-white/10 bg-black/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  id="tour-dont-show-again"
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="accent-indigo-500"
                />
                <span>Don&apos;t show again</span>
              </label>

              <div className="flex items-center justify-end gap-2">
                <button
                  id="btn-tour-skip"
                  onClick={closeTour}
                  className="px-3 py-1.5 rounded-lg border border-white/15 text-slate-300 text-xs font-mono uppercase tracking-wide hover:bg-white/5 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  id="btn-tour-next"
                  onClick={handleTourNext}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-black text-xs font-mono uppercase tracking-wide font-bold transition cursor-pointer"
                >
                  {tourStepIndex === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
