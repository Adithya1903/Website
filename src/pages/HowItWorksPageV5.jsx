import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar.jsx";
import "../styles/how-it-works.css";

gsap.registerPlugin(ScrollTrigger);

const LITEPAPER_URL = "/MOILitePaper.pdf";

/* ────────────────────────────────────────────────
   Section sub-components (no special JS)
   ──────────────────────────────────────────────── */

function TrustChain() {
  return (
    <section className="s1" id="s1">
      <div className="sec-inner">
        <div className="pill gs">Act 1 — The Problem</div>
        <h2 className="headline gs">
          When agents delegate,
          <br />
          trust breaks down
        </h2>
        <p className="subline gs">
          Alice asks her agent to book a flight. It delegates to a flight agent,
          which delegates to payment, which delegates to the bank. Watch what
          happens to her identity at each hop.
        </p>

        <div className="chain-grid gs">
          {/* Your Agent */}
          <div className="agent-card">
            <div className="agent-header">
              <span className="agent-icon">👤</span>
              <span className="agent-name">Your Agent</span>
              <span className="trust-badge trust-green">100%</span>
            </div>
            <div className="signal-row">
              <span className="signal-label">Signal</span>
              <div className="signal-bars">
                <div className="signal-bar on-g" style={{ height: 8 }} />
                <div className="signal-bar on-g" style={{ height: 12 }} />
                <div className="signal-bar on-g" style={{ height: 16 }} />
                <div className="signal-bar on-g" style={{ height: 20 }} />
              </div>
            </div>
            <div className="field-row field-ok">
              <span className="field-label">Identity</span>
              <span className="field-val">alice.moi</span>
            </div>
            <div className="field-row field-ok">
              <span className="field-label">Scope</span>
              <span className="field-val">Book flight ≤ $500</span>
            </div>
            <div className="field-row field-ok">
              <span className="field-label">Prefs</span>
              <span className="field-val">Window · Vegetarian</span>
            </div>
            <div className="field-row field-ok">
              <span className="field-label">History</span>
              <span className="field-val">12 prior bookings</span>
            </div>
            <p className="agent-note">Full context. Full trust.</p>
            <div className="trust-bar">
              <div className="trust-bar-fill" style={{ width: "100%", background: "var(--bob)" }} />
            </div>
          </div>

          <div className="chain-conn">
            <div className="conn-line" />
            <span className="conn-chevron">›</span>
            <span className="conn-pill">⚠ data lost</span>
            <div className="conn-line" />
          </div>

          {/* Flight Agent */}
          <div className="agent-card">
            <div className="agent-header">
              <span className="agent-icon">✈️</span>
              <span className="agent-name">Flight Agent</span>
              <span className="trust-badge trust-green">65%</span>
            </div>
            <div className="signal-row">
              <span className="signal-label">Signal</span>
              <div className="signal-bars">
                <div className="signal-bar on-g" style={{ height: 8 }} />
                <div className="signal-bar on-g" style={{ height: 12 }} />
                <div className="signal-bar on-g" style={{ height: 16 }} />
                <div className="signal-bar off" style={{ height: 20 }} />
              </div>
            </div>
            <div className="field-row field-ok">
              <span className="field-label">Identity</span>
              <span className="field-val">alice.moi</span>
            </div>
            <div className="field-row field-ok">
              <span className="field-label">Scope</span>
              <span className="field-val">Book flight ≤ $500</span>
            </div>
            <div className="field-row field-redacted">
              <span className="field-label">Prefs</span>
              <span className="field-val">REDACTED</span>
            </div>
            <div className="field-row field-redacted">
              <span className="field-label">History</span>
              <span className="field-val">REDACTED</span>
            </div>
            <p className="agent-note">Preferences & history already gone.</p>
            <div className="trust-bar">
              <div className="trust-bar-fill" style={{ width: "65%", background: "var(--bob)" }} />
            </div>
          </div>

          <div className="chain-conn">
            <div className="conn-line" />
            <span className="conn-chevron">›</span>
            <span className="conn-pill">⚠ data lost</span>
            <div className="conn-line" />
          </div>

          {/* Payment Agent */}
          <div className="agent-card">
            <div className="agent-header">
              <span className="agent-icon">💳</span>
              <span className="agent-name">Payment Agent</span>
              <span className="trust-badge trust-amber">25%</span>
            </div>
            <div className="signal-row">
              <span className="signal-label">Signal</span>
              <div className="signal-bars">
                <div className="signal-bar on-a" style={{ height: 8 }} />
                <div className="signal-bar off" style={{ height: 12 }} />
                <div className="signal-bar off" style={{ height: 16 }} />
                <div className="signal-bar off" style={{ height: 20 }} />
              </div>
            </div>
            <div className="field-row field-deg">
              <span className="field-label">Identity</span>
              <span className="field-val">0xd41...f07</span>
            </div>
            <div className="field-row field-deg">
              <span className="field-label">Scope</span>
              <span className="field-val">charge some amount?</span>
            </div>
            <div className="field-row field-redacted">
              <span className="field-label">Prefs</span>
              <span className="field-val">REDACTED</span>
            </div>
            <div className="field-row field-redacted">
              <span className="field-label">History</span>
              <span className="field-val">REDACTED</span>
            </div>
            <p className="agent-note">Identity reduced to a raw address.</p>
            <div className="trust-bar">
              <div className="trust-bar-fill" style={{ width: "25%", background: "var(--charlie)" }} />
            </div>
          </div>

          <div className="chain-conn">
            <div className="conn-line" />
            <span className="conn-chevron">›</span>
            <span className="conn-pill">⚠ data lost</span>
            <div className="conn-line" />
          </div>

          {/* Bank Agent */}
          <div className="agent-card">
            <div className="agent-header">
              <span className="agent-icon">🏦</span>
              <span className="agent-name">Bank Agent</span>
              <span className="trust-badge trust-red">0%</span>
            </div>
            <div className="signal-row">
              <span className="signal-label">Signal</span>
              <div className="signal-bars">
                <div className="signal-bar off" style={{ height: 8 }} />
                <div className="signal-bar off" style={{ height: 12 }} />
                <div className="signal-bar off" style={{ height: 16 }} />
                <div className="signal-bar off" style={{ height: 20 }} />
              </div>
            </div>
            <div className="field-row field-lost">
              <span className="field-label">Identity</span>
              <span className="field-val blink">UNKNOWN</span>
            </div>
            <div className="field-row field-lost">
              <span className="field-label">Scope</span>
              <span className="field-val blink">UNKNOWN</span>
            </div>
            <div className="field-row field-redacted">
              <span className="field-label">Prefs</span>
              <span className="field-val">REDACTED</span>
            </div>
            <div className="field-row field-redacted">
              <span className="field-label">History</span>
              <span className="field-val">REDACTED</span>
            </div>
            <p className="agent-note">No idea who this is or what they want.</p>
            <div className="trust-bar">
              <div className="trust-bar-fill" style={{ width: "0%" }} />
            </div>
          </div>
        </div>

        <p className="caption gs">
          By the 4th agent, Alice's identity is gone. The bank has no idea who
          authorized this transaction.
        </p>
      </div>
    </section>
  );
}

