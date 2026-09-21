import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

type EmptyLibraryProps = {
  onAdd: () => void;
  hasFilters?: boolean;
};

export function EmptyLibrary({ onAdd, hasFilters = false }: EmptyLibraryProps) {
  return (
    <div className="glass-panel-soft rounded-[20px] border-dashed border-[var(--border-strong)] px-6 py-16 text-center">
      <p className="text-sm font-medium tracking-[0.12em] text-[var(--color-stone)] uppercase">
        Empty shelf
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
        {hasFilters ? "Nothing matches this view" : "Your archive is waiting"}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[var(--color-slate)]">
        {hasFilters
          ? "Try another filter or clear search to see the rest of your collection."
          : "Save something worth returning to — paste a URL and build your visual library."}
      </p>
      {!hasFilters ? (
        <Button className="mt-6" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add your first URL
        </Button>
      ) : null}
    </div>
  );
}
