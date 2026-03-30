import React from 'react';
import { ArrowRight, Github, Chrome } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col md:flex-row font-sans">
      {/* Left Side: Branding - Hidden or Simplified on small mobile if needed, but here we stack it */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">A</div>
          <h1 className="text-2xl font-bold text-white">Alvion</h1>
        </div>
        
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          Stop hunting for leads. <span className="text-blue-500">Start closing.</span>
        </h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-md">
          The AI-powered workspace built for high-ticket appointment setters.
        </p>
      </div>

      {/* Right Side: The Form - Full width on mobile, half on desktop */}
      <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-[#222] shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-2">Welcome back</h3>
          <p className="text-slate-500 text-sm mb-8">Enter your details to access your workspace</p>

          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Work Email</label>
              <input type="email" className="w-full p-3 rounded-lg bg-[#222] border border-[#333] text-white focus:border-blue-500 outline-none transition-all" placeholder="name@company.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Password</label>
              <input type="password" className="w-full p-3 rounded-lg bg-[#222] border border-[#333] text-white focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
            </div>
            
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
              Sign In <ArrowRight size={20} />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#333]"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#111] px-2 text-slate-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#222] border border-[#333] text-white hover:bg-[#2a2a2a] transition-all"><Github size={18}/> GitHub</button>
            <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#222] border border-[#333] text-white hover:bg-[#2a2a2a] transition-all"><Chrome size={18}/> Google</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;