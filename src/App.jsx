import { useState } from 'react';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import RecordPayment from './components/RecordPayment';
import PaymentHistory from './components/PaymentHistory';
import Programs from './components/Programs';
import Analysis from './components/Analysis';
import {
  getMembers, saveMembers,
  getPayments, savePayments,
  getPrograms, savePrograms,
  getSession, setSession, clearSession,
} from './utils/storage';
import { uid } from './utils/helpers';

export default function App() {
  const [loggedIn,  setLoggedIn]  = useState(getSession);
  const [page,      setPage]      = useState('dashboard');
  const [members,   setMembers]   = useState(getMembers);
  const [payments,  setPayments]  = useState(getPayments);
  const [programs,  setPrograms]  = useState(getPrograms);
  const [year,      setYear]      = useState(() => {
    const s = localStorage.getItem('rccg_year');
    return s ? Number(s) : new Date().getFullYear();
  });

  const login  = () => { setSession(); setLoggedIn(true); };
  const logout = () => { clearSession(); setLoggedIn(false); setPage('dashboard'); };

  const changeYear = (y) => { setYear(y); localStorage.setItem('rccg_year', String(y)); };

  // Members
  const addMember    = (m) => { const u = [...members, { ...m, id: uid(), createdAt: new Date().toISOString() }]; setMembers(u); saveMembers(u); };
  const editMember   = (id, data) => { const u = members.map(m => m.id === id ? { ...m, ...data } : m); setMembers(u); saveMembers(u); };
  const deleteMember = (id) => { const u = members.filter(m => m.id !== id); setMembers(u); saveMembers(u); };
  const toggleMember = (id) => { const u = members.map(m => m.id === id ? { ...m, disabled: !m.disabled } : m); setMembers(u); saveMembers(u); };

  // Payments
  const addPayment = (p) => { const u = [...payments, { ...p, id: uid(), createdAt: new Date().toISOString() }]; setPayments(u); savePayments(u); };

  // Programs
  const addProgram    = (p) => { const u = [...programs, { ...p, id: uid(), createdAt: new Date().toISOString() }]; setPrograms(u); savePrograms(u); };
  const editProgram   = (id, data) => { const u = programs.map(p => p.id === id ? { ...p, ...data } : p); setPrograms(u); savePrograms(u); };
  const deleteProgram = (id) => { const u = programs.filter(p => p.id !== id); setPrograms(u); savePrograms(u); };

  if (!loggedIn) return <Auth onLogin={login} />;

  const pages = {
    dashboard:        <Dashboard payments={payments} members={members} programs={programs} onNavigate={setPage} year={year} />,
    members:          <Members members={members} onAddMember={addMember} onEditMember={editMember} onDeleteMember={deleteMember} onToggleMember={toggleMember} payments={payments} />,
    programs:         <Programs programs={programs} onAdd={addProgram} onEdit={editProgram} onDelete={deleteProgram} payments={payments} />,
    'record-payment': <RecordPayment members={members} programs={programs} onAddPayment={addPayment} onNavigate={setPage} />,
    'payment-history':<PaymentHistory payments={payments} members={members} programs={programs} year={year} />,
    analysis:         <Analysis payments={payments} members={members} programs={programs} year={year} />,
  };

  return (
    <Layout page={page} onNavigate={setPage} onLogout={logout} year={year} onYearChange={changeYear}>
      {pages[page] ?? pages.dashboard}
    </Layout>
  );
}
