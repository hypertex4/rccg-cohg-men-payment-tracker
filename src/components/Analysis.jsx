import { useState, useMemo } from 'react';
import { formatAmount, formatDate, filterByYear, availableYears, reasonBadge, MONTHS } from '../utils/helpers';
import { AnalyticsIcon, FilterIcon, TrendIcon } from './Icons';

function BarRow({ label, amount, total, count, badge }) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return (
    <div style={{ marginBottom:'14px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'5px', gap:'8px', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          {badge && <span className={`badge ${badge}`}>{label}</span>}
          {!badge && <span style={{ fontSize:'14px', fontWeight:'600', color:'#1A202C' }}>{label}</span>}
        </div>
        <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
          <span style={{ fontSize:'13px', color:'#74777E' }}>{count} payment{count !== 1 ? 's' : ''}</span>
          <span style={{ fontSize:'14px', fontWeight:'700', color:'#1565C0' }}>{formatAmount(amount)}</span>
          <span style={{ fontSize:'12px', color:'#74777E', minWidth:'34px', textAlign:'right' }}>{pct}%</span>
        </div>
      </div>
      <div style={{ height:'7px', background:'#EDF2F7', borderRadius:'4px', overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg, #1976D2, #42A5F5)', borderRadius:'4px', transition:'width 0.4s ease' }} />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, color }) {
  return (
    <div className="card" style={{ padding:'18px 20px' }}>
      <div style={{ fontSize:'11px', fontWeight:'700', color:'#74777E', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>{label}</div>
      <div style={{ fontSize:'22px', fontWeight:'800', color: color || '#1A202C', lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:'12px', color:'#74777E', marginTop:'5px' }}>{sub}</div>}
    </div>
  );
}

export default function Analysis({ payments, members, programs, year }) {
  const [localYear,  setLocalYear]  = useState(year);
  const [filterProg, setFilterProg] = useState('');
  const [filterRsn,  setFilterRsn]  = useState('');
  const [filterMem,  setFilterMem]  = useState('');

  const getMemberName = (id) => members.find(m => m.id === id)?.name ?? '—';
  const getProgName   = (id) => programs.find(p => p.id === id)?.name ?? null;

  const base = useMemo(() => {
    return filterByYear(payments, localYear).filter(p => {
      if (filterProg && p.programId !== filterProg) return false;
      if (filterRsn  && p.reason    !== filterRsn)  return false;
      if (filterMem  && p.memberId  !== filterMem)  return false;
      return true;
    });
  }, [payments, localYear, filterProg, filterRsn, filterMem]);

  const grandTotal  = base.reduce((s, p) => s + Number(p.amount), 0);
  const uniqueMembers = [...new Set(base.map(p => p.memberId))].length;
  const avgPerMember  = uniqueMembers > 0 ? grandTotal / uniqueMembers : 0;

  // By Program
  const byProgram = useMemo(() => {
    const map = {};
    base.forEach(p => {
      const key = p.programId || '__none__';
      if (!map[key]) map[key] = { amount:0, count:0 };
      map[key].amount += Number(p.amount);
      map[key].count  += 1;
    });
    return Object.entries(map)
      .map(([id, v]) => ({ id, name: id === '__none__' ? 'Unassigned' : (getProgName(id) || 'Unknown'), ...v }))
      .sort((a, b) => b.amount - a.amount);
  }, [base]);

  // By Reason
  const byReason = useMemo(() => {
    const map = {};
    base.forEach(p => {
      const key = p.reason;
      if (!map[key]) map[key] = { amount:0, count:0 };
      map[key].amount += Number(p.amount);
      map[key].count  += 1;
    });
    return Object.entries(map)
      .map(([reason, v]) => ({ reason, ...v }))
      .sort((a, b) => b.amount - a.amount);
  }, [base]);

  // By Member
  const byMember = useMemo(() => {
    const map = {};
    base.forEach(p => {
      if (!map[p.memberId]) map[p.memberId] = { amount:0, count:0, lastDate:'' };
      map[p.memberId].amount += Number(p.amount);
      map[p.memberId].count  += 1;
      if (p.date > map[p.memberId].lastDate) map[p.memberId].lastDate = p.date;
    });
    return Object.entries(map)
      .map(([id, v]) => ({ id, name: getMemberName(id), ...v }))
      .sort((a, b) => b.amount - a.amount);
  }, [base]);

  // Monthly trend
  const monthly = useMemo(() => {
    const map = {};
    MONTHS.forEach((m, i) => { map[String(i+1).padStart(2,'0')] = 0; });
    base.forEach(p => {
      const mm = p.date?.slice(5,7);
      if (mm && map[mm] !== undefined) map[mm] += Number(p.amount);
    });
    return MONTHS.map((m, i) => ({
      month: m,
      amount: map[String(i+1).padStart(2,'0')],
    }));
  }, [base]);

  const maxMonthly = Math.max(...monthly.map(m => m.amount), 1);
  const hasFilters = filterProg || filterRsn || filterMem;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:'700', color:'#1A202C' }}>Analysis & Reports</h1>
        <p style={{ fontSize:'13px', color:'#74777E', marginTop:'2px' }}>Financial breakdown and payment insights</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding:'18px 20px', marginBottom:'20px' }}>
        <div style={{ fontSize:'12px', fontWeight:'700', color:'#74777E', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'14px' }}>
          <FilterIcon size={13} style={{ marginRight:'6px' }} />Filters
        </div>
        <div className="form-row">
          <div>
            <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>Finance Year</label>
            <select className="form-input" value={localYear} onChange={e => setLocalYear(Number(e.target.value))}>
              {availableYears().map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>Program</label>
            <select className="form-input" value={filterProg} onChange={e => setFilterProg(e.target.value)}>
              <option value="">All Programs</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              <option value="__none__">Unassigned</option>
            </select>
          </div>
          <div>
            <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>Reason</label>
            <select className="form-input" value={filterRsn} onChange={e => setFilterRsn(e.target.value)}>
              <option value="">All Reasons</option>
              <option>Monthly Levy</option>
              <option>Church Project</option>
              <option>Others</option>
            </select>
          </div>
          <div>
            <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>Member</label>
            <select className="form-input" value={filterMem} onChange={e => setFilterMem(e.target.value)}>
              <option value="">All Members</option>
              {[...members].sort((a,b)=>a.name.localeCompare(b.name)).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>
        {hasFilters && (
          <button className="btn btn-ghost" style={{ marginTop:'10px', fontSize:'12px' }} onClick={() => { setFilterProg(''); setFilterRsn(''); setFilterMem(''); }}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom:'20px' }}>
        <SummaryCard label="Total Collected" value={formatAmount(grandTotal)} sub={`${base.length} payment${base.length !== 1 ? 's' : ''} · ${localYear}`} color="#1565C0" />
        <SummaryCard label="Members Who Paid" value={uniqueMembers} sub={`of ${members.length} total members`} color="#2E7D32" />
        <SummaryCard label="Average Per Member" value={formatAmount(avgPerMember)} sub="among contributors" color="#E65100" />
      </div>

      {base.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <AnalyticsIcon size={44} style={{ color:'#CBD5E0', display:'block', margin:'0 auto 14px' }} />
            <h3>No data for this selection</h3>
            <p>Try adjusting the year or clearing filters.</p>
          </div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

          {/* Monthly Trend */}
          <div className="card" style={{ padding:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'18px' }}>
              <TrendIcon size={18} style={{ color:'#1976D2' }} />
              <span style={{ fontSize:'15px', fontWeight:'700', color:'#1A202C' }}>Monthly Trend — {localYear}</span>
            </div>
            <div style={{ display:'flex', gap:'4px', alignItems:'flex-end', height:'80px' }}>
              {monthly.map(({ month, amount }) => {
                const h = Math.max((amount / maxMonthly) * 72, amount > 0 ? 4 : 0);
                return (
                  <div key={month} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                    <div
                      title={`${month}: ${formatAmount(amount)}`}
                      style={{
                        width:'100%', height:`${h}px`,
                        background: amount > 0 ? 'linear-gradient(180deg, #42A5F5, #1565C0)' : '#EDF2F7',
                        borderRadius:'3px 3px 0 0', transition:'height 0.3s',
                        minHeight: amount > 0 ? '4px' : '2px',
                      }}
                    />
                    <span style={{ fontSize:'9px', color:'#74777E', fontWeight:'500' }}>{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Program */}
          {programs.length > 0 && (
            <div className="card" style={{ padding:'20px' }}>
              <div style={{ fontSize:'15px', fontWeight:'700', color:'#1A202C', marginBottom:'16px' }}>Breakdown by Program</div>
              {byProgram.map(({ id, name, amount, count }) => (
                <BarRow key={id} label={name} amount={amount} total={grandTotal} count={count} />
              ))}
            </div>
          )}

          {/* By Reason */}
          <div className="card" style={{ padding:'20px' }}>
            <div style={{ fontSize:'15px', fontWeight:'700', color:'#1A202C', marginBottom:'16px' }}>Breakdown by Reason</div>
            {byReason.map(({ reason, amount, count }) => (
              <BarRow key={reason} label={reason} amount={amount} total={grandTotal} count={count} badge={reasonBadge(reason)} />
            ))}
          </div>

          {/* By Member */}
          <div className="card" style={{ overflow:'hidden' }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #EDF2F7' }}>
              <span style={{ fontSize:'15px', fontWeight:'700', color:'#1A202C' }}>Breakdown by Member</span>
              <span style={{ fontSize:'13px', color:'#74777E', marginLeft:'8px' }}>{byMember.length} contributor{byMember.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Member</th>
                    <th>Total Paid</th>
                    <th>Payments</th>
                    <th>Last Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {byMember.map((m, i) => (
                    <tr key={m.id} style={{ cursor:'default' }}>
                      <td style={{ color:'#A0AEC0', fontSize:'13px' }}>{i + 1}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                          <div style={{
                            width:'30px', height:'30px', borderRadius:'50%',
                            background:'#E3F2FD', color:'#1565C0',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontWeight:'700', fontSize:'12px', flexShrink:0,
                          }}>
                            {m.name[0]?.toUpperCase()}
                          </div>
                          <span style={{ fontWeight:'600' }}>{m.name}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight:'700', color:'#1565C0' }}>{formatAmount(m.amount)}</td>
                      <td><span className="badge badge-blue">{m.count}</span></td>
                      <td style={{ color:'#74777E', fontSize:'13px' }}>{formatDate(m.lastDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Members who have NOT paid */}
          {(() => {
            const paidIds = new Set(base.map(p => p.memberId));
            const notPaid = members.filter(m => !m.disabled && !paidIds.has(m.id));
            if (notPaid.length === 0) return null;
            return (
              <div className="card" style={{ padding:'20px' }}>
                <div style={{ fontSize:'15px', fontWeight:'700', color:'#C62828', marginBottom:'12px' }}>
                  Not Yet Paid ({notPaid.length})
                </div>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {notPaid.sort((a,b)=>a.name.localeCompare(b.name)).map(m => (
                    <span key={m.id} style={{
                      padding:'5px 12px', borderRadius:'20px',
                      background:'#FFEBEE', color:'#C62828',
                      fontSize:'13px', fontWeight:'500',
                    }}>
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

        </div>
      )}
    </div>
  );
}
