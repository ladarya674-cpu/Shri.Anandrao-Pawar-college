import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';

const ADMIN_SESSION_KEY = 'sap-college-admin-session';
const ADMIN_TOKEN_KEY = 'sap-college-admin-token';
const ADMIN_TAB_KEY = 'sap-college-admin-tab';
const CATEGORIES = ['Admission', 'Examination', 'Academic', 'Events & NSS', 'Sports', 'Scholarship', 'Library', 'General'];

interface Notice {
  id: string;
  title: string;
  category: string;
  important: boolean;
  content: string;
  filename: string | null;
  originalName: string | null;
  fileSize: string | null;
  uploadedAt: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Admin() {
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem(ADMIN_TOKEN_KEY));
  const loggedIn = Boolean(adminToken);
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Tab: 'notices' | 'enquiries'
  const [activeTab, setActiveTab] = useState<'notices' | 'enquiries'>(() => {
    return sessionStorage.getItem(ADMIN_TAB_KEY) === 'enquiries' ? 'enquiries' : 'notices';
  });

  const changeTab = (tab: 'notices' | 'enquiries') => {
    sessionStorage.setItem(ADMIN_TAB_KEY, tab);
    setActiveTab(tab);
  };

  // ── Notices state ───────────────────────────────────────────────────────────
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticesError, setNoticesError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Admission', important: false, content: '' });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Enquiries state ─────────────────────────────────────────────────────────
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState('');
  const [expandedEnquiry, setExpandedEnquiry] = useState<string | null>(null);

