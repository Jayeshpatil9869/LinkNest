import type { UrlRecord } from "@/types/url";

type URLCardFallbackProps = {
  record: Pick<UrlRecord, "domain" | "title" | "faviconUrl">;
};

export function URLCardFallback({ record }: URLCardFallbackProps) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#fffbf6_0%,#f7d797_48%,#f7c097_100%)] p-5">
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.85), transparent 42%), linear-gradient(115deg, transparent 46%, rgba(28,22,18,0.06) 47%, transparent 48%)",
        }}
        aria-hidden
      />
      <div className="relative flex items-center gap-2">
        {record.faviconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={record.faviconUrl}
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px] rounded-full"
          />
        ) : null}
        <span className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-slate)] uppercase">
          {record.domain}
        </span>
      </div>
      <p className="relative line-clamp-3 text-[17px] leading-snug font-medium text-[var(--color-ink)]">
        {record.title}
      </p>
    </div>
  );
}
