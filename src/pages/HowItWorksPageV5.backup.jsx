import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LITEPAPER_URL } from "../phases/constants.js";
import Navbar from "../components/Navbar.jsx";
import AliceNucleus from "../components/AliceNucleus.jsx";
import { useCanvasAnimation } from "../hooks/useCanvasAnimation.js";
import {
  adaptDelegationChain,
  adaptEvaporation,
  adaptContractBox,
  adaptParallelLanes,
} from "../phases/v5/adapters.js";

gsap.registerPlugin(ScrollTrigger);

/* ── Section data ── */

const SECTIONS = [
  {
    id: "intro",
    gradient: "gradient-intro",
    label: "THE PROBLEM",
    title: "When agents delegate,\ntrust breaks down",
    canvas: "delegation",
  },
  {
    id: "evaporation",
    gradient: "gradient-evaporation",
    label: "THE PROBLEM",
    title: "Every agent starts\nfrom zero",
    canvas: "evaporation",
  },
  {
    id: "contract",
    gradient: "gradient-contract",
    label: "THE PROBLEM",
    title: "Your tokens live in\nsomeone else\u2019s contract",
    canvas: "contract",
  },
  {
    id: "pivot",
    gradient: "gradient-pivot",
    title: "Three problems.\nOne root cause.",
    italic: true,
  },
  {
    id: "who",
    gradient: "gradient-who",
    special: "who",
  },
  {
    id: "solution",
    gradient: "gradient-solution",
    label: "THE SOLUTION",
    title: "Delegation is scoped\nand signed",
    visual: "card-delegation",
    showNucleus: true,
  },
  {
    id: "preferences",
    gradient: "gradient-preferences",
    label: "CONTEXT SUPERSTATE",
    title: "Your preferences\nfollow you",
    visual: "card-preferences",
    showNucleus: true,
  },
  {
    id: "assets",
    gradient: "gradient-assets",
    label: "CONTEXT SUPERSTATE",
    title: "Your assets\nlive with you",
    visual: "card-assets",
    showNucleus: true,
  },
  {
    id: "permissions",
    gradient: "gradient-permissions",
    label: "CONTEXT SUPERSTATE",
    title: "You control\nwho sees what",
    visual: "card-permissions",
    showNucleus: true,
  },
  {
    id: "scale",
    gradient: "gradient-scale",
    label: "THE PARTICIPANT LAYER",
    title: "Independent. Parallel.\nParticipant-centric.",
    canvas: "lanes",
  },
  {
    id: "cta",
    special: "cta",
  },
];

/* ── Enhanced visual components ── */

