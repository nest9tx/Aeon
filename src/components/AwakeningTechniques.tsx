import { useState, useEffect, useRef } from "react";
import { Wind, Heart, HelpCircle, ShieldAlert, Sparkles, ChevronRight, ChevronLeft, RefreshCw, CheckCircle } from "lucide-react";
import { ChakraData, InquiryStep, SymptomCard } from "../types";

const CHAKRAS: ChakraData[] = [
  {
    name: "Crown",
    sanskritName: "Sahasrara",
    location: "Top of head",
    element: "Cosmic Mind / Ether",
    colorName: "Violet",
    colorHex: "#9333ea",
    frequency: 963,
    mantra: "AH",
    physicalRelation: "Pineal Gland, Brain cortex",
    affirmation: "I am connected to the infinite cosmic source. I am pure spacious Oneness.",
  },
  {
    name: "Third Eye",
    sanskritName: "Ajna",
    location: "Between the brows",
    element: "Light",
    colorName: "Indigo",
    colorHex: "#4f46e5",
    frequency: 852,
    mantra: "OM",
    physicalRelation: "Pituitary Gland, Eyes, Intuition centers",
    affirmation: "I see through all worldly illusions. My divine inner wisdom is my absolute compass.",
  },
  {
    name: "Throat",
    sanskritName: "Vishuddha",
    location: "Throat valley",
    element: "Sound / Resonance",
    colorName: "Blue",
    colorHex: "#0284c7",
    frequency: 741,
    mantra: "HAM",
    physicalRelation: "Thyroid gland, Vocal cords, Ears",
    affirmation: "I speak and manifest my sovereign truth. I express myself with absolute alignment.",
  },
  {
    name: "Heart",
    sanskritName: "Anahata",
    location: "Center of chest",
    element: "Air",
    colorName: "Green",
    colorHex: "#16a34a",
    frequency: 639,
    mantra: "YAM",
    physicalRelation: "Heart organ, Lungs, Thymus gland",
    affirmation: "I forgive fully, love unconditionally, and receive the cosmic heart in all things.",
  },
  {
    name: "Solar Plexus",
    sanskritName: "Manipura",
    location: "Above navel",
    element: "Fire",
    colorName: "Gold",
    colorHex: "#ca8a04",
    frequency: 528,
    mantra: "RAM",
    physicalRelation: "Digestive system, Adrenals, Pancreas",
    affirmation: "I surrender personal ego. I am filled with infinite power and unconditional peace.",
  },
  {
    name: "Sacral",
    sanskritName: "Svadhisthana",
    location: "Below navel",
    element: "Water",
    colorName: "Orange",
    colorHex: "#ea580c",
    frequency: 417,
    mantra: "VAM",
    physicalRelation: "Reproductive system, Sacrum, Kidneys",
    affirmation: "I flow effortlessly with cosmic shifts. I welcome radical creation and release the past.",
  },
  {
    name: "Root",
    sanskritName: "Muladhara",
    location: "Base of spine",
    element: "Earth",
    colorName: "Ruby Red",
    colorHex: "#dc2626",
    frequency: 396,
    mantra: "LAM",
    physicalRelation: "Skeletal system, Colon, Grounding anchor",
    affirmation: "I am safe, supported by the cosmic earth, free of guilt, fear, and doubt.",
  }
];

const INQUIRY_STEPS: InquiryStep[] = [
  {
    question: "Who is having this experience right now?",
    guidance: "Do not answer intellectually with your name or history. Withdraw focus from the objects in the room and turn it back 180 degrees. Look directly into the source of looking itself. What is there?",
    reflectionPlaceholder: "Contemplate the silent presence..."
  },
  {
    question: "Are you the passing thoughts, or the witness of them?",
    guidance: "A anxious thought arises, stays, and dissolves. If you can observe the thought rise and fall, you cannot be the thought itself. Rest in the vast, unaffected background screen that observes.",
    reflectionPlaceholder: "I am not the passing clouds, I am the..."
  },
  {
    question: "Do you have a boundary, or does the world arise within you?",
    guidance: "Close your eyes. Where does 'inside' end and 'outside' begin? Feel the dark expanse of awareness. Is there an actual wall between you and the universe, or does it all float inside one field?",
    reflectionPlaceholder: "Sensation of spacious boundaryless existence..."
  },
  {
    question: "What is present when you have no story, no name, and no future?",
    guidance: "For an instant, let go of the need to fix anything, know anything, or achieve anything. Cast aside your label as a 'seeker'. Just be. What remains when the personal narrative is fully asleep?",
    reflectionPlaceholder: "Rest in the simple delight of pure I AM awareness..."
  }
];

