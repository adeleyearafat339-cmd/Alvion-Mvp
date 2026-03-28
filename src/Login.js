import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      
      {/* LEFT SIDE - BRANDING */}
      <div style={{ flex: 1, backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' }}>
        
        {/* 3D RIBBON LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4 L4 28 H12 L20 12 Z" fill="#2563EB"/>
            <path d="M16 4 L28 28 H20 L12 12 Z" fill="#60A5FA"/>
            <path d="M16 4 L20 12 L12 12 Z" fill="#3B82F6"/>
          </svg>
          <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '900', letterSpacing: '-0.5px' }}>Alvion</h1>
        </div>
        
        <h2 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.2', marginBottom: '20px' }}>
          Welcome back.<br/>Let's close more deals.
        </h2>
        
        <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '400px', lineHeight: '1.6' }}>
          Access your AI pipeline and pick up right where you left off.
        </p>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '5px', color: '#0f172a' }}>Sign In</h2>
          <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '14px' }}>Enter your details to access your dashboard.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Work Email</label>
              {/* CLEAN PLACEHOLDER HERE */}
              <input type="email" placeholder="name@company.com" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Password</label>
                <button onClick={(e) => e.preventDefault()} style={{ background: 'none', border: 'none', padding: 0, color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Forgot password?</button>
              </div>
              <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' }}>
              Sign In to Alvion →
            </button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none' }}>
              Start your 7-day free trial
            </Link>
          </div>

        </div>
      </div>
      
    </div>
  );
}

export default Login;