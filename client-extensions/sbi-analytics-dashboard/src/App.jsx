import React, { useState } from 'react';

export default function App({ dashboardTitle }) {
  const [period, setPeriod] = useState('monthly');

  const metrics = {
    monthly: [
      { label: 'Active Users', value: '24,520', change: '+12.5%', positive: true },
      { label: 'API Requests', value: '1.2M', change: '+8.1%', positive: true },
      { label: 'Avg Latency', value: '42ms', change: '-4.3%', positive: true }
    ],
    yearly: [
      { label: 'Active Users', value: '280,000', change: '+34.2%', positive: true },
      { label: 'API Requests', value: '14.8M', change: '+18.6%', positive: true },
      { label: 'Avg Latency', value: '38ms', change: '-12.0%', positive: true }
    ]
  };

  const currentMetrics = metrics[period];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{dashboardTitle || 'Live Metrics'}</h3>
        <div style={styles.btnGroup}>
          <button
            style={period === 'monthly' ? styles.activeBtn : styles.btn}
            onClick={() => setPeriod('monthly')}
          >
            30 Days
          </button>
          <button
            style={period === 'yearly' ? styles.activeBtn : styles.btn}
            onClick={() => setPeriod('yearly')}
          >
            12 Months
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        {currentMetrics.map((item, idx) => (
          <div key={idx} style={styles.card}>
            <span style={styles.label}>{item.label}</span>
            <div style={styles.valueRow}>
              <span style={styles.value}>{item.value}</span>
              <span style={item.positive ? styles.badgeSuccess : styles.badgeError}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '1.25rem',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    maxWidth: '680px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  title: { margin: 0, fontSize: '1.15rem', color: '#0f172a' },
  btnGroup: { display: 'flex', gap: '6px' },
  btn: {
    padding: '6px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    background: '#f8fafc',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  activeBtn: {
    padding: '6px 12px',
    border: '1px solid #0b5fff',
    borderRadius: '6px',
    background: '#0b5fff',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' },
  card: {
    padding: '1rem',
    borderRadius: '8px',
    background: '#f8fafc',
    border: '1px solid #f1f5f9'
  },
  label: { fontSize: '0.8rem', color: '#64748b', fontWeight: '500' },
  valueRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' },
  value: { fontSize: '1.35rem', fontWeight: '700', color: '#0f172a' },
  badgeSuccess: { fontSize: '0.75rem', fontWeight: '600', color: '#16a34a', background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' },
  badgeError: { fontSize: '0.75rem', fontWeight: '600', color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }
};