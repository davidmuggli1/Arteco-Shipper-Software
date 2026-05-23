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

import * as C from "../constants.js";
import * as H from "../helpers.js";
import { Modal, ModalFoot, L, Stat, Pill, SubNav, Thumb, DRow, Field2, RowMenu } from "../components/ui.jsx";
import { DocFolder, CustomerLookupModal, PartyCard, CrateCalc } from "../components/shared.jsx";
import { ARTECO_LOGO } from "../logo.js";

// Re-export helpers used in views
const { uid, fmtMoney, fmtDate, fmtDateTime, fmtVol, daysUntil, inCustody, isStocked,
        objVolM3, objDimsCm, volM3, lineAmt, lineCost, lineBase, quoteSubtotal, quoteVat,
        quoteTotal, quoteCost, quoteMargin, computeSell, callAI, toB64, fileToDataUrl,
        makeEntry, processImage, partyAddr, partyOneLine,
        estimateCrate, estimateCrateWeight, chargeableKg, crateCBM, crateTotals,
        humanBytes, DOC_KINDS, DOC_KIND_TONE, COMM_DIRS } = H;
const { SK, CATEGORIES, SERVICE_GROUPS, SERVICES, SERVICE_BY, SERVICE_CATALOG, SERVICE_CAT_BY,
        GL_FAMILIES, GL_LABEL, JOB_CONFIGS, JOB_TYPES, JOBTYPE_COLOR, jobTypeColor, JTYPE_TONE,
        MOVEMENTS, ALL_MOVEMENTS, MODES, SEA_LOADS, JOB_STATUS, JSTATUS_TONE, AGENT_ROLES,
        movementsFor, LEG_LABEL, LEG_ORDER, legOf, configToLines, linesByLeg,
        SERVICES_BY_GROUP, VAT_RATE, QUOTE_STATUS, QSTATUS_TONE, ARTECO_PARTY,
        LEAD_STATUS, LSTATUS_TONE, LEAD_SOURCES, FOLLOWUP_DAYS, nextFollowUp, addDays,
        PROJECT_TYPES, PROJECT_STATUS, PSTATUS_TONE, TASK_TYPES, TASK_STATUS, TSTATUS_TONE,
        DEFAULT_EXCLUSIONS, DEFAULT_TERMS, TEAM_ROLES, TEAM_FUNCTIONS, USER_ROLES,
        ROLE_DOMAINS, roleCanSee, canAllocate, REQUEST_FUNCTIONS, REQUEST_FLEET, REQUEST_EQUIP,
        PERSON_STATUS, PERSON_TONE, FLEET_TYPES, ASSET_STATUS, ASSET_TONE, VENDOR_CATS,
        INVOICE_STATUS, INV_TONE, STATUSES, CUSTODY, CUSTOMS, PACKAGE_TYPES,
        LOC_TYPES, MOVE_TYPES, SPACE_KINDS, SPACE_LABEL, SPACE_CHILDREN,
        BILLING_MODELS, PERIODS, periodsPerYear, STORAGE_BASIS, STORAGE_FREQ,
        SACCT_STATUS, SASTATUS_TONE, STATUS_META, statusFromLocType,
        VOL_WEIGHT_PER_CBM, isFlatCat, toCm, convLen, round1, CM_PER_IN,
        SERVICE_CATALOG as SCAT } = C;

export function TeamsView({ team, onNew, onEdit }) {
  return (<div className="dash">
    <div className="stat-row">
      <Stat icon={Users} label="Team members" value={team.length} accent />
      <Stat icon={CheckCircle2} label="Available" value={team.filter(t => t.status === "Available").length} />
      <Stat icon={Truck} label="On a job" value={team.filter(t => t.status === "On job").length} />
    </div>
    <div className="toolbar"><div className="spacer" /><button className="btn btn-primary" onClick={onNew}><Plus size={16} />Add member</button></div>
    <section className="panel"><div className="panel-head"><h2>Team</h2><span className="muted">{team.length}</span></div>
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Name</th><th>Role / title</th><th>Function</th><th>Status</th><th>Phone</th><th>Email</th></tr></thead>
        <tbody>
          {team.map(t => <tr key={t.id} onClick={() => onEdit(t)} style={{cursor:"pointer"}}><td><span className="who"><span className="ini">{(t.name || "").split(" ").map(w => w[0]).slice(0, 2).join("")}</span>{t.name}</span></td><td className="cell-sub">{t.role}</td><td>{t.func ? <Pill label={t.func} tone="neutral" /> : <span className="muted sm">—</span>}</td><td><Pill label={t.status} tone={PERSON_TONE[t.status]} /></td><td className="cell-sub mono">{t.phone}</td><td className="cell-sub">{t.email}</td></tr>)}
          {team.length === 0 && <tr><td colSpan={5} className="empty-row">No team members yet.</td></tr>}
        </tbody>
      </table></div></section>
  </div>);
}


