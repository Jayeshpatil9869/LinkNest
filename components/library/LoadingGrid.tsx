export function LoadingGrid() {
  return (
    <div
      className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-11 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12"
      aria-busy="true"
      aria-label="Loading library"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="aspect-[3/2] w-full rounded-[14px] border border-[var(--border)] bg-[rgba(255,251,246,0.65)] backdrop-blur-md overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(247,215,151,0.22)] to-transparent animate-[pulse_1.8s_ease-in-out_infinite]" />
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <div className="h-5 w-5 shrink-0 rounded-full bg-[rgba(63,52,44,0.08)] animate-pulse" />
            <div className="h-3.5 w-32 rounded-full bg-[rgba(63,52,44,0.08)] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
