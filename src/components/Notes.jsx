import { useState, useMemo, useRef, useEffect } from 'react';
import { NoteIcon, BackIcon, SearchIcon, CheckIcon, CloseIcon } from './Icons';
import { uid, formatDate } from '../utils/helpers';

function DeleteIcon(p) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  );
}

function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function Notes({ notes, onAdd, onEdit, onDelete }) {
  const [view,        setView]        = useState('list'); // 'list' | 'editor'
  const [activeNote,  setActiveNote]  = useState(null);  // null = new note
  const [title,       setTitle]       = useState('');
  const [body,        setBody]        = useState('');
  const [search,      setSearch]      = useState('');
  const [confirmId,   setConfirmId]   = useState(null);
  const [saved,       setSaved]       = useState(false);
  const [savedMsg,    setSavedMsg]    = useState('');
  const [titleError,  setTitleError]  = useState('');
  const bodyRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [body]);

  const openNew = () => {
    setActiveNote(null);
    setTitle('');
    setBody('');
    setTitleError('');
    setView('editor');
  };

  const openExisting = (note) => {
    setActiveNote(note);
    setTitle(note.title);
    setBody(note.body);
    setTitleError('');
    setView('editor');
  };

  const backToList = () => {
    setView('list');
    setActiveNote(null);
    setConfirmId(null);
  };

  const handleSave = () => {
    const t = title.trim();
    if (!t) { setTitleError('Please enter a title.'); return; }
    const now = new Date().toISOString();
    if (activeNote) {
      onEdit({ ...activeNote, title: t, body: body.trim(), updatedAt: now });
      setSavedMsg('Note updated');
    } else {
      onAdd({ id: uid(), title: t, body: body.trim(), createdAt: now, updatedAt: now });
      setSavedMsg('Note saved');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    backToList();
  };

  const handleDelete = (id) => {
    onDelete(id);
    setConfirmId(null);
    if (view === 'editor') backToList();
  };

  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    return [...notes]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .filter(n =>
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q)
      );
  }, [notes, search]);

  // ── EDITOR VIEW ──────────────────────────────────────────────
  if (view === 'editor') {
    const isNew = !activeNote;
    const wc = wordCount(body);

    return (
      <div style={{ maxWidth: '720px' }}>
        {/* Editor header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '10px', marginBottom: '20px', flexWrap: 'wrap',
        }}>
          <button
            className="btn btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            onClick={backToList}
          >
            <BackIcon size={16} /> All Notes
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {!isNew && confirmId === activeNote.id ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: '#C62828', fontWeight: '600' }}>Delete?</span>
                <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDelete(activeNote.id)}>Yes</button>
                <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => setConfirmId(null)}>No</button>
              </div>
            ) : (
              <>
                {!isNew && (
                  <button
                    className="btn btn-ghost"
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#C62828', borderColor: '#FFCDD2' }}
                    onClick={() => setConfirmId(activeNote.id)}
                  >
                    <DeleteIcon /> Delete
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={handleSave}
                >
                  <CheckIcon size={16} /> {isNew ? 'Save Note' : 'Update'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Editor card */}
        <div className="card" style={{ padding: '24px 26px' }}>
          {/* Title */}
          <div style={{ marginBottom: '18px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Note title (e.g. Men's Meeting — May 2026)"
              value={title}
              onChange={e => { setTitle(e.target.value); setTitleError(''); }}
              autoFocus={isNew}
              style={{ fontSize: '17px', fontWeight: '700', padding: '10px 14px' }}
            />
            {titleError && (
              <div style={{ fontSize: '12px', color: '#C62828', marginTop: '5px', fontWeight: '600' }}>{titleError}</div>
            )}
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {activeNote && (
              <span style={{ fontSize: '12px', color: '#74777E' }}>
                Created {formatDateTime(activeNote.createdAt)}
              </span>
            )}
            {activeNote && activeNote.updatedAt !== activeNote.createdAt && (
              <span style={{ fontSize: '12px', color: '#74777E' }}>
                · Edited {formatDateTime(activeNote.updatedAt)}
              </span>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#EDF2F7', marginBottom: '18px' }} />

          {/* Body */}
          <textarea
            ref={bodyRef}
            className="form-input"
            placeholder={
              'Write your notes here…\n\n' +
              'Tip: on Android, open your keyboard settings and switch to the Handwriting input mode to write with your finger or stylus and have it converted to text automatically.'
            }
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{
              resize: 'none',
              minHeight: '280px',
              lineHeight: '1.8',
              fontSize: '15px',
              padding: '12px 14px',
              overflow: 'hidden',
            }}
          />

          {/* Word / char count */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '12px', color: '#A0AEC0' }}>{wc} word{wc !== 1 ? 's' : ''}</span>
            <span style={{ fontSize: '12px', color: '#A0AEC0' }}>{body.length} chars</span>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', marginBottom: '20px', flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1A202C' }}>Notes & Minutes</h1>
          <p style={{ fontSize: '13px', color: '#74777E', marginTop: '2px' }}>
            {notes.length} note{notes.length !== 1 ? 's' : ''} · Meeting minutes and session records
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <NoteIcon size={16} /> New Note
        </button>
      </div>

      {/* Search */}
      {notes.length > 0 && (
        <div style={{ position: 'relative', marginBottom: '16px', maxWidth: '380px' }}>
          <SearchIcon size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#B0BEC5' }} />
          <input
            type="search"
            className="form-input"
            placeholder="Search notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      )}

      {/* Empty state */}
      {notes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <NoteIcon size={44} style={{ color: '#CBD5E0', display: 'block', margin: '0 auto 14px' }} />
            <h3>No notes yet</h3>
            <p>Record meeting minutes and session notes here.</p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={openNew}>
              <NoteIcon size={15} /> Write First Note
            </button>
          </div>
        </div>
      ) : displayed.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <SearchIcon size={40} style={{ color: '#CBD5E0', display: 'block', margin: '0 auto 14px' }} />
            <h3>No results</h3>
            <p>No notes match "{search}"</p>
            <button className="btn btn-ghost" style={{ marginTop: '12px', fontSize: '13px' }} onClick={() => setSearch('')}>
              <CloseIcon size={14} /> Clear search
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayed.map(n => {
            const preview = n.body.trim().replace(/\s+/g, ' ').slice(0, 120);
            const isConfirming = confirmId === n.id;
            return (
              <div
                key={n.id}
                className="card"
                style={{ padding: '18px 20px', cursor: 'pointer' }}
                onClick={() => !isConfirming && openExisting(n)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  {/* Icon + content */}
                  <div style={{ display: 'flex', gap: '14px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: '#E3F2FD', color: '#1565C0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <NoteIcon size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: '#1A202C', marginBottom: '4px' }}>
                        {n.title}
                      </div>
                      {preview && (
                        <div style={{
                          fontSize: '13px', color: '#74777E', lineHeight: '1.5',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {preview}{n.body.length > 120 ? '…' : ''}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#A0AEC0', marginTop: '6px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <span>{formatDate(n.updatedAt.slice(0, 10))}</span>
                        <span>{wordCount(n.body)} words</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete action */}
                  <div onClick={e => e.stopPropagation()}>
                    {isConfirming ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '12px', color: '#C62828', fontWeight: '600' }}>Delete?</span>
                        <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => handleDelete(n.id)}>Yes</button>
                        <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => setConfirmId(null)}>No</button>
                      </div>
                    ) : (
                      <button
                        style={{
                          display: 'flex', alignItems: 'center', padding: '6px 8px',
                          borderRadius: '7px', border: '1.5px solid #FFCDD2',
                          background: '#FFEBEE', color: '#C62828', cursor: 'pointer',
                        }}
                        onClick={() => setConfirmId(n.id)}
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