export function TeamForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => ({ name: "", role: TEAM_ROLES[0], func: "Operations", status: "Available", phone: "", email: "", ...initial }));
  return (<Modal title={f.id ? "Edit member" : "Add team member"} onClose={onClose}><div className="form-grid">
    <L label="Name" full><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></L>
    <L label="Role / title"><select value={f.role} onChange={e => setF({ ...f, role: e.target.value })}>{TEAM_ROLES.map(x => <option key={x}>{x}</option>)}</select></L>
    <L label="Function"><select value={f.func || "Operations"} onChange={e => setF({ ...f, func: e.target.value })}>{TEAM_FUNCTIONS.map(x => <option key={x}>{x}</option>)}</select></L>
    <L label="Status"><select value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>{PERSON_STATUS.map(x => <option key={x}>{x}</option>)}</select></L>
    <L label="Phone"><input value={f.phone || ""} onChange={e => setF({ ...f, phone: e.target.value })} /></L>
    <L label="Email"><input value={f.email || ""} onChange={e => setF({ ...f, email: e.target.value })} /></L>
  </div><ModalFoot onClose={onClose} onSave={() => f.name && onSave(f)} /></Modal>);
}


export function FleetView({ fleet, onNew, onEdit }) {
  return (<div className="dash">
    <div className="stat-row">
      <Stat icon={Truck} label="Vehicles" value={fleet.length} accent />
      <Stat icon={CheckCircle2} label="Available" value={fleet.filter(f => f.status === "Available").length} />
      <Stat icon={Wrench} label="In maintenance" value={fleet.filter(f => f.status === "Maintenance").length} />
    </div>
    <div className="toolbar"><div className="spacer" /><button className="btn btn-primary" onClick={onNew}><Plus size={16} />Add vehicle</button></div>
    <section className="panel"><div className="panel-head"><h2>Fleet</h2><span className="muted">{fleet.length}</span></div>
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Vehicle</th><th>Type</th><th>Plate</th><th className="ta-r">Capacity</th><th>Status</th></tr></thead>
        <tbody>{fleet.map(f => <tr key={f.id} onClick={() => onEdit(f)} style={{cursor:"pointer"}}><td className="cell-title">{f.name}</td><td className="cell-sub">{f.type}</td><td className="mono">{f.plate}</td><td className="ta-r">{f.capacity} m³</td><td><Pill label={f.status} tone={ASSET_TONE[f.status]} /></td></tr>)}
        {fleet.length === 0 && <tr><td colSpan={5} className="empty-row">No vehicles yet.</td></tr>}</tbody>
      </table></div></section>
  </div>);
}


export function FleetForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => ({ name: "", type: FLEET_TYPES[0], plate: "", capacity: 9, status: "Available", ...initial }));
  return (<Modal title={f.id ? "Edit vehicle" : "Add vehicle"} onClose={onClose}><div className="form-grid">
    <L label="Name" full><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></L>
    <L label="Type"><select value={f.type} onChange={e => setF({ ...f, type: e.target.value })}>{FLEET_TYPES.map(x => <option key={x}>{x}</option>)}</select></L>
    <L label="Plate"><input value={f.plate || ""} onChange={e => setF({ ...f, plate: e.target.value })} /></L>
    <L label="Capacity (m³)"><input type="number" value={f.capacity} onChange={e => setF({ ...f, capacity: Number(e.target.value) })} /></L>
    <L label="Status"><select value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>{ASSET_STATUS.map(x => <option key={x}>{x}</option>)}</select></L>
  </div><ModalFoot onClose={onClose} onSave={() => f.name && onSave(f)} /></Modal>);
}