function ColdStart() {
  return (
    <section className="s2">
      <div className="sec-inner">
        <h2 className="headline gs">
          Every agent starts
          <br />
          from zero
        </h2>
        <p className="subline gs">
          No memory carries over. Every agent cold-starts, asking the same
          questions you've already answered. Context evaporates between agents.
        </p>

        <div className="chat-grid gs">
          <div className="chat-card">
            <div className="chat-chrome">
              <div className="chrome-dot" />
              <div className="chrome-dot" />
              <div className="chrome-dot" />
              <span className="chrome-name">Travel Agent</span>
              <div className="mem-badge"><div className="mem-dot" />0 KB</div>
            </div>
            <div className="chat-body">
              <div className="msg msg-agent">What is your name?</div>
              <div className="msg msg-user">Alice</div>
              <div className="msg msg-agent">Seat preference?</div>
              <div className="msg msg-user">Window seat</div>
            </div>
            <div className="frust-row">
              <span className="frust-label">Frustration</span>
              <div className="frust-track"><div className="frust-fill" style={{ width: "33%" }} /></div>
            </div>
          </div>

          <div className="chat-card">
            <div className="chat-chrome">
              <div className="chrome-dot" />
              <div className="chrome-dot" />
              <div className="chrome-dot" />
              <span className="chrome-name">Payment Agent</span>
              <div className="mem-badge"><div className="mem-dot" />0 KB</div>
            </div>
            <div className="chat-body">
              <div className="msg msg-agent">What is your name?</div>
              <div className="msg msg-user">I already told the last agent...</div>
              <div className="msg msg-agent">Seat preference?</div>
              <div className="msg msg-user">...window seat. Again.</div>
            </div>
            <div className="frust-row">
              <span className="frust-label">Frustration</span>
              <div className="frust-track"><div className="frust-fill" style={{ width: "66%" }} /></div>
            </div>
          </div>

          <div className="chat-card">
            <div className="chat-chrome">
              <div className="chrome-dot" />
              <div className="chrome-dot" />
              <div className="chrome-dot" />
              <span className="chrome-name">Insurance Agent</span>
              <div className="mem-badge"><div className="mem-dot" />0 KB</div>
            </div>
            <div className="chat-body">
              <div className="msg msg-agent">What is your name?</div>
              <div className="msg msg-user">I've answered this 3 times now.</div>
              <div className="msg msg-agent">Seat preference?</div>
              <div className="msg msg-user">I give up.</div>
            </div>
            <div className="frust-row">
              <span className="frust-label">Frustration</span>
              <div className="frust-track"><div className="frust-fill" style={{ width: "99%" }} /></div>
            </div>
          </div>
        </div>

        <p className="caption gs">The same questions. The same blank slate. Every single time.</p>
      </div>
    </section>
  );
}