const SYMPTOMS: SymptomCard[] = [
  {
    id: "dark_night",
    symptom: "Existential Meaningless (Dark Night of the Soul)",
    esotericMeaning: "The old identity structure is collapsing. Before the butterfly is formed, the caterpillar must completely turn to soup. This void is not depression; it is the absolute freedom from past conditioning.",
    metabolicAdvice: "Eat organic root vegetables (beets, sweet potatoes, carrots), touch bare soil with your feet. Drink copper-infused spring water, avoid heavy sugars and excessive online noise.",
    integrativeExercise: "Lie flat on the floor (Savasana), feeling the gravitational pull of the Earth taking all responsibility off your shoulders. Rest as the empty ground."
  },
  {
    id: "kundalini_heat",
    symptom: "Spinal Heat, Electric Tremors, or Head Pressure",
    esotericMeaning: "Prana is clearing long-held energetic blockages in the nervous system (Sushumna Nadi). This happens as the kundalini energy rises to expand your cognitive capacity.",
    metabolicAdvice: "Take a lukewarm shower or a cool bath. Sit on cedar wood, decrease coffee/stimulants. Walk in green forests alone, breathing green prana into the heart space.",
    integrativeExercise: "Gently touch the palate of your mouth with your tongue (Khechari Mudra) and visualize the overflowing crown pressure melting down like liquid gold into the solar plexus."
  },
  {
    id: "binaural_ears",
    symptom: "High-Pitched Shimmering tones in the Ears",
    esotericMeaning: "The pineal gland and tympanic membrane are adapting to higher planetary energy grids or finer dimensions of sound. It signifies tuning into the primordial cosmic hum (Anahata Nada).",
    metabolicAdvice: "Avoid direct digital headphones for long periods. Practice closing the ears and eyes to observe the internal sound frequency during quiet hours.",
    integrativeExercise: "Engage in Bhramari Pranayama (Humming Bee Breath): inhale deep, block ear canals with thumbs, and hum out slowly at 432Hz to unify the cosmic resonance."
  },
  {
    id: "ego_death",
    symptom: "Spontaneous Derealization / Dissolving of Me",
    esotericMeaning: "A profound spiritual leap, seeing that the ego-self is a fictional shadow. Sensation of watching your life play out on autopilot, with immense silent peace.",
    metabolicAdvice: "Maintain standard gentle human routines. Wash dishes, sweep the room, cook simple meals, walk slowly. Ground your biological body so it remains a peaceful vessel.",
    integrativeExercise: "Look into a mirror and trace: 'Who is looking at this reflection?'. Laugh gently at the divine cosmic play (Lila)."
  }
];

interface AwakeningTechniquesProps {
  onChakraFrequencyOverride?: (frequency: number, color: string) => void;
  onPranayamaPulse?: (scale: number) => void;
}

