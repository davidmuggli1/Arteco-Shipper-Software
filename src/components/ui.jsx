// ARTECO UI components
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  LayoutDashboard, Package, MapPin, Users, ArrowLeftRight, ArrowLeft, Search, Plus,
  X, Edit3, Boxes, Truck, ShieldCheck, AlertTriangle, ClipboardCheck, Eye,
  Sparkles, Printer, QrCode, Layers, FileUp, Check, Trash2, Gauge, Clock,
  Image as ImageIcon, Star, Receipt, CheckCircle2, FileText, PanelLeftClose, PanelLeftOpen, LayoutGrid, ChevronRight, ChevronDown, Bell, Settings,
  Wrench, Building2, Banknote, Wallet, UserCircle2, ArrowRight,
  Globe, Briefcase, BookOpen, CalendarDays, Network
} from "lucide-react";

import { ARTECO_LOGO } from "../logo.js";
import * as C from "../constants.js";
import * as H from "../helpers.js";
import { STAGE_IMG, STAGE_ASSIGN } from "../seed.js";

// Re-export for convenience
const { fmtMoney, fmtDate, fmtDateTime, fmtVol, uid, daysUntil, inCustody, isStocked,
        objVolM3, objDimsCm, volM3, lineAmt, lineCost, quoteSubtotal, quoteVat, quoteTotal,
        quoteCost, quoteMargin, lineBase, computeSell } = H;
const { STATUS_META, CATEGORIES, JOB_TYPES, MODES, SEA_LOADS, MOVEMENTS, ALL_MOVEMENTS,
        QUOTE_STATUS, QSTATUS_TONE, JOB_STATUS, JSTATUS_TONE, LEAD_STATUS, LSTATUS_TONE,
        LEAD_SOURCES, BILLING_MODELS, PERIODS, USER_ROLES, ROLE_DOMAINS, roleCanSee, canAllocate,
        TEAM_ROLES, TEAM_FUNCTIONS, PERSON_STATUS, PERSON_TONE, FLEET_TYPES, ASSET_STATUS, ASSET_TONE,
        VENDOR_CATS, INVOICE_STATUS, INV_TONE, SK, movementsFor } = C;

export const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, items: [{ v: "dashboard", label: "Dashboard", icon: LayoutDashboard }, { v: "mytasks", label: "My tasks", icon: UserCircle2 }, { v: "tasks", label: "Task board", icon: ClipboardCheck }] },
  { key: "commercial", label: "CRM", icon: FileText, items: [
    { v: "leads", label: "Leads", icon: Sparkles },
    { v: "quotes", label: "Quotations", icon: FileText },
    { v: "followups", label: "Follow-ups", icon: Clock },
    { v: "clients", label: "Customers", icon: Users },
  ] },
  { key: "operations", label: "Operations", icon: ClipboardCheck, items: [
    { v: "ops", label: "Operations", icon: ClipboardCheck },
  ] },
  { key: "dispatch", label: "Dispatch", icon: CalendarDays, items: [
    { v: "dispatch", label: "Dispatch board", icon: CalendarDays },
  ] },
  { key: "warehouse", label: "Storage", icon: Package, landing: "whoverview", items: [
    { v: "objects", label: "Objects", icon: Package },
    { v: "storageaccts", label: "Storage accounts", icon: Receipt },
    { v: "locations", label: "Locations", icon: MapPin },
    { v: "intake", label: "AI Intake", icon: Sparkles },
  ] },
  { key: "resources", label: "Resources", icon: Boxes, items: [
    { v: "team", label: "Teams", icon: Users },
    { v: "fleet", label: "Fleet", icon: Truck },
    { v: "equipment", label: "Equipment", icon: Wrench },
    { v: "materials", label: "Materials", icon: Boxes },
  ] },
  { key: "finance", label: "Finance", icon: Banknote, items: [
    { v: "invoices", label: "Invoices", icon: Receipt },
  ] },
  { key: "admin", label: "System Settings", icon: ShieldCheck, admin: true, items: [
    { v: "settings", label: "Workspace", icon: Settings },
    { v: "users", label: "Users & access", icon: UserCircle2 },
    { v: "catalog", label: "Billable services", icon: BookOpen },
    { v: "glcodes", label: "GL codes", icon: Banknote },
    { v: "vendors", label: "Vendors", icon: Building2 },
    { v: "agents", label: "Agents", icon: Globe },
  ] },
];


export const VIEW_DOMAIN = {}; NAV.forEach(d => d.items.forEach(it => { VIEW_DOMAIN[it.v] = d.key; }));
export const DOMAIN_BY = Object.fromEntries(NAV.map(d => [d.key, d]));
export const VIEW_LABEL = {}; NAV.forEach(d => d.items.forEach(it => { VIEW_LABEL[it.v] = it.label; }));
export const viewLabel = (v) => VIEW_LABEL[v] || (v ? v.charAt(0).toUpperCase() + v.slice(1) : "");
export const viewIcon = (v) => { const d = DOMAIN_BY[VIEW_DOMAIN[v]]; const it = d && d.items.find(i => i.v === v); return (it && it.icon) || (d && d.icon) || LayoutDashboard; };

