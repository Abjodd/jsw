import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { colors, shadow } from '@/theme/theme';
import IconButton from './IconButton';

/**
 * Right-side panel for record details.
 * <Drawer open onClose header={<.../>} footer={<.../>} width={600}>body</Drawer>
 */
export default function Drawer({ open, onClose, header, footer, children, width = 600 }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      style={{ position: 'fixed', inset: 0, zIndex: 90, background: colors.overlay, animation: 'jsw-fade 160ms ease both' }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: `min(${width}px, 100vw)`,
          display: 'flex', flexDirection: 'column', background: colors.bgPage, boxShadow: shadow.lg,
          animation: 'jsw-slide-left 260ms cubic-bezier(0.2,0.7,0.2,1) both',
        }}
      >
        <header style={{ position: 'relative', background: colors.bgCard, borderBottom: `1px solid ${colors.border}`, padding: '20px 56px 20px 24px' }}>
          {header}
          <span style={{ position: 'absolute', top: 14, right: 14 }}>
            <IconButton label="Close" onClick={onClose}><X size={18} /></IconButton>
          </span>
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>{children}</div>
        {footer && (
          <footer style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '14px 24px', background: colors.bgCard, borderTop: `1px solid ${colors.border}` }}>
            {footer}
          </footer>
        )}
      </aside>
    </div>,
    document.body
  );
}
