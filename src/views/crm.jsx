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

export function QuotationsView({ quotes, projects, clientById, onIntake, onNew, onEdit, onConvert, onStatus, onLogFollow, onPreview }) {
  const [tab, setTab] = useState("all");
  const [cust, setCust] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const custOptions = Array.from(new Set(quotes.map(q => q.clientId))).map(id => ({ id, name: clientById[id]?.name || "—" })).filter(o => o.name !== "—").sort((a, b) => a.name.localeCompare(b.name));
  const open = quotes.filter(q => q.status === "Estimating" || q.status === "Sent").length;
  const sentVal = quotes.filter(q => q.status === "Sent").reduce((s, q) => s + quoteTotal(q), 0);
  const decided = quotes.filter(q => ["Won", "Converted", "Lost", "Cancelled"].includes(q.status)).length;
  const won = quotes.filter(q => ["Won", "Converted"].includes(q.status)).length;
  const winRate = decided ? Math.round((won / decided) * 100) : 0;
  const jobsFromQuotes = (projects || []).filter(p => p.quoteId).length;
  const dueList = quotes.filter(q => { const fu = nextFollowUp(q); return fu && fu.dueIn != null && fu.dueIn <= 0; });
  const matchTab = (q) => tab === "all" ? true : tab === "open" ? (q.status === "Estimating" || q.status === "Sent") : tab === "followup" ? !!(nextFollowUp(q) && nextFollowUp(q).dueIn <= 0) : q.status === tab;
  const matchCust = (q) => !cust || q.clientId === cust;
  const matchQuery = (q) => { if (!query) return true; const hay = [q.ref, clientById[q.clientId]?.name, q.reference, q.destination].join(" ").toLowerCase(); return hay.includes(query.toLowerCase()); };
  const sortFn = (a, b) => sortBy === "total" ? quoteTotal(b) - quoteTotal(a) : sortBy === "customer" ? (clientById[a.clientId]?.name || "").localeCompare(clientById[b.clientId]?.name || "") : sortBy === "status" ? QUOTE_STATUS.indexOf(a.status) - QUOTE_STATUS.indexOf(b.status) : (b.date || "").localeCompare(a.date || "");
  const sorted = [...quotes].filter(q => matchTab(q) && matchCust(q) && matchQuery(q)).sort(sortFn);
  const tabs = [["all", "All"], ["open", "Open"], ["followup", `Follow-ups due${dueList.length ? " · " + dueList.length : ""}`], ["Won", "Won"], ["Lost", "Lost"]];
  return (
    <div className="dash">
      <div className="stat-row">
        <Stat icon={FileText} label="Open quotes" value={open} accent />
        <Stat icon={Clock} label="Out for approval" value={fmtMoney(sentVal)} small />
        <Stat icon={Gauge} label="Win rate" value={winRate + "%"} />
        <Stat icon={Briefcase} label="Quotes → booked jobs" value={jobsFromQuotes} />
      </div>
      <div className="toolbar"><div className="seg seg-tabs">{tabs.map(([v, l]) => <button key={v} className={"seg-btn" + (tab === v ? " on" : "")} onClick={() => setTab(v)}>{l}</button>)}</div><div className="spacer" />{onIntake && <button className="btn btn-ghost" onClick={onIntake}><Sparkles size={15} />AI intake</button>}<button className="btn btn-primary" onClick={onNew}><Plus size={16} />New estimate</button></div>
      <div className="toolbar filter-row">
        <div className="search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search reference, customer, destination…" /></div>
        <select value={cust} onChange={e => setCust(e.target.value)}><option value="">All customers</option>{custOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}><option value="date">Sort: Newest</option><option value="total">Sort: Value</option><option value="customer">Sort: Customer</option><option value="status">Sort: Status</option></select>
        {(cust || query || sortBy !== "date") && <button className="btn btn-sm btn-ghost" onClick={() => { setCust(""); setQuery(""); setSortBy("date"); }}>Clear</button>}
      </div>
      {dueList.length > 0 && tab !== "followup" && <div className="fu-banner"><Bell size={15} /><span><b>{dueList.length} follow-up{dueList.length === 1 ? "" : "s"} due.</b> Sent quotes awaiting a proactive check-in — chase them, then mark Won, Lost or Cancelled.</span><button className="btn btn-sm btn-ghost" onClick={() => setTab("followup")}>Review</button></div>}
      <section className="panel">
        <div className="panel-head"><h2>Quotations</h2><span className="muted">{sorted.length}</span></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Reference</th><th>Customer</th><th>Status</th><th className="ta-r">Total</th><th>Follow-up</th><th>Valid until</th><th></th></tr></thead>
          <tbody>
            {sorted.map(q => {
              const du = daysUntil(q.validUntil);
              const expiring = du != null && du >= 0 && du <= 14 && (q.status === "Sent" || q.status === "Estimating");
              const fu = nextFollowUp(q);
              return (
                <tr key={q.id} onClick={() => onEdit(q)} style={{cursor:"pointer"}}>
                  <td className="mono">{q.ref}</td>
                  <td>{clientById[q.clientId]?.name || "—"}</td>
                  <td><span className="status-cell"><Pill label={q.status} tone={QSTATUS_TONE[q.status]} /></span></td>
                  <td className="ta-r mono val-lime">{fmtMoney(quoteTotal(q), q.currency)}</td>
                  <td className="cell-sub">{fu ? <span>FU{fu.n} {fmtDate(fu.due)}{fu.dueIn <= 0 ? <span className="warn-tag">{fu.overdue ? "overdue" : "due"}</span> : <span className="muted sm"> · {fu.dueIn}d</span>}</span> : (q.status === "Sent" ? <span className="muted sm">done</span> : "—")}</td>
                  <td className="cell-sub">{fmtDate(q.validUntil)}{expiring && <span className="warn-tag">{du}d</span>}</td>
                  <td className="ta-r row-acts" onClick={e => e.stopPropagation()}>
                    <button className="icon-btn-sm" title="Preview estimate" onClick={() => onPreview(q)}><Eye size={15} /></button>
                    {q.status === "Converted" ? <span className="muted sm">→ job</span> : <RowMenu items={
                      q.status === "Estimating" ? [{ label: "Mark as sent", on: () => onStatus(q, "Sent") }, { label: "Edit estimate", on: () => onEdit(q) }]
                        : q.status === "Sent" ? [{ label: "Log follow-up", on: () => onLogFollow(q, "") }, { label: "Mark won", on: () => onStatus(q, "Won") }, { label: "Mark lost", on: () => onStatus(q, "Lost") }, { label: "Cancel quote", on: () => onStatus(q, "Cancelled"), danger: true }]
                          : q.status === "Won" ? [{ label: "Convert to job →", on: () => onConvert(q) }, { label: "Edit estimate", on: () => onEdit(q) }]
                            : [{ label: "Edit estimate", on: () => onEdit(q) }]
                    } />}
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && <tr><td colSpan={7} className="empty-row">No quotations in this view.</td></tr>}
          </tbody>
        </table></div>
      </section>
    </div>
  );
}


export function QuoteForm({ initial, clients, objects, vendors, catalog, catBy, defaultExclusions, defaultTerms, brandName, onSave, onConvert, onPreview, onClose }) {
  const [f, setF] = useState(() => ({ status: "Estimating", currency: "AED", date: new Date().toISOString().slice(0, 10), validUntil: "", clientId: clients[0]?.id, reference: "", clientRef: "", origin: "Dubai", destination: "", jobType: "Export", movement: "Door-to-port", mode: "Air", seaLoad: "", configKey: "", value: "", valueCcy: "USD", insuredBy: "ARTECO", crates: [], lines: [], exclusions: (defaultExclusions || DEFAULT_EXCLUSIONS).slice(), terms: (defaultTerms || DEFAULT_TERMS).slice(), notes: "", ...initial }));
  const [showCost, setShowCost] = useState(false);
  const [mk, setMk] = useState({ kind: "pct", val: 35, basis: "unit" });
  const [crateMode, setCrateMode] = useState("detailed");
  const [showDocs, setShowDocs] = useState(false);
  const [cSearch, setCSearch] = useState("");
  const [cOpen, setCOpen] = useState(false);
  const cat = catalog || SERVICE_CATALOG; const cby = catBy || SERVICE_CAT_BY;
  const catByGroup = useMemo(() => GL_FAMILIES.map(([code, label]) => ({ code, label, items: cat.filter(s => s.fam === code) })).filter(g => g.items.length), [cat]);
  const client = clients.find(c => c.id === f.clientId);
  const fillPartyFromClient = (c) => ({ name: c.name, street: c.street || c.address || "", zip: c.zip || "", city: c.city || "", country: c.country || "", contact: c.contact || "", phone: c.phone || "" });
  const cMatches = cSearch.trim() ? clients.filter(c => (c.name || "").toLowerCase().includes(cSearch.toLowerCase())).slice(0, 6) : [];
  const setLine = (id, patch) => setF(s => ({ ...s, lines: s.lines.map(l => l.id === id ? { ...l, ...patch } : l) }));
  const addLine = (sid) => { const sv = cby[sid]; if (!sv) return; setF(s => ({ ...s, lines: [...s.lines, { id: uid(), sid, desc: sv.desc || sv.c2, unit: sv.unit, qty: 1, rate: sv.rate || 0, min: sv.min || 0, vat: !!sv.vat, cost: 0, costBasis: "unit", vendorId: "" }] })); };
  const delLine = (id) => setF(s => ({ ...s, lines: s.lines.filter(l => l.id !== id) }));
  const applyMarkup = () => setF(s => ({ ...s, lines: s.lines.map(l => (Number(l.cost) || 0) > 0 ? { ...l, rate: Math.round(computeSell(l, mk.kind, mk.val, mk.basis) * 100) / 100 } : l) }));
  const markupLine = (l) => setLine(l.id, { rate: Math.round(computeSell(l, mk.kind, mk.val, mk.basis) * 100) / 100 });
  // direction-aware origin / destination defaults
  const setJobType = (t) => setF(s => {
    const moves = movementsFor(t); const mv = moves.includes(s.movement) ? s.movement : moves[0];
    const atDef = (v) => !v || v === "Dubai" || v === "";
    let origin = s.origin, destination = s.destination;
    if (t === "Export") { if (atDef(origin)) origin = "Dubai"; if (destination === "Dubai") destination = ""; }
    else if (t === "Import") { if (origin === "Dubai") origin = ""; if (atDef(destination)) destination = "Dubai"; }
    else { origin = origin || "Dubai"; destination = destination || "Dubai"; }
    return { ...s, jobType: t, movement: mv, origin, destination };
  });
  const moves = movementsFor(f.jobType);
  const cfgChoices = JOB_CONFIGS.filter(c => !f.mode || c.mode === f.mode);
  const applyConfig = (label) => {
    const cfg = JOB_CONFIGS.find(c => c.label === label); if (!cfg) return;
    const generated = configToLines(cfg, crateTotals(f.crates), cby);
    setF(s => ({ ...s, configKey: label, movement: cfg.movement || s.movement, seaLoad: cfg.seaLoad || s.seaLoad, lines: [...generated, ...s.lines.filter(l => !l.group)] }));
  };
  const setTermLine = (key, i, v) => setF(s => ({ ...s, [key]: s[key].map((x, j) => j === i ? v : x) }));
  const addTermLine = (key) => setF(s => ({ ...s, [key]: [...(s[key] || []), ""] }));
  const delTermLine = (key, i) => setF(s => ({ ...s, [key]: s[key].filter((_, j) => j !== i) }));
  const sub = quoteSubtotal(f), vat = quoteVat(f), total = quoteTotal(f);
  const cost = quoteCost(f), margin = sub - cost, marginPct = sub ? (margin / sub) * 100 : 0;
  const groups = linesByLeg(f.lines);
  const vendorName = (id) => (vendors || []).find(v => v.id === id)?.name;
  return (
    <div className="estimate-page">
      <div className="est-bar">
        <button className="icon-btn" onClick={onClose} title="Back to quotations"><X size={18} /></button>
        <div className="est-bar-title"><h1>{f.id ? "Estimate" : "New estimate"}</h1><span className="est-bar-sub">{client ? client.name : "—"}{f.reference ? ` · ${f.reference}` : ""}</span></div>
        <div className="spacer" />
        <button className="btn btn-ghost" onClick={() => setShowDocs(d => !d)}><FileText size={14} />Documents{(f.files || []).length ? ` (${(f.files || []).length})` : ""}</button>
        <button className="btn btn-ghost" onClick={() => onPreview(f)} disabled={!f.lines.length}><Printer size={14} />Preview</button>
        {f.id && (f.status === "Won" || f.status === "Sent") && <button className="btn btn-ghost" onClick={() => onConvert(f)}><Briefcase size={14} />Confirm as job</button>}
        <button className="btn btn-primary" onClick={() => f.clientId && onSave(f)}>Save estimate</button>
      </div>
      <div className="est-body">
      {showDocs && (
        <div style={{position:"relative"}}>
          <DocFolder files={f.files} onChange={(files) => setF(s => ({ ...s, files }))} label={f.ref ? "Estimate " + f.ref : "this estimate"} />
          <button className="btn btn-sm btn-ghost" onClick={() => setShowDocs(false)} style={{position:"absolute",top:16,right:18}}><X size={14} /></button>
        </div>
      )}

            <div className="est-h"><span className="est-h-no">—</span>Shipment classification</div>
      <div className="est-class-strip">
        <div className="ecs-ref"><span className="ecs-ref-label">Estimate</span><span className="ecs-ref-no mono">{f.ref || "—"}</span></div>
        <L label="Job type"><select value={f.jobType} onChange={e => setJobType(e.target.value)}>{JOB_TYPES.map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Movement"><select value={f.movement} onChange={e => setF({ ...f, movement: e.target.value })}>{moves.map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Mode"><select value={f.mode} onChange={e => setF({ ...f, mode: e.target.value, seaLoad: e.target.value === "Sea" ? (f.seaLoad || "FCL") : "" })}>{MODES.map(x => <option key={x}>{x}</option>)}</select></L>
        {f.mode === "Sea" ? <L label="Sea load"><select value={f.seaLoad || "FCL"} onChange={e => setF({ ...f, seaLoad: e.target.value })}>{SEA_LOADS.map(x => <option key={x}>{x}</option>)}</select></L> : <L label="Insured by"><select value={f.insuredBy} onChange={e => setF({ ...f, insuredBy: e.target.value })}>{["ARTECO", "Client", "Not covered"].map(x => <option key={x}>{x}</option>)}</select></L>}
        <L label="Origin"><input value={f.origin} onChange={e => setF({ ...f, origin: e.target.value })} /></L>
        <L label="Destination"><input value={f.destination} onChange={e => setF({ ...f, destination: e.target.value })} /></L>
        {f.mode === "Sea" && <L label="Insured by"><select value={f.insuredBy} onChange={e => setF({ ...f, insuredBy: e.target.value })}>{["ARTECO", "Client", "Not covered"].map(x => <option key={x}>{x}</option>)}</select></L>}
        <L label="Value"><input type="number" value={f.value} onChange={e => setF({ ...f, value: e.target.value })} /></L>
        <L label="Value ccy"><select value={f.valueCcy} onChange={e => setF({ ...f, valueCcy: e.target.value })}>{["USD", "AED", "EUR", "CHF", "GBP"].map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Quote ccy"><select value={f.currency} onChange={e => setF({ ...f, currency: e.target.value })}>{["AED", "USD", "EUR", "CHF", "GBP"].map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Date"><input type="date" value={f.date || ""} onChange={e => setF({ ...f, date: e.target.value })} /></L>
        <L label="Valid until"><input type="date" value={f.validUntil || ""} onChange={e => setF({ ...f, validUntil: e.target.value })} /></L>
      </div>

      {/* References */}
      <div className="form-grid form-grid-2" style={{marginBottom:12}}>
        <L label="Reference / scope"><input value={f.reference} onChange={e => setF({ ...f, reference: e.target.value })} placeholder="e.g. Shipping of artworks — UNESCO exhibition" /></L>
        <L label="Client reference"><input value={f.clientRef || ""} onChange={e => setF({ ...f, clientRef: e.target.value })} placeholder="Customer's PO / reference" /></L>
      </div>

      {/* Parties — full width */}
      <div className="est-h"><span className="est-h-no">1</span>Parties</div>
      <div className="party-grid">
        <PartyCard title="Shipper" sub="from / collection — prints on transport documents" party={f.shipper} onChange={v => setF({ ...f, shipper: v })} clients={clients} billTo={client} />
        <PartyCard title="Consignee" sub="to / delivery — prints on transport documents" party={f.consignee} onChange={v => setF({ ...f, consignee: v })} clients={clients} billTo={client} />
      </div>

      {/* Customer (billing party) */}
      <div className="est-h"><span className="est-h-no">2</span>Customer (billing party)</div>
      <div className="cust-card cust-card-2">
        <div className="cust-row cust-full">
          <span className="cust-k">Account</span>
          <div className="csel-wrap">
            <select value={f.clientId || ""} onChange={e => setF(s => ({ ...s, clientId: e.target.value }))}>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <div className="csel-lookup">
              <button type="button" className="csel-btn" onClick={() => setCOpen(true)} title="Look up customer"><Search size={13} /></button>
              {cOpen && <CustomerLookupModal clients={clients} onSelect={c => { setF(s => ({ ...s, clientId: c.id })); setCOpen(false); }} onClose={() => setCOpen(false)} />}
            </div>
          </div>
        </div>
        {client && <>
          <div className="cust-row"><span className="cust-k">Type</span><span>{client.type || "\u2014"}</span></div>
          <div className="cust-row"><span className="cust-k">Contact</span><span>{client.contact || "\u2014"}</span></div>
          <div className="cust-row"><span className="cust-k">Email</span><span>{client.email || "\u2014"}</span></div>
          <div className="cust-row"><span className="cust-k">Phone</span><span>{client.phone || "\u2014"}</span></div>
          <div className="cust-row cust-full"><span className="cust-k">Address</span><span>{client.address || "\u2014"}</span></div>
          <div className="cust-acts">
            <button type="button" className="party-fill" onClick={() => { const nm = (f.shipper || {}).name; const m = nm && clients.find(c => c.name && c.name.toLowerCase() === nm.toLowerCase()); if (m) setF(s => ({ ...s, clientId: m.id })); else window.alert("No customer matching the shipper name found in the register."); }}>Same as shipper</button>
            <button type="button" className="party-fill" onClick={() => { const nm = (f.consignee || {}).name; const m = nm && clients.find(c => c.name && c.name.toLowerCase() === nm.toLowerCase()); if (m) setF(s => ({ ...s, clientId: m.id })); else window.alert("No customer matching the consignee name found in the register."); }}>Same as consignee</button>
          </div>
        </>}
      </div>

      <div className="est-h">
        <span className="est-h-no">3</span>Volume &amp; chargeable weight
        <div className="est-h-toggle"><button type="button" className={crateMode === "detailed" ? "eht-active" : ""} onClick={() => setCrateMode("detailed")}>Detailed crates</button><button type="button" className={crateMode === "quick" ? "eht-active" : ""} onClick={() => setCrateMode("quick")}>Quick estimate</button></div>
      </div>
      {crateMode === "detailed" ? (
        <CrateCalc crates={f.crates} mode={f.mode} objects={objects} clientId={f.clientId} onChange={(v) => setF({ ...f, crates: v })} />
      ) : (
        <div className="quick-est">
          <L label="Total volume (m\u00b3)"><input type="number" step="0.01" value={f.quickVol || ""} onChange={e => setF({ ...f, quickVol: e.target.value })} placeholder="e.g. 2.5" /></L>
          <L label="Total weight (kg)"><input type="number" step="0.1" value={f.quickWeight || ""} onChange={e => setF({ ...f, quickWeight: e.target.value })} placeholder="e.g. 350" /></L>
          {(Number(f.quickVol) > 0 || Number(f.quickWeight) > 0) && (() => { const v = Number(f.quickVol) || 0; const w = Number(f.quickWeight) || 0; const factor = f.mode === "Sea" ? 1000 : f.mode === "Road" ? 333 : 167; const cw = Math.max(w, Math.round(v * factor * 100) / 100); return <div className="quick-cw"><span className="qcw-k">Chargeable weight</span><span className="qcw-v mono">{cw.toLocaleString()} kg</span></div>; })()}
        </div>
      )}

      <div className="est-h"><span className="est-h-no">4</span>Services &amp; pricing</div>
      <div className="cfg-bar">
        <div className="cfg-pick">
          <span className="cfg-lbl">Pre-populate from configuration</span>
          <select value={f.configKey || ""} onChange={e => { if (e.target.value) applyConfig(e.target.value); }}>
            <option value="">Choose a job configuration…</option>
            {cfgChoices.map(c => <option key={c.label} value={c.label}>{c.label} · {c.lines.length} services</option>)}
          </select>
        </div>
        <div className="ln-pickwrap">
          <select className="ln-pick" value="" onChange={e => { if (e.target.value) addLine(e.target.value); }}><option value="">+ Add single service…</option>{catByGroup.map(g => <optgroup key={g.code} label={g.label}>{g.items.map(sv => <option key={sv.id} value={sv.id}>{sv.c2 ? sv.c2 + " — " : ""}{sv.desc}</option>)}</optgroup>)}</select>
        </div>
        <button className={"btn btn-sm" + (showCost ? " btn-primary" : " btn-ghost")} onClick={() => setShowCost(c => !c)} title="Capture buy-costs & margin"><Banknote size={14} />Costs</button>
      </div>
      {showCost && (
        <div className="markup-bar">
          <span className="cfg-lbl">Price from cost</span>
          <select value={mk.kind} onChange={e => setMk({ ...mk, kind: e.target.value })}><option value="pct">Markup %</option><option value="amount">Lump-sum markup</option></select>
          <input type="number" value={mk.val} onChange={e => setMk({ ...mk, val: e.target.value })} className="markup-val" />
          <span className="muted sm">{mk.kind === "pct" ? "%" : f.currency} on</span>
          <select value={mk.basis} onChange={e => setMk({ ...mk, basis: e.target.value })}><option value="unit">unit cost</option><option value="total">line total</option></select>
          <button className="btn btn-sm btn-primary" onClick={applyMarkup}>Apply to all costed lines</button>
        </div>
      )}

      <div className="ln-list">
        {f.lines.length === 0 && <div className="ln-empty">Pick a configuration above to auto-populate the ordered scope of work, or add services individually.</div>}
        {groups.map(grp => (
          <div className="leg-block" key={grp.key}>
            <div className="leg-head">{grp.label}</div>
            {grp.items.map(l => {
              const floored = lineBase(l) > 0 && (l.min || 0) > lineBase(l);
              return (
                <div className="ln-row" key={l.id}>
                  <div className="ln-descwrap">
                    <input className="ln-desc" value={l.desc} onChange={e => setLine(l.id, { desc: e.target.value })} placeholder="Description" />
                    {l.unit && <span className="ln-unit">{l.unit}</span>}
                  </div>
                  <input className="ln-qty" type="number" value={l.qty} onChange={e => setLine(l.id, { qty: Number(e.target.value) })} title="Quantity" />
                  <span className="ln-x">×</span>
                  <input className="ln-rate" type="number" value={l.rate} onChange={e => setLine(l.id, { rate: Number(e.target.value) })} title="Rate" />
                  <button className={"ln-vat" + (l.vat ? " on" : "")} onClick={() => setLine(l.id, { vat: !l.vat })} title="Toggle VAT">VAT</button>
                  <span className="ln-amt mono">{fmtMoney(lineAmt(l), f.currency)}{floored && <span className="ln-min" title={"Minimum charge " + fmtMoney(l.min, f.currency)}>min</span>}</span>
                  <button className="ln-del" onClick={() => delLine(l.id)} title="Remove"><Trash2 size={14} /></button>
                </div>
              );
            })}
            {showCost && grp.items.map(l => {
              const lc = lineCost(l), lm = lineAmt(l) - lc;
              return (
                <div className="cost-row" key={l.id + "-cost"}>
                  <span className="cost-for" title={l.desc}>{l.desc}</span>
                  <select className="cost-vendor" value={l.vendorId || ""} onChange={e => setLine(l.id, { vendorId: e.target.value })}><option value="">No vendor / in-house</option>{(vendors || []).map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select>
                  <span className="cost-lbl">cost</span>
                  <input className="cost-in" type="number" value={l.cost || 0} onChange={e => setLine(l.id, { cost: Number(e.target.value) })} title="Buy cost" />
                  <select className="cost-basis" value={l.costBasis || "unit"} onChange={e => setLine(l.id, { costBasis: e.target.value })} title="Cost basis"><option value="unit">/unit</option><option value="lump">lump</option></select>
                  <button className="cost-mk" onClick={() => markupLine(l)} title="Set sell price from this cost using the markup above">→ sell</button>
                  <span className={"cost-margin mono" + (lm < 0 ? " neg" : "")}>{fmtMoney(lm, f.currency)}</span>
                </div>
              );
            })}
          </div>
        ))}
        {f.lines.length > 0 && (
          <div className="ln-sums">
            <div className="ln-sumrow"><span>Subtotal</span><span className="mono">{fmtMoney(sub, f.currency)}</span></div>
            <div className="ln-sumrow"><span>VAT (5%)</span><span className="mono">{fmtMoney(vat, f.currency)}</span></div>
            <div className="ln-total"><span>Total</span><span className="mono">{fmtMoney(total, f.currency)}</span></div>
            <div className="ln-margin"><span>Est. cost {fmtMoney(cost, f.currency)} · Gross margin</span><span className={"mono" + (margin < 0 ? " neg" : "")}>{fmtMoney(margin, f.currency)} ({marginPct.toFixed(0)}%)</span></div>
          </div>
        )}
      </div>

      <div className="terms-cols">
        <div className="terms-col">
          <div className="ln-head"><h4>Exclusions / optional services</h4><button className="btn btn-sm btn-ghost" onClick={() => addTermLine("exclusions")}><Plus size={12} />Add</button></div>
          {(f.exclusions || []).map((x, i) => (
            <div className="term-row" key={i}><input value={x} onChange={e => setTermLine("exclusions", i, e.target.value)} /><button className="ln-del" onClick={() => delTermLine("exclusions", i)}><Trash2 size={13} /></button></div>
          ))}
        </div>
        <div className="terms-col">
          <div className="ln-head"><h4>Terms &amp; conditions</h4><button className="btn btn-sm btn-ghost" onClick={() => addTermLine("terms")}><Plus size={12} />Add</button></div>
          {(f.terms || []).map((x, i) => (
            <div className="term-row" key={i}><input value={x} onChange={e => setTermLine("terms", i, e.target.value)} /><button className="ln-del" onClick={() => delTermLine("terms", i)}><Trash2 size={13} /></button></div>
          ))}
        </div>
      </div>
      <div className="form-grid"><L label="Notes" full><textarea rows={2} value={f.notes || ""} onChange={e => setF({ ...f, notes: e.target.value })} /></L></div>

      </div>
    </div>
  );
}


export function ClientsView({ clients, objects, packages, onSave }) {
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");
  const count = (id) => objects.filter(o => o.clientId === id && inCustody(o)).length;
  const filtered = search.trim() ? clients.filter(c => [c.name, c.ref, c.city, c.country, c.contact, c.address, c.trn].filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase())) : clients;
  return (
    <div>
      <div className="toolbar"><div className="srch-wrap"><Search size={15} /><input placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)} /></div><div className="spacer" /><button className="btn btn-primary" onClick={() => setForm({ entityType: "Company", type: "Private Collector", contacts: [], currency: "AED", creditTerms: "Net 30", creditLimit: 0 })}><Plus size={16} />Add customer</button></div>
      <section className="panel">
      <div className="panel-head"><h2>Customers</h2><span className="muted">{clients.length}</span></div>
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th>ID</th><th>Account</th><th>Entity</th><th>Type</th><th>Location</th><th>Contacts</th><th>Currency</th><th className="ta-r">In custody</th></tr></thead>
        <tbody>{filtered.map(c => {
          const loc = [c.city, c.country].filter(Boolean).join(", ") || c.address || "\u2014";
          const ctLen = (c.contacts || []).length;
          const primary = (c.contacts || []).find(ct => ct.primary) || (c.contacts || [])[0];
          return (
          <tr key={c.id} onClick={() => setForm(c)} style={{cursor:"pointer"}}>
            <td className="mono cell-sub">{c.ref || "\u2014"}</td>
            <td className="cell-title">{c.name}{primary ? <div className="cell-sub">{primary.name}{primary.title ? ` \u00b7 ${primary.title}` : ""}</div> : c.contact ? <div className="cell-sub">{c.contact}</div> : null}</td>
            <td><span className={"entity-tag et-" + (c.entityType === "Individual" ? "ind" : "co")}>{c.entityType || "Company"}</span></td>
            <td className="cell-sub">{c.type}</td>
            <td className="cell-sub">{loc}</td>
            <td className="ta-c">{c.entityType === "Individual" ? "\u2014" : (ctLen || "\u2014")}</td>
            <td className="mono cell-sub">{c.currency || "AED"}</td>
            <td className="ta-r mono">{count(c.id)}</td></tr>
        );})}</tbody>
      </table></div>
      </section>
      {form && <ClientForm initial={form} onClose={() => setForm(null)} onSave={(d) => { onSave(d); setForm(null); }} />}
    </div>
  );
}


export function ClientForm({ initial, onClose, onSave }) {
  const CREDIT_TERMS = ["Prepaid", "COD", "Net 7", "Net 14", "Net 30", "Net 45", "Net 60", "Net 90"];
  const CURRENCIES = ["AED", "USD", "EUR", "CHF", "GBP", "SAR", "QAR", "KWD", "BHD"];
  const [f, setF] = useState({ entityType: "Company", contacts: [], currency: "AED", creditTerms: "Net 30", creditLimit: 0, ...initial });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setNum = (k) => (e) => setF({ ...f, [k]: Number(e.target.value) || 0 });
  const isCompany = f.entityType !== "Individual";
  const addContact = () => setF(s => ({ ...s, contacts: [...(s.contacts || []), { id: uid(), title: "", name: "", email: "", phone: "", mobile: "", primary: !(s.contacts || []).length }] }));
  const setContact = (id, k, v) => setF(s => ({ ...s, contacts: (s.contacts || []).map(ct => ct.id === id ? { ...ct, [k]: v } : ct) }));
  const delContact = (id) => setF(s => ({ ...s, contacts: (s.contacts || []).filter(ct => ct.id !== id) }));
  const setPrimary = (id) => setF(s => ({ ...s, contacts: (s.contacts || []).map(ct => ({ ...ct, primary: ct.id === id })) }));
  return (
    <Modal title={f.id ? `Customer ${f.ref || ""}` : "New customer"} wide onClose={onClose}>
      <div className="form-section">Identity</div>
      <div className="form-grid">
        {f.ref && <L label="Customer ID"><input value={f.ref} readOnly className="mono" style={{background:"var(--bg)"}} /></L>}
        <L label="Entity type"><select value={f.entityType || "Company"} onChange={set("entityType")}>{["Company", "Individual"].map(t => <option key={t}>{t}</option>)}</select></L>
        <L label={isCompany ? "Legal / company name" : "Full name"} full><input value={f.name || ""} onChange={set("name")} placeholder={isCompany ? "Registered entity name" : "First and last name"} /></L>
        {isCompany && <L label="Trading name / DBA"><input value={f.tradingName || ""} onChange={set("tradingName")} placeholder="If different from legal name" /></L>}
        <L label="Category"><select value={f.type} onChange={set("type")}>{["Private Collector", "Gallery", "Museum", "Institution", "Dealer", "Auction House", "Foundation", "Corporate", "Government", "Other"].map(t => <option key={t}>{t}</option>)}</select></L>
      </div>

      <div className="form-section">Address</div>
      <div className="form-grid">
        <L label="Street" full><input value={f.street || ""} onChange={set("street")} placeholder="Street &amp; number" /></L>
        <L label="ZIP / postcode"><input value={f.zip || ""} onChange={set("zip")} /></L>
        <L label="City"><input value={f.city || ""} onChange={set("city")} /></L>
        <L label="Country"><input value={f.country || ""} onChange={set("country")} /></L>
        {isCompany && <L label="Website"><input value={f.website || ""} onChange={set("website")} placeholder="https://…" /></L>}
      </div>

      {isCompany ? (<>
        <div className="form-section">Contact persons<button className="btn btn-sm btn-ghost" onClick={addContact} style={{marginLeft:12}}><Plus size={12} />Add contact</button></div>
        {(f.contacts || []).length === 0 && <div className="muted" style={{fontSize:12.5,padding:"4px 0 10px"}}>No contact persons added yet.</div>}
        {(f.contacts || []).map(ct => (
          <div key={ct.id} className="ct-row">
            <button type="button" className={"ct-star" + (ct.primary ? " on" : "")} onClick={() => setPrimary(ct.id)} title="Set as primary contact">★</button>
            <input placeholder="Title / role" value={ct.title} onChange={e => setContact(ct.id, "title", e.target.value)} className="ct-title" />
            <input placeholder="Name" value={ct.name} onChange={e => setContact(ct.id, "name", e.target.value)} className="ct-name" />
            <input placeholder="Email" value={ct.email} onChange={e => setContact(ct.id, "email", e.target.value)} className="ct-email" />
            <input placeholder="Phone" value={ct.phone} onChange={e => setContact(ct.id, "phone", e.target.value)} className="ct-phone" />
            <button className="ln-del" onClick={() => delContact(ct.id)}><Trash2 size={13} /></button>
          </div>
        ))}
      </>) : (<>
        <div className="form-section">Contact details</div>
        <div className="form-grid">
          <L label="Email"><input value={f.email || ""} onChange={set("email")} /></L>
          <L label="Phone"><input value={f.phone || ""} onChange={set("phone")} /></L>
          <L label="Mobile"><input value={f.mobile || ""} onChange={set("mobile")} /></L>
        </div>
      </>)}

      <div className="form-section">Commercial</div>
      <div className="form-grid">
        <L label="Default currency"><select value={f.currency || "AED"} onChange={set("currency")}>{CURRENCIES.map(c => <option key={c}>{c}</option>)}</select></L>
        <L label="Tax reg. number (TRN / VAT)"><input value={f.trn || ""} onChange={set("trn")} placeholder="e.g. 100123456700003" /></L>
        <L label="Credit terms"><select value={f.creditTerms || "Net 30"} onChange={set("creditTerms")}>{CREDIT_TERMS.map(t => <option key={t}>{t}</option>)}</select></L>
        <L label="Credit limit"><div className="dim"><input type="number" value={f.creditLimit ?? 0} onChange={setNum("creditLimit")} /><span>{f.currency || "AED"}</span></div></L>
        <L label="Payment method"><select value={f.paymentMethod || ""} onChange={set("paymentMethod")}>{["", "Bank transfer", "Credit card", "Cheque", "Cash", "Letter of credit"].map(t => <option key={t} value={t}>{t || "Not specified"}</option>)}</select></L>
      </div>

      <div className="form-section">Notes</div>
      <div className="form-grid">
        <L label="Internal notes" full><textarea rows={2} value={f.notes || ""} onChange={set("notes")} placeholder="Internal notes about this customer" /></L>
      </div>
      <ModalFoot onClose={onClose} onSave={() => f.name && onSave(f)} saveLabel={f.id ? "Save customer" : "Add customer"} />
    </Modal>
  );
}


export function FollowUpsView({ quotes, leads, clientById, onOpenQuote, onLogFollow, onOpenLead }) {
  // quote follow-ups (sent quotes with a due cadence step)
  const quoteFU = quotes.map(q => { const fu = nextFollowUp(q); return fu ? { type: "Quote", id: q.id, q, ref: q.ref, who: clientById[q.clientId] ? clientById[q.clientId].name : "—", detail: `Follow-up ${fu.n} on estimate`, due: fu.due, du: fu.dueIn, overdue: fu.overdue } : null; }).filter(Boolean);
  // lead next-actions (open leads with a next action date)
  const leadFU = leads.filter(l => l.status !== "Lost" && l.status !== "Quoted" && l.nextActionDate).map(l => { const du = daysUntil(l.nextActionDate); return { type: "Lead", id: l.id, l, ref: l.company, who: l.contact || "—", detail: l.notes ? l.notes.slice(0, 70) : "Next action", due: l.nextActionDate, du, overdue: du != null && du < 0 }; });
  const all = [...quoteFU, ...leadFU].sort((a, b) => (a.du == null ? 1 : 0) - (b.du == null ? 1 : 0) || (a.du || 0) - (b.du || 0));
  const [tab, setTab] = useState("due");
  const shown = all.filter(x => tab === "all" ? true : tab === "due" ? (x.du != null && x.du <= 0) : tab === "soon" ? (x.du != null && x.du > 0 && x.du <= 7) : x.type === (tab === "quotes" ? "Quote" : "Lead"));
  const dueCount = all.filter(x => x.du != null && x.du <= 0).length;
  const soonCount = all.filter(x => x.du != null && x.du > 0 && x.du <= 7).length;
  const tabs = [["due", `Due now${dueCount ? " · " + dueCount : ""}`], ["soon", `Next 7 days${soonCount ? " · " + soonCount : ""}`], ["quotes", "Quotes"], ["leads", "Leads"], ["all", "All"]];
  return (
    <div className="dash">
      <div className="stat-row">
        <Stat icon={Clock} label="Follow-ups due" value={dueCount} accent />
        <Stat icon={CalendarDays} label="Due in 7 days" value={soonCount} />
        <Stat icon={FileText} label="Open quote follow-ups" value={quoteFU.length} small />
        <Stat icon={Sparkles} label="Lead next-actions" value={leadFU.length} small />
      </div>
      <div className="toolbar"><div className="seg seg-tabs">{tabs.map(([v, l]) => <button key={v} className={"seg-btn" + (tab === v ? " on" : "")} onClick={() => setTab(v)}>{l}</button>)}</div></div>
      <section className="panel">
        <div className="panel-head"><h2>Follow-ups</h2><span className="muted">{shown.length}</span></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Type</th><th>Reference</th><th>Who</th><th>Action</th><th>Due</th><th className="ta-r"></th></tr></thead>
          <tbody>{shown.length === 0 ? <tr><td colSpan={6} className="empty-row">Nothing in this view — you're on top of the pipeline.</td></tr>
            : shown.map(x => (
              <tr key={x.type + x.id} onClick={() => x.type === "Quote" ? onOpenQuote(x.q) : onOpenLead(x.l)} style={{cursor:"pointer"}}>
                <td><Pill label={x.type} tone={x.type === "Quote" ? "loan" : "storage"} /></td>
                <td className="cell-title">{x.ref}</td>
                <td className="cell-sub">{x.who}</td>
                <td className="cell-sub">{x.detail}</td>
                <td className="cell-sub">{fmtDate(x.due)}{x.du != null && x.du <= 0 ? <span className="warn-tag">{x.du === 0 ? "today" : Math.abs(x.du) + "d over"}</span> : x.du != null ? <span className="muted sm"> · {x.du}d</span> : ""}</td>
                <td className="ta-r" onClick={e => e.stopPropagation()}>{x.type === "Quote" ? <button className="btn btn-sm btn-ghost" onClick={() => onLogFollow(x.q, "")}>Log contact</button> : <button className="btn btn-sm btn-ghost" onClick={() => onOpenLead(x.l)}>Open</button>}</td>
              </tr>
            ))}</tbody>
        </table></div>
      </section>
    </div>
  );
}


export function LeadsView({ leads, onNew, onEdit, onConvert }) {
  const [tab, setTab] = useState("open");
  const [quick, setQuick] = useState("");
  const matchTab = (l) => tab === "all" ? true : tab === "open" ? l.status !== "Lost" && l.status !== "Quoted" : l.status === tab;
  const sorted = [...leads].filter(matchTab).sort((a, b) => (a.nextActionDate || "9999").localeCompare(b.nextActionDate || "9999"));
  const dueCount = leads.filter(l => { const d = daysUntil(l.nextActionDate); return l.status !== "Lost" && l.status !== "Quoted" && d != null && d <= 0; }).length;
  const pipeline = leads.filter(l => l.status !== "Lost" && l.status !== "Quoted").reduce((s, l) => s + (Number(l.estValue) || 0), 0);
  const tabs = [["open", "Open"], ["all", "All"], ["New", "New"], ["Contacted", "Contacted"], ["Qualified", "Qualified"], ["Quoted", "Quoted"]];
  const quickAdd = () => { if (quick.trim()) { onNew(); } };
  return (
    <div className="dash">
      <div className="stat-row">
        <Stat icon={Sparkles} label="Open leads" value={leads.filter(l => l.status !== "Lost" && l.status !== "Quoted").length} accent />
        <Stat icon={Clock} label="Follow-ups due" value={dueCount} />
        <Stat icon={Banknote} label="Pipeline value" value={fmtMoney(pipeline)} small />
        <Stat icon={CheckCircle2} label="Quoted" value={leads.filter(l => l.status === "Quoted").length} />
      </div>
      <div className="quick-add">
        <Sparkles size={15} />
        <input value={quick} onChange={e => setQuick(e.target.value)} onKeyDown={e => { if (e.key === "Enter") quickAdd(); }} placeholder="Quick-add a lead — type a company or contact name, press Enter for the full form…" />
        <button className="btn btn-primary" onClick={onNew}><Plus size={16} />New lead</button>
      </div>
      <div className="toolbar"><div className="seg seg-tabs">{tabs.map(([v, l]) => <button key={v} className={"seg-btn" + (tab === v ? " on" : "")} onClick={() => setTab(v)}>{l}</button>)}</div></div>
      <section className="panel">
        <div className="panel-head"><h2>Sales leads</h2><span className="muted">{sorted.length}</span></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Lead</th><th>Source</th><th>Status</th><th className="ta-r">Est. value</th><th>Owner</th><th>Next action</th><th></th></tr></thead>
          <tbody>
            {sorted.map(l => {
              const d = daysUntil(l.nextActionDate); const due = d != null && d <= 0 && l.status !== "Lost" && l.status !== "Quoted";
              return (
                <tr key={l.id} onClick={() => onEdit(l)} style={{cursor:"pointer"}}>
                  <td><div className="cell-title">{l.company || l.contact}</div>{l.contact && l.company && <div className="cell-sub2">{l.contact}{l.email ? ` · ${l.email}` : ""}</div>}</td>
                  <td className="cell-sub">{l.source || "—"}</td>
                  <td><Pill label={l.status} tone={LSTATUS_TONE[l.status]} /></td>
                  <td className="ta-r mono">{l.estValue ? fmtMoney(l.estValue, l.currency) : "—"}</td>
                  <td className="cell-sub">{l.owner || "—"}</td>
                  <td className="cell-sub">{fmtDate(l.nextActionDate)}{due && <span className="warn-tag">due</span>}</td>
                  <td className="ta-r" onClick={e => e.stopPropagation()}>{l.status !== "Quoted" && l.status !== "Lost" && <button className="btn btn-sm btn-primary" onClick={() => onConvert(l)}>Quote →</button>}{l.status === "Quoted" && <span className="muted sm">quoted</span>}</td>
                </tr>
              );
            })}
            {sorted.length === 0 && <tr><td colSpan={7} className="empty-row">No leads in this view.</td></tr>}
          </tbody>
        </table></div>
      </section>
    </div>
  );
}


export function LeadForm({ initial, clients, onSave, onDelete, onClose }) {
  const [f, setF] = useState(() => ({ company: "", contact: "", email: "", phone: "", source: "Referral", status: "New", estValue: "", currency: "AED", owner: "", nextActionDate: "", notes: "", clientId: "", ...initial }));
  return (
    <Modal title={f.id ? "Edit lead" : "New lead"} onClose={onClose} wide>
      <div className="form-grid">
        <L label="Company / account" full><input value={f.company} onChange={e => setF({ ...f, company: e.target.value })} placeholder="e.g. Alserkal Avenue gallery" /></L>
        <L label="Contact name"><input value={f.contact} onChange={e => setF({ ...f, contact: e.target.value })} /></L>
        <L label="Existing customer"><select value={f.clientId || ""} onChange={e => setF({ ...f, clientId: e.target.value })}><option value="">— new / not linked —</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></L>
        <L label="Email"><input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></L>
        <L label="Phone"><input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></L>
        <L label="Source"><select value={f.source} onChange={e => setF({ ...f, source: e.target.value })}>{LEAD_SOURCES.map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Status"><select value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>{LEAD_STATUS.map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Estimated value"><input type="number" value={f.estValue} onChange={e => setF({ ...f, estValue: e.target.value })} /></L>
        <L label="Owner"><input value={f.owner} onChange={e => setF({ ...f, owner: e.target.value })} placeholder="Sales rep" /></L>
        <L label="Next action date"><input type="date" value={f.nextActionDate || ""} onChange={e => setF({ ...f, nextActionDate: e.target.value })} /></L>
        <L label="Notes" full><textarea rows={2} value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} /></L>
      </div>
      <div className="modal-foot">
        {f.id && <button className="btn btn-ghost" onClick={() => onDelete(f.id)} style={{ color: "var(--st-transit)" }}><Trash2 size={14} />Delete</button>}
        <div className="spacer" />
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => (f.company || f.contact) && onSave(f)}>Save lead</button>
      </div>
    </Modal>
  );
}


export function RequestIntake({ clients, agents, onAccept, onClose }) {
  const [stage, setStage] = useState("input");
  const [pasted, setPasted] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [err, setErr] = useState("");
  const [d, setD] = useState(null);   // the structured draft
  const toB64 = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(file); });

  const SYS_PROMPT = "You are an operations assistant for a fine-art logistics company based in Dubai. Read the client's enquiry/request (an email, message, or brief) and extract a single structured job draft. Return ONLY a JSON object, no prose and no markdown fences, with keys: jobType ('Export'|'Import'|'Local'), movement (one of 'Door-to-door','Door-to-port','Port-to-door','Outbound','Inbound','Roundtrip','Local transport','Warehouse handling','Installation','Storage'), mode ('Air'|'Sea'|'Road'), origin (city/place text), destination (city/place text), collectionAddress, collectionContact, deliveryAddress, deliveryContact, clientName, clientEmail, clientPhone, declaredValue (number or null), valueCcy (3-letter, default AED), readyDate (YYYY-MM-DD or null), deadlineDate (YYYY-MM-DD or null), items (array of { title, artist, medium, h, w, d, weight } with cm/kg numbers or null), summary (one-line scope), notes (anything else relevant). Infer jobType from direction relative to Dubai/UAE: leaving UAE = Export, arriving UAE = Import, within UAE = Local. Infer mode from any hints (flight/air = Air, vessel/sea/container = Sea, truck/road/local = Road). If a value is unknown use null or an empty string. Extract every distinct artwork into items.";
  const run = async ({ text, fileData, mediaType, kind, name }) => {
    setStage("working"); setErr(""); setSourceName(name || "pasted request");
    try {
      const content = [];
      if (fileData) content.push({ type: kind === "image" ? "image" : "document", source: { type: "base64", media_type: mediaType, data: fileData } });
      content.push({ type: "text", text: (text ? "Client request:\n" + text + "\n\n" : "") + "Extract the job draft as a JSON object now." });
      const obj = await callAI(SYS_PROMPT, content, 1500);
      obj.items = Array.isArray(obj.items) ? obj.items : [];
      obj._rawRequest = text || ("[" + (name || "uploaded file") + "]");
      setD(obj); setStage("review");
    } catch (ex) { setErr("Couldn't read the request — " + (ex.message || ex) + ". You can paste the text instead, or fill the estimate manually."); setStage("input"); }
  };
  const onFile = async (file) => {
    if (!file) return; const lower = file.name.toLowerCase();
    try {
      if (/\.(csv|tsv|txt|eml)$/.test(lower)) run({ text: await file.text(), name: file.name });
      else if (/\.xlsx?$/.test(lower)) { const ab = await file.arrayBuffer(); const wb = XLSX.read(ab, { type: "array" }); const txt = wb.SheetNames.map(n => { const ws = wb.Sheets[n]; return `--- Sheet: ${n} ---\n${XLSX.utils.sheet_to_csv(ws)}`; }).join("\n\n"); run({ text: txt, name: file.name }); }
      else if (lower.endsWith(".pdf")) run({ fileData: await toB64(file), mediaType: "application/pdf", kind: "doc", name: file.name });
      else if (/\.(png|jpe?g|gif|webp)$/.test(lower)) run({ fileData: await toB64(file), mediaType: file.type || "image/png", kind: "image", name: file.name });
      else setErr("Unsupported file. Use PDF, Excel, an image, a .txt/.eml, or paste the text.");
    } catch (ex) { setErr("Couldn't read the file — " + (ex.message || ex)); }
  };
  const upd = (k, v) => setD(p => ({ ...p, [k]: v }));
  const updItem = (i, k, v) => setD(p => ({ ...p, items: p.items.map((it, ix) => ix === i ? { ...it, [k]: v } : it) }));
  const delItem = (i) => setD(p => ({ ...p, items: p.items.filter((_, ix) => ix !== i) }));

  if (stage === "working") return <div className="modal-overlay"><div className="ri-shell"><div className="intake-center"><div className="spinner" /><div className="intake-status">Reading <strong>{sourceName}</strong> and drafting the job…</div></div></div></div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ri-shell" onClick={e => e.stopPropagation()}>
        <div className="ri-bar"><Sparkles size={16} /><span>AI request intake</span><div className="spacer" /><button className="icon-btn" onClick={onClose}><X size={18} /></button></div>
        <div className="ri-scroll">
          {stage === "input" && <div className="ri-input">
            <p className="muted">Paste the client's enquiry (email or message), or drop a file. The system will read it and draft the job — type, lane, addresses, items and value — for you to review before it opens a prefilled estimate.</p>
            {err && <div className="intake-err">{err}</div>}
            <textarea className="ri-ta" placeholder="Paste the original request here…" value={pasted} onChange={e => setPasted(e.target.value)} />
            <div className="ri-input-acts">
              <label className="btn btn-ghost"><FileUp size={15} />Upload file<input type="file" style={{ display: "none" }} onChange={e => onFile(e.target.files && e.target.files[0])} /></label>
              <div className="spacer" />
              <button className="btn btn-primary" disabled={!pasted.trim()} onClick={() => run({ text: pasted })}><Sparkles size={15} />Read &amp; draft</button>
            </div>
          </div>}
          {stage === "review" && d && <div className="ri-review">
            <div className="cock-h">Suggested job — review &amp; adjust</div>
            {d.summary && <p className="ri-summary">{d.summary}</p>}
            <div className="form-grid">
              <L label="Job type"><select value={d.jobType || "Export"} onChange={e => upd("jobType", e.target.value)}>{JOB_TYPES.map(x => <option key={x}>{x}</option>)}</select></L>
              <L label="Movement"><select value={d.movement || ""} onChange={e => upd("movement", e.target.value)}>{(MOVEMENTS[d.jobType] || ALL_MOVEMENTS).map(x => <option key={x}>{x}</option>)}</select></L>
              <L label="Mode"><select value={d.mode || "Air"} onChange={e => upd("mode", e.target.value)}>{MODES.map(x => <option key={x}>{x}</option>)}</select></L>
              <L label="Origin"><input value={d.origin || ""} onChange={e => upd("origin", e.target.value)} /></L>
              <L label="Destination"><input value={d.destination || ""} onChange={e => upd("destination", e.target.value)} /></L>
              <L label="Declared value"><input type="number" value={d.declaredValue ?? ""} onChange={e => upd("declaredValue", e.target.value)} /></L>
              <L label="Currency"><input value={d.valueCcy || "AED"} onChange={e => upd("valueCcy", e.target.value)} /></L>
              <L label="Ready date"><input type="date" value={d.readyDate || ""} onChange={e => upd("readyDate", e.target.value)} /></L>
              <L label="Deadline"><input type="date" value={d.deadlineDate || ""} onChange={e => upd("deadlineDate", e.target.value)} /></L>
            </div>
            <div className="ri-2col">
              <div><div className="pb-head">Collection</div><input className="cock-in" placeholder="Address" value={d.collectionAddress || ""} onChange={e => upd("collectionAddress", e.target.value)} /><input className="cock-in" placeholder="Contact" value={d.collectionContact || ""} onChange={e => upd("collectionContact", e.target.value)} /></div>
              <div><div className="pb-head">Delivery</div><input className="cock-in" placeholder="Address" value={d.deliveryAddress || ""} onChange={e => upd("deliveryAddress", e.target.value)} /><input className="cock-in" placeholder="Contact" value={d.deliveryContact || ""} onChange={e => upd("deliveryContact", e.target.value)} /></div>
            </div>
            <div className="pb-head">Customer</div>
            <div className="form-grid">
              <L label="Match existing"><select value={d._clientId || ""} onChange={e => upd("_clientId", e.target.value)}><option value="">— new / from request —</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></L>
              <L label="Name (if new)"><input value={d.clientName || ""} onChange={e => upd("clientName", e.target.value)} /></L>
              <L label="Email"><input value={d.clientEmail || ""} onChange={e => upd("clientEmail", e.target.value)} /></L>
              <L label="Phone"><input value={d.clientPhone || ""} onChange={e => upd("clientPhone", e.target.value)} /></L>
            </div>
            <div className="ln-head"><h4>Items ({d.items.length})</h4><button className="btn btn-sm btn-ghost" onClick={() => setD(p => ({ ...p, items: [...p.items, { title: "New item" }] }))}><Plus size={12} />Add</button></div>
            <div className="table-wrap"><table className="data-table"><thead><tr><th>Title</th><th>Artist</th><th>Medium</th><th className="ta-r">H</th><th className="ta-r">W</th><th className="ta-r">D</th><th className="ta-r">Kg</th><th></th></tr></thead>
              <tbody>{d.items.length === 0 ? <tr><td colSpan={8} className="empty-row">No items detected — add any, or proceed and use the volume calculator in the estimate.</td></tr>
                : d.items.map((it, i) => <tr key={i}>
                  <td><input className="cell-input" value={it.title || ""} onChange={e => updItem(i, "title", e.target.value)} /></td>
                  <td><input className="cell-input" value={it.artist || ""} onChange={e => updItem(i, "artist", e.target.value)} /></td>
                  <td><input className="cell-input" value={it.medium || ""} onChange={e => updItem(i, "medium", e.target.value)} /></td>
                  <td className="ta-r"><input className="cell-input ta-r" style={{ width: 52 }} value={it.h ?? ""} onChange={e => updItem(i, "h", e.target.value)} /></td>
                  <td className="ta-r"><input className="cell-input ta-r" style={{ width: 52 }} value={it.w ?? ""} onChange={e => updItem(i, "w", e.target.value)} /></td>
                  <td className="ta-r"><input className="cell-input ta-r" style={{ width: 52 }} value={it.d ?? ""} onChange={e => updItem(i, "d", e.target.value)} /></td>
                  <td className="ta-r"><input className="cell-input ta-r" style={{ width: 52 }} value={it.weight ?? ""} onChange={e => updItem(i, "weight", e.target.value)} /></td>
                  <td className="ta-r"><button className="icon-btn-sm" onClick={() => delItem(i)}><Trash2 size={13} /></button></td>
                </tr>)}
              </tbody></table></div>
            <div className="ri-foot"><button className="btn btn-ghost" onClick={() => setStage("input")}><ArrowLeft size={14} />Back</button><div className="spacer" /><button className="btn btn-primary" onClick={() => onAccept(d)}><Check size={15} />Create estimate from this</button></div>
          </div>}
        </div>
      </div>
    </div>
  );
}


