import { useState } from 'react';
import { PersonAddIcon, SearchIcon, UsersIcon, CheckIcon, CloseIcon, EditIcon } from './Icons';
import { formatDate } from '../utils/helpers';

function DeleteIcon(p) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  );
}

function BanIcon(p) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69l11.21-11.21C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
    </svg>
  );
}

function EnableIcon(p) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
    </svg>
  );
}

export default function Members({ members, onAddMember, onEditMember, onDeleteMember, onToggleMember, payments }) {
  const [showForm,     setShowForm]     = useState(false);
  const [name,         setName]         = useState('');
  const [phone,        setPhone]        = useState('');
  const [search,       setSearch]       = useState('');
  const [saved,        setSaved]        = useState(false);
  const [savedMsg,     setSavedMsg]     = useState('');
  const [error,        setError]        = useState('');
  const [confirmId,    setConfirmId]    = useState(null);
  const [editId,       setEditId]       = useState(null);
  const [editName,     setEditName]     = useState('');
  const [editPhone,    setEditPhone]    = useState('');
  const [editError,    setEditError]    = useState('');

  const payCount = (id) => payments.filter(p => p.memberId === id).length;

  const displayed = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.phone || '').includes(search)
  );

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('Member name is required.'); return; }
    const dup = members.some(m => m.name.toLowerCase() === trimmed.toLowerCase());
    if (dup) { setError('A member with this name already exists.'); return; }
    onAddMember({ name: trimmed, phone: phone.trim() });
    setName(''); setPhone(''); setError('');
    setShowForm(false);
    setSavedMsg('Member added successfully');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const cancel = () => { setShowForm(false); setName(''); setPhone(''); setError(''); };

  const startEdit = (m) => {
    setEditId(m.id); setEditName(m.name); setEditPhone(m.phone || ''); setEditError('');
    setConfirmId(null);
  };
  const cancelEdit = () => { setEditId(null); setEditError(''); };
  const saveEdit = (m) => {
    const trimmed = editName.trim();
    if (!trimmed) { setEditError('Name is required.'); return; }
    const dup = members.some(x => x.id !== m.id && x.name.toLowerCase() === trimmed.toLowerCase());
    if (dup) { setEditError('Another member already has this name.'); return; }
    onEditMember(m.id, { name: trimmed, phone: editPhone.trim() });
    setEditId(null);
    setSavedMsg('Member updated successfully');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (id) => {
    onDeleteMember(id);
    setConfirmId(null);
  };

  const activeCount   = members.filter(m => !m.disabled).length;
  const disabledCount = members.filter(m =>  m.disabled).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', marginBottom:'20px', flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:'700', color:'#1A202C' }}>Members</h1>
          <p style={{ fontSize:'13px', color:'#74777E', marginTop:'2px' }}>
            {activeCount} active
            {disabledCount > 0 && <span style={{ color:'#E65100' }}> · {disabledCount} disabled</span>}
          </p>
        </div>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          <PersonAddIcon size={16} /> Add Member
        </button>
      </div>

      {/* Add Member Form */}
      {showForm && (
        <div className="card" style={{ padding:'24px', marginBottom:'20px', border:'2px solid #E3F2FD' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px' }}>
            <h3 style={{ fontSize:'15px', fontWeight:'700', color:'#1A202C' }}>Add New Member</h3>
            <button onClick={cancel} style={{ background:'none', border:'none', cursor:'pointer', color:'#74777E', display:'flex' }}>
              <CloseIcon size={18} />
            </button>
          </div>
          <form onSubmit={handleSave}>
            <div className="form-row" style={{ marginBottom:'14px' }}>
              <div>
                <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'6px' }}>
                  Full Name <span style={{ color:'#E53E3E' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Adebayo"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'12px', fontWeight:'600', color:'#374151', marginBottom:'6px' }}>
                  Phone Number <span style={{ color:'#74777E', fontWeight:'400' }}>(optional)</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 08012345678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>
            {error && <div className="alert-error" style={{ marginBottom:'14px' }}>{error}</div>}
            <div style={{ display:'flex', gap:'10px' }}>
              <button type="submit" className="btn btn-primary">
                <CheckIcon size={16} /> Save Member
              </button>
              <button type="button" className="btn btn-ghost" onClick={cancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {members.length > 0 && (
        <div style={{ position:'relative', marginBottom:'16px', maxWidth:'360px' }}>
          <SearchIcon size={16} style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color:'#B0BEC5' }} />
          <input
            type="search"
            className="form-input"
            placeholder="Search by name or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft:'38px' }}
          />
        </div>
      )}

      {/* Members List */}
      {members.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <UsersIcon size={48} style={{ color:'#CBD5E0', display:'block', margin:'0 auto 14px' }} />
            <h3>No members yet</h3>
            <p>Add your first member to get started.</p>
            <button className="btn btn-primary" style={{ marginTop:'16px' }} onClick={() => setShowForm(true)}>
              <PersonAddIcon size={16} /> Add First Member
            </button>
          </div>
        </div>
      ) : displayed.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <SearchIcon size={40} style={{ color:'#CBD5E0', display:'block', margin:'0 auto 14px' }} />
            <h3>No results</h3>
            <p>No members match "{search}"</p>
          </div>
        </div>
      ) : (
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #EDF2F7', fontSize:'13px', color:'#74777E', fontWeight:'500' }}>
            {displayed.length} member{displayed.length !== 1 ? 's' : ''}{search ? ' found' : ''}
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Payments</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((m, i) => {
                  const isDisabled = !!m.disabled;
                  const isConfirming = confirmId === m.id;
                  const isEditing = editId === m.id;

                  if (isEditing) {
                    return (
                      <tr key={m.id}>
                        <td style={{ color:'#A0AEC0', fontSize:'13px' }}>{i + 1}</td>
                        <td colSpan={4}>
                          <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap', padding:'4px 0' }}>
                            <input
                              type="text"
                              className="form-input"
                              value={editName}
                              onChange={e => { setEditName(e.target.value); setEditError(''); }}
                              placeholder="Full name"
                              style={{ flex:'1', minWidth:'120px', padding:'7px 10px', fontSize:'13px' }}
                              autoFocus
                            />
                            <input
                              type="tel"
                              className="form-input"
                              value={editPhone}
                              onChange={e => setEditPhone(e.target.value)}
                              placeholder="Phone (optional)"
                              style={{ flex:'1', minWidth:'130px', padding:'7px 10px', fontSize:'13px' }}
                            />
                            {editError && (
                              <span style={{ fontSize:'12px', color:'#C62828', fontWeight:'600' }}>{editError}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:'6px' }}>
                            <button
                              className="btn btn-primary"
                              style={{ padding:'6px 12px', fontSize:'12px' }}
                              onClick={() => saveEdit(m)}
                            >
                              <CheckIcon size={13} /> Save
                            </button>
                            <button
                              className="btn btn-ghost"
                              style={{ padding:'6px 10px', fontSize:'12px' }}
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={m.id} style={{ cursor:'default', opacity: isDisabled ? 0.65 : 1 }}>
                      <td style={{ color:'#A0AEC0', fontSize:'13px', width:'40px' }}>{i + 1}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{
                            width:'34px', height:'34px', borderRadius:'50%',
                            background: isDisabled ? '#F5F5F5' : '#E3F2FD',
                            color: isDisabled ? '#9E9E9E' : '#1565C0',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontWeight:'700', fontSize:'13px', flexShrink:0,
                          }}>
                            {m.name.trim()[0]?.toUpperCase()}
                          </div>
                          <span style={{
                            fontWeight:'600',
                            textDecoration: isDisabled ? 'line-through' : 'none',
                            color: isDisabled ? '#9E9E9E' : '#1A202C',
                          }}>
                            {m.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ color:'#74777E' }}>{m.phone || <span style={{ color:'#CBD5E0' }}>—</span>}</td>
                      <td>
                        <span className={`badge ${payCount(m.id) > 0 ? 'badge-blue' : 'badge-gray'}`}>
                          {payCount(m.id)} payment{payCount(m.id) !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        {isDisabled
                          ? <span className="badge badge-amber">Disabled</span>
                          : <span className="badge badge-green">Active</span>
                        }
                      </td>
                      <td>
                        {isConfirming ? (
                          <div style={{ display:'flex', alignItems:'center', gap:'6px', whiteSpace:'nowrap' }}>
                            <span style={{ fontSize:'12px', color:'#C62828', fontWeight:'600' }}>Delete?</span>
                            <button
                              className="btn btn-danger"
                              style={{ padding:'5px 10px', fontSize:'12px' }}
                              onClick={() => handleDelete(m.id)}
                            >
                              Yes
                            </button>
                            <button
                              className="btn btn-ghost"
                              style={{ padding:'5px 10px', fontSize:'12px' }}
                              onClick={() => setConfirmId(null)}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div style={{ display:'flex', gap:'6px' }}>
                            {/* Edit */}
                            <button
                              title="Edit member"
                              onClick={() => startEdit(m)}
                              style={{
                                display:'flex', alignItems:'center', gap:'5px',
                                padding:'6px 10px', borderRadius:'7px',
                                border:'1.5px solid #E2E8F0',
                                background:'white', color:'#4A5568',
                                cursor:'pointer', fontSize:'12px', fontWeight:'600',
                              }}
                            >
                              <EditIcon size={13} /> Edit
                            </button>

                            {/* Disable / Enable toggle */}
                            <button
                              title={isDisabled ? 'Enable member' : 'Disable member'}
                              onClick={() => onToggleMember(m.id)}
                              style={{
                                display:'flex', alignItems:'center', gap:'5px',
                                padding:'6px 10px', borderRadius:'7px',
                                border: isDisabled ? '1.5px solid #2E7D32' : '1.5px solid #E65100',
                                background: isDisabled ? '#E8F5E9' : '#FFF3E0',
                                color: isDisabled ? '#2E7D32' : '#E65100',
                                cursor:'pointer', fontSize:'12px', fontWeight:'600',
                                whiteSpace:'nowrap',
                              }}
                            >
                              {isDisabled ? <><EnableIcon /> Enable</> : <><BanIcon /> Disable</>}
                            </button>

                            {/* Delete */}
                            <button
                              title="Delete member"
                              onClick={() => setConfirmId(m.id)}
                              style={{
                                display:'flex', alignItems:'center', gap:'5px',
                                padding:'6px 10px', borderRadius:'7px',
                                border:'1.5px solid #FFCDD2',
                                background:'#FFEBEE', color:'#C62828',
                                cursor:'pointer', fontSize:'12px', fontWeight:'600',
                              }}
                            >
                              <DeleteIcon /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {saved && (
        <div className="toast">
          <CheckIcon size={16} /> {savedMsg}
        </div>
      )}
    </div>
  );
}
