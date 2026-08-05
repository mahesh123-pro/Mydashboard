export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-background" />

      {/* one restrained emerald atmosphere, top-anchored */}
      <div
        className="absolute -top-[28rem] left-1/2 h-[52rem] w-[80rem] -translate-x-1/2 rounded-full opacity-[0.16] blur-[140px] animate-[blob_34s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(closest-side, #10b981, transparent 72%)" }}
      />
      <div
        className="absolute -left-[18rem] top-[24rem] h-[38rem] w-[38rem] rounded-full opacity-[0.10] blur-[130px] animate-[blob_40s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(closest-side, #059669, transparent 70%)", animationDelay: "-10s" }}
      />

      {/* faint architectural grid, top only */}
      <div className="grid-overlay absolute inset-x-0 top-0 h-[46vh] opacity-[0.5]" />

      {/* soft top-center light + bottom fade for depth */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 90% 50% at 50% -8%, rgba(16,185,129,0.06), transparent 60%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
