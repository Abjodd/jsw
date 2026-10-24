import { useEffect, useState } from 'react';

/**
 * Inline styles can't use @media — use this instead.
 *   import { bp } from '@/theme/theme';
 *   const isMobile = useMediaQuery(bp.mobile);
 */
export default function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}