export function QuoteDocument({ quote: q, client, brandName, logo, objects }) {
  const ccy = q.currency || "AED";
  const money = (v) => new Intl.NumberFormat("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0);
  const t = crateTotals(q.crates);
  const chg = Math.round(chargeableKg(t.cbm, t.gross, q.mode || "Air"));
  const crateDims = (q.crates || []).map(c => `${c.l || "?"} × ${c.w || "?"} × ${c.h || "?"} cm${(Number(c.qty) || 1) > 1 ? " ×" + c.qty : ""}`);
  const objById = Object.fromEntries((objects || []).map(o => [o.id, o]));
  const items = (q.crates || []).map(c => { const o = objById[c.fromObjectId]; return { desc: o ? `${o.title}${o.artist ? " — " + o.artist : ""}${o.medium ? ", " + o.medium : ""}` : (c.label || "Item"), dims: `${c.l || "?"} × ${c.w || "?"} × ${c.h || "?"} cm`, weight: c.weight || "—", qty: c.qty || 1 }; });
  const legHead = (key) => ({ EXPORT: "Export Services in " + (q.origin || "origin"), IMPORT: "Import Services in " + (q.destination || "destination"), "RE-EXPORT": "Re-Export Services in " + (q.destination || "destination"), "RE-IMPORT": "Re-Import Services in " + (q.origin || "origin"), SERVICES: "Services", OTHER: "Additional Services" }[key] || key);
  const priceDetail = (l) => (lineBase(l) > 0 && (l.min || 0) > lineBase(l)) ? "Minimum" : "Flat";
  const groups = linesByLeg(q.lines);
  const total = quoteTotal(q);
  const excl = (q.exclusions && q.exclusions.length ? q.exclusions : DEFAULT_EXCLUSIONS).filter(Boolean);
  const terms = (q.terms && q.terms.length ? q.terms : DEFAULT_TERMS).filter(Boolean);
  return (
    <div className="qdoc">
      <div className="qdoc-head">
        <div className="qdoc-top">
          <img className="qdoc-logo" src={logo || ARTECO_LOGO} alt={brandName || "ARTECO"} />
          <div className="qdoc-doctype">Estimate</div>
        </div>
      </div>
      <div className="qdoc-body">
        <div className="qdoc-meta">
          <div><div className="lbl">Prepared for</div><div className="who">{client ? client.name : "—"}</div>{client && client.address && <div style={{ fontSize: 11, color: "#646B78", marginTop: 2 }}>{client.address}</div>}</div>
          <table className="qdoc-metatbl"><tbody>
            <tr><td>Reference</td><td className="r">{q.ref || "—"}</td></tr>
            <tr><td>Date</td><td className="r">{fmtDate(q.date)}</td></tr>
            <tr><td>Contact</td><td className="r">{(client && client.contact) || "—"}</td></tr>
            <tr><td>Valid until</td><td className="r">{fmtDate(q.validUntil)}</td></tr>
          </tbody></table>
        </div>
        <div className="qdoc-refrow"><div><div className="lbl">Scope</div>{q.reference || "—"}</div><div style={{ textAlign: "right" }}><div className="lbl">Service</div><b>{[q.jobType, q.movement].filter(Boolean).join(" · ")}</b></div></div>
        <div className="qdoc-spec">
          <div className="sc"><div className="k">Packages</div><div className="v">{t.count || "—"} crate(s)</div></div>
          <div className="sc"><div className="k">Volume</div><div className="v">{t.cbm ? t.cbm.toFixed(2) + " m³" : "—"}</div></div>
          <div className="sc"><div className="k">Chargeable wt.</div><div className="v">{chg || "—"} kg</div></div>
          <div className="sc"><div className="k">Mode</div><div className="v">{[q.mode, q.seaLoad].filter(Boolean).join(" · ") || "—"}</div></div>
          <div className="sc"><div className="k">Origin</div><div className="v">{q.origin || "—"}</div></div>
          <div className="sc"><div className="k">Destination</div><div className="v">{q.destination || "—"}</div></div>
          <div className="sc"><div className="k">Declared value</div><div className="v">{q.value ? money(q.value) + " " + (q.valueCcy || "") : "—"}</div></div>
          <div className="sc"><div className="k">Insured by</div><div className="v">{q.insuredBy || "—"}</div></div>
        </div>
        {items.length > 0 && <>
          <div className="qdoc-h">Items &amp; scope</div>
          <table className="qdoc-items"><tbody>
            <tr><th className="n">#</th><th>Description</th><th>Crate (L×W×H)</th><th className="amt">Weight</th><th className="amt">Qty</th></tr>
            {items.map((it, i) => <tr key={i}><td className="n">{i + 1}</td><td>{it.desc}</td><td>{it.dims}</td><td className="amt">{it.weight === "—" ? "—" : it.weight + " kg"}</td><td className="amt">{it.qty}</td></tr>)}
          </tbody></table>
        </>}
        <div className="qdoc-h">Estimated charges</div>
        <table className="qdoc-charges"><tbody>
          <tr><th>Service description</th><th className="pd">Detail</th><th className="amt">Amount</th></tr>
          {groups.map(g => {
            let sub = 0;
            return (
              <React.Fragment key={g.key}>
                <tr className="leg"><td colSpan={3}>{legHead(g.key)}</td></tr>
                {g.items.map(l => { const amt = lineAmt(l); sub += amt; return <tr key={l.id}><td>{l.desc}</td><td className="pd">{priceDetail(l)}</td><td className="amt">{ccy} {money(amt)}</td></tr>; })}
                <tr className="sub"><td></td><td className="pd">Subtotal</td><td className="amt">{ccy} {money(sub)}</td></tr>
              </React.Fragment>
            );
          })}
        </tbody></table>
        <div className="qdoc-total"><span className="tl">Total {ccy}</span><span className="tv">{money(total)}</span></div>
        <div className="qdoc-terms"><h4>Exclusions / optional services</h4>{excl.map((x, i) => <div key={i}>— {x}</div>)}</div>
        <div className="qdoc-terms"><h4>Important terms</h4>{terms.map((x, i) => <div key={i}>{i + 1}. {x}</div>)}</div>
      </div>
    </div>
  );
}


export function QuoteDocumentModal({ quote, client, brandName, logo, objects, onPrint, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="qdoc-shell" onClick={e => e.stopPropagation()}>
        <div className="qdoc-bar"><span>Estimate preview — {quote.ref || "draft"}</span><div className="spacer" /><button className="btn btn-sm btn-ghost" onClick={onPrint}><Printer size={13} />Print / PDF</button><button className="icon-btn" onClick={onClose}><X size={18} /></button></div>
        <div className="qdoc-scroll"><QuoteDocument quote={quote} client={client} brandName={brandName} logo={logo} objects={objects} /></div>
      </div>
    </div>
  );
}


export function printQuote(q, client, brandName, logo, objects) {
  const w = window.open("", "_blank"); if (!w) return;
  const ccy = q.currency || "AED"; const brand = brandName || "ARTECO";
  const objById = Object.fromEntries((objects || []).map(o => [o.id, o]));
  const itemsHtml = (q.crates || []).map((c, i) => { const o = objById[c.fromObjectId]; const desc = o ? `${esc(o.title)}${o.artist ? " — " + esc(o.artist) : ""}${o.medium ? ", " + esc(o.medium) : ""}` : esc(c.label || "Item"); return `<tr><td class="n">${i + 1}</td><td>${desc}</td><td>${c.l || "?"} × ${c.w || "?"} × ${c.h || "?"} cm</td><td class="amt">${c.weight ? c.weight + " kg" : "—"}</td><td class="amt">${c.qty || 1}</td></tr>`; }).join("");
  const money = (v) => new Intl.NumberFormat("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0);
  const t = crateTotals(q.crates);
  const chg = Math.round(chargeableKg(t.cbm, t.gross, q.mode || "Air"));
  const crateDims = (q.crates || []).map(c => `${c.l || "?"} x ${c.w || "?"} x ${c.h || "?"} cm${(Number(c.qty) || 1) > 1 ? " ×" + c.qty : ""}`).join("<br>") || "—";
  const priceDetail = (l) => (lineBase(l) > 0 && (l.min || 0) > lineBase(l)) ? "Minimum" : "Flat";
  const groups = linesByLeg(q.lines);
  const legHead = (g) => {
    const m = { EXPORT: "Export Services in " + (q.origin || "Dubai"), IMPORT: "Import Services in " + (q.destination || "destination"), "RE-EXPORT": "Re-Export Services in " + (q.destination || "destination"), "RE-IMPORT": "Re-Import Services in " + (q.origin || "Dubai"), SERVICES: "Services", OTHER: "Additional Services" };
    return m[g.key] || g.label;
  };
  let charges = "";
  groups.forEach(g => {
    let sub = 0;
    charges += `<tr class="leg"><td colspan="3">${esc(legHead(g))}</td></tr>`;
    g.items.forEach(l => { const amt = lineAmt(l); sub += amt; charges += `<tr><td>${esc(l.desc)}</td><td class="pd">${priceDetail(l)}</td><td class="amt">${ccy} ${money(amt)}</td></tr>`; });
    charges += `<tr class="sub"><td></td><td class="pd">Subtotal:</td><td class="amt">${ccy} ${money(sub)}</td></tr>`;
  });
  const total = quoteTotal(q);
  w.document.write(`<!doctype html><html><head><title>Estimate ${esc(q.ref || "")}</title>
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box} body{font-family:'Inter','Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#1D1D1D;max-width:820px;margin:24px auto;padding:0;font-size:12px;line-height:1.5}
  .head{background:#1D1D1D;padding:18px 36px;border-bottom:3px solid #F0FD63}
  .top{display:flex;justify-content:space-between;align-items:center}
  .brand{font-size:25px;font-weight:800;letter-spacing:5px;color:#1D1D1D}
  .addr{font-size:9.5px;letter-spacing:.05em;color:#919EAB;margin-top:5px;text-transform:uppercase}
  .doctype{font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#fff;border:1.5px solid rgba(255,255,255,.45);border-radius:6px;padding:5px 12px}
  .bd{padding:22px 36px 34px}
  table{width:100%;border-collapse:collapse}
  .meta{display:flex;justify-content:space-between;gap:30px;margin-bottom:16px;align-items:flex-start}
  .lbl{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#919EAB;font-weight:700;margin-bottom:3px}
  .who{font-weight:700;font-size:14px}
  .meta table td{padding:2px 0;font-size:11px;color:#646B78}.meta table td.r{text-align:right;padding-left:24px;font-weight:700;color:#1D1D1D}
  .refrow{display:flex;justify-content:space-between;background:#F3F3F1;border-radius:8px;padding:10px 14px;font-size:12px;margin-bottom:16px}
  .spec{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#E8E8E8;border:1px solid #E8E8E8;border-radius:9px;overflow:hidden;margin-bottom:6px}
  .sc{background:#fff;padding:9px 12px}.sc.wide{grid-column:span 2}
  .k{font-size:8.5px;text-transform:uppercase;letter-spacing:.06em;color:#919EAB;font-weight:700;margin-bottom:3px}
  .v{font-size:12px;font-weight:600}
  .sech{background:#1D1D1D;color:#fff;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:8px 13px;border-radius:7px;margin:20px 0 4px}
  .ch th{text-align:left;border-bottom:1px solid #E8E8E8;padding:8px 6px;font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:#919EAB;font-weight:700}
  .ch td{padding:3.5px 6px;border-bottom:1px solid #F2F2F0;font-size:10.5px;color:#646B78}
  .ch td.amt,.ch th.amt{text-align:right;white-space:nowrap;width:122px}
  .ch td.pd,.ch th.pd{text-align:center;width:96px;color:#919EAB}
  tr.leg td{font-weight:700;color:#1D1D1D;background:#F3F3F1;text-transform:uppercase;font-size:10px;letter-spacing:.05em;padding-top:9px}
  tr.sub td{font-weight:700;color:#1D1D1D;border-top:1px solid #E8E8E8;border-bottom:1.5px solid #1D1D1D}
  .logo{height:30px;width:auto;max-width:240px;object-fit:contain}
  .it{width:100%;border-collapse:collapse;margin-top:6px}.it th{text-align:left;border-bottom:1px solid #E8E8E8;padding:6px;font-size:8.5px;text-transform:uppercase;letter-spacing:.05em;color:#919EAB;font-weight:700}.it td{padding:5px 6px;border-bottom:1px solid #F2F2F0;font-size:10.5px;color:#1D1D1D}.it td.amt,.it th.amt{text-align:right;width:84px;white-space:nowrap}.it td.n,.it th.n{width:26px;color:#919EAB}
  .total{display:flex;justify-content:flex-end;align-items:center;gap:14px;margin-top:13px}
  .total .tl{font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:#646B78}
  .total .tv{background:#1D1D1D;color:#F0FD63;font-weight:800;font-size:16px;padding:9px 18px;border-radius:9px;min-width:150px;text-align:right}
  h4{margin:20px 0 5px;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#919EAB;font-weight:700}
  .terms{font-size:9.7px;color:#646B78;line-height:1.65}.terms div{margin-bottom:1px}
  </style></head><body>
  <div class="head"><div class="top">${logo ? `<img class="logo" src="${logo}" alt="${esc(brand)}">` : `<div class="brand" style="color:#fff;font-size:22px;font-weight:800;letter-spacing:5px">${esc(brand)}</div>`}<div class="doctype">Estimate</div></div></div>
  <div class="bd">
  <div class="meta">
    <div><div class="lbl">Prepared for</div><div class="who">${esc(client ? client.name : "—")}</div>${client && client.address ? `<div style="font-size:11px;color:#646B78;margin-top:2px">${esc(client.address)}</div>` : ""}</div>
    <table><tr><td>Reference</td><td class="r">${esc(q.ref || "")}</td></tr><tr><td>Date</td><td class="r">${fmtDate(q.date)}</td></tr><tr><td>Contact</td><td class="r">${esc((client && client.contact) || "—")}</td></tr><tr><td>Valid until</td><td class="r">${fmtDate(q.validUntil)}</td></tr></table>
  </div>
  <div class="refrow"><div><div class="lbl">Scope</div>${esc(q.reference || "—")}</div><div style="text-align:right"><div class="lbl">Service</div><b>${esc([q.jobType, q.movement].filter(Boolean).join(" · "))}</b></div></div>
  <div class="spec">
    <div class="sc wide"><div class="k">Estimated crating</div><div class="v">${crateDims}</div></div>
    <div class="sc"><div class="k">Packages</div><div class="v">${t.count || "—"} crate(s)</div></div>
    <div class="sc"><div class="k">Volume</div><div class="v">${t.cbm ? t.cbm.toFixed(2) + " m³" : "—"}</div></div>
    <div class="sc"><div class="k">Chargeable wt.</div><div class="v">${chg || "—"} kg</div></div>
    <div class="sc"><div class="k">Mode</div><div class="v">${esc([q.mode, q.seaLoad].filter(Boolean).join(" · ")) || "—"}</div></div>
    <div class="sc"><div class="k">Origin</div><div class="v">${esc(q.origin || "—")}</div></div>
    <div class="sc"><div class="k">Destination</div><div class="v">${esc(q.destination || "—")}</div></div>
    <div class="sc"><div class="k">Declared value</div><div class="v">${q.value ? money(q.value) + " " + esc(q.valueCcy || "") : "—"}</div></div>
    <div class="sc"><div class="k">Insured by</div><div class="v">${esc(q.insuredBy || "—")}</div></div>
  </div>
  ${itemsHtml ? `<div class="sech">Items &amp; scope</div><table class="it"><tr><th class="n">#</th><th>Description</th><th>Crate (L×W×H)</th><th class="amt">Weight</th><th class="amt">Qty</th></tr>${itemsHtml}</table>` : ""}
  <div class="sech">Estimated charges</div>
  <table class="ch"><tr><th>Service description</th><th class="pd">Detail</th><th class="amt">Amount</th></tr>${charges}</table>
  <div class="total"><span class="tl">Total ${ccy}</span><span class="tv">${money(total)}</span></div>
  <h4>Exclusions / optional services</h4>
  <div class="terms">${(q.exclusions && q.exclusions.length ? q.exclusions : DEFAULT_EXCLUSIONS).filter(Boolean).map(x => `<div>— ${esc(x)}</div>`).join("")}</div>
  <h4>Important terms</h4>
  <div class="terms">${(q.terms && q.terms.length ? q.terms : DEFAULT_TERMS).filter(Boolean).map((x, i) => `<div>${i + 1}. ${esc(x)}</div>`).join("")}</div>
  </div></body></html>`);
  w.document.close();
}


