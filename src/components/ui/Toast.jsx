import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { colors, radius, shadow, status, text } from '@/theme/theme';

const ToastContext = createContext({ toast: () => {} });

const TONES = {
  success: { icon: CheckCircle2, color: status.success.color },
  error: { icon: XCircle, color: status.error.color },
  warning: { icon: AlertTriangle, color: status.warning.color },
  info: { icon: Info, color: status.progress.color },
};

/**
 * Wrap the app once (App.jsx). Then anywhere:
 *   const { toast } = useToast();
 *   toast({ title: 'Buyer assigned', description: '3 lines updated', tone: 'success' });
 */
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const dismiss = useCallback((id) => setItems((xs) => xs.filter((x) => x.id !== id)), []);
  const toast = useCallback(
    ({ title, description, tone = 'success', duration = 3800 }) => {
      const id = Math.random().toString(36).slice(2);
      setItems((xs) => [...xs, { id, title, description, tone }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );
  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div style={{ position: 'fixed', right: 20, top: 76, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 10, width: 'min(380px, calc(100vw - 40px))' }}>
          {items.map((t) => {
            const T = TONES[t.tone] ?? TONES.info;
            const Icon = T.icon;
            return (
              <div
                key={t.id}
                role="status"
                style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 14px 14px 16px',
                  background: colors.bgCard, borderRadius: radius.md, boxShadow: shadow.lg,
                  border: `1px solid ${colors.border}`, borderLeft: `4px solid ${T.color}`,
                  animation: 'jsw-pop 220ms cubic-bezier(0.2,0.7,0.2,1) both',
                }}
              >
                <Icon size={20} color={T.color} style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...text.body, fontWeight: 600, color: colors.textPrimary }}>{t.title}</div>
                  {t.description && <div style={text.caption}>{t.description}</div>}
                </div>
                <button aria-label="Dismiss" onClick={() => dismiss(t.id)} style={{ border: 0, background: 'transparent', cursor: 'pointer', color: colors.textDisabled, padding: 0, display: 'flex' }}>
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
