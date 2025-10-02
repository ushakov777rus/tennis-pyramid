import { useCallback, useRef } from "react";

/**
 * Returns a predicate that is true only for the first invocation during a render pass.
 * Handy for showing helper UI (e.g. tooltip) on a single element per view.
 */
export function useFirstHelpTooltip() {
  const shownRef = useRef(false);
  shownRef.current = false;

  return useCallback(() => {
    if (shownRef.current) return false;
    shownRef.current = true;
    return true;
  }, []);
}
