import { card, colors, text } from '@/theme/theme';

/** <Card title="..." subtitle="..." actions={...} flush style={{...}}>children</Card> */
export default function Card({ title, subtitle, actions, flush, style, bodyStyle, children, ...rest }) {
  return (
    <section style={{ ...card, ...style }} {...rest}>
      {(title || actions) && (
        <header
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            padding: '18px 20px', borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div>
            {title && <h3 style={text.cardTitle}>{title}</h3>}
            {subtitle && <p style={{ ...text.caption, margin: 0 }}>{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div style={{ padding: flush ? 0 : 20, overflowX: flush ? 'auto' : undefined, ...bodyStyle }}>{children}</div>
    </section>
  );
}
