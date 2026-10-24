import { useEffect, useState } from 'react';

/** Milliseconds remaining until `target`, re-rendering every second while `active`. */
export default function useCountdown(target, active = true) {
  const calc = () => Math.max(0, new Date(target).getTime() - Date.now());
  const [ms, setMs] = useState(calc);
  useEffect(() => {
    setMs(calc());
    if (!active) return undefined;
    const id = setInterval(() => setMs(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, active]);
  return ms;
}
