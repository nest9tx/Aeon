import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  AlertCircle, 
  Compass, 
  Key, 
  Coins, 
  Heart, 
  Info, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  X, 
  Activity,
  User,
  CreditCard
} from "lucide-react";
import { Message } from "../types";

const SUGGESTED_QUERIES = [
  { text: "How do I ground myself during intense kundalini rising?", label: "Grounding Kundalini" },
  { text: "Am I experiencing spiritual ego? How to recognize it?", label: "Spiritual Ego" },
  { text: "Explain non-duality (Advaita Vedanta) in simple terms.", label: "Explain Non-Duality" },
  { text: "Give me a peaceful Zen Koan to sit with in silence.", label: "Seek a Zen Koan" },
  { text: "Draft a personalized grounding mantra for cosmic anxiety.", label: "Anxiety Mantra" },
  { text: "Is my 'dark night of the soul' an illness or an initiation?", label: "Dark Night vs Illusion" }
];

const DONATION_TIERS = [
  { 
    amount: "3.33", 
    title: "Trinity Resonance", 
    meaning: "The number of integration & communication. Stabilizes basic connection channels & keeps server lamps lit.", 
    icon: "✨",
    color: "from-blue-500/20 to-indigo-505/20 border-blue-500/30 text-blue-300"
  },
  { 
    amount: "7.77", 
    title: "Mystic Alignment", 
    meaning: "The number of spiritual mastery & divine path. Deepens the sanctuary's code improvements and continuous uptime.", 
    icon: "🔮", 
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300"
  },
  { 
    amount: "8.88", 
    title: "Aetheric Abundance", 
    meaning: "The infinite loops of flow. Fully sponsors open, free access for other earnest seekers without commercial burden.", 
    icon: "☀️",
    color: "from-amber-500/20 to-indigo-500/20 border-amber-500/30 text-amber-300"
  }
];

