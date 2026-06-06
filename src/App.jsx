import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { supabase } from './supabase.js';
import { 
  Brain, Zap, Terminal, Shield, Cpu, ArrowRight, Globe, Lock, Workflow,
  FolderKanban, DollarSign, TrendingUp, Code, Users, Moon, Sun, X, RefreshCw,
  CreditCard, Radio, Check, Activity, Sparkles, LockKeyhole, Download, Upload,
  Layers, Network, RadioTower, MessageSquare, ShoppingBag, SlidersHorizontal,
  Trash2, Search, CheckCircle2, Plus
} from 'lucide-react';

const STORAGE_KEYS = {
  VIEW: 'aura_view', WORKSPACE: 'aura_workspace_name', INDUSTRY: 'aura_industry_focus',
  TIER: 'aura_current_tier', BILLING: 'aura_billing_period', PROMPT: 'aura_app_prompt',
  APP_NAME: 'aura_app_name_input', ACCENT: 'aura_selected_accent', FLEET: 'aura_fleet_data',
  AGENTS: 'aura_agents_data', INVOICES: 'aura_sandbox_invoices', DARK_MODE: 'aura_sandbox_dark_mode',
  ROOM_ID: 'aura_room_id', INSTALLED_MARKETPLACE: 'aura_installed_marketplace'
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const handleSignup = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setAuthError(error.message);
    else setAuthError('Check your email to confirm your account!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const [view, setView] = useState(() => localStorage.getItem(STORAGE_KEYS.VIEW) || 'landing');
  const [workspaceName, setWorkspaceName] = useState(() => localStorage.getItem(STORAGE_KEYS.WORKSPACE) || 'Stellar Labs');
  const [industryFocus, setIndustryFocus] = useState(() => localStorage.getItem(STORAGE_KEYS.INDUSTRY) || 'saas');
  const [currentTier, setCurrentTier] = useState(() => localStorage.getItem(STORAGE_KEYS.TIER) || 'Sandbox');
  const [billingPeriod, setBillingPeriod] = useState(() => localStorage.getItem(STORAGE_KEYS.BILLING) || 'monthly');
  const [appPrompt, setAppPrompt] = useState(() => localStorage.getItem(STORAGE_KEYS.PROMPT) || 'A sleek client-portal and invoice tracker for freelance designers.');
  const [appNameInput, setAppNameInput] = useState(() => localStorage.getItem(STORAGE_KEYS.APP_NAME) || 'DesignFlow CRM');
  const [selectedAccent, setSelectedAccent] = useState(() => localStorage.getItem(STORAGE_KEYS.ACCENT) || 'indigo');
  const [fleet, setFleet] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FLEET);
    return saved ? JSON.parse(saved) : [
      { id: 'app-1', name: 'DesignFlow CRM', status: 'Active', mrr: 12450, users: 480, uptime: '99.98%', prompt: 'Freelance designer billing & kanban portal', accent: 'indigo' },
      { id: 'app-2', name: 'LinkForge SEO', status: 'Scaling', mrr: 6800, users: 195, uptime: '99.95%', prompt: 'Auto-backlinking suite for blog sites', accent: 'emerald' }
    ];
  });
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AGENTS);
    return saved ? JSON.parse(saved) : [
      { id: 'pm', name: 'Atlas (Product Lead)', role: 'Product Manager', status: 'Idle', efficiency: 98, temperature: 0.3, budget: 150 },
      { id: 'dev', name: 'Cortex (Engineer)', role: 'Senior Dev Swarm', status: 'Idle', efficiency: 95, temperature: 0.1, budget: 350 },
      { id: 'ops', name: 'Sentinel (DevOps)', role: 'Site Reliability', status: 'Active', efficiency: 99, temperature: 0.0, budget: 100 },
      { id: 'growth', name: 'Apex (Marketer)', role: 'Growth & Ads Specialist', status: 'Idle', efficiency: 91, temperature: 0.7, budget: 200 },
    ];
  });
  const [sandboxInvoices, setSandboxInvoices] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : [
      { id: 'INV-001', client: 'Acme Design Corp', amount: 1200, status: 'Paid', date: 'May 28' },
      { id: 'INV-002', client: 'Aether Labs', amount: 4500, status: 'Pending', date: 'Jun 01' },
    ];
  });
  const [sandboxDarkMode, setSandboxDarkMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) === 'true' : true;
  });
  const [roomId, setRoomId] = useState(() => localStorage.getItem(STORAGE_KEYS.ROOM_ID) || '');
  const [installedMarketplaceIds, setInstalledMarketplaceIds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INSTALLED_MARKETPLACE);
    return saved ? JSON.parse(saved) : [];
  });
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState('all');
  const marketplaceDatabase = useMemo(() => [
    { id: 'mp-deepseek', name: 'DeepSeek-Coder v3 Node', developer: 'DeepSeek Research', description: 'An advanced coding core tailored for intense logical backend synthesis and low-latency API compilation.', rating: '4.9', downloads: '12.4k', cost: 'Free tier / API Link', category: 'coding', capabilities: 'Wasm optimization, complex AST rendering' },
    { id: 'mp-stripe-arch', name: 'Stripe Checkout Architect', developer: 'Fintech Agent Lab', description: 'Dedicated checkout specialist that handles compliance setup, tax computations, and localized billing routing automatically.', rating: '4.8', downloads: '8.2k', cost: 'Included in Solo+', category: 'infrastructure', capabilities: 'SCA compliance, multi-currency ledger maps' },
    { id: 'mp-multilingual', name: 'SEO Multi-Lingual Translatrix', developer: 'Apex-Apex Corp', description: 'Auto-translates synthesized frontends into 24 global languages, optimizing edge routing tags for local search visibility.', rating: '4.7', downloads: '5.1k', cost: 'Included in Scale+', category: 'marketing', capabilities: 'Hreflang tagging, dynamic localization routing' },
    { id: 'mp-redteam', name: 'Sentinel Security Auditing Red-Team', developer: 'Sentinel Cyber', description: 'Runs high-concurrency fuzz testing and security breach simulations in Sandbox mode before final compile commits.', rating: '4.9', downloads: '14.1k', cost: 'Sovereign tier exclusive', category: 'infrastructure', capabilities: 'Breach detection, DDoS load balancing' }
  ], []);
  const filteredMarketplace = useMemo(() => marketplaceDatabase.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(marketplaceSearch.toLowerCase()) || item.description.toLowerCase().includes(marketplaceSearch.toLowerCase());
    const matchesFilter = marketplaceFilter === 'all' || item.category === marketplaceFilter;
    return matchesSearch && matchesFilter;
  }), [marketplaceDatabase, marketplaceSearch, marketplaceFilter]);
  const activeCodingAgentName = useMemo(() => installedMarketplaceIds.includes('mp-deepseek') ? 'DeepSeek-Coder v3 Node' : 'Cortex (Engineer)', [installedMarketplaceIds]);
  const activeCheckoutAgentName = useMemo(() => installedMarketplaceIds.includes('mp-stripe-arch') ? 'Stripe Checkout Architect' : 'Cortex (Engineer)', [installedMarketplaceIds]);
  const activeSecurityAgentName = useMemo(() => installedMarketplaceIds.includes('mp-redteam') ? 'Red-Team Security Auditor' : 'Sentinel (DevOps)', [installedMarketplaceIds]);
  const [isMultiplayerActive, setIsMultiplayerActive] = useState(false);
  const [coBuilders, setCoBuilders] = useState([]);
  const [multiplayerLogs, setMultiplayerLogs] = useState([]);
  const [inputRoomId, setInputRoomId] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [buildLogs, setBuildLogs] = useState([]);
  const [buildProgress, setBuildProgress] = useState(0);
  const [activeWorkingAgent, setActiveWorkingAgent] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [banner, setBanner] = useState('Ecosystem initialized. Browse the Agent Marketplace to configure custom neural pipelines.');
  const [deployedAppName, setDeployedAppName] = useState(appNameInput);
  const [deployedAccent, setDeployedAccent] = useState(selectedAccent);
  const intervalRef = useRef(null);
  const mpSimulationRef = useRef(null);

  const navigateTo = (newView) => { setView(newView); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleUpgrade = (tier) => {
    const urls = {
      Solo: 'https://auraos-platform.lemonsqueezy.com/checkout/buy/48747475-4c70-4782-8b3d-22da199ec8c7',
      Scale: 'https://auraos-platform.lemonsqueezy.com/checkout/buy/2b4d096c-0393-4576-8a74-95c17c8dff45',
      Sovereign: 'https://auraos-platform.lemonsqueezy.com/checkout/buy/a1c49df4-5205-4cce-90cb-bf0f245e9f7b',
    };
    if (urls[tier]) window.location.href = urls[tier];
  };

  const handleOpenBillingPortal = async () => {
    try {
      setBanner("Authenticating encrypted Customer Portal session link...");
      const response = await fetch('https://aura-backend-production-ad05.up.railway.app/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (!response.ok) throw new Error("Portal gateway authentication failed.");
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      setBanner("❌ Unable to load billing portal. Check your customer schema profile logs.");
    }
  };

  useEffect(() => { setDeployedAppName(appNameInput || "Aura Micro-App"); setDeployedAccent(selectedAccent); }, [appNameInput, selectedAccent]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.VIEW, view); }, [view]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WORKSPACE, workspaceName); }, [workspaceName]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INDUSTRY, industryFocus); }, [industryFocus]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TIER, currentTier); }, [currentTier]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BILLING, billingPeriod); }, [billingPeriod]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROMPT, appPrompt); }, [appPrompt]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.APP_NAME, appNameInput); }, [appNameInput]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ACCENT, selectedAccent); }, [selectedAccent]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FLEET, JSON.stringify(fleet)); }, [fleet]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents)); }, [agents]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(sandboxInvoices)); }, [sandboxInvoices]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(sandboxDarkMode)); }, [sandboxDarkMode]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ROOM_ID, roomId); }, [roomId]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INSTALLED_MARKETPLACE, JSON.stringify(installedMarketplaceIds)); }, [installedMarketplaceIds]);
  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current); if (mpSimulationRef.current) clearInterval(mpSimulationRef.current); }; }, []);

  const handleCreateRoom = () => {
    const randomCode = `AURA-${Math.floor(1000 + Math.random() * 9000)}`;
    setRoomId(randomCode); setIsMultiplayerActive(true);
    setCoBuilders([{ id: 'host', name: 'You (Owner)', status: 'Active', avatar: '👑' }, { id: 'peer-1', name: 'DevNode_74b', status: 'Connecting...', avatar: '🤖' }]);
    setMultiplayerLogs([`[System] Sync room ${randomCode} established.`, `[System] Node handshake verified. SSL Edge tunnel initialized.`]);
    setBanner(`Session initialized. Room Code: ${randomCode}`);
    startMultiplayerSimulation();
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!inputRoomId.trim()) return;
    const cleanId = inputRoomId.toUpperCase().trim();
    setRoomId(cleanId); setIsMultiplayerActive(true);
    setCoBuilders([{ id: 'host', name: 'You (Guest)', status: 'Active', avatar: '👤' }, { id: 'peer-1', name: 'MasterNode_01', status: 'Active', avatar: '👑' }, { id: 'peer-2', name: 'Designer_Bot_x', status: 'Active', avatar: '🎨' }]);
    setMultiplayerLogs([`[System] Handshake requested for room: ${cleanId}`, `[System] Connected. Received state payload bundle from MasterNode_01.`]);
    setBanner(`Joined sync session: ${cleanId}`);
    startMultiplayerSimulation();
  };

  const startMultiplayerSimulation = () => {
    if (mpSimulationRef.current) clearInterval(mpSimulationRef.current);
    let cycle = 0;
    mpSimulationRef.current = setInterval(() => {
      cycle++;
      if (cycle === 1) { setCoBuilders(prev => prev.map(p => p.id === 'peer-1' ? { ...p, status: 'Active' } : p)); setMultiplayerLogs(prev => [...prev, `[System] Peer DevNode_74b status updated to ACTIVE.`]); }
      else if (cycle === 3) { setMultiplayerLogs(prev => [...prev, `[DevNode_74b] Modified requirement prompt: Added localized translation tags.`]); setAppPrompt(prev => prev + " Inject language support components."); }
      else if (cycle === 5) { setMultiplayerLogs(prev => [...prev, `[DevNode_74b] Recalibrated Senior Dev Swarm creative temperature to 0.4.`]); setAgents(prev => prev.map(a => a.id === 'dev' ? { ...a, temperature: 0.4 } : a)); }
      else if (cycle === 7) { setMultiplayerLogs(prev => [...prev, `[System] Keep-alive packet verified. Sync active.`]); }
    }, 4500);
  };

  const leaveRoom = () => {
    if (mpSimulationRef.current) clearInterval(mpSimulationRef.current);
    setIsMultiplayerActive(false); setRoomId(''); setInputRoomId(''); setCoBuilders([]); setMultiplayerLogs([]);
    setBanner("Multiplayer node sync disconnected.");
  };

  const toggleAgentInstallation = (id, name) => {
    const isInstalled = installedMarketplaceIds.includes(id);
    if (isInstalled) { setInstalledMarketplaceIds(prev => prev.filter(item => item !== id)); setBanner(`De-registered ${name} from core stack.`); }
    else { setInstalledMarketplaceIds(prev => [...prev, id]); setBanner(`Successfully integrated ${name} into available neural lanes.`); }
  };

  const runBuildProcess = () => {
    if (isBuilding) return;
    setIsBuilding(true); setBuildStep(1); setBuildProgress(5); setActiveWorkingAgent('Product Manager (Atlas)');
    const logs = [
      { progress: 15, agent: 'Product Manager (Atlas)', text: `⚙️ Syncing configuration vectors for: "${appPrompt}"...` },
      { progress: 35, agent: activeCodingAgentName, text: `💻 [${activeCodingAgentName}] compiling frontend NextJS interface structures.` },
      { progress: 55, agent: activeCheckoutAgentName, text: `💳 [${activeCheckoutAgentName}] executing payment transaction interface bindings.` },
      { progress: 80, agent: activeSecurityAgentName, text: `🐳 [${activeSecurityAgentName}] performing security audits inside docker boundary isolates.` },
      { progress: 100, agent: 'System Core', text: `🎉 Operational live deployment success. Writing payload parameters to storage state index.` }
    ];
    setBuildLogs([logs[0].text]);
    let logIndex = 1;
    intervalRef.current = setInterval(() => {
      if (logIndex < logs.length) {
        const nextLog = logs[logIndex];
        setBuildStep(logIndex + 1); setBuildProgress(nextLog.progress); setActiveWorkingAgent(nextLog.agent);
        setBuildLogs(prev => [...prev, nextLog.text]); logIndex++;
      } else {
        clearInterval(intervalRef.current); setIsBuilding(false); setActiveWorkingAgent('');
        setDeployedAppName(appNameInput || "Aura Micro-App"); setDeployedAccent(selectedAccent);
        const newApp = { id: `app-${Date.now()}`, name: appNameInput || "Aura Micro-App", status: 'Active', mrr: Math.floor(Math.random() * 850) + 300, users: Math.floor(Math.random() * 45) + 5, uptime: '100%', prompt: appPrompt, accent: selectedAccent };
        setFleet(prev => [newApp, ...prev]);
        setBanner(`🚀 Deployment committed using custom swarm variables. Live endpoint online.`);
      }
    }, 1000);
  };

  const addInvoice = (e) => {
    e.preventDefault();
    if (!newClient || !newAmount) return;
    const newInv = { id: `INV-00${sandboxInvoices.length + 1}`, client: newClient, amount: parseFloat(newAmount), status: 'Pending', date: 'Today' };
    setSandboxInvoices(prev => [newInv, ...prev]); setNewClient(''); setNewAmount('');
  };

  const exportSystemBundle = () => {
    const backupPackage = { timestamp: new Date().toISOString(), aura_os_version: '2.5.8-UltimateMarketplace', payload: { workspaceName, industryFocus, currentTier, billingPeriod, appPrompt, appNameInput, selectedAccent, fleet, agents, sandboxInvoices, installedMarketplaceIds } };
    const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupPackage, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataString);
    downloadAnchor.setAttribute("download", `aura_bundle_${workspaceName.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor); downloadAnchor.click(); downloadAnchor.remove();
    setBanner("System profile bundle generated and exported safely.");
  };

  const clearSystemDatabase = () => {
    if (window.confirm("Warning: This action completely flashes your local storage clusters. Reset platform configuration?")) { localStorage.clear(); window.location.reload(); }
  };

  const getAccentClass = useCallback((accent) => {
    switch(accent) {
      case 'emerald': return { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-emerald-400', border: 'border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-400', fill: '#10b981' };
      case 'rose': return { bg: 'bg-rose-600', hover: 'hover:bg-rose-700', text: 'text-rose-400', border: 'border-rose-500/20', badge: 'bg-rose-500/10 text-rose-400', fill: '#f43f5e' };
      case 'amber': return { bg: 'bg-amber-600', hover: 'hover:bg-amber-700', text: 'text-amber-400', border: 'border-amber-500/20', badge: 'bg-amber-500/10 text-amber-400', fill: '#f59e0b' };
      default: return { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-400', border: 'border-indigo-500/20', badge: 'bg-indigo-500/10 text-indigo-400', fill: '#6366f1' };
    }
  }, []);

  const sandboxStyles = useMemo(() => getAccentClass(deployedAccent), [deployedAccent, getAccentClass]);
  const activePromptStyles = useMemo(() => getAccentClass(selectedAccent), [selectedAccent, getAccentClass]);

  if (authLoading) return <div className="min-h-screen bg-[#06060a] flex items-center justify-center text-white text-sm">Loading AuraOS...</div>;

  if (!user) return (
    <div className="min-h-screen bg-[#06060a] flex items-center justify-center px-4">
      <div className="bg-[#0f0f16] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">AuraOS</span>
        </div>
        <h2 className="text-xl font-black text-white mb-2">Sign in</h2>
        <p className="text-slate-400 text-xs mb-6">Access your autonomous business operating system.</p>
        {authError && <p className="text-xs text-red-400 mb-4">{authError}</p>}
        <div className="space-y-3">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 text-sm" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 text-sm" />
          <button onClick={handleLogin} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold text-white transition-all">Sign In</button>
          <button onClick={handleSignup} className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-all">Create Account</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#06060a] text-slate-200 font-sans selection:bg-indigo-500/30">
      {banner && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border-b border-indigo-500/20 text-xs py-3 px-4 relative z-50 flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto"><Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /><span className="font-mono text-slate-300">{banner}</span></div>
          <button onClick={() => setBanner('')} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}
      <nav className="sticky top-0 w-full z-40 bg-[#06060a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('landing')}>
              <div className="w-9 h-9 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Brain className="w-5 h-5 text-white" /></div>
              <div className="flex flex-col"><span className="text-lg font-bold tracking-tight text-white leading-none">AURA</span><span className="text-[10px] text-slate-500 tracking-wider font-semibold">ECOSYSTEM HUB INSTANTIATED</span></div>
            </div>
            <div className="hidden lg:flex items-center space-x-1 bg-white/[0.02] p-1.5 rounded-xl border border-white/5">
              {view !== 'landing' && view !== 'onboarding' && (
                <>
                  <button onClick={() => navigateTo('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}><Activity className="w-4 h-4" /> Operations Fleet</button>
                  <button onClick={() => navigateTo('workspace')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${view === 'workspace' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}><Workflow className="w-4 h-4" /> Assembler Layer</button>
                  <button onClick={() => navigateTo('agents')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${view === 'agents' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}><Cpu className="w-4 h-4" /> Workforce Matrix</button>
                </>
              )}
              <button onClick={() => navigateTo('marketplace')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${view === 'marketplace' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}><ShoppingBag className="w-4 h-4" /> Agent Marketplace</button>
              <button onClick={() => navigateTo('pricing')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${view === 'pricing' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}><CreditCard className="w-4 h-4" /> Compute Pricing</button>
            </div>
            <div className="flex items-center gap-3">
              {view !== 'landing' && (<button onClick={exportSystemBundle} className="p-2 bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"><Download className="w-4 h-4" /><span className="hidden sm:inline">Export Bundle</span></button>)}
              {view === 'landing' ? (
                <button onClick={() => navigateTo('onboarding')} className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg">Enter Platform</button>
              ) : (
                <div className="flex items-center gap-2">
                  {currentTier !== 'Sandbox' && (<button onClick={handleOpenBillingPortal} className="hidden sm:flex px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 rounded-lg text-[11px] font-bold tracking-tight items-center gap-1"><SlidersHorizontal className="w-3.5 h-3.5" /> Manage Invoices</button>)}
                  <div className="hidden sm:flex flex-col text-right pl-2">
                    <span className="text-xs text-slate-300 font-bold">{workspaceName}</span>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold flex items-center gap-1"><RadioTower className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> {currentTier.toUpperCase()} NODE</span>
                  </div>
                  <button onClick={handleLogout} className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-lg text-xs font-bold">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {view === 'landing' && (
        <div className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8"><Zap className="w-3.5 h-3.5" /><span>LOCAL MEMORY & INTEGRATED PLUGINS SYSTEM ACTIVE</span></div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-6">Empose an Empire with<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Custom Neural Swarms.</span></h1>
            <p className="max-w-2xl text-base md:text-lg text-slate-400 mx-auto mb-10">Aura doesn't restrict you to baseline pipelines. Bring fine-tuned LLMs, community specialized PMs, and enterprise auditing agents directly into your persistent compilation loop.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigateTo('onboarding')} className="px-8 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg flex items-center gap-2">Launch Swarm Operations <ArrowRight className="w-4 h-4" /></button>
              <button onClick={() => navigateTo('marketplace')} className="px-8 py-4 text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10">Browse Marketplace</button>
            </div>
          </div>
        </div>
      )}

      {view === 'onboarding' && (
        <div className="max-w-xl mx-auto px-4 py-20 relative z-10">
          <div className="bg-[#0f0f16] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-1">Initialize Workspace Node</h2>
            <p className="text-slate-400 text-xs mb-6">All parameters instantly write back to synchronized system memory configurations.</p>
            <form onSubmit={(e) => { e.preventDefault(); navigateTo('dashboard'); }} className="space-y-6">
              <div><label className="block text-xs font-bold uppercase text-slate-400 mb-2">Cluster Organization Identifier</label><input type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 text-sm" required /></div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Primary App Output Target</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setIndustryFocus('saas')} className={`p-4 rounded-xl border text-left transition-all ${industryFocus === 'saas' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/[0.02]'}`}><FolderKanban className="w-5 h-5 text-indigo-400 mb-2" /><p className="font-bold text-xs text-white">Saas Core Hub</p></button>
                  <button type="button" onClick={() => setIndustryFocus('commerce')} className={`p-4 rounded-xl border text-left transition-all ${industryFocus === 'commerce' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/[0.02]'}`}><DollarSign className="w-5 h-5 text-purple-400 mb-2" /><p className="font-bold text-xs text-white">Billing Gateways</p></button>
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all shadow-md">Instantiate Local State Database Cluster</button>
            </form>
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="flex justify-between items-center mb-10">
            <div><h2 className="text-2xl font-black text-white">Active Fleet Systems</h2><p className="text-slate-400 text-xs">Persistent configuration records running inside safe browser disk structures.</p></div>
            <button onClick={() => navigateTo('workspace')} className="px-4 py-2 bg-indigo-600 text-xs font-bold text-white rounded-lg">Deploy New Pipeline</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5"><span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Portfolio MRR Valuation</span><p className="text-2xl font-bold text-white">${fleet.reduce((acc, curr) => acc + curr.mrr, 0).toLocaleString()}</p></div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5"><span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Hydrated Active End-Users</span><p className="text-2xl font-bold text-indigo-400">{fleet.reduce((acc, curr) => acc + curr.users, 0).toLocaleString()}</p></div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5"><span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ecosystem Plugins Synced</span><p className="text-2xl font-bold text-green-400">{installedMarketplaceIds.length} Nodes Active</p></div>
          </div>
          <div className="space-y-3">
            {fleet.map((app) => {
              const appStyles = getAccentClass(app.accent);
              return (
                <div key={app.id} className="p-5 bg-[#0f0f16] border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.02] flex items-center justify-center border border-white/5"><Code className="w-4 h-4" style={{ color: appStyles.fill }} /></div>
                    <div><div className="flex items-center gap-2"><h4 className="font-bold text-white text-sm">{app.name}</h4><span className={`text-[9px] font-extrabold px-1.5 rounded ${appStyles.badge}`}>{app.status}</span></div><p className="text-[11px] text-slate-400 mt-0.5">{app.prompt}</p></div>
                  </div>
                  <div className="flex items-center gap-6 text-xs font-mono">
                    <div><span className="text-slate-500 text-[10px] block">MRR</span><span className="text-white font-bold">${app.mrr}</span></div>
                    <div><span className="text-slate-500 text-[10px] block">Pool</span><span className="text-white font-bold">{app.users} users</span></div>
                    <button onClick={() => { setAppPrompt(app.prompt); setAppNameInput(app.name); setSelectedAccent(app.accent); navigateTo('workspace'); }} className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded text-[11px] font-semibold text-slate-300">Open Instance</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
            <span>Cache Footprint Allocation: ~{JSON.stringify(localStorage).length} characters written</span>
            <button onClick={clearSystemDatabase} className="text-red-400 hover:text-red-300 font-semibold underline">Hard Reset Platform Cache Data</button>
          </div>
        </div>
      )}

      {view === 'workspace' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="mb-8 p-6 bg-[#0f0f16] border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Network className="w-6 h-6" /></div>
              <div><h3 className="font-extrabold text-sm text-white">Multiplayer Node Sync</h3><p className="text-[11px] text-slate-400 mt-0.5 font-medium">Invite co-builders or simulate team interaction pipelines over our simulated sockets.</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
              {!isMultiplayerActive ? (
                <>
                  <button onClick={handleCreateRoom} className="flex-1 md:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Start Synced Session</button>
                  <form onSubmit={handleJoinRoom} className="flex gap-2 w-full sm:w-auto">
                    <input type="text" placeholder="Enter Room Code..." value={inputRoomId} onChange={(e) => setInputRoomId(e.target.value)} className="bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none w-full sm:w-32" />
                    <button type="submit" className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors text-slate-300">Join</button>
                  </form>
                </>
              ) : (
                <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-xl px-4 py-2 w-full md:w-auto justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-indigo-400">{roomId}</span>
                    <div className="flex items-center -space-x-2">
                      {coBuilders.map(p => (
                        <div key={p.id} title={`${p.name} (${p.status})`} className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#0f0f16] flex items-center justify-center text-xs relative cursor-pointer">
                          {p.avatar}<span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#0f0f16] ${p.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={leaveRoom} className="text-xs text-red-400 hover:text-red-300 font-semibold border-l border-white/10 pl-3.5">Leave</button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 bg-[#0f0f16] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wide">Orchestrate Sandbox</h3>
                {isMultiplayerActive && (<span className="text-[10px] text-indigo-400 font-mono font-bold flex items-center gap-1 animate-pulse"><RadioTower className="w-3 h-3" /> SYNCED</span>)}
              </div>
              <div><label className="block text-[10px] text-slate-500 mb-1">Micro-SaaS Core Label</label><input type="text" value={appNameInput} onChange={(e) => setAppNameInput(e.target.value)} className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none" /></div>
              <div><label className="block text-[10px] text-slate-500 mb-1">UI Interface Accents</label><div className="flex gap-2">{['indigo', 'emerald', 'rose', 'amber'].map(c => (<button key={c} onClick={() => setSelectedAccent(c)} className={`w-5 h-5 rounded-full border transition-transform ${selectedAccent === c ? 'scale-110 border-white' : 'border-transparent'}`} style={{ backgroundColor: c === 'indigo' ? '#6366f1' : c === 'emerald' ? '#10b981' : c === 'rose' ? '#f43f5e' : '#f59e0b' }} />))}</div></div>
              <div><label className="block text-[10px] text-slate-500 mb-1">Functional Architecture Requirement</label><textarea value={appPrompt} onChange={(e) => setAppPrompt(e.target.value)} className="w-full h-24 bg-white/[0.02] border border-white/10 rounded-lg p-2.5 text-xs text-slate-300 focus:border-indigo-500 outline-none resize-none" /></div>
              {installedMarketplaceIds.length > 0 && (<div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-[10px] text-indigo-300 flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" /><div><span className="font-bold">Ecosystem Override:</span> Compiling using: <span className="font-semibold text-white">{activeCodingAgentName}</span>.</div></div>)}
              <button onClick={runBuildProcess} disabled={isBuilding} className={`w-full py-3 text-xs font-bold rounded-xl text-white ${isBuilding ? 'bg-indigo-600/20 text-white/40 cursor-not-allowed' : `${activePromptStyles.bg} hover:opacity-90`}`}>{isBuilding ? 'Compiling Assembly Network...' : 'Commit Code Pipeline to Disk'}</button>
            </div>
            <div className="lg:col-span-8 space-y-4">
              {isMultiplayerActive && (<div className="bg-[#050508] border border-indigo-500/20 rounded-xl p-4 font-mono text-xs"><p className="text-indigo-400 font-bold mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider"><MessageSquare className="w-3.5 h-3.5 animate-pulse" /> Peer-to-Peer Data Events</p><div className="space-y-1 text-slate-400 text-[10px] max-h-[80px] overflow-y-auto">{multiplayerLogs.map((log, idx) => (<p key={idx} className={log.startsWith('[System]') ? 'text-indigo-400/80' : 'text-slate-300'}>{log}</p>))}</div></div>)}
              <div className="bg-[#050508] border border-white/10 rounded-xl p-4 font-mono text-xs">
                <p className="text-slate-500 mb-2 flex justify-between"><span>&gt;_ CACHE COMPILER TRACE</span><span>{buildProgress}%</span></p>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-3"><div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${buildProgress}%` }}></div></div>
                <div className="space-y-1 max-h-[80px] overflow-y-auto text-slate-400 text-[11px]">
                  {buildLogs.length === 0 && <p className="text-slate-600 italic">Static system listening. Ready for active build payload cycles.</p>}
                  {buildLogs.map((l, i) => <p key={i}>&gt; {l}</p>)}
                </div>
              </div>
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.01]">
                <div className="bg-[#0e0e14] border-b border-white/10 px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div><div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div></div>
                  <div className="flex-1 bg-black/30 rounded py-0.5 px-3 text-[11px] font-mono text-slate-500 tracking-tight truncate">https://{deployedAppName.toLowerCase().replace(/\s+/g, '-')}.aura.app/dev-sandbox</div>
                </div>
                <div className={`p-6 min-h-[260px] ${sandboxDarkMode ? 'bg-[#0c0c12] text-white' : 'bg-slate-50 text-slate-900'}`}>
                  <div className="flex justify-between items-center border-b pb-3 mb-4" style={{ borderColor: sandboxDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' }}>
                    <div><span className="font-extrabold text-xs block leading-none">{deployedAppName}</span><span className="text-[9px] text-slate-500">Live Hydrated Component Memory</span></div>
                    <button onClick={() => setSandboxDarkMode(!sandboxDarkMode)} className="p-1 rounded text-slate-500 hover:bg-white/5">{sandboxDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <form onSubmit={addInvoice} className="sm:col-span-5 p-3.5 rounded-xl border space-y-2 bg-white/[0.01]" style={{ borderColor: sandboxDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)' }}>
                      <input type="text" value={newClient} onChange={(e) => setNewClient(e.target.value)} placeholder="Client Name" className="w-full text-xs p-2 rounded bg-transparent border border-white/10" required />
                      <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amount ($)" className="w-full text-xs p-2 rounded bg-transparent border border-white/10" required />
                      <button type="submit" className={`w-full py-2 text-xs text-white font-bold rounded ${sandboxStyles.bg}`}>Commit Row</button>
                    </form>
                    <div className="sm:col-span-7 space-y-1.5 max-h-[160px] overflow-y-auto">
                      {sandboxInvoices.map(inv => (
                        <div key={inv.id} className="p-2.5 rounded-lg border text-[11px] flex justify-between items-center bg-white/[0.01]" style={{ borderColor: sandboxDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                          <div><span className="font-bold">{inv.client}</span><span className="text-[9px] text-slate-500 block">{inv.id}</span></div>
                          <span className="font-mono font-bold">${inv.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'agents' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="mb-6"><h2 className="text-2xl font-black text-white">Agent Thread Matrix</h2><p className="text-slate-400 text-xs">Calibrate token budgets. Changes commit to local database engines instantly.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {agents.map((ag) => (
              <div key={ag.id} className="p-5 bg-[#0f0f16] border border-white/5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4"><div><h4 className="font-bold text-white text-sm">{ag.name}</h4><span className="text-[11px] text-slate-500">{ag.role}</span></div></div>
                  <div className="space-y-3">
                    <div><div className="flex justify-between text-[11px] mb-1"><span className="text-slate-400">Model Temperature Vector</span><span className="text-white font-mono">{ag.temperature}</span></div><input type="range" min="0" max="1" step="0.1" value={ag.temperature} onChange={(e) => { const val = parseFloat(e.target.value); setAgents(agents.map(a => a.id === ag.id ? { ...a, temperature: val } : a)); }} className="w-full accent-indigo-500 h-1 bg-white/5 rounded" /></div>
                    <div><div className="flex justify-between text-[11px] mb-1"><span className="text-slate-400">Compute Allocation Cap</span><span className="text-white font-mono">${ag.budget}</span></div><input type="range" min="50" max="2000" step="50" value={ag.budget} onChange={(e) => { const val = parseInt(e.target.value); setAgents(agents.map(a => a.id === ag.id ? { ...a, budget: val } : a)); }} className="w-full accent-indigo-500 h-1 bg-white/5 rounded" /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'pricing' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-white">Scale Compute Tiers</h2>
            <p className="text-slate-400 text-xs mt-1">Adjust scaling allocation. Upgrading routes the secure checkout payload directly to Stripe API servers.</p>
            <div className="mt-5 inline-flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.02] border border-white/5">
              <button onClick={() => setBillingPeriod('monthly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${billingPeriod === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Monthly</button>
              <button onClick={() => setBillingPeriod('yearly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${billingPeriod === 'yearly' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Yearly (Save 20%)</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {['Sandbox', 'Solo', 'Scale'].map((t) => (
              <div key={t} className={`p-5 rounded-2xl bg-[#0f0f16] border flex flex-col justify-between ${currentTier === t ? 'border-indigo-500 shadow-lg' : 'border-white/5'}`}>
                <div><h3 className="font-extrabold text-white text-base">{t} Node Cluster</h3><p className="text-xs text-slate-400 my-3 leading-relaxed">Expand simulation framework token targets and scale computational limits inside database loops.</p></div>
                <button onClick={() => handleUpgrade(t)} disabled={currentTier === t || isUpgrading !== null} className={`w-full py-2.5 text-xs font-bold rounded-xl mt-4 transition-all ${currentTier === t ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 cursor-default' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                  {isUpgrading === t ? 'Routing Node...' : currentTier === t ? 'Node Active' : `Select ${t} Profile`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'marketplace' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
            <div><h2 className="text-2xl font-black text-white">Agent Ecosystem & Plugins</h2><p className="text-slate-400 text-xs">Integrate third-party neural modules to perform specialized design and security pipelines.</p></div>
            <div className="flex items-center gap-2 bg-white/[0.02] p-1 rounded-xl border border-white/5 self-start md:self-auto">
              {['all', 'coding', 'marketing', 'infrastructure'].map((cat) => (<button key={cat} onClick={() => setMarketplaceFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${marketplaceFilter === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>{cat}</button>))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
            <div className="lg:col-span-8">
              <div className="relative mb-6"><Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" /><input type="text" placeholder="Search custom agents..." value={marketplaceSearch} onChange={(e) => setMarketplaceSearch(e.target.value)} className="w-full bg-[#0f0f16] border border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-xs text-white outline-none focus:border-indigo-500 transition-colors" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredMarketplace.map((item) => {
                  const isInstalled = installedMarketplaceIds.includes(item.id);
                  return (
                    <div key={item.id} className={`p-5 rounded-2xl bg-[#0f0f16] border transition-all ${isInstalled ? 'border-indigo-500 bg-indigo-500/[0.01]' : 'border-white/5'}`}>
                      <div className="flex justify-between items-start gap-3 mb-3"><div><h4 className="font-bold text-white text-sm">{item.name}</h4><span className="text-[10px] text-slate-500">By {item.developer}</span></div><span className="bg-white/5 text-[9px] text-slate-300 px-2 py-0.5 rounded font-mono font-semibold uppercase">{item.category}</span></div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[48px]">{item.description}</p>
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 mb-4 text-[10px] font-mono text-slate-500"><span className="font-semibold text-slate-300 block mb-1">CAPABILITY VECTOR:</span>{item.capabilities}</div>
                      <div className="flex justify-between items-center text-xs mt-6 pt-4 border-t border-white/5">
                        <span className="font-semibold text-white">{item.cost}</span>
                        <button onClick={() => toggleAgentInstallation(item.id, item.name)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isInstalled ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'}`}>{isInstalled ? 'De-register Node' : 'Integrate Node'}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="lg:col-span-4 bg-[#0f0f16] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5"><LockKeyhole className="w-5 h-5 text-indigo-400" /><h3 className="text-xs font-bold uppercase text-slate-300 tracking-wide">Credentials Vault</h3></div>
              <p className="text-[11px] text-slate-400 leading-relaxed">Plug in custom keys for live API models. If left blank, simulation nodes run inside local neural sandboxes using mock variables.</p>
              <div className="space-y-3 pt-2">
                <div><label className="block text-[10px] text-slate-500 mb-1 font-mono uppercase">DeepSeek API Key Override</label><input type="password" placeholder="sk-ds-••••••••••••••••" className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-400 outline-none focus:border-indigo-500 font-mono" /></div>
                <div><label className="block text-[10px] text-slate-500 mb-1 font-mono uppercase">Stripe Production Secret Key</label><input type="password" placeholder="sk_live_••••••••••••••••" className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-400 outline-none focus:border-indigo-500 font-mono" /></div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-slate-500 leading-relaxed"><span className="font-bold text-slate-300 block mb-0.5">TLS Certificate Active</span>Credentials are encrypted under AES-256 blocks before local synchronization. Aura never handles plain-text credentials over centralized telemetry routers.</div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/5 py-8 mt-20 bg-[#0a0a0e] text-center text-xs text-slate-600">© 2026 Aura Systems. Fully Persisted Local Sandbox Runtime.</footer>
    </div>
  );
}
