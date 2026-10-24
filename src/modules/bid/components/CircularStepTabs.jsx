import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, radius, text, transition } from '@/theme/theme';

/**
 * Modern circular stepper / tab component used across BID screens.
 * tabs: [{ id: string, label: string, icon: LucideIcon }]
 * activeTab: string
 * onTabChange: (id: string) => void
 */
export default function CircularStepTabs({ tabs, activeTab, onTabChange }) {
  const isMobile = useMediaQuery(bp.mobile);

  return (
    <div
      className="jsw-scroll-x"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 8 : 32,
        padding: isMobile ? '12px 14px' : '16px 24px',
        borderBottom: `1px solid ${colors.border}`,
        background: colors.bgCard,
        borderRadius: `${radius.lg}px ${radius.lg}px 0 0`,
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: isMobile ? '6px 8px 14px' : '6px 16px 14px',
              minWidth: isMobile ? 64 : 90,
              transition,
              animation: `jsw-rise 400ms ease both`,
              animationDelay: `${index * 60}ms`,
            }}
          >
            {/* Step number badge ring */}
            <div
              style={{
                position: 'relative',
                width: isMobile ? 38 : 46,
                height: isMobile ? 38 : 46,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive
                  ? `linear-gradient(135deg, ${colors.steel} 0%, ${colors.navy} 100%)`
                  : colors.steel50,
                color: isActive ? colors.white : colors.navy,
                boxShadow: isActive
                  ? '0 4px 14px rgba(71, 125, 165, 0.32)'
                  : '0 1px 3px rgba(18, 48, 74, 0.06)',
                transition: 'all 250ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {Icon && <Icon size={isMobile ? 17 : 20} />}

              {/* Step number badge */}
              <span
                style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: isActive ? '#23845B' : colors.border,
                  color: isActive ? colors.white : colors.textSecondary,
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                  border: `2px solid ${colors.bgCard}`,
                }}
              >
                {index + 1}
              </span>
            </div>

            {/* Label */}
            <span
              style={{
                ...text.caption,
                fontSize: isMobile ? 10 : 12,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? colors.navy : colors.textSecondary,
                whiteSpace: 'nowrap',
                transition,
              }}
            >
              {tab.label}
            </span>

            {/* Bottom active indicator */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 8,
                  right: 8,
                  height: 3,
                  background: `linear-gradient(90deg, ${colors.steel}, ${colors.navy})`,
                  borderRadius: '3px 3px 0 0',
                  animation: 'jsw-fade-in 200ms ease',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