export function EquipmentView({ equipment, onNew, onEdit }) {
  return (<div className="dash">
    <div className="stat-row">
      <Stat icon={Wrench} label="Equipment lines" value={equipment.length} accent />
      <Stat icon={Boxes} label="Total units" value={equipment.reduce((s, e) => s + (e.qty || 0), 0)} />
      <Stat icon={AlertTriangle} label="In maintenance" value={equipment.filter(e => e.status === "Maintenance").length} />
    </div>
    <div className="toolbar"><div className="spacer" /><button className="btn btn-primary" onClick={onNew}><Plus size={16} />Add equipment</button></div>
    <section className="panel"><div className="panel-head"><h2>Equipment</h2><span className="muted">{equipment.length}</span></div>
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Item</th><th>Category</th><th className="ta-r">Qty</th><th>Status</th></tr></thead>
        <tbody>{equipment.map(e => <tr key={e.id} onClick={() => onEdit(e)} style={{cursor:"pointer"}}><td className="cell-title">{e.name}</td><td className="cell-sub">{e.category}</td><td className="ta-r">{e.qty}</td><td><Pill label={e.status} tone={ASSET_TONE[e.status]} /></td></tr>)}
        {equipment.length === 0 && <tr><td colSpan={4} className="empty-row">No equipment yet.</td></tr>}</tbody>
      </table></div></section>
  </div>);
}


export function EquipmentForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => ({ name: "", category: "Lifting", qty: 1, status: "Available", ...initial }));
  return (<Modal title={f.id ? "Edit equipment" : "Add equipment"} onClose={onClose}><div className="form-grid">
    <L label="Item" full><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></L>
    <L label="Category"><select value={f.category} onChange={e => setF({ ...f, category: e.target.value })}>{["Lifting", "Handling", "Packing", "Monitoring", "Climate"].map(x => <option key={x}>{x}</option>)}</select></L>
    <L label="Quantity"><input type="number" value={f.qty} onChange={e => setF({ ...f, qty: Number(e.target.value) })} /></L>
    <L label="Status"><select value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>{["Available", "In use", "Maintenance"].map(x => <option key={x}>{x}</option>)}</select></L>
  </div><ModalFoot onClose={onClose} onSave={() => f.name && onSave(f)} /></Modal>);
}


export function MaterialsView({ materials, onNew, onEdit }) {
  return (<div className="dash">
    <div className="stat-row">
      <Stat icon={Boxes} label="Material lines" value={materials.length} accent />
      <Stat icon={AlertTriangle} label="Below reorder" value={materials.filter(m => m.stock <= m.reorderAt).length} />
    </div>
    <div className="toolbar"><div className="spacer" /><button className="btn btn-primary" onClick={onNew}><Plus size={16} />Add material</button></div>
    <section className="panel"><div className="panel-head"><h2>Materials &amp; consumables</h2><span className="muted">{materials.length}</span></div>
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Material</th><th>Unit</th><th className="ta-r">In stock</th><th className="ta-r">Reorder at</th><th>Status</th></tr></thead>
        <tbody>{materials.map(m => { const lo = m.stock <= m.reorderAt; return <tr key={m.id} onClick={() => onEdit(m)} style={{cursor:"pointer"}}><td className="cell-title">{m.name}</td><td className="cell-sub">{m.unit}</td><td className="ta-r">{m.stock}</td><td className="ta-r cell-sub">{m.reorderAt}</td><td>{lo ? <Pill label="Reorder" tone="transit" /> : <Pill label="OK" tone="storage" />}</td></tr>; })}
        {materials.length === 0 && <tr><td colSpan={5} className="empty-row">No materials yet.</td></tr>}</tbody>
      </table></div></section>
  </div>);
}


export function MaterialForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => ({ name: "", unit: "unit", stock: 0, reorderAt: 0, ...initial }));
  return (<Modal title={f.id ? "Edit material" : "Add material"} onClose={onClose}><div className="form-grid">
    <L label="Material" full><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></L>
    <L label="Unit"><input value={f.unit || ""} onChange={e => setF({ ...f, unit: e.target.value })} /></L>
    <L label="In stock"><input type="number" value={f.stock} onChange={e => setF({ ...f, stock: Number(e.target.value) })} /></L>
    <L label="Reorder at"><input type="number" value={f.reorderAt} onChange={e => setF({ ...f, reorderAt: Number(e.target.value) })} /></L>
  </div><ModalFoot onClose={onClose} onSave={() => f.name && onSave(f)} /></Modal>);
}


export function VendorsView({ vendors, onNew, onEdit }) {
  return (<div className="dash">
    <div className="stat-row">
      <Stat icon={Building2} label="Vendors" value={vendors.length} accent />
      <Stat icon={CheckCircle2} label="Active" value={vendors.filter(v => v.status === "Active").length} />
    </div>
    <div className="toolbar"><div className="spacer" /><button className="btn btn-primary" onClick={onNew}><Plus size={16} />Add vendor</button></div>
    <section className="panel"><div className="panel-head"><h2>Vendors &amp; partners</h2><span className="muted">{vendors.length}</span></div>
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Vendor</th><th>Category</th><th>Contact</th><th>Terms</th><th>Status</th></tr></thead>
        <tbody>{vendors.map(v => <tr key={v.id} onClick={() => onEdit(v)} style={{cursor:"pointer"}}><td className="cell-title">{v.name}</td><td><Pill label={v.category} tone="neutral" /></td><td className="cell-sub">{v.contact}</td><td className="cell-sub">{v.terms}</td><td><Pill label={v.status} tone={v.status === "Active" ? "storage" : "neutral"} /></td></tr>)}
        {vendors.length === 0 && <tr><td colSpan={5} className="empty-row">No vendors yet.</td></tr>}</tbody>
      </table></div></section>
  </div>);
}


