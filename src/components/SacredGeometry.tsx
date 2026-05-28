import React, { useState, useEffect, useRef } from "react";
import { Eye, Settings, RotateCw, ZoomIn, ZoomOut, RefreshCw, Compass, Sliders } from "lucide-react";
import { SacredGeometry as GeometryType } from "../types";

export const GEOMETRIES: GeometryType[] = [
  {
    id: "flower_of_life",
    name: "Flower of Life",
    sanskritName: "Indra's Net of Creation",
    description: "Contains all patterns of creation, emerging from the Great Void. Representing the interconnectedness of all sentient beings, atoms, and stars.",
    metaphor: "You are a singular petal, but the entire pattern is within you.",
  },
  {
    id: "sri_yantra",
    name: "Sri Yantra",
    sanskritName: "Chakra of the Supreme Goddess",
    description: "The cosmic diagram of absolute union, where nine interlocking triangles form forty-three smaller cells. Represents Shiva (male force, upward) and Shakti (female energy, downward).",
    metaphor: "The cosmic dance of separation collapsing back into complete Oneness.",
  },
  {
    id: "metatrons_cube",
    name: "Metatron's Cube",
    sanskritName: "Prana Merkaba",
    description: "Derived from the Fruit of Life. Its lines trace every Platonic Solid—the five holy shapes forming the foundational blueprint of all elements in the universe.",
    metaphor: "From the formless light, absolute structural order emerges.",
  },
  {
    id: "torus",
    name: "Stellar Torus",
    sanskritName: "Anahata Heart Vortex",
    description: "A self-sustaining, revolving energy field showing how the infinite Cosmos recirculates, breathing in and out. The geometrical matrix of the torus is active in magnetic poles and heart-fields.",
    metaphor: "Constantly emptying, constantly filling. The natural flow of prana.",
  },
  {
    id: "fibonacci",
    name: "Golden Ratio Spiral",
    sanskritName: "Divine Spira Mirabilis",
    description: "A logarithmic spiral obeying the Golden Ratio Phi (1.618). Found in cyclone clouds, seedheads, shells, and pinecones—symbolizing expansion without altering shape.",
    metaphor: "Infinite spiritual expansion while maintaining eternal balance.",
  },
];

interface SacredGeometryProps {
  externalColor?: string; // sync from Solfeggio Tone selection!
  breathingScale?: number; // sync from Breathe technique scale!
}

