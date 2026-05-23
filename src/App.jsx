// ARTECO — Art Logistics Operating System
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import {
  LayoutDashboard, Package, MapPin, Users, ArrowLeftRight, ArrowLeft, Search, Plus,
  X, Edit3, Boxes, Truck, ShieldCheck, AlertTriangle, ClipboardCheck, Eye,
  Sparkles, Printer, QrCode, Layers, FileUp, Check, Trash2, Gauge, Clock,
  Image as ImageIcon, Star, Receipt, CheckCircle2, FileText, PanelLeftClose, PanelLeftOpen, LayoutGrid, ChevronRight, ChevronDown, Bell, Settings,
  Wrench, Building2, Banknote, Wallet, UserCircle2, ArrowRight,
  Globe, Briefcase, BookOpen, CalendarDays, Network
} from "lucide-react";

import { ARTECO_LOGO } from "./logo.js";
import * as C from "./constants.js";
import * as H from "./helpers.js";
import { seed } from "./seed.js";
import Style from "./styles.jsx";
import { NAV, VIEW_DOMAIN, DOMAIN_BY, viewLabel, viewIcon, VIEW_LABEL,
         Sidebar, TabStrip, Topbar, Stat, Pill, SubNav, Modal, ModalFoot, L,
         LoginScreen, FlowTile, MetricCard } from "./components/ui.jsx";
import { DocFolder, CustomerLookupModal, PartyCard, CrateCalc, DocsPanel } from "./components/shared.jsx";
import { MainDashboard, Dashboard } from "./views/dashboard.jsx";
import { QuotationsView, QuoteForm, ClientsView, ClientForm, FollowUpsView,
         LeadsView, LeadForm, RequestIntake, QuoteDocumentModal, printQuote } from "./views/crm.jsx";
import { ObjectsView, ObjectDetail, ObjectForm, PackagesView, PackageForm,
         MovementsView, MovementForm, ConfirmIntakeForm,
         StorageAccountsView, StorageAccountForm, StorageView, IntakeView,
         FacilityMap, LocationsView, LocationForm, MappingView, SpaceForm } from "./views/storage.jsx";
import { OpsOverview, JobCockpit, JobsView, JobForm,
         DispatchView, MyTasksView, AgentsView, AgentForm,
         printFreightDoc, printConditionReport, printLabel,
         printOpsDoc, workflowTemplate } from "./views/operations.jsx";
import { TeamsView, TeamForm, FleetView, FleetForm,
         EquipmentView, EquipmentForm, MaterialsView, MaterialForm,
         VendorsView, VendorForm, InvoicesView, InvoiceForm,
         GLCodesView, CatalogView, CatalogForm,
         SettingsView, SettingsModal, UsersView } from "./views/other.jsx";

// Re-export helpers used in App
const { uid, fmtMoney, fmtDate, lineAmt, quoteSubtotal, quoteVat, quoteTotal,
        quoteCost, quoteMargin, nextFollowUp, addDays, processImage,
        partyAddr, partyOneLine, makeEntry } = H;
const { SK, JOB_TYPES, MODES, movementsFor, JOB_CONFIGS, configToLines,
        SERVICE_CAT_BY, DEFAULT_EXCLUSIONS, DEFAULT_TERMS,
        QUOTE_STATUS, PROJECT_TYPES, BILLING_MODELS, PERIODS,
        TASK_STATUS, roleCanSee, canAllocate, SACCT_STATUS, ARTECO_PARTY } = C;
const { loadCol, saveCol } = H;