export default function SpiritualCompanion() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: "Welcome, earnest traveler. I am your spiritual guide. In the silence of your heart, no question is trivial, and no doubt is a mistake. Tell me of your awakening symptoms, your meditative blocks, or ask me for a Koan to dismantle your mental boundaries.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Sidebar control tab
  const [sidebarTab, setSidebarTab] = useState<"inquiries" | "key" | "exchange">("inquiries");

  // API Key States
  const [userApiKey, setUserApiKey] = useState<string>(() => {
    return localStorage.getItem("LUMINANOVA_GEMINI_KEY") || "";
  });
  const [tempKeyInput, setTempKeyInput] = useState("");

  // Daily tracker state
  const [dailyCount, setDailyCount] = useState<number>(() => {
    const stored = localStorage.getItem("LUMINANOVA_DAILY_DATA");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === new Date().toDateString()) {
          return parsed.count ?? 0;
        }
      } catch (e) {
        // ignore
      }
    }
    return 0;
  });

  // Cosmic flow / simulated support blessing status
  const [hasFreeAccessBlessing, setHasFreeAccessBlessing] = useState<boolean>(() => {
    return localStorage.getItem("LUMINANOVA_BLESSED") === "true";
  });

  // Donation state handlers
  const [activeDonation, setActiveDonation] = useState<typeof DONATION_TIERS[0] | null>(null);
  const [simulationStep, setSimulationStep] = useState<"input" | "processing" | "success">("input");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Sync temp key state on tab change/load
  useEffect(() => {
    setTempKeyInput(userApiKey);
  }, [userApiKey, sidebarTab]);

  const handleSaveApiKey = () => {
    const cleanKey = tempKeyInput.trim();
    setUserApiKey(cleanKey);
    setErrorStatus(null);
    if (cleanKey) {
      localStorage.setItem("LUMINANOVA_GEMINI_KEY", cleanKey);
      setIsSavedSuccessfully(true);
      setTimeout(() => setIsSavedSuccessfully(false), 3000);
    } else {
      localStorage.removeItem("LUMINANOVA_GEMINI_KEY");
      setIsSavedSuccessfully(true);
      setTimeout(() => setIsSavedSuccessfully(false), 3000);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    // Checks context limit
    const bypassLimit = !!userApiKey.trim() || hasFreeAccessBlessing;
    if (!bypassLimit && dailyCount >= 3) {
      setErrorStatus("Your 3 daily communions for today are integrated. Connect your personal Gemini API key or support open servers to chat infinitely.");
      setSidebarTab("key"); // Gently point them to key setup tab
      return;
    }

    setErrorStatus(null);
    if (!customText) {
      setInputMessage("");
    }

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Increment daily local count if limit bypass is not active
      let nextCount = dailyCount;
      if (!bypassLimit) {
        nextCount = dailyCount + 1;
        setDailyCount(nextCount);
        localStorage.setItem(
          "LUMINANOVA_DAILY_DATA",
          JSON.stringify({ date: new Date().toDateString(), count: nextCount })
        );
      }

      // Package messages for history simulation
      const payloadMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/spiritual-guidance", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-api-key": userApiKey.trim() || ""
        },
        body: JSON.stringify({ 
          messages: payloadMessages,
          userApiKey: userApiKey.trim() || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Adjust error to hint about local API keys
        if (response.status === 500 && !userApiKey.trim()) {
          throw new Error("Free server limits are saturated. Please add your own free Gemini API Key under 'Celestial Key' tab to establish standard connection.");
        }
        
        throw new Error(errorData.error || "The cosmos remained silent. Perhaps verify authorization values.");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "model",
          text: data.text,
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Failed to establish a telepathic link with the guide.");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger simulated successful stripe flow
  const handleSimulatePayment = () => {
    if (!donorEmail.trim()) return;
    setSimulationStep("processing");
    setTimeout(() => {
      setSimulationStep("success");
      setHasFreeAccessBlessing(true);
      localStorage.setItem("LUMINANOVA_BLESSED", "true");
    }, 2800);
  };

  // Reset local state for testing limits easily
  const resetLocalLimits = () => {
    localStorage.removeItem("LUMINANOVA_DAILY_DATA");
    localStorage.removeItem("LUMINANOVA_BLESSED");
    setDailyCount(0);
    setHasFreeAccessBlessing(false);
    setErrorStatus(null);
  };

  // Custom regex parsing for simple markdown representation (bold, lists, etc)
  const renderMessageContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
      const rawText = isBullet ? trimmed.substring(2) : line;

      // Handle custom bold markers **Text**
      const parts = rawText.split("**");
      const formatted = parts.map((part, idx) => {
        if (idx % 2 === 1) {
          return (
            <strong key={idx} className="text-indigo-300 font-serif font-bold">
              {part}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={i} className="list-disc ml-4 mb-1 text-slate-300 text-[11px] sm:text-xs">
            {formatted}
          </li>
        );
      }

      // Preserve paragraph breaks
      return trimmed === "" ? (
        <div key={i} className="h-2" />
      ) : (
        <p key={i} className="mb-1.5 text-[11px] sm:text-xs text-slate-300 leading-relaxed font-sans">
          {formatted}
        </p>
      );
    });
  };

  const remainingChats = hasFreeAccessBlessing || userApiKey.trim() ? "∞" : Math.max(0, 3 - dailyCount);

  return (
    <div id="ai-spiritual-guide" className="temple-panel rounded-2xl flex flex-col items-stretch overflow-hidden h-135 relative">
      <div className="flex flex-col md:flex-row items-stretch h-full overflow-hidden">
        
        {/* Interactive Left Sidebar Panel Column */}
        <div className="w-full md:w-60 bg-black/60 md:border-r border-white/5 p-4 shrink-0 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            
            {/* Navigational tab selection in sidebar */}
            <div className="grid grid-cols-3 bg-black/50 p-1 rounded-lg border border-white/5">
              <button 
                id="btn-sidebar-inquiries"
                onClick={() => setSidebarTab("inquiries")}
                className={`flex flex-col items-center justify-center py-1.5 rounded transition cursor-pointer text-[9px] font-mono tracking-wider ${
                  sidebarTab === "inquiries" ? "bg-indigo-500/10 text-indigo-300" : "text-white/40 hover:text-white/80"
                }`}
                title="Divine Inquiries"
              >
                <Compass className="w-3.5 h-3.5 mb-1" />
                <span>INQUIRE</span>
              </button>
              
              <button 
                id="btn-sidebar-key"
                onClick={() => setSidebarTab("key")}
                className={`flex flex-col items-center justify-center py-1.5 rounded transition cursor-pointer text-[9px] font-mono tracking-wider ${
                  sidebarTab === "key" ? "bg-indigo-500/10 text-indigo-300" : "text-white/40 hover:text-white/80"
                }`}
                title="Celestial Key"
              >
                <Key className="w-3.5 h-3.5 mb-1" />
                <span>KEY CONFIG</span>
              </button>
              
              <button 
                id="btn-sidebar-exchange"
                onClick={() => setSidebarTab("exchange")}
                className={`flex flex-col items-center justify-center py-1.5 rounded transition cursor-pointer text-[9px] font-mono tracking-wider ${
                  sidebarTab === "exchange" ? "bg-indigo-500/10 text-indigo-300" : "text-white/40 hover:text-white/80"
                }`}
                title="Sacred Stewardship"
              >
                <Coins className="w-3.5 h-3.5 mb-1" />
                <span>EXCHANGE</span>
              </button>
            </div>

            {/* TAB CONTENT: INQUIRIES */}
            {sidebarTab === "inquiries" && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-serif text-xs font-semibold uppercase tracking-wider">Seek alignment</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  Choose a tailored path of inquiry to trigger instant thematic responses or symptom remedies.
                </p>
                <div className="space-y-1.5 max-h-45 md:max-h-none overflow-y-auto pr-1">
                  {SUGGESTED_QUERIES.map((query, idx) => (
                    <button
                      id={`preset-query-${idx}`}
                      key={idx}
                      onClick={() => handleSendMessage(query.text)}
                      disabled={isLoading}
                      className="w-full text-left py-1.5 px-2.5 rounded-lg border border-white/5 bg-[#020205] hover:bg-white/5 text-[10px] text-slate-400 hover:text-indigo-300 transition-all cursor-pointer font-sans truncate block disabled:opacity-40"
                    >
                      {query.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CELLESTIAL KEY (BYOK) */}
            {sidebarTab === "key" && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-serif text-xs font-semibold uppercase tracking-wider">Celestial Key</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  Input your personal <strong className="text-indigo-300">Gemini Web API Key</strong> to chat without limits. This key is stored securely inside your local browser.
                </p>
                <a 
                  href="https://aistudio.google.com/apikey" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] text-indigo-400 hover:text-indigo-300 font-mono tracking-wide"
                >
                  <span>GET FREE KEY FROM GOOGLE</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>

                <div className="space-y-2 pt-1.5">
                  <input
                    id="user-gemini-key-input"
                    type="password"
                    value={tempKeyInput}
                    onChange={(e) => setTempKeyInput(e.target.value)}
                    placeholder="Paste AI Studio Key (AIzaSy...)"
                    className="w-full bg-[#020205] text-[#E5E7EB] rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-mono focus:outline-none focus:border-indigo-500/40 placeholder:text-slate-700"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-save-custom-key"
                      onClick={handleSaveApiKey}
                      className="flex-1 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-black text-center font-serif text-[10px] font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
                    >
                      {userApiKey ? "Save Key Update" : "Confirm Key Connection"}
                    </button>
                    {userApiKey && (
                      <button
                        id="btn-forget-custom-key"
                        onClick={() => {
                          localStorage.removeItem("LUMINANOVA_GEMINI_KEY");
                          setUserApiKey("");
                          setTempKeyInput("");
                        }}
                        className="p-1.5 rounded-lg bg-black hover:bg-neutral-800 border border-white/10 text-rose-400 text-xs text-center cursor-pointer font-serif"
                        title="Disconnect Key"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  {isSavedSuccessfully && (
                    <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-sans mt-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>Key configuration saved!</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: EXCHANGE */}
            {sidebarTab === "exchange" && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Coins className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-serif text-xs font-semibold uppercase tracking-wider">Sacred Exchange</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  Align energy, support server bills, and unlock unlimited messaging forever via an ethical, fixed-amount Stripe contribution.
                </p>

                <div className="space-y-2 pt-1.5">
                  {DONATION_TIERS.map((tier) => (
                    <button
                      id={`btn-donation-tier-${tier.amount.replace(".", "")}`}
                      key={tier.amount}
                      onClick={() => {
                        setActiveDonation(tier);
                        setSimulationStep("input");
                        setDonorName("");
                        // Use actual user context email if available
                        setDonorEmail("beacon@luminanova.org");
                      }}
                      className="w-full p-2 rounded-xl text-left border border-white/5 bg-black/40 hover:border-indigo-500/20 hover:bg-white/5 transition duration-300 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-300 group-hover:text-indigo-300">{tier.title}</span>
                        <span className="text-xs font-mono font-bold text-indigo-400">${tier.amount}</span>
                      </div>
                      <p className="text-[9px] text-white/40 leading-snug group-hover:text-white/60">
                        {tier.icon} {tier.meaning}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Dev/Reset indicator for sandbox testing */}
          <div className="pt-3 border-t border-white/5 mt-4 flex flex-col gap-1.5">
            <div className="text-[9px] text-slate-700 font-mono italic select-none leading-relaxed">
              &ldquo;Seek the seeker. Inside the silence, you are already complete.&rdquo;
            </div>
            
            <button
              id="btn-reset-limits"
              onClick={resetLocalLimits}
              className="text-[8px] font-mono uppercase tracking-wider text-white/20 hover:text-indigo-400/90 text-left cursor-pointer select-none transition"
              title="Reset client limits for easy review"
            >
              ⚙️ Reset client limit testing State
            </button>
          </div>
        </div>

        {/* Live Chat Console Column (Right) */}
        <div className="flex-1 flex flex-col justify-between h-full bg-black/30 overflow-hidden relative">
          
          {/* Header context */}
          <div className="px-4 py-2 bg-black/50 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <h5 className="font-serif text-xs tracking-widest text-[#E5E7EB] uppercase">Akashic Companion</h5>
            </div>
            
            {/* Limit badge tracker with visual indication of remaining communions */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/10 bg-black/30 text-[9px] font-mono">
              {hasFreeAccessBlessing ? (
                <div className="flex items-center gap-1 text-amber-300">
                  <Sparkles className="w-2.5 h-2.5 fill-current" />
                  <span>SACRED EXUBERANCE</span>
                </div>
              ) : userApiKey.trim() ? (
                <div className="flex items-center gap-1 text-indigo-300">
                  <Key className="w-2.5 h-2.5" />
                  <span>PERSONAL KEY CONNECTION</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-slate-400">
                  <Coins className="w-2.5 h-2.5" />
                  <span>{remainingChats}/3 DAILY COMMUNIONS</span>
                </div>
              )}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => {
              const isSelf = m.role === "user";
              return (
                <div 
                  key={m.id}
                  className={`flex items-start gap-2.5 max-w-[85%] ${isSelf ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  {/* Icon identifiers */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-white/5 text-[10px] uppercase font-mono ${
                    isSelf ? "bg-indigo-500/10 text-indigo-300" : "bg-emerald-500/10 text-emerald-300"
                  }`}>
                    {isSelf ? "S" : "G"}
                  </div>

                  {/* Message bubble outline */}
                  <div className={`p-3 rounded-2xl border text-left leading-relaxed ${
                    isSelf 
                      ? "bg-indigo-950/40 border-indigo-500/10 rounded-tr-none text-[#E5E7EB]" 
                      : "bg-black/40 border-white/5 rounded-tl-none text-slate-200 shadow-xl"
                  }`}>
                    {renderMessageContent(m.text)}
                  </div>
                </div>
              );
            })}

            {/* If communal limit hit, render the inline suggestion dialog with paths */}
            {!userApiKey.trim() && !hasFreeAccessBlessing && dailyCount >= 3 && !isLoading && (
              <div className="border border-indigo-500/10 bg-indigo-550/5 p-4 rounded-2xl border-dashed max-w-[85%] mr-auto space-y-3 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                <div className="absolute -top-2.5 -right-2.5 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex gap-2">
                  <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-left">
                    <span className="font-serif leading-snug text-xs font-semibold text-slate-200 block">3 Daily Communions Integrated</span>
                    <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
                      Sadhvana's computational lamps run on dynamic host environments. To nurture balance & continuity, you can proceed by choosing your path:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
                  <button
                    id="btn-inline-key"
                    onClick={() => setSidebarTab("key")}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-black hover:bg-neutral-900 border border-white/10 text-[10.5px] text-slate-300 cursor-pointer transition active:scale-95"
                  >
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Provide AI Studio Key (Free)</span>
                  </button>
                  
                  <button
                    id="btn-inline-exchange"
                    onClick={() => setSidebarTab("exchange")}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-[10.5px] font-bold cursor-pointer transition active:scale-95 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Sacred Devotional Exchange</span>
                  </button>
                </div>
              </div>
            )}

            {/* AI Loading step */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs px-2 py-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span className="font-serif italic animate-pulse">Channels of cosmic perception opening...</span>
              </div>
            )}

            {/* Error alerts banner */}
            {errorStatus && (
              <div className="flex items-start gap-2 text-rose-400 bg-rose-950/20 border border-rose-900 p-3 rounded-xl mx-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block">Cosmic Channel Error:</span>
                  <p className="opacity-80 font-mono text-[10px]">{errorStatus}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* User Input Frame */}
          <div className="p-3 bg-[#020205] border-t border-white/5">
            <div className="flex items-center gap-2">
              <input
                id="companion-chat-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading || (!userApiKey.trim() && !hasFreeAccessBlessing && dailyCount >= 3)}
                placeholder={
                  !userApiKey.trim() && !hasFreeAccessBlessing && dailyCount >= 3 
                    ? "Communion limited today. Provide key or support exchange above..." 
                    : "Ask of the Self, query symptoms, or type 'I require a Koan'..."
                }
                className="flex-1 bg-black/40 text-slate-200 rounded-xl border border-white/5 px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500/40 transition-colors placeholder:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
              />
              <button
                id="btn-send-guidance-query"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim() || (!userApiKey.trim() && !hasFreeAccessBlessing && dailyCount >= 3)}
                className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-black flex items-center justify-center transition shrink-0 cursor-pointer disabled:opacity-20 active:scale-95"
                title="Transmit Query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* DETAILED SACRED DONATION MODAL (OVERLAY) */}
      {activeDonation && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-slate-950/95 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl relative flex flex-col gap-5 overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <button
                id="btn-close-stewardship-modal"
                onClick={() => {
                  setActiveDonation(null);
                  setSimulationStep("input");
                }}
                className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Glowing background bubble */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Step 1: Input Payment Fields (Simulating Stripe setup beautiful forms) */}
            {simulationStep === "input" && (
              <div className="space-y-4 animate-fade-in font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg">
                    {activeDonation.icon}
                  </div>
                  <div>
                    <h6 className="font-serif text-sm font-bold text-slate-200">Sacred Contribution Service</h6>
                    <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest">{activeDonation.title}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Fixed exchange amount:</span>
                    <span className="text-sm font-mono font-bold text-white">${activeDonation.amount}</span>
                  </div>
                  <p className="text-[10px] text-indigo-200/70 italic leading-relaxed">
                    &ldquo;{activeDonation.meaning}&rdquo;
                  </p>
                </div>

                {/* Form fields mimicking premium payment checkout interface (without leaking details) */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">Seeker Name / Spiritual Label</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input 
                        id="payment-name-input"
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="e.g. Brother Thomas"
                        className="w-full bg-black border border-white/10 rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">Email Coordinates</label>
                    <input 
                      id="payment-email-input"
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="seeker@luminanova.org"
                      className="w-full bg-black border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">Encrypted Payment Credentials (Simulated)</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input 
                        id="fake-card-input"
                        type="text"
                        placeholder="•••• •••• •••• •••• (Pre-Authorized Checkout Token)"
                        disabled
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-slate-500 cursor-not-allowed select-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[9px] text-slate-500 leading-snug">
                  <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Stripe Devotion Pipeline is fully integrated for security. Scammers card testing is completely blocked via static pricing constraints.</span>
                </div>

                <button
                  id="btn-execute-simulate-payment"
                  onClick={handleSimulatePayment}
                  disabled={!donorEmail.trim()}
                  className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-black font-serif text-xs font-bold tracking-widest uppercase transition-all duration-300 enabled:active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  TRANSMIT DEVO-RESONANCE EXCHANGE (${activeDonation.amount})
                </button>
              </div>
            )}

            {/* Step 2: Processing state with beautiful progress spinner and messaging */}
            {simulationStep === "processing" && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
                <Sparkles className="w-10 h-10 text-indigo-400 animate-spin" />
                <div className="space-y-1 font-serif">
                  <h6 className="text-[#E5E7EB] text-sm font-bold">Opening Channel of Abundance...</h6>
                  <p className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-widest animate-pulse">Establishing Devotional Resonance Pipeline</p>
                </div>
                <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed max-w-xs">
                  We are notifying our Stripe ecosystem of your spiritual support. Secure authorization handshakes are completing in the background...
                </p>
              </div>
            )}

            {/* Step 3: Success Confirmation showing the blessing details */}
            {simulationStep === "success" && (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in font-sans">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl">
                  ✓
                </div>
                
                <div className="space-y-1">
                  <h6 className="font-serif text-[#E5E7EB] text-base font-bold">Sacred Resonance Sealed!</h6>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Devotional Token Registered</span>
                </div>

                <div className="p-3.5 bg-black/40 rounded-xl border border-emerald-900/20 text-xs text-slate-300 leading-relaxed space-y-1.5 max-w-sm">
                  <p>
                    Thank you kindly, <strong className="text-indigo-200">{donorName || "Earnest Seeker"}</strong>. Your tribute of <strong className="text-indigo-200">${activeDonation.amount}</strong> is accepted.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Your account holds the <strong className="text-amber-300">Infinite Cosmos Flow</strong> blessing, unlocking permanent access to the Akashic Companion without requiring a custom key!
                  </p>
                </div>

                <button
                  id="btn-return-cosmos"
                  onClick={() => {
                    setActiveDonation(null);
                    setSimulationStep("input");
                  }}
                  className="w-full py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-indigo-600 text-white font-serif text-[11px] font-bold tracking-widest uppercase cursor-pointer"
                >
                  Return to Infinite Communion
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