function SectionVisual({ type }) {
  const base = "section-visual mt-8";

  switch (type) {
    case "card-delegation":
      return (
        <div className={`${base} card-surface px-7 py-6 max-w-[340px] text-left`}>
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#7B5EA7] mb-4">Scoped Authority</div>
          <div className="flex flex-col gap-2.5">
            {[
              ["scope", "book:flights, book:hotel", "granted", "#3A8F6E"],
              ["pay:>$500", "requires approval", "denied", "#C44D5A"],
              ["read:prefs", "all preferences", "granted", "#3A8F6E"],
              ["depth", "max 2 hops", "enforced", "#2D7EC4"],
              ["signed", "ed25519:alice", "verified", "#3A8F6E"],
              ["expires", "2024-10-15T23:59", "active", "#7B5EA7"],
            ].map(([key, detail, status, color]) => (
              <div key={key} className="visual-row flex justify-between items-baseline font-mono text-[10px] gap-4">
                <span className="text-[#1A1A1A]/35 shrink-0">{key}</span>
                <span className="text-[#1A1A1A]/20 text-[9px] truncate">{detail}</span>
                <span className="shrink-0" style={{ color }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "card-preferences":
      return (
        <div className={`${base} card-surface px-7 py-6 max-w-[320px] text-left`}>
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#7B5EA7] mb-4">Preferences</div>
          <div className="flex flex-col gap-2.5">
            {[
              ["shellfish allergy", "medical records"],
              ["window seat", "booking history"],
              ["late check-in (9pm+)", "travel pattern"],
              ["quiet room, no elevator", "hotel feedback"],
              ["budget: $200/night", "spending history"],
              ["vegetarian backup", "dietary log"],
            ].map(([pref, source]) => (
              <div key={pref} className="visual-row flex justify-between items-baseline font-mono text-[10px] gap-4">
                <span className="text-[#1A1A1A]/45">{pref}</span>
                <span className="text-[#1A1A1A]/15 text-[8px] shrink-0">{source}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "card-assets":
      return (
        <div className={`${base} grid grid-cols-3 gap-3 max-w-[360px]`}>
          {[
            ["kMOI", "12,450", "#7B5EA7"],
            ["BTC", "0.847", "#F7931A"],
            ["ETH", "4.20", "#627EEA"],
            ["SOL", "89.3", "#14F195"],
            ["USDC", "2,500", "#2775CA"],
            ["DOT", "156", "#E6007A"],
          ].map(([token, amount, color]) => (
            <div
              key={token}
              className="visual-row card-surface px-4 py-3 text-center"
            >
              <div
                className="font-mono text-[11px] font-medium tracking-wider mb-1"
                style={{ color }}
              >
                {token}
              </div>
              <div className="font-mono text-[9px] text-[#1A1A1A]/30">
                {amount}
              </div>
            </div>
          ))}
        </div>
      );

    case "card-permissions":
      return (
        <div className={`${base} card-surface px-7 py-6 max-w-[360px] text-left`}>
          <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#7B5EA7] mb-4">Agent Permissions</div>
          <div className="flex flex-col gap-3">
            {[
              ["Flight Agent", ["read", "book"], ["pay"]],
              ["Hotel Agent", ["read", "book"], ["pay", "delegate"]],
              ["Dinner Agent", ["read"], ["book", "pay"]],
              ["Bank Agent", ["read", "pay"], ["delegate"]],
            ].map(([agent, granted, denied]) => (
              <div key={agent} className="visual-row">
                <div className="font-mono text-[10px] text-[#1A1A1A]/50 mb-1">{agent}</div>
                <div className="flex gap-2 font-mono text-[8px]">
                  {granted.map((p) => (
                    <span key={p} className="text-[#3A8F6E]">{"\u2713"}{p}</span>
                  ))}
                  {denied.map((p) => (
                    <span key={p} className="text-[#C44D5A]">{"\u2717"}{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ── Canvas section wrapper ── */

function CanvasSection({ id, gradient, label, title, canvasType, containerRef }) {
  const drawFn =
    canvasType === "delegation" ? adaptDelegationChain :
    canvasType === "evaporation" ? adaptEvaporation :
    canvasType === "contract" ? adaptContractBox :
    canvasType === "lanes" ? adaptParallelLanes :
    null;

  const { canvasRef, sectionRef } = useCanvasAnimation(drawFn, containerRef, {
    duration: canvasType === "lanes" ? 6 : 5,
  });

  const lines = title.split("\n");

  return (
    <section
      ref={sectionRef}
      id={`section-${id}`}
      className={`snap-section ${gradient}`}
    >
      <canvas ref={canvasRef} />
      <div className="section-content absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <div
          className="flex flex-col items-center pb-10 pt-12 px-6 md:px-12 text-center"
          style={{
            background: "linear-gradient(to top, rgba(245,243,238,0.95) 40%, rgba(245,243,238,0) 100%)",
          }}
        >
          {label && (
            <span className="section-label font-mono text-[10px] tracking-[0.2em] uppercase text-[#7B5EA7] font-medium mb-3 block">
              {label}
            </span>
          )}
          <h2 className="section-title font-serif leading-[1.1] text-[#1A1A1A] max-w-[700px] text-[clamp(1.6rem,3vw,2.5rem)]">
            {lines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}

/* ── Standard section (no canvas) ── */

function Section({ id, gradient, label, title, subtitle, visual, italic, showNucleus }) {
  const lines = title.split("\n");
  return (
    <section id={`section-${id}`} className={`snap-section ${gradient}`}>
      <div className="section-content max-w-[900px] mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        {showNucleus && <AliceNucleus size={48} />}
        {label && (
          <span className="section-label font-mono text-[10px] tracking-[0.2em] uppercase text-[#7B5EA7] font-medium mb-5">
            {label}
          </span>
        )}
        <h2
          className={`section-title font-serif leading-[1.1] text-[#1A1A1A] max-w-[700px] ${
            italic
              ? "italic text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#1A1A1A]/60"
              : "text-[clamp(2.5rem,5vw,4.5rem)]"
          }`}
        >
          {lines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>
        {subtitle && (
          <p className="section-subtitle font-mono text-[13px] text-[#1A1A1A]/30 mt-5 max-w-[460px]">
            {subtitle}
          </p>
        )}
        {visual && <SectionVisual type={visual} />}
      </div>
    </section>
  );
}

function SectionWho() {
  return (
    <section id="section-who" className="snap-section gradient-who">
      <div className="flex flex-col items-center text-center">
        <h2 className="section-title font-serif font-bold text-[clamp(6rem,15vw,14rem)] leading-[0.85] tracking-[-0.04em] text-[#1A1A1A]">
          WHO
        </h2>
        <p className="section-subtitle font-mono text-[13px] tracking-[0.1em] text-[#1A1A1A]/30 mt-6">
          is missing.
        </p>
      </div>
    </section>
  );
}

function SectionCTA() {
  return (
    <section id="section-cta" className="snap-section bg-hero-gradient">
      <div className="section-content flex flex-col items-center text-center px-6">
        <h2 className="section-title font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.1] text-[#1A1A1A] mb-5">
          Your context. Your assets.<br />Your rules.
        </h2>
        <p className="section-subtitle font-mono text-[13px] text-[#1A1A1A]/30 mb-10 max-w-[460px] leading-relaxed">
          Read the litepaper, explore the docs, or start building with Cocolang.
        </p>
        <a
          href={LITEPAPER_URL}
          className="section-visual inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] text-[#F5F3EE] px-9 py-3.5 font-mono text-[11px] tracking-[0.15em] uppercase hover:bg-[#7B5EA7] transition-colors duration-300 no-underline"
        >
          READ LITEPAPER →
        </a>
      </div>
    </section>
  );
}

/* ── Main page ── */

export default function HowItWorksPageV5() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = gsap.utils.toArray(".snap-section", container);

    // Set initial hidden state for all animatable text elements
    sections.forEach((section) => {
      const els = section.querySelectorAll(
        ".section-label, .section-title, .section-subtitle, .section-visual, .visual-row"
      );
      gsap.set(els, { opacity: 0, y: 24 });
    });

    // WHO title gets special initial state
    const whoTitle = container.querySelector("#section-who .section-title");
    if (whoTitle) gsap.set(whoTitle, { opacity: 0, scale: 0.5, y: 0 });

    sections.forEach((section, i) => {
      const label = section.querySelector(".section-label");
      const title = section.querySelector(".section-title");
      const subtitle = section.querySelector(".section-subtitle");
      const visual = section.querySelector(".section-visual");
      const rows = section.querySelectorAll(".visual-row");

      if (i === 0) {
        const els = [label, title, subtitle, visual].filter(Boolean);
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.4,
          ease: "power2.out",
        });
        return;
      }

      // WHO section: special scale animation
      if (section.id === "section-who") {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller: container,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        });
        if (title) {
          tl.to(title, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out" });
        }
        if (subtitle) {
          tl.to(subtitle, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");
        }
        return;
      }

      // All other sections: staggered entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scroller: container,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      if (label) tl.to(label, { opacity: 1, y: 0, duration: 0.4 });
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2");
      if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");
      if (visual) tl.to(visual, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");

      // Stagger visual rows (card content) for enhanced cards
      if (rows.length > 0) {
        tl.to(rows, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.08,
          ease: "power2.out",
        }, "-=0.2");
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Navbar activePage="how-it-works" />
      <div ref={containerRef} className="snap-container">
        {SECTIONS.map((s) => {
          if (s.special === "who") return <SectionWho key={s.id} />;
          if (s.special === "cta") return <SectionCTA key={s.id} />;
          if (s.canvas) {
            return (
              <CanvasSection
                key={s.id}
                id={s.id}
                gradient={s.gradient}
                label={s.label}
                title={s.title}
                canvasType={s.canvas}
                containerRef={containerRef}
              />
            );
          }
          return <Section key={s.id} {...s} />;
        })}
      </div>
    </>
  );
}
