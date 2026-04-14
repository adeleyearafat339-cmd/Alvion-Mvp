import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import  API_URL  from './config';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('pro'); // Default to Pro
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, userType })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDE - DESKTOP ONLY */}
      <div className="hidden md:flex md:w-1/2 p-8 md:p-16 flex-col justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
            A
          </div>
          <h1 className="text-2xl font-bold text-white">Alvion</h1>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16213a] border border-[#25324d] text-slate-300 text-sm w-fit mb-8">
          🌍 Built for high-ticket setters worldwide
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Stop hunting for leads. <span className="text-blue-500">Start closing.</span>
        </h2>

        <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
          Find leads, generate personalized outreach, and track deals — all in one AI-powered workspace.
        </p>

        <div className="mt-10 p-6 rounded-2xl bg-[#16213a] border border-[#25324d] max-w-xl">
          <p className="text-slate-200 italic text-lg">
            “Alvion saves me 3 hours a day on lead research. The AI insights are scary accurate.”
          </p>
          <p className="text-slate-400 mt-4 text-sm">
            — Top 1% Appointment Setter
          </p>
        </div>
      </div>

      {/* RIGHT SIDE / FORM */}
      <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-4 sm:p-6 md:p-12">
        <div className="w-full max-w-md bg-[#111] p-6 sm:p-8 rounded-2xl border border-[#222] shadow-2xl">
          
          {/* MOBILE BRAND */}
          <div className="flex md:hidden items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
              A
            </div>
            <h1 className="text-2xl font-bold text-white">Alvion</h1>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Create your account
          </h3>

          <p className="text-slate-400 text-sm mb-8">
            Start your 7-day free trial. <span className="text-green-400 font-semibold">No credit card required.</span>
          </p>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Full Name</label>
                <input
                  type="text"
                  placeholder="Alex Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#222] border border-[#333] text-white focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Workspace Name</label>
                <input
                  type="text"
                  placeholder="Scaling Agency"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#222] border border-[#333] text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Work Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#222] border border-[#333] text-white focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#222] border border-[#333] text-white focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* INTEGRATED PRICING SELECTION */}
            <div className="space-y-3 pt-2">
              <label className="text-sm text-slate-400">Select Plan</label>
              
              <div className="space-y-3">
                {/* Starter */}
                <div 
                  onClick={() => setUserType('starter')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    userType === 'starter' ? 'bg-[#1e293b] border-blue-500' : 'bg-[#1a1a1a] border-[#333] hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-white font-bold">Starter <span className="text-slate-500 text-xs font-normal ml-2">Best for beginners</span></h4>
                    </div>
                    <span className="text-md font-bold text-white">Free</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-blue-500"/> 10 AI credits</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-blue-500"/> Basic lead hunting</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-blue-500"/> Limited AI insights</li>
                  </ul>
                </div>

                {/* Pro */}
                <div 
                  onClick={() => setUserType('pro')}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                    userType === 'pro' ? 'bg-[#1e293b] border-blue-500' : 'bg-[#1a1a1a] border-[#333] hover:border-slate-600'
                  }`}
                >
                  {userType === 'pro' && (
                    <div className="absolute top-0 right-0 -mr-2 -mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase bg-blue-600">
                        Selected
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-white font-bold">Pro <span className="text-slate-500 text-xs font-normal ml-2">Best for solo setters</span></h4>
                    </div>
                    <span className="text-md font-bold text-white">$79<span className="text-slate-500 text-xs font-normal">/mo</span></span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-blue-500"/> Unlimited leads</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-blue-500"/> AI message gen</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-blue-500"/> Advanced insights</li>
                  </ul>
                </div>

                {/* Agency */}
                <div 
                  onClick={() => setUserType('agency')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    userType === 'agency' ? 'bg-[#1e293b] border-blue-500' : 'bg-[#1a1a1a] border-[#333] hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-white font-bold">Agency <span className="text-slate-500 text-xs font-normal ml-2">Best for teams</span></h4>
                    </div>
                    <span className="text-md font-bold text-white">$499<span className="text-slate-500 text-xs font-normal">/mo</span></span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-blue-500"/> Multi-user access</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-blue-500"/> CRM integrations</li>
                    <li className="flex items-center gap-1.5"><Check size={14} className="text-blue-500"/> Priority AI engine</li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Creating account...' : 'Start 7-Day Free Trial'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="text-slate-500 text-sm text-center mt-6">
            Already have an account? <a href="/login" className="text-blue-500 font-semibold">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;