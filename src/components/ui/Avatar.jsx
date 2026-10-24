import { avatarPalette, colors } from '@/theme/theme';
import { initials } from '@/utils/format';

const pick = (name = '') => avatarPalette[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarPalette.length];

/** <Avatar name="Deepak Kumar Jha" size={28} /> */
export default function Avatar({ name, size = 28, ring }) {
  return (
    <span
      title={name}
      style={{
        width: size, height: size, flexShrink: 0, borderRadius: '50%', display: 'inline-grid', placeItems: 'center',
        background: pick(name), color: colors.white, fontSize: Math.round(size * 0.38), fontWeight: 600, letterSpacing: '0.02em',
        boxShadow: ring ? `0 0 0 2px ${colors.bgCard}` : undefined,
      }}
    >
      {initials(name)}
    </span>
  );
}

/** Overlapping avatars. <AvatarStack names={[...]} max={4} /> */
export function AvatarStack({ names = [], max = 4, size = 26 }) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {shown.map((n, i) => (
        <span key={n + i} style={{ marginLeft: i ? -8 : 0 }}><Avatar name={n} size={size} ring /></span>
      ))}
      {rest > 0 && (
        <span
          style={{
            marginLeft: -8, width: size, height: size, borderRadius: '50%', display: 'inline-grid', placeItems: 'center',
            background: colors.bgPage, color: colors.textSecondary, fontSize: 11, fontWeight: 600, boxShadow: `0 0 0 2px ${colors.bgCard}`,
          }}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}
