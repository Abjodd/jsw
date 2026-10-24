import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { colors, text } from '@/theme/theme';

/**
 * Standard page header for every screen.
 * crumbs: [{ label, to? }]
 */
export default function PageHeader({ title, subtitle, crumbs = [], actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
      <div>
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" style={{ ...text.caption, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            {crumbs.map((c, i) => (
              <span key={c.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {c.to ? <Link to={c.to} style={{ color: colors.textSecondary }}>{c.label}</Link> : <span>{c.label}</span>}
                {i < crumbs.length - 1 && <ChevronRight size={12} />}
              </span>
            ))}
          </nav>
        )}
        <h1 style={text.pageTitle}>{title}</h1>
        {subtitle && <p style={{ ...text.subtitle, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}
