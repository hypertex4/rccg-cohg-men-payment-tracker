import { useState } from 'react';
import { RCCGLogo } from './Icons';

const CRED = { email: 'admin@rccgcohg.com', password: 'Admin@2024' };

export default function Auth({ onLogin }) {
  const [email, setEmail]       = useState(CRED.email);
  const [password, setPassword] = useState(CRED.password);
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === CRED.email && password === CRED.password) {
        onLogin();
      } else {
        setError('Incorrect email or password. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0D47A1 0%, #1565C0 35%, #1976D2 65%, #2E7D32 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* decorative circles */}
      <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'220px', height:'220px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />

      <div className="card" style={{ width:'100%', maxWidth:'420px', padding:'40px 36px' }}>

        {/* Logo & Branding */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
            <RCCGLogo size={64} />
          </div>
          <div style={{ fontSize:'13px', fontWeight:'700', color:'#B71C1C', letterSpacing:'0.08em', marginBottom:'2px' }}>
            THE REDEEMED CHRISTIAN CHURCH OF GOD
          </div>
          <div style={{ fontSize:'18px', fontWeight:'800', color:'#1A202C', marginTop:'6px' }}>
            R.C.C.G C.O.H.G
          </div>
          <div style={{ fontSize:'13px', color:'#74777E', fontWeight:'500', marginTop:'2px' }}>
            Men's Fellowship
          </div>
          <div style={{
            width:'48px', height:'3px',
            background:'linear-gradient(90deg, #1976D2, #2E7D32)',
            borderRadius:'2px',
            margin:'12px auto',
          }} />
          <div style={{ fontSize:'20px', fontWeight:'700', color:'#1A202C' }}>Payment Tracker</div>
          <div style={{ fontSize:'13px', color:'#74777E', marginTop:'4px' }}>Sign in to continue</div>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'13px', color:'#374151' }}>
              Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@rccgcohg.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom:'24px' }}>
            <label style={{ display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'13px', color:'#374151' }}>
              Password
            </label>
            <div style={{ position:'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight:'52px' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer',
                  color:'#74777E', fontSize:'12px', fontWeight:'600',
                }}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && <div className="alert-error" style={{ marginBottom:'16px' }}>{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width:'100%', padding:'13px', fontSize:'15px', justifyContent:'center' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop:'20px', padding:'12px 14px',
          background:'#F8FAFC', borderRadius:'10px',
          border:'1px solid #E2E8F0',
          fontSize:'12px', color:'#74777E', textAlign:'center', lineHeight:1.7,
        }}>
          <strong>Demo login:</strong><br />
          admin@rccgcohg.com &nbsp;/&nbsp; Admin@2024
        </div>
      </div>
    </div>
  );
}
