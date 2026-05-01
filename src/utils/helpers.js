export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
export const today = () => new Date().toISOString().slice(0, 10);

export const formatAmount = (n) =>
  `₦${Number(n || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatDate = (s) => {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const REASONS = ['Monthly Levy', 'Church Project', 'Others'];

export const reasonBadge = (r) => {
  if (r === 'Monthly Levy')   return 'badge-blue';
  if (r === 'Church Project') return 'badge-green';
  return 'badge-amber';
};

export const currentYear = () => new Date().getFullYear();

export const availableYears = () => {
  const end = Math.max(currentYear(), 2026) + 1;
  const out = [];
  for (let y = 2026; y <= end; y++) out.push(y);
  return out;
};

export const filterByYear = (payments, year) =>
  year ? payments.filter(p => p.date?.startsWith(String(year))) : payments;

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
