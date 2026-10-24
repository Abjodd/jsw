import { colors, fontFamily } from './theme';

/**
 * The ONLY non-inline styles in the project: things that cannot be expressed
 * with style={{}} (body reset, keyframes, placeholders, scrollbars, focus ring).
 * Rendered once in App.jsx. Don't add component styles here.
 */
const css = `
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { height: 100%; }
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
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb { background: #CBD3DB; border-radius: 10px; border: 2px solid ${colors.bgPage}; }
@keyframes jsw-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes jsw-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
`;

export default function GlobalStyles() {
  return <style>{css}</style>;
}