export function Sidebar({ view, setView, logo, brandName, role, authUser, onLogout }) {
  const activeDomain = VIEW_DOMAIN[view] || "dashboard";
  const nav = NAV.filter(d => (!d.admin || role === "Admin") && roleCanSee(role, d.key));
  const [hover, setHover] = useState(null);   // domain key whose flyout is open
  const [hoverTop, setHoverTop] = useState(0);
  const closeTimer = useRef(null);
  const openFly = (key, e) => { if (closeTimer.current) clearTimeout(closeTimer.current); const r = e.currentTarget.getBoundingClientRect(); setHoverTop(r.top); setHover(key); };
  const scheduleClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setHover(null), 180); };
  const keepOpen = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const flyDomain = nav.find(d => d.key === hover);
  return (
    <aside className="sidebar railed" onMouseLeave={scheduleClose}>
      <div className="brand"><img className={"brand-logo" + (logo ? " brand-logo-custom" : "")} src={logo || ARTECO_LOGO} alt="Workspace" /></div>
      <nav className="nav">
        {nav.map(d => { const Icon = d.icon; const single = d.items.length === 1; const domActive = activeDomain === d.key;
          return (
            <button key={d.key} className={"rail-item" + (domActive ? " active" : "")}
              onClick={() => setView(d.landing || d.items[0].v)}
              onMouseEnter={(e) => { if (!single) openFly(d.key, e); else setHover(null); }}
              title={d.label}>
              <Icon size={19} strokeWidth={1.7} /><span className="rail-label">{d.label}</span>
              {!single && <span className="rail-caret"><ChevronRight size={13} /></span>}
            </button>
          ); })}
      </nav>
      <div className="nav-foot">
        <div className="user-chip">
          <span className="user-avatar">{(authUser && authUser.name ? authUser.name : "?").split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
          <span className="ws-text"><span className="ws-name">{authUser ? authUser.name : "—"}</span><span className="ws-sub">{role}</span></span>
          <button className="user-logout" onClick={onLogout} title="Sign out"><ArrowRight size={15} /></button>
        </div>
        {role === "Admin" && (
          <button className="ws-chip" onClick={() => setView("settings")} title="Workspace settings">
            <span className="ws-avatar"><Settings size={15} strokeWidth={1.8} /></span>
            <span className="ws-text"><span className="ws-name">{brandName || "ARTECO"}</span><span className="ws-sub">System settings</span></span>
          </button>
        )}
      </div>
      {flyDomain && <div className="rail-fly" style={{ top: hoverTop }} onMouseEnter={keepOpen} onMouseLeave={scheduleClose}>
        <div className="rail-fly-head">{flyDomain.label}</div>
        {flyDomain.items.map(it => { const SubIcon = it.icon; return (
          <button key={it.v} className={"rail-fly-item" + (view === it.v ? " active" : "")} onClick={() => { setView(it.v); setHover(null); }}>
            <SubIcon size={15} strokeWidth={1.7} /><span>{it.label}</span>
          </button>
        ); })}
      </div>}
    </aside>
  );
}


export function TabStrip({ tabs, view, canBack, onBack, onSwitch, onClose, onPin }) {
  return (
    <div className="tabstrip">
      <button className="tab-back" onClick={onBack} disabled={!canBack} title="Back"><ArrowLeft size={16} strokeWidth={2} /></button>
      <div className="tabstrip-tabs">
        {tabs.map(t => { const Icon = viewIcon(t.v); return (
          <div key={t.v} className={"tab" + (t.v === view ? " active" : "") + (t.pinned ? " pinned" : "")} onClick={() => onSwitch(t.v)} onDoubleClick={() => onPin(t.v)} title={viewLabel(t.v) + (t.pinned ? " · pinned (double-click to unpin)" : " · double-click to keep open")}>
            <Icon size={13} strokeWidth={1.8} /><span>{viewLabel(t.v)}</span>
            {t.pinned ? <button className="tab-pindot" onClick={e => { e.stopPropagation(); onPin(t.v); }} title="Unpin">●</button> : (tabs.length > 1 && <button className="tab-x" onClick={e => { e.stopPropagation(); onClose(t.v); }} title="Close tab"><X size={12} /></button>)}
          </div>
        ); })}
      </div>
      <span className="tabstrip-hint">double-click a tab to keep it open</span>
    </div>
  );
}


