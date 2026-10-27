import { brand } from "@/lib/content";

/** A small legend that explains the red brick-wall background: it is the Hotel Raviraj wall itself. */
export default function ThemeNote({ className = "" }: { className?: string }) {
  return (
    <div className={`flex max-w-[48ch] items-start gap-4 ${className}`}>
      <span
        aria-hidden
        className="laterite mt-0.5 block h-10 w-14 shrink-0 border border-champagne/50 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]"
      />
      <p className="text-[0.82rem] leading-[1.65] text-ivory/75">
        <span className="eyebrow mb-1 block text-[0.58rem] text-champagne">{brand.themeNote.title}</span>
        {brand.themeNote.text}
      </p>
    </div>
  );
}