  const adminFetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (adminToken) headers.set('Authorization', `Bearer ${adminToken}`);
    return fetch(input, { ...init, headers });
  };

  // ── Data fetchers ───────────────────────────────────────────────────────────
  const fetchNotices = async () => {
    setNoticesLoading(true); setNoticesError('');
    try {
      const res = await adminFetch('/api/notices');
      if (res.status === 401) throw new Error('Your admin session has expired. Please sign in again.');
      if (!res.ok) throw new Error('Server error: ' + res.status);
      setNotices(await res.json());
    } catch {
      setNoticesError('Could not connect to backend. Make sure the server is running:\n  node backend/server.js');
    } finally { setNoticesLoading(false); }
  };

  const fetchEnquiries = async () => {
    setEnquiriesLoading(true); setEnquiriesError('');
    try {
      const res = await adminFetch('/api/enquiries');
      if (res.status === 401) throw new Error('Your admin session has expired. Please sign in again.');
      if (!res.ok) throw new Error('Server error: ' + res.status);
      setEnquiries(await res.json());
    } catch {
      setEnquiriesError('Could not load enquiries. Make sure the backend is running.');
    } finally { setEnquiriesLoading(false); }
  };

  useEffect(() => {
    if (loggedIn) { fetchNotices(); fetchEnquiries(); }
  }, [loggedIn]);

  // ── Login ───────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid username or password.');
      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'active');
      setAdminToken(data.token);
    } catch (error: unknown) {
      setLoginError(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken(null);
  };

  // ── Notice: PDF select ──────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPdfError('');
    if (file) {
      if (file.type !== 'application/pdf') { setPdfError('Only PDF files are allowed.'); setPdfFile(null); e.target.value = ''; return; }
      if (file.size > 20 * 1024 * 1024) { setPdfError('File too large. Max 20 MB.'); setPdfFile(null); e.target.value = ''; return; }
    }
    setPdfFile(file);
  };

  // ── Notice: Publish ─────────────────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true); setNoticesError('');
    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('category', form.category);
      fd.append('important', String(form.important));
      fd.append('content', form.content.trim());
      if (pdfFile) fd.append('pdf', pdfFile);
      const res = await adminFetch('/api/notices', { method: 'POST', body: fd });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Upload failed'); }
      await fetchNotices();
      setForm({ title: '', category: 'Admission', important: false, content: '' });
      setPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowAddForm(false);
    } catch (e: unknown) {
      setNoticesError(e instanceof Error ? e.message : 'Failed to publish notice.');
    } finally { setSubmitting(false); }
  };

  // ── Notice: Delete ──────────────────────────────────────────────────────────
  const handleDeleteNotice = async (id: string) => {
    if (!confirm('Delete this notice and its PDF?')) return;
    try {
      const res = await adminFetch(`/api/notices/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (e: unknown) { setNoticesError(e instanceof Error ? e.message : 'Delete failed.'); }
  };

  // ── Enquiry: Mark as read ───────────────────────────────────────────────────
  const handleMarkRead = async (id: string) => {
    try {
      await adminFetch(`/api/enquiries/${id}/read`, { method: 'PATCH' });
      setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, read: true } : e));
    } catch { /* silent */ }
  };

  // ── Enquiry: Delete ─────────────────────────────────────────────────────────
  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Delete this enquiry permanently?')) return;
    try {
      const res = await adminFetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      setExpandedEnquiry((current) => current === id ? null : current);
      changeTab('enquiries');
    } catch (e: unknown) { setEnquiriesError(e instanceof Error ? e.message : 'Delete failed.'); }
  };

  // ── Enquiry: Expand + auto-mark read ───────────────────────────────────────
  const handleExpandEnquiry = async (enq: Enquiry) => {
    if (expandedEnquiry === enq.id) { setExpandedEnquiry(null); return; }
    setExpandedEnquiry(enq.id);
    if (!enq.read) await handleMarkRead(enq.id);
  };

  const unreadCount = enquiries.filter((e) => !e.read).length;

  // ── Login Screen ─────────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md text-white font-bold text-2xl" style={{ backgroundColor: '#1e3764' }}>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif' }}>SAP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1e3764' }}>Admin Portal</h1>
            <p className="text-slate-500 text-xs sm:text-sm">Shri. Anandrao Pawar Mahavidyalaya</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Username</label>
              <input type="text" required value={creds.username} onChange={(e) => setCreds({ ...creds, username: e.target.value })} placeholder="admin"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e07b00] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Password</label>
              <input type="password" required value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} placeholder="••••••••"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e07b00] focus:border-transparent transition-all" />
            </div>
            {loginError && <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-red-700 text-xs font-medium">{loginError}</div>}
            <button type="submit" disabled={loginSubmitting} className="w-full py-3 text-white font-semibold rounded-xl text-sm transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed" style={{ backgroundColor: '#e07b00' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c06800')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e07b00')}>
              {loginSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm" style={{ backgroundColor: '#1e3764' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-xs">SAP</div>
          <div>
            <h1 className="font-bold text-base sm:text-lg" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>Admin Management Portal</h1>
            <p className="text-blue-200 text-xs hidden sm:block">Shri. Anandrao Pawar Mahavidyalaya, Chiplun</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notices" className="text-xs text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 hidden sm:inline-block">Preview Public Board</Link>
          <button type="button" onClick={handleLogout} className="text-xs border border-white/30 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors font-semibold">Sign Out</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { val: notices.length, label: 'Active Notices', icon: '📋' },
            { val: notices.filter((n) => n.important).length, label: 'Urgent Notices', icon: '⚠️' },
            { val: notices.filter((n) => n.filename).length, label: 'PDF Attachments', icon: '📄' },
            { val: unreadCount, label: 'Unread Enquiries', icon: '📬', highlight: unreadCount > 0 },
          ].map((s) => (
            <div key={s.label} className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3.5 ${(s as { highlight?: boolean }).highlight ? 'border-amber-400 bg-amber-50/40' : 'border-slate-200'}`}>
              <span className="text-2xl sm:text-3xl">{s.icon}</span>
              <div>
                <p className="font-bold text-xl sm:text-2xl text-[#1e3764]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{s.val}</p>
                <p className="text-slate-500 text-xs font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm w-fit">
          <button
            onClick={() => changeTab('notices')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'notices' ? 'text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            style={{ backgroundColor: activeTab === 'notices' ? '#1e3764' : 'transparent' }}
          >
            📋 Notice Board
          </button>
          <button
            onClick={() => changeTab('enquiries')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'enquiries' ? 'text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            style={{ backgroundColor: activeTab === 'enquiries' ? '#1e3764' : 'transparent' }}
          >
            📬 Student Enquiries
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{unreadCount}</span>
            )}
          </button>
        </div>

        {/* ── NOTICES TAB ─────────────────────────────────────────────────────── */}
        {activeTab === 'notices' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-200 gap-3" style={{ backgroundColor: '#f8fafc' }}>
              <div>
                <h2 className="font-bold text-base sm:text-lg text-[#1e3764]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>Notice Board Management</h2>
                <p className="text-xs text-slate-500">Publish, update, or remove student circulars. PDFs are stored on the server.</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={fetchNotices} className="text-xs px-3 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-600" title="Refresh">🔄 Refresh</button>
                <button type="button" onClick={() => setShowAddForm(!showAddForm)}
                  className="text-xs px-4 py-2 text-white rounded-xl font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  style={{ backgroundColor: '#e07b00' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c06800')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e07b00')}>
                  {showAddForm ? '✕ Close Form' : '+ Publish New Notice'}
                </button>
              </div>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <form onSubmit={handleAdd} className="p-6 bg-amber-50/50 border-b border-amber-200 space-y-4">
                <h3 className="font-bold text-sm text-[#1e3764]">Create Official Notice Circular</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Notice Title <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter circular title..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e07b00] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Notice Description</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Brief description..." rows={3}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e07b00] focus:border-transparent resize-none" />
                </div>
                {/* PDF Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Attach PDF <span className="text-slate-400 font-normal">(optional, max 20 MB)</span></label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-white hover:border-[#e07b00] transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
                    {pdfFile ? (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{pdfFile.name}</p>
                          <p className="text-xs text-slate-500">{(pdfFile.size / 1024).toFixed(0)} KB · PDF</p>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setPdfFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded-lg hover:bg-red-50">Remove</button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-3xl block mb-1">📁</span>
                        <p className="text-sm font-medium text-slate-600">Click to select PDF file</p>
                        <p className="text-xs text-slate-400 mt-0.5">Only .pdf · Max 20 MB</p>
                      </div>
                    )}
                  </div>
                  {pdfError && <p className="text-xs text-red-600 mt-1.5 font-medium">{pdfError}</p>}
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e07b00]">
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200 self-end">
                    <input type="checkbox" checked={form.important} onChange={(e) => setForm({ ...form, important: e.target.checked })} className="rounded" />
                    Mark as Urgent / Important
                  </label>
                  <div className="flex gap-2 ml-auto w-full sm:w-auto self-end">
                    <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 sm:flex-none text-xs px-4 py-2 border border-slate-300 rounded-xl hover:bg-white transition-colors">Cancel</button>
                    <button type="submit" disabled={submitting}
                      className="flex-1 sm:flex-none text-xs px-5 py-2 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                      style={{ backgroundColor: '#1e3764' }}>
                      {submitting ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />Uploading...</> : 'Publish Notice'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {noticesError && <div className="mx-6 my-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs whitespace-pre-line"><span className="font-bold">⚠️ </span>{noticesError}</div>}

            {noticesLoading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-[#1e3764] rounded-full mb-3" />
                <p className="text-sm font-medium">Loading notices...</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notices.length === 0 && (
                  <div className="p-12 text-center text-slate-400">
                    <span className="text-4xl block mb-2">📭</span>
                    <p className="text-sm font-semibold text-slate-600">No notices yet.</p>
                    <p className="text-xs mt-1">Click "+ Publish New Notice" to add the first one.</p>
                  </div>
                )}
                {notices.map((n) => (
                  <div key={n.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 sm:py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: n.important ? '#e07b00' : '#1e3764' }}>
                        {new Date(n.uploadedAt).getDate().toString().padStart(2, '0')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff3e0', color: '#c06800' }}>{n.category}</span>
                          {n.important && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Important</span>}
                          {n.filename && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">📄 PDF</span>}
                          <span className="text-xs text-slate-400">{formatDateShort(n.uploadedAt)}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 truncate">{n.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Uploaded: {formatDateTime(n.uploadedAt)}
                          {n.fileSize && <span className="ml-2 text-blue-500">· {n.fileSize}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      {n.filename && (
                        <a href={`/api/uploads/${n.filename}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1">
                          <span>👁</span> View PDF
                        </a>
                      )}
                      <button type="button" onClick={() => handleDeleteNotice(n.id)}
                        className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1">
                        <span>🗑</span> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ENQUIRIES TAB ────────────────────────────────────────────────────── */}
        {activeTab === 'enquiries' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-200 gap-3" style={{ backgroundColor: '#f8fafc' }}>
              <div>
                <h2 className="font-bold text-base sm:text-lg text-[#1e3764]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>Student Enquiries</h2>
                <p className="text-xs text-slate-500">All contact form submissions from students. Unread messages are highlighted.</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={fetchEnquiries} className="text-xs px-3 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-600">🔄 Refresh</button>
                {unreadCount > 0 && (
                  <span className="text-xs font-bold px-3 py-2 rounded-xl bg-red-100 text-red-700">{unreadCount} unread</span>
                )}
              </div>
            </div>

            {enquiriesError && <div className="mx-6 my-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs"><span className="font-bold">⚠️ </span>{enquiriesError}</div>}

            {enquiriesLoading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-[#1e3764] rounded-full mb-3" />
                <p className="text-sm font-medium">Loading enquiries...</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {enquiries.length === 0 && (
                  <div className="p-12 text-center text-slate-400">
                    <span className="text-4xl block mb-2">📭</span>
                    <p className="text-sm font-semibold text-slate-600">No enquiries yet.</p>
                    <p className="text-xs mt-1">Student submissions from the Contact page will appear here.</p>
                  </div>
                )}
                {enquiries.map((enq) => (
                  <div key={enq.id} className={`transition-colors ${!enq.read ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}>
                    {/* Enquiry Row */}
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 sm:py-4 cursor-pointer"
                      onClick={() => handleExpandEnquiry(enq)}
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: !enq.read ? '#1e3764' : '#64748b' }}>
                          {enq.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            {!enq.read && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">NEW</span>
                            )}
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff3e0', color: '#c06800' }}>
                              {enq.subject.length > 30 ? enq.subject.slice(0, 30) + '…' : enq.subject}
                            </span>
                            <span className="text-xs text-slate-400">{formatDateTime(enq.submittedAt)}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800">{enq.name}</p>
                          <p className="text-xs text-slate-500">
                            📧 {enq.email}
                            {enq.phone && <span className="ml-3">📞 {enq.phone}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <span className="text-xs text-slate-400">{expandedEnquiry === enq.id ? '▲' : '▼'}</span>
                        <button type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); void handleDeleteEnquiry(enq.id); }}
                          className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1">
                          <span>🗑</span> Delete
                        </button>
                      </div>
                    </div>

                    {/* Expanded Message */}
                    {expandedEnquiry === enq.id && (
                      <div className="px-6 pb-5">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">
                          <p className="text-xs font-bold text-[#1e3764] uppercase tracking-wider mb-2">Message</p>
                          <p className="whitespace-pre-wrap">{enq.message}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg">📅 Received: {formatDateTime(enq.submittedAt)}</span>
                          <a href={`mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject)}`}
                            className="bg-[#1e3764] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#0d2444] transition-colors flex items-center gap-1">
                            ✉️ Reply via Gmail
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