export function VendorForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => ({ name: "", category: VENDOR_CATS[0], contact: "", terms: "Net 30", status: "Active", ...initial }));
  return (<Modal title={f.id ? "Edit vendor" : "Add vendor"} onClose={onClose}><div className="form-grid">
    <L label="Vendor" full><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></L>
    <L label="Category"><select value={f.category} onChange={e => setF({ ...f, category: e.target.value })}>{VENDOR_CATS.map(x => <option key={x}>{x}</option>)}</select></L>
    <L label="Status"><select value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>{["Active", "Inactive"].map(x => <option key={x}>{x}</option>)}</select></L>
    <L label="Contact"><input value={f.contact || ""} onChange={e => setF({ ...f, contact: e.target.value })} /></L>
    <L label="Terms"><input value={f.terms || ""} onChange={e => setF({ ...f, terms: e.target.value })} /></L>
  </div><ModalFoot onClose={onClose} onSave={() => f.name && onSave(f)} /></Modal>);
}


export function InvoicesView({ invoices, clientById, projectById, onNew, onEdit }) {
  const out = invoices.filter(i => i.status === "Sent" || i.status === "Overdue").reduce((s, i) => s + (i.amount || 0), 0);
  const paid = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + (i.amount || 0), 0);
  const sorted = [...invoices].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return (<div className="dash">
    <div className="stat-row">
      <Stat icon={Banknote} label="Outstanding" value={fmtMoney(out)} accent small />
      <Stat icon={AlertTriangle} label="Overdue" value={invoices.filter(i => i.status === "Overdue").length} />
      <Stat icon={CheckCircle2} label="Paid to date" value={fmtMoney(paid)} small />
      <Stat icon={Receipt} label="Invoices" value={invoices.length} />
    </div>
    <div className="toolbar"><div className="spacer" /><button className="btn btn-primary" onClick={onNew}><Plus size={16} />New invoice</button></div>
    <section className="panel"><div className="panel-head"><h2>Invoices</h2><span className="muted">{invoices.length}</span></div>
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Reference</th><th>Customer</th><th>Project</th><th className="ta-r">Amount</th><th>Status</th><th>Due</th></tr></thead>
        <tbody>{sorted.map(i => { const du = daysUntil(i.dueDate); const late = i.status !== "Paid" && du != null && du < 0; return <tr key={i.id} onClick={() => onEdit(i)} style={{cursor:"pointer"}}><td className="mono">{i.ref}</td><td>{clientById[i.clientId]?.name || "—"}</td><td className="cell-sub mono">{i.projectId && projectById[i.projectId] ? projectById[i.projectId].ref : "—"}</td><td className="ta-r mono val-lime">{fmtMoney(i.amount, i.currency)}</td><td><Pill label={i.status} tone={INV_TONE[i.status]} /></td><td className="cell-sub">{fmtDate(i.dueDate)}{late && <span className="warn-tag">late</span>}</td></tr>; })}
        {invoices.length === 0 && <tr><td colSpan={6} className="empty-row">No invoices yet.</td></tr>}</tbody>
      </table></div></section>
  </div>);
}


