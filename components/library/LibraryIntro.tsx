import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

export function LibraryIntro() {
  return (
    <Reveal className="pt-10 sm:pt-14">
      <Parallax speed={0.08}>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-stone)]">
          Your collection
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          LinkNest
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-slate)] sm:text-lg">
          Things worth keeping — a calm visual archive for the URLs you return to.
        </p>
      </Parallax>
    </Reveal>
  );
}
