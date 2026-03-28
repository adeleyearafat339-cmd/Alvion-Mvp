import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      
      {/* LEFT SIDE - BRANDING & SOCIAL PROOF */}
      <div style={{ flex: 1, backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' }}>
        
        <div style={{ marginBottom: '30px' }}>
          <span style={{ backgroundColor: '#1e293b', color: '#94a3b8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #334155' }}>
            🌍 Built for high-ticket setters worldwide
          </span>
        </div>

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
          Stop hunting for leads.<br/>Start closing high-ticket deals.
        </h2>
        
        <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '480px', lineHeight: '1.6', marginBottom: '40px' }}>
          Find leads, generate personalized outreach, and track deals — all in one AI-powered workspace.
        </p>
        
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #3b82f6', maxWidth: '400px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontStyle: 'italic', color: '#cbd5e1' }}>
            "Alvion saves me 3 hours a day on lead research. The AI insights are scary accurate."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>JD</div>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>— Top 1% Appointment Setter</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - SIGN UP FORM */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '440px', backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '5px', color: '#0f172a', fontSize: '28px' }}>Create your account</h2>
          
          <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '14px' }}>
            Start your 7-day free trial. <strong style={{ color: '#10b981', backgroundColor: '#dcfce3', padding: '2px 6px', borderRadius: '4px' }}>No credit card required.</strong>
          </p>
          
          <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Full Name</label>
                <input type="text" placeholder="Alex Carter" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Workspace Name</label>
                <input type="text" placeholder="Scaling Agency" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Work Email</label>
              <input type="email" placeholder="name@company.com" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Password</label>
              <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              Start 7-Day Free Trial →
            </button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none' }}>
              Sign in here
            </Link>
          </div>

        </div>
      </div>
      
    </div>
  );
}

export default Signup;