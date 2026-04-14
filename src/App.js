/* ==========================================================================
   DO NOT CHANGE: This file must remain as a monolithic MVP to facilitate
   rapid updates to core features like CSV parsing and the Hunter tool.
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Plus,
  Zap,
  MoreHorizontal,
  Menu,
  Target,
  X,
  ArrowUpRight,
  Check,
  Clock,
  Download
} from 'lucide-react';
import Signup from './Signup';
import Login from './Login';
import './App.css';
import API_URL from './config';

/* ================= DASHBOARD ================= */

function Dashboard() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [leads, setLeads] = useState([]);
  const [credits, setCredits] = useState(10);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualLead, setManualLead] = useState({ contactPerson: '', companyName: '', email: '' });

  const [searchQuery, setSearchQuery] = useState('');
  const [isHunting, setIsHunting] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [selectedInsightLead, setSelectedInsightLead] = useState(null);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  /* ===== SCREEN DETECTION ===== */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ===== AUTH CHECK ===== */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  /* ===== CREDITS STORAGE ===== */
  useEffect(() => {
    const saved = localStorage.getItem('credits');
    if (saved) setCredits(Number(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('credits', credits);
  }, [credits]);

  /* ===== FETCH LEADS ===== */
  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/leads`, {
        headers: {
          'x-auth-token': token
        }
      });
      const data = await res.json();
      if (res.ok) {
        setLeads(data);
      } else {
        console.error(data.msg || 'Failed to fetch leads');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ===== CSV IMPORT ===== */
  const handleImportCSV = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv, text/csv, text/plain, .txt';

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvText = event.target.result;
        const lines = csvText.split(/\r?\n/);
        const token = localStorage.getItem('token');
        let importCount = 0;

        const importPromises = lines.slice(1).map(async (line) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return;

          const parts = trimmedLine.split(',');
          const name = parts[0]?.trim();
          const company = parts[1]?.trim();
          const email = parts[2]?.trim();

          if (name || company) {
            try {
              const res = await fetch(`${API_URL}/api/leads`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': token
                },
                body: JSON.stringify({
                  contactPerson: name || 'Unknown',
                  companyName: company || 'Unknown Company',
                  email: email || 'unknown@example.com',
                  status: 'New'
                })
              });
              if (res.ok) importCount++;
            } catch (err) {
              console.error('Single row export failed:', err);
            }
          }
        });

        await Promise.all(importPromises);

        if (importCount > 0) {
          alert(`Successfully exported ${importCount} leads to database!`);
          await fetchLeads();
        } else {
          alert('Import failed. Ensure your file is a CSV with: Name, Company, Email');
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  /* ===== EXPORT CURRENT LEADS TO CSV ===== */
  const handleExportCSV = () => {
    if (!leads || leads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = ['Contact Person', 'Company Name', 'Email', 'Status', 'Notes', 'Pitch', 'Source', 'Date'];
    const escapeCsv = (value) => `"${String(value || '').replace(/"/g, '""')}"`;
    const rows = leads.map((lead) => [
      lead.contactPerson,
      lead.companyName,
      lead.email,
      lead.status,
      lead.notes,
      lead.pitch,
      lead.source,
      lead.date ? new Date(lead.date).toISOString() : ''
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'alvion-leads-export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* ===== HUNT LEADS ===== */
  const handleHunt = async () => {
    if (!searchQuery.trim()) return;
    setIsHunting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/hunter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ query: searchQuery })
      });

      const found = await res.json();

      if (res.ok) {
        setLeads(prev => {
          const combined = [...found, ...prev];
          return combined.filter(
            (lead, index, self) =>
              index === self.findIndex(l => l._id === lead._id)
          );
        });
        setSearchQuery('');
      } else {
        alert(found.msg || 'Failed to hunt leads');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while hunting leads');
    } finally {
      setIsHunting(false);
    }
  };

  /* ===== MANUAL LEAD ADD ===== */
  const handleAddManualLead = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          contactPerson: manualLead.contactPerson || 'Prospect',
          companyName: manualLead.companyName || 'Unknown Company',
          email: manualLead.email?.trim() || 'unknown@example.com',
          notes: '',
          status: 'New'
        })
      });

      const data = await res.json();

      if (res.ok) {
        setLeads(prev => [data, ...prev]);
        setIsManualModalOpen(false);
        setManualLead({ contactPerson: '', companyName: '', email: '' });
        alert('Manual Lead Added Successfully!');
        fetchLeads();
      } else {
        console.error('Add lead backend error:', data);
        alert(data.msg || data.message || 'Failed to save lead to database.');
      }
    } catch (err) {
      console.error('Manual lead network error:', err);
      alert(`Network/API error: ${err.message}`);
    }
  };

  /* ===== DELETE LEAD ===== */
  const handleDeleteLead = async (e, leadId) => {
    e.stopPropagation();

    const token = localStorage.getItem('token');
    const confirmDelete = window.confirm('Are you sure you want to delete this lead?');

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/leads/${leadId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      const data = await res.json();

      if (res.ok) {
        setLeads(prev => prev.filter(lead => lead._id !== leadId));
        if (selectedInsightLead && selectedInsightLead._id === leadId) {
          setSelectedInsightLead(null);
        }
        alert('Lead deleted successfully!');
      } else {
        alert(data.msg || data.message || 'Failed to delete lead.');
      }
    } catch (err) {
      console.error('Delete lead error:', err);
      alert(`Delete error: ${err.message}`);
    }
  };

  /* ===== CYCLE LEAD STATUS ===== */
  const handleStatusCycle = async (e, leadId, currentStatus) => {
    e.stopPropagation();
    const statusSequence = ['New', 'Contacted', 'Replied', 'Booked'];
    let currentIndex = statusSequence.findIndex(s => s.toLowerCase() === (currentStatus || 'New').toLowerCase());
    if (currentIndex === -1) currentIndex = 0;
    const nextIndex = (currentIndex + 1) % statusSequence.length;
    const nextStatus = statusSequence[nextIndex];

    setLeads(prev => prev.map(lead =>
      lead._id === leadId ? { ...lead, status: nextStatus } : lead
    ));

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (err) {
      console.error('Failed to save status to backend', err);
    }
  };

  /* ===== ANALYZE LEAD ===== */
  const analyzeLead = (lead) => {
    const angles = [
      'Focus on fast response time.',
      'Personalize outreach message.',
      'Automate follow-ups.',
      'Good fit for AI qualification.'
    ];

    setSelectedInsightLead({
      ...lead,
      insightScore: Math.floor(Math.random() * 20) + 75,
      insightAngle: angles[Math.floor(Math.random() * angles.length)]
    });
  };

  /* ===== GENERATE INITIAL PITCH ===== */
  const handleGenerateMessage = (e, lead) => {
    e.stopPropagation();

    if (credits <= 0) {
      setGeneratedPitch('');
      setIsUpgradeModalOpen(true);
      return;
    }

    const msg = `Hey ${lead.contactPerson || 'there'},\n\nI noticed ${lead.companyName} online and love what you're doing. I have an idea to help you get more leads and automate your appointment setting.\n\nOpen to a quick 5-minute chat?\n\nBest,\nArafat`;

    setCredits(prev => prev - 1);
    setGeneratedPitch(msg);
    setIsPitchModalOpen(true);
  };

  /* ===== GENERATE FOLLOW-UP ===== */
  const handleFollowUp = (e, lead) => {
    e.stopPropagation();

    if (credits <= 0) {
      setGeneratedPitch('');
      setIsUpgradeModalOpen(true);
      return;
    }

    const msg = `Hey ${lead.contactPerson || 'there'},\n\nJust bubbling this up to the top of your inbox. I know things get busy!\n\nLet me know if you have 5 minutes this week to discuss how we can scale ${lead.companyName}'s outreach.\n\nBest,\nArafat`;

    setCredits(prev => prev - 1);
    setGeneratedPitch(msg);
    setIsPitchModalOpen(true);
  };

  /* ===== LOGOUT ===== */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  /* ===== STATUS COLORS ===== */
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'contacted':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'replied':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'booked':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  /* ===== NAVIGATION HANDLER ===== */
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed md:static shrink-0 bg-[#1e293b] text-white flex flex-col h-screen transition-all duration-300 z-50 ${
          isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:w-0 md:hidden'
        }`}
      >
        <div className="p-6 flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-lg">
            A
          </div>
          <h2 className="text-xl font-bold tracking-wide whitespace-nowrap">Alvion MVP</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>

          <button
            onClick={() => handleNavClick('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'leads' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users size={20} /> Leads
          </button>

          <button
            onClick={() => handleNavClick('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'messages' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare size={20} /> AI Message
          </button>

          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'settings' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>

        {/* ===== SUBSCRIPTION WIDGET ===== */}
        <div className="p-4 overflow-hidden">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Subscription</h3>
              <Zap size={14} className="text-blue-400 shrink-0" />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-medium">Plan</span>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-500/20">
                  {user?.userType ? `${user.userType} Plan` : 'Starter Plan'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-medium">AI Credits left</span>
                <span className="text-sm font-extrabold text-white">
                  {credits}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mb-3 text-center">Upgrade to unlock unlimited AI</p>

            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 group whitespace-nowrap"
            >
              Upgrade <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* ===== OVERLAY ===== */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 p-2 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 capitalize">
              {activeTab === 'messages' ? 'AI Messages' : activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Users size={16} /> Add Lead
            </button>

            <button
              onClick={handleImportCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={16} /> Import Leads
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download size={16} /> Export Leads
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* ================= TAB: DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                  Welcome{user?.name ? `, ${user.name}` : ''}!
                </h2>
                <p className="text-slate-500">
                  Here's an overview of your leads and AI credits:
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#3b82f6] text-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-4xl md:text-5xl font-bold mb-2">{leads.length}</h3>
                  <p className="text-blue-100 font-medium text-xs md:text-sm uppercase tracking-wider">
                    Total Leads
                  </p>
                </div>

                <div className="bg-[#22d3ee] text-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-4xl md:text-5xl font-bold mb-2">
                    {leads.filter(lead => (lead.status || 'New').toLowerCase() === 'new').length}
                  </h3>
                  <p className="text-cyan-900/60 font-medium text-xs md:text-sm uppercase tracking-wider">
                    New Leads
                  </p>
                </div>

                <div className="bg-white text-slate-800 rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-4xl md:text-5xl font-bold mb-2 text-slate-900">
                    {leads.filter(lead => lead.status?.toLowerCase() === 'contacted').length}
                  </h3>
                  <p className="text-slate-500 font-medium text-xs md:text-sm uppercase tracking-wider">
                    Contacted
                  </p>
                </div>

                <div className="bg-[#111111] text-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-4xl md:text-5xl font-bold mb-2">
                    {leads.filter(lead => lead.status?.toLowerCase() === 'replied').length}
                  </h3>
                  <p className="text-slate-400 font-medium text-xs md:text-sm uppercase tracking-wider">
                    Replied
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800 self-start md:self-auto">
                  Recent Leads
                </h2>

                <div className="flex w-full md:w-auto gap-3">
                  <div className="relative flex-1 md:w-64">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Hunt new leads..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>

                  <button
                    onClick={handleHunt}
                    disabled={isHunting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm"
                  >
                    {isHunting ? 'Hunting...' : (
                      <>
                        <Search size={16} /> Hunt
                      </>
                    )}
                  </button>
                </div>
              </div>

              {selectedInsightLead && (
                <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 shadow-sm relative animate-in fade-in slide-in-from-top-4">
                  <button
                    onClick={() => setSelectedInsightLead(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                      <Target size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">
                      AI Analysis: {selectedInsightLead.companyName}
                    </h3>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 mt-4">
                    <div className="flex-1 bg-white p-4 rounded-lg border border-indigo-50">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                        Suggested Angle
                      </p>
                      <p className="text-slate-700 font-medium">
                        {selectedInsightLead.insightAngle}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-indigo-50 flex items-center gap-4 min-w-[150px]">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                          Lead Score
                        </p>
                        <p className="text-3xl font-extrabold text-indigo-600">
                          {selectedInsightLead.insightScore}
                          <span className="text-lg text-slate-400">/100</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
                {/* DESKTOP */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {leads.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                            No leads found. Use the hunt bar to start adding prospects.
                          </td>
                        </tr>
                      ) : (
                        leads.map(lead => (
                          <tr
                            key={lead._id}
                            onClick={() => analyzeLead(lead)}
                            className="hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <td className="px-6 py-4 font-medium text-slate-800">
                              {lead.contactPerson}
                            </td>
                            <td className="px-6 py-4">{lead.companyName}</td>
                            <td className="px-6 py-4 text-slate-500">{lead.email || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={(e) => handleStatusCycle(e, lead._id, lead.status)}
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border outline-none ${getStatusColor(lead.status)} text-center transition-all hover:brightness-95`}
                                title="Click to cycle status"
                              >
                                {lead.status || 'New'}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => handleGenerateMessage(e, lead)}
                                  className="bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold transition-colors shadow-sm"
                                >
                                  <Zap size={14} className="fill-current" /> Pitch
                                </button>

                                <button
                                  onClick={(e) => handleFollowUp(e, lead)}
                                  className="bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold transition-colors shadow-sm"
                                >
                                  <Clock size={14} /> Follow-up
                                </button>

                                <button
                                  onClick={(e) => handleDeleteLead(e, lead._id)}
                                  className="bg-white border border-red-200 hover:border-red-500 hover:text-red-600 text-slate-600 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold transition-colors shadow-sm"
                                >
                                  Delete
                                </button>

                                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
                                  <MoreHorizontal size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE CARD VIEW */}
                <div className="md:hidden divide-y divide-slate-100">
                  {leads.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                      No leads found. Hunt above!
                    </div>
                  ) : (
                    leads.map(lead => (
                      <div
                        key={lead._id}
                        onClick={() => analyzeLead(lead)}
                        className="p-4 hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-slate-800">{lead.companyName}</h4>
                            <p className="text-sm text-slate-500">{lead.contactPerson}</p>
                          </div>

                          <button
                            onClick={(e) => handleStatusCycle(e, lead._id, lead.status)}
                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border outline-none ${getStatusColor(lead.status)} text-center hover:brightness-95`}
                          >
                            {lead.status || 'New'}
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <button
                            onClick={(e) => handleGenerateMessage(e, lead)}
                            className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 py-2 rounded-lg text-xs font-medium flex justify-center items-center gap-1.5 transition-colors border border-slate-200 shadow-sm"
                          >
                            <Zap size={14} className="fill-current" /> Pitch
                          </button>

                          <button
                            onClick={(e) => handleFollowUp(e, lead)}
                            className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 py-2 rounded-lg text-xs font-medium flex justify-center items-center gap-1.5 transition-colors border border-slate-200 shadow-sm"
                          >
                            <Clock size={14} /> Follow-up
                          </button>

                          <button
                            onClick={(e) => handleDeleteLead(e, lead._id)}
                            className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 py-2 rounded-lg text-xs font-medium flex justify-center items-center gap-1.5 transition-colors border border-slate-200 shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* FOOTER */}
                <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-sm text-slate-500">
                  <p>Showing <strong>{leads.length}</strong> leads</p>
                  <div className="flex gap-1">
                    <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors disabled:opacity-50">
                      Prev
                    </button>
                    <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors disabled:opacity-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= TAB: LEADS ================= */}
          {activeTab === 'leads' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center animate-in fade-in">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <Users size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Lead Directory</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                This is where your full CRM database will live. You can organize, tag, and export all your hunted leads from here.
              </p>
            </div>
          )}

          {/* ================= TAB: AI MESSAGES ================= */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center animate-in fade-in">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-100">
                <MessageSquare size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Message Templates</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Manage your AI pitch generation history and customize the tone, length, and style of your automated outreach.
              </p>
            </div>
          )}

          {/* ================= TAB: SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center animate-in fade-in">
              <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <Settings size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Account Settings</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Update your profile, change your workspace name, manage billing, and connect your CRM integrations.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ===== UPGRADE MODAL ===== */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Zap className="text-blue-500 fill-current" size={18} />
                Upgrade Your Plan
              </h3>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900">Unlock unlimited AI generation</h2>
                <p className="text-slate-500 mt-2">Choose the plan that fits your workflow and scale your outreach.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Starter</h3>
                  <div className="my-4">
                    <span className="text-3xl font-extrabold text-slate-900">Free</span>
                  </div>
                  <ul className="flex-1 space-y-3 text-sm text-slate-600 mb-6">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400" /> 10 AI credits</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400" /> Basic lead hunting</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400" /> Limited AI insights</li>
                  </ul>
                  <button onClick={() => setIsUpgradeModalOpen(false)} className="w-full px-4 py-2 font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">
                    Current Plan
                  </button>
                </div>

                <div className="flex flex-col p-6 bg-blue-600 border border-blue-600 rounded-2xl shadow-xl transform md:scale-105 relative z-10">
                  <div className="absolute top-0 right-0 -mr-2 -mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide text-blue-600 uppercase bg-white shadow-sm border border-blue-100">
                      Most Popular
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Pro</h3>
                  <div className="my-4">
                    <span className="text-3xl font-extrabold text-white">$79</span>
                    <span className="text-blue-200 text-sm">/mo</span>
                  </div>
                  <ul className="flex-1 space-y-3 text-sm text-blue-50 mb-6">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-300" /> Unlimited leads</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-300" /> AI message generation</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-300" /> Advanced insights</li>
                  </ul>
                  <button onClick={() => setIsUpgradeModalOpen(false)} className="w-full px-4 py-2 font-bold text-blue-700 bg-white rounded-xl hover:bg-slate-50 shadow-sm border border-slate-100">
                    Upgrade to Pro
                  </button>
                </div>

                <div className="flex flex-col p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Agency</h3>
                  <div className="my-4">
                    <span className="text-3xl font-extrabold text-slate-900">$499</span>
                    <span className="text-slate-500 text-sm">/mo</span>
                  </div>
                  <ul className="flex-1 space-y-3 text-sm text-slate-600 mb-6">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> Multi-user access</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> CRM integrations</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> Priority AI engine</li>
                  </ul>
                  <button onClick={() => setIsUpgradeModalOpen(false)} className="w-full px-4 py-2 font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 border border-blue-100">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== AI PITCH MODAL ===== */}
      {isPitchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Zap className="text-blue-500 fill-current" size={18} />
                AI Generated Message
              </h3>
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <textarea
                readOnly
                value={generatedPitch}
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none"
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0 z-10">
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedPitch);
                  setIsPitchModalOpen(false);
                  alert('Copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MANUAL ADD LEAD MODAL ===== */}
      {isManualModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-blue-500" size={18} />
                Add New Lead Manually
              </h3>
              <button
                onClick={() => {
                  setIsManualModalOpen(false);
                  setManualLead({ contactPerson: '', companyName: '', email: '' });
                }}
                className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddManualLead}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={manualLead.contactPerson}
                    onChange={(e) => setManualLead(prev => ({ ...prev, contactPerson: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Inc."
                    value={manualLead.companyName}
                    onChange={(e) => setManualLead(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john.doe@acme.com"
                    value={manualLead.email}
                    onChange={(e) => setManualLead(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0 z-10">
                <button
                  type="button"
                  onClick={() => {
                    setIsManualModalOpen(false);
                    setManualLead({ contactPerson: '', companyName: '', email: '' });
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= ROUTES ================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;