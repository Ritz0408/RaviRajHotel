import PatternRule from "./PatternRule";

/** Numbered eyebrow followed by the hand-painted pattern rule. */
export default function SectionLabel({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <span className="eyebrow shrink-0 tabular-nums">{index}</span>
      <span className="h-px w-8 shrink-0 bg-current opacity-40" />
      <span className="eyebrow shrink-0">{label}</span>
      <PatternRule className="opacity-30" />
    </div>
  );
}
