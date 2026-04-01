/**
 * Alice nucleus — breathing purple orb with 6-color segmented ring.
 * Pure CSS animation, no canvas needed.
 */
const RING_COLORS = [
  "#8B6CC1", // authority
  "#3A9F7E", // preferences
  "#D4853A", // assets
  "#C44D5A", // permissions
  "#2D7EC4", // trust
  "#7A8B5A", // history
];

export default function AliceNucleus({ size = 56 }) {
  const r = size / 2;
  const ringR = r - 4;
  const strokeW = 3;
  const circumference = 2 * Math.PI * ringR;
  const segLen = circumference / RING_COLORS.length;

  return (
    <div className="alice-nucleus flex items-center justify-center mb-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Glow */}
        <defs>
          <radialGradient id="nucleus-glow">
            <stop offset="0%" stopColor="#8B6CC1" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#8B6CC1" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8B6CC1" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={r} cy={r} r={r} fill="url(#nucleus-glow)" />

        {/* Core */}
        <circle cx={r} cy={r} r={r * 0.52} fill="#8B6CC1" opacity="0.85" />
        <circle cx={r} cy={r} r={r * 0.3} fill="#A88CD4" opacity="0.5" />

        {/* Segmented ring */}
        {RING_COLORS.map((color, i) => (
          <circle
            key={i}
            cx={r}
            cy={r}
            r={ringR}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeDasharray={`${segLen - 2} ${circumference - segLen + 2}`}
            strokeDashoffset={-i * segLen}
            strokeLinecap="round"
            opacity="0.7"
            transform={`rotate(-90 ${r} ${r})`}
          />
        ))}

        {/* Label */}
        <text
          x={r}
          y={r + size * 0.46}
          textAnchor="middle"
          fill="#1A1A1A"
          opacity="0.4"
          style={{ fontSize: "7px", fontFamily: '"DM Mono", monospace' }}
        >
          alice
        </text>
      </svg>
    </div>
  );
}
