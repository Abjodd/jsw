import { colors } from '@/theme/theme';

export default function PageLoader() {
  return (
    <div role="status" aria-label="Loading" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <span
        style={{
          width: 28, height: 28, borderRadius: '50%',
          border: `3px solid ${colors.steel100}`, borderTopColor: colors.steel,
          animation: 'jsw-spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}