export function InvoiceForm({ initial, clients, projects, onSave, onClose }) {
  const [f, setF] = useState(() => ({ clientId: clients[0]?.id, projectId: "", amount: 0, currency: "AED", date: new Date().toISOString().slice(0, 10), dueDate: "", status: "Draft", ...initial }));
  return (<Modal title={f.id ? `Invoice ${f.ref}` : "New invoice"} onClose={onClose}><div className="form-grid">
    <L label="Customer"><select value={f.clientId || ""} onChange={e => setF({ ...f, clientId: e.target.value })}>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></L>
    <L label="Project"><select value={f.projectId || ""} onChange={e => setF({ ...f, projectId: e.target.value })}><option value="">— none —</option>{projects.filter(j => j.clientId === f.clientId).map(j => <option key={j.id} value={j.id}>{j.ref}</option>)}</select></L>
    <L label="Amount"><input type="number" value={f.amount} onChange={e => setF({ ...f, amount: Number(e.target.value) })} /></L>
    <L label="Currency"><select value={f.currency} onChange={e => setF({ ...f, currency: e.target.value })}>{["AED", "USD", "EUR", "CHF", "GBP"].map(x => <option key={x}>{x}</option>)}</select></L>
    <L label="Status"><select value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>{INVOICE_STATUS.map(x => <option key={x}>{x}</option>)}</select></L>
    <L label="Date"><input type="date" value={f.date || ""} onChange={e => setF({ ...f, date: e.target.value })} /></L>
    <L label="Due date"><input type="date" value={f.dueDate || ""} onChange={e => setF({ ...f, dueDate: e.target.value })} /></L>
  </div><ModalFoot onClose={onClose} onSave={() => f.clientId && onSave(f)} saveLabel="Save invoice" /></Modal>);
}


export function GLCodesView({ catalog, glLabels, onSaveLabel }) {
  const fams = Array.from(new Set(catalog.map(s => s.fam)));
  const rows = fams.map(code => {
    const items = catalog.filter(s => s.fam === code);
    const rated = items.filter(s => s.rate != null && s.rate > 0);
    const avg = rated.length ? rated.reduce((a, s) => a + s.rate, 0) / rated.length : 0;
    return { code, label: glLabels[code] != null ? glLabels[code] : (GL_LABEL[code] || code), count: items.length, avg };
  }).sort((a, b) => a.code.localeCompare(b.code));
  return (
    <div className="dash">
      <div className="stat-row">
        <Stat icon={Banknote} label="GL families" value={rows.length} accent />
        <Stat icon={BookOpen} label="Mapped services" value={catalog.length} />
        <Stat icon={Layers} label="Customised labels" value={Object.keys(glLabels || {}).length} />
        <Stat icon={Receipt} label="Avg services / GL" value={rows.length ? Math.round(catalog.length / rows.length) : 0} />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>General-ledger families</h2><span className="muted">{rows.length}</span></div>
        <p className="set-note" style={{ margin: "0 22px 6px" }}>Every billable service rolls up to one GL family for financial allocation. Rename a family's label here; the code itself stays fixed.</p>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>GL code</th><th>Label</th><th className="ta-r">Services</th><th className="ta-r">Avg rate</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.code} className="no-hover">
                <td><span className="gl-code">{r.code}</span></td>
                <td><input className="gl-label-in" value={r.label} onChange={e => onSaveLabel(r.code, e.target.value)} /></td>
                <td className="ta-r mono">{r.count}</td>
                <td className="ta-r mono cell-sub">{r.avg ? fmtMoney(r.avg) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </section>
    </div>
  );
}


export function CatalogView({ catalog, onSave, onEdit, onNew }) {
  const [q, setQ] = useState("");
  const [fam, setFam] = useState("");
  const [tab, setTab] = useState("services");
  const services = catalog.filter(s => {
    const hit = !q || [s.c2, s.desc, s.fam, GL_LABEL[s.fam]].some(v => (v || "").toLowerCase().includes(q.toLowerCase()));
    return hit && (!fam || s.fam === fam);
  });
  return (
    <div className="dash">
      <div className="stat-row">
        <Stat icon={BookOpen} label="Billable services" value={catalog.length} accent />
        <Stat icon={Layers} label="GL families" value={new Set(catalog.map(s => s.fam)).size} />
        <Stat icon={Briefcase} label="Job configurations" value={JOB_CONFIGS.length} />
        <Stat icon={Receipt} label="Rate drivers" value={new Set(catalog.map(s => s.drv)).size} />
      </div>
      <div className="toolbar">
        <div className="seg seg-tabs">
          <button className={"seg-btn" + (tab === "services" ? " on" : "")} onClick={() => setTab("services")}>Services</button>
          <button className={"seg-btn" + (tab === "configs" ? " on" : "")} onClick={() => setTab("configs")}>Job configurations</button>
        </div>
        <div className="spacer" />
        {tab === "services" && <>
          <select value={fam} onChange={e => setFam(e.target.value)}><option value="">All GL families</option>{GL_FAMILIES.map(([c, l]) => <option key={c} value={c}>{l}</option>)}</select>
          <div className="search"><Search size={15} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search services…" /></div>
          <button className="btn btn-primary" onClick={onNew}><Plus size={16} />New service</button>
        </>}
      </div>
      {tab === "services" ? (
        <section className="panel">
          <div className="panel-head"><h2>Billable services</h2><span className="muted">{services.length}</span></div>
          <div className="table-wrap"><table className="data-table">
            <thead><tr><th>Service</th><th>GL family</th><th>Rate driver</th><th className="ta-r">Rate</th><th className="ta-r">Min.</th><th>VAT</th></tr></thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} onClick={() => onEdit(s)} style={{cursor:"pointer"}}>
                  <td><div className="cell-title">{s.c2 || s.desc}</div><div className="cell-sub2">{s.desc}</div></td>
                  <td><span className="gl-code">{s.fam}</span></td>
                  <td className="cell-sub">{s.drv}{s.unit ? ` · ${s.unit}` : ""}</td>
                  <td className="ta-r mono">{s.rate == null ? "—" : fmtMoney(s.rate)}</td>
                  <td className="ta-r mono cell-sub">{s.min == null ? "—" : fmtMoney(s.min)}</td>
                  <td>{s.vat ? <Pill label="VAT" tone="loan" /> : <span className="muted sm">—</span>}</td>
                </tr>
              ))}
              {services.length === 0 && <tr><td colSpan={6} className="empty-row">No services match.</td></tr>}
            </tbody>
          </table></div>
        </section>
      ) : (
        <section className="panel">
          <div className="panel-head"><h2>Job configurations</h2><span className="muted">{JOB_CONFIGS.length}</span></div>
          <div className="table-wrap"><table className="data-table">
            <thead><tr><th>Configuration</th><th>Mode</th><th>Movement</th><th>Sea load</th><th>Direction</th><th className="ta-r">Service lines</th></tr></thead>
            <tbody>
              {JOB_CONFIGS.map((c, i) => (
                <tr key={i} className="no-hover">
                  <td className="cell-title">{c.label}</td>
                  <td><Pill label={c.mode} tone="neutral" /></td>
                  <td className="cell-sub">{c.movement}</td>
                  <td className="cell-sub">{c.seaLoad || "—"}</td>
                  <td className="cell-sub">{c.direction || "—"}</td>
                  <td className="ta-r mono">{c.lines.length}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <div className="set-note" style={{ margin: "0 22px 18px" }}>Each configuration pre-populates an estimate with its ordered, leg-grouped service lines, drawing rates from the services above.</div>
        </section>
      )}
    </div>
  );
}


