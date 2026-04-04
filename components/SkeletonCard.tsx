export default function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid var(--border)',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ width: 110, height: 22 }} />
        <div className="skeleton" style={{ width: 90, height: 16 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ width: '90%', height: 24 }} />
        <div className="skeleton" style={{ width: '70%', height: 24 }} />
      </div>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div className="skeleton" style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, marginTop: 8 }} />
          <div className="skeleton" style={{ flex: 1, height: 16 }} />
        </div>
      ))}
      <div style={{ height: 1, background: 'var(--border)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ width: 130, height: 32, borderRadius: 20 }} />
        <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 20 }} />
      </div>
    </div>
  );
}
