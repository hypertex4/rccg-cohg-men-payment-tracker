import { useState } from 'react';
import {
  HomeIcon, UsersIcon, PlusCircleIcon, HistoryIcon,
  LogoutIcon, MenuIcon, CloseIcon, RCCGLogo,
  ProgramIcon, AnalyticsIcon, NoteIcon,
} from './Icons';
import { availableYears } from '../utils/helpers';

const NAV = [
  { id: 'dashboard',       label: 'Dashboard',       Icon: HomeIcon },
  { id: 'members',         label: 'Members',          Icon: UsersIcon },
  { id: 'programs',        label: 'Programs',         Icon: ProgramIcon },
  { id: 'record-payment',  label: 'Record Payment',   Icon: PlusCircleIcon },
  { id: 'payment-history', label: 'Payment History',  Icon: HistoryIcon },
  { id: 'analysis',        label: 'Analysis',         Icon: AnalyticsIcon },
  { id: 'notes',           label: 'Notes & Minutes',  Icon: NoteIcon },
];

const PAGE_TITLE = {
  dashboard:        'Dashboard',
  members:          'Members',
  programs:         'Programs',
  'record-payment': 'Record Payment',
  'payment-history':'Payment History',
  analysis:         'Analysis',
  notes:            'Notes & Minutes',
};

function SidebarInner({ page, onNavigate, onLogout, onClose }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>

      {/* Brand */}
      <div style={{
        padding:'22px 18px',
        borderBottom:'1px solid rgba(255,255,255,0.12)',
        display:'flex', alignItems:'center', gap:'12px',
      }}>
        <RCCGLogo size={44} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:'11px', fontWeight:'800', color:'white', letterSpacing:'0.06em', lineHeight:1.3 }}>
            R.C.C.G C.O.H.G
          </div>
          <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.65)', marginTop:'2px', lineHeight:1.3 }}>
            Men's Payment Tracker
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', cursor:'pointer', display:'flex' }}>
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'14px 10px', overflowY:'auto' }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => { onNavigate(id); onClose?.(); }}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:'11px',
                padding:'11px 14px', marginBottom:'3px',
                background: active ? 'rgba(255,255,255,0.16)' : 'transparent',
                border: active ? '1px solid rgba(255,255,255,0.22)' : '1px solid transparent',
                borderRadius:'10px',
                color: active ? 'white' : 'rgba(255,255,255,0.68)',
                fontSize:'14px', fontWeight: active ? '600' : '400',
                cursor:'pointer', textAlign:'left',
                transition:'all 0.15s',
              }}
            >
              <Icon size={18} />
              {label}
              {active && (
                <span style={{
                  marginLeft:'auto', width:'6px', height:'6px',
                  borderRadius:'50%', background:'#69F0AE',
                  flexShrink:0,
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding:'12px 10px', borderTop:'1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ padding:'0 14px 10px', fontSize:'11px', color:'rgba(255,255,255,0.4)', letterSpacing:'0.06em', fontWeight:'600' }}>
          ADMIN
        </div>
        <button
          onClick={onLogout}
          style={{
            width:'100%', display:'flex', alignItems:'center', gap:'11px',
            padding:'11px 14px',
            background:'rgba(255,255,255,0.06)',
            border:'1px solid rgba(255,255,255,0.14)',
            borderRadius:'10px',
            color:'rgba(255,255,255,0.68)',
            fontSize:'14px', cursor:'pointer',
            transition:'all 0.15s',
          }}
        >
          <LogoutIcon size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function Layout({ children, page, onNavigate, onLogout, year, onYearChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const years = availableYears();

  return (
    <div className="app-layout">
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <SidebarInner page={page} onNavigate={onNavigate} onLogout={onLogout} />
      </aside>

      {/* Mobile overlay */}
      <div className={`sidebar-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`sidebar-mobile${mobileOpen ? ' open' : ''}`}>
        <SidebarInner page={page} onNavigate={onNavigate} onLogout={onLogout} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main */}
      <div className="main-area">
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <button className="hamburger" onClick={() => setMobileOpen(true)}>
            <MenuIcon size={22} />
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', flex:1, minWidth:0 }}>
            <RCCGLogo size={32} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'10px', color:'#74777E', fontWeight:'600', letterSpacing:'0.05em' }}>R.C.C.G C.O.H.G</div>
              <div style={{ fontSize:'15px', fontWeight:'700', color:'#1A202C', lineHeight:1.2 }}>{PAGE_TITLE[page]}</div>
            </div>
          </div>
          <select
            value={year}
            onChange={e => onYearChange(Number(e.target.value))}
            style={{
              fontSize:'13px', fontWeight:'600', color:'#1565C0',
              border:'1.5px solid #BBDEFB', borderRadius:'8px',
              padding:'5px 8px', background:'#E3F2FD', cursor:'pointer',
              flexShrink:0,
            }}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Desktop page header bar — hidden on mobile via CSS */}
        <div className="desktop-topbar">
          <div>
            <div style={{ fontSize:'11px', color:'#74777E', fontWeight:'600', letterSpacing:'0.06em', textTransform:'uppercase' }}>
              Men's Fellowship
            </div>
            <div style={{ fontSize:'22px', fontWeight:'700', color:'#1A202C' }}>{PAGE_TITLE[page]}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <select
              value={year}
              onChange={e => onYearChange(Number(e.target.value))}
              style={{
                fontSize:'13px', fontWeight:'600', color:'#1565C0',
                border:'1.5px solid #BBDEFB', borderRadius:'8px',
                padding:'6px 10px', background:'#E3F2FD', cursor:'pointer',
              }}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#4CAF50' }} />
              <span style={{ fontSize:'13px', color:'#74777E' }}>Admin</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