export function CatalogForm({ initial, onSave, onDelete, onClose }) {
  const [f, setF] = useState(() => ({ fam: GL_FAMILIES[0][0], c2: "", desc: "", rate: 0, min: 0, drv: "Fixed / each", unit: "Each", vat: true, ...initial }));
  const drivers = ["Fixed / each", "Volume (CBM)", "Chargeable weight", "Per container", "Per crate", "Man-hours", "Per truck", "Per trip", "% of value", "Per artwork"];
  return (
    <Modal title={f.id ? "Edit service" : "New billable service"} onClose={onClose} wide>
      <div className="form-grid">
        <L label="GL family"><select value={f.fam} onChange={e => setF({ ...f, fam: e.target.value })}>{GL_FAMILIES.map(([c, l]) => <option key={c} value={c}>{l} ({c})</option>)}</select></L>
        <L label="Service code"><input value={f.c2 || ""} onChange={e => setF({ ...f, c2: e.target.value })} placeholder="e.g. COLLECTION" /></L>
        <L label="Description" full><input value={f.desc || ""} onChange={e => setF({ ...f, desc: e.target.value })} /></L>
        <L label="Rate driver"><select value={f.drv} onChange={e => setF({ ...f, drv: e.target.value })}>{drivers.map(d => <option key={d}>{d}</option>)}</select></L>
        <L label="Unit"><input value={f.unit || ""} onChange={e => setF({ ...f, unit: e.target.value })} /></L>
        <L label="Rate"><input type="number" value={f.rate ?? 0} onChange={e => setF({ ...f, rate: Number(e.target.value) })} /></L>
        <L label="Minimum charge"><input type="number" value={f.min ?? 0} onChange={e => setF({ ...f, min: Number(e.target.value) })} /></L>
        <L label="VAT"><label className="check"><input type="checkbox" checked={!!f.vat} onChange={e => setF({ ...f, vat: e.target.checked })} /> Subject to 5% VAT</label></L>
      </div>
      <div className="modal-foot">
        {f.id && <button className="btn btn-ghost" onClick={() => onDelete(f.id)} style={{ color: "var(--st-transit)" }}><Trash2 size={14} />Delete</button>}
        <div className="spacer" />
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => f.desc && onSave(f)}>Save service</button>
      </div>
    </Modal>
  );
}


