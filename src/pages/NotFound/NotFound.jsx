import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { colors, text } from '@/theme/theme';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
      <div>
        <p style={{ ...text.caption, letterSpacing: '0.08em', fontWeight: 600, color: colors.steel }}>ERROR 404</p>
        <h1 style={text.pageTitle}>Page not found</h1>
        <p style={{ ...text.subtitle, margin: '8px 0 24px' }}>The page you are looking for doesn’t exist or has moved.</p>
        <Link to="/"><Button>Back to applications</Button></Link>
      </div>
    </div>
  );
}