export function Topbar({ view, setView, objects, packages, canBack, onBack, notifications = [], onClearNotifs, onOpenJob }) {
  const SECTOR_DESC = {
    dashboard: "Your whole operation at a glance — commercial, operations, resources and finance",
    commercial: "Leads, quotations and customers — the pipeline from enquiry to won work",
    operations: "Jobs, workflows, tasks and network partners — work in execution",
    dispatch: "Schedule and allocate crews, fleet and equipment across confirmed jobs",
    warehouse: "Objects in custody, storage, billing, locations and intake",
    resources: "Teams, fleet, equipment and materials",
    finance: "Invoicing and receivables across customers and projects",
    admin: "Workspace configuration, users, price book and master data",
  };
  // Full-page views that aren't a sector landing keep their own specific heading.
  const SOLO = {
    estimate: ["Estimate", "Full estimate build — scope, volumes, pricing and margin"],
    job: ["Job cockpit", "Day-to-day operations — collections, crew, freight and documents"],
    mytasks: ["My tasks", "Everything assigned to you, across every job"],
  };
  const domainKey = VIEW_DOMAIN[view] || "dashboard";
  const domain = DOMAIN_BY[domainKey];
  const t = SOLO[view] || [domain ? domain.label : "", SECTOR_DESC[domainKey] || ""];
  const [notifOpen, setNotifOpen] = useState(false);
  const alerts = useMemo(() => {
    const a = []; const push = (ref, label, expiry) => { const du = daysUntil(expiry); if (du == null) return; if (du < 0) a.push({ ref, label, du, level: "expired" }); else if (du <= 30) a.push({ ref, label, du, level: "soon" }); };
    objects.forEach(o => push(o.ref, o.title, o.customsExpiry)); packages.forEach(k => push(k.ref, `${k.type} ${k.ref}`, k.customsExpiry));
    return a.sort((x, y) => x.du - y.du);
  }, [objects, packages]);
  const unreadNotifs = notifications.filter(n => !n.read).length;
  return (
    <header className="topbar">
      <div className="tb-left">{canBack && <button className="tb-back-btn" onClick={onBack} title="Back"><ArrowLeft size={18} strokeWidth={2} /></button>}<div><h1>{t[0]}</h1><p>{t[1]}</p></div></div>
      <div className="tb-actions">
        <button className="tb-icon" title="Search objects" onClick={() => setView("objects")}><Search size={18} strokeWidth={1.8} /></button>
        <div className="tb-notif">
          <button className="tb-icon" title="Notifications" onClick={() => { setNotifOpen(o => { const nx = !o; if (nx && onClearNotifs) setTimeout(onClearNotifs, 1200); return nx; }); }}><Bell size={18} strokeWidth={1.8} />{(alerts.length + unreadNotifs) > 0 && <span className="tb-badge">{alerts.length + unreadNotifs}</span>}</button>
          {notifOpen && <>
            <div className="tb-pop-back" onClick={() => setNotifOpen(false)} />
            <div className="tb-pop">
              <div className="tb-pop-head">Assignments<span className="muted">{notifications.length}</span></div>
              {notifications.length === 0 && <div className="tb-pop-empty">No task assignments yet.</div>}
              {notifications.slice(0, 6).map(n => (
                <div className={"alert-row notif" + (n.read ? "" : " unread")} key={n.id} onClick={() => { if (n.jobId && onOpenJob) { setNotifOpen(false); onOpenJob(n.jobId); } }}>
                  <span className="alert-dot" /><div className="alert-main"><b>{n.teamName}</b> — {n.label}<div className="muted sm">{n.jobRef}</div></div>
                </div>
              ))}
              <div className="tb-pop-head" style={{ marginTop: 6 }}>Customs &amp; carnet alerts<span className="muted">{alerts.length}</span></div>
              {alerts.length === 0 && <div className="tb-pop-empty">Nothing expiring in the next 30 days.</div>}
              {alerts.slice(0, 6).map((a, i) => (
                <div className={"alert-row " + a.level} key={i}><span className="alert-dot" /><div className="alert-main"><span className="alert-ref mono">{a.ref}</span> — {a.label}</div><div className="alert-when">{a.level === "expired" ? `Expired ${Math.abs(a.du)}d` : `${a.du}d`}</div></div>
              ))}
            </div>
          </>}
        </div>
      </div>
    </header>
  );
}


export function StateChip({ object: o }) {
  if (o.custody === "Provisional") return <span className="chip chip-prov">Provisional</span>;
  if (o.custody === "Departed") return <span className="chip chip-neutral">Departed</span>;
  const k = (STATUS_META[o.status] || { key: "neutral" }).key;
  return <span className={"chip chip-" + k}>{o.status}</span>;
}


export function Chip({ status }) { const k = (STATUS_META[status] || { key: "neutral" }).key; return <span className={"chip chip-" + k}>{status}</span>; }
function Pill({ label, tone }) { return <span className={"chip chip-" + (tone || "neutral")}>{label}</span>; }