export function SettingsView({ logo, onSaveBrand, brandName, onSaveName, sysTerms, onSaveTerms, counts }) {
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState(brandName || "ARTECO");
  const [excl, setExcl] = useState((sysTerms && sysTerms.exclusions) ? sysTerms.exclusions.join("\n") : DEFAULT_EXCLUSIONS.join("\n"));
  const [terms, setTerms] = useState((sysTerms && sysTerms.terms) ? sysTerms.terms.join("\n") : DEFAULT_TERMS.join("\n"));
  const onFile = (e) => { const file = e.target.files && e.target.files[0]; if (!file) return; setBusy(true); const r = new FileReader(); r.onload = () => { const img = new Image(); img.onload = () => { const mw = 480, sc = Math.min(1, mw / img.width); const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(img.width * sc)); c.height = Math.max(1, Math.round(img.height * sc)); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); try { onSaveBrand(c.toDataURL("image/png")); } catch (err) { console.warn(err); } setBusy(false); }; img.onerror = () => setBusy(false); img.src = r.result; }; r.onerror = () => setBusy(false); r.readAsDataURL(file); };
  const saveTermsAll = () => onSaveTerms({ exclusions: excl.split("\n").map(x => x.trim()).filter(Boolean), terms: terms.split("\n").map(x => x.trim()).filter(Boolean) });
  return (<div className="dash"><div className="set-2col">
    <section className="panel">
      <div className="panel-head"><h2>Brand &amp; white-label</h2></div>
      <p className="set-note">Set your workspace name and logo. These appear in the sidebar and on every generated document (estimates, condition reports, labels). A light/white PNG with a transparent background works best on the dark sidebar.</p>
      <div className="form-grid" style={{ marginBottom: 12 }}>
        <L label="Workspace name" full><div className="dim"><input value={name} onChange={e => setName(e.target.value)} placeholder="ARTECO" /><button className="btn btn-sm btn-primary" onClick={() => onSaveName(name.trim() || "ARTECO")}>Save</button></div></L>
      </div>
      <div className="logo-preview"><img src={logo || ARTECO_LOGO} alt="Current logo" /></div>
      <div className="set-actions">
        <label className="btn btn-primary"><FileUp size={15} /> Upload logo<input type="file" accept="image/png,image/jpeg,image/svg+xml" hidden onChange={onFile} /></label>
        {logo && <button className="btn btn-ghost" onClick={() => onSaveBrand(null)}>Reset to ARTECO</button>}
        {busy && <span className="muted">Processing…</span>}
      </div>
    </section>
    <section className="panel">
      <div className="panel-head"><h2>System</h2></div>
      <div className="dl">
        <div className="dl-row"><span className="dl-k">Workspace</span><span className="dl-v">{brandName || "ARTECO"}</span></div>
        <div className="dl-row"><span className="dl-k">Plan</span><span className="dl-v">Pilot</span></div>
        <div className="dl-row"><span className="dl-k">Data storage</span><span className="dl-v">Browser-local (this device)</span></div>
        <div className="dl-row"><span className="dl-k">Objects on file</span><span className="dl-v">{counts.objects}</span></div>
        <div className="dl-row"><span className="dl-k">Customers</span><span className="dl-v">{counts.clients}</span></div>
        <div className="dl-row"><span className="dl-k">Active jobs</span><span className="dl-v">{counts.projects}</span></div>
      </div>
      <p className="set-note" style={{ marginTop: 14 }}>This pilot stores everything locally with no login or multi-user sync. A production deployment would add accounts, roles and a shared database.</p>
    </section>
    <section className="panel set-wide">
      <div className="panel-head"><h2>Default exclusions &amp; terms</h2><button className="btn btn-sm btn-primary" onClick={saveTermsAll}>Save defaults</button></div>
      <p className="set-note">These pre-populate every new estimate (one item per line) and can still be edited per quote. They print at the foot of the estimate document.</p>
      <div className="set-2col" style={{ marginTop: 4 }}>
        <L label="Exclusions / optional services" full><textarea rows={7} value={excl} onChange={e => setExcl(e.target.value)} /></L>
        <L label="Terms &amp; conditions" full><textarea rows={7} value={terms} onChange={e => setTerms(e.target.value)} /></L>
      </div>
    </section>
  </div></div>);
}