export default function App() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("dashboard");
  const [navHist, setNavHist] = useState([]);
  const [tabs, setTabs] = useState([{ v: "dashboard", pinned: true }]);
  const viewRef = useRef("dashboard");
  useEffect(() => { viewRef.current = view; }, [view]);
  const [objects, setObjects] = useState([]);
  const [packages, setPackages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [clients, setClients] = useState([]);
  const [movements, setMovements] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [storageAccts, setStorageAccts] = useState([]);
  const [notifications, setNotifications] = useState(() => { const v = loadCol(SK.notifications, []); return Array.isArray(v) ? v : []; });
  const [currentUserId, setCurrentUserId] = useState(() => { const v = loadCol(SK.currentUser, ""); return typeof v === "string" ? v : ""; });
  const [selectedId, setSelectedId] = useState(null);
  const [focusPkgId, setFocusPkgId] = useState(null);
  const [brandLogo, setBrandLogo] = useState(null);
  const [brandName, setBrandName] = useState("ARTECO");
  const [sysTerms, setSysTerms] = useState({ exclusions: DEFAULT_EXCLUSIONS, terms: DEFAULT_TERMS });
  const [catalog, setCatalog] = useState(SERVICE_CATALOG);
  const [glLabels, setGlLabels] = useState({});
  const [users, setUsers] = useState([]);
  const [authUserId, setAuthUserId] = useState(() => { const v = loadCol(SK.session, ""); return typeof v === "string" ? v : ""; });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [objForm, setObjForm] = useState(null);
  const [pkgForm, setPkgForm] = useState(null);
  const [moveForm, setMoveForm] = useState(null);
  const [confirmForm, setConfirmForm] = useState(null);
  const [quoteForm, setQuoteForm] = useState(null);
  const [projectForm, setProjectForm] = useState(null);
  const [taskForm, setTaskForm] = useState(null);
  const [teamForm, setTeamForm] = useState(null);
  const [fleetForm, setFleetForm] = useState(null);
  const [equipmentForm, setEquipmentForm] = useState(null);
  const [materialForm, setMaterialForm] = useState(null);
  const [vendorForm, setVendorForm] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState(null);
  const [agentForm, setAgentForm] = useState(null);
  const [catalogForm, setCatalogForm] = useState(null);
  const [leadForm, setLeadForm] = useState(null);
  const [previewQuote, setPreviewQuote] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [reqIntake, setReqIntake] = useState(false);
  const [storageAcctForm, setStorageAcctForm] = useState(null);
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fCat, setFCat] = useState("");
  const [fCustody, setFCustody] = useState("");

  useEffect(() => {
    const id = "arteco-fonts";
    if (!document.getElementById(id)) {
      const l = document.createElement("link"); l.id = id; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const seeded = await loadCol(SK.seeded, false);
      if (!seeded) {
        const s = seed();
        setClients(s.cl); setLocations(s.loc); setPackages(s.pk); setObjects(s.obj); setMovements(s.mv); setSpaces(s.sp); setQuotes(s.qt); setProjects(s.pj); setTasks(s.tk); setTeam(s.tm); setFleet(s.fl); setEquipment(s.eq); setMaterials(s.mt); setVendors(s.vn); setInvoices(s.inv); setAgents(s.ag); setLeads(s.ld); setUsers(s.users); setStorageAccts(s.sacct);
        await Promise.all([saveCol(SK.users, s.users), saveCol(SK.storageAccts, s.sacct), saveCol(SK.clients, s.cl), saveCol(SK.locations, s.loc), saveCol(SK.packages, s.pk), saveCol(SK.objects, s.obj), saveCol(SK.movements, s.mv), saveCol(SK.spaces, s.sp), saveCol(SK.quotes, s.qt), saveCol(SK.projects, s.pj), saveCol(SK.tasks, s.tk), saveCol(SK.team, s.tm), saveCol(SK.fleet, s.fl), saveCol(SK.equipment, s.eq), saveCol(SK.materials, s.mt), saveCol(SK.vendors, s.vn), saveCol(SK.invoices, s.inv), saveCol(SK.agents, s.ag), saveCol(SK.leads, s.ld), saveCol(SK.seeded, true)]);
        const admin = s.users.find(u => u.role === "Admin"); if (admin) { setAuthUserId(admin.id); saveCol(SK.session, admin.id); }
      } else {
        setClients(await loadCol(SK.clients, [])); setLocations(await loadCol(SK.locations, []));
        setPackages(await loadCol(SK.packages, [])); setObjects(await loadCol(SK.objects, []));
        setMovements(await loadCol(SK.movements, [])); setSpaces(await loadCol(SK.spaces, []));
        setQuotes(await loadCol(SK.quotes, [])); setProjects(await loadCol(SK.projects, [])); setTasks(await loadCol(SK.tasks, []));
        setTeam(await loadCol(SK.team, [])); setFleet(await loadCol(SK.fleet, [])); setEquipment(await loadCol(SK.equipment, [])); setMaterials(await loadCol(SK.materials, [])); setVendors(await loadCol(SK.vendors, [])); setInvoices(await loadCol(SK.invoices, []));
        setAgents(await loadCol(SK.agents, [])); setLeads(await loadCol(SK.leads, []));
        { const u = await loadCol(SK.users, []); setUsers(Array.isArray(u) && u.length ? u : seed().users); }
        { const sa = await loadCol(SK.storageAccts, null); setStorageAccts(Array.isArray(sa) ? sa : seed().sacct); }
      }
      { const sess = await loadCol(SK.session, ""); if (sess) setAuthUserId(sess); }
      setReady(true);
    })();
  }, []);

  useEffect(() => { (async () => { setBrandLogo(await loadCol(SK.brand, null)); setBrandName(await loadCol(SK.brandName, "ARTECO")); setSysTerms(await loadCol(SK.terms, { exclusions: DEFAULT_EXCLUSIONS, terms: DEFAULT_TERMS })); setCatalog(await loadCol(SK.catalog, SERVICE_CATALOG)); setGlLabels(await loadCol(SK.glLabels, {})); })(); }, []);
  const saveBrand = useCallback((dataUrl) => { setBrandLogo(dataUrl); saveCol(SK.brand, dataUrl); }, []);
  const saveBrandName = useCallback((n) => { setBrandName(n); saveCol(SK.brandName, n); }, []);
  const saveSysTerms = useCallback((t) => { setSysTerms(t); saveCol(SK.terms, t); }, []);
  const saveCatalog = useCallback((n) => { setCatalog(n); saveCol(SK.catalog, n); }, []);
  const saveGlLabels = useCallback((n) => { setGlLabels(n); saveCol(SK.glLabels, n); }, []);
  const pUsers = useCallback((n) => { setUsers(n); saveCol(SK.users, n); }, []);
  const login = useCallback((username, password) => { const u = users.find(x => x.username === username && x.active); if (!u || u.password !== password) return false; setAuthUserId(u.id); saveCol(SK.session, u.id); return true; }, [users]);
  const logout = useCallback(() => { setAuthUserId(""); saveCol(SK.session, ""); }, []);
  const createAccount = useCallback((data) => { const nu = { id: uid(), teamId: "", name: data.name, email: data.email || "", username: data.username, password: data.password, role: "Operations", active: true }; setUsers(prev => { const next = [nu, ...prev]; saveCol(SK.users, next); return next; }); setAuthUserId(nu.id); saveCol(SK.session, nu.id); }, []);
  const catBy = useMemo(() => Object.fromEntries(catalog.map(s => [s.id, s])), [catalog]);
  const loadObjImages = useCallback(async (id) => { const stored = await loadCol(SK.imgs(id), []); if (stored && stored.length) return stored; const k = STAGE_ASSIGN[id]; return k && STAGE_IMG[k] ? [{ id: "seed-" + id, name: id, full: STAGE_IMG[k].full, thumb: STAGE_IMG[k].thumb, primary: true, caption: "" }] : []; }, []);

  const pObjects = useCallback((n) => { setObjects(n); saveCol(SK.objects, n); }, []);
  const pPackages = useCallback((n) => { setPackages(n); saveCol(SK.packages, n); }, []);
  const pMoves = useCallback((n) => { setMovements(n); saveCol(SK.movements, n); }, []);
  const pClients = useCallback((n) => { setClients(n); saveCol(SK.clients, n); }, []);
  const pLocations = useCallback((n) => { setLocations(n); saveCol(SK.locations, n); }, []);
  const pSpaces = useCallback((n) => { setSpaces(n); saveCol(SK.spaces, n); }, []);
  const pQuotes = useCallback((n) => { setQuotes(n); saveCol(SK.quotes, n); }, []);
  const pProjects = useCallback((n) => { setProjects(n); saveCol(SK.projects, n); }, []);
  const pTasks = useCallback((n) => { setTasks(n); saveCol(SK.tasks, n); }, []);
  const pTeam = useCallback((n) => { setTeam(n); saveCol(SK.team, n); }, []);
  const pFleet = useCallback((n) => { setFleet(n); saveCol(SK.fleet, n); }, []);
  const pEquipment = useCallback((n) => { setEquipment(n); saveCol(SK.equipment, n); }, []);
  const pMaterials = useCallback((n) => { setMaterials(n); saveCol(SK.materials, n); }, []);
  const pVendors = useCallback((n) => { setVendors(n); saveCol(SK.vendors, n); }, []);
  const pInvoices = useCallback((n) => { setInvoices(n); saveCol(SK.invoices, n); }, []);
  const pAgents = useCallback((n) => { setAgents(n); saveCol(SK.agents, n); }, []);
  const pLeads = useCallback((n) => { setLeads(n); saveCol(SK.leads, n); }, []);
  const pStorageAccts = useCallback((n) => { setStorageAccts(n); saveCol(SK.storageAccts, n); }, []);
  const notify = useCallback((n) => setNotifications(prev => { const next = [{ id: uid(), at: Date.now(), read: false, ...n }, ...prev].slice(0, 60); saveCol(SK.notifications, next); return next; }), []);
  const clearNotifs = useCallback(() => setNotifications(prev => { const next = prev.map(x => ({ ...x, read: true })); saveCol(SK.notifications, next); return next; }), []);
  const pCurrentUser = useCallback((v) => { setCurrentUserId(v); saveCol(SK.currentUser, v); }, []);
  const toggleMyTask = (jobId, sk, tid) => pProjects(projects.map(j => j.id !== jobId ? j : { ...j, workflow: (j.workflow || []).map(st => st.key === sk ? { ...st, tasks: st.tasks.map(x => x.id === tid ? { ...x, done: !x.done } : x) } : st) }));

  const clientById = useMemo(() => Object.fromEntries(clients.map(c => [c.id, c])), [clients]);
  const locById = useMemo(() => Object.fromEntries(locations.map(l => [l.id, l])), [locations]);
  const pkgById = useMemo(() => Object.fromEntries(packages.map(k => [k.id, k])), [packages]);
  const spaceById = useMemo(() => Object.fromEntries(spaces.map(s => [s.id, s])), [spaces]);
  const quoteById = useMemo(() => Object.fromEntries(quotes.map(q => [q.id, q])), [quotes]);
  const projectById = useMemo(() => Object.fromEntries(projects.map(j => [j.id, j])), [projects]);
  const agentById = useMemo(() => Object.fromEntries(agents.map(a => [a.id, a])), [agents]);
  const selected = useMemo(() => objects.find(o => o.id === selectedId) || null, [objects, selectedId]);

  const nextObjRef = useCallback(() => {
    const nums = objects.map(o => parseInt((o.ref || "").replace(/\D/g, ""), 10)).filter(n => !isNaN(n));
    return `ARTECO-DXB-${String((nums.length ? Math.max(...nums) : 117) + 1).padStart(5, "0")}`;
  }, [objects]);

  const saveObject = (data) => {
    if (data.id) pObjects(objects.map(o => o.id === data.id ? { ...o, ...data } : o));
    else pObjects([{ ...data, id: uid(), ref: data.ref || nextObjRef(), createdAt: new Date().toISOString().slice(0, 10), components: data.components || [], tags: data.tags || [], imageCount: 0, thumb: null }, ...objects]);
    setObjForm(null);
  };
  const savePackage = (data) => {
    if (data.id) pPackages(packages.map(k => k.id === data.id ? { ...k, ...data } : k));
    else pPackages([{ ...data, id: uid() }, ...packages]);
    setPkgForm(null);
  };

  const nextSeqRef = () => { const yr = new Date().getFullYear(); const nums = [...quotes, ...projects].map(r => parseInt(String(r.ref || "").replace(/\D/g, "").slice(-3), 10)).filter(x => !isNaN(x)); const n = (nums.length ? Math.max(...nums) : 30) + 1; return `${yr}-${String(n).padStart(3, "0")}`; };
  const nextQuoteRef = () => nextSeqRef();
  const nextProjectRef = () => nextSeqRef();
  const nextClientRef = () => { const nums = clients.map(c => parseInt(String(c.ref || "").replace(/\D/g, ""), 10)).filter(x => !isNaN(x)); return `CUS-${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, "0")}`; };
  const saveQuote = (data) => { if (data.id) pQuotes(quotes.map(q => q.id === data.id ? { ...q, ...data } : q)); else pQuotes([{ ...data, id: uid(), ref: data.ref || nextQuoteRef() }, ...quotes]); setQuoteForm(null); };
  const convertQuote = (q) => {
    const col = q._intakeCollection && (q._intakeCollection.address || q._intakeCollection.contact) ? [{ id: uid(), label: "Collection", address: q._intakeCollection.address || "", contact: q._intakeCollection.contact || "", date: "", status: "Planned", notes: "" }] : [];
    const del = q._intakeDelivery && (q._intakeDelivery.address || q._intakeDelivery.contact) ? [{ id: uid(), label: "Delivery", address: q._intakeDelivery.address || "", contact: q._intakeDelivery.contact || "", date: "", status: "Planned", notes: "" }] : [];
    const sharedRef = q.ref || nextProjectRef();
    const job = { id: uid(), ref: sharedRef, name: `${clientById[q.clientId]?.name || "Job"} — ${sharedRef}`, clientId: q.clientId, jobType: q.jobType || "Export", movement: q.movement || "Door-to-port", mode: q.mode || "Air", seaLoad: q.seaLoad || "", configKey: q.configKey || "", status: "Confirmed", startDate: new Date().toISOString().slice(0, 10), dueDate: "", objectIds: [], collections: col, deliveries: del, origin: q.origin || "", destination: q.destination || "", shipper: q.shipper || null, consignee: q.consignee || null, clientRef: q.clientRef || "", reference: q.reference || "", originAgentId: "", destAgentId: "", quoteId: q.id, notes: q.notes || "", crew: { team: [], fleet: [], equipment: [] }, freight: {}, files: [makeEntry({ kind: "System", title: "Job opened from quotation " + sharedRef }), ...(Array.isArray(q.files) ? q.files : [])] };
    job.workflow = workflowTemplate(job, objects, team);
    pProjects([job, ...projects]);
    pQuotes(quotes.map(x => x.id === q.id ? { ...x, status: "Converted", projectId: job.id } : x));
    setQuoteForm(null); setView("jobs"); setProjectForm(job);
  };
  const saveProject = (data) => { if (data.id) pProjects(projects.map(j => j.id === data.id ? { ...j, ...data } : j)); else { const nj = { ...data, id: uid(), ref: data.ref || nextProjectRef(), objectIds: data.objectIds || [] }; if (nj.workflow == null) nj.workflow = workflowTemplate(nj, objects, team); pProjects([nj, ...projects]); } setProjectForm(null); };
  const saveAgent = (data) => { if (data.id) pAgents(agents.map(a => a.id === data.id ? { ...a, ...data } : a)); else pAgents([{ ...data, id: uid() }, ...agents]); setAgentForm(null); };
  const saveCatalogItem = (data) => { if (data.id && catalog.some(c => c.id === data.id)) saveCatalog(catalog.map(c => c.id === data.id ? { ...c, ...data } : c)); else saveCatalog([{ ...data, id: data.id || ("CUSTOM-" + uid()) }, ...catalog]); setCatalogForm(null); };
  const saveLead = (data) => { if (data.id) pLeads(leads.map(l => l.id === data.id ? { ...l, ...data } : l)); else pLeads([{ ...data, id: uid(), createdAt: new Date().toISOString().slice(0, 10) }, ...leads]); setLeadForm(null); };
  const deleteLead = (id) => pLeads(leads.filter(l => l.id !== id));
  const acceptRequestDraft = (d) => {
    let cid = d._clientId;
    if (!cid) {
      const existing = clients.find(c => d.clientName && c.name && c.name.toLowerCase() === d.clientName.toLowerCase());
      if (existing) cid = existing.id;
      else { cid = uid(); pClients([{ id: cid, name: d.clientName || "New customer", type: "Gallery", contact: "", email: d.clientEmail || "", phone: d.clientPhone || "", address: d.collectionAddress || "", billingModel: "Volume", rate: 0, ratePeriod: "Monthly", currency: d.valueCcy || "AED", insuranceIncluded: false, insuranceRatePct: 0 }, ...clients]); }
    }
    const crates = (d.items || []).map(it => ({ id: uid(), label: [it.title, it.artist].filter(Boolean).join(" — ") || "Item", l: Number(it.d) || Number(it.w) || 0, w: Number(it.w) || 0, h: Number(it.h) || 0, weight: Number(it.weight) || 0, qty: 1 }));
    const files = [makeEntry({ kind: "Note", title: "Original client request", body: d._rawRequest || "" }), makeEntry({ kind: "System", title: "Draft generated by AI request intake" })];
    setReqIntake(false);
    setQuoteForm({ clientId: cid, jobType: d.jobType || "Export", movement: d.movement || "Door-to-port", mode: d.mode || "Air", origin: d.origin || "", destination: d.destination || "", value: d.declaredValue || "", valueCcy: d.valueCcy || "AED", reference: d.summary || "", crates, notes: d.notes || "", files, _intakeCollection: { address: d.collectionAddress, contact: d.collectionContact }, _intakeDelivery: { address: d.deliveryAddress, contact: d.deliveryContact } });
    go("estimate");
  };
  const convertLeadToEstimate = (lead) => {
    let cid = lead.clientId;
    if (!cid) { cid = uid(); pClients([{ id: cid, name: lead.company || lead.contact || "New customer", type: "Gallery", contact: lead.contact || "", email: lead.email || "", phone: lead.phone || "", address: "", billingModel: "Volume", rate: 0, ratePeriod: "Monthly", currency: lead.currency || "AED", insuranceIncluded: false, insuranceRatePct: 0 }, ...clients]); }
    pLeads(leads.map(l => l.id === lead.id ? { ...l, status: "Quoted" } : l));
    setQuoteForm({ clientId: cid, reference: lead.notes ? lead.notes.slice(0, 80) : "", currency: lead.currency || "AED", _fromLead: lead.id });
    go("estimate");
  };
  const setQuoteStatus = (q, status) => { const patch = { status }; if (status === "Sent" && !q.sentDate) { patch.sentDate = new Date().toISOString().slice(0, 10); patch.followLog = q.followLog || []; } patch.files = [makeEntry({ kind: "System", title: "Estimate marked " + status }), ...(Array.isArray(q.files) ? q.files : [])]; pQuotes(quotes.map(x => x.id === q.id ? { ...x, ...patch } : x)); };
  const logFollowUp = (q, note) => pQuotes(quotes.map(x => x.id === q.id ? { ...x, followLog: [...(x.followLog || []), { date: new Date().toISOString().slice(0, 10), note: note || "" }] } : x));
  const deleteCatalogItem = (id) => { saveCatalog(catalog.filter(c => c.id !== id)); setCatalogForm(null); };
  const saveTask = (data) => { if (data.id) pTasks(tasks.map(t => t.id === data.id ? { ...t, ...data } : t)); else pTasks([{ ...data, id: uid() }, ...tasks]); setTaskForm(null); };
  const advanceTask = (id) => pTasks(tasks.map(t => t.id === id ? { ...t, status: TASK_STATUS[(TASK_STATUS.indexOf(t.status) + 1) % TASK_STATUS.length] } : t));
  const deleteTask = (id) => pTasks(tasks.filter(t => t.id !== id));
  const go = useCallback((v) => {
    const cur = viewRef.current;
    if (v !== cur) setNavHist(h => [...h, cur]);
    setTabs(ts => {
      if (ts.some(t => t.v === v)) return ts;
      const ai = ts.findIndex(t => t.v === cur);
      if (ai >= 0 && !ts[ai].pinned) { const nt = ts.slice(); nt[ai] = { v, pinned: false }; return nt; }
      return [...ts, { v, pinned: false }];
    });
    setView(v); setSelectedId(null); setFocusPkgId(null);
  }, []);
  const goBack = useCallback(() => {
    setNavHist(h => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setTabs(ts => {
        if (ts.some(t => t.v === prev)) return ts;
        const ai = ts.findIndex(t => t.v === viewRef.current);
        if (ai >= 0 && !ts[ai].pinned) { const nt = ts.slice(); nt[ai] = { v: prev, pinned: false }; return nt; }
        return [...ts, { v: prev, pinned: false }];
      });
      setView(prev); setSelectedId(null); setFocusPkgId(null);
      return h.slice(0, -1);
    });
  }, []);
  const closeTab = useCallback((v) => { setTabs(ts => { const nt = ts.filter(t => t.v !== v); if (v === viewRef.current) { const fb = (nt[nt.length - 1] || { v: "dashboard" }).v; setView(fb); setSelectedId(null); setFocusPkgId(null); } return nt.length ? nt : [{ v: "dashboard", pinned: true }]; }); }, []);
  const pinTab = useCallback((v) => setTabs(ts => ts.map(t => t.v === v ? { ...t, pinned: !t.pinned } : t)), []);
  const upsert = (list, persist, data) => persist(data.id ? list.map(x => x.id === data.id ? { ...x, ...data } : x) : [{ ...data, id: uid() }, ...list]);
  const saveTeam = (d) => { upsert(team, pTeam, d); setTeamForm(null); };
  const saveFleet = (d) => { upsert(fleet, pFleet, d); setFleetForm(null); };
  const saveEquipment = (d) => { upsert(equipment, pEquipment, d); setEquipmentForm(null); };
  const saveMaterial = (d) => { upsert(materials, pMaterials, d); setMaterialForm(null); };
  const saveVendor = (d) => { upsert(vendors, pVendors, d); setVendorForm(null); };
  const nextInvRef = () => { const n = invoices.map(i => parseInt((i.ref || "").split("-").pop(), 10)).filter(x => !isNaN(x)); return `INV-2025-${String((n.length ? Math.max(...n) : 30) + 1).padStart(3, "0")}`; };
  const saveInvoice = (d) => { if (d.id) pInvoices(invoices.map(i => i.id === d.id ? { ...i, ...d } : i)); else pInvoices([{ ...d, id: uid(), ref: d.ref || nextInvRef() }, ...invoices]); setInvoiceForm(null); };

  const persistObjectImages = async (objId, images) => {
    await saveCol(SK.imgs(objId), images);
    const primary = images.find(i => i.primary) || images[0];
    pObjects(objects.map(o => o.id === objId ? { ...o, imageCount: images.length, thumb: primary ? primary.thumb : null } : o));
  };

  const createFromIntake = (records, clientId, locationId, packageId, custody) => {
    const physical = custody === "In custody";
    let n = objects.map(o => parseInt((o.ref || "").replace(/\D/g, ""), 10)).filter(x => !isNaN(x)).reduce((a, b) => Math.max(a, b), 117);
    const created = records.map(r => {
      n += 1;
      return {
        id: uid(), ref: `ARTECO-DXB-${String(n).padStart(5, "0")}`,
        title: r.title || "Untitled", artist: r.artist || "", year: r.year || "",
        category: CATEGORIES.includes(r.category) ? r.category : "Other", medium: r.medium || "",
        h: r.h || null, w: r.w || null, d: r.d || null, dimUnit: "cm", weight: r.weight || null, wUnit: "kg",
        flat: isFlatCat(CATEGORIES.includes(r.category) ? r.category : "Other"), framed: false, glazed: false, fh: "", fw: "", fd: "",
        edition: r.edition || "", clientId, value: r.value ?? null, ccy: r.ccy || "AED",
        custody, status: "In stock", locationId: physical ? locationId : null, packageId: physical ? (packageId || null) : null,
        customs: "Free Zone", customsRef: r.customsRef || "", customsExpiry: "", insuredByUs: false,
        condition: r.condition || "Excellent", conditionNote: r.notes || "", components: [], tags: [physical ? "intake" : "quote"],
        imageCount: 0, thumb: null, createdAt: new Date().toISOString().slice(0, 10),
      };
    });
    pObjects([...created, ...objects]);
    return created.length;
  };

  const confirmIntake = (objId, d) => {
    const st = statusFromLocType(locById[d.locationId]?.type);
    pObjects(objects.map(o => o.id === objId ? { ...o, custody: "In custody", status: st, locationId: d.locationId, packageId: d.packageId || null } : o));
    pMoves([{ id: uid(), subjectType: "Object", subjectId: objId, objectId: objId, type: "Intake", date: d.date, fromId: null, toId: d.locationId, handledBy: d.handledBy, conditionChecked: true, note: d.note || "Confirmed into custody from quotation stage.", ref: d.ref, createdAt: new Date().toISOString() }, ...movements]);
    setConfirmForm(null);
  };

  const explicitOrLoc = (type, locStatus) => {
    if (type === "To Conservator" || type === "Outbound") return "Out";
    if (type === "From Conservator" || type === "Return" || type === "Intake") return "In stock";
    return locStatus;
  };
  const saveMovement = (d) => {
    const mv = { ...d, id: uid(), createdAt: new Date().toISOString() };
    pMoves([mv, ...movements]);
    if (d.subjectType === "Package") {
      const conStatus = statusFromLocType(locById[d.toId]?.type);
      pPackages(packages.map(k => k.id === d.subjectId ? { ...k, locationId: d.toId, status: conStatus } : k));
      if (d.cascade) pObjects(objects.map(o => o.packageId === d.subjectId ? { ...o, locationId: d.toId, status: explicitOrLoc(d.type, conStatus) } : o));
    } else if (d.subjectType === "Object") {
      const targetLoc = d.toContainerId && d.toContainerId !== "LOOSE" ? (pkgById[d.toContainerId]?.locationId || d.toId) : d.toId;
      const st = explicitOrLoc(d.type, statusFromLocType(locById[targetLoc]?.type));
      pObjects(objects.map(o => o.id === d.subjectId ? { ...o, packageId: d.toContainerId === "LOOSE" ? null : (d.toContainerId || o.packageId), locationId: targetLoc || o.locationId, status: st, ...(d.conditionChecked && d.note ? { conditionNote: d.note } : {}) } : o));
    } else if (d.subjectType === "Component") {
      pObjects(objects.map(o => o.id === d.objectId ? { ...o, components: (o.components || []).map(c => c.id === d.subjectId ? { ...c, status: explicitOrLoc(d.type, "In stock"), note: d.note || c.note } : c) } : o));
    }
    setMoveForm(null);
  };

  if (!ready) return <div className="arteco-root"><Style /><div className="boot">Loading operations console…</div></div>;

  const authUser = users.find(u => u.id === authUserId) || null;
  if (!authUser) return <div className="arteco-root"><Style /><LoginScreen users={users} brandName={brandName} logo={brandLogo} onLogin={login} onCreateAccount={createAccount} /></div>;
  const role = authUser.role;

  return (
    <div className="arteco-root"><Style />
      <div className="shell">
        <Sidebar view={view} setView={go} logo={brandLogo} brandName={brandName} role={role} authUser={authUser} onLogout={logout} />
        <main className="main">
          <Topbar view={view} setView={go} objects={objects} packages={packages} canBack={navHist.length > 0} onBack={goBack} notifications={notifications} onClearNotifs={clearNotifs} onOpenJob={(id) => { setSelectedJobId(id); go("job"); }} />
          <div className="content">
            <SubNav items={(DOMAIN_BY[VIEW_DOMAIN[view]] || {}).items} view={view} setView={go} />
            {view === "dashboard" && <MainDashboard objects={objects} packages={packages} movements={movements} quotes={quotes} projects={projects} tasks={tasks} invoices={invoices} clients={clients} team={team} fleet={fleet} equipment={equipment} locById={locById} onNav={go} />}
            {view === "whoverview" && <Dashboard objects={objects} packages={packages} movements={movements} locById={locById} pkgById={pkgById} onOpen={(id) => { go("objects"); setSelectedId(id); }} />}
            {view === "ops" && <OpsOverview jobs={projects} tasks={tasks} clientById={clientById} team={team} objects={objects} onOpenJob={(id) => { setSelectedJobId(id); go("job"); }} onNav={go} />}
            {view === "objects" && <ObjectsView objects={objects} clientById={clientById} locById={locById} pkgById={pkgById} search={search} setSearch={setSearch} fStatus={fStatus} setFStatus={setFStatus} fCat={fCat} setFCat={setFCat} fCustody={fCustody} setFCustody={setFCustody} onSelect={setSelectedId} onNew={() => setObjForm({})} onTab={(v) => { setView(v); setSelectedId(null); }} />}
            {view === "packages" && <PackagesView packages={packages} objects={objects} clientById={clientById} locById={locById} spaceById={spaceById} focusId={focusPkgId} onNew={() => setPkgForm({})} onEdit={(k) => setPkgForm(k)} onMove={(k) => setMoveForm({ subjectType: "Package", subjectId: k.id, fromId: k.locationId })} onLabel={(k) => printLabel(k, clientById[k.clientId], locById[k.locationId], objects.filter(o => o.packageId === k.id), brandName)} onSelectObj={(id) => { setView("objects"); setSelectedId(id); }} onTab={(v) => { setView(v); setSelectedId(null); }} />}
            {view === "movements" && <MovementsView movements={movements} objects={objects} packages={packages} locById={locById} onNew={() => setMoveForm({})} />}
            {view === "storageaccts" && <StorageAccountsView accounts={storageAccts} clients={clients} locations={locations} objects={objects} packages={packages} onNew={() => setStorageAcctForm({})} onEdit={(a) => setStorageAcctForm(a)} onSave={pStorageAccts} />}
            {view === "storage" && <StorageView clients={clients} locations={locations} packages={packages} objects={objects} />}
            {storageAcctForm !== null && <StorageAccountForm initial={storageAcctForm} clients={clients} locations={locations} accounts={storageAccts} onClose={() => setStorageAcctForm(null)} onSave={(data) => { if (data.id) pStorageAccts(storageAccts.map(a => a.id === data.id ? data : a)); else pStorageAccts([{ ...data, id: uid() }, ...storageAccts]); setStorageAcctForm(null); }} />}
            {view === "intake" && <IntakeView clients={clients} locations={locations} packages={packages} onCreate={createFromIntake} />}
            {view === "locations" && <LocationsView locations={locations} packages={packages} objects={objects} spaces={spaces} onSave={(l) => pLocations(l.id ? locations.map(x => x.id === l.id ? l : x) : [...locations, { ...l, id: uid() }])} onAddSpace={(node) => pSpaces([...spaces, { ...node, id: uid() }])} onEditSpace={(node) => pSpaces(spaces.map(s => s.id === node.id ? node : s))} onDeleteSpace={(id) => { const kill = new Set(); const collect = (i) => { kill.add(i); spaces.filter(s => s.parentId === i).forEach(c => collect(c.id)); }; collect(id); pSpaces(spaces.filter(s => !kill.has(s.id))); pPackages(packages.map(k => kill.has(k.positionId) ? { ...k, positionId: null } : k)); }} />}
            {view === "clients" && <ClientsView clients={clients} objects={objects} packages={packages} onSave={(c) => { const addr = [c.street, [c.zip, c.city].filter(Boolean).join(" "), c.country].filter(Boolean).join(", "); const nc = { ...c, address: addr || c.address }; pClients(nc.id ? clients.map(x => x.id === nc.id ? nc : x) : [...clients, { ...nc, id: uid(), ref: nc.ref || nextClientRef() }]); }} />}
            {view === "team" && <TeamsView team={team} onNew={() => setTeamForm({})} onEdit={(t) => setTeamForm(t)} />}
            {view === "fleet" && <FleetView fleet={fleet} onNew={() => setFleetForm({})} onEdit={(f) => setFleetForm(f)} />}
            {view === "equipment" && <EquipmentView equipment={equipment} onNew={() => setEquipmentForm({})} onEdit={(e) => setEquipmentForm(e)} />}
            {view === "materials" && <MaterialsView materials={materials} onNew={() => setMaterialForm({})} onEdit={(m) => setMaterialForm(m)} />}
            {view === "vendors" && <VendorsView vendors={vendors} onNew={() => setVendorForm({})} onEdit={(v) => setVendorForm(v)} />}
            {view === "invoices" && <InvoicesView invoices={invoices} clientById={clientById} projectById={projectById} onNew={() => setInvoiceForm({})} onEdit={(i) => setInvoiceForm(i)} />}
            {view === "users" && <UsersView users={users} team={team} onSave={pUsers} authUserId={authUserId} />}
            {view === "settings" && <SettingsView logo={brandLogo} onSaveBrand={saveBrand} brandName={brandName} onSaveName={saveBrandName} sysTerms={sysTerms} onSaveTerms={saveSysTerms} counts={{ objects: objects.length, clients: clients.length, projects: projects.filter(p => p.status === "Confirmed").length }} />}
            {view === "quotes" && <QuotationsView quotes={quotes} projects={projects} clientById={clientById} onIntake={() => setReqIntake(true)} onNew={() => { setQuoteForm({}); go("estimate"); }} onEdit={(q) => { setQuoteForm(q); go("estimate"); }} onConvert={convertQuote} onStatus={setQuoteStatus} onLogFollow={logFollowUp} onPreview={(q) => setPreviewQuote(q)} />}
            {view === "leads" && <LeadsView leads={leads} onNew={() => setLeadForm({})} onEdit={(l) => setLeadForm(l)} onConvert={convertLeadToEstimate} />}
            {view === "followups" && <FollowUpsView quotes={quotes} leads={leads} clientById={clientById} onOpenQuote={(q) => setPreviewQuote(q)} onLogFollow={logFollowUp} onOpenLead={(l) => setLeadForm(l)} />}
            {view === "estimate" && quoteForm !== null && <QuoteForm initial={quoteForm} clients={clients} objects={objects} vendors={vendors} catalog={catalog} catBy={catBy} defaultExclusions={sysTerms.exclusions} defaultTerms={sysTerms.terms} brandName={brandName} onSave={(q) => { saveQuote(q); go("quotes"); }} onConvert={convertQuote} onPreview={(q) => setPreviewQuote(q)} onClose={() => { setQuoteForm(null); go("quotes"); }} />}
            {view === "jobs" && <JobsView jobs={projects} clientById={clientById} quoteById={quoteById} agentById={agentById} tasks={tasks} objects={objects} onNew={() => setProjectForm({})} onEdit={(j) => setProjectForm(j)} onOpen={(j) => { setSelectedJobId(j.id); go("job"); }} onOpenObject={(id) => { go("objects"); setSelectedId(id); }} onOpenTasks={() => go("tasks")} />}
            {view === "mytasks" && <MyTasksView team={team} objects={objects} currentUserId={authUser.teamId} canSwitch={role === "Admin"} onSetUser={pCurrentUser} jobs={projects} clientById={clientById} onToggle={toggleMyTask} onOpenJob={(id) => { setSelectedJobId(id); go("job"); }} brandName={brandName} />}
            {view === "job" && (() => { const cj = projects.find(j => j.id === selectedJobId); return cj ? <JobCockpit job={cj} client={clientById[cj.clientId]} objects={objects} team={team} fleet={fleet} equipment={equipment} agents={agents} locations={locations} packages={packages} quoteById={quoteById} brandName={brandName} role={role} onNotify={notify} onSave={(patch) => pProjects(projects.map(j => j.id === cj.id ? { ...j, ...patch } : j))} onEdit={(j) => setProjectForm(j)} onBack={() => go("jobs")} /> : <div className="dash"><div className="empty-row">Job not found.</div></div>; })()}
            {view === "catalog" && <CatalogView catalog={catalog} onSave={saveCatalog} onEdit={(svc) => setCatalogForm(svc)} onNew={() => setCatalogForm({})} />}
            {view === "glcodes" && <GLCodesView catalog={catalog} glLabels={glLabels} onSaveLabel={(code, label) => saveGlLabels({ ...glLabels, [code]: label })} />}
            {view === "agents" && <AgentsView agents={agents} onNew={() => setAgentForm({})} onEdit={(a) => setAgentForm(a)} />}
            {view === "dispatch" && <DispatchView jobs={projects} team={team} fleet={fleet} equipment={equipment} clientById={clientById} role={role} onSaveJob={(id, patch) => pProjects(projects.map(j => j.id === id ? { ...j, ...patch } : j))} onOpenJob={(id) => { setSelectedJobId(id); go("job"); }} onNotify={notify} />}
            {view === "tasks" && <OperationsView tasks={tasks} projectById={projectById} onAdvance={advanceTask} onNew={() => setTaskForm({})} onEdit={(t) => setTaskForm(t)} onDelete={deleteTask} />}
          </div>
        </main>
      </div>

      {selected && <ObjectDetail object={selected} objects={objects} clientById={clientById} locById={locById} pkgById={pkgById} movements={movements.filter(m => m.subjectId === selected.id || m.objectId === selected.id)} loadImages={() => loadObjImages(selected.id)} onImages={(imgs) => persistObjectImages(selected.id, imgs)} onOpenObject={(id) => setSelectedId(id)} onOpenPackage={(pid) => { setSelectedId(null); setFocusPkgId(pid); setView("packages"); }} onClose={() => setSelectedId(null)} onEdit={() => setObjForm(selected)} onMove={() => setMoveForm({ subjectType: "Object", subjectId: selected.id, fromId: selected.locationId, fromContainerId: selected.packageId })} onConfirm={() => setConfirmForm({ objectId: selected.id })} onReport={() => printConditionReport(selected, clientById[selected.clientId], locById[selected.locationId], pkgById[selected.packageId], brandName)} />}
      {objForm && <ObjectForm initial={objForm} clients={clients} locations={locations} packages={packages} nextRef={nextObjRef()} onClose={() => setObjForm(null)} onSave={saveObject} />}
      {pkgForm && <PackageForm initial={pkgForm} clients={clients} locations={locations} spaces={spaces} onClose={() => setPkgForm(null)} onSave={savePackage} />}
      {moveForm && <MovementForm initial={moveForm} objects={objects} packages={packages} locations={locations} pkgById={pkgById} onClose={() => setMoveForm(null)} onSave={saveMovement} />}
      {confirmForm && <ConfirmIntakeForm object={objects.find(o => o.id === confirmForm.objectId)} locations={locations} packages={packages} onClose={() => setConfirmForm(null)} onSave={(d) => confirmIntake(confirmForm.objectId, d)} />}
      {projectForm !== null && <JobForm initial={projectForm} clients={clients} quotes={quotes} objects={objects} agents={agents} onSave={saveProject} onClose={() => setProjectForm(null)} />}
      {agentForm !== null && <AgentForm initial={agentForm} onSave={saveAgent} onClose={() => setAgentForm(null)} />}
      {catalogForm !== null && <CatalogForm initial={catalogForm} onSave={saveCatalogItem} onDelete={deleteCatalogItem} onClose={() => setCatalogForm(null)} />}
      {leadForm !== null && <LeadForm initial={leadForm} clients={clients} onSave={saveLead} onDelete={deleteLead} onClose={() => setLeadForm(null)} />}
      {reqIntake && <RequestIntake clients={clients} agents={agents} onAccept={acceptRequestDraft} onClose={() => setReqIntake(false)} />}
            {previewQuote !== null && <QuoteDocumentModal quote={previewQuote} client={clientById[previewQuote.clientId]} brandName={brandName} logo={brandLogo} objects={objects} onPrint={() => printQuote(previewQuote, clientById[previewQuote.clientId], brandName, brandLogo, objects)} onClose={() => setPreviewQuote(null)} />}
      {taskForm !== null && <TaskForm initial={taskForm} projects={projects} onSave={saveTask} onClose={() => setTaskForm(null)} />}
      {teamForm !== null && <TeamForm initial={teamForm} onSave={saveTeam} onClose={() => setTeamForm(null)} />}
      {fleetForm !== null && <FleetForm initial={fleetForm} onSave={saveFleet} onClose={() => setFleetForm(null)} />}
      {equipmentForm !== null && <EquipmentForm initial={equipmentForm} onSave={saveEquipment} onClose={() => setEquipmentForm(null)} />}
      {materialForm !== null && <MaterialForm initial={materialForm} onSave={saveMaterial} onClose={() => setMaterialForm(null)} />}
      {vendorForm !== null && <VendorForm initial={vendorForm} onSave={saveVendor} onClose={() => setVendorForm(null)} />}
      {invoiceForm !== null && <InvoiceForm initial={invoiceForm} clients={clients} projects={projects} onSave={saveInvoice} onClose={() => setInvoiceForm(null)} />}
      {settingsOpen && <SettingsModal logo={brandLogo} onSave={saveBrand} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

