import { colors, fontFamily } from './theme';

/**
 * The ONLY non-inline styles in the project: things that cannot be expressed
 * with style={{}} (body reset, keyframes, placeholders, scrollbars, focus ring).
 * Rendered once in App.jsx. Don't add component styles here.
 */
const css = `
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { height: 100%; }
html { scroll-behavior: smooth; }
body {
  margin: 0; font-family: ${fontFamily}; font-size: 14px; line-height: 22px;
  color: ${colors.textPrimary}; background: ${colors.bgPage};
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
button, input, select, textarea { font-family: inherit; }
a { color: ${colors.steel}; text-decoration: none; }
input::placeholder { color: ${colors.textDisabled}; }
:focus-visible { outline: 2px solid ${colors.steel}; outline-offset: 2px; }
::selection { background: ${colors.steel100}; }

/* Scrollbar styling */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #CBD3DB; border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
::-webkit-scrollbar-thumb:hover { background: #A0ABB5; border: 2px solid transparent; background-clip: padding-box; }

/* Smooth horizontal scroll containers */
.jsw-scroll-x {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #CBD3DB transparent;
}

/* Rise entrance animation */
@keyframes jsw-rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

/* Fade-in animation */
@keyframes jsw-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide-in from right */
@keyframes jsw-slide-in {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: none; }
}

/* Spinner */
@keyframes jsw-spin { to { transform: rotate(360deg); } }

/* Modals, drawers, toasts, live indicators */
@keyframes jsw-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes jsw-pop { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes jsw-slide-left { from { transform: translateX(32px); opacity: 0.4; } to { transform: none; opacity: 1; } }
@keyframes jsw-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
input[type='number']::-webkit-inner-spin-button { opacity: 0.4; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }

/* Table hover rows — smooth transition */
table tbody tr { transition: background-color 180ms ease; }
`;

export default function GlobalStyles() {
  return <style>{css}</style>;
}
