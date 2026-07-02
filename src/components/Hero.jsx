import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight, Crosshair, Activity, Radio } from 'lucide-react';

// Count-up hook
const useCountUp = (end, duration = 2000, start = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
};

// Small "+" registration mark, used at the four corners of the sheet
const RegMark = ({ className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" className={`mh2-regmark ${className}`} aria-hidden="true">
    <line x1="9" y1="2" x2="9" y2="16" stroke="currentColor" strokeWidth="1" />
    <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1" />
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

const HeroBlueprint = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const clientsCount = useCountUp(200, 1600, mounted);
  const satisfactionCount = useCountUp(98, 1800, mounted);
  const performanceCount = useCountUp(142.6, 2000, mounted);

  // Semi-circle gauge geometry
  const gaugeRadius = 42;
  const gaugeCircumference = Math.PI * gaugeRadius;
  const gaugeOffset = useMemo(
    () => gaugeCircumference - (gaugeCircumference * satisfactionCount) / 100,
    [satisfactionCount, gaugeCircumference]
  );

  const today = useMemo(() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  }, []);

  return (
    <section className="mh2-sheet pt-28 pb-24 lg:pt-32 lg:pb-28 relative overflow-hidden">
      {/* Blueprint grid */}
      <div className="mh2-grid-major" aria-hidden="true" />
      <div className="mh2-grid-minor" aria-hidden="true" />

      {/* Registration marks */}
      <RegMark className="mh2-corner mh2-corner-tl" />
      <RegMark className="mh2-corner mh2-corner-tr" />
      <RegMark className="mh2-corner mh2-corner-bl" />
      <RegMark className="mh2-corner mh2-corner-br" />

      <div className="container-custom relative z-10">
        {/* Title block */}
        <div
          className={`flex items-center justify-between mb-14 pb-3 border-b border-cyan-200/15 mh2-mono ${mounted ? 'mh2-in' : 'mh2-pre'}`}
          style={{ transitionDelay: '0ms' }}
        >
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left — the drawing */}
          <div className="lg:col-span-7">
            <div
              className={`inline-flex items-center gap-2 mb-8 mh2-mono ${mounted ? 'mh2-in' : 'mh2-pre'}`}
              style={{ transitionDelay: '80ms' }}
            >
              <Crosshair size={13} className="text-amber-400" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-slate-300">
                Maurisys Solution — Studio Notes
              </span>
            </div>

            <h1
              className={`mh2-display text-white mb-8 mh2-mono ${mounted ? 'mh2-in' : 'mh2-pre'}`}
              style={{ transitionDelay: '160ms' }}
            >
              <span className="block">WHERE IDEAS</span>
              <span className="mh2-headline-underlined block relative">
                BECOME DIGITAL REALITY
                <svg
                  className="mh2-dimline"
                  viewBox="0 0 620 24"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <line x1="0" y1="12" x2="600" y2="12" />
                  <line x1="0" y1="4" x2="0" y2="20" />
                  <line x1="600" y1="4" x2="600" y2="20" />
                </svg>
              </span>
            </h1>

            <p
              className={`text-base md:text-lg text-slate-400 mb-10 leading-relaxed max-w-lg mh2-mono ${mounted ? 'mh2-in' : 'mh2-pre'}`}
              style={{ transitionDelay: '260ms' }}
            >
              We engineer custom software, brand experiences, and growth strategies for ambitious
              businesses. Precision‑built, reliably delivered, measurably effective.
            </p>

            <div
              className={`flex flex-wrap gap-4 mb-16 mh2-mono ${mounted ? 'mh2-in' : 'mh2-pre'}`}
              style={{ transitionDelay: '340ms' }}
            >
              <Link to="/contact" className="mh2-stamp mh2-stamp-fill">
                Start Your Project <ArrowUpRight size={15} className="ml-1.5" />
              </Link>
              <Link to="/portfolio" className="mh2-stamp">
                View Our Work
              </Link>
            </div>

            {/* Ruler-style stat row */}
            <div
              className={`mh2-ruler mh2-mono ${mounted ? 'mh2-in' : 'mh2-pre'}`}
              style={{ transitionDelay: '420ms' }}
            >
              <div className="mh2-ruler-tick">
                <p className="mh2-stat">{Math.floor(clientsCount)}+</p>
                <p className="mh2-stat-label">Clients served</p>
              </div>
              <div className="mh2-ruler-tick">
                <p className="mh2-stat">{Math.floor(satisfactionCount)}%</p>
                <p className="mh2-stat-label">Satisfaction rate</p>
              </div>
              <div className="mh2-ruler-tick">
                <p className="mh2-stat">24/7</p>
                <p className="mh2-stat-label">Support coverage</p>
              </div>
            </div>
          </div>

          {/* Right — instrument panel */}
          <div
            className={`lg:col-span-5 mh2-mono ${mounted ? 'mh2-in' : 'mh2-pre'}`}
            style={{ transitionDelay: '260ms' }}
          >
            <div className="mh2-panel">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Radio size={12} className="text-amber-400 mh2-blink" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-slate-400">
                    Perf. Monitor — Live
                  </span>
                </div>
                <Activity size={13} className="text-cyan-300/70" />
              </div>

              {/* Oscilloscope-style trace */}
              <div className="mh2-scope mb-6">
                <svg viewBox="0 0 300 90" preserveAspectRatio="none" className="w-full h-full">
                  <line x1="0" y1="45" x2="300" y2="45" className="mh2-scope-baseline" />
                  <path
                    d="M0,60 L30,58 L55,30 L80,50 L110,20 L140,44 L170,15 L200,38 L230,10 L260,32 L300,18"
                    className="mh2-scope-trace"
                  />
                </svg>
                <div className="mh2-scope-sweep" />
                <span className="mh2-scope-value">+{performanceCount.toFixed(1)}%</span>
              </div>

              {/* Gauge + readouts */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex flex-col items-center justify-center">
                  <svg viewBox="0 0 100 56" className="w-full max-w-[130px]">
                    <path
                      d="M 8 50 A 42 42 0 0 1 92 50"
                      className="mh2-gauge-track"
                    />
                    <path
                      d="M 8 50 A 42 42 0 0 1 92 50"
                      className="mh2-gauge-fill"
                      style={{
                        strokeDasharray: gaugeCircumference,
                        strokeDashoffset: gaugeOffset,
                      }}
                    />
                  </svg>
                  <p className="mh2-stat text-lg -mt-3">{Math.floor(satisfactionCount)}%</p>
                  <p className="mh2-stat-label">Satisfaction</p>
                </div>
                <div className="space-y-3">
                  <div className="mh2-readout">
                    <span className="mh2-readout-label">Uptime</span>
                    <span className="mh2-readout-value">24 / 7</span>
                  </div>
                  <div className="mh2-readout">
                    <span className="mh2-readout-label">Clients</span>
                    <span className="mh2-readout-value">{Math.floor(clientsCount)}+</span>
                  </div>
                  <div className="mh2-readout">
                    <span className="mh2-readout-label">Build</span>
                    <span className="mh2-readout-value">v2.4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mh2-sheet {
          background: #0A1930;
        }

        .mh2-mono {
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        .mh2-display {
          font-family: 'Space Grotesk', Inter, ui-sans-serif, system-ui, sans-serif;
          font-weight: 700;
          font-size: clamp(2.4rem, 5.4vw, 4.2rem);
          line-height: 1.02;
          letter-spacing: -0.01em;
        }

        .mh2-grid-major, .mh2-grid-minor {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .mh2-grid-major {
          background-image:
            linear-gradient(to right, rgba(142,202,230,0.09) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(142,202,230,0.09) 1px, transparent 1px);
          background-size: 88px 88px;
          mask-image: radial-gradient(ellipse at 50% 20%, black 0%, transparent 78%);
        }
        .mh2-grid-minor {
          background-image:
            linear-gradient(to right, rgba(142,202,230,0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(142,202,230,0.035) 1px, transparent 1px);
          background-size: 22px 22px;
          mask-image: radial-gradient(ellipse at 50% 20%, black 0%, transparent 60%);
        }

        .mh2-regmark {
          position: absolute;
          color: rgba(142,202,230,0.4);
          z-index: 1;
        }
        .mh2-corner-tl { top: 20px; left: 20px; }
        .mh2-corner-tr { top: 20px; right: 20px; }
        .mh2-corner-bl { bottom: 20px; left: 20px; }
        .mh2-corner-br { bottom: 20px; right: 20px; }

        .mh2-pre { opacity: 0; transform: translateY(14px); }
        .mh2-in {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }

        .mh2-headline-underlined { padding-bottom: 0.35em; color: #FFB703; }
        .mh2-dimline {
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 100%;
          max-width: 620px;
          height: 24px;
          overflow: visible;
        }
        .mh2-dimline line {
          stroke: rgba(255,183,3,0.55);
          stroke-width: 1.5;
          stroke-dasharray: 640;
          stroke-dashoffset: 640;
          animation: mh2Draw 1.1s cubic-bezier(0.16,1,0.3,1) 0.9s forwards;
        }
        @keyframes mh2Draw { to { stroke-dashoffset: 0; } }

        .mh2-stamp {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          padding: 12px 22px;
          border: 1px solid rgba(142,202,230,0.4);
          color: #CFEBF5;
          border-radius: 2px;
          position: relative;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .mh2-stamp:hover { border-color: rgba(255,183,3,0.7); color: #fff; }
        .mh2-stamp-fill {
          background: #FFB703;
          color: #0A1930;
          border-color: #FFB703;
          font-weight: 600;
        }
        .mh2-stamp-fill:hover {
          background: #ffc733;
          color: #0A1930;
          transform: scale(1.02) rotate(-0.4deg);
        }
        .mh2-stamp-fill { transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), background 0.2s ease; }

        .mh2-ruler {
          display: flex;
          border-top: 1px dashed rgba(142,202,230,0.25);
          padding-top: 22px;
          gap: 0;
          max-width: 34rem;
        }
        .mh2-ruler-tick {
          flex: 1;
          padding-left: 18px;
          border-left: 1px solid rgba(142,202,230,0.25);
        }
        .mh2-ruler-tick:first-child { padding-left: 0; border-left: none; }
        .mh2-stat { font-size: 1.4rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
        .mh2-stat-label { font-size: 10.5px; color: rgba(148,163,184,0.75); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }

        .mh2-panel {
          border: 1px solid rgba(142,202,230,0.22);
          background: linear-gradient(180deg, rgba(142,202,230,0.05), rgba(255,255,255,0.015));
          border-radius: 4px;
          padding: 22px;
          position: relative;
        }
        .mh2-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 4px;
          padding: 1px;
          pointer-events: none;
        }

        .mh2-blink { animation: mh2Blink 1.6s ease-in-out infinite; }
        @keyframes mh2Blink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }

        .mh2-scope {
          position: relative;
          height: 90px;
          border: 1px solid rgba(142,202,230,0.15);
          border-radius: 3px;
          background: rgba(6,16,34,0.5);
          overflow: hidden;
        }
        .mh2-scope-baseline { stroke: rgba(142,202,230,0.15); stroke-width: 1; }
        .mh2-scope-trace {
          fill: none;
          stroke: #6EC3E0;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 420;
          stroke-dashoffset: 420;
          animation: mh2Trace 1.8s cubic-bezier(0.16,1,0.3,1) 0.5s forwards;
          filter: drop-shadow(0 0 3px rgba(110,195,224,0.5));
        }
        @keyframes mh2Trace { to { stroke-dashoffset: 0; } }
        .mh2-scope-sweep {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 46px;
          background: linear-gradient(90deg, transparent, rgba(255,183,3,0.14), transparent);
          animation: mh2Sweep 3.4s linear infinite;
        }
        @keyframes mh2Sweep {
          0% { left: -46px; }
          100% { left: 100%; }
        }
        .mh2-scope-value {
          position: absolute;
          top: 8px;
          right: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #FFB703;
        }

        .mh2-gauge-track { fill: none; stroke: rgba(142,202,230,0.18); stroke-width: 7; stroke-linecap: round; }
        .mh2-gauge-fill {
          fill: none;
          stroke: #FFB703;
          stroke-width: 7;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.3s ease-out;
          filter: drop-shadow(0 0 4px rgba(255,183,3,0.45));
        }

        .mh2-readout {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-bottom: 1px dashed rgba(142,202,230,0.18);
          padding-bottom: 6px;
        }
        .mh2-readout-label { font-size: 10.5px; color: rgba(148,163,184,0.7); text-transform: uppercase; letter-spacing: 0.08em; }
        .mh2-readout-value { font-size: 12.5px; color: #CFEBF5; font-weight: 600; }

        @media (prefers-reduced-motion: reduce) {
          .mh2-pre, .mh2-in, .mh2-dimline line, .mh2-scope-trace, .mh2-scope-sweep, .mh2-blink, .mh2-stamp-fill {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroBlueprint;