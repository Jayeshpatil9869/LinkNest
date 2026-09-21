export function LoadingGrid() {
  return (
    <div
      className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-11 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12"
      aria-busy="true"
      aria-label="Loading library"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[3/2] animate-pulse rounded-[6px] bg-[#e8e8e8]" />
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded-full bg-[#e0e0e0]" />
            <div className="h-3 w-28 animate-pulse rounded bg-[#e0e0e0]" />
          </div>
        </div>
      ))}
    </div>
  );
}
