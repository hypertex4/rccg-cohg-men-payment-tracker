import { useState } from 'react';
import { today, REASONS, formatAmount } from '../utils/helpers';
import { CheckIcon, MoneyIcon } from './Icons';

export default function RecordPayment({ members, programs, onAddPayment, onNavigate }) {
  const [memberId,    setMemberId]    = useState('');
  const [amount,      setAmount]      = useState('');
  const [reason,      setReason]      = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [programId,   setProgramId]   = useState('');
  const [date,        setDate]        = useState(today());
  const [comment,     setComment]     = useState('');
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState(false);

  const validate = () => {
    if (!memberId)       return 'Please select a member.';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
                         return 'Please enter a valid amount greater than 0.';
    if (!reason)         return 'Please select a payment reason.';
    if (reason === 'Others' && !otherReason.trim())
                         return 'Please describe the payment reason.';
    if (!date)           return 'Please select a payment date.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    onAddPayment({
      memberId,
      amount: Number(amount),
      reason,
      otherReason: reason === 'Others' ? otherReason.trim() : '',
      programId: programId || null,
      date,
      comment: comment.trim(),
    });

    setSuccess(true);
    setMemberId(''); setAmount(''); setReason(''); setOtherReason(''); setProgramId(''); setDate(today()); setComment(''); setError('');
    setTimeout(() => setSuccess(false), 3500);
  };

  const member = members.find(m => m.id === memberId);

  return (
    <div style={{ maxWidth:'600px' }}>
      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:'700', color:'#1A202C' }}>Record Payment</h1>
        <p style={{ fontSize:'13px', color:'#74777E', marginTop:'2px' }}>Fill in the details to record a new payment.</p>
      </div>

      {members.filter(m => !m.disabled).length === 0 ? (
        <div className="card" style={{ padding:'36px', textAlign:'center' }}>
          <MoneyIcon size={44} style={{ color:'#CBD5E0', display:'block', margin:'0 auto 14px' }} />
          <h3 style={{ fontSize:'16px', fontWeight:'600', color:'#4A5568', marginBottom:'6px' }}>
            {members.length === 0 ? 'No members registered' : 'No active members'}
          </h3>
          <p style={{ fontSize:'13px', color:'#74777E', marginBottom:'18px' }}>
            {members.length === 0
              ? 'You need to add members before recording a payment.'
              : 'All members are currently disabled. Enable a member to record a payment.'}
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('members')}>
            {members.length === 0 ? 'Add Members First' : 'Go to Members'}
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding:'28px' }}>
          <form onSubmit={handleSubmit}>

            {/* Member Select */}
            <div style={{ marginBottom:'18px' }}>
              <label style={{ display:'block', fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'7px' }}>
                Member <span style={{ color:'#E53E3E' }}>*</span>
              </label>
              <select
                className="form-input"
                value={memberId}
                onChange={e => { setMemberId(e.target.value); setError(''); }}
              >
                <option value="">— Select a member —</option>
                {[...members]
                  .filter(m => !m.disabled)
                  .sort((a,b) => a.name.localeCompare(b.name))
                  .map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
              </select>
              {member && (
                <div style={{ marginTop:'7px', display:'flex', alignItems:'center', gap:'8px' }}>
                  <div style={{
                    width:'26px', height:'26px', borderRadius:'50%',
                    background:'#E3F2FD', color:'#1565C0',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:'700', fontSize:'11px',
                  }}>
                    {member.name[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize:'13px', color:'#1976D2', fontWeight:'600' }}>{member.name}</span>
                  {member.phone && <span style={{ fontSize:'12px', color:'#74777E' }}>· {member.phone}</span>}
                </div>
              )}
            </div>

            <div className="form-row" style={{ marginBottom:'18px' }}>
              {/* Amount */}
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'7px' }}>
                  Amount (₦) <span style={{ color:'#E53E3E' }}>*</span>
                </label>
                <div style={{ position:'relative' }}>
                  <span style={{
                    position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)',
                    fontSize:'14px', fontWeight:'700', color:'#74777E',
                  }}>₦</span>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setError(''); }}
                    style={{ paddingLeft:'28px' }}
                  />
                </div>
                {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
                  <div style={{ fontSize:'12px', color:'#2E7D32', fontWeight:'600', marginTop:'5px' }}>
                    = {formatAmount(amount)}
                  </div>
                )}
              </div>

              {/* Date */}
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'7px' }}>
                  Payment Date <span style={{ color:'#E53E3E' }}>*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  max={today()}
                  onChange={e => { setDate(e.target.value); setError(''); }}
                />
              </div>
            </div>

            {/* Reason */}
            <div style={{ marginBottom: reason === 'Others' ? '12px' : '24px' }}>
              <label style={{ display:'block', fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'7px' }}>
                Payment Reason <span style={{ color:'#E53E3E' }}>*</span>
              </label>
              <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                {REASONS.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setReason(r); setOtherReason(''); setError(''); }}
                    style={{
                      padding:'9px 16px',
                      borderRadius:'8px',
                      border: reason === r ? '2px solid #1976D2' : '1.5px solid #E2E8F0',
                      background: reason === r ? '#E3F2FD' : 'white',
                      color: reason === r ? '#1565C0' : '#4A5568',
                      fontWeight: reason === r ? '700' : '500',
                      fontSize:'13px',
                      cursor:'pointer',
                      transition:'all 0.15s',
                    }}
                  >
                    {r === 'Monthly Levy' && '📋 '}
                    {r === 'Church Project' && '⛪ '}
                    {r === 'Others' && '📝 '}
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Others text */}
            {reason === 'Others' && (
              <div style={{ marginBottom:'18px' }}>
                <label style={{ display:'block', fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'7px' }}>
                  Please describe <span style={{ color:'#E53E3E' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Special offering, Convention levy…"
                  value={otherReason}
                  onChange={e => { setOtherReason(e.target.value); setError(''); }}
                  autoFocus
                />
              </div>
            )}

            {/* Program — optional */}
            {programs && programs.length > 0 && (
              <div style={{ marginBottom:'18px' }}>
                <label style={{ display:'block', fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'7px' }}>
                  Program <span style={{ color:'#74777E', fontWeight:'400' }}>(optional)</span>
                </label>
                <select
                  className="form-input"
                  value={programId}
                  onChange={e => setProgramId(e.target.value)}
                >
                  <option value="">— No Program —</option>
                  {[...programs].sort((a,b) => a.name.localeCompare(b.name)).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Comment — always visible */}
            <div style={{ marginBottom:'24px' }}>
              <label style={{ display:'block', fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'7px' }}>
                Comment <span style={{ color:'#74777E', fontWeight:'400' }}>(optional)</span>
              </label>
              <textarea
                className="form-input"
                placeholder="Any additional notes about this payment…"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                style={{ resize:'vertical', lineHeight:'1.5' }}
              />
            </div>

            {error && <div className="alert-error" style={{ marginBottom:'18px' }}>{error}</div>}
            {success && <div className="alert-success" style={{ marginBottom:'18px' }}>✓ Payment recorded successfully!</div>}

            <div style={{ display:'flex', gap:'12px', paddingTop:'4px' }}>
              <button type="submit" className="btn btn-success" style={{ flex:1, justifyContent:'center', padding:'13px' }}>
                <CheckIcon size={18} /> Record Payment
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => onNavigate('payment-history')}
                style={{ padding:'13px 20px' }}
              >
                View History
              </button>
            </div>
          </form>
        </div>
      )}

      {success && (
        <div className="toast">
          <CheckIcon size={16} /> Payment recorded successfully
        </div>
      )}
    </div>
  );
}
