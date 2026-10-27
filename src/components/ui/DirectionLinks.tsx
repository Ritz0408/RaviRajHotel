type Props = {
  maps: string;
  appleMaps?: string | null;
  label: string;
  className: string;
  cursor?: string;
};

/** Google Maps button, with a quiet Apple Maps link beside it when the branch has one (handy on iPhones). */
export default function DirectionLinks({ maps, appleMaps, label, className, cursor }: Props) {
  return (
    <span className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <a href={maps} target="_blank" rel="noreferrer" className={className} data-cursor={cursor}>
        {label} <span aria-hidden>↗</span>
      </a>
      {appleMaps && (
        <a href={appleMaps} target="_blank" rel="noreferrer" className="link-line eyebrow text-[0.62rem] text-ivory/70">
          Apple Maps
        </a>
      )}
    </span>
  );
}