export function Pill({ label, tone }) { return <span className={"chip chip-" + (tone || "neutral")}>{label}</span>; }
const NAV = [


export function Thumb({ src, size = 38 }) {
  return <div className="thumb" style={{ width: size, height: size }}>{src ? <img src={src} alt="" /> : <ImageIcon size={size * 0.42} strokeWidth={1.5} />}</div>;
}


export function TopoArt({ className }) {
  return (
    <svg className={"topo "+(className||"")} viewBox="0 0 220 150" fill="none" preserveAspectRatio="xMaxYMin slice" aria-hidden="true"><path d="M184.5,26.0C184.6,26.5 184.5,27.1 184.3,27.6C184.1,28.1 183.8,28.6 183.4,29.0C183.1,29.4 182.6,29.9 182.2,30.3C181.8,30.7 181.4,31.0 181.0,31.4C180.6,31.8 180.3,32.2 179.9,32.5C179.5,32.8 179.1,33.1 178.6,33.4C178.1,33.7 177.6,34.0 177.0,34.1C176.4,34.2 175.9,34.3 175.3,34.3C174.7,34.3 174.2,34.3 173.6,34.2C173.0,34.1 172.5,34.0 172.0,33.9C171.5,33.8 171.1,33.8 170.5,33.9C169.9,34.0 169.3,34.1 168.7,34.2C168.1,34.3 167.4,34.5 166.7,34.6C166.0,34.7 165.1,34.7 164.4,34.6C163.7,34.5 163.0,34.2 162.5,33.8C162.0,33.4 161.6,32.9 161.4,32.3C161.2,31.7 161.3,31.0 161.4,30.4C161.5,29.8 161.8,29.1 162.1,28.6C162.4,28.1 162.8,27.6 163.0,27.2C163.2,26.8 163.4,26.4 163.5,26.0C163.6,25.6 163.5,25.3 163.4,24.9C163.3,24.5 163.1,24.1 163.0,23.6C162.9,23.1 162.8,22.6 162.8,22.1C162.8,21.6 162.9,21.1 163.1,20.7C163.3,20.2 163.7,19.8 164.0,19.4C164.3,19.0 164.8,18.6 165.2,18.3C165.6,18.0 166.1,17.6 166.6,17.3C167.1,17.0 167.6,16.6 168.2,16.3C168.8,16.0 169.4,15.7 170.0,15.5C170.6,15.3 171.3,15.1 172.0,15.1C172.7,15.1 173.4,15.1 174.0,15.4C174.6,15.7 175.2,16.2 175.7,16.7C176.1,17.2 176.4,17.8 176.7,18.4C176.9,19.0 177.0,19.6 177.2,20.1C177.4,20.6 177.5,21.0 177.7,21.3C177.9,21.6 178.2,21.9 178.6,22.1C179.0,22.3 179.5,22.4 180.1,22.6C180.7,22.8 181.4,23.0 182.0,23.3C182.6,23.6 183.3,24.1 183.7,24.5C184.1,24.9 184.4,25.5 184.5,26.0"/><path d="M202.1,26.0C202.4,27.3 202.1,28.7 201.7,29.9C201.3,31.1 200.3,32.2 199.5,33.3C198.7,34.4 197.5,35.3 196.6,36.3C195.7,37.2 194.7,38.1 193.8,39.0C192.9,39.9 192.0,40.8 191.0,41.6C190.0,42.4 189.0,43.2 187.9,43.9C186.8,44.6 185.5,45.2 184.2,45.6C182.9,46.0 181.4,46.1 180.0,46.1C178.6,46.1 177.1,45.9 175.8,45.7C174.5,45.5 173.2,45.2 172.0,45.1C170.8,45.0 169.6,44.9 168.3,45.0C167.0,45.1 165.7,45.5 164.2,45.8C162.7,46.1 160.9,46.6 159.2,46.7C157.4,46.8 155.4,46.9 153.7,46.6C152.0,46.3 150.3,45.7 149.1,44.8C147.9,43.9 146.9,42.6 146.5,41.2C146.1,39.9 146.1,38.2 146.4,36.7C146.7,35.2 147.5,33.6 148.2,32.3C148.8,31.0 149.8,29.9 150.3,28.8C150.9,27.8 151.3,26.9 151.5,26.0C151.7,25.1 151.4,24.3 151.2,23.3C151.0,22.3 150.4,21.3 150.2,20.2C150.0,19.1 149.8,17.9 149.8,16.7C149.9,15.5 150.0,14.3 150.5,13.2C151.0,12.1 151.8,11.0 152.7,10.1C153.5,9.2 154.5,8.3 155.6,7.5C156.7,6.7 157.8,5.9 159.0,5.1C160.2,4.3 161.5,3.5 162.8,2.7C164.2,2.0 165.6,1.1 167.1,0.6C168.6,0.1 170.4,-0.3 172.0,-0.3C173.6,-0.3 175.4,-0.0 176.9,0.6C178.4,1.2 179.8,2.3 180.9,3.5C182.0,4.7 182.8,6.2 183.4,7.6C184.0,9.0 184.2,10.5 184.6,11.7C185.0,12.9 185.2,14.0 185.7,14.8C186.2,15.6 186.8,16.1 187.8,16.6C188.8,17.1 190.1,17.3 191.5,17.8C192.9,18.3 194.7,18.9 196.1,19.6C197.5,20.4 199.1,21.2 200.1,22.3C201.1,23.4 201.8,24.7 202.1,26.0"/><path d="M219.7,26.0C220.1,28.0 219.8,30.2 219.1,32.1C218.4,34.0 216.9,35.9 215.6,37.6C214.2,39.3 212.5,40.8 211.0,42.3C209.5,43.8 208.0,45.1 206.5,46.5C205.0,47.9 203.7,49.4 202.1,50.7C200.5,52.0 199.0,53.4 197.2,54.4C195.4,55.4 193.4,56.4 191.3,57.0C189.2,57.6 186.8,57.8 184.6,57.8C182.4,57.8 180.1,57.5 178.0,57.2C175.9,56.9 174.0,56.4 172.0,56.2C170.0,56.0 168.3,55.9 166.2,56.1C164.1,56.3 162.0,56.8 159.6,57.3C157.2,57.8 154.4,58.6 151.6,58.8C148.8,59.0 145.7,59.2 143.0,58.7C140.3,58.2 137.6,57.2 135.7,55.8C133.8,54.4 132.2,52.2 131.5,50.1C130.8,48.0 131.0,45.2 131.5,42.9C132.0,40.5 133.3,38.1 134.3,36.0C135.3,33.9 136.8,32.2 137.7,30.5C138.6,28.8 139.3,27.5 139.5,26.0C139.7,24.5 139.3,23.2 139.0,21.7C138.7,20.2 137.9,18.5 137.5,16.8C137.1,15.1 136.6,13.2 136.7,11.3C136.8,9.5 137.2,7.4 138.0,5.7C138.8,4.0 140.1,2.4 141.4,0.9C142.8,-0.6 144.4,-2.0 146.1,-3.3C147.8,-4.6 149.5,-5.8 151.4,-7.1C153.3,-8.4 155.3,-9.7 157.4,-10.9C159.5,-12.1 161.8,-13.4 164.2,-14.2C166.6,-15.0 169.4,-15.8 172.0,-15.8C174.6,-15.8 177.5,-15.3 179.8,-14.3C182.2,-13.3 184.4,-11.6 186.1,-9.7C187.8,-7.8 189.1,-5.3 190.1,-3.1C191.1,-0.9 191.4,1.5 192.0,3.4C192.6,5.3 192.8,6.9 193.7,8.2C194.5,9.5 195.5,10.2 197.1,11.0C198.7,11.8 200.8,12.3 203.0,13.1C205.2,13.9 208.0,14.6 210.3,15.8C212.6,17.0 215.0,18.5 216.6,20.2C218.2,21.9 219.3,24.0 219.7,26.0"/><path d="M237.3,26.0C237.9,28.7 237.3,31.8 236.4,34.4C235.5,37.0 233.5,39.6 231.7,41.9C229.9,44.2 227.5,46.3 225.4,48.3C223.3,50.3 221.2,52.2 219.2,54.1C217.2,56.0 215.3,58.0 213.2,59.8C211.1,61.6 209.0,63.5 206.5,64.9C204.0,66.4 201.3,67.7 198.4,68.5C195.5,69.3 192.3,69.6 189.3,69.6C186.3,69.6 183.1,69.1 180.2,68.7C177.3,68.3 174.7,67.5 172.0,67.3C169.3,67.1 166.8,67.0 164.0,67.3C161.2,67.6 158.3,68.3 155.0,68.9C151.7,69.5 147.9,70.6 144.1,70.9C140.3,71.2 136.0,71.5 132.3,70.8C128.7,70.1 124.8,68.8 122.2,66.8C119.6,64.8 117.5,61.9 116.6,59.0C115.6,56.1 115.9,52.4 116.5,49.2C117.1,46.0 119.0,42.6 120.4,39.7C121.8,36.9 123.8,34.4 125.0,32.1C126.2,29.8 127.2,28.0 127.5,26.0C127.8,24.0 127.4,22.2 126.9,20.1C126.5,18.0 125.3,15.8 124.8,13.4C124.3,11.0 123.6,8.3 123.7,5.8C123.8,3.3 124.4,0.7 125.4,-1.7C126.5,-4.1 128.2,-6.3 130.0,-8.4C131.8,-10.5 134.2,-12.3 136.5,-14.1C138.8,-15.9 141.2,-17.6 143.8,-19.3C146.4,-21.0 149.1,-22.9 152.0,-24.5C154.9,-26.1 158.1,-28.0 161.4,-29.1C164.7,-30.2 168.4,-31.2 172.0,-31.2C175.6,-31.2 179.5,-30.6 182.7,-29.2C185.9,-27.8 189.0,-25.4 191.3,-22.8C193.6,-20.2 195.3,-16.8 196.7,-13.8C198.0,-10.8 198.6,-7.5 199.4,-4.9C200.2,-2.3 200.5,-0.1 201.7,1.6C202.9,3.3 204.3,4.4 206.4,5.5C208.5,6.6 211.4,7.2 214.4,8.3C217.4,9.4 221.3,10.4 224.4,12.0C227.5,13.6 230.8,15.8 233.0,18.1C235.2,20.4 236.7,23.3 237.3,26.0"/><path d="M254.9,26.0C255.6,29.4 255.0,33.2 253.8,36.6C252.6,40.0 250.1,43.2 247.8,46.2C245.5,49.2 242.5,51.7 239.8,54.3C237.2,56.9 234.5,59.3 231.9,61.7C229.3,64.1 227.0,66.6 224.3,68.9C221.6,71.2 218.9,73.6 215.8,75.4C212.7,77.2 209.2,78.9 205.5,79.9C201.8,80.9 197.7,81.2 193.9,81.3C190.1,81.3 186.2,80.7 182.5,80.2C178.8,79.7 175.4,78.8 172.0,78.5C168.6,78.2 165.5,78.1 161.9,78.4C158.3,78.7 154.6,79.8 150.4,80.5C146.2,81.2 141.4,82.5 136.6,82.9C131.8,83.3 126.2,83.7 121.6,82.8C117.0,81.9 112.1,80.3 108.8,77.8C105.5,75.3 102.9,71.6 101.7,67.9C100.5,64.2 100.8,59.5 101.6,55.4C102.4,51.3 104.7,47.1 106.5,43.5C108.3,39.9 110.9,36.6 112.4,33.7C113.9,30.8 115.0,28.5 115.4,26.0C115.8,23.5 115.2,21.3 114.7,18.6C114.2,15.9 112.8,13.0 112.1,10.0C111.4,7.0 110.6,3.6 110.7,0.4C110.8,-2.8 111.6,-6.2 112.9,-9.2C114.2,-12.2 116.4,-15.1 118.7,-17.7C121.0,-20.3 124.0,-22.6 126.9,-24.9C129.8,-27.2 133.0,-29.3 136.3,-31.5C139.6,-33.7 142.9,-36.1 146.6,-38.2C150.3,-40.3 154.3,-42.5 158.5,-43.9C162.7,-45.3 167.5,-46.6 172.0,-46.6C176.5,-46.6 181.4,-45.8 185.5,-44.0C189.6,-42.2 193.6,-39.2 196.6,-36.0C199.6,-32.8 201.7,-28.4 203.4,-24.6C205.1,-20.8 205.8,-16.6 206.8,-13.3C207.9,-10.0 208.2,-7.1 209.7,-4.9C211.2,-2.7 212.9,-1.4 215.6,0.0C218.3,1.4 222.1,2.1 225.9,3.5C229.7,4.9 234.6,6.2 238.5,8.3C242.4,10.4 246.7,13.0 249.4,15.9C252.1,18.9 254.2,22.6 254.9,26.0"/><path d="M272.6,26.0C273.5,30.2 272.6,34.8 271.2,38.9C269.8,43.0 266.7,46.9 263.9,50.5C261.1,54.1 257.4,57.2 254.2,60.3C251.0,63.4 247.7,66.3 244.6,69.3C241.5,72.2 238.7,75.2 235.4,78.0C232.2,80.8 228.9,83.7 225.1,85.9C221.3,88.1 217.0,90.1 212.6,91.3C208.2,92.5 203.2,93.0 198.6,93.1C193.9,93.2 189.1,92.3 184.7,91.7C180.3,91.1 176.2,90.0 172.0,89.6C167.8,89.2 164.1,89.1 159.7,89.5C155.3,89.9 150.9,91.1 145.8,92.0C140.7,92.9 134.9,94.5 129.1,95.0C123.3,95.5 116.6,95.9 111.0,94.9C105.4,93.9 99.4,91.8 95.4,88.8C91.4,85.8 88.3,81.3 86.8,76.8C85.3,72.3 85.6,66.6 86.6,61.7C87.6,56.8 90.4,51.6 92.6,47.2C94.8,42.8 97.9,38.9 99.7,35.4C101.5,31.9 102.9,29.1 103.4,26.0C103.9,22.9 103.3,20.2 102.6,17.0C101.9,13.8 100.2,10.3 99.4,6.6C98.6,2.9 97.6,-1.1 97.7,-5.0C97.8,-8.9 98.7,-13.0 100.3,-16.7C101.9,-20.3 104.6,-23.7 107.4,-26.9C110.2,-30.1 113.9,-32.9 117.4,-35.7C121.0,-38.5 124.7,-41.0 128.7,-43.7C132.7,-46.4 136.7,-49.3 141.2,-51.8C145.7,-54.3 150.5,-57.1 155.6,-58.8C160.7,-60.5 166.5,-62.0 172.0,-62.0C177.5,-62.0 183.4,-61.0 188.4,-58.9C193.4,-56.8 198.2,-53.1 201.8,-49.2C205.4,-45.3 208.0,-39.9 210.1,-35.3C212.2,-30.7 212.9,-25.6 214.2,-21.6C215.5,-17.6 215.9,-14.2 217.7,-11.5C219.5,-8.8 221.6,-7.2 224.9,-5.5C228.2,-3.8 232.7,-3.0 237.3,-1.3C241.9,0.4 247.8,2.0 252.6,4.5C257.4,7.0 262.6,10.2 265.9,13.8C269.2,17.4 271.7,21.8 272.6,26.0"/><path d="M290.2,26.0C291.2,30.9 290.3,36.3 288.6,41.1C286.9,45.9 283.3,50.6 280.0,54.8C276.7,59.0 272.4,62.6 268.6,66.3C264.8,70.0 261.1,73.4 257.4,76.9C253.7,80.4 250.3,83.8 246.5,87.1C242.7,90.3 238.9,93.8 234.4,96.4C229.9,99.0 224.9,101.4 219.7,102.8C214.5,104.2 208.7,104.7 203.2,104.8C197.7,104.9 192.1,103.9 186.9,103.2C181.7,102.5 176.9,101.2 172.0,100.8C167.1,100.4 162.7,100.1 157.6,100.6C152.5,101.1 147.3,102.5 141.3,103.6C135.3,104.7 128.4,106.5 121.6,107.1C114.8,107.7 106.9,108.2 100.3,107.0C93.7,105.8 86.8,103.3 82.0,99.8C77.2,96.2 73.5,91.0 71.8,85.7C70.1,80.4 70.4,73.7 71.6,67.9C72.8,62.1 76.1,56.0 78.7,50.9C81.3,45.8 84.9,41.1 87.0,37.0C89.1,32.9 90.8,29.6 91.4,26.0C92.0,22.4 91.2,19.2 90.4,15.4C89.6,11.6 87.5,7.6 86.6,3.3C85.6,-1.0 84.5,-5.9 84.7,-10.5C84.9,-15.1 85.9,-19.9 87.8,-24.2C89.7,-28.5 92.8,-32.5 96.1,-36.2C99.4,-39.9 103.6,-43.2 107.8,-46.5C112.0,-49.8 116.4,-52.8 121.1,-55.9C125.8,-59.0 130.5,-62.5 135.8,-65.4C141.1,-68.4 146.8,-71.6 152.8,-73.6C158.8,-75.6 165.6,-77.4 172.0,-77.4C178.4,-77.4 185.5,-76.3 191.3,-73.8C197.1,-71.3 202.8,-66.9 207.0,-62.3C211.2,-57.7 214.4,-51.4 216.8,-46.0C219.2,-40.6 220.1,-34.5 221.6,-29.9C223.1,-25.2 223.6,-21.2 225.7,-18.1C227.8,-15.0 230.4,-13.0 234.2,-11.0C238.0,-9.0 243.3,-8.1 248.7,-6.1C254.1,-4.1 261.1,-2.2 266.7,0.8C272.3,3.8 278.4,7.5 282.3,11.7C286.2,15.9 289.1,21.1 290.2,26.0"/><path d="M307.8,26.0C309.0,31.6 307.9,37.9 305.9,43.4C303.9,48.9 299.8,54.2 296.0,59.0C292.2,63.8 287.3,68.2 283.0,72.4C278.7,76.6 274.3,80.4 270.1,84.4C265.9,88.4 262.0,92.5 257.6,96.2C253.2,100.0 248.8,103.9 243.7,106.9C238.6,109.9 232.8,112.6 226.8,114.2C220.8,115.8 214.2,116.5 207.9,116.6C201.6,116.7 195.1,115.5 189.1,114.7C183.1,113.9 177.6,112.4 172.0,111.9C166.4,111.4 161.3,111.3 155.4,111.8C149.5,112.3 143.6,113.9 136.7,115.1C129.8,116.3 121.9,118.5 114.1,119.2C106.2,119.9 97.2,120.4 89.6,119.0C82.0,117.6 74.0,114.9 68.6,110.8C63.1,106.7 58.9,100.7 56.9,94.6C54.9,88.5 55.4,80.9 56.7,74.2C58.0,67.5 61.8,60.5 64.8,54.6C67.8,48.7 72.0,43.5 74.4,38.7C76.8,33.9 78.8,30.1 79.4,26.0C80.0,21.9 79.1,18.2 78.2,13.8C77.3,9.4 75.0,4.9 73.9,-0.1C72.8,-5.0 71.5,-10.6 71.7,-15.9C71.9,-21.2 73.0,-26.8 75.2,-31.7C77.4,-36.6 81.0,-41.2 84.8,-45.5C88.6,-49.8 93.4,-53.4 98.2,-57.2C103.0,-61.0 108.1,-64.6 113.5,-68.2C118.9,-71.8 124.3,-75.6 130.4,-79.0C136.5,-82.4 143.0,-86.1 149.9,-88.4C156.8,-90.7 164.6,-92.8 172.0,-92.8C179.4,-92.8 187.4,-91.6 194.1,-88.7C200.8,-85.8 207.3,-80.8 212.2,-75.5C217.1,-70.2 220.6,-63.0 223.4,-56.8C226.2,-50.6 227.3,-43.7 229.0,-38.3C230.7,-32.9 231.4,-28.2 233.8,-24.6C236.2,-21.0 239.0,-18.8 243.4,-16.5C247.8,-14.2 254.0,-13.1 260.2,-10.8C266.4,-8.6 274.4,-6.4 280.8,-3.0C287.2,0.4 294.3,4.7 298.8,9.5C303.3,14.3 306.6,20.4 307.8,26.0"/><path d="M325.4,26.0C326.8,32.4 325.5,39.5 323.3,45.7C321.1,51.9 316.4,57.8 312.1,63.3C307.8,68.8 302.2,73.6 297.3,78.4C292.4,83.2 287.6,87.5 282.8,92.0C278.1,96.5 273.8,101.1 268.8,105.3C263.8,109.5 258.8,114.0 253.0,117.4C247.2,120.8 240.7,123.9 233.9,125.7C227.2,127.5 219.6,128.2 212.5,128.3C205.4,128.4 198.2,127.1 191.4,126.2C184.7,125.3 178.3,123.6 172.0,123.1C165.7,122.5 160.0,122.3 153.3,122.9C146.7,123.5 139.9,125.3 132.1,126.7C124.3,128.1 115.5,130.6 106.6,131.3C97.7,132.0 87.5,132.7 78.9,131.1C70.3,129.5 61.4,126.4 55.2,121.8C49.1,117.2 44.2,110.4 42.0,103.5C39.8,96.6 40.2,87.9 41.7,80.4C43.2,72.9 47.5,65.0 50.8,58.3C54.1,51.6 58.9,45.7 61.7,40.3C64.5,34.9 66.7,30.7 67.4,26.0C68.1,21.3 67.1,17.1 66.1,12.2C65.1,7.3 62.4,2.1 61.2,-3.5C60.0,-9.1 58.5,-15.5 58.7,-21.4C59.0,-27.3 60.2,-33.5 62.7,-39.1C65.2,-44.7 69.2,-50.0 73.5,-54.8C77.8,-59.6 83.3,-63.7 88.7,-68.0C94.1,-72.3 99.9,-76.3 105.9,-80.4C112.0,-84.5 118.2,-88.9 125.0,-92.7C131.8,-96.5 139.2,-100.7 147.0,-103.3C154.8,-105.9 163.7,-108.2 172.0,-108.2C180.3,-108.2 189.4,-106.8 197.0,-103.5C204.6,-100.2 211.9,-94.6 217.4,-88.6C222.9,-82.6 226.9,-74.5 230.1,-67.5C233.2,-60.5 234.4,-52.6 236.3,-46.6C238.2,-40.6 239.1,-35.3 241.8,-31.2C244.5,-27.1 247.7,-24.7 252.7,-22.1C257.7,-19.5 264.6,-18.1 271.6,-15.6C278.7,-13.0 287.7,-10.6 295.0,-6.8C302.3,-3.0 310.1,1.9 315.2,7.4C320.3,12.9 324.0,19.6 325.4,26.0"/></svg>
  );
}


export function MetricCard({ label, value, suffix, subA, subB, tone, extra }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"metric metric-" + tone}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}<span className="metric-suffix">{suffix}</span></div>
      <div className="metric-foot">
        <div className="metric-subs"><div>{subA}</div><div>{subB}</div>{open && extra && <div className="metric-extra">{extra}</div>}</div>
        {extra && <button className="metric-chev" onClick={() => setOpen(o => !o)} aria-label="More"><ChevronDown size={16} className={open ? "chev-up" : ""} /></button>}
      </div>
    </div>
  );
}


