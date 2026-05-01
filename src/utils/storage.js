// v3 key adds phone numbers to existing seed members + 3 new members
const K = {
  MEMBERS:  'rccg_members_v3',
  PAYMENTS: 'rccg_payments_v2',
  PROGRAMS: 'rccg_programs',
  SESSION:  'rccg_session',
};

const parse = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

const SEED_MEMBERS = [
  { id:'seed0',  name:'Bro Ayo',          phone:'07067139018' },
  { id:'seed1',  name:'Bro Charles',       phone:'08063085659' },
  { id:'seed2',  name:'Bro Declan',        phone:'08106453004' },
  { id:'seed3',  name:'Bro Femi',          phone:'08028593242' },
  { id:'seed4',  name:'Bro Justine',       phone:'' },
  { id:'seed5',  name:'Bro Lawal',         phone:'08032447753' },
  { id:'seed6',  name:'Bro Lawrence',      phone:'08067022990' },
  { id:'seed7',  name:'Bro Odunsi',        phone:'08179765833' },
  { id:'seed8',  name:'Bro Simon',         phone:'09062868993' },
  { id:'seed9',  name:'Daddy Faniwaye',    phone:'08171319832' },
  { id:'seed10', name:'Dcn. Ken',          phone:'08056022515' },
  { id:'seed11', name:'Dcn. Pelumi',       phone:'08062185562' },
  { id:'seed12', name:'Bro Elijah',        phone:'08034221074' },
  { id:'seed13', name:'Bro Duru',          phone:'07038641414' },
  { id:'seed14', name:'Bro Christopher',   phone:'08061334900' },
];

export const getMembers = () => {
  const stored = parse(K.MEMBERS, null);
  if (stored === null) {
    const seeded = SEED_MEMBERS.map(m => ({
      ...m,
      createdAt: new Date('2026-01-01T00:00:00').toISOString(),
    }));
    localStorage.setItem(K.MEMBERS, JSON.stringify(seeded));
    return seeded;
  }
  return stored;
};

export const saveMembers  = (d) => localStorage.setItem(K.MEMBERS,  JSON.stringify(d));
export const getPayments  = () => parse(K.PAYMENTS, []);
export const savePayments = (d) => localStorage.setItem(K.PAYMENTS, JSON.stringify(d));
export const getPrograms  = () => parse(K.PROGRAMS, []);
export const savePrograms = (d) => localStorage.setItem(K.PROGRAMS, JSON.stringify(d));
export const getSession   = () => localStorage.getItem(K.SESSION) === '1';
export const setSession   = ()  => localStorage.setItem(K.SESSION, '1');
export const clearSession = ()  => localStorage.removeItem(K.SESSION);
