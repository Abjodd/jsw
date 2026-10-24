import { useState } from 'react';

/**
 * Inline styles can't use :hover — use this instead.
 *   const [hovered, hoverProps] = useHover();
 *   <div {...hoverProps} style={{ background: hovered ? colors.steel50 : 'transparent' }} />
 */
export default function useHover() {
  const [hovered, setHovered] = useState(false);
  return [hovered, { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) }];
}
