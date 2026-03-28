import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, Arafat!</h1>
          <p className="text-slate-500">Pipeline: 1 Active Opportunity</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition shadow-lg">
          + Add Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {['Total Leads', 'New', 'Contacted', 'Booked'].map((label, i) => (
          <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black text-slate-800 mt-2">{i === 0 || i === 1 ? '1' : '0'}</p>
          </div>
        ))}
      </div>

      {/* Main Content: The Split View */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT SIDE: YOUR TABLE (70%) */}
        <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <input 
              type="text" 
              placeholder="Search Global Niche... (e.g. Realtors in Dubai)" 
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-blue-50/50 transition cursor-pointer">
                <td className="px-6 py-6">
                  <p className="font-bold text-slate-800">Alvion SaaS Company</p>
                  <p className="text-sm text-slate-500">Prospect • JUST MAKE MONEY</p>
                </td>
                <td className="px-6 py-6">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">New</span>
                </td>
                <td className="px-6 py-6">
                  <button className="text-blue-600 font-bold text-sm hover:underline">View Insight</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE: THE AI INTELLIGENCE PANEL (30%) */}
        <div className="lg:w-1/3 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-blue-500 relative overflow-hidden">
            {/* AI Badge */}
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-3 py-1 font-black uppercase rounded-bl-lg">
              AI Powered
            </div>

            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center">
              <span className="mr-2">🧠</span> Strategic Insight
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">The Angle</p>
                <p className="text-sm text-slate-700 font-medium mt-1">
                  "This agency is scaling fast. Pitch them on **automated follow-ups** to prevent lead leakage."
                </p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">Conversion Tip</p>
                <p className="text-sm text-slate-700 font-medium mt-1">
                  High response rate on **LinkedIn** at 10 AM. Mention their recent team expansion.
                </p>
              </div>

              <button className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black text-sm transition transform hover:scale-[1.02] shadow-lg">
                GENERATE ELITE PITCH
              </button>
            </div>
          </div>

          {/* Bonus: Quick Stats Mini-Card */}
          <div className="bg-slate-900 p-6 rounded-2xl text-white">
            <p className="text-xs font-bold text-slate-400 uppercase">Success Probability</p>
            <p className="text-4xl font-black text-green-400 mt-1">88%</p>
            <p className="text-xs text-slate-400 mt-2">Based on niche & response history</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;