export function Stat({ icon: Icon, label, value, accent, small }) {
  return <div className={"stat" + (accent ? " stat-accent" : "")}><TopoArt className={accent ? "topo-olive" : "topo-light"} /><div className="stat-icon"><Icon size={18} strokeWidth={1.7} /></div><div className={"stat-value" + (small ? " stat-value-sm" : "")}>{value}</div><div className="stat-label">{label}</div></div>;
}


export function FlowTile({ icon: Icon, k, label, value, sub, onClick }) {
  return <button className="flow-tile" onClick={onClick}><div className="flow-top"><span className="flow-k">{k}</span><span className="flow-ico"><Icon size={15} /></span></div><div className="flow-v">{value}</div><div className="flow-l">{label}</div><div className="flow-s">{sub}</div></button>;
}


export function DRow({ k, v }) { return <div className="dl-row"><span className="dl-k">{k}</span><span className="dl-v">{v}</span></div>; }
function Field2({ label, value, full }) { return <div className={"field2" + (full ? " full" : "")}><label>{label}</label><div className="field2-val">{value}</div></div>; }


export function Field2({ label, value, full }) { return <div className={"field2" + (full ? " full" : "")}><label>{label}</label><div className="field2-val">{value}</div></div>; }



export function RowMenu({ items }) {
  const [pos, setPos] = useState(null);
  if (!items || !items.length) return null;
  const toggle = (e) => { if (pos) { setPos(null); return; } const r = e.currentTarget.getBoundingClientRect(); setPos({ top: r.bottom + 5, left: r.right }); };
  return (
    <span className="row-menu-wrap">
      <button className="icon-btn-sm" title="Actions" onClick={toggle}><span className="rm-dots">⋯</span></button>
      {pos && <>
        <div className="rm-back" onClick={() => setPos(null)} />
        <div className="rm-pop" style={{ top: pos.top, left: pos.left }}>{items.map((it, i) => <button key={i} className={"rm-item" + (it.danger ? " danger" : "")} onClick={() => { it.on(); setPos(null); }}>{it.label}</button>)}</div>
      </>}
    </span>
  );
}