function Custody() {
  return (
    <section className="s3">
      <div className="sec-inner">
        <h2 className="headline gs">
          Your tokens live in
          <br />
          someone else's contract
        </h2>
        <p className="subline gs">
          Your balance is just a number in someone else's ledger. The contract
          owns the tokens — you own a row in their mapping. If they pause,
          you're frozen.
        </p>

        <div className="custody-split gs">
          {/* Left — What you think */}
          <div className="custody-card custody-card--safe">
            <span className="custody-card-label">What you think</span>
            <div className="custody-mental-model">
              <div className="cm-node cm-node--you">You</div>
              <div className="cm-arrow">
                <svg width="2" height="40" viewBox="0 0 2 40"><line x1="1" y1="0" x2="1" y2="40" stroke="var(--bob)" strokeWidth="1.5" strokeDasharray="4 3" /></svg>
                <span className="cm-arrow-label">own</span>
              </div>
              <div className="cm-node cm-node--token">80 MOI</div>
            </div>
            <p className="custody-card-caption">Direct ownership. You hold the tokens.</p>
          </div>

          {/* Divider */}
          <div className="custody-divider" />

          {/* Right — What actually happens */}
          <div className="custody-card custody-card--real">
            <span className="custody-card-label">What actually happens</span>
            <div className="custody-contract">
              <div className="custody-contract-header">
                <span className="custody-contract-dot" />
                <span className="custody-contract-name">SwapRouter.sol</span>
                <span className="custody-contract-owns">Owns all tokens</span>
              </div>
              <div className="custody-ledger">
                <div className="custody-ledger-row">
                  <span className="custody-addr">0xa3f...8c2</span>
                  <span className="custody-arrow">→</span>
                  <span className="custody-amt">240 MOI</span>
                </div>
                <div className="custody-ledger-row custody-ledger-row--you">
                  <span className="custody-addr">0xd41...f07</span>
                  <span className="custody-arrow">→</span>
                  <span className="custody-amt">80 MOI</span>
                  <span className="custody-you-tag">← you</span>
                </div>
                <div className="custody-ledger-row">
                  <span className="custody-addr">0x7b2...1d9</span>
                  <span className="custody-arrow">→</span>
                  <span className="custody-amt">512 MOI</span>
                </div>
                <div className="custody-ledger-row">
                  <span className="custody-addr">0xc19...3f6</span>
                  <span className="custody-arrow">→</span>
                  <span className="custody-amt">920 MOI</span>
                </div>
                <div className="custody-ledger-row">
                  <span className="custody-addr">0x5e4...b81</span>
                  <span className="custody-arrow">→</span>
                  <span className="custody-amt">1,800 MOI</span>
                </div>
              </div>
            </div>
            <p className="custody-card-caption custody-card-caption--red">
              You're row #2 in a mapping. The contract owner can pause, upgrade,
              or drain the pool — and you can't stop them.
            </p>
            <div className="custody-paused-stamp">
              <span>1 contract paused — funds frozen</span>
            </div>
          </div>
        </div>

        <div className="custody-stats gs">
          <div className="custody-stat"><div className="val">3 contracts</div><div className="lbl">hold your assets</div></div>
          <div className="custody-stat"><div className="val">0 contracts</div><div className="lbl">you control</div></div>
          <div className="custody-stat"><div className="val" style={{ color: "var(--eve)" }}>1 paused</div><div className="lbl">funds inaccessible</div></div>
        </div>
      </div>
    </section>
  );
}

