import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import  API_URL  from './config';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // THE MONEY MOVE: Saving the secure token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
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
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
            A
          </div>
          <h1 className="text-2xl font-bold text-white">Alvion</h1>
        </div>

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          Stop hunting for leads. <span className="text-blue-500">Start closing.</span>
        </h2>

        <p className="text-slate-400 text-lg md:text-xl max-w-md">
          The AI-powered workspace built for high-ticket appointment setters.
        </p>
      </div>

      <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-[#222] shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-2">Welcome back</h3>
          <p className="text-slate-500 text-sm mb-8">
            Enter your details to access your workspace
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="text-slate-500 text-sm text-center mt-6">
            Don’t have an account? <a href="/" className="text-blue-500 font-semibold">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;