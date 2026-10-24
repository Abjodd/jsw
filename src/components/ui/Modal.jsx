import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { colors, radius, shadow, text } from '@/theme/theme';
import IconButton from './IconButton';

/**
 * <Modal open onClose title subtitle icon={<Icon/>} footer={<>buttons</>} width={560}>body</Modal>
 */
export default function Modal({ open, onClose, title, subtitle, icon, children, footer, width = 560, bodyStyle }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      style={{
        position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', padding: 16,
        background: colors.overlay, backdropFilter: 'blur(3px)', animation: 'jsw-fade 160ms ease both',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: `min(${width}px, 100%)`, maxHeight: 'calc(100vh - 32px)', display: 'flex', flexDirection: 'column',
          background: colors.bgCard, borderRadius: radius.xl, boxShadow: shadow.lg, overflow: 'hidden',
          animation: 'jsw-pop 220ms cubic-bezier(0.2,0.7,0.2,1) both',
        }}
      >
        {(title || icon) && (
          <header style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '20px 20px 16px 24px', borderBottom: `1px solid ${colors.border}` }}>
            {icon && (
              <span style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', background: colors.steel50, color: colors.steel }}>
                {icon}
              </span>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={text.section}>{title}</h3>
              {subtitle && <p style={{ ...text.subtitle, marginTop: 2 }}>{subtitle}</p>}
            </div>
            <IconButton label="Close" onClick={onClose}><X size={18} /></IconButton>
          </header>
        )}
        <div style={{ padding: 24, overflowY: 'auto', ...bodyStyle }}>{children}</div>
        {footer && (
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 24px', borderTop: `1px solid ${colors.border}`, background: colors.bgSubtle }}>
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}
