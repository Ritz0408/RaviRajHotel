import { useId } from "react";

/**
 * The white zig-zag and dot border hand-painted along the laterite walls at
 * Hotel Raviraj, redrawn as a fine rule. Inherits colour from `currentColor`.
 */
export default function PatternRule({ className = "" }: { className?: string }) {
  const id = `motif${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg className={`block h-3 w-full ${className}`} aria-hidden preserveAspectRatio="none">
      <defs>
        <pattern id={id} width="18" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 9 L4.5 3 L9 9 L13.5 3 L18 9" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="4.5" cy="10.5" r="0.8" fill="currentColor" />
          <circle cx="13.5" cy="10.5" r="0.8" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="12" fill={`url(#${id})`} />
    </svg>
  );
}