export default function AwakeningTechniques({ onChakraFrequencyOverride, onPranayamaPulse }: AwakeningTechniquesProps) {
  const [activeTab, setActiveTab] = useState<"breathe" | "inquiry" | "chakras" | "symptoms">("breathe");

  const tabPrompt = {
    breathe: "Start with 3 rounds, then continue to Chakra Pillars.",
    chakras: "Select a center and sync its tone to the acoustic engine.",
    inquiry: "Journal one line per step to deepen each inquiry cycle.",
    symptoms: "Pick the closest symptom card and apply one grounding step.",
  } as const;

  const tabAccent = {
    breathe: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
    chakras: "text-rose-300 border-rose-500/20 bg-rose-500/10",
    inquiry: "text-indigo-300 border-indigo-500/20 bg-indigo-500/10",
    symptoms: "text-amber-300 border-amber-500/20 bg-amber-500/10",
  } as const;

  // --- 1. Pranayama State Engine ---
  const [breathePattern, setBreathePattern] = useState<"box" | "deep">("box");
  const [breathePhase, setBreathePhase] = useState<"INHALE" | "HOLD" | "EXHALE" | "HOLD_OUT">("INHALE");
  const [breatheTimer, setBreatheTimer] = useState<number>(4);
  const [isBreatheActive, setIsBreatheActive] = useState<boolean>(false);
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic Scale exported variable calculation (1.0 to 1.35)
  const getPranayamaScale = () => {
    if (!isBreatheActive) return 1.0;
    
    // Pattern parameters
    const inhaleMax = breathePattern === "box" ? 4 : 4;
    const exhaleMax = breathePattern === "box" ? 4 : 8;

    if (breathePhase === "INHALE") {
      // Growing from 1.0 up to 1.3
      const elapsed = inhaleMax - breatheTimer;
      return 1.0 + (elapsed / inhaleMax) * 0.3;
    } else if (breathePhase === "HOLD") {
      // Maintained peak with subtle micro-vibration
      return 1.3 + Math.sin(Date.now() / 300) * 0.015;
    } else if (breathePhase === "EXHALE") {
      // Shrinking back to 1.0
      return 1.0 + (breatheTimer / exhaleMax) * 0.35;
    } else {
      // Bottom flatline
      return 0.98;
    }
  };

  // Broadcast scale updates to parent layout on tick
  useEffect(() => {
    if (onPranayamaPulse) {
      onPranayamaPulse(getPranayamaScale());
    }
  }, [breatheTimer, breathePhase, isBreatheActive, breathePattern]);

  // Handle Breath Engine Intervals
  useEffect(() => {
    if (isBreatheActive) {
      breathIntervalRef.current = setInterval(() => {
        setBreatheTimer((prev) => {
          if (prev <= 1) {
            // Trigger phase transition
            transitionBreathPhase();
            return 1; // placeholder, overwritten by transition
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
        breathIntervalRef.current = null;
      }
      setBreathePhase("INHALE");
      setBreatheTimer(breathePattern === "box" ? 4 : 4);
    }

    return () => {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    };
  }, [isBreatheActive, breathePhase, breathePattern]);

  const transitionBreathPhase = () => {
    if (breathePattern === "box") {
      // INHALE (4) -> HOLD (4) -> EXHALE (4) -> HOLD OUT (4)
      switch (breathePhase) {
        case "INHALE":
          setBreathePhase("HOLD");
          setBreatheTimer(4);
          break;
        case "HOLD":
          setBreathePhase("EXHALE");
          setBreatheTimer(4);
          break;
        case "EXHALE":
          setBreathePhase("HOLD_OUT");
          setBreatheTimer(4);
          break;
        case "HOLD_OUT":
          setBreathePhase("INHALE");
          setBreatheTimer(4);
          break;
      }
    } else {
      // INHALE (4) -> HOLD (7) -> EXHALE (8) -> back to INHALE (4)
      switch (breathePhase) {
        case "INHALE":
          setBreathePhase("HOLD");
          setBreatheTimer(7);
          break;
        case "HOLD":
          setBreathePhase("EXHALE");
          setBreatheTimer(8);
          break;
        case "EXHALE":
        default:
          setBreathePhase("INHALE");
          setBreatheTimer(4);
          break;
      }
    }
  };

  const getBreathColor = () => {
    switch (breathePhase) {
      case "INHALE": return "border-emerald-500 shadow-emerald-500/20";
      case "HOLD": return "border-amber-500 shadow-amber-500/20";
      case "EXHALE": return "border-sky-500 shadow-sky-500/20";
      case "HOLD_OUT": return "border-slate-700 shadow-slate-700/10";
    }
  };

  // --- 2. Self Inquiry Steps Tracker ---
  const [inquiryStep, setInquiryStep] = useState<number>(0);
  const [reflections, setReflections] = useState<string[]>(Array(INQUIRY_STEPS.length).fill(""));

  const handleReflectionChange = (val: string) => {
    const updated = [...reflections];
    updated[inquiryStep] = val;
    setReflections(updated);
  };

  // --- 3. Chakra pillars selections ---
  const [selectedChakra, setSelectedChakra] = useState<ChakraData>(CHAKRAS[3]); // Default Anahata Heart

  const handleChakraSelect = (chk: ChakraData) => {
    setSelectedChakra(chk);
    if (onChakraFrequencyOverride) {
      onChakraFrequencyOverride(chk.frequency, chk.colorHex);
    }
  };

  return (
    <div id="techniques-sanctuary" className="temple-panel rounded-2xl flex flex-col items-stretch overflow-hidden h-135">
      {/* Top Technique Tab Rails */}
      <div className="flex border-b border-white/5 bg-black/40">
        {[
          { id: "breathe", icon: Wind, label: "Pranayama" },
          { id: "chakras", icon: Heart, label: "Chakra Pillars" },
          { id: "inquiry", icon: HelpCircle, label: "Self-Inquiry" },
          { id: "symptoms", icon: ShieldAlert, label: "Awakening Shifts" },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab-btn-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs tracking-wider font-serif uppercase cursor-pointer border-b-2 transition-all duration-300 ${
                isActive 
                  ? "border-indigo-500 text-indigo-400 bg-white/5 font-medium" 
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Technique Center Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-950/20 relative">
        <div className="mb-4 text-[11px] font-mono uppercase tracking-wider text-white/50">
          Flow Tip: switch techniques above, then scroll each practice pane for deeper guidance.
        </div>

        <div className={`mb-4 text-[11px] font-mono uppercase tracking-wider border rounded-lg px-3 py-2 ${tabAccent[activeTab]}`}>
          Next: {tabPrompt[activeTab]}
        </div>

        {/* --- 1. Pranayama breathing screen --- */}
        {activeTab === "breathe" && (
          <div className="h-full flex flex-col items-center justify-between">
            <div className="text-center max-w-md">
              <h4 className="font-serif text-base text-slate-100 mb-1">Guided Awakening Pranayama</h4>
              <p className="text-[13px] text-slate-300 font-sans leading-relaxed">
                Steady breathing synchronizes the autonomic nervous system, clearing mental chatter and allowing the bio-field to settle into pristine cosmic awareness.
              </p>
            </div>

            {/* Core expanding breathe bubble */}
            <div className="relative flex items-center justify-center w-56 h-56">
              {/* Outer halo background pulsing representing the current frequency expansion */}
              <div 
                className="absolute w-44 h-44 rounded-full border border-dashed border-indigo-500/20 transition-all duration-1000"
                style={{ transform: `scale(${getPranayamaScale() * 1.08})`, opacity: isBreatheActive ? 0.3 : 0.05 }}
              />

              <div 
                className={`w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 bg-black/55 shadow-[0_0_25px_rgba(0,0,0,0.6)] ${getBreathColor()}`}
                style={{ transform: `scale(${getPranayamaScale()})` }}
              >
                <span className="text-[10px] font-mono tracking-[0.2em] text-slate-400">
                  {isBreatheActive ? breathePhase : "PRESENCE"}
                </span>
                <span className="text-3xl font-serif text-slate-200 my-0.5 font-bold">
                  {isBreatheActive ? breatheTimer : "∞"}
                </span>
                <span className="text-[10px] font-sans text-center text-indigo-400 uppercase font-semibold tracking-wider px-2">
                  {breathePhase === "INHALE" && "Breathe In"}
                  {breathePhase === "HOLD" && "Retain Empty / Gold Glow"}
                  {breathePhase === "EXHALE" && "Release Breath"}
                  {breathePhase === "HOLD_OUT" && "Spacious Silence"}
                  {!isBreatheActive && "Press Begin"}
                </span>
              </div>
            </div>

            {/* Timed breath controllers */}
            <div className="flex flex-col items-center gap-3 w-full max-w-sm">
              <div className="flex bg-[#020205] border border-white/5 p-1 rounded-lg w-full">
                <button
                  id="breathe-pattern-box"
                  onClick={() => {
                    setIsBreatheActive(false);
                    setBreathePattern("box");
                  }}
                  className={`flex-1 py-1 text-xs font-serif rounded cursor-pointer transition ${
                    breathePattern === "box" ? "bg-indigo-500/10 text-indigo-400 font-medium" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sama Vritti (Box)
                </button>
                <button
                  id="breathe-pattern-deep"
                  onClick={() => {
                    setIsBreatheActive(false);
                    setBreathePattern("deep");
                  }}
                  className={`flex-1 py-1 text-xs font-serif rounded cursor-pointer transition ${
                    breathePattern === "deep" ? "bg-indigo-500/10 text-indigo-400 font-medium" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Vayu Prana (4-7-8)
                </button>
              </div>

              {!isBreatheActive ? (
                <button
                  id="btn-start-pranayama"
                  onClick={() => setIsBreatheActive(true)}
                  className="w-full py-2 bg-white text-[#020205] font-serif font-bold text-xs tracking-wider rounded-xl transition-all hover:bg-neutral-200 cursor-pointer"
                >
                  BEGIN BREATH CYCLE
                </button>
              ) : (
                <button
                  id="btn-stop-pranayama"
                  onClick={() => setIsBreatheActive(false)}
                  className="w-full py-2 border border-slate-700 hover:bg-slate-900 text-slate-300 font-serif font-bold text-xs tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  PAUSE ALIGNMENT
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- 2. Chakra alignment pillar --- */}
        {activeTab === "chakras" && (
          <div className="flex flex-col md:flex-row gap-6 h-full items-stretch">
            {/* Chakra Pillar Line Map */}
            <div className="flex md:flex-col justify-between items-center bg-slate-950/40 border border-slate-900/60 p-3 rounded-xl md:w-17.5 relative">
              <div className="absolute hidden md:block top-8 bottom-8 w-0.5 z-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #a855f7, #6366f1, #10b981, #eab308, #dc2626)' }} />
              {CHAKRAS.map((chk, idx) => {
                const isSelected = chk.name === selectedChakra.name;
                return (
                  <button
                    id={`chakra-select-${chk.name}`}
                    key={chk.name}
                    onClick={() => handleChakraSelect(chk)}
                    className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform md:hover:scale-110 active:scale-90"
                    style={{ 
                      backgroundColor: chk.colorHex,
                      boxShadow: isSelected ? `0 0 15px ${chk.colorHex}` : `0 0 4px rgba(0,0,0,0.5)`,
                      border: isSelected ? '2.5px solid #fff' : '2px solid transparent'
                    }}
                    title={`${chk.name} - ${chk.sanskritName}`}
                  >
                    <span className="text-[10px] text-white font-serif font-bold uppercase select-none">
                      {chk.mantra}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Chakra Information Sheet */}
            <div className="flex-1 flex flex-col justify-between bg-black/40 p-4 rounded-xl border border-white/5">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-serif text-lg tracking-wide text-slate-100 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedChakra.colorHex }} />
                      {selectedChakra.name} Chakra
                    </h5>
                    <span className="text-[11px] font-mono text-indigo-400 font-semibold tracking-wider">
                      {selectedChakra.sanskritName} • Mantra: {selectedChakra.mantra}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-500 block">RESONANT</span>
                    <span className="text-xs font-mono text-indigo-300 font-bold">{selectedChakra.frequency} Hz</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                  <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-500 block font-mono uppercase text-[9px] mb-0.5">Physical Hub</span>
                    <span className="text-slate-300">{selectedChakra.physicalRelation}</span>
                  </div>
                  <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-500 block font-mono uppercase text-[9px] mb-0.5">Core Element</span>
                    <span className="text-slate-300">{selectedChakra.element}</span>
                  </div>
                </div>

                <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20 text-xs text-indigo-200">
                  <span className="text-indigo-400 font-serif italic text-[10px] block mb-1 uppercase tracking-wider font-bold">Divine Affirmation</span>
                  <p className="italic leading-relaxed font-sans">&ldquo;{selectedChakra.affirmation}&rdquo;</p>
                </div>
              </div>

              {/* parent sync click action button */}
              <button
                id="btn-override-resonant-tone"
                onClick={() => handleChakraSelect(selectedChakra)}
                className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-indigo-300 font-serif font-bold text-xs tracking-wider rounded-lg text-center transition cursor-pointer shadow-md"
              >
                SYNC CHROMATIC FREQUENCY ({selectedChakra.frequency}Hz)
              </button>
            </div>
          </div>
        )}

        {/* --- 3. Atma Vichara Self Inquiry --- */}
        {activeTab === "inquiry" && (
          <div className="flex flex-col justify-between h-full space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="font-serif text-sm text-slate-100 uppercase tracking-widest">Atma-Vichara Inquiry</h5>
                <span className="text-[11px] text-slate-300 font-mono">STEP {inquiryStep + 1} OF {INQUIRY_STEPS.length}</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  id="inquiry-prev"
                  onClick={() => setInquiryStep(prev => Math.max(0, prev - 1))}
                  disabled={inquiryStep === 0}
                  className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="inquiry-next"
                  onClick={() => setInquiryStep(prev => Math.min(INQUIRY_STEPS.length - 1, prev + 1))}
                  disabled={inquiryStep === INQUIRY_STEPS.length - 1}
                  className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main contemplation card */}
            <div className="flex-1 bg-black/40 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
              <div className="space-y-2">
                <h6 className="font-serif text-[15px] font-bold text-indigo-400 leading-snug">
                  {INQUIRY_STEPS[inquiryStep].question}
                </h6>
                <p className="text-sm text-slate-200 leading-relaxed font-sans select-none">
                  {INQUIRY_STEPS[inquiryStep].guidance}
                </p>
              </div>

              {/* Reflection text journaling area */}
              <div className="mt-4">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Sealed Contemplation Log:</label>
                <textarea
                  id={`inquiry-reflection-area-${inquiryStep}`}
                  value={reflections[inquiryStep]}
                  onChange={(e) => handleReflectionChange(e.target.value)}
                  placeholder={INQUIRY_STEPS[inquiryStep].reflectionPlaceholder}
                  className="w-full text-xs text-[#E5E7EB] bg-black/50 rounded-lg border border-white/5 p-3 h-20 focus:outline-none focus:border-indigo-500/40 transition-colors placeholder:text-slate-600 resize-none font-sans"
                />
              </div>
            </div>

            {/* Quick check step bar or finished state */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>Maharshi: &ldquo;Inward attention is the path.&rdquo;</span>
              {reflections.filter(Boolean).length === INQUIRY_STEPS.length ? (
                <span className="text-emerald-500 flex items-center gap-1 font-semibold"><CheckCircle className="w-3.5 h-3.5" /> Core Inquiry Complete</span>
              ) : (
                <span>{reflections.filter(Boolean).length} / {INQUIRY_STEPS.length} Steps Journaled</span>
              )}
            </div>
          </div>
        )}

        {/* --- 4. Spiritual Awakening Symptom compass --- */}
        {activeTab === "symptoms" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SYMPTOMS.map((card) => (
              <div id={`symptom-card-${card.id}`} key={card.id} className="bg-black/35 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-indigo-500/20 hover:bg-black/50 transition duration-300">
                <div className="space-y-2">
                  <h5 className="font-serif text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    {card.symptom}
                  </h5>
                  <p className="text-[12px] text-slate-300 leading-relaxed font-sans">
                    {card.esotericMeaning}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 text-[10px] space-y-1.5">
                  <div>
                    <span className="font-mono text-indigo-400 font-semibold uppercase tracking-wider block">Metabolic Grounding Remedy:</span>
                    <span className="text-slate-300">{card.metabolicAdvice}</span>
                  </div>
                  <div>
                    <span className="font-mono text-emerald-400 font-semibold uppercase tracking-wider block">Integrative Sadhana Practice:</span>
                    <span className="text-slate-300 italic">{card.integrativeExercise}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="sticky bottom-0 -mx-6 mt-5 px-6 py-2 bg-linear-to-t from-[#020205] via-[#020205]/90 to-transparent text-center text-[9px] font-mono uppercase tracking-wider text-white/25 pointer-events-none">
          Scroll for complete practice sequence
        </div>
      </div>
    </div>
  );
}
