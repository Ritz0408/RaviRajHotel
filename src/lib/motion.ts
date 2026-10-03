export const EASE_LUXE = [0.22, 1, 0.36, 1] as const;
export const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const;

/** Renders `*word*` segments as italic serif emphasis. */
export function splitEmphasis(text: string) {
  return text.split(/(\*[^*]+\*)/g).filter(Boolean).map((part) => ({
    text: part.startsWith("*") ? part.slice(1, -1) : part,
    em: part.startsWith("*"),
  }));
}
