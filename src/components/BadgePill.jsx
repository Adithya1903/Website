export default function BadgePill({ children }) {
  return (
    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#7B5EA7]/15 bg-[#7B5EA7]/8 font-mono text-[10px] tracking-[0.2em] uppercase text-[#7B5EA7] font-medium">
      {children}
    </span>
  );
}
