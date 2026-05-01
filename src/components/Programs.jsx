import { useState } from 'react';
import { ProgramIcon, EditIcon, CheckIcon, CloseIcon } from './Icons';

function DeleteIcon(p) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  );
}

export default function Programs({ programs, onAdd, onEdit, onDelete, payments }) {
  const [showForm,   setShowForm]   = useState(false);
  const [name,       setName]       = useState('');
  const [desc,       setDesc]       = useState('');
  const [editId,     setEditId]     = useState(null);
  const [editName,   setEditName]   = useState('');
  const [editDesc,   setEditDesc]   = useState('');
  const [confirmId,  setConfirmId]  = useState(null);
  const [error,      setError]      = useState('');
  const [saved,      setSaved]      = useState(false);

  const payCount = (id) => payments.filter(p => p.programId === id).length;
  const payTotal = (id) => payments.filter(p => p.programId === id).reduce((s, p) => s + Number(p.amount), 0);

  const formatAmount = (n) =>
    `₦${Number(n || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleAdd = (e) => {
    e.preventDefault();
    const t = name.trim();
    if (!t) { setError('Program name is required.'); return; }
    if (programs.some(p => p.name.toLowerCase() === t.toLowerCase())) {
      setError('A program with this name already exists.'); return;
    }
    onAdd({ name: t, description: desc.trim() });
    setName(''); setDesc(''); setError(''); setShowForm(false);
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const startEdit = (p) => {
    setEditId(p.id); setEditName(p.name); setEditDesc(p.description || '');
  };

  const saveEdit = (id) => {
    const t = editName.trim();
    if (!t) return;
    onEdit(id, { name: t, description: editDesc.trim() });
    setEditId(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', marginBottom:'20px', flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:'700', color:'#1A202C' }}>Programs</h1>
          <p style={{ fontSize:'13px', color:'#74777E', marginTop:'2px' }}>
            {programs.length} program{programs.length !== 1 ? 's' : ''} · Manage fellowship financial programs
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setError(''); }}>
          <ProgramIcon size={16} /> Add Program
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card" style={{ padding:'22px', marginBottom:'20px', border:'2px solid #E3F2FD' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
            <h3 style={{ fontSize:'15px', fontWeight:'700', color:'#1A202C' }}>New Program</h3>
            <button onClick={() => { setShowForm(false); setError(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#74777E', display:'flex' }}>
              <CloseIcon size={18} />
            </button>
          </div>
          <form onSubmit={handleAdd}>
            <div className="form-row" style={{ marginBottom:'14px' }}>
              <div>
                <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'6px' }}>
                  Program Name <span style={{ color:'#E53E3E' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Annual Convention 2026"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'6px' }}>
                  Description <span style={{ color:'#74777E', fontWeight:'400' }}>(optional)</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Brief description…"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>
            </div>
            {error && <div className="alert-error" style={{ marginBottom:'12px' }}>{error}</div>}
            <div style={{ display:'flex', gap:'10px' }}>
              <button type="submit" className="btn btn-primary"><CheckIcon size={15} /> Save</button>
              <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setError(''); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Programs List */}
      {programs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <ProgramIcon size={44} style={{ color:'#CBD5E0', display:'block', margin:'0 auto 14px' }} />
            <h3>No programs yet</h3>
            <p>Create programs to organise payments by initiative.</p>
            <button className="btn btn-primary" style={{ marginTop:'16px' }} onClick={() => setShowForm(true)}>
              Add First Program
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {[...programs].sort((a,b) => a.name.localeCompare(b.name)).map(p => (
            <div key={p.id} className="card" style={{ padding:'18px 20px' }}>
              {editId === p.id ? (
                /* Inline edit */
                <div>
                  <div className="form-row" style={{ marginBottom:'12px' }}>
                    <div>
                      <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'5px' }}>Description</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <button className="btn btn-primary" style={{ fontSize:'13px', padding:'7px 14px' }} onClick={() => saveEdit(p.id)}>
                      <CheckIcon size={14} /> Save
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize:'13px', padding:'7px 14px' }} onClick={() => setEditId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap' }}>
                  {/* Icon */}
                  <div style={{
                    width:'44px', height:'44px', borderRadius:'12px',
                    background:'#E3F2FD', color:'#1565C0',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>
                    <ProgramIcon size={20} />
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:'700', fontSize:'15px', color:'#1A202C' }}>{p.name}</div>
                    {p.description && (
                      <div style={{ fontSize:'13px', color:'#74777E', marginTop:'2px' }}>{p.description}</div>
                    )}
                    <div style={{ display:'flex', gap:'12px', marginTop:'6px', flexWrap:'wrap' }}>
                      <span className="badge badge-blue">{payCount(p.id)} payment{payCount(p.id) !== 1 ? 's' : ''}</span>
                      {payCount(p.id) > 0 && (
                        <span className="badge badge-green">{formatAmount(payTotal(p.id))}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {confirmId === p.id ? (
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', whiteSpace:'nowrap' }}>
                      <span style={{ fontSize:'12px', color:'#C62828', fontWeight:'600' }}>Delete?</span>
                      <button className="btn btn-danger" style={{ padding:'5px 10px', fontSize:'12px' }} onClick={() => { onDelete(p.id); setConfirmId(null); }}>Yes</button>
                      <button className="btn btn-ghost" style={{ padding:'5px 10px', fontSize:'12px' }} onClick={() => setConfirmId(null)}>No</button>
                    </div>
                  ) : (
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button
                        onClick={() => startEdit(p)}
                        style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 10px', borderRadius:'7px', border:'1.5px solid #E2E8F0', background:'white', color:'#4A5568', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}
                      >
                        <EditIcon size={13} /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmId(p.id)}
                        style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 10px', borderRadius:'7px', border:'1.5px solid #FFCDD2', background:'#FFEBEE', color:'#C62828', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}
                      >
                        <DeleteIcon /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {saved && (
        <div className="toast"><CheckIcon size={16} /> Program added successfully</div>
      )}
    </div>
  );
}
