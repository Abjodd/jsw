import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ArrowDownRight, CalendarDays, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MODULES } from '@/config/modules';
import TopBar from '@/components/layout/TopBar';
import JswLogo from '@/components/brand/JswLogo';
import { Button, Card, DataTable, StatusBadge } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, layout, radius, rise, shadow, status, text } from '@/theme/theme';
import ModuleTile from './components/ModuleTile';
import { ACTIVITY, PENDING, SUMMARY } from './homeData';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const today = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

/* ---------- styles ---------- */
const s = {
  hero: {
    position: 'relative', color: colors.white,
    background: `radial-gradient(70% 120% at 100% 0%, rgba(71,125,165,0.45) 0%, transparent 60%),
      linear-gradient(120deg, ${colors.navy} 0%, #163B5B 55%, ${colors.graphite} 100%)`,
  },
  heroPattern: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 56px)',
  },
  heroInner: (m) => ({ position: 'relative', zIndex: 1, maxWidth: layout.contentMaxW, margin: '0 auto', padding: m ? '24px 16px 0' : '36px 28px 0' }),
  date: { ...text.caption, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.65)' },
  title: { ...text.pageTitle, color: colors.white, margin: '8px 0 6px' },
  subtitle: { ...text.subtitle, color: 'rgba(255,255,255,0.72)' },
  ghostBtn: { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)', color: colors.white },
  summary: (cols) => ({
    display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, marginTop: 28, transform: 'translateY(36px)',
    background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: shadow.lg,
    overflow: 'hidden',
  }),
  summaryItem: { display: 'flex', flexDirection: 'column', gap: 4, padding: '18px 22px', color: colors.textPrimary },
  summaryValue: { fontSize: 28, lineHeight: '36px', fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' },
  content: (m) => ({ maxWidth: layout.contentMaxW, margin: '0 auto', padding: m ? '64px 16px 32px' : '72px 28px 48px' }),
  activityDot: (st) => ({
    width: 12, height: 12, borderRadius: '50%', marginTop: 5, background: status[st].color,
    border: `3px solid ${colors.bgCard}`, boxShadow: `0 0 0 1px ${colors.border}`, position: 'relative', zIndex: 1,
  }),
  tag: {
    display: 'inline-block', marginRight: 8, padding: '0 6px', borderRadius: 4,
    fontSize: 11, lineHeight: '18px', fontWeight: 600, letterSpacing: '0.04em', color: colors.navy, background: colors.steel50,
  },
};

const pendingColumns = (isMobile) => [
  {
    key: 'id', label: 'Reference', style: { whiteSpace: 'nowrap' },
    render: (r) => <Link to={`/${r.module.toLowerCase()}`} style={{ fontWeight: 500, color: colors.steel }}>{r.id}</Link>,
  },
  { key: 'title', label: 'Description' },
  ...(isMobile ? [] : [{ key: 'owner', label: 'Location', style: { color: colors.textSecondary, whiteSpace: 'nowrap' } }]),
  {
    key: 'due', label: 'Due',
    render: (r) => (
      <span style={{ whiteSpace: 'nowrap', ...(r.status === 'error' ? { color: status.error.color, fontWeight: 500 } : null) }}>{r.due}</span>
    ),
  },
  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status}>{r.statusLabel}</StatusBadge> },
];

export default function HomeDashboard() {
  const { user } = useAuth();
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const summaryCols = isMobile ? 2 : isLaptop ? 3 : 5;
  const tileCols = isMobile ? 1 : isLaptop ? 2 : 6;

  return (
    <div style={{ minHeight: '100vh' }}>
      <TopBar left={<Link to="/"><JswLogo /></Link>} />

      {/* ---------- Hero ---------- */}
      <section style={s.hero}>
        <div style={s.heroPattern} />
        <div style={s.heroInner(isMobile)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <span style={s.date}><CalendarDays size={14} /> {today}</span>
              <h1 style={s.title}>{greeting()}, {firstName}</h1>
              <p style={s.subtitle}>
                You have <strong style={{ color: colors.white, fontWeight: 600 }}>{PENDING.length} items</strong> waiting on you across procurement modules.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="accent" icon={<Plus size={18} />}>New requisition</Button>
              <Button variant="secondary" style={s.ghostBtn} icon={<Sparkles size={16} />}>Raise RFQ</Button>
            </div>
          </div>

          <div style={s.summary(summaryCols)}>
            {SUMMARY.map((item, i) => {
              const up = item.delta >= 0;
              return (
                <div
                  key={item.label}
                  style={{
                    ...s.summaryItem,
                    ...rise(i * 60),
                    borderLeft: i % summaryCols !== 0 ? `1px solid ${colors.border}` : 'none',
                    borderTop: i >= summaryCols ? `1px solid ${colors.border}` : 'none',
                  }}
                >
                  <span style={{ ...text.label, color: colors.textSecondary }}>{item.label}</span>
                  <span style={s.summaryValue}>{item.value}</span>
                  <span
                    style={{
                      ...text.caption, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 2,
                      color: up ? status.success.color : status.error.color,
                    }}
                  >
                    {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(item.delta)}%
                    <span style={{ color: colors.textDisabled, fontWeight: 400, marginLeft: 4 }}>vs last month</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <main style={s.content(isMobile)}>
        {/* ---------- Module tiles ---------- */}
        <div style={{ marginBottom: 18 }}>
          <h2 style={text.section}>Applications</h2>
          <p style={text.subtitle}>Open a module to manage its workflows and reports.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tileCols}, 1fr)`, gap: 20 }}>
          {MODULES.map((m, i) => (
            <ModuleTile
              key={m.id}
              module={m}
              index={i}
              // desktop bento: first 2 tiles span 3 of 6 cols, last 3 span 2
              style={{ gridColumn: tileCols === 6 ? `span ${i < 2 ? 3 : 2}` : 'span 1' }}
            />
          ))}
        </div>

        {/* ---------- Work queue + activity ---------- */}
        <div style={{ display: 'grid', gridTemplateColumns: isLaptop ? '1fr' : '1.7fr 1fr', gap: 20, marginTop: 28 }}>
          <Card
            title="Pending your action"
            subtitle="Sorted by due date across all modules"
            actions={<Button variant="ghost" size="sm" iconRight={<ArrowRight size={16} />}>View all</Button>}
            flush
          >
            <DataTable columns={pendingColumns(isMobile)} rows={PENDING} />
          </Card>

          <Card title="Recent activity" subtitle="Last 24 hours">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {ACTIVITY.map((a, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '12px 1fr', gap: 12, position: 'relative' }}>
                  {i < ACTIVITY.length - 1 && (
                    <span style={{ position: 'absolute', left: 5, top: 18, bottom: -14, width: 2, background: colors.border }} />
                  )}
                  <span style={s.activityDot(a.status)} />
                  <div>
                    <p style={{ ...text.body, margin: 0 }}>
                      <span style={s.tag}>{a.module}</span>{a.text}
                    </p>
                    <span style={text.caption}>{a.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
