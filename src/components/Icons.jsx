import { useState } from 'react';

const I = ({ d, size = 20, vb = '0 0 24 24', ...p }) => (
  <svg width={size} height={size} viewBox={vb} fill="currentColor" {...p}>
    <path d={d} />
  </svg>
);

export const HomeIcon        = (p) => <I {...p} d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />;
export const UsersIcon       = (p) => <I {...p} d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />;
export const PlusCircleIcon  = (p) => <I {...p} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />;
export const HistoryIcon     = (p) => <I {...p} d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />;
export const LogoutIcon      = (p) => <I {...p} d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />;
export const MenuIcon        = (p) => <I {...p} d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />;
export const CloseIcon       = (p) => <I {...p} d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />;
export const SearchIcon      = (p) => <I {...p} d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />;
export const CheckIcon       = (p) => <I {...p} d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />;
export const PersonAddIcon   = (p) => <I {...p} d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
export const MoneyIcon       = (p) => <I {...p} d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />;
export const FilterIcon      = (p) => <I {...p} d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />;
export const CalendarIcon    = (p) => <I {...p} d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />;
export const ArrowRightIcon  = (p) => <I {...p} d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />;
export const EditIcon        = (p) => <I {...p} d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />;
export const AnalyticsIcon   = (p) => <I {...p} d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />;
export const ProgramIcon     = (p) => <I {...p} d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />;
export const TrendIcon       = (p) => <I {...p} d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />;

export function RCCGLogo({ size = 52 }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src="/logo.png"
        alt="RCCG Logo"
        width={size}
        height={size}
        style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="26" r="26" fill="#B71C1C" />
      <circle cx="26" cy="26" r="23" fill="none" stroke="gold" strokeWidth="1.2" />
      <circle cx="26" cy="26" r="19" fill="#8B0000" />
      <ellipse cx="26" cy="26" rx="7" ry="5" fill="white" opacity="0.95" />
      <path d="M19 26 C15 22 14 28 19 27" fill="white" opacity="0.9" />
      <path d="M33 26 C37 22 38 28 33 27" fill="white" opacity="0.9" />
      <circle cx="26" cy="21.5" r="3.5" fill="white" />
      <ellipse cx="26" cy="17" rx="5" ry="2.2" fill="none" stroke="gold" strokeWidth="1.4" />
      <polygon points="26,13 26.7,15.3 29.1,15.3 27.2,16.7 27.9,19 26,17.6 24.1,19 24.8,16.7 22.9,15.3 25.3,15.3" fill="gold" />
      <line x1="26" y1="31" x2="26" y2="39" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="34" x2="30" y2="34" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="26" r="1.2" fill="gold" />
      <circle cx="42" cy="26" r="1.2" fill="gold" />
      <circle cx="26" cy="10" r="1.2" fill="gold" />
      <circle cx="26" cy="42" r="1.2" fill="gold" />
    </svg>
  );
}