function PivotSection() {
  return (
    <section className="s4-pivot">
      <div className="sec-inner" style={{ textAlign: "center" }}>
        <div className="pill gs">Act 2 — The Pivot</div>

        <h2 className="pivot-headline gs">
          <span className="pivot-l1">Three problems.</span>
          <span className="pivot-l2">One root cause.</span>
        </h2>

        <div className="pivot-sub gs">
          <p className="pivot-sub-l1">
            There is no persistent, portable identity layer for agents.
          </p>
          <p className="pivot-sub-l2">
            No <em>"you"</em> that travels with your agents.
          </p>
        </div>

        <div className="moi-reveal gs">
          <p className="moi-q">Who remembers?</p>
          <div className="moi-word">MOI</div>
          <p className="moi-tag">The one who remembers.</p>
        </div>
      </div>
    </section>
  );
}

function ScopedDelegation() {
  return (
    <section className="s6" id="scopedSection">
      <div className="sec-inner">
        <div className="pill gs">Act 3 — The Solution</div>
        <h2 className="headline gs">
          Delegation is scoped
          <br />
          and signed
        </h2>
        <p className="subline gs">
          Every sub-agent checks back with Alice's context superstate. Trust
          doesn't degrade — it's verified at the source.
        </p>

        <div className="hub-wrap gs" id="hubWrap">
          <div className="hub-ring" />
          <div className="hub-center"><span className="hub-center-label">Alice's<br />Superstate</span></div>

          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }} viewBox="0 0 480 400">
            <line x1="240" y1="200" x2="100" y2="75" stroke="var(--purple)" strokeWidth="1" strokeDasharray="4 4" opacity=".2" />
            <line x1="240" y1="200" x2="380" y2="75" stroke="var(--purple)" strokeWidth="1" strokeDasharray="4 4" opacity=".2" />
            <line x1="240" y1="200" x2="240" y2="355" stroke="var(--purple)" strokeWidth="1" strokeDasharray="4 4" opacity=".2" />
            <circle className="pulse-dot" r="4"><animateMotion dur="1.5s" repeatCount="indefinite" path="M100,75 L240,200" /></circle>
            <circle className="pulse-dot" r="4"><animateMotion dur="1.5s" repeatCount="indefinite" begin="0.5s" path="M380,75 L240,200" /></circle>
            <circle className="pulse-dot" r="4"><animateMotion dur="1.5s" repeatCount="indefinite" begin="1s" path="M240,355 L240,200" /></circle>
          </svg>

          <div className="spoke-agent" style={{ top: 25, left: 30 }}>
            <div className="spoke-circle">✈️</div>
            <span className="spoke-name">Flight Agent</span>
            <span className="spoke-scope">book_flight: true</span>
            <span className="spoke-check" id="ck1">✓ Verified</span>
          </div>
          <div className="spoke-agent" style={{ top: 25, right: 30 }}>
            <div className="spoke-circle">💳</div>
            <span className="spoke-name">Payment Agent</span>
            <span className="spoke-scope">charge: $500 max</span>
            <span className="spoke-check" id="ck2">✓ Verified</span>
          </div>
          <div className="spoke-agent" style={{ bottom: 0, left: "50%", transform: "translateX(-50%)" }}>
            <div className="spoke-circle">🏦</div>
            <span className="spoke-name">Bank Agent</span>
            <span className="spoke-scope">confirm_payment</span>
            <span className="spoke-check" id="ck3">✓ Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Preferences() {
  return (
    <section className="s7">
      <div className="sec-inner">
        <h2 className="headline gs">
          Your preferences
          <br />
          follow you
        </h2>
        <p className="subline gs">Your context superstate travels with you. Every agent already knows you.</p>

        <div className="pref-layout gs">
          <div className="pref-avatar">
            <div className="pref-circle">Your<br />Superstate</div>
            <div className="pref-tags">
              <span className="pref-tag">Window seat</span>
              <span className="pref-tag">Vegetarian</span>
              <span className="pref-tag">English</span>
              <span className="pref-tag">UTC+5:30</span>
            </div>
          </div>

          <div className="pref-arrow">→</div>

          <div className="pref-agents">
            <div className="pref-agent-card">
              <h4>✈️ Travel Agent</h4>
              <div className="pref-field"><span className="check">✓</span> Window seat preference</div>
              <div className="pref-field"><span className="check">✓</span> Vegetarian meal</div>
            </div>
            <div className="pref-agent-card">
              <h4>💳 Payment Agent</h4>
              <div className="pref-field"><span className="check">✓</span> Preferred payment method</div>
              <div className="pref-field"><span className="check">✓</span> Spending limits</div>
              <div className="pref-field"><span className="check">✓</span> Currency preference</div>
            </div>
            <div className="pref-agent-card">
              <h4>🛡️ Insurance Agent</h4>
              <div className="pref-field"><span className="check">✓</span> Travel history</div>
              <div className="pref-field"><span className="check">✓</span> Coverage preferences</div>
              <div className="pref-field"><span className="check">✓</span> Medical dietary needs</div>
              <div className="pref-field"><span className="check">✓</span> Emergency contacts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Assets() {
  return (
    <section className="s8">
      <div className="sec-inner">
        <h2 className="headline gs">
          Your assets live
          <br />
          with you
        </h2>
        <p className="subline gs">
          Tokens, credentials, and digital assets are owned by your MOI identity
          — not locked in someone else's contract.
        </p>

        <div className="assets-split gs">
          <div className="assets-side assets-today">
            <div className="assets-side-header">Today</div>
            <div className="assets-scattered">
              <div className="assets-contract">
                <span className="assets-contract-name">SwapRouter.sol</span>
                <span className="assets-contract-val">80 MOI</span>
              </div>
              <div className="assets-contract">
                <span className="assets-contract-name">VaultV2.sol</span>
                <span className="assets-contract-val">0.5 ETH</span>
              </div>
              <div className="assets-contract">
                <span className="assets-contract-name">StakePool.sol</span>
                <span className="assets-contract-val">3,200 MOI</span>
              </div>
            </div>
            <p className="assets-side-caption">Scattered across 3 contracts you don't control.</p>
          </div>

          <div className="assets-divider" />

          <div className="assets-side assets-moi">
            <div className="assets-side-header">With MOI</div>
            <div className="assets-unified">
              <div className="assets-context-label">Your context superstate</div>
              <div className="assets-grid">
                <div className="assets-item">3,200 MOI</div>
                <div className="assets-item">0.5 ETH</div>
                <div className="assets-item">1,200 USDC</div>
                <div className="assets-item">NFT #0471</div>
              </div>
            </div>
            <p className="assets-side-caption">All in one place. Apps never hold them.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Permissions() {
  return (
    <section className="s9">
      <div className="sec-inner">
        <h2 className="headline gs">
          You control who
          <br />
          sees what
        </h2>
        <p className="subline gs">
          Your flight agent sees travel preferences — not health data. Your
          doctor sees health — not finances. Privacy by design.
        </p>

        <div className="perm-table-wrap gs">
          <table className="perm-table">
            <thead>
              <tr>
                <th />
                <th>✈️ Travel</th>
                <th>🏥 Doctor</th>
                <th>🏦 Finance</th>
                <th>🤖 AI Assist</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="perm-row-label">Passport</td>
                <td className="perm-yes">✓</td>
                <td className="perm-no">✗</td>
                <td className="perm-no">✗</td>
                <td className="perm-no">✗</td>
              </tr>
              <tr>
                <td className="perm-row-label">Payment</td>
                <td className="perm-yes">✓</td>
                <td className="perm-no">✗</td>
                <td className="perm-yes">✓</td>
                <td className="perm-no">✗</td>
              </tr>
              <tr>
                <td className="perm-row-label">Health records</td>
                <td className="perm-no">✗</td>
                <td className="perm-yes">✓</td>
                <td className="perm-no">✗</td>
                <td className="perm-no">✗</td>
              </tr>
              <tr>
                <td className="perm-row-label">Location</td>
                <td className="perm-yes">✓</td>
                <td className="perm-yes">✓</td>
                <td className="perm-no">✗</td>
                <td className="perm-yes">✓</td>
              </tr>
              <tr>
                <td className="perm-row-label">Preferences</td>
                <td className="perm-yes">✓</td>
                <td className="perm-yes">✓</td>
                <td className="perm-yes">✓</td>
                <td className="perm-yes">✓</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="caption gs">Your privacy policy applied to them. Not theirs applied to you.</p>
      </div>
    </section>
  );
}

function ContextSuperstate() {
  return (
    <section className="s-superstate">
      <div className="sec-inner" style={{ textAlign: "center" }}>
        <div className="pill gs">The Context Superstate</div>
        <h2 className="headline gs" style={{ textAlign: "center" }}>
          Seven sub-contexts.
          <br />
          One participant.
        </h2>
        <p className="subline gs" style={{ margin: "0 auto" }}>
          The cryptographic data structure that represents your entire
          existence in computation. Always current. Always available. Always
          sovereign.
        </p>

        <div className="superstate-card gs">
          <div className="ss-identity">
            <div className="ss-identity-icon">ψ</div>
            <div className="ss-identity-label">alice.moi</div>
          </div>
          <div className="ss-grid">
            <div className="ss-ctx">
              <div className="ss-ctx-name">Assets</div>
              <div className="ss-ctx-desc">Native tokens, balances, metadata</div>
            </div>
            <div className="ss-ctx">
              <div className="ss-ctx-name">Trust</div>
              <div className="ss-ctx-desc">Witness sets, delegation chains</div>
            </div>
            <div className="ss-ctx">
              <div className="ss-ctx-name">Storage</div>
              <div className="ss-ctx-desc">Participant-owned data, records</div>
            </div>
            <div className="ss-ctx">
              <div className="ss-ctx-name">Logic</div>
              <div className="ss-ctx-desc">Deployed code, interaction handlers</div>
            </div>
            <div className="ss-ctx">
              <div className="ss-ctx-name">Keys</div>
              <div className="ss-ctx-desc">Cryptographic keys, rotation</div>
            </div>
            <div className="ss-ctx">
              <div className="ss-ctx-name">Preferences</div>
              <div className="ss-ctx-desc">Privacy policies, constraints</div>
            </div>
            <div className="ss-ctx ss-ctx-wide">
              <div className="ss-ctx-name">Intelligence</div>
              <div className="ss-ctx-desc">
                Participant embeddings, interaction patterns
              </div>
            </div>
          </div>
          <div className="ss-footer">
            <span>Merkle-committed</span>
            <span>·</span>
            <span>One hash</span>
            <span>·</span>
            <span>One participant</span>
          </div>
        </div>

        <div className="ss-formula gs">
          <span className="ss-formula-text">ψ(P, C, I) → (P, C', V)</span>
        </div>
        <p
          className="gs"
          style={{
            fontFamily: "var(--mono)",
            fontSize: "13px",
            color: "rgba(26,26,26,0.35)",
            marginTop: "1rem",
          }}
        >
          The participant persists. The context transforms. Value is produced.
        </p>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className="s10 s-arch" id="archSection">
      <div className="sec-inner">
        <div className="pill gs">Act 4 — The Architecture</div>
        <h2 className="headline gs">
          Independent. Parallel.
          <br />
          Participant-centric.
        </h2>
        <p className="subline gs">
          Instead of one shared blockchain where everyone queues for the same
          block, each participant has their own execution environment, running
          in parallel.
        </p>

        <div className="arch-split gs">
          <div className="arch-side arch-today">
            <div className="arch-side-header">Today — shared chain</div>

            <div className="arch-funnel">
              <div className="funnel-participants">
                <div className="funnel-dot" style={{ background: "#7B5EA7" }} />
                <div className="funnel-dot" style={{ background: "#3A8F6E" }} />
                <div className="funnel-dot" style={{ background: "#C47A2D" }} />
                <div className="funnel-dot" style={{ background: "#2D7EC4" }} />
                <div className="funnel-dot" style={{ background: "#C44D5A" }} />
              </div>
              <div className="funnel-neck">
                <div className="funnel-arrow">→</div>
              </div>
              <div className="funnel-block">
                <span>Block #N</span>
              </div>
            </div>

            <div className="arch-side-details">
              <div className="arch-detail-row">
                <span className="arch-detail-label">Processing</span>
                <span className="arch-detail-val arch-detail-bad">Sequential</span>
              </div>
              <div className="arch-detail-row">
                <span className="arch-detail-label">Finality</span>
                <span className="arch-detail-val arch-detail-bad">
                  Waits for global consensus
                </span>
              </div>
              <div className="arch-detail-row">
                <span className="arch-detail-label">Bottleneck</span>
                <span className="arch-detail-val arch-detail-bad">
                  Everyone shares one queue
                </span>
              </div>
            </div>

            <p className="arch-side-caption">One block at a time. Everyone waits.</p>
          </div>

          <div className="arch-divider" />

          <div className="arch-side arch-moi">
            <div className="arch-side-header">With MOI — parallel lanes</div>

            <div className="arch-lanes">
              <div className="arch-lane">
                <div className="lane-dot" style={{ background: "#7B5EA7" }} />
                <div className="lane-bar">
                  <div className="lane-bar-fill" style={{ width: "75%", background: "#7B5EA7" }} />
                </div>
                <span className="lane-label">Alice</span>
              </div>
              <div className="arch-lane">
                <div className="lane-dot" style={{ background: "#3A8F6E" }} />
                <div className="lane-bar">
                  <div className="lane-bar-fill" style={{ width: "60%", background: "#3A8F6E" }} />
                </div>
                <span className="lane-label">Bob</span>
              </div>
              <div className="arch-lane">
                <div className="lane-dot" style={{ background: "#C47A2D" }} />
                <div className="lane-bar">
                  <div className="lane-bar-fill" style={{ width: "85%", background: "#C47A2D" }} />
                </div>
                <span className="lane-label">Charlie</span>
              </div>
              <div className="arch-lane">
                <div className="lane-dot" style={{ background: "#2D7EC4" }} />
                <div className="lane-bar">
                  <div className="lane-bar-fill" style={{ width: "45%", background: "#2D7EC4" }} />
                </div>
                <span className="lane-label">Diana</span>
              </div>
              <div className="arch-lane">
                <div className="lane-dot" style={{ background: "#C44D5A" }} />
                <div className="lane-bar">
                  <div className="lane-bar-fill" style={{ width: "70%", background: "#C44D5A" }} />
                </div>
                <span className="lane-label">Eve</span>
              </div>
            </div>

            <div className="arch-side-details">
              <div className="arch-detail-row">
                <span className="arch-detail-label">Processing</span>
                <span className="arch-detail-val arch-detail-good">Parallel</span>
              </div>
              <div className="arch-detail-row">
                <span className="arch-detail-label">Finality</span>
                <span className="arch-detail-val arch-detail-good">
                  Immediate per interaction
                </span>
              </div>
              <div className="arch-detail-row">
                <span className="arch-detail-label">Bottleneck</span>
                <span className="arch-detail-val arch-detail-good">
                  None — independent execution
                </span>
              </div>
            </div>

            <p className="arch-side-caption">
              Every participant runs independently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="s11">
      <div className="sec-inner">
        <div className="pill gs">Act 5</div>
        <h2 className="cta-hl gs">Ready to explore?</h2>
        <p className="cta-sub gs">
          Discover how MOI gives every participant a persistent, portable identity layer.
        </p>
        <div className="cta-btns gs">
          <a href={LITEPAPER_URL} className="btn-primary">Read the Litepaper →</a>
          <a href="https://docs.moi.technology" target="_blank" rel="noopener noreferrer" className="btn-secondary">Start Building →</a>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────
   Main page — GSAP ScrollTrigger orchestration
   ──────────────────────────────────────────────── */

export default function HowItWorksPageV5() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const page = pageRef.current;
      if (!page) return;

      const allGs = page.querySelectorAll(".gs");
      gsap.set(allGs, { opacity: 0, y: 40, willChange: "opacity, transform" });

      const sections = page.querySelectorAll("section");

      sections.forEach((section, i) => {
        const gsEls = section.querySelectorAll(".gs");
        if (gsEls.length === 0) return;

        if (i === 0) {
          gsap.to(gsEls, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            delay: 0.3,
            ease: "power2.out",
            clearProps: "willChange",
          });
          return;
        }

        /* ── S6: Scoped Delegation — checkmark reveals ── */
        if (section.id === "scopedSection") {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none none",
            },
          });

          tl.to(gsEls, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
            clearProps: "willChange",
          });

          tl.call(() => document.getElementById("ck1")?.classList.add("show"), null, "+=0.9");
          tl.call(() => document.getElementById("ck2")?.classList.add("show"), null, "+=0.45");
          tl.call(() => document.getElementById("ck3")?.classList.add("show"), null, "+=0.45");
          return;
        }

        /* ── All other sections — standard staggered entrance ── */
        gsap.to(gsEls, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          clearProps: "willChange",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar activePage="how-it-works" />
      <div ref={pageRef} className="how-it-works-page">
        <TrustChain />
        <ColdStart />
        <Custody />
        <PivotSection />
        <ScopedDelegation />
        <Preferences />
        <Assets />
        <Permissions />
        <ContextSuperstate />
        <ArchitectureSection />
        <CallToAction />
      </div>
    </>
  );
}