export default function SacredGeometryViewer({ externalColor = "#ca8a04", breathingScale = 1.0 }: SacredGeometryProps) {
  const [selectedGeo, setSelectedGeo] = useState<GeometryType>(GEOMETRIES[0]);
  const [rotationSpeed, setRotationSpeed] = useState<number>(15); // scaled 0 to 100
  const [lineThickness, setLineThickness] = useState<number>(1.5);
  const [colorTheme, setColorTheme] = useState<string>("sync"); // sync (tone color), gold, violet, emerald, copper
  const [renderScale, setRenderScale] = useState<number>(0.95);
  const [showCircles, setShowCircles] = useState<boolean>(true); // helper toggle for Metatron's circles

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // Interaction variables
  const rotationAngle = useRef<number>(0);
  const mousePosRef = useRef({ x: 0, y: 0, isHovered: false });

  // Resolve active drawing color
  const getActiveColor = () => {
    switch (colorTheme) {
      case "gold": return "#d4af37";
      case "violet": return "#a78bfa";
      case "emerald": return "#34d399";
      case "copper": return "#f97316";
      default: return externalColor;
    }
  };

  // Safe tracking for resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Frame tick simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = 0;

    const render = (time: number) => {
      const delta = lastTime ? (time - lastTime) / 1000 : 0;
      lastTime = time;

      // Update rotation angle
      const speedFactor = (rotationSpeed / 50) * 0.15; // angular speed modifier
      rotationAngle.current += speedFactor * delta;

      // Clear canvas with deep space indigo
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Context limits
      const cx = (canvas.width / window.devicePixelRatio) / 2;
      const cy = (canvas.height / window.devicePixelRatio) / 2;
      const radius = Math.min(cx, cy) * 0.85 * renderScale;

      // Apply Breathing Scale synchronicity
      const currentScale = renderScale * breathingScale;
      const dynamicRadius = Math.min(cx, cy) * 0.82 * currentScale;

      // Core styling config
      const activeColor = getActiveColor();
      ctx.strokeStyle = activeColor;
      ctx.fillStyle = activeColor;
      ctx.lineWidth = lineThickness;
      ctx.shadowColor = activeColor;
      ctx.shadowBlur = 4;

      // Center visual field translation
      ctx.translate(cx, cy);

      // Metatron's Cube and Torus have different rotation traits
      if (selectedGeo.id !== "fibonacci") {
        ctx.rotate(rotationAngle.current);
      }

      // Execute specific geometric drawing routines
      switch (selectedGeo.id) {
        case "flower_of_life":
          drawFlowerOfLife(ctx, dynamicRadius);
          break;
        case "sri_yantra":
          drawSriYantra(ctx, dynamicRadius);
          break;
        case "metatrons_cube":
          drawMetatronsCube(ctx, dynamicRadius);
          break;
        case "torus":
          drawTorus(ctx, dynamicRadius);
          break;
        case "fibonacci":
          drawFibonacci(ctx, dynamicRadius);
          break;
      }

      ctx.restore();

      // Draw Cursor Aura overlay on top (non-rotated space)
      if (mousePosRef.current.isHovered) {
        drawCursorAura(ctx, activeColor, mousePosRef.current);
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [selectedGeo, rotationSpeed, lineThickness, colorTheme, renderScale, breathingScale, showCircles, externalColor]);

  // Geometric Drawing Methods

  const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, size: number) => {
    // Basic Circle dimensions
    const cr = size / 3.8; // single circle radius representation

    // Draw surrounding framing rings (Infinite Cosmic ocean outline)
    ctx.beginPath();
    ctx.arc(0, 0, cr * 3.05, 0, Math.PI * 2);
    ctx.arc(0, 0, cr * 3.12, 0, Math.PI * 2);
    ctx.stroke();

    // Center Circle (The Eternal Present)
    ctx.beginPath();
    ctx.arc(0, 0, cr, 0, Math.PI * 2);
    ctx.stroke();

    // Generate Hexagonal grid layer offsets
    // Layer 1: 6 seed points (60 deg split)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = cr * Math.cos(angle);
      const y = cr * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, cr, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Layer 2: 12 circles
    for (let i = 0; i < 6; i++) {
      // Points exactly twice as far
      const angle = (i * Math.PI) / 3;
      const x2 = cr * 2 * Math.cos(angle);
      const y2 = cr * 2 * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x2, y2, cr, 0, Math.PI * 2);
      ctx.stroke();

      // Points overlapping the 30 degree gaps
      const gapAngle = angle + Math.PI / 6;
      const root3 = Math.sqrt(3);
      const xGap = cr * root3 * Math.cos(gapAngle);
      const yGap = cr * root3 * Math.sin(gapAngle);
      ctx.beginPath();
      ctx.arc(xGap, yGap, cr, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Layer 3 circle additions for full 19 circle structural elegance
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      // Coordinates of the outer hexagonal vertices representing the complete flower structure
      const x31 = cr * 3 * Math.cos(angle);
      const y31 = cr * 3 * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x31, y31, cr, 0, Math.PI * 2);
      ctx.stroke();

      const angleB = angle + Math.PI / 3;
      // Intermediate vertices
      const xA = cr * 2 * Math.cos(angle);
      const yA = cr * 2 * Math.sin(angle);
      const xB = cr * Math.cos(angleB);
      const yB = cr * Math.sin(angleB);
      
      ctx.beginPath();
      ctx.arc(xA + xB, yA + yB, cr, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawSriYantra = (ctx: CanvasRenderingContext2D, size: number) => {
    // Interlocking 9 triangles: 4 facing up (Shiva), 5 facing down (Shakti)
    // To represent this gracefully within standard canvas, we draw a Bhupura frame,
    // draw concentric circles with 8 and 16 lotus petals,
    // and draw interlocking concentric glowing triangles.
    
    // 1. Draw outer Bhupura (Gate structures of Earth temple)
    const bSize = size * 1.05;
    ctx.beginPath();
    // Square grid with elegant 4 gates
    ctx.rect(-bSize, -bSize, bSize * 2, bSize * 2);
    // Draw secondary square to give classic step pattern
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(-bSize * 0.9, -bSize * 0.9, bSize * 1.8, bSize * 1.8);
    ctx.stroke();

    // 2. Draw outer boundary circles
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.85, 0, Math.PI * 2);
    ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Draw 16 lotus petals along the circle edge
    const r16 = size * 0.8;
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      const nextAngle = ((i + 1) * Math.PI) / 8;
      const midAngle = (angle + nextAngle) / 2;
      
      const xStart = r16 * Math.cos(angle);
      const yStart = r16 * Math.sin(angle);
      const xEnd = r16 * Math.cos(nextAngle);
      const yEnd = r16 * Math.sin(nextAngle);
      const xPeak = r16 * 1.08 * Math.cos(midAngle);
      const yPeak = r16 * 1.08 * Math.sin(midAngle);

      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.quadraticCurveTo(xPeak, yPeak, xEnd, yEnd);
      ctx.stroke();
    }

    // 4. Draw 8 lotus petals along the next circle
    const r8 = size * 0.65;
    ctx.beginPath();
    ctx.arc(0, 0, r8, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const nextAngle = ((i + 1) * Math.PI) / 4;
      const midAngle = (angle + nextAngle) / 2;
      
      const xStart = r8 * Math.cos(angle);
      const yStart = r8 * Math.sin(angle);
      const xEnd = r8 * Math.cos(nextAngle);
      const yEnd = r8 * Math.sin(nextAngle);
      const xPeak = r8 * 1.15 * Math.cos(midAngle);
      const yPeak = r8 * 1.15 * Math.sin(midAngle);

      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.quadraticCurveTo(xPeak, yPeak, xEnd, yEnd);
      ctx.stroke();
    }

    // 5. Draw concentric circle framing triangles
    const rTri = size * 0.52;
    ctx.beginPath();
    ctx.arc(0, 0, rTri, 0, Math.PI * 2);
    ctx.stroke();

    // Mathematically modeled collection of 9 interlacing triangles.
    // Upright: (Shiva) and Downward: (Shakti) triangle offsets
    const scaleFactors = [
      { up: true, scale: 0.90, shift: -0.06 },
      { up: false, scale: 0.88, shift: 0.08 },
      { up: true, scale: 0.72, shift: -0.15 },
      { up: false, scale: 0.70, shift: 0.14 },
      { up: false, scale: 0.55, shift: -0.03 },
      { up: true, scale: 0.48, shift: 0.08 },
      { up: false, scale: 0.40, shift: 0.11 },
      { up: true, scale: 0.32, shift: -0.08 },
      { up: false, scale: 0.20, shift: 0.02 },
    ];

    scaleFactors.forEach(({ up, scale, shift }) => {
      const h = rTri * scale;
      const centerShift = rTri * shift;

      ctx.beginPath();
      if (up) {
        // Flat top base, pointing up
        ctx.moveTo(0, -h + centerShift);
        ctx.lineTo(-h * 0.86, h * 0.5 + centerShift);
        ctx.lineTo(h * 0.86, h * 0.5 + centerShift);
      } else {
        // Flat bottom base, pointing down
        ctx.moveTo(0, h + centerShift);
        ctx.lineTo(-h * 0.86, -h * 0.5 + centerShift);
        ctx.lineTo(h * 0.86, -h * 0.5 + centerShift);
      }
      ctx.closePath();
      ctx.stroke();
    });

    // 6. Bindu point (The Absolute Origin)
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawMetatronsCube = (ctx: CanvasRenderingContext2D, size: number) => {
    // 13 Circles (1 Center, 6 Layer 1, 6 Layer 2)
    const cr = size / 4.1; // single circle radius representation
    const centers: { x: number; y: number }[] = [];

    // Center point (The Void / Godhead)
    centers.push({ x: 0, y: 0 });

    // Inner ring (6 points, 60 deg interval, distance cr * Math.sqrt(3))
    const innerDist = cr * 1.732;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      centers.push({
        x: innerDist * Math.cos(angle),
        y: innerDist * Math.sin(angle),
      });
    }

    // Outer ring (6 points, 60 deg interval, distance cr * 2 * Math.sqrt(3) or cr * 3.46)
    const outerDist = innerDist * 2;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      centers.push({
        x: outerDist * Math.cos(angle),
        y: outerDist * Math.sin(angle),
      });
    }

    // 1. Draw circles if toggled
    if (showCircles) {
      ctx.save();
      ctx.lineWidth = lineThickness * 0.7;
      ctx.globalAlpha = 0.45;
      centers.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, cr, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
    }

    // 2. Connect EVERY node to EVERY other node of the 13 points
    // This creates the perfect vector of Metatron's Cube, revealing the 5 Platonic Solids
    ctx.save();
    ctx.lineWidth = lineThickness * 1.1;
    ctx.beginPath();
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        ctx.moveTo(centers[i].x, centers[i].y);
        ctx.lineTo(centers[j].x, centers[j].y);
      }
    }
    ctx.stroke();
    ctx.restore();
  };

  const drawTorus = (ctx: CanvasRenderingContext2D, size: number) => {
    // An elegant revolving ring of nested ellipses
    // Drawing multiple ellipses around the center with different rotation offsets
    const ellipseDensity = 40; // number of orbits
    const w = size;
    const h = size * 0.28; // flat side ratio

    ctx.save();
    for (let i = 0; i < ellipseDensity; i++) {
      const angle = (i * Math.PI * 2) / ellipseDensity;
      ctx.beginPath();
      // Rotate context, draw constant flat ellipse, restore rotation, pulse to expand
      ctx.rotate((Math.PI * 2) / ellipseDensity);
      
      // Dynamic scaling variance along the orbits
      ctx.ellipse(0, 0, w * 0.5, h, 0, 0, Math.PI * 2);
      
      // Control opacity along layers to signify depth
      ctx.globalAlpha = 0.12 + 0.18 * Math.abs(Math.sin(angle + rotationAngle.current));
      ctx.stroke();
    }

    // Draw core vertical/horizontal alignment circles to ground the gravity well
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = lineThickness * 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  const drawFibonacci = (ctx: CanvasRenderingContext2D, size: number) => {
    // Golden Spiral using Phi = 1.618
    // We draw recursive squares and the interlocking quarter-circles
    const phi = 1.61803398875;
    let side = size * 0.52; // start base width

    ctx.save();
    // Centering alignment adjustments
    ctx.translate(-size * 0.28, -size * 0.11);
    
    // Rotate relative to current user speed parameter
    ctx.rotate(rotationAngle.current * 0.3);

    for (let i = 0; i < 9; i++) {
      // Draw square borders
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.beginPath();
      ctx.rect(0, 0, side, side);
      ctx.stroke();
      ctx.restore();

      // Draw quarter circles inside squares
      ctx.beginPath();
      ctx.arc(side, side, side, Math.PI, Math.PI * 1.5);
      ctx.stroke();

      // Golden ratio transforms:
      // Translate to bottomright of next bounding block, rotate coordinate system, downscale side
      ctx.translate(side, side);
      ctx.rotate(Math.PI / 2);
      side = side / phi;
    }
    ctx.restore();
  };

  const drawCursorAura = (
    ctx: CanvasRenderingContext2D,
    activeColor: string,
    mousePos: { x: number; y: number; isHovered: boolean }
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Center points
    const cx = (canvas.width / window.devicePixelRatio) / 2;
    const cy = (canvas.height / window.devicePixelRatio) / 2;

    // Convert raw client coordinate relative to canvas bounds
    const rect = canvas.getBoundingClientRect();
    const x = mousePos.x - rect.left;
    const y = mousePos.y - rect.top;

    ctx.save();
    // Active shining dot
    ctx.fillStyle = activeColor;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Expanding soft halos (Intention Aura)
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 0.05;
    ctx.beginPath();
    ctx.arc(x, y, 64, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mousePosRef.current = {
      x: e.clientX,
      y: e.clientY,
      isHovered: true,
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { ...mousePosRef.current, isHovered: false };
  };

  return (
    <div id="sacred-geometry-engine" className="temple-panel rounded-2xl p-6 flex flex-col items-stretch relative overflow-hidden h-135 transition-all duration-500">
      <div className="flex flex-col md:flex-row items-stretch gap-6 h-full">
        {/* Left Side: Geometry Canvas Viewer */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex-1 min-h-62.5 md:min-h-0 bg-slate-950/40 rounded-xl relative overflow-hidden border border-slate-900/40 group bg-cosmic-grid cursor-crosshair h-full"
        >
          {/* Subtle Dynamic Sanskrit Background Tag */}
          {selectedGeo.sanskritName && (
            <div className="absolute top-4 left-4 pointer-events-none select-none opacity-20">
              <span className="font-serif text-[11px] uppercase tracking-[0.25em] text-amber-500">
                {selectedGeo.sanskritName}
              </span>
            </div>
          )}

          {/* Core Kinetic Canvas */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full block"
          />

          {/* Quick interactive helpers over canvas */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 backdrop-blur-sm opacity-50 group-hover:opacity-100 transition-opacity">
            <button 
              id="geo-zoom-in"
              onClick={() => setRenderScale(prev => Math.min(prev + 0.1, 1.6))}
              className="p-1 hover:text-amber-400 text-slate-400 transition cursor-pointer"
              title="Expand Pattern"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              id="geo-zoom-out"
              onClick={() => setRenderScale(prev => Math.max(prev - 0.1, 0.4))}
              className="p-1 hover:text-amber-400 text-slate-400 transition cursor-pointer"
              title="Condense Pattern"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button 
              id="geo-reset-interaction"
              onClick={() => {
                setRenderScale(0.95);
                rotationAngle.current = 0;
              }}
              className="p-1 hover:text-amber-400 text-slate-400 transition cursor-pointer"
              title="Reset Alignment"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Geometries Menu & Control Parameters */}
        <div className="w-full md:w-70 flex flex-col justify-between h-full overflow-y-auto pr-1 relative">
          <div className="space-y-4">
            {/* Title block */}
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              <h3 className="font-serif text-lg tracking-wider text-slate-100 font-medium">
                Resonant Geometry
              </h3>
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-white/50">
              Flow Tip: choose a geometry, then scroll for adjustment knobs.
            </div>

            {/* List selector */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-mono tracking-wider text-slate-300 block mb-1">Select Matrix Geometry:</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {GEOMETRIES.map((geo) => (
                  <button
                    id={`geo-btn-${geo.id}`}
                    key={geo.id}
                    onClick={() => setSelectedGeo(geo)}
                    className={`group w-full text-left py-1.5 px-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all duration-300 ${
                      geo.id === selectedGeo.id 
                        ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-200 font-serif font-medium" 
                        : "border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>{geo.name}</span>
                    <Eye className={`w-3 h-3 ${geo.id === selectedGeo.id ? "opacity-100 text-indigo-400" : "opacity-0 group-hover:opacity-100"}`} />
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/45 mt-1">Scroll to reveal all geometry variants</p>
            </div>

            {/* Geometry Details */}
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed text-[12px] text-slate-200">
              <p className="text-indigo-300 font-mono font-bold uppercase text-[11px] tracking-wider mb-1">
                Philosophical Meaning
              </p>
              <p className="mb-2 text-slate-300 select-none">
                {selectedGeo.description}
              </p>
              <p className="text-slate-300 italic font-serif border-t border-white/5 pt-1.5 mt-1">
                &ldquo;{selectedGeo.metaphor}&rdquo;
              </p>
            </div>

            {/* Aesthetic Parameters Sliders */}
            <div className="space-y-2 border-t border-white/5 pt-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjustment Knobs</span>
              </div>

              {/* Slider 1: Spin Velocity */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-0.5">
                  <span>Spin Velocity</span>
                  <span>{rotationSpeed}%</span>
                </div>
                <input
                  id="geo-spin-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Slider 2: Line Radius (Thickness) */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-0.5">
                  <span>Line Weight</span>
                  <span>{lineThickness}px</span>
                </div>
                <input
                  id="geo-thickness-slider"
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.25"
                  value={lineThickness}
                  onChange={(e) => setLineThickness(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Additional custom toggles depending on geo */}
              {selectedGeo.id === "metatrons_cube" && (
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Reveal Blueprint Core Circles</span>
                  <input
                    id="geo-blueprint-circles-toggle"
                    type="checkbox"
                    checked={showCircles}
                    onChange={(e) => setShowCircles(e.target.checked)}
                    className="rounded bg-black/40 border-white/10 text-indigo-500 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer accent-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Color Palettes selection */}
          <div className="border-t border-white/5 pt-3 mt-3 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Stellar Hue Spectrum:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: "sync", label: "🎨", tip: "Sync with Resonator Tone" },
                { id: "gold", label: "🌟", tip: "Midas Gold" },
                { id: "violet", label: "🔮", tip: "Lotus Violet" },
                { id: "emerald", label: "🌿", tip: "Healing Emerald" },
                { id: "copper", label: "🍁", tip: "Solar Copper" },
              ].map((theme) => (
                <button
                  id={`color-theme-${theme.id}`}
                  key={theme.id}
                  onClick={() => setColorTheme(theme.id)}
                  title={theme.tip}
                  className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition cursor-pointer border ${
                    colorTheme === theme.id 
                      ? "border-indigo-500/80 bg-indigo-500/10 text-indigo-400 scale-105" 
                      : "border-white/5 bg-black/40 hover:bg-white/5 hover:border-white/10 text-slate-500"
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 mt-4 py-2 bg-linear-to-t from-[#020205] via-[#020205]/90 to-transparent text-center text-[9px] font-mono uppercase tracking-wider text-white/25 pointer-events-none">
            More controls below
          </div>
        </div>
      </div>
    </div>
  );
}
