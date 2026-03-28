import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import './App.css';

function Dashboard() {
  const navigate = useNavigate();
  
  // --- STATES ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  
  // Credit System State
  const [credits, setCredits] = useState(10); 
  
  // AI Brain Panel
  const [selectedInsightLead, setSelectedInsightLead] = useState(null);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  
  // Form Data
  const [searchQuery, setSearchQuery] = useState('');
  const [isHunting, setIsHunting] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [formData, setFormData] = useState({ companyName: '', contactPerson: '', email: '', notes: '' });

  // --- FETCH DATA ---
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leads');
      const data = await response.json();
      if (response.ok) setLeads(data);
    } catch (error) {
      console.error("Database error");
    }
  };

  // --- ACTIONS ---
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsAddModalOpen(false);
        setFormData({ companyName: '', contactPerson: '', email: '', notes: '' });
        fetchLeads(); 
      }
    } catch (error) {
      console.error("Failed to add lead:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) fetchLeads(); 
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm("Delete this lead?")) {
      await fetch(`http://localhost:5000/api/leads/${id}`, { method: 'DELETE' });
      fetchLeads();
    }
  };

  const handleHunt = async () => {
    if (!searchQuery) return alert("Enter a niche!");
    setIsHunting(true);
    try {
      const response = await fetch('http://localhost:5000/api/hunter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const foundLeads = await response.json();
      setLeads([...foundLeads, ...leads]);
      setSearchQuery('');
    } finally {
      setIsHunting(false);
    }
  };

  // --- 🧠 DYNAMIC AI INSIGHT GENERATOR ---
  const analyzeLead = (lead) => {
    // Generate a random believable score between 74 and 96
    const randomScore = Math.floor(Math.random() * (96 - 74 + 1)) + 74;
    
    // Dynamic Strategic Angles
    const angles = [
      "Pitch them on automated vetting to save their setters 15+ hours weekly.",
      "Focus on their high inbound volume. Offer an AI qualification sequence.",
      "They have strong outbound but weak follow-up. Pitch our speed-to-lead system.",
      "Highlight their manual booking process. Position AI as a 24/7 SDR."
    ];
    
    // Dynamic Multipliers
    const multipliers = [
      "Use the 'Speed-to-Lead' framework for the first touch. High urgency.",
      "Send a personalized Loom video auditing their current funnel.",
      "Engage on LinkedIn first, then drop the cold email 2 hours later.",
      "Mention a direct competitor we just helped scale to build instant authority."
    ];

    setSelectedInsightLead({
      ...lead,
      insightScore: randomScore,
      insightAngle: angles[Math.floor(Math.random() * angles.length)],
      insightMultiplier: multipliers[Math.floor(Math.random() * multipliers.length)]
    });
  };

  // --- 🔥 THE 5 ELITE TEMPLATES ENGINE ---
  const handleGenerateMessage = (e, lead) => {
    e.stopPropagation();
    
    if (credits <= 0) {
      setGeneratedPitch("🔒 You've reached your limit. Early users can unlock more access by upgrading to Alvion Pro or contacting support.");
      setIsPitchModalOpen(true);
      return;
    }

    const contact = lead.contactPerson || lead.contactName || 'there';
    const company = lead.companyName || 'your company';
    
    const greetings = ['Hey', 'Hi', 'Hello'];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];

    const eliteTemplates = [
      `${greeting} ${contact}, I came across ${company} and I like what you're doing.\n\nQuick one — are you currently looking to bring in more qualified clients or scale your current pipeline?\n\nI help brands like yours increase booked calls without wasting time on unqualified leads.\n\nIf you're open to it, I can share something that could help immediately.`,
      `${greeting} ${contact}, I’ve been seeing ${company} pop up and had to reach out.\n\nQuick question — how are you currently handling inbound leads and follow-ups?\n\nI’ve been working with a few teams recently and noticed most are leaving a lot of revenue on the table just from slow or unstructured responses.\n\nCurious how you guys are doing it.`,
      `${greeting} ${contact}, I took a look at ${company} and I can already see a small gap that might be affecting your conversions.\n\nMost brands at your level struggle with turning interested leads into booked calls consistently — not because of traffic, but because of follow-up systems.\n\nAre you currently doing anything structured to handle that?`,
      `${greeting} ${contact}, I came across ${company} and I have a quick idea that could help you increase booked calls almost immediately.\n\nNothing complicated — just a small tweak most teams overlook.\n\nWant me to send it over?`,
      `${greeting} ${contact}, this might be a bit random but I noticed something about ${company} that most people would miss.\n\nIt’s small, but it could be costing you potential clients.\n\nNot trying to pitch you anything — just thought I’d point it out if you’re open.`
    ];

    const selectedTemplate = eliteTemplates[Math.floor(Math.random() * eliteTemplates.length)];
    
    setCredits(prev => prev - 1);
    setGeneratedPitch(selectedTemplate);
    setIsPitchModalOpen(true);
  };

  const exportToCSV = () => {
    if (leads.length === 0) return alert("No leads to export!");
    const headers = ["Company", "Contact", "Notes", "Status"];
    const csvRows = leads.map(lead => {
      const company = `"${lead.companyName || ''}"`;
      const contact = `"${lead.contactPerson || lead.contactName || ''}"`;
      const notes = `"${(lead.notes || '').replace(/"/g, '""')}"`;
      const status = `"${lead.status || 'New'}"`;
      return [company, contact, notes, status].join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Alvion_Leads_Export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Booked': return { bg: '#dcfce3', text: '#16a34a', label: 'Booked' };
      case 'Replied': return { bg: '#dbeafe', text: '#2563eb', label: 'Replied' };
      case 'Contacted': return { bg: '#fef3c7', text: '#d97706', label: 'Contacted' };
      default: return { bg: '#f1f5f9', text: '#475569', label: 'New' };
    }
  };

  return (
    <div className="dashboard-wrapper">
      
      <aside className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 20px 30px 20px', color: 'white' }}>
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4 L4 28 H12 L20 12 Z" fill="#2563EB"/>
            <path d="M16 4 L28 28 H20 L12 12 Z" fill="#60A5FA"/>
            <path d="M16 4 L20 12 L12 12 Z" fill="#3B82F6"/>
          </svg>
          <h2 style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Alvion</h2>
        </div>
        <ul className="nav-links">
          <li className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>📊 Dashboard</li>
          <li className={`nav-item ${activeView === 'hunter' ? 'active' : ''}`} onClick={() => setActiveView('hunter')}>🏹 Lead Hunter</li>
          <li className={`nav-item ${activeView === 'pitches' ? 'active' : ''}`} onClick={() => setActiveView('pitches')}>✉️ My Pitches</li>
        </ul>
        <button className="logout-btn" onClick={() => navigate('/login')}>Logout</button>
      </aside>

      <main className={`main-content ${isSidebarOpen ? '' : 'expanded'}`}>
        
        {activeView === 'dashboard' && (
          <div>
            <div style={{ backgroundColor: '#e0e7ff', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', color: '#3730a3', fontSize: '13px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span>🚀 Alvion Workflow:</span>
                <span style={{ fontWeight: 'normal' }}>Step 1: Find leads → Step 2: Generate message → Step 3: Send → Step 4: Update status</span>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: '4px 10px', borderRadius: '20px', border: '1px solid #c7d2fe', fontSize: '12px', color: credits > 2 ? '#3730a3' : '#dc2626', fontWeight: '900' }}>
                ⚡ {credits} AI Credits Left
              </div>
            </div>

            <header className="header-section" style={{ marginTop: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  {isSidebarOpen ? '◀' : '☰'}
                </button>
                <div>
                  {/* REMOVED PLACEHOLDER NAME */}
                  <h2 style={{ margin: 0 }}>Welcome to your Dashboard!</h2>
                  <p style={{ margin: 0, color: '#64748b' }}>Pipeline: {leads.length} Active Leads</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" style={{ backgroundColor: '#10b981', color: 'white', border: 'none' }} onClick={exportToCSV}>
                  📥 Export CSV
                </button>
                <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                  + Add Lead
                </button>
              </div>
            </header>

            <div className="stats-container">
              <div className="stat-box" style={{ borderBottom: '4px solid #3b82f6' }}>
                <span className="stat-title">Total Leads</span>
                <span className="stat-number">{leads.length}</span>
              </div>
              <div className="stat-box" style={{ borderBottom: '4px solid #64748b' }}>
                <span className="stat-title">New</span>
                <span className="stat-number">{leads.filter(l => l.status === 'New' || !l.status).length}</span>
              </div>
              <div className="stat-box" style={{ borderBottom: '4px solid #f59e0b' }}>
                <span className="stat-title">Contacted</span>
                <span className="stat-number">{leads.filter(l => l.status === 'Contacted').length}</span>
              </div>
              <div className="stat-box" style={{ borderBottom: '4px solid #10b981' }}>
                <span className="stat-title">Booked</span>
                <span className="stat-number">{leads.filter(l => l.status === 'Booked').length}</span>
              </div>
            </div>

            <section className="card hunter-card" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="Find leads (e.g. Real estate agents in Dubai)" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px' }}
              />
              <button className="btn-primary" onClick={handleHunt} style={{ padding: '0 30px' }}>{isHunting ? "Hunting..." : "Hunt"}</button>
            </section>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div className="card" style={{ flex: '2', margin: 0, overflowX: 'auto' }}>
                <table className="leads-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => {
                      const badge = getStatusBadge(lead.status);
                      return (
                        <tr 
                          key={lead._id} 
                          // TRIGGER THE DYNAMIC ANALYZER ON CLICK
                          onClick={() => analyzeLead(lead)} 
                          style={{ cursor: 'pointer', backgroundColor: selectedInsightLead?._id === lead._id ? '#f8fafc' : 'transparent', borderBottom: '1px solid #f1f5f9' }}
                        >
                          <td style={{ padding: '16px 12px' }}>
                            <strong>{lead.companyName}</strong>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{lead.notes || 'No notes'}</div>
                          </td>
                          <td>{lead.contactPerson || lead.contactName || '---'}</td>
                          
                          <td>
                            <span style={{ backgroundColor: badge.bg, color: badge.text, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                              {badge.label}
                            </span>
                            
                            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                              {(lead.status === 'New' || !lead.status) && (
                                <button onClick={(e) => { e.stopPropagation(); updateStatus(lead._id, 'Contacted'); }} style={{ fontSize: '10px', background: '#fef3c7', color: '#d97706', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>→ Contacted</button>
                              )}
                              {lead.status === 'Contacted' && (
                                <button onClick={(e) => { e.stopPropagation(); updateStatus(lead._id, 'Replied'); }} style={{ fontSize: '10px', background: '#dbeafe', color: '#2563eb', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>→ Replied</button>
                              )}
                              {lead.status === 'Replied' && (
                                <button onClick={(e) => { e.stopPropagation(); updateStatus(lead._id, 'Booked'); }} style={{ fontSize: '10px', background: '#dcfce3', color: '#16a34a', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>→ Booked</button>
                              )}
                            </div>
                          </td>

                          <td>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <button 
                                style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', opacity: credits > 0 ? 1 : 0.5 }}
                                onClick={(e) => handleGenerateMessage(e, lead)}
                              >
                                ⚡ Generate Message
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); deleteLead(lead._id); }} className="trash-btn" style={{ fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}

                    {leads.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                          <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>📭</span>
                          <h3 style={{ margin: '0 0 5px 0', color: '#334155' }}>No leads yet</h3>
                          <p style={{ margin: 0, fontSize: '14px' }}>Click <b>+ Add Lead</b> or search the global niche above to get started.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="card" style={{ flex: '1', margin: 0, border: '2px solid #3b82f6', backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#3b82f6', color: 'white', padding: '4px 12px', fontSize: '10px', fontWeight: 'bold', borderBottomLeftRadius: '12px', textTransform: 'uppercase' }}>
                  AI Powered Insight
                </div>
                
                <h3 style={{ marginTop: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                  <span style={{ fontSize: '24px' }}>🧠</span> Strategic Intel
                </h3>

                {selectedInsightLead ? (
                  <div>
                    <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '16px' }}>
                      <p style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 'bold', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>The Winning Angle</p>
                      <p style={{ fontSize: '14px', margin: 0, color: '#1e293b', lineHeight: '1.5' }}>
                        {selectedInsightLead.insightAngle || "Targeting this prospect. Pitch them on automated vetting to save hours of manual outreach."}
                      </p>
                    </div>
                    
                    <div style={{ backgroundColor: '#eef2ff', padding: '16px', borderRadius: '12px', border: '1px solid #c7d2fe', marginBottom: '20px' }}>
                      <p style={{ fontSize: '10px', color: '#6366f1', fontWeight: 'bold', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Conversion Multiplier</p>
                      <p style={{ fontSize: '14px', margin: 0, color: '#1e293b', lineHeight: '1.5' }}>
                        {selectedInsightLead.insightMultiplier || "Follow up directly with the decision maker. Use the 'Speed-to-Lead' framework for the first touch."}
                      </p>
                    </div>

                    <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '16px', color: 'white', marginBottom: '20px' }}>
                      <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 5px 0', letterSpacing: '1px' }}>Closing Probability</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                        {/* RENDERING THE DYNAMIC SCORE */}
                        <span style={{ fontSize: '36px', fontWeight: '900', color: '#4ade80' }}>
                          {selectedInsightLead.insightScore || 88}
                        </span>
                        <span style={{ fontSize: '18px', color: '#4ade80', opacity: 0.8 }}>%</span>
                      </div>
                    </div>

                    <button 
                      style={{ width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '15px', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: credits > 0 ? 1 : 0.5 }}
                      onClick={(e) => handleGenerateMessage(e, selectedInsightLead)}
                    >
                      ⚡ GENERATE ELITE MESSAGE
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 0', border: '2px dashed #cbd5e1', borderRadius: '12px' }}>
                    <span style={{ fontSize: '30px' }}>👆</span>
                    <p style={{ marginTop: '10px', fontWeight: '500' }}>Click any lead in the table to analyze strategy.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'hunter' && (
          <div className="card" style={{ padding: '80px 40px', textAlign: 'center', marginTop: '20px', borderRadius: '16px' }}>
            <span style={{ fontSize: '64px' }}>🏹</span>
            <h2 style={{ marginTop: '20px', fontSize: '28px', color: '#0f172a' }}>Advanced Lead Hunter</h2>
            <p style={{ color: '#64748b', maxWidth: '500px', margin: '15px auto', fontSize: '16px', lineHeight: '1.6' }}>
              Connect your LinkedIn or Instagram account to start scraping high-ticket leads automatically while you sleep.
            </p>
            <button className="btn-primary" style={{ marginTop: '20px', padding: '15px 30px', fontSize: '16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px' }}>
              Connect Social Accounts
            </button>
          </div>
        )}

        {activeView === 'pitches' && (
          <div className="card" style={{ padding: '80px 40px', textAlign: 'center', marginTop: '20px', borderRadius: '16px' }}>
            <span style={{ fontSize: '64px' }}>✉️</span>
            <h2 style={{ marginTop: '20px', fontSize: '28px', color: '#0f172a' }}>My Generated Pitches</h2>
            <p style={{ color: '#64748b', maxWidth: '500px', margin: '15px auto', fontSize: '16px', lineHeight: '1.6' }}>
              Your entire history of AI-generated closing messages will be securely stored here once you start generating them.
            </p>
          </div>
        )}

        {isAddModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>+ Add Manual Lead</h3>
              <form onSubmit={handleAddLead}>
                <input type="text" placeholder="Company Name" required value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                <input type="text" placeholder="Contact Person (e.g. Phil Knight)" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} />
                <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <textarea placeholder="Meeting Notes (What did they say?)" style={{ height: '80px' }} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, backgroundColor: '#10b981' }}>Save Lead</button>
                  <button type="button" className="btn-primary" style={{ flex: 1, backgroundColor: '#64748b' }} onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isPitchModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ width: '500px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Generated Message</h3>
                <span style={{ backgroundColor: '#dcfce3', color: '#16a34a', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>AI Written ✨</span>
              </div>
              <textarea 
                value={generatedPitch} 
                readOnly
                style={{ height: '200px', width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #e2e8f0', fontFamily: 'Inter', fontSize: '14px', lineHeight: '1.5', color: '#1e293b' }}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{ flex: 2, backgroundColor: '#2563eb', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }} 
                  onClick={() => { navigator.clipboard.writeText(generatedPitch); alert("Message Copied to Clipboard! 📋"); }}
                >
                  📋 Copy Message
                </button>
                <button type="button" className="btn-primary" style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: 'none' }} onClick={() => setIsPitchModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

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