export function SubNav({ items, view, setView }) {
  if (!items || items.length <= 1) return null;
  return <div className="subnav">{items.map(it => { const I = it.icon; return <button key={it.v} className={"subnav-tab" + (view === it.v ? " on" : "")} onClick={() => setView(it.v)}><I size={15} strokeWidth={1.8} />{it.label}{it.v === "intake" && <span className="nav-tag">AI</span>}</button>; })}</div>;
}


export function Modal({ title, children, onClose, wide }) {
  return <div className="modal-overlay" onClick={onClose}><div className={"modal" + (wide ? " modal-wide" : "")} onClick={e => e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X size={18} /></button></div><div className="modal-body">{children}</div></div></div>;
}


export function ModalFoot({ onClose, onSave, saveLabel = "Save" }) { return <div className="modal-foot"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={onSave}>{saveLabel}</button></div>; }
function L({ label, children, full }) { return <label className={"fl" + (full ? " full" : "")}><span>{label}</span>{children}</label>; }


export function L({ label, children, full }) { return <label className={"fl" + (full ? " full" : "")}><span>{label}</span>{children}</label>; }



export function LoginScreen({ users, brandName, logo, onLogin, onCreateAccount }) {
  const [tab, setTab] = useState("signin");   // signin | create
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  // create-account fields
  const [cName, setCName] = useState("");
  const [cUser, setCUser] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPass, setCPass] = useState("");
  const [cMsg, setCMsg] = useState("");
  const submit = () => { if (!onLogin(u.trim(), p)) setErr("Incorrect username or password."); };
  const onKey = (e) => { if (e.key === "Enter") submit(); };
  const createAcct = () => {
    setCMsg("");
    if (!cName.trim() || !cUser.trim() || !cPass.trim()) { setCMsg("Please complete name, username and password."); return; }
    if (users.some(x => x.username === cUser.trim().toLowerCase())) { setCMsg("That username is taken."); return; }
    if (onCreateAccount) onCreateAccount({ name: cName.trim(), username: cUser.trim().toLowerCase(), email: cEmail.trim(), password: cPass });
  };
  return (
    <div className="login-wrap">
      <div className="login-hero">
        <TopoArt className="topo-hero" />
        <div className="login-hero-in">
          <img className="login-logo" src={logo || ARTECO_LOGO} alt={brandName || "ARTECO"} />
          <h1 className="login-h1">The operating system for fine-art logistics</h1>
          <p className="login-lead">From first enquiry to final delivery — estimates, the operations cockpit, warehouse custody, dispatch &amp; crews, finance and documents, in one connected workspace.</p>
          <div className="login-pills">
            <span className="login-pill"><FileText size={13} />Estimates</span>
            <span className="login-pill"><Layers size={13} />Job cockpit</span>
            <span className="login-pill"><Boxes size={13} />Warehouse</span>
            <span className="login-pill"><CalendarDays size={13} />Dispatch</span>
          </div>
          <a className="login-site" href="https://www.arteco-system.com" target="_blank" rel="noreferrer"><Globe size={14} />www.arteco-system.com</a>
        </div>
      </div>
      <div className="login-card">
        <div className="login-card-in">
          <div className="login-tabs">
            <button className={"login-tab" + (tab === "signin" ? " on" : "")} onClick={() => { setTab("signin"); setErr(""); }}>Sign in</button>
            <button className={"login-tab" + (tab === "create" ? " on" : "")} onClick={() => { setTab("create"); setCMsg(""); }}>Create account</button>
          </div>
          {tab === "signin" ? <>
            <p className="muted sm">Welcome back. Enter your ARTECO credentials.</p>
            {err && <div className="intake-err">{err}</div>}
            <label className="login-field"><span>Username</span><input value={u} onChange={e => { setU(e.target.value); setErr(""); }} onKeyDown={onKey} autoFocus placeholder="e.g. lena" /></label>
            <label className="login-field"><span>Password</span><input type="password" value={p} onChange={e => { setP(e.target.value); setErr(""); }} onKeyDown={onKey} placeholder="••••••" /></label>
            <button className="btn btn-primary login-btn" onClick={submit}>Sign in <ArrowRight size={15} /></button>
            <div className="login-demo">
              <span className="muted sm">Demo accounts (password <b>arteco</b>):</span>
              <div className="login-demo-row">{users.filter(x => x.active).map(x => <button key={x.id} className="login-demo-chip" onClick={() => { setU(x.username); setP("arteco"); setErr(""); }}>{x.username} · {x.role}</button>)}</div>
            </div>
          </> : <>
            <p className="muted sm">Set up a new workspace login. New accounts join with an operations role; an administrator can adjust access later.</p>
            {cMsg && <div className="intake-err">{cMsg}</div>}
            <label className="login-field"><span>Full name</span><input value={cName} onChange={e => setCName(e.target.value)} autoFocus placeholder="e.g. Alex Rivera" /></label>
            <label className="login-field"><span>Username</span><input value={cUser} onChange={e => setCUser(e.target.value.replace(/\s/g, "").toLowerCase())} placeholder="e.g. alex" /></label>
            <label className="login-field"><span>Email</span><input value={cEmail} onChange={e => setCEmail(e.target.value)} placeholder="you@company.com" /></label>
            <label className="login-field"><span>Password</span><input type="password" value={cPass} onChange={e => setCPass(e.target.value)} placeholder="Choose a password" /></label>
            <button className="btn btn-primary login-btn" onClick={createAcct}>Create account &amp; sign in <ArrowRight size={15} /></button>
          </>}
        </div>
        <div className="login-foot muted sm">{brandName || "ARTECO"} · pilot environment · <a href="https://www.arteco-system.com" target="_blank" rel="noreferrer">arteco-system.com</a></div>
      </div>
    </div>
  );
}


