import React from 'react';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

const Login = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Main Container: Becomes vertical on mobile */}
      <div style={{ display: 'flex', flex: 1, flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
        
        {/* Left Side: Branding */}
        <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Alvion</h1>
          </div>
          
          <h2 style={{ fontSize: window.innerWidth < 768 ? '32px' : '48px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px' }}>
            Stop hunting for leads. <span style={{ color: '#3b82f6' }}>Start closing.</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '400px' }}>
            The AI-powered workspace for high-ticket appointment setters.
          </p>
        </div>

        {/* Right Side: The Form */}
        <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#111', padding: '32px', borderRadius: '16px', border: '1px solid #222' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Create your account</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Start your 7-day free trial via <span style={{color: '#6366f1', fontWeight: 'bold'}}>Stripe</span></p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Full Name" style={{ padding: '12px', borderRadius: '8px', background: '#222', border: '1px solid #333', color: 'white' }} />
              <input type="email" placeholder="Work Email" style={{ padding: '12px', borderRadius: '8px', background: '#222', border: '1px solid #333', color: 'white' }} />
              <input type="password" placeholder="Password" style={{ padding: '12px', borderRadius: '8px', background: '#222', border: '1px solid #333', color: 'white' }} />
              
              <button style={{ padding: '14px', borderRadius: '8px', background: '#3b82f6', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Start 7-Day Free Trial <ArrowRight size={18} />
              </button>
            </form>

            <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
              <span style={{ color: '#666', fontSize: '12px' }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#222', border: '1px solid #333', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                <Github size={18} /> Github
              </button>
              <button style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#222', border: '1px solid #333', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                <Chrome size={18} /> Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;