export function SettingsModal({ logo, onSave, onClose }) {
  const [busy, setBusy] = useState(false);
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 480; const scale = Math.min(1, maxW / img.width);
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * scale)); c.height = Math.max(1, Math.round(img.height * scale));
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        try { onSave(c.toDataURL("image/png")); } catch (err) { console.warn(err); }
        setBusy(false);
      };
      img.onerror = () => setBusy(false);
      img.src = reader.result;
    };
    reader.onerror = () => setBusy(false);
    reader.readAsDataURL(file);
  };
  return (
    <Modal title="Workspace settings" onClose={onClose}>
      <div className="form-section gridfull" style={{ marginTop: 0 }}>Brand logo</div>
      <p className="set-note">ARTECO is the default brand. Tenants can upload their own logo to white-label the workspace — it appears in the sidebar. A light or white PNG with a transparent background works best on the dark sidebar.</p>
      <div className="logo-preview"><img src={logo || ARTECO_LOGO} alt="Current logo" /></div>
      <div className="set-actions">
        <label className="btn btn-primary"><FileUp size={15} /> Upload logo<input type="file" accept="image/png,image/jpeg,image/svg+xml" hidden onChange={onFile} /></label>
        {logo && <button className="btn btn-ghost" onClick={() => onSave(null)}>Reset to ARTECO</button>}
        {busy && <span className="muted">Processing…</span>}
      </div>
      <ModalFoot onClose={onClose} onSave={onClose} saveLabel="Done" />
    </Modal>
  );
}


export function UsersView({ users, team, onSave, authUserId }) {
  const [form, setForm] = useState(null); // null | {} | user
  const blank = { name: "", username: "", email: "", password: "arteco", role: "Operations", teamId: "", active: true };
  const save = () => {
    const f = form; if (!f.name.trim() || !f.username.trim()) return;
    if (f.id) onSave(users.map(u => u.id === f.id ? f : u));
    else onSave([{ ...f, id: uid() }, ...users]);
    setForm(null);
  };
  const toggleActive = (u) => { if (u.id === authUserId) return; onSave(users.map(x => x.id === u.id ? { ...x, active: !x.active } : x)); };
  return (
    <div className="dash">
      <div className="toolbar"><div className="spacer" /><button className="btn btn-primary" onClick={() => setForm({ ...blank })}><Plus size={16} />Add user</button></div>
      <section className="panel">
        <div className="panel-head"><h2>Users &amp; access</h2><span className="muted">{users.length}</span></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Linked team member</th><th>Status</th><th></th></tr></thead>
          <tbody>{users.map(u => { const tm = team.find(t => t.id === u.teamId); return (
            <tr key={u.id} onClick={() => setForm({ ...u })} style={{cursor:"pointer"}}>
              <td className="cell-title">{u.name}{u.id === authUserId && <span className="muted sm"> · you</span>}</td>
              <td className="mono sm">{u.username}</td>
              <td className="cell-sub">{u.email || "—"}</td>
              <td><Pill label={u.role} tone={u.role === "Admin" ? "consv" : "neutral"} /></td>
              <td className="cell-sub">{tm ? tm.name : "—"}</td>
              <td><Pill label={u.active ? "Active" : "Disabled"} tone={u.active ? "storage" : "transit"} /></td>
              <td className="ta-r" onClick={e => e.stopPropagation()}><button className="btn btn-sm btn-ghost" disabled={u.id === authUserId} onClick={() => toggleActive(u)}>{u.active ? "Disable" : "Enable"}</button></td>
            </tr>
          ); })}</tbody>
        </table></div>
        <p className="muted sm" style={{ padding: "10px 16px 0" }}>Roles are set here by an administrator and cannot be changed by users themselves. Each role sees only the modules relevant to it; Admin sees everything.</p>
      </section>
      {form && <Modal title={form.id ? "Edit user" : "Add user"} onClose={() => setForm(null)}>
        <div className="form-grid">
          <L label="Full name"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></L>
          <L label="Username"><input value={form.username} onChange={e => setForm({ ...form, username: e.target.value.replace(/\s/g, "").toLowerCase() })} /></L>
          <L label="Email"><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></L>
          <L label="Password"><input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></L>
          <L label="Role"><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>{USER_ROLES.map(r => <option key={r}>{r}</option>)}</select></L>
          <L label="Linked team member"><select value={form.teamId || ""} onChange={e => setForm({ ...form, teamId: e.target.value })}><option value="">— none —</option>{team.map(t => <option key={t.id} value={t.id}>{t.name} · {t.func || t.role}</option>)}</select></L>
        </div>
        <p className="muted sm">Role determines which modules this user can access. Linking a team member connects their assigned tasks to “My tasks” and to schedule notifications.</p>
        <ModalFoot onClose={() => setForm(null)} onSave={save} saveLabel={form.id ? "Save changes" : "Create user"} />
      </Modal>}
    </div>
  );
}


