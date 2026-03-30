import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import './App.css';

function Dashboard() {
  const navigate = useNavigate();

  // --- STATES ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeView, setActiveView] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [credits, setCredits] = useState(10);
  const [selectedInsightLead, setSelectedInsightLead] = useState(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHunting, setIsHunting] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState('');

  // --- RESPONSIVE HANDLING ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- CREDIT PERSISTENCE ---
  useEffect(() => {
    const savedCredits = localStorage.getItem('credits');
    if (savedCredits) setCredits(Number(savedCredits));
  }, []);

  useEffect(() => {
    localStorage.setItem('credits', credits);
  }, [credits]);

  // --- DATA FETCHING ---
  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leads');
      const data = await res.json();
      if (res.ok) setLeads(data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- ACTIONS ---
  const handleHunt = async () => {
    if (!searchQuery) {
      setGeneratedPitch("⚠️ Please enter a niche to hunt leads.");
      setIsPitchModalOpen(true);
      return;
    }

    setIsHunting(true);

    try {
      const res = await fetch('http://localhost:5000/api/hunter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      const found = await res.json();

      setLeads(prev => {
        const combined = [...found, ...prev];
        return combined.filter((lead, index, self) =>
          index === self.findIndex(l => l._id === lead._id)
        );
      });

      setSearchQuery('');
    } finally {
      setIsHunting(false);
    }
  };

  const analyzeLead = (lead) => {
    const angles = [
      "Likely high inbound volume — focus on speed.",
      "Outbound opportunity — personalize messaging.",
      "Follow-up gap detected — automate sequences.",
      "Strong fit for AI-assisted lead qualification."
    ];

    setSelectedInsightLead({
      ...lead,
      insightScore: Math.floor(Math.random() * 20) + 75,
      insightAngle: angles[Math.floor(Math.random() * angles.length)]
    });
  };

  const handleGenerateMessage = (e, lead) => {
    e.stopPropagation();

    if (credits <= 0) {
      setGeneratedPitch("🔒 Credit limit reached. Upgrade to Pro.");
      setIsPitchModalOpen(true);
      return;
    }

    const contact = lead.contactPerson || 'there';

    const msg = `Hey ${contact}, I noticed your company and have a quick idea to help you get more leads consistently. Open to a quick chat?`;

    setCredits(prev => prev - 1);
    setGeneratedPitch(msg);
    setIsPitchModalOpen(true);
  };

  return (
    <div className="dashboard-wrapper">

      {/* SIDEBAR */}
      <aside className="sidebar" style={{ background: '#0f172a', color: 'white' }}>
        <div style={{ padding: 20 }}>Alvion</div>
        <button onClick={() => navigate('/login')}>Logout</button>
      </aside>

      {/* OVERLAY */}
      {isSidebarOpen && isMobile && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)' }}
        />
      )}

      {/* MAIN */}
      <main className="main-content">

        <div style={{ marginBottom: 20 }}>
          <input
            placeholder="Enter niche"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleHunt}>{isHunting ? '...' : 'Hunt'}</button>
        </div>

        {!isMobile ? (
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l._id} onClick={() => analyzeLead(l)}>
                  <td>{l.companyName}</td>
                  <td>{l.status || 'New'}</td>
                  <td>
                    <button onClick={(e) => handleGenerateMessage(e, l)}>
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            {leads.map(l => (
              <div key={l._id} onClick={() => analyzeLead(l)}>
                <strong>{l.companyName}</strong>
                <p>{l.status || 'New'}</p>
                <button onClick={(e) => handleGenerateMessage(e, l)}>
                  Message
                </button>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* MODAL */}
      {isPitchModalOpen && (
        <div>
          <textarea readOnly value={generatedPitch} />
          <button onClick={() => setIsPitchModalOpen(false)}>Close</button>
        </div>
      )}
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
