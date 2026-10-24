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
  overflow-x: auto !important;
  overflow-y: visible !important;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #CBD3DB transparent;
}

/* Dedicated prominent scrollbar for wide comparison tables */
.table-scroll-container {
  overflow-x: auto !important;
  overflow-y: visible !important;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: auto;
  scrollbar-color: #477DA5 #EEF4F9;
  position: relative;
}
.table-scroll-container::-webkit-scrollbar {
  height: 12px !important;
}
.table-scroll-container::-webkit-scrollbar-track {
  background: #EEF4F9 !important;
  border-radius: 6px;
}
.table-scroll-container::-webkit-scrollbar-thumb {
  background: #477DA5 !important;
  border-radius: 6px;
  border: 2px solid #EEF4F9;
}
.table-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #12304A !important;
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

/* Reduced motion */
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }

/* Table hover rows — smooth transition */
table tbody tr { transition: background-color 180ms ease; }
`;

export default function GlobalStyles() {
  return <style>{css}</style>;
}
