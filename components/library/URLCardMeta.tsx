import type { UrlRecord } from "@/types/url";

type URLCardMetaProps = {
  record: UrlRecord;
};

/** Awwwards nominees meta row: avatar + name + optional PRO */
export function URLCardMeta({ record }: URLCardMetaProps) {
  const label = record.domain.replace(/^www\./, "");

  return (
    <div className="mt-2.5 flex min-w-0 items-center gap-2">
      {record.faviconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={record.faviconUrl}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-[8px] font-semibold text-[var(--color-cloud)]"
          aria-hidden
        >
          {label.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className="truncate text-[13px] leading-none font-medium tracking-[-0.01em] text-[var(--color-ink)]">
        {label}
      </span>
      <span className="shrink-0 text-[9px] font-semibold tracking-[0.08em] text-[#b0b0b0] uppercase">
        PRO
      </span>
    </div>
  );
}
