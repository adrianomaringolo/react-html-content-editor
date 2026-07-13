import { useEffect, useState } from "react";

/**
 * Minimal hash-based router. Reads the current route from `location.hash`
 * (e.g. `#/wysiwyg`), falling back to `fallback` for unknown/empty values, and
 * re-renders on `hashchange`. Hash routing works on any static host
 * (GitHub Pages included) with no server rewrites or 404 fallback.
 */
export function useHashRoute<T extends string>(
  valid: readonly T[],
  fallback: T,
): T {
  const parse = (): T => {
    const raw = window.location.hash.replace(/^#\/?/, "");
    return (valid as readonly string[]).includes(raw) ? (raw as T) : fallback;
  };

  const [route, setRoute] = useState<T>(parse);

  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener("hashchange", onChange);
    // Normalize the address bar so the current page always has a valid hash
    // (empty or unknown hashes resolve to the fallback), without adding a
    // history entry or reloading.
    const desired = `#/${parse()}`;
    if (window.location.hash !== desired) {
      history.replaceState(null, "", desired);
    }
    return () => window.removeEventListener("hashchange", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return route;
}
