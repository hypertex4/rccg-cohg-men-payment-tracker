import { useState, useMemo } from 'react';
import { formatAmount, formatDate, reasonBadge, today, filterByYear } from '../utils/helpers';
import { SearchIcon, FilterIcon, CloseIcon, HistoryIcon, CalendarIcon } from './Icons';

function DetailModal({ payment, memberName, programName, onClose }) {
  if (!payment) return null;
  const displayReason = payment.reason === 'Others' && payment.otherReason
    ? payment.otherReason
    : payment.reason;

  const rows = [
    { label:'Member', value: memberName },
    { label:'Amount', value: formatAmount(payment.amount), highlight: true },
    { label:'Payment Reason', value: displayReason },
    ...(programName ? [{ label:'Program', value: programName }] : []),
    { label:'Payment Date', value: formatDate(payment.date) },
    { label:'Recorded On', value: formatDate(payment.createdAt?.slice(0,10)) },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding:'22px 24px 18px',
          borderBottom:'1px solid #EDF2F7',
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div>
            <div style={{ fontSize:'11px', fontWeight:'700', color:'#74777E', textTransform:'uppercase', letterSpacing:'0.06em' }}>Payment Details</div>
            <div style={{ fontSize:'18px', fontWeight:'700', color:'#1A202C', marginTop:'2px' }}>{formatAmount(payment.amount)}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:'8px',
              cursor:'pointer', color:'#74777E', display:'flex', padding:'7px',
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:'22px 24px' }}>
          {rows.map(({ label, value, highlight }) => (
            <div key={label} style={{
              display:'flex', justifyContent:'space-between', alignItems:'flex-start',
              padding:'12px 0',
              borderBottom:'1px solid #EDF2F7',
            }}>
              <span style={{ fontSize:'13px', color:'#74777E', fontWeight:'500', minWidth:'120px' }}>{label}</span>
              <span style={{
                fontSize:'14px', fontWeight: highlight ? '800' : '600',
                color: highlight ? '#1565C0' : '#1A202C',
                textAlign:'right', flex:1,
              }}>
                {value}
              </span>
            </div>
          ))}

          {payment.comment && (
            <div style={{ padding:'12px 0' }}>
              <div style={{ fontSize:'13px', color:'#74777E', fontWeight:'500', marginBottom:'6px' }}>Comment</div>
              <div style={{
                fontSize:'14px', color:'#1A202C', fontWeight:'500',
                background:'#F8FAFC', borderRadius:'8px',
                padding:'10px 12px', lineHeight:'1.6',
                border:'1px solid #EDF2F7',
              }}>
                {payment.comment}
              </div>
            </div>
          )}

          {payment.reason && (
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0' }}>
              <span style={{ fontSize:'13px', color:'#74777E', fontWeight:'500' }}>Category</span>
              <span className={`badge ${reasonBadge(payment.reason)}`}>{payment.reason}</span>
            </div>
          )}
        </div>

        <div style={{ padding:'0 24px 22px' }}>
          <button
            className="btn btn-ghost"
            style={{ width:'100%', justifyContent:'center', padding:'11px' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentHistory({ payments, members, programs, year }) {
  const [selected,     setSelected]     = useState(null);
  const [search,       setSearch]       = useState('');
  const [filterMember, setFilterMember] = useState('');
  const [filterType,   setFilterType]   = useState('');
  const [filterProg,   setFilterProg]   = useState('');
  const [filterFrom,   setFilterFrom]   = useState('');
  const [filterTo,     setFilterTo]     = useState('');
  const [showFilters,  setShowFilters]  = useState(false);

  const getMemberName = (id) => members.find(m => m.id === id)?.name ?? '—';
  const getProgName   = (id) => id ? (programs.find(p => p.id === id)?.name ?? null) : null;

  const yearPayments = useMemo(() => filterByYear(payments, year), [payments, year]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...yearPayments]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter(p => {
        const name = getMemberName(p.memberId).toLowerCase();
        const reason = (p.reason === 'Others' && p.otherReason ? p.otherReason : p.reason).toLowerCase();
        if (q && !name.includes(q) && !reason.includes(q)) return false;
        if (filterMember && p.memberId !== filterMember)   return false;
        if (filterType   && p.reason !== filterType)       return false;
        if (filterProg) {
          if (filterProg === '__none__' ? p.programId : p.programId !== filterProg) return false;
        }
        if (filterFrom   && p.date < filterFrom)            return false;
        if (filterTo     && p.date > filterTo)              return false;
        return true;
      });
  }, [yearPayments, search, filterMember, filterType, filterProg, filterFrom, filterTo, members]);

  const totalFiltered = filtered.reduce((s, p) => s + Number(p.amount), 0);
  const hasFilter = search || filterMember || filterType || filterProg || filterFrom || filterTo;
  const clearFilters = () => { setSearch(''); setFilterMember(''); setFilterType(''); setFilterProg(''); setFilterFrom(''); setFilterTo(''); };

  const selectedPayment = selected ? payments.find(p => p.id === selected) : null;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:'700', color:'#1A202C' }}>Payment History</h1>
        <p style={{ fontSize:'13px', color:'#74777E', marginTop:'2px' }}>
          {yearPayments.length} payment{yearPayments.length !== 1 ? 's' : ''} in {year} · Click any row to view details
        </p>
      </div>

      {/* Summary strip */}
      {yearPayments.length > 0 && (
        <div style={{
          display:'flex', gap:'20px', flexWrap:'wrap',
          background:'linear-gradient(135deg, #E3F2FD, #E8F5E9)',
          border:'1px solid #BBDEFB',
          borderRadius:'12px',
          padding:'14px 20px',
          marginBottom:'16px',
        }}>
          <div>
            <div style={{ fontSize:'11px', fontWeight:'600', color:'#74777E', textTransform:'uppercase', letterSpacing:'0.05em' }}>
              {hasFilter ? 'Filtered Total' : `${year} Total`}
            </div>
            <div style={{ fontSize:'20px', fontWeight:'800', color:'#1565C0', marginTop:'2px' }}>{formatAmount(totalFiltered)}</div>
          </div>
          <div style={{ borderLeft:'1px solid #BBDEFB', paddingLeft:'20px' }}>
            <div style={{ fontSize:'11px', fontWeight:'600', color:'#74777E', textTransform:'uppercase', letterSpacing:'0.05em' }}>Showing</div>
            <div style={{ fontSize:'20px', fontWeight:'800', color:'#2E7D32', marginTop:'2px' }}>
              {filtered.length} <span style={{ fontSize:'13px', fontWeight:'500', color:'#74777E' }}>records</span>
            </div>
          </div>
        </div>
      )}

      {/* Search + Filter bar */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'14px', flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:'1', minWidth:'200px', maxWidth:'340px' }}>
          <SearchIcon size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#B0BEC5' }} />
          <input
            type="search"
            className="form-input"
            placeholder="Search member or reason…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft:'36px' }}
          />
        </div>
        <button
          className={`btn ${showFilters ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setShowFilters(v => !v)}
          style={{ fontSize:'13px' }}
        >
          <FilterIcon size={15} /> Filters
          {(filterMember || filterType || filterFrom || filterTo) && (
            <span style={{ width:'7px', height:'7px', borderRadius:'50%', background: showFilters ? 'white' : '#1976D2' }} />
          )}
        </button>
        {hasFilter && (
          <button className="btn btn-ghost" onClick={clearFilters} style={{ fontSize:'13px' }}>
            <CloseIcon size={14} /> Clear
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="card" style={{ padding:'18px 20px', marginBottom:'14px' }}>
          <div className="form-row">
            <div>
              <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>Member</label>
              <select className="form-input" value={filterMember} onChange={e => setFilterMember(e.target.value)}>
                <option value="">All Members</option>
                {[...members].sort((a,b)=>a.name.localeCompare(b.name)).map(m =>
                  <option key={m.id} value={m.id}>{m.name}</option>
                )}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>Payment Type</label>
              <select className="form-input" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                <option>Monthly Levy</option>
                <option>Church Project</option>
                <option>Others</option>
              </select>
            </div>
            {programs && programs.length > 0 && (
              <div>
                <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>Program</label>
                <select className="form-input" value={filterProg} onChange={e => setFilterProg(e.target.value)}>
                  <option value="">All Programs</option>
                  {[...programs].sort((a,b)=>a.name.localeCompare(b.name)).map(p =>
                    <option key={p.id} value={p.id}>{p.name}</option>
                  )}
                  <option value="__none__">Unassigned</option>
                </select>
              </div>
            )}
            <div>
              <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>From</label>
              <input type="date" className="form-input" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>To</label>
              <input type="date" className="form-input" value={filterTo} onChange={e => setFilterTo(e.target.value)} max={today()} />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {yearPayments.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <HistoryIcon size={44} style={{ color:'#CBD5E0', display:'block', margin:'0 auto 14px' }} />
            <h3>No payments in {year}</h3>
            <p>Payments you record for {year} will appear here.</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <SearchIcon size={40} style={{ color:'#CBD5E0', display:'block', margin:'0 auto 14px' }} />
            <h3>No results found</h3>
            <p>Try adjusting your search or filters.</p>
            <button className="btn btn-ghost" style={{ marginTop:'14px', fontSize:'13px' }} onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Member</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  {programs && programs.length > 0 && <th>Program</th>}
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const displayReason = p.reason === 'Others' && p.otherReason ? p.otherReason : p.reason;
                  const progName = getProgName(p.programId);
                  return (
                    <tr key={p.id} onClick={() => setSelected(p.id)}>
                      <td style={{ color:'#A0AEC0', fontSize:'13px', width:'40px' }}>{i + 1}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                          <div style={{
                            width:'30px', height:'30px', borderRadius:'50%',
                            background:'#E3F2FD', color:'#1565C0',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontWeight:'700', fontSize:'12px', flexShrink:0,
                          }}>
                            {getMemberName(p.memberId)[0]?.toUpperCase()}
                          </div>
                          <span style={{ fontWeight:'600' }}>{getMemberName(p.memberId)}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight:'700', color:'#1565C0' }}>{formatAmount(p.amount)}</td>
                      <td>
                        <span className={`badge ${reasonBadge(p.reason)}`}>
                          {displayReason.length > 24 ? displayReason.slice(0, 24) + '…' : displayReason}
                        </span>
                      </td>
                      {programs && programs.length > 0 && (
                        <td style={{ color:'#74777E', fontSize:'13px' }}>
                          {progName ?? <span style={{ color:'#CBD5E0' }}>—</span>}
                        </td>
                      )}
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'#74777E', fontSize:'13px' }}>
                          <CalendarIcon size={12} />
                          {formatDate(p.date)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedPayment && (
        <DetailModal
          payment={selectedPayment}
          memberName={getMemberName(selectedPayment.memberId)}
          programName={getProgName(selectedPayment.programId)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
