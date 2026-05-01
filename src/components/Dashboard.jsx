import { useState, useMemo } from 'react';
import { formatAmount, formatDate, reasonBadge, today, filterByYear } from '../utils/helpers';
import { MoneyIcon, UsersIcon, HistoryIcon, ArrowRightIcon, FilterIcon } from './Icons';

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="card" style={{ padding:'20px 22px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px' }}>
        <div>
          <div style={{ fontSize:'12px', fontWeight:'600', color:'#74777E', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>
            {label}
          </div>
          <div style={{ fontSize:'24px', fontWeight:'800', color:'#1A202C', lineHeight:1 }}>{value}</div>
          {sub && <div style={{ fontSize:'12px', color:'#74777E', marginTop:'6px' }}>{sub}</div>}
        </div>
        <div style={{
          width:'44px', height:'44px', borderRadius:'12px',
          background: color + '1a',
          display:'flex', alignItems:'center', justifyContent:'center',
          color, flexShrink:0,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ payments, members, onNavigate, year }) {
  const [filterMember, setFilterMember]   = useState('');
  const [filterType,   setFilterType]     = useState('');
  const [filterFrom,   setFilterFrom]     = useState('');
  const [filterTo,     setFilterTo]       = useState('');
  const [showFilters,  setShowFilters]    = useState(false);

  const yearPayments = useMemo(() => filterByYear(payments, year), [payments, year]);

  const filtered = useMemo(() => {
    return yearPayments.filter(p => {
      if (filterMember && p.memberId !== filterMember) return false;
      if (filterType   && p.reason   !== filterType)   return false;
      if (filterFrom   && p.date < filterFrom)          return false;
      if (filterTo     && p.date > filterTo)            return false;
      return true;
    });
  }, [yearPayments, filterMember, filterType, filterFrom, filterTo]);

  const totalFiltered = filtered.reduce((s, p) => s + Number(p.amount), 0);
  const hasFilter = filterMember || filterType || filterFrom || filterTo;

  const getMemberName = (id) => members.find(m => m.id === id)?.name ?? '—';

  const recent = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom:'24px' }}>
        <StatCard
          icon={<MoneyIcon size={22} />}
          label={hasFilter ? 'Filtered Total' : `${year} Total Collected`}
          value={formatAmount(totalFiltered)}
          sub={hasFilter ? `${filtered.length} of ${yearPayments.length} payments` : `${yearPayments.length} payments · ${year}`}
          color="#1976D2"
        />
        <StatCard
          icon={<UsersIcon size={22} />}
          label="Registered Members"
          value={members.filter(m => !m.disabled).length}
          sub={`${members.length} total · ${members.filter(m => m.disabled).length} disabled`}
          color="#2E7D32"
        />
        <StatCard
          icon={<HistoryIcon size={22} />}
          label="All-time Collected"
          value={formatAmount(payments.reduce((s, p) => s + Number(p.amount), 0))}
          sub="Across all years"
          color="#E65100"
        />
      </div>

      {/* Quick actions */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
        <button className="btn btn-primary" onClick={() => onNavigate('record-payment')}>
          <ArrowRightIcon size={16} /> Record New Payment
        </button>
        <button className="btn btn-outline" onClick={() => onNavigate('payment-history')}>
          <HistoryIcon size={16} /> View All Payments
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => setShowFilters(v => !v)}
          style={{ marginLeft:'auto' }}
        >
          <FilterIcon size={16} /> {showFilters ? 'Hide Filters' : 'Filter'}
          {hasFilter && (
            <span style={{
              width:'7px', height:'7px', borderRadius:'50%',
              background:'#1976D2', marginLeft:'2px',
            }} />
          )}
        </button>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="card" style={{ padding:'20px', marginBottom:'24px' }}>
          <div style={{ fontSize:'13px', fontWeight:'600', color:'#4A5568', marginBottom:'14px', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Filter Payments
          </div>
          <div className="form-row">
            <div>
              <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'6px' }}>Member</label>
              <select className="form-input" value={filterMember} onChange={e => setFilterMember(e.target.value)}>
                <option value="">All Members</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'6px' }}>Payment Type</label>
              <select className="form-input" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                <option>Monthly Levy</option>
                <option>Church Project</option>
                <option>Others</option>
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'6px' }}>From Date</label>
              <input type="date" className="form-input" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'6px' }}>To Date</label>
              <input type="date" className="form-input" value={filterTo} onChange={e => setFilterTo(e.target.value)} max={today()} />
            </div>
          </div>
          {hasFilter && (
            <button
              className="btn btn-ghost"
              onClick={() => { setFilterMember(''); setFilterType(''); setFilterFrom(''); setFilterTo(''); }}
              style={{ marginTop:'12px', fontSize:'13px' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Recent payments */}
      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{
          padding:'18px 20px',
          borderBottom:'1px solid #EDF2F7',
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div>
            <div style={{ fontSize:'15px', fontWeight:'700', color:'#1A202C' }}>
              {hasFilter ? 'Filtered Payments' : 'Recent Payments'}
            </div>
            <div style={{ fontSize:'12px', color:'#74777E', marginTop:'2px' }}>
              {hasFilter ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : 'Last 6 transactions'}
            </div>
          </div>
          <button
            className="btn btn-ghost"
            style={{ fontSize:'13px', padding:'7px 14px' }}
            onClick={() => onNavigate('payment-history')}
          >
            View all
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <MoneyIcon size={40} style={{ color:'#CBD5E0', display:'block', margin:'0 auto 12px' }} />
            <h3>{hasFilter ? 'No payments match this filter' : 'No payments yet'}</h3>
            <p style={{ marginTop:'6px' }}>
              {hasFilter ? 'Try adjusting your filters.' : 'Record the first payment to get started.'}
            </p>
            {!hasFilter && (
              <button
                className="btn btn-primary"
                style={{ marginTop:'16px' }}
                onClick={() => onNavigate('record-payment')}
              >
                Record Payment
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(p => {
                  const displayReason = p.reason === 'Others' && p.otherReason ? p.otherReason : p.reason;
                  return (
                    <tr key={p.id} onClick={() => onNavigate('payment-history')}>
                      <td style={{ fontWeight:'500' }}>{getMemberName(p.memberId)}</td>
                      <td style={{ fontWeight:'700', color:'#1565C0' }}>{formatAmount(p.amount)}</td>
                      <td>
                        <span className={`badge ${reasonBadge(p.reason)}`}>
                          {displayReason.length > 22 ? displayReason.slice(0, 22) + '…' : displayReason}
                        </span>
                      </td>
                      <td style={{ color:'#74777E' }}>{formatDate(p.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
