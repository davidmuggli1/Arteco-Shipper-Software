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
import { STAGE_IMG, STAGE_ASSIGN } from "../seed.js";

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

export function OpsOverview({ jobs, tasks, clientById, team, objects, onOpenJob, onNav }) {
  const objById = Object.fromEntries((objects || []).map(o => [o.id, o]));
  const live = jobs.filter(j => j.status === "Confirmed");
  const [tab, setTab] = useState("all");
  const wfProgress = (j) => { const all = (j.workflow || []).flatMap(st => st.tasks); const done = all.filter(t => t.done).length; return { done, total: all.length, pct: all.length ? Math.round(done / all.length * 100) : 0 }; };
  const jobInv = (j) => { const ids = j.objectIds || []; const vol = ids.reduce((s, id) => s + (objById[id] && objVolM3 ? objVolM3(objById[id]) : 0), 0); return { n: ids.length, vol }; };
  const jobRoute = (j) => { const from = j.origin || (j.collections && j.collections[0] ? j.collections[0].address : "") || "\u2014"; const to = j.destination || (j.deliveries && j.deliveries[0] ? j.deliveries[0].address : "") || "\u2014"; return { from, to }; };
  const openTasks = tasks.filter(t => t.status !== "Done").length;
  const dated = [];
  live.forEach(j => {
    (j.collections || []).forEach(c => { if (c.date) dated.push({ kind: "Collection", label: c.label || "Collection", date: c.date, job: j }); });
    (j.deliveries || []).forEach(c => { if (c.date) dated.push({ kind: "Delivery", label: c.label || "Delivery", date: c.date, job: j }); });
  });
  const upcoming = dated.map(d => ({ ...d, du: daysUntil(d.date) })).filter(d => d.du != null && d.du >= -3 && d.du <= 21).sort((a, b) => a.du - b.du).slice(0, 10);
  const TYPES = ["all", "Export", "Import", "Local", "Project"];
  const shown = live.filter(j => tab === "all" ? true : j.jobType === tab);
  const teamById = Object.fromEntries(team.map(t => [t.id, t]));
  const load = {};
  live.forEach(j => (j.workflow || []).forEach(st => st.tasks.forEach(t => { if (!t.done && t.assignee) load[t.assignee] = (load[t.assignee] || 0) + 1; })));
  const loadRows = Object.entries(load).map(([id, n]) => ({ id, n, name: teamById[id] ? teamById[id].name : "\u2014", func: teamById[id] ? teamById[id].func : "" })).sort((a, b) => b.n - a.n).slice(0, 6);
  return (
    <div className="dash">
      <div className="stat-row">
        <Stat icon={Layers} label="Active jobs" value={live.length} accent />
        <Stat icon={CalendarDays} label="Movements next 7d" value={upcoming.filter(u => u.du >= 0 && u.du <= 7).length} />
        <Stat icon={ClipboardCheck} label="Open tasks" value={openTasks} />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Active jobs</h2><div className="seg seg-tabs ops-typetabs">{TYPES.map(t => <button key={t} className={"seg-btn" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>{t === "all" ? "All" : t}</button>)}</div></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Reference</th><th>Project</th><th>Customer</th><th>Route</th><th style={{ width: 140 }}>Progress</th><th>Status</th></tr></thead>
          <tbody>{shown.length === 0 ? <tr><td colSpan={6} className="empty-row">No active jobs{tab !== "all" ? " of this type" : ""}.</td></tr>
            : shown.map(j => { const p = wfProgress(j); const inv = jobInv(j); const rt = jobRoute(j); const cl = clientById[j.clientId]; const tc = jobTypeColor(j.jobType);
              return (
                <tr key={j.id} onClick={() => onOpenJob(j.id)} style={{cursor:"pointer"}}>
                  <td><span className="ops-ref-badge" style={{ background: tc.soft, color: tc.bg === "#F0FD63" ? "#646B00" : tc.bg }}>{j.jobType}</span><div className="mono sm ops-ref-no">{j.ref}</div></td>
                  <td className="cell-title">{j.name.replace(/^.*— /, "")}<div className="cell-sub">{inv.n} item{inv.n !== 1 ? "s" : ""}{inv.vol ? " · " + inv.vol.toFixed(2) + " m³" : ""}</div></td>
                  <td className="cell-sub">{cl ? cl.name : "—"}</td>
                  <td className="cell-sub ops-route-cell">{rt.from} <ArrowRight size={11} /> {rt.to}</td>
                  <td><div className="ops-prog"><div className="ops-prog-bar"><span style={{ width: p.pct + "%" }} /></div><span className="muted sm">{p.pct}%</span></div></td>
                  <td><Pill label={j.status} tone={JSTATUS_TONE[j.status]} /></td>
                </tr>
              ); })}</tbody>
        </table></div>
      </section>
      <div className="ops-sub-row">
        <section className="panel" style={{flex:2}}>
          <div className="panel-head"><h2>Upcoming collections & deliveries</h2><button className="link-btn" onClick={() => onNav("dispatch")}>Dispatch →</button></div>
          <div className="table-wrap"><table className="data-table">
            <thead><tr><th>When</th><th>Type</th><th>Site</th><th>Job</th></tr></thead>
            <tbody>{upcoming.length === 0 ? <tr><td colSpan={4} className="empty-row">Nothing scheduled in the next three weeks.</td></tr>
              : upcoming.map((u, i) => <tr key={i} onClick={() => onOpenJob(u.job.id)} style={{cursor:"pointer"}}>
                <td className="cell-sub">{fmtDate(u.date)}{u.du <= 0 ? <span className="warn-tag">{u.du === 0 ? "today" : Math.abs(u.du) + "d late"}</span> : <span className="muted sm"> · {u.du}d</span>}</td>
                <td><Pill label={u.kind} tone={u.kind === "Collection" ? "storage" : "consv"} /></td>
                <td className="cell-sub">{u.label}</td>
                <td className="mono sm">{u.job.ref}</td>
              </tr>)}</tbody>
          </table></div>
        </section>
        <section className="panel ops-side-card" style={{flex:1}}>
          <div className="panel-head"><h2>Crew load</h2><button className="link-btn" onClick={() => onNav("team")}>Team →</button></div>
          {loadRows.length === 0 ? <div className="muted" style={{fontSize:12.5,padding:"4px 0"}}>No open assignments.</div>
            : <div className="load-list">{loadRows.map(r => <div className="load-row" key={r.id}><span className="load-name">{r.name}<span className="muted sm"> · {r.func}</span></span><span className="load-n">{r.n}</span></div>)}</div>}
        </section>
      </div>
    </div>
  );
}


export function JobCockpit({ job, client, objects, team, fleet, equipment, agents, locations, packages, quoteById, brandName, role, onNotify, onSave, onEdit, onBack }) {
  const [tab, setTab] = useState("overview");
  useEffect(() => { if (job.workflow == null) onSave({ workflow: workflowTemplate(job, objects, team) }); /* prepopulate once, then fully editable */ }, [job.id]);
  const crew = job.crew || { team: [], fleet: [], equipment: [] };
  const freight = job.freight || {};
  const wf = job.workflow || [];
  const objById = Object.fromEntries((objects || []).map(o => [o.id, o]));
  const teamById = Object.fromEntries((team || []).map(t => [t.id, t]));
  const locById = Object.fromEntries((locations || []).map(l => [l.id, l]));
  const pkgById = Object.fromEntries((packages || []).map(k => [k.id, k]));
  const notifyAssign = (tid, label) => { const m = teamById[tid]; if (m && onNotify) onNotify({ teamId: tid, teamName: m.name, jobId: job.id, jobRef: job.ref, label }); };
  const genWf = () => { const w = workflowTemplate(job, objects, team); setWf(w); const tally = {}; w.forEach(st => st.tasks.forEach(x => { if (x.assignee) tally[x.assignee] = (tally[x.assignee] || 0) + 1; })); Object.entries(tally).forEach(([tid, n]) => { const m = teamById[tid]; if (m && onNotify) onNotify({ teamId: tid, teamName: m.name, jobId: job.id, jobRef: job.ref, label: `${n} action${n > 1 ? "s" : ""} assigned on this job` }); }); };
  const objs = (job.objectIds || []).map(id => objById[id]).filter(Boolean);
  const doc = DOC_BY_MODE[job.mode] || { label: "Transport document", abbr: "DOC" };
  const setFreight = (patch) => onSave({ freight: { ...freight, ...patch } });
  const toggleCrew = (k, id) => { const arr = crew[k] || []; onSave({ crew: { ...crew, [k]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] } }); };
  const setList = (key, list) => onSave({ [key]: list });
  const addEntry = (key, seed) => setList(key, [...(job[key] || []), { id: uid(), label: "", address: "", contact: "", date: "", status: "Planned", notes: "", ...seed }]);
  const updEntry = (key, id, patch) => setList(key, (job[key] || []).map(e => e.id === id ? { ...e, ...patch } : e));
  const delEntry = (key, id) => setList(key, (job[key] || []).filter(e => e.id !== id));
  // workflow handlers
  const setWf = (w) => onSave({ workflow: w });
  const toggleTask = (sk, tid) => setWf(wf.map(st => st.key === sk ? { ...st, tasks: st.tasks.map(x => x.id === tid ? { ...x, done: !x.done } : x) } : st));
  const setTask = (sk, tid, patch) => setWf(wf.map(st => st.key === sk ? { ...st, tasks: st.tasks.map(x => x.id === tid ? { ...x, ...patch } : x) } : st));
  const addTask = (sk) => setWf(wf.map(st => st.key === sk ? { ...st, tasks: [...st.tasks, { id: uid(), label: "New action", done: false, assignee: "", note: "", objectId: null }] } : st));
  const delTask = (sk, tid) => setWf(wf.map(st => st.key === sk ? { ...st, tasks: st.tasks.filter(x => x.id !== tid) } : st));
  const stageStatus = (st) => { const d = st.tasks.filter(x => x.done).length; return d === 0 ? "Pending" : d === st.tasks.length ? "Done" : "Active"; };
  const SS_TONE = { Pending: "neutral", Active: "storage", Done: "consv" };
  const allTasks = wf.flatMap(st => st.tasks.map(x => ({ ...x, stage: st.label })));
  const doneCount = allTasks.filter(x => x.done).length;
  const pct = allTasks.length ? Math.round(doneCount / allTasks.length * 100) : 0;
  const currentStage = wf.find(st => st.tasks.some(x => !x.done));
  const nextActions = allTasks.filter(x => !x.done).slice(0, 4);
  const originAgent = agents.find(a => a.id === job.originAgentId);
  const destAgent = agents.find(a => a.id === job.destAgentId);
  const agentSeed = (a) => a ? { label: a.name, address: `${a.city || ""}${a.country ? ", " + a.country : ""}`, contact: a.contact || a.phone || "" } : null;
  const tabs = [["overview", "Overview"], ["workflow", "Workflow"], ["schedule", "Resources & Schedule"], ["freight", "Freight & documents"], ["inventory", "Job inventory"], ["docs", "Documents & comms"]];
  const EntryList = ({ keyName, title, noteKind, agent, agentLabel }) => (
    <div className="cock-col">
      <div className="cock-h">{title}</div>
      <div className="cock-col-acts">
        {agent && <button className="btn btn-sm btn-ghost" onClick={() => addEntry(keyName, agentSeed(agent))}><Globe size={12} />From {agentLabel}</button>}
        <button className="btn btn-sm btn-ghost" onClick={() => addEntry(keyName)}><Plus size={12} />Add</button>
      </div>
      {(job[keyName] || []).length === 0 && <div className="ln-empty">Nothing scheduled yet.</div>}
      {(job[keyName] || []).map(e => (
        <div className="cock-entry" key={e.id}>
          <div className="cock-entry-top">
            <input className="cock-in" value={e.label} onChange={ev => updEntry(keyName, e.id, { label: ev.target.value })} placeholder="Site / party" />
            <select className="cock-sel" value={e.status || "Planned"} onChange={ev => updEntry(keyName, e.id, { status: ev.target.value })}>{["Planned", "Booked", "Done"].map(s => <option key={s}>{s}</option>)}</select>
            <input className="cock-in cock-date" type="date" value={e.date || ""} onChange={ev => updEntry(keyName, e.id, { date: ev.target.value })} />
            <button className="ln-del" onClick={() => delEntry(keyName, e.id)}><Trash2 size={13} /></button>
          </div>
          <input className="cock-in" value={e.address || ""} onChange={ev => updEntry(keyName, e.id, { address: ev.target.value })} placeholder="Address" />
          <div className="cock-entry-top">
            <input className="cock-in" value={e.contact || ""} onChange={ev => updEntry(keyName, e.id, { contact: ev.target.value })} placeholder="Contact" />
            <button className="btn btn-sm btn-ghost" onClick={() => printOpsDoc(noteKind, job, client, brandName, e)}><Printer size={12} />Note</button>
          </div>
          <input className="cock-in" value={e.notes || ""} onChange={ev => updEntry(keyName, e.id, { notes: ev.target.value })} placeholder="Notes / instructions" />
        </div>
      ))}
    </div>
  );
  const CrewGroup = ({ k, title, list, render }) => (
    <div className="cock-crew-group">
      <div className="pb-head">{title} <span className="muted">· {(crew[k] || []).length} selected</span></div>
      <div className="cock-chips">
        {list.map(item => { const on = (crew[k] || []).includes(item.id); return (
          <button key={item.id} className={"cock-chip" + (on ? " on" : "")} onClick={() => toggleCrew(k, item.id)}>{on ? <Check size={12} /> : <Plus size={12} />}{render(item)}</button>
        ); })}
        {list.length === 0 && <span className="muted sm">None on file.</span>}
      </div>
    </div>
  );
  return (
    <div className="cockpit">
      <div className="cock-head">
        <button className="icon-btn" onClick={onBack} title="Back to jobs"><ArrowLeft size={18} /></button>
        <div className="cock-title"><h1>{job.ref}<Pill label={job.status} tone={JSTATUS_TONE[job.status]} /></h1><span>{job.name} · {client ? client.name : "—"}</span></div>
        <div className="spacer" />
        <select className="cock-status" value={job.status} onChange={e => onSave({ status: e.target.value })}>{JOB_STATUS.map(s => <option key={s}>{s}</option>)}</select>
        <button className="btn btn-ghost" onClick={() => onEdit(job)}><Edit3 size={14} />Edit details</button>
      </div>
      <div className="cock-tabs">{tabs.map(([v, l]) => <button key={v} className={"cock-tab" + (tab === v ? " on" : "")} onClick={() => setTab(v)}>{l}</button>)}</div>
      <div className="cock-body">
        {tab === "overview" && <>
          {(() => {
            const jc = jobTypeColor(job.jobType);
            const colAddr = (job.collections && job.collections[0] && job.collections[0].address) ? job.collections[0].address : (job.origin || "—");
            const delAddr = (job.deliveries && job.deliveries[0] && job.deliveries[0].address) ? job.deliveries[0].address : (job.destination || "—");
            const totalVol = objs.reduce((s, o) => s + (objVolM3 ? objVolM3(o) : 0), 0);
            const totalVal = objs.reduce((s, o) => s + (Number(o.value) || 0), 0);
            const ccy = (client && client.currency) || (objs[0] && objs[0].valueCcy) || "AED";
            return (
              <>
                <div className="job-topband">
                  <div className="jtb-l"><span className="jtb-k">Reference / scope</span><span className="jtb-v">{job.name || job.ref}</span>{job.clientRef ? <span className="jtb-sub">Client ref: {job.clientRef}</span> : null}</div>
                  <div className="jtb-r"><Pill label={job.status} tone={JSTATUS_TONE[job.status]} /><span className="jtb-badge" style={{ background: jc.bg, color: jc.fg }}>{job.jobType || "Job"} · {job.ref}</span></div>
                </div>

                <div className="est-h"><span className="est-h-no">1</span>Customer</div>
                {client ? (
                  <div className="cust-card cust-card-2">
                    <div className="cust-row"><span className="cust-k">Account</span><span>{client.name}</span></div>
                    <div className="cust-row"><span className="cust-k">Type</span><span>{client.type || "—"}</span></div>
                    <div className="cust-row"><span className="cust-k">Contact</span><span>{client.contact || "—"}</span></div>
                    <div className="cust-row"><span className="cust-k">Email</span><span>{client.email || "—"}</span></div>
                    <div className="cust-row"><span className="cust-k">Phone</span><span>{client.phone || "—"}</span></div>
                    <div className="cust-row cust-full"><span className="cust-k">Address</span><span>{client.address || "—"}</span></div>
                  </div>
                ) : <div className="cust-card"><div className="cust-row"><span className="cust-k">Account</span><span>—</span></div></div>}

                <div className="est-h"><span className="est-h-no">2</span>Shipment classification</div>
                <div className="cust-card cust-card-2">
                  <div className="cust-row"><span className="cust-k">Job type</span><span>{job.jobType || "—"}</span></div>
                  <div className="cust-row"><span className="cust-k">Movement</span><span>{job.movement || "—"}</span></div>
                  <div className="cust-row"><span className="cust-k">Mode</span><span>{[job.mode, job.seaLoad].filter(Boolean).join(" · ") || "—"}</span></div>
                  <div className="cust-row"><span className="cust-k">Declared value</span><span>{totalVal ? fmtMoney(totalVal, ccy) : "—"}</span></div>
                  <div className="cust-row cust-full"><span className="cust-k">Shipper</span><span>{job.shipper && (job.shipper.name || partyAddr(job.shipper)) ? partyOneLine(job.shipper) : <span className="muted">{(job.collections && job.collections[0] && job.collections[0].label) ? job.collections[0].label + " — " : ""}{colAddr}</span>}</span></div>
                  <div className="cust-row cust-full"><span className="cust-k">Consignee</span><span>{job.consignee && (job.consignee.name || partyAddr(job.consignee)) ? partyOneLine(job.consignee) : <span className="muted">{(job.deliveries && job.deliveries[0] && job.deliveries[0].label) ? job.deliveries[0].label + " — " : ""}{delAddr}</span>}</span></div>
                </div>

                <div className="est-h"><span className="est-h-no">3</span>Inventory &amp; summary</div>
                <div className="job-stat-row">
                  <div className="job-stat"><span className="js-k">Inventory</span><span className="js-v">{objs.length}</span><span className="js-sub">item{objs.length !== 1 ? "s" : ""}</span></div>
                  <div className="job-stat"><span className="js-k">Volume</span><span className="js-v">{totalVol.toFixed(2)}</span><span className="js-sub">m³</span></div>
                  <div className="job-stat"><span className="js-k">Declared value</span><span className="js-v js-money">{fmtMoney(totalVal, ccy)}</span></div>
                  <div className="job-stat"><span className="js-k">Insurance</span><span className="js-v">{objs.some(o => o.insuredByUs) ? <span className="ins-on">Covered by us</span> : <span className="ins-off">Client / excluded</span>}</span><span className="js-sub">{objs.filter(o => o.insuredByUs).length}/{objs.length} items</span></div>
                </div>
              </>
            );
          })()}
          <div className="job-stat-row">
            <div className="job-stat"><span className="js-k">Inventory</span><span className="js-v">{objs.length}</span><span className="js-sub">item{objs.length !== 1 ? "s" : ""}</span></div>
            <div className="job-stat"><span className="js-k">Volume</span><span className="js-v">{(objs.reduce((s, o) => s + (objVolM3 ? objVolM3(o) : 0), 0)).toFixed(2)}</span><span className="js-sub">m³</span></div>
            <div className="job-stat"><span className="js-k">Declared value</span><span className="js-v js-money">{fmtMoney(objs.reduce((s, o) => s + (Number(o.value) || 0), 0), (client && client.currency) || "AED")}</span></div>
            <div className="job-stat"><span className="js-k">Insurance</span><span className="js-v">{objs.some(o => o.insuredByUs) ? <span className="ins-on">Covered by us</span> : <span className="ins-off">Client / excluded</span>}</span><span className="js-sub">{objs.filter(o => o.insuredByUs).length}/{objs.length} items</span></div>
          </div>
          <div className="cock-summary">
            <div className="cock-sum-main">
              <div className="cock-h">Progress</div>
              <div className="cock-prog"><div className="cock-prog-bar"><span style={{ width: pct + "%" }} /></div><span className="muted sm">{doneCount}/{allTasks.length || 0} actions · {pct}% complete{currentStage ? " · now: " + currentStage.label : (wf.length ? " · all done" : "")}</span></div>
            </div>
            <div className="cock-next">
              <div className="cock-h">Next actions</div>
              {wf.length === 0 ? <button className="btn btn-sm btn-primary" onClick={genWf}><Sparkles size={14} />Generate workflow</button>
                : nextActions.length === 0 ? <span className="muted sm">All actions complete.</span>
                  : <ul className="cock-next-list">{nextActions.map(a => <li key={a.id}><span className="muted sm">{a.stage}{a.role ? " · " + a.role : ""}</span>{a.label}</li>)}</ul>}
            </div>
          </div>
          <div className="cock-grid">
            <div className="cock-card"><div className="pb-head">Schedule</div><div className="cock-kv"><span>Start</span><b>{fmtDate(job.startDate)}</b></div><div className="cock-kv"><span>Due</span><b>{fmtDate(job.dueDate) || "—"}</b></div></div>
            <div className="cock-card"><div className="pb-head">Commercial</div><div className="cock-kv"><span>Quotation</span><b>{job.quoteId && quoteById[job.quoteId] ? quoteById[job.quoteId].ref : job.ref}</b></div><div className="cock-kv"><span>Reference</span><b className="mono">{job.ref}</b></div></div>
            <div className="cock-card"><div className="pb-head">Resources allocated</div><div className="cock-kv"><span>Crew</span><b>{(crew.team || []).length}</b></div><div className="cock-kv"><span>Fleet</span><b>{(crew.fleet || []).length}</b></div></div>
          </div>
          <div className="cock-card"><div className="cock-h">Parties & agents</div>
            <div className="form-grid">
              <L label="Origin agent"><select value={job.originAgentId || ""} onChange={e => onSave({ originAgentId: e.target.value })}><option value="">— none —</option>{agents.map(a => <option key={a.id} value={a.id}>{a.name} · {a.city}</option>)}</select></L>
              <L label="Destination agent"><select value={job.destAgentId || ""} onChange={e => onSave({ destAgentId: e.target.value })}><option value="">— none —</option>{agents.map(a => <option key={a.id} value={a.id}>{a.name} · {a.city}</option>)}</select></L>
            </div>
            {(originAgent || destAgent) && <div className="cock-agents">{originAgent && <div className="cock-agent"><span className="muted sm">Origin</span><b>{originAgent.name}</b><span>{originAgent.city}, {originAgent.country}</span><span className="muted sm">{originAgent.contact} · {originAgent.phone}</span></div>}{destAgent && <div className="cock-agent"><span className="muted sm">Destination</span><b>{destAgent.name}</b><span>{destAgent.city}, {destAgent.country}</span><span className="muted sm">{destAgent.contact} · {destAgent.phone}</span></div>}</div>}
          </div>
        </>}
        {tab === "workflow" && <div className="cock-card">
          <div className="ln-head"><h4>Process workflow · {job.jobType}</h4>{wf.length > 0 && <button className="btn btn-sm btn-ghost" onClick={genWf} title="Regenerate from job type"><Sparkles size={12} />Regenerate</button>}</div>
          {wf.length === 0 ? <div className="cock-seed"><p className="muted">{job.workflow == null ? "Preparing the suggested workflow for this job…" : "Workflow cleared. Rebuild the suggested steps for this job type?"}</p><button className="btn btn-primary" onClick={genWf}><Sparkles size={15} />Generate workflow</button></div>
            : wf.map(st => { const ss = stageStatus(st); return (
              <div className="wf-stage" key={st.key}>
                <div className="wf-stage-head"><span className="wf-stage-name">{st.label}</span><Pill label={ss} tone={SS_TONE[ss]} /><span className="muted sm">{st.tasks.filter(x => x.done).length}/{st.tasks.length}</span><div className="spacer" /><button className="wf-add" onClick={() => addTask(st.key)} title="Add action"><Plus size={13} /></button></div>
                {st.tasks.map(x => { const o = x.objectId && objById[x.objectId]; return (
                  <div className={"wf-task" + (x.done ? " done" : "")} key={x.id}>
                    <button className="cock-check" onClick={() => toggleTask(st.key, x.id)}>{x.done ? <CheckCircle2 size={17} /> : <span className="cock-circle" />}</button>
                    <div className="wf-task-main">
                      <input className="wf-task-in" value={x.label} onChange={e => setTask(st.key, x.id, { label: e.target.value })} />
                      {o && <span className="wf-obj" title={o.title}>{o.ref}</span>}
                      {x.role && <span className="wf-role" title="Responsible function">{x.role}</span>}
                    </div>
                    <select className={"wf-assignee" + (x.assignee ? "" : " unassigned")} value={x.assignee || ""} onChange={e => { const v = e.target.value; const prev = x.assignee; setTask(st.key, x.id, { assignee: v }); if (v && v !== prev) notifyAssign(v, x.label); }} title={"Responsible: " + (x.role || "")}><option value="">Unassigned</option>{[...team].sort((a, b) => (a.func === x.role ? 0 : 1) - (b.func === x.role ? 0 : 1)).map(tm => <option key={tm.id} value={tm.id}>{tm.name} · {tm.func || tm.role}</option>)}</select>
                    <button className="wf-ticket" title="Print work ticket for crew" onClick={() => printWorkTicket(job, client, x, teamById[x.assignee] ? teamById[x.assignee].name : "", brandName)}><Printer size={13} /></button>
                    <button className="ln-del" onClick={() => delTask(st.key, x.id)}><Trash2 size={13} /></button>
                  </div>
                ); })}
              </div>
            ); })}
        </div>}
        {tab === "schedule" && <div className="cock-card">
          <div className="cock-h">Collections &amp; deliveries</div>
          <div className="cock-2col"><EntryList keyName="collections" title="Collections" noteKind="collection" agent={originAgent} agentLabel="origin agent" /><EntryList keyName="deliveries" title="Deliveries" noteKind="delivery" agent={destAgent} agentLabel="destination agent" /></div>
          <div className="cock-h" style={{ marginTop: 22 }}>Resource requests <span className="cock-h-sub">— what each task needs, by date. The dispatcher allocates real resources from the Dispatch board.</span></div>
          {(() => {
            const reqs = jobRequests(job);
            const slots = [...(job.collections || []).map(c => ({ ...c, kind: "Collection" })), ...(job.deliveries || []).map(c => ({ ...c, kind: "Delivery" }))];
            const saveReqs = (next) => onSave({ resourceRequests: next });
            const addReq = () => saveReqs([...reqs, { id: uid(), date: "", time: "", label: "", slotId: "", slotKind: "", crew: {}, fleet: {}, equipment: {}, notes: "", status: "Requested", alloc: { team: [], fleet: [], equipment: [], subs: [] } }]);
            const updReq = (id, patch) => saveReqs(reqs.map(r => r.id === id ? { ...r, ...patch } : r));
            const updCount = (id, group, key, v) => { const r = reqs.find(x => x.id === id); updReq(id, { [group]: { ...(r[group] || {}), [key]: Math.max(0, parseInt(v || 0, 10) || 0) } }); };
            const delReq = (id) => saveReqs(reqs.filter(r => r.id !== id));
            return (
              <>
                {reqs.length === 0 && <div className="ln-empty">No resource requests yet. Add one per task/movement — e.g. “12 Jun · Collection · 2 packers + 1 climate truck”. Each appears on the dispatch board for allocation.</div>}
                <div className="rq-lines">
                  {reqs.map(r => {
                    const total = reqCount(r), got = reqAllocCount(r);
                    return (
                      <div className="rq-line" key={r.id}>
                        <div className="rq-line-head">
                          <div className="rq-line-when">
                            <input type="date" className="cock-in rq-date" value={r.date || ""} onChange={e => updReq(r.id, { date: e.target.value })} />
                            <input type="time" className="cock-in rq-time" value={r.time || ""} onChange={e => updReq(r.id, { time: e.target.value })} />
                            <select className="cock-sel" value={r.slotId || ""} onChange={e => { const sl = slots.find(x => x.id === e.target.value); updReq(r.id, { slotId: e.target.value, slotKind: sl ? sl.kind : "", label: sl ? (sl.kind + " · " + (sl.label || "")) : r.label, date: sl && sl.date ? sl.date : r.date }); }}>
                              <option value="">Standalone task…</option>
                              {slots.map(sl => <option key={sl.id} value={sl.id}>{sl.kind} · {sl.label || "(unnamed)"}{sl.date ? " · " + fmtDate(sl.date) : ""}</option>)}
                            </select>
                            <input className="cock-in rq-lbl" placeholder="Label (e.g. Install crew)" value={r.label || ""} onChange={e => updReq(r.id, { label: e.target.value })} />
                          </div>
                          <div className="rq-line-stat">
                            <Pill label={r.status || "Requested"} tone={REQ_STATUS_TONE[r.status || "Requested"]} />
                            <span className="muted sm">{got}/{total || 0}</span>
                            <button className="icon-btn-sm" title="Remove request" onClick={() => delReq(r.id)}><Trash2 size={13} /></button>
                          </div>
                        </div>
                        <div className="rq-grid rq-grid-sm">
                          <div className="rq-col"><div className="pb-head">Crew</div>{REQUEST_FUNCTIONS.map(fn => <div className="rq-row" key={fn}><span className="rq-label">{fn}</span><input className="rq-num" type="number" min="0" value={(r.crew || {})[fn] || ""} onChange={e => updCount(r.id, "crew", fn, e.target.value)} placeholder="0" /></div>)}</div>
                          <div className="rq-col"><div className="pb-head">Fleet</div>{REQUEST_FLEET.map(fn => <div className="rq-row" key={fn}><span className="rq-label">{fn}</span><input className="rq-num" type="number" min="0" value={(r.fleet || {})[fn] || ""} onChange={e => updCount(r.id, "fleet", fn, e.target.value)} placeholder="0" /></div>)}</div>
                          <div className="rq-col"><div className="pb-head">Equipment</div>{REQUEST_EQUIP.map(fn => <div className="rq-row" key={fn}><span className="rq-label">{fn}</span><input className="rq-num" type="number" min="0" value={(r.equipment || {})[fn] || ""} onChange={e => updCount(r.id, "equipment", fn, e.target.value)} placeholder="0" /></div>)}</div>
                        </div>
                        <div className="form-grid"><L label="Notes (special requirements, access, timing)" full><textarea rows={1} value={r.notes || ""} onChange={e => updReq(r.id, { notes: e.target.value })} placeholder="e.g. tail-lift; conservation-trained senior tech" /></L></div>
                        {got > 0 && <div className="rq-alloc-ro"><span className="vp-label">Allocated by dispatch</span> {(r.alloc?.team || []).map(id => { const t = team.find(x => x.id === id); return t ? <span className="cock-chip on ro" key={id}><Check size={11} />{t.name}</span> : null; })}{(r.alloc?.fleet || []).map(id => { const f = fleet.find(x => x.id === id); return f ? <span className="cock-chip on ro" key={id}><Truck size={11} />{f.name || f.type}</span> : null; })}{(r.alloc?.equipment || []).map(id => { const eq = equipment.find(x => x.id === id); return eq ? <span className="cock-chip on ro" key={id}><Wrench size={11} />{eq.name}</span> : null; })}{(r.alloc?.subs || []).map((sb, i) => <span className="cock-chip on ro" key={"s" + i}><Building2 size={11} />{sb.name}</span>)}</div>}
                      </div>
                    );
                  })}
                </div>
                <button className="btn btn-ghost" onClick={addReq}><Plus size={15} />Add resource request</button>
                <div className="alloc-ro-note" style={{ marginTop: 14 }}><ShieldCheck size={15} />Real resources are allocated by the dispatcher on the Dispatch board. Allocations and confirmations appear here automatically.</div>
              </>
            );
          })()}
        </div>}
        {tab === "freight" && <div className="cock-card cock-freight">
          <div className="cock-h">Freight booking · {doc.label}</div>
          <div className="form-grid">
            <L label="Carrier"><input value={freight.carrier || ""} onChange={e => setFreight({ carrier: e.target.value })} placeholder={job.mode === "Air" ? "e.g. Emirates SkyCargo" : job.mode === "Sea" ? "e.g. CMA CGM" : "e.g. ARTECO fleet"} /></L>
            <L label="Forwarder / issuing agent"><input value={freight.agent || ""} onChange={e => setFreight({ agent: e.target.value })} placeholder="e.g. ARTECO Forwarding" /></L>
            <L label="Booking / master ref"><input value={freight.ref || ""} onChange={e => setFreight({ ref: e.target.value })} /></L>
            <L label={doc.abbr + " number"}><input value={freight.docNo || ""} onChange={e => setFreight({ docNo: e.target.value })} /></L>
            <L label="Flight / vessel / vehicle"><input value={freight.flight || ""} onChange={e => setFreight({ flight: e.target.value })} placeholder={job.mode === "Air" ? "e.g. EK9870" : job.mode === "Sea" ? "e.g. MV ... / voyage" : "e.g. truck / plate"} /></L>
            <L label={job.mode === "Sea" ? "Port of loading" : job.mode === "Air" ? "Airport of departure" : "Place of loading"}><input value={freight.origin || ""} onChange={e => setFreight({ origin: e.target.value })} placeholder={job.origin || ""} /></L>
            <L label={job.mode === "Sea" ? "Port of discharge" : job.mode === "Air" ? "Airport of destination" : "Place of delivery"}><input value={freight.dest || ""} onChange={e => setFreight({ dest: e.target.value })} placeholder={job.destination || ""} /></L>
            <L label="ETD"><input type="date" value={freight.etd || ""} onChange={e => setFreight({ etd: e.target.value })} /></L>
            <L label="ETA"><input type="date" value={freight.eta || ""} onChange={e => setFreight({ eta: e.target.value })} /></L>
          </div>
          <div className="pb-head">Pieces, weight &amp; charges</div>
          <div className="form-grid">
            <L label="No. of pieces"><input type="number" value={freight.pieces ?? ""} onChange={e => setFreight({ pieces: e.target.value })} placeholder={String((job.objectIds || []).length || "")} /></L>
            <L label="Gross weight (kg)"><input type="number" value={freight.grossWt ?? ""} onChange={e => setFreight({ grossWt: e.target.value })} /></L>
            <L label="Chargeable weight (kg)"><input type="number" value={freight.chgWt ?? ""} onChange={e => setFreight({ chgWt: e.target.value })} /></L>
            <L label="Volume (m³)"><input type="number" value={freight.volume ?? ""} onChange={e => setFreight({ volume: e.target.value })} /></L>
            <L label="Nature of goods"><input value={freight.goods || ""} onChange={e => setFreight({ goods: e.target.value })} placeholder="e.g. Works of art — paintings" /></L>
            <L label="Currency"><input value={freight.ccy || "AED"} onChange={e => setFreight({ ccy: e.target.value })} /></L>
            <L label="Weight charge"><input type="number" value={freight.weightCharge ?? ""} onChange={e => setFreight({ weightCharge: e.target.value })} /></L>
            <L label="Other charges"><input type="number" value={freight.otherCharges ?? ""} onChange={e => setFreight({ otherCharges: e.target.value })} /></L>
          </div>
          <button className="btn btn-primary" onClick={() => { printFreightDoc(job, client, brandName); onSave({ files: [makeEntry({ kind: "System", title: doc.abbr + " draft generated", body: (freight.carrier ? "Carrier: " + freight.carrier : "") + (freight.docNo ? " · " + doc.abbr + " " + freight.docNo : "") }), ...(Array.isArray(job.files) ? job.files : [])] }); }}><FileText size={15} />Generate {doc.abbr} draft</button>
        </div>}
        {tab === "inventory" && <div className="cock-card">
          <div className="ln-head"><h4>Job inventory · {objs.length} item(s)</h4>
            <select className="cock-sel" value="" onChange={e => { const id = e.target.value; if (id) onSave({ objectIds: [...(job.objectIds || []), id] }); }}>
              <option value="">+ Add object from inventory…</option>
              {objects.filter(o => !(job.objectIds || []).includes(o.id)).map(o => <option key={o.id} value={o.id}>{o.ref} · {o.title}{o.artist ? " — " + o.artist : ""}</option>)}
            </select>
          </div>
          {objs.length === 0 ? <div className="ln-empty">No objects linked yet. Add inventory above — linked items also drive the warehouse-prep steps in the workflow.</div>
            : <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Ref</th><th>Title</th><th>Medium</th><th>Dimensions</th><th className="ta-r">Weight</th><th className="ta-r">Value</th><th>Custody</th><th>Location</th><th></th></tr></thead>
              <tbody>{objs.map(o => { const d = objDimsCm(o); return (
                <tr key={o.id}>
                  <td className="mono sm">{o.ref}</td>
                  <td className="cell-title">{o.title}{o.artist ? <span className="muted sm"> · {o.artist}</span> : ""}</td>
                  <td className="cell-sub">{o.medium || "—"}</td>
                  <td className="cell-sub">{d.h && d.w ? `${d.h}×${d.w}${d.d ? "×" + d.d : ""} cm` : "—"}</td>
                  <td className="ta-r cell-sub">{o.weight ? o.weight + " " + (o.wUnit || "kg") : "—"}</td>
                  <td className="ta-r cell-sub">{fmtMoney(o.value, o.valueCcy)}</td>
                  <td><StateChip object={o} /></td>
                  <td className="cell-sub">{o.locationId && locById[o.locationId] ? locById[o.locationId].name : (o.packageId && pkgById[o.packageId] ? pkgById[o.packageId].type : "—")}</td>
                  <td className="ta-r"><button className="ln-del" title="Remove from job" onClick={() => onSave({ objectIds: (job.objectIds || []).filter(x => x !== o.id) })}><Trash2 size={13} /></button></td>
                </tr>
              ); })}</tbody>
            </table></div>}
        </div>}
        {tab === "docs" && <div className="cock-card"><DocFolder files={job.files} onChange={(f) => onSave({ files: f })} label={"Job " + job.ref} /></div>}
      </div>
    </div>
  );
}


export function JobsView({ jobs, clientById, quoteById, agentById, tasks, objects, onNew, onEdit, onOpen, onOpenObject, onOpenTasks }) {
  const [tab, setTab] = useState("all");
  const taskStat = (jid) => { const t = tasks.filter(x => x.projectId === jid); return { done: t.filter(x => x.status === "Done").length, total: t.length }; };
  const order = { Confirmed: 0, Closed: 1, Lost: 2, Cancelled: 3 };
  const matchTab = (j) => tab === "all" ? true : tab === "open" ? j.status === "Confirmed" : j.jobType === tab;
  const sorted = [...jobs].filter(matchTab).sort((a, b) => (order[a.status] - order[b.status]) || (a.dueDate || "").localeCompare(b.dueDate || ""));
  const openJobs = jobs.filter(j => j.status === "Confirmed").length;
  const tabs = [["all", "All"], ["open", "Open"], ["Export", "Export"], ["Import", "Import"], ["Local", "Local"]];
  return (
    <div className="dash">
      <div className="stat-row">
        <Stat icon={Briefcase} label="Open jobs" value={openJobs} accent />
        <Stat icon={ClipboardCheck} label="Open tasks" value={tasks.filter(t => t.status !== "Done").length} />
        <Stat icon={Boxes} label="Objects in jobs" value={new Set(jobs.flatMap(j => j.objectIds || [])).size} />
        <Stat icon={Layers} label="Total jobs" value={jobs.length} />
      </div>
      <div className="toolbar">
        <div className="seg seg-tabs">{tabs.map(([v, l]) => <button key={v} className={"seg-btn" + (tab === v ? " on" : "")} onClick={() => setTab(v)}>{l}</button>)}</div>
        <div className="spacer" />
        <button className="btn btn-ghost" onClick={onOpenTasks}><ClipboardCheck size={15} />Task board</button>
        <button className="btn btn-primary" onClick={onNew}><Plus size={16} />New job</button>
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Jobs</h2><span className="muted">{sorted.length}</span></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Reference</th><th>Job</th><th>Bill-to</th><th>Classification</th><th>Status</th><th className="ta-r">Obj.</th><th className="ta-r">Tasks</th><th>Due</th></tr></thead>
          <tbody>
            {sorted.map(j => {
              const ts = taskStat(j.id); const du = daysUntil(j.dueDate); const late = du != null && du < 0 && j.status === "Confirmed";
              const agents = [j.originAgentId, j.destAgentId].filter(Boolean).length;
              return (
                <tr key={j.id} onClick={() => onOpen(j)} style={{cursor:"pointer"}}>
                  <td className="mono">{j.ref}</td>
                  <td><div className="cell-title">{j.name}</div>{j.quoteId && quoteById[j.quoteId] && <div className="cell-sub2">from {quoteById[j.quoteId].ref}{agents ? ` · ${agents} agent${agents > 1 ? "s" : ""}` : ""}</div>}</td>
                  <td>{clientById[j.clientId]?.name || "—"}</td>
                  <td><JobChips job={j} /></td>
                  <td><Pill label={j.status} tone={JSTATUS_TONE[j.status]} /></td>
                  <td className="ta-r">{(j.objectIds || []).length}</td>
                  <td className="ta-r mono">{ts.total ? `${ts.done}/${ts.total}` : "—"}</td>
                  <td className="cell-sub">{fmtDate(j.dueDate)}{late && <span className="warn-tag">late</span>}</td>
                </tr>
              );
            })}
            {sorted.length === 0 && <tr><td colSpan={8} className="empty-row">No jobs in this view — confirm a won quote, or create one directly.</td></tr>}
          </tbody>
        </table></div>
      </section>
    </div>
  );
}


export function JobForm({ initial, clients, quotes, objects, agents, onSave, onClose }) {
  const [f, setF] = useState(() => ({ name: "", clientId: clients[0]?.id, jobType: "Export", movement: "Door-to-port", mode: "Air", seaLoad: "", configKey: "", status: "Confirmed", startDate: new Date().toISOString().slice(0, 10), dueDate: "", objectIds: [], collections: [], deliveries: [], originAgentId: "", destAgentId: "", quoteId: "", notes: "", ...initial }));
  const moves = movementsFor(f.jobType);
  const setType = (t) => setF(s => ({ ...s, jobType: t, movement: movementsFor(t).includes(s.movement) ? s.movement : movementsFor(t)[0] }));
  const toggleObj = (id) => setF(s => ({ ...s, objectIds: s.objectIds.includes(id) ? s.objectIds.filter(x => x !== id) : [...s.objectIds, id] }));
  const custObjs = objects.filter(o => o.clientId === f.clientId);
  return (
    <Modal title={f.id ? `Job ${f.ref}` : "New job"} onClose={onClose} wide>
      <div className="form-grid">
        <L label="Job name" full><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="e.g. SAF loan — Reclining Form" /></L>
        <L label="Bill-to (paying customer)"><select value={f.clientId || ""} onChange={e => setF({ ...f, clientId: e.target.value, objectIds: [] })}>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></L>
        <L label="Status"><select value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>{JOB_STATUS.map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Job type"><select value={f.jobType} onChange={e => setType(e.target.value)}>{JOB_TYPES.map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Movement"><select value={f.movement} onChange={e => setF({ ...f, movement: e.target.value })}>{moves.map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Mode"><select value={f.mode} onChange={e => setF({ ...f, mode: e.target.value, seaLoad: e.target.value === "Sea" ? (f.seaLoad || "FCL") : "" })}>{MODES.map(x => <option key={x}>{x}</option>)}</select></L>
        {f.mode === "Sea" && <L label="Sea load"><select value={f.seaLoad || "FCL"} onChange={e => setF({ ...f, seaLoad: e.target.value })}>{SEA_LOADS.map(x => <option key={x}>{x}</option>)}</select></L>}
        <L label="Linked quote"><select value={f.quoteId || ""} onChange={e => setF({ ...f, quoteId: e.target.value })}><option value="">— none —</option>{quotes.filter(q => q.clientId === f.clientId).map(q => <option key={q.id} value={q.id}>{q.ref}</option>)}</select></L>
        <L label="Start date"><input type="date" value={f.startDate || ""} onChange={e => setF({ ...f, startDate: e.target.value })} /></L>
        <L label="Due date"><input type="date" value={f.dueDate || ""} onChange={e => setF({ ...f, dueDate: e.target.value })} /></L>
      </div>
      <AddrRows title="Collection addresses" rows={f.collections} onChange={(v) => setF({ ...f, collections: v })} />
      <AddrRows title="Delivery addresses" rows={f.deliveries} onChange={(v) => setF({ ...f, deliveries: v })} />
      <div className="form-grid">
        <L label="Origin agent"><select value={f.originAgentId || ""} onChange={e => setF({ ...f, originAgentId: e.target.value })}><option value="">— none —</option>{agents.map(a => <option key={a.id} value={a.id}>{a.name} · {a.city}</option>)}</select></L>
        <L label="Destination / receiving agent"><select value={f.destAgentId || ""} onChange={e => setF({ ...f, destAgentId: e.target.value })}><option value="">— none —</option>{agents.map(a => <option key={a.id} value={a.id}>{a.name} · {a.city}</option>)}</select></L>
      </div>
      <div className="ln-head"><h4>Objects in this job ({f.objectIds.length})</h4></div>
      <div className="obj-pick">
        {custObjs.length === 0 && <div className="ln-empty">No objects on file for this customer.</div>}
        {custObjs.map(o => (
          <label className={"obj-pick-row" + (f.objectIds.includes(o.id) ? " on" : "")} key={o.id}>
            <input type="checkbox" checked={f.objectIds.includes(o.id)} onChange={() => toggleObj(o.id)} />
            {o.thumb ? <img src={o.thumb} alt="" /> : <span className="obj-pick-noimg" />}
            <span className="obj-pick-main"><span className="obj-pick-title">{o.title}</span><span className="obj-pick-sub">{o.artist} · {o.ref}</span></span>
          </label>
        ))}
      </div>
      <div className="form-grid"><L label="Notes" full><textarea rows={2} value={f.notes || ""} onChange={e => setF({ ...f, notes: e.target.value })} /></L></div>
      <ModalFoot onClose={onClose} onSave={() => f.name && f.clientId && onSave(f)} saveLabel="Save job" />
    </Modal>
  );
}


export function JobChips({ job }) {
  return (
    <span className="job-chips">
      <Pill label={job.jobType} tone={JTYPE_TONE[job.jobType]} />
      {job.movement && <span className="chip chip-neutral">{job.movement}</span>}
      {job.mode && <span className="chip chip-neutral">{job.mode}{job.seaLoad ? ` · ${job.seaLoad}` : ""}</span>}
    </span>
  );
}


export function AddrRows({ title, rows, onChange }) {
  const set = (id, patch) => onChange(rows.map(r => r.id === id ? { ...r, ...patch } : r));
  const add = () => onChange([...rows, { id: uid(), label: "", address: "", contact: "", date: "" }]);
  const del = (id) => onChange(rows.filter(r => r.id !== id));
  return (
    <div className="addr-block">
      <div className="ln-head"><h4>{title} ({rows.length})</h4><button className="btn btn-sm btn-ghost" onClick={add}><Plus size={13} />Add address</button></div>
      {rows.length === 0 && <div className="ln-empty">No {title.toLowerCase()} yet.</div>}
      {rows.map(r => (
        <div className="addr-row" key={r.id}>
          <input className="addr-label" value={r.label} onChange={e => set(r.id, { label: e.target.value })} placeholder="Site / name" />
          <input className="addr-addr" value={r.address} onChange={e => set(r.id, { address: e.target.value })} placeholder="Address" />
          <input className="addr-contact" value={r.contact} onChange={e => set(r.id, { contact: e.target.value })} placeholder="Contact" />
          <input className="addr-date" type="date" value={r.date || ""} onChange={e => set(r.id, { date: e.target.value })} />
          <button className="ln-del" onClick={() => del(r.id)} title="Remove"><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  );
}


export function DispatchView({ jobs, team, fleet, equipment, clientById, role, onSaveJob, onOpenJob, onNotify }) {
  const [mode, setMode] = useState("day"); // day | week  (day by default)
  const [anchor, setAnchor] = useState(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; });
  const teamById = Object.fromEntries(team.map(t => [t.id, t]));
  const fleetById = Object.fromEntries(fleet.map(t => [t.id, t]));
  const equipById = Object.fromEntries((equipment || []).map(t => [t.id, t]));
  const live = jobs.filter(j => j.status === "Confirmed");

  // events from collections/deliveries
  const events = [];
  live.forEach(j => {
    (j.collections || []).forEach(c => { if (c.date) events.push({ id: c.id, kind: "Collection", label: c.label || "Collection", date: c.date, time: c.time || "", job: j }); });
    (j.deliveries || []).forEach(c => { if (c.date) events.push({ id: c.id, kind: "Delivery", label: c.label || "Delivery", date: c.date, time: c.time || "", job: j }); });
  });

  const days = mode === "week" ? Array.from({ length: 7 }, (_, i) => { const d = startOfWeek(anchor); d.setDate(d.getDate() + i); return d; }) : [new Date(anchor)];
  const visibleDays = days.map(ymd);
  const evFor = (d) => events.filter(e => e.date === ymd(d)).sort((a, b) => a.kind.localeCompare(b.kind));
  const shift = (n) => { const d = new Date(anchor); d.setDate(d.getDate() + n * (mode === "week" ? 7 : 1)); setAnchor(d); };
  const today = ymd(new Date());
  const rangeLabel = mode === "week"
    ? `${days[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${days[6].toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
    : new Date(anchor).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // jobs active on a given day (have an event that day)
  const jobsOnDay = (dy) => { const ids = new Set(); events.forEach(e => { if (e.date === dy) ids.add(e.job.id); }); return live.filter(j => ids.has(j.id)); };

  // ---- resource allocation across the visible range ----
  // For each resource, which days is it committed and to which jobs (clash if >1 job same day)
  const buildAlloc = (type, idsOf, nameOf, byId) => {
    const store = {};
    live.forEach(j => { const ids = idsOf(j); if (!ids || !ids.length) return;
      const jobDays = (j.collections || []).concat(j.deliveries || []).filter(e => e.date && visibleDays.includes(e.date)).map(e => e.date);
      if (!jobDays.length) return;
      ids.forEach(id => { const r = store[id] || (store[id] = { id, type, byDay: {} }); jobDays.forEach(d => { (r.byDay[d] = r.byDay[d] || new Set()).add(j.id); }); });
    });
    return Object.values(store).map(r => {
      const dayCount = visibleDays.filter(d => r.byDay[d] && r.byDay[d].size).length;
      const clashes = visibleDays.filter(d => r.byDay[d] && r.byDay[d].size > 1);
      const m = byId[r.id];
      return { ...r, name: m ? (m.name || m.type) : "—", sub: m ? (m.role || m.func || m.type || "") : "", dayCount, clashes };
    }).sort((a, b) => b.clashes.length - a.clashes.length || b.dayCount - a.dayCount);
  };
  const crewAlloc = buildAlloc("team", j => (j.crew || {}).team, null, teamById);
  const fleetAlloc = buildAlloc("fleet", j => (j.crew || {}).fleet, null, fleetById);
  const equipAlloc = buildAlloc("equipment", j => (j.crew || {}).equipment, null, equipById);

  // ---- utilisation stats over the visible range ----
  const slots = visibleDays.length; // available "resource-days" denominator basis
  const util = (alloc, total) => { const committedDays = alloc.reduce((s, r) => s + r.dayCount, 0); const denom = total * slots; return denom ? Math.round(committedDays / denom * 100) : 0; };
  const crewUtil = util(crewAlloc, team.length || 1);
  const fleetUtil = util(fleetAlloc, fleet.length || 1);
  const clashTotal = [...crewAlloc, ...fleetAlloc, ...equipAlloc].reduce((s, r) => s + r.clashes.length, 0);
  const idleCrew = team.filter(t => !crewAlloc.some(r => r.id === t.id));
  const idleFleet = fleet.filter(f => !fleetAlloc.some(r => r.id === f.id));

  const unscheduled = live.filter(j => !(j.collections || []).concat(j.deliveries || []).some(e => e.date));

  const [note, setNote] = useState(0);
  const [drawer, setDrawer] = useState(null); // { jobId, reqId }
  // collect all dated request lines from live jobs that fall in the visible range (or have no date)
  const allReqLines = [];
  live.forEach(j => jobRequests(j).forEach(r => { allReqLines.push({ job: j, req: r }); }));
  const reqLinesInRange = allReqLines.filter(({ req }) => !req.date || visibleDays.includes(req.date)).sort((a, b) => (a.req.date || "9999").localeCompare(b.req.date || "9999") || (a.req.time || "").localeCompare(b.req.time || ""));
  const saveReqLine = (jobId, reqId, patch) => { const j = jobs.find(x => x.id === jobId); if (!j) return; const reqs = jobRequests(j).map(r => r.id === reqId ? { ...r, ...patch } : r); if (onSaveJob) onSaveJob(jobId, { resourceRequests: reqs }); };
  const drawerJob = drawer && jobs.find(j => j.id === drawer.jobId);
  const drawerReq = drawerJob && jobRequests(drawerJob).find(r => r.id === drawer.reqId);
  const notifyRange = () => { let n = 0; days.forEach(d => { evFor(d).forEach(e => { const crew = e.job.crew || {}; (crew.team || []).forEach(id => { const m = teamById[id]; if (m && onNotify) { onNotify({ teamId: id, teamName: m.name, jobId: e.job.id, jobRef: e.job.ref, label: `${e.kind} ${fmtDate(e.date)} — ${e.label}` }); n++; } }); }); }); return n; };

  // ---- day timeline: resources (rows) against the day's jobs ----
  const dayKey = ymd(anchor);
  const dayJobs = jobsOnDay(dayKey);
  const resRowsForDay = (alloc, byId, typeLabel, icon) => alloc.filter(r => r.byDay[dayKey] && r.byDay[dayKey].size).map(r => ({ ...r, jobIds: [...r.byDay[dayKey]], typeLabel, icon }));

  return (
    <div className="dash">
      <div className="disp-bar">
        <div className="disp-nav">
          <button className="icon-btn-sm" onClick={() => shift(-1)} title="Previous"><ArrowLeft size={16} /></button>
          <button className="btn btn-sm btn-ghost" onClick={() => { const d = new Date(); d.setHours(0, 0, 0, 0); setAnchor(d); }}>Today</button>
          <button className="icon-btn-sm" onClick={() => shift(1)} title="Next"><ArrowRight size={16} /></button>
          <span className="disp-range">{rangeLabel}</span>
        </div>
        <div className="spacer" />
        <div className="seg">{[["day", "Day"], ["week", "Week"]].map(([v, l]) => <button key={v} className={"seg-btn" + (mode === v ? " on" : "")} onClick={() => setMode(v)}>{l}</button>)}</div>
        <button className="btn btn-primary btn-sm" onClick={() => setNote(notifyRange())} title="Notify assigned crew of this period's slots"><Bell size={14} />Notify crew</button>
      </div>
      {note > 0 && <div className="disp-noted">Sent {note} schedule notification{note > 1 ? "s" : ""} to assigned crew.</div>}

      {/* utilisation stats */}
      <div className="stat-row">
        <Stat icon={CalendarDays} label={mode === "day" ? "Movements today" : "Movements this week"} value={days.reduce((s, d) => s + evFor(d).length, 0)} accent />
        <Stat icon={Users} label="Crew utilisation" value={crewUtil + "%"} />
        <Stat icon={Truck} label="Fleet utilisation" value={fleetUtil + "%"} />
        <Stat icon={AlertTriangle} label="Scheduling clashes" value={clashTotal} small />
      </div>

      {mode === "day" ? (
        <>
          <section className="panel">
            <div className="panel-head"><h2>Day schedule</h2><span className="muted">{dayJobs.length} job{dayJobs.length !== 1 ? "s" : ""} · {evFor(anchor).length} movement{evFor(anchor).length !== 1 ? "s" : ""}</span></div>
            {(() => {
              const START_H = 6, END_H = 24, ROW_H = 64; // 6 AM → midnight, taller rows
              const hours = Array.from({ length: END_H - START_H + 1 }, (_, i) => START_H + i);
              const dayEvs = evFor(anchor);
              const hasTime = (e) => e.time && /^\d{1,2}:\d{2}$/.test(e.time);
              const timed = dayEvs.filter(hasTime).sort((a, b) => a.time.localeCompare(b.time));
              const untimed = dayEvs.filter(e => !hasTime(e));
              const topFor = (t) => { const [h, m] = t.split(":").map(Number); return (h - START_H) * ROW_H + (m / 60) * ROW_H; };
              // lay timed events into columns so overlaps sit side-by-side
              const placed = timed.map(e => ({ e, top: topFor(e.time), col: 0, cols: 1 }));
              placed.forEach((p, i) => { let col = 0; for (let j = 0; j < i; j++) { const q = placed[j]; if (Math.abs(q.top - p.top) < ROW_H - 6 && q.col === col) col++; } p.col = col; });
              const maxCol = placed.reduce((m, p) => Math.max(m, p.col), 0) + 1;
              placed.forEach(p => { p.cols = maxCol; });
              const nowD = new Date(); const isToday = ymd(anchor) === today; const nowTop = (nowD.getHours() - START_H) * ROW_H + (nowD.getMinutes() / 60) * ROW_H;
              return (
                <div className="tgrid-wrap">
                  {untimed.length > 0 && <div className="tgrid-unscheduled"><span className="vp-label">No set time</span>{untimed.map(e => <button className={"tg-ev ev-" + e.kind.toLowerCase()} key={e.id} onClick={() => onOpenJob(e.job.id)}><span className="tg-ev-k">{e.kind}</span> {e.label} <span className="muted">· {e.job.ref}</span></button>)}</div>}
                  <div className="tgrid" style={{ height: (hours.length - 1) * ROW_H + 12 }}>
                    {hours.map((h, i) => <div className="tg-row" key={h} style={{ top: i * ROW_H, height: ROW_H }}><span className="tg-hour">{h === 24 ? "12 AM" : h === 12 ? "12 PM" : h > 12 ? (h - 12) + " PM" : h + " AM"}</span></div>)}
                    {isToday && nowD.getHours() >= START_H && nowD.getHours() < END_H && <div className="tg-now" style={{ top: nowTop }}><span className="tg-now-dot" /><span className="tg-now-lbl">{nowD.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span></div>}
                    {placed.map(({ e, top, col, cols }) => { const crew = e.job.crew || {}; const cl = clientById[e.job.clientId]; const crewN = (crew.team || []).length, fleetN = (crew.fleet || []).length; const w = 100 / cols;
                      return (
                        <button className={"tg-ev-block ev-" + e.kind.toLowerCase()} key={e.id} style={{ top: top + 2, minHeight: ROW_H - 6, left: `calc(${col * w}% + 4px)`, width: `calc(${w}% - 8px)` }} onClick={() => onOpenJob(e.job.id)} title={e.label}>
                          <div className="tg-ev-time"><Clock size={10} />{e.time} · {e.kind}</div>
                          <div className="tg-ev-title">{e.label}{cl ? <span className="muted"> · {cl.name}</span> : null}</div>
                          <div className="tg-ev-ref mono">{e.job.ref}</div>
                          <div className="tg-ev-res">
                            {(crew.team || []).map(id => teamById[id] && <span className="res-chip" key={id}><Users size={10} />{teamById[id].name}</span>)}
                            {(crew.fleet || []).map(id => fleetById[id] && <span className="res-chip res-fleet" key={id}><Truck size={10} />{fleetById[id].name || fleetById[id].type}</span>)}
                            {(crew.equipment || []).map(id => equipById[id] && <span className="res-chip res-eq" key={id}><Wrench size={10} />{equipById[id].name}</span>)}
                            {!crewN && !fleetN && <span className="res-chip res-none">Unassigned — allocate crew</span>}
                          </div>
                        </button>
                      ); })}
                    {dayEvs.length === 0 && <div className="tg-empty">Nothing scheduled for this day. Use the arrows to change day, or add timed collection/delivery slots on a job.</div>}
                  </div>
                </div>
              );
            })()}
          </section>
          <section className="panel">
            <div className="panel-head"><h2>Resources allocated this day</h2></div>
            {[...resRowsForDay(crewAlloc, teamById, "Crew"), ...resRowsForDay(fleetAlloc, fleetById, "Fleet"), ...resRowsForDay(equipAlloc, equipById, "Equipment")].length === 0
              ? <div className="vp-sub">No resources allocated for this day.</div>
              : <div className="alloc-grid">
                {resRowsForDay(crewAlloc, teamById, "Crew").map(r => <div className="alloc-row" key={"t" + r.id}><span className="alloc-ico"><Users size={13} /></span><span className="alloc-name">{r.name}<span className="muted sm"> · {r.sub}</span></span>{r.byDay[dayKey].size > 1 ? <span className="clash-tag">{r.byDay[dayKey].size} jobs</span> : <span className="muted sm">{r.jobIds.length ? jobs.find(j => j.id === r.jobIds[0])?.ref : ""}</span>}</div>)}
                {resRowsForDay(fleetAlloc, fleetById, "Fleet").map(r => <div className="alloc-row" key={"f" + r.id}><span className="alloc-ico"><Truck size={13} /></span><span className="alloc-name">{r.name}</span>{r.byDay[dayKey].size > 1 ? <span className="clash-tag">{r.byDay[dayKey].size} jobs</span> : <span className="muted sm">{r.jobIds.length ? jobs.find(j => j.id === r.jobIds[0])?.ref : ""}</span>}</div>)}
                {resRowsForDay(equipAlloc, equipById, "Equipment").map(r => <div className="alloc-row" key={"e" + r.id}><span className="alloc-ico"><Wrench size={13} /></span><span className="alloc-name">{r.name}</span></div>)}
              </div>}
          </section>
          <section className="panel">
            <div className="panel-head"><h2>Requests to fulfil</h2><span className="muted">{reqLinesInRange.length}</span></div>
            {reqLinesInRange.length === 0 ? <div className="vp-sub">No resource requests in this period. Operators raise dated requests from a job's Crew &amp; dispatch tab.</div>
              : <div className="table-wrap"><table className="data-table">
                <thead><tr><th>When</th><th>Job · task</th><th>Requested</th><th>Status</th><th className="ta-r"></th></tr></thead>
                <tbody>{reqLinesInRange.map(({ job: j, req: r }) => {
                  const total = reqCount(r), got = reqAllocCount(r); const parts = reqParts(r); const done = total > 0 && got >= total;
                  return (
                    <tr key={j.id + r.id}>
                      <td className="cell-sub">{r.date ? fmtDate(r.date) : "—"}{r.time ? <div className="muted sm">{r.time}</div> : null}</td>
                      <td className="cell-title">{j.ref}<div className="cell-sub">{r.label || r.slotKind || "Resources"}{clientById[j.clientId] ? " · " + clientById[j.clientId].name : ""}</div></td>
                      <td className="cell-sub">{parts.length ? parts.join(", ") : <span className="muted">none specified</span>}</td>
                      <td><Pill label={r.status || "Requested"} tone={REQ_STATUS_TONE[r.status || "Requested"]} /> <span className="muted sm">{got}/{total || 0}</span></td>
                      <td className="ta-r">{canAllocate(role) ? <button className="btn btn-sm btn-primary" onClick={() => setDrawer({ jobId: j.id, reqId: r.id })}>Allocate</button> : <button className="btn btn-sm btn-ghost" onClick={() => onOpenJob(j.id)}>View</button>}</td>
                    </tr>
                  );
                })}</tbody>
              </table></div>}
          </section>
        </>
      ) : (
        <div className="cal cal-week">
          {days.map(d => { const evs = evFor(d); const isToday = ymd(d) === today; return (
            <div className={"cal-day" + (isToday ? " today" : "")} key={ymd(d)}>
              <div className="cal-day-head"><span className="cal-dow">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span><span className="cal-date">{d.getDate()}</span></div>
              <div className="cal-events">
                {evs.length === 0 ? <div className="cal-empty">—</div> : evs.map(e => { const crew = e.job.crew || {}; const crewN = (crew.team || []).length; const fleetN = (crew.fleet || []).length; return (
                  <button className={"cal-ev ev-" + e.kind.toLowerCase()} key={e.id} onClick={() => onOpenJob(e.job.id)} title={e.job.ref + " · " + e.label}>
                    <span className="cal-ev-kind">{e.kind}</span>
                    <span className="cal-ev-label">{e.label}</span>
                    <span className="cal-ev-meta">{e.job.ref}{(crewN || fleetN) ? ` · ${crewN ? crewN + " crew" : ""}${fleetN ? " " + fleetN + " veh" : ""}` : " · unassigned"}</span>
                  </button>
                ); })}
              </div>
            </div>
          ); })}
        </div>
      )}

      {/* resources list with usage / availability */}
      <div className="dash-cols">
        <section className="panel">
          <div className="panel-head"><h2>Resources · usage this {mode}</h2><span className="muted">{team.length + fleet.length} total</span></div>
          <div className="table-wrap"><table className="data-table">
            <thead><tr><th>Resource</th><th>Type</th><th>Status</th><th className="ta-r">Days committed</th><th>Availability</th></tr></thead>
            <tbody>
              {team.map(t => { const a = crewAlloc.find(r => r.id === t.id); const dc = a ? a.dayCount : 0; const cl = a ? a.clashes.length : 0; return (
                <tr key={"t" + t.id}>
                  <td className="cell-title">{t.name}<div className="cell-sub">{t.role}</div></td>
                  <td><Pill label="Crew" tone="storage" /></td>
                  <td className="cell-sub">{t.status || "—"}</td>
                  <td className="ta-r mono">{dc}/{slots}</td>
                  <td>{cl ? <span className="clash-tag">{cl} clash{cl > 1 ? "es" : ""}</span> : dc === 0 ? <span className="avail-tag free">Fully available</span> : dc >= slots ? <span className="avail-tag full">Fully booked</span> : <span className="avail-tag part">{slots - dc} day{slots - dc > 1 ? "s" : ""} free</span>}</td>
                </tr>
              ); })}
              {fleet.map(f => { const a = fleetAlloc.find(r => r.id === f.id); const dc = a ? a.dayCount : 0; const cl = a ? a.clashes.length : 0; return (
                <tr key={"f" + f.id}>
                  <td className="cell-title">{f.name || f.type}<div className="cell-sub">{f.type}</div></td>
                  <td><Pill label="Fleet" tone="loan" /></td>
                  <td className="cell-sub">{f.status || "—"}</td>
                  <td className="ta-r mono">{dc}/{slots}</td>
                  <td>{cl ? <span className="clash-tag">{cl} clash{cl > 1 ? "es" : ""}</span> : dc === 0 ? <span className="avail-tag free">Fully available</span> : dc >= slots ? <span className="avail-tag full">Fully booked</span> : <span className="avail-tag part">{slots - dc} day{slots - dc > 1 ? "s" : ""} free</span>}</td>
                </tr>
              ); })}
            </tbody>
          </table></div>
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Idle &amp; needs scheduling</h2></div>
          <div className="vp-label">Unallocated crew · this {mode}</div>
          {idleCrew.length === 0 ? <div className="vp-sub">All crew have assignments.</div> : <div className="idle-chips">{idleCrew.map(t => <span className="idle-chip" key={t.id}><Users size={11} />{t.name}</span>)}</div>}
          <div className="vp-label" style={{ marginTop: 14 }}>Unallocated fleet</div>
          {idleFleet.length === 0 ? <div className="vp-sub">All vehicles in use.</div> : <div className="idle-chips">{idleFleet.map(f => <span className="idle-chip res-fleet" key={f.id}><Truck size={11} />{f.name || f.type}</span>)}</div>}
          <div className="vp-label" style={{ marginTop: 14 }}>Jobs needing a slot</div>
          {unscheduled.length === 0 ? <div className="vp-sub">Every active job has a scheduled slot.</div>
            : <div className="idle-jobs">{unscheduled.slice(0, 6).map(j => <div className="idle-job" key={j.id} onClick={() => onOpenJob(j.id)}><span className="mono sm">{j.ref}</span><span className="cell-sub">{j.name}</span></div>)}</div>}
        </section>
      </div>

      {drawer && drawerReq && (() => {
        const r = drawerReq; const j = drawerJob; const alloc = r.alloc || { team: [], fleet: [], equipment: [], subs: [] };
        const toggle = (g, id) => { const arr = alloc[g] || []; const next = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]; const na = { ...alloc, [g]: next }; const status = r.status === "Confirmed" ? "Confirmed" : (reqAllocCount({ alloc: na }) > 0 ? "Allocated" : "Requested"); saveReqLine(j.id, r.id, { alloc: na, status }); };
        const addSub = () => { const name = window.prompt("Subcontractor name?"); if (!name) return; const sr = window.prompt("Role / service? (optional)") || ""; const na = { ...alloc, subs: [...(alloc.subs || []), { name, role: sr }] }; saveReqLine(j.id, r.id, { alloc: na, status: r.status === "Confirmed" ? "Confirmed" : "Allocated" }); };
        const delSub = (i) => { const na = { ...alloc, subs: (alloc.subs || []).filter((_, ix) => ix !== i) }; saveReqLine(j.id, r.id, { alloc: na }); };
        const total = reqCount(r), got = reqAllocCount(r); const parts = reqParts(r);
        const confirm = () => { saveReqLine(j.id, r.id, { status: "Confirmed" }); if (onNotify) (alloc.team || []).forEach(id => { const m = team.find(x => x.id === id); if (m) onNotify({ teamId: id, teamName: m.name, jobId: j.id, jobRef: j.ref, label: `${r.label || r.slotKind || "Assignment"} ${r.date ? fmtDate(r.date) : ""}${r.time ? " " + r.time : ""}` }); }); };
        return (
          <div className="drawer-overlay" onClick={() => setDrawer(null)}>
            <div className="drawer" onClick={e => e.stopPropagation()}>
              <div className="drawer-head">
                <div><div className="drawer-title">Allocate resources</div><div className="muted sm">{j.ref} · {r.label || r.slotKind || "Request"}{r.date ? " · " + fmtDate(r.date) : ""}{r.time ? " " + r.time : ""}</div></div>
                <button className="icon-btn" onClick={() => setDrawer(null)}><X size={18} /></button>
              </div>
              <div className="drawer-body">
                <div className="drawer-req"><span className="vp-label">Requested</span> {parts.length ? parts.join(", ") : <span className="muted">none specified</span>}{r.notes ? <div className="muted sm" style={{ marginTop: 6 }}>{r.notes}</div> : null}</div>
                <div className="drawer-prog"><span className={"avail-tag " + (total > 0 && got >= total ? "free" : "part")}>{got}/{total || 0} allocated</span> <Pill label={r.status || "Requested"} tone={REQ_STATUS_TONE[r.status || "Requested"]} /></div>
                <div className="pb-head">Crew</div>
                <div className="cock-chips">{team.map(t => { const on = (alloc.team || []).includes(t.id); return <button key={t.id} className={"cock-chip" + (on ? " on" : "")} onClick={() => toggle("team", t.id)}>{on ? <Check size={12} /> : <Plus size={12} />}{t.name} · {t.role}</button>; })}</div>
                <div className="pb-head">Fleet</div>
                <div className="cock-chips">{fleet.map(f => { const on = (alloc.fleet || []).includes(f.id); return <button key={f.id} className={"cock-chip" + (on ? " on" : "")} onClick={() => toggle("fleet", f.id)}>{on ? <Check size={12} /> : <Plus size={12} />}{f.name || f.type}</button>; })}</div>
                <div className="pb-head">Equipment</div>
                <div className="cock-chips">{(equipment || []).map(eq => { const on = (alloc.equipment || []).includes(eq.id); return <button key={eq.id} className={"cock-chip" + (on ? " on" : "")} onClick={() => toggle("equipment", eq.id)}>{on ? <Check size={12} /> : <Plus size={12} />}{eq.name}</button>; })}</div>
                <div className="pb-head">Subcontractors</div>
                <div className="sub-list">
                  {(alloc.subs || []).map((sb, i) => <div className="sub-row" key={i}><Building2 size={14} /><span>{sb.name}{sb.role ? " · " + sb.role : ""}</span><button className="icon-btn-sm" onClick={() => delSub(i)}><Trash2 size={13} /></button></div>)}
                  <button className="btn btn-sm btn-ghost" onClick={addSub}><Plus size={13} />Add subcontractor</button>
                </div>
              </div>
              <div className="drawer-foot">
                <button className="btn btn-ghost" onClick={() => setDrawer(null)}>Close</button>
                <div className="spacer" />
                {r.status === "Confirmed"
                  ? <button className="btn btn-ghost" onClick={() => saveReqLine(j.id, r.id, { status: "Allocated" })}>Unconfirm</button>
                  : <button className="btn btn-primary" disabled={got === 0} onClick={confirm}><Check size={15} />Confirm &amp; notify crew</button>}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}


export function MyTasksView({ team, objects, currentUserId, canSwitch, onSetUser, jobs, clientById, onToggle, onOpenJob, brandName }) {
  const [showDone, setShowDone] = useState(false);
  const [overrideId, setOverrideId] = useState(currentUserId);
  const meId = canSwitch ? overrideId : currentUserId;
  const me = team.find(t => t.id === meId) || team.find(t => t.id === currentUserId) || team[0];
  const objById = Object.fromEntries((objects || []).map(o => [o.id, o]));
  const groups = (jobs || []).map(j => ({ job: j, tasks: (j.workflow || []).flatMap(st => st.tasks.filter(x => me && x.assignee === me.id).map(x => ({ ...x, stageKey: st.key, stageLabel: st.label }))) })).filter(g => g.tasks.length > 0);
  const allMine = groups.flatMap(g => g.tasks);
  const open = allMine.filter(x => !x.done).length;
  const done = allMine.filter(x => x.done).length;
  return (<div className="dash">
    <div className="toolbar">
      <div className="mt-as"><span className="muted sm">{canSwitch ? "Viewing as" : "Signed in as"}</span>
        {canSwitch ? <select className="cock-sel" value={me ? me.id : ""} onChange={e => setOverrideId(e.target.value)}>{team.map(t => <option key={t.id} value={t.id}>{t.name} · {t.func || t.role}</option>)}</select> : <b style={{ fontSize: 13 }}>{me ? me.name : "—"}</b>}
      </div>
      <div className="spacer" />
      <button className={"btn btn-sm " + (showDone ? "btn-primary" : "btn-ghost")} onClick={() => setShowDone(v => !v)}>{showDone ? "Hide completed" : "Show completed"}</button>
    </div>
    <div className="stat-row">
      <Stat icon={ClipboardCheck} label="Open actions" value={open} accent />
      <Stat icon={CheckCircle2} label="Completed" value={done} />
      <Stat icon={Briefcase} label="Across jobs" value={groups.length} />
    </div>
    {groups.length === 0 ? <section className="panel"><div className="empty-row" style={{ padding: 30 }}>Nothing assigned to {me ? me.name : "this person"} yet. Assignments appear here as job workflows are generated or tasks are assigned.</div></section>
      : groups.map(g => {
        const visible = g.tasks.filter(x => showDone || !x.done);
        if (!visible.length) return null;
        const client = clientById[g.job.clientId];
        const myOpen = g.tasks.filter(x => !x.done).length;
        return (<section className="panel mt-job" key={g.job.id}>
          <div className="panel-head mt-job-head" onClick={() => onOpenJob(g.job.id)}>
            <div><h2>{g.job.ref}<span className="muted"> · {g.job.name}</span></h2><span className="muted sm">{[g.job.jobType, g.job.movement, g.job.mode].filter(Boolean).join(" · ")} · {client ? client.name : "—"}</span></div>
            <div className="mt-job-r"><span className="mt-count">{myOpen} open</span><button className="btn btn-sm btn-ghost" onClick={e => { e.stopPropagation(); onOpenJob(g.job.id); }}>Open job <ChevronRight size={14} /></button></div>
          </div>
          <div className="mt-tasks">{visible.map(x => { const o = x.objectId && objById[x.objectId]; return (
            <div className={"mt-task" + (x.done ? " done" : "")} key={x.id}>
              <button className="cock-check" onClick={() => onToggle(g.job.id, x.stageKey, x.id)}>{x.done ? <CheckCircle2 size={17} /> : <span className="cock-circle" />}</button>
              <div className="mt-task-main"><span className="mt-task-label">{x.label}</span><span className="mt-task-meta">{x.stageLabel}{o ? " · " + o.ref : ""}{x.role ? " · " + x.role : ""}</span></div>
              <button className="wf-ticket" title="Print work ticket" onClick={() => printWorkTicket(g.job, client, x, me ? me.name : "", brandName)}><Printer size={13} /></button>
            </div>
          ); })}</div>
        </section>);
      })}
  </div>);
}


export function AgentsView({ agents, onNew, onEdit }) {
  return (
    <div className="dash">
      <div className="stat-row">
        <Stat icon={Globe} label="Agents" value={agents.length} accent />
        <Stat icon={Network} label="Countries" value={new Set(agents.map(a => a.country).filter(Boolean)).size} />
        <Stat icon={Briefcase} label="Origin agents" value={agents.filter(a => a.role === "Origin agent").length} />
        <Stat icon={MapPin} label="Destination agents" value={agents.filter(a => a.role === "Destination agent").length} />
      </div>
      <div className="toolbar"><div className="spacer" /><button className="btn btn-primary" onClick={onNew}><Plus size={16} />New agent</button></div>
      <section className="panel">
        <div className="panel-head"><h2>Agents &amp; network partners</h2><span className="muted">{agents.length}</span></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Partner</th><th>Location</th><th>Role</th><th>Contact</th><th>Phone</th></tr></thead>
          <tbody>
            {agents.map(a => (
              <tr key={a.id} onClick={() => onEdit(a)} style={{cursor:"pointer"}}>
                <td><div className="cell-title">{a.name}</div>{a.notes && <div className="cell-sub2">{a.notes}</div>}</td>
                <td className="cell-sub">{[a.city, a.country].filter(Boolean).join(", ") || "—"}</td>
                <td><Pill label={a.role || "Network partner"} tone="loan" /></td>
                <td className="cell-sub">{a.contact || "—"}</td>
                <td className="cell-sub mono">{a.phone || "—"}</td>
              </tr>
            ))}
            {agents.length === 0 && <tr><td colSpan={5} className="empty-row">No partners yet — add your overseas agents and network.</td></tr>}
          </tbody>
        </table></div>
      </section>
    </div>
  );
}


export function AgentForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => ({ name: "", country: "", city: "", role: "Network partner", contact: "", phone: "", notes: "", ...initial }));
  return (
    <Modal title={f.id ? "Edit partner" : "New network partner"} onClose={onClose}>
      <div className="form-grid">
        <L label="Partner name" full><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="e.g. Crozier Fine Arts" /></L>
        <L label="Country"><input value={f.country || ""} onChange={e => setF({ ...f, country: e.target.value })} /></L>
        <L label="City"><input value={f.city || ""} onChange={e => setF({ ...f, city: e.target.value })} /></L>
        <L label="Role"><select value={f.role} onChange={e => setF({ ...f, role: e.target.value })}>{AGENT_ROLES.map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Contact email"><input value={f.contact || ""} onChange={e => setF({ ...f, contact: e.target.value })} /></L>
        <L label="Phone"><input value={f.phone || ""} onChange={e => setF({ ...f, phone: e.target.value })} /></L>
        <L label="Notes" full><textarea rows={2} value={f.notes || ""} onChange={e => setF({ ...f, notes: e.target.value })} /></L>
      </div>
      <ModalFoot onClose={onClose} onSave={() => f.name && onSave(f)} saveLabel="Save partner" />
    </Modal>
  );
}


export function printFreightDoc(job, client, brandName) {
  const w = window.open("", "_blank"); if (!w) return;
  const brand = brandName || "ARTECO";
  const f = job.freight || {};
  const dm = DOC_BY_MODE[job.mode] || { label: "Transport Document", abbr: "DOC" };
  const ccy = f.ccy || (client && client.currency) || "AED";
  const isAir = job.mode === "Air", isSea = job.mode === "Sea";
  const isImport = job.jobType === "Import";
  // Shipper / consignee: use explicit parties if captured on the job; else infer (export = we ship, import = we receive).
  const usBlock = `${esc(brand)}<br>Specialized Fine-Art Logistics<br>Dubai, United Arab Emirates`;
  const clientBlock = client ? `${esc(client.name)}<br>${esc(client.address || "")}${client.contact ? "<br>" + esc(client.contact) : ""}` : "—";
  const partyBlock = (p) => p && (p.name || partyAddr(p)) ? `${esc(p.name || "")}${partyAddr(p) ? "<br>" + esc(partyAddr(p)) : ""}${p.contact ? "<br>" + esc(p.contact) : ""}${p.phone ? " · " + esc(p.phone) : ""}` : null;
  const shipper = partyBlock(job.shipper) || (isImport ? clientBlock : usBlock);
  const consignee = partyBlock(job.consignee) || (isImport ? usBlock : clientBlock);
  const origin = f.origin || job.origin || (job.collections && job.collections[0] ? job.collections[0].address : "") || "—";
  const dest = f.dest || job.destination || (job.deliveries && job.deliveries[0] ? job.deliveries[0].address : "") || "—";
  const pieces = f.pieces || (job.objectIds || []).length || "";
  const num = (v) => (v || v === 0) ? new Intl.NumberFormat("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v)) : "";
  const wc = Number(f.weightCharge) || 0, oc = Number(f.otherCharges) || 0; const total = wc + oc;
  const labels = isAir
    ? { doc: "Air Waybill", no: "AWB no.", carrier: "Carrier (airline)", vehicle: "Flight / date", from: "Airport of departure", to: "Airport of destination" }
    : isSea
      ? { doc: "Bill of Lading", no: "B/L no.", carrier: "Shipping line", vehicle: "Vessel / voyage", from: "Port of loading", to: "Port of discharge" }
      : { doc: "CMR Consignment Note", no: "CMR no.", carrier: "Carrier", vehicle: "Vehicle / plate", from: "Place of loading", to: "Place of delivery" };
  const row = (k, v) => `<tr><td class="k">${esc(k)}</td><td>${v == null || v === "" ? "—" : v}</td></tr>`;
  w.document.write(`<!doctype html><html><head><title>${labels.doc} — ${esc(job.ref)}</title>
  <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box}body{font-family:'Inter','Helvetica Neue',Arial,sans-serif;color:#1D1D1D;max-width:820px;margin:22px auto;padding:0;font-size:11.5px;line-height:1.45}
  .head{background:#1D1D1D;color:#fff;padding:16px 30px;border-bottom:3px solid #F0FD63;display:flex;justify-content:space-between;align-items:center}
  .brand{font-size:20px;font-weight:800;letter-spacing:5px}
  .dt{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;border:1.5px solid rgba(255,255,255,.45);border-radius:6px;padding:5px 11px;text-align:right}
  .dt small{display:block;font-weight:600;letter-spacing:.04em;opacity:.8;margin-top:3px}
  .bd{padding:20px 30px}
  .draft{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#646B00;background:rgba(240,253,99,.35);border-radius:5px;padding:3px 8px;display:inline-block;margin-bottom:14px}
  .parties{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #E8E8E8;border-radius:9px;overflow:hidden;margin-bottom:12px}
  .party{padding:11px 13px}.party+.party{border-left:1px solid #E8E8E8}
  .party .lbl{font-size:8.5px;text-transform:uppercase;letter-spacing:.07em;color:#919EAB;font-weight:700;margin-bottom:4px}
  .party .v{font-size:12px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:0 18px;border:1px solid #E8E8E8;border-radius:9px;padding:6px 14px;margin-bottom:12px}
  table.kv{width:100%;border-collapse:collapse}
  table.kv td{padding:6px 4px;border-bottom:1px solid #F2F2F0;vertical-align:top}
  table.kv td.k{width:48%;color:#919EAB;font-size:8.5px;text-transform:uppercase;letter-spacing:.05em;font-weight:700}
  .sec{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#fff;background:#1D1D1D;border-radius:6px;padding:6px 11px;margin:14px 0 8px}
  table.chg{width:100%;border-collapse:collapse}
  table.chg th{text-align:left;font-size:8.5px;text-transform:uppercase;letter-spacing:.05em;color:#919EAB;font-weight:700;padding:6px;border-bottom:1px solid #E8E8E8}
  table.chg td{padding:6px;border-bottom:1px solid #F2F2F0;font-size:11px}
  table.chg td.r,table.chg th.r{text-align:right}
  .tot{display:flex;justify-content:flex-end;margin-top:8px}
  .tot .box{background:#1D1D1D;color:#fff;border-radius:8px;padding:8px 16px;font-weight:700;font-size:13px}
  .tot .box b{color:#F0FD63;margin-left:10px}
  .sig{margin-top:34px;display:flex;gap:34px}.sig div{flex:1;border-top:1px solid #1D1D1D;padding-top:6px;font-size:10px;color:#919EAB}
  .foot{margin-top:14px;font-size:9px;color:#919EAB;line-height:1.5}
  </style></head><body>
  <div class="head"><div class="brand">${esc(brand)}</div><div class="dt">${labels.doc}<small>DRAFT</small></div></div>
  <div class="bd">
    <span class="draft">Draft — generated from job ${esc(job.ref)} · not a negotiable document</span>
    <div class="parties">
      <div class="party"><div class="lbl">Shipper</div><div class="v">${shipper}</div></div>
      <div class="party"><div class="lbl">Consignee</div><div class="v">${consignee}</div></div>
    </div>
    <div class="grid">
      <table class="kv"><tbody>
        ${row(labels.carrier, esc(f.carrier))}
        ${row("Issuing agent", esc(f.agent || brand))}
        ${row(labels.no, esc(f.docNo))}
        ${row("Booking / master ref", esc(f.ref))}
      </tbody></table>
      <table class="kv"><tbody>
        ${row(labels.from, esc(origin))}
        ${row(labels.to, esc(dest))}
        ${row(labels.vehicle, esc(f.flight))}
        ${row("ETD / ETA", esc(fmtDate(f.etd)) + " → " + esc(fmtDate(f.eta)))}
      </tbody></table>
    </div>
    <div class="sec">Consignment</div>
    <table class="chg"><thead><tr><th>No. of pieces</th><th class="r">Gross weight</th><th class="r">Chargeable weight</th><th class="r">Volume</th><th>Nature &amp; quantity of goods</th></tr></thead>
    <tbody><tr><td>${esc(String(pieces || "—"))}</td><td class="r">${f.grossWt ? num(f.grossWt) + " kg" : "—"}</td><td class="r">${f.chgWt ? num(f.chgWt) + " kg" : "—"}</td><td class="r">${f.volume ? num(f.volume) + " m³" : "—"}</td><td>${esc(f.goods || "Works of art")}</td></tr></tbody></table>
    <div class="sec">Charges (${esc(ccy)})</div>
    <table class="chg"><tbody>
      <tr><td>Weight / freight charge</td><td class="r">${wc ? num(wc) : "—"}</td></tr>
      <tr><td>Other charges (handling, fuel, security, docs)</td><td class="r">${oc ? num(oc) : "—"}</td></tr>
    </tbody></table>
    <div class="tot"><div class="box">Total ${esc(ccy)}<b>${num(total)}</b></div></div>
    <div class="sig"><div>Shipper / agent signature</div><div>Carrier signature</div><div>Date &amp; place</div></div>
    <div class="foot">This is an internal draft prepared by ${esc(brand)} to support booking and documentation. Final carriage is subject to the issuing carrier's conditions of contract. Job reference ${esc(job.ref)}${client ? " · customer " + esc(client.name) : ""}.</div>
  </div></body></html>`);
  w.document.close();
}


export function printConditionReport(o, client, location, pkg, brandName) {
  const w = window.open("", "_blank"); if (!w) return;
  const u = o.dimUnit || "cm";
  const dimList = (h, ww, d) => { const p = [h, ww]; if (!o.flat || (d != null && d !== "")) p.push(d); const v = p.filter(x => x != null && x !== ""); return v.length ? v.join(" × ") + " " + u : "—"; };
  const dims = dimList(o.h, o.w, o.d);
  const frameLine = o.framed && (o.fh || o.fw || o.fd) ? dimList(o.fh, o.fw, o.fd) : "";
  const framing = o.framed ? (o.glazed ? "Framed · behind glass" : "Framed") : "Unframed";
  w.document.write(`<!doctype html><html><head><title>Condition Report — ${esc(o.ref)}</title>
  <style>body{font-family:Georgia,serif;color:#1B2433;max-width:760px;margin:40px auto;padding:0 30px;line-height:1.5}
  h1{font-size:22px;border-bottom:2px solid #1D1D1D;padding-bottom:10px;margin-bottom:4px}
  .sub{color:#8A93A1;font-size:13px;margin-bottom:24px}.grid{display:grid;grid-template-columns:1fr 1fr;border:1px solid #E4DECF}
  .cell{padding:10px 14px;border-bottom:1px solid #EFEADD;font-size:13px}.cell label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#8A93A1;margin-bottom:2px}
  .full{grid-column:1/-1}.sig{margin-top:40px;display:flex;gap:40px}.sig div{flex:1;border-top:1px solid #1B2433;padding-top:6px;font-size:11px;color:#8A93A1}
  .head{display:flex;justify-content:space-between;align-items:baseline}</style></head><body>
  <div class="head"><h1>Condition Report</h1><div style="font-family:sans-serif;font-size:11px;text-align:right;color:#646B00;font-weight:bold">${esc(brandName || "ARTECO")}<br><span style="color:#8A93A1;font-weight:normal">Art Logistics · Dubai</span></div></div>
  <div class="sub">${esc(o.ref)} · Generated ${new Date().toLocaleDateString("en-GB")}</div>
  <div class="grid">
    <div class="cell"><label>Title</label>${esc(o.title)}</div><div class="cell"><label>Artist / Maker</label>${esc(o.artist) || "—"}${o.year ? ", " + esc(o.year) : ""}</div>
    <div class="cell"><label>Category</label>${esc(o.category)}</div><div class="cell"><label>Medium</label>${esc(o.medium) || "—"}</div>
    <div class="cell"><label>${o.flat ? "Artwork (H × W)" : "Dimensions (L × W × H)"}</label>${dims}</div><div class="cell"><label>Weight</label>${o.weight ? o.weight + " kg" : "—"}</div>
    <div class="cell"><label>Framing</label>${framing}</div><div class="cell"><label>Frame size</label>${frameLine || "—"}</div>
    <div class="cell"><label>Account</label>${esc(client?.name) || "—"}</div><div class="cell"><label>Location</label>${esc(location?.name) || "—"}</div>
    <div class="cell"><label>Package</label>${esc(pkg?.ref) || "Loose"}</div><div class="cell"><label>Customs</label>${esc(o.customs)} ${esc(o.customsRef) || ""}</div>
    <div class="cell"><label>Condition grade</label>${esc(o.condition) || "—"}</div><div class="cell"><label>Declared value</label>${o.value ? fmtMoney(o.value, o.ccy) : "—"}</div>
    <div class="cell full"><label>Condition notes / observations</label>${esc(o.conditionNote) || "No notable condition issues recorded."}</div>
  </div><div class="sig"><div>Inspected by / date</div><div>Signature</div></div></body></html>`);
  w.document.close(); w.focus(); setTimeout(() => w.print(), 350);
}


export function printLabel(k, client, location, contents, brandName) {
  const w = window.open("", "_blank"); if (!w) return;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("ARTECO:" + (k.ref || ""))}`;
  const v = volM3(k.h, k.w, k.d);
  w.document.write(`<!doctype html><html><head><title>Label — ${esc(k.ref)}</title>
  <style>body{font-family:Arial,sans-serif;color:#111;margin:0;padding:24px}.label{width:420px;border:2px solid #1D1D1D;border-radius:6px;padding:18px;display:flex;gap:18px}
  .qr img{width:130px;height:130px}.qr div{font-size:9px;text-align:center;color:#666;margin-top:4px}.info{flex:1}.ref{font-size:26px;font-weight:bold;letter-spacing:1px;color:#1D1D1D}
  .type{font-size:14px;color:#444;margin-bottom:8px}.row{font-size:12px;margin:3px 0}.row b{display:inline-block;width:74px;color:#666;font-weight:normal}
  .contents{margin-top:8px;font-size:11px;border-top:1px solid #ddd;padding-top:6px}.firm{font-size:10px;color:#646B00;letter-spacing:1px;margin-bottom:8px;font-weight:bold}</style></head><body><div class="label">
  <div class="qr"><img src="${qr}" alt="QR"/><div>Scan ref</div></div>
  <div class="info"><div class="firm">${esc(brandName || "ARTECO")} · DXB</div><div class="ref">${esc(k.ref)}</div><div class="type">${esc(k.type)}</div>
  <div class="row"><b>Account</b>${esc(client?.name) || "—"}</div><div class="row"><b>Location</b>${esc(location?.name) || "—"}</div>
  <div class="row"><b>Volume</b>${fmtVol(v)}</div><div class="row"><b>Customs</b>${esc(k.customs)} ${esc(k.customsRef) || ""}</div>
  <div class="contents"><b>Contents (${contents.length}):</b> ${contents.map(o => esc(o.ref) + " " + esc(o.title)).join(" · ") || "—"}</div></div></div></body></html>`);
  w.document.close(); w.focus(); setTimeout(() => w.print(), 350);
}


export function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }



export function printOpsDoc(kind, job, client, brandName, entry) {
  const w = window.open("", "_blank"); if (!w) return;
  const brand = brandName || "ARTECO";
  const titles = { collection: "Collection Note", delivery: "Delivery Note", transport: (DOC_BY_MODE[job.mode] ? DOC_BY_MODE[job.mode].label : "Transport Document") + " (Draft)" };
  const title = titles[kind] || "Document";
  let bodyRows = "";
  if (kind === "transport") {
    const f = job.freight || {};
    bodyRows = [["Carrier", f.carrier], ["Booking / MAWB ref", f.ref], ["Document no.", f.docNo], ["Mode", [job.mode, job.seaLoad].filter(Boolean).join(" · ")], ["ETD", fmtDate(f.etd)], ["ETA", fmtDate(f.eta)], ["Origin", job.collections && job.collections[0] ? job.collections[0].address : "—"], ["Destination", job.deliveries && job.deliveries[0] ? job.deliveries[0].address : "—"]].map(([k, v]) => `<tr><td class="k">${esc(k)}</td><td>${esc(v || "—")}</td></tr>`).join("");
  } else {
    const e = entry || {};
    bodyRows = [["Site", e.label], ["Address", e.address], ["Contact", e.contact], ["Scheduled", fmtDate(e.date)], ["Status", e.status], ["Notes", e.notes]].map(([k, v]) => `<tr><td class="k">${esc(k)}</td><td>${esc(v || "—")}</td></tr>`).join("");
  }
  const objs = (job.objectIds || []).length;
  w.document.write(`<!doctype html><html><head><title>${esc(title)} — ${esc(job.ref)}</title>
  <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box}body{font-family:'Inter','Helvetica Neue',Arial,sans-serif;color:#1D1D1D;max-width:760px;margin:24px auto;padding:0;font-size:12.5px;line-height:1.5}
  .head{background:#1D1D1D;color:#fff;padding:18px 34px;border-bottom:3px solid #F0FD63;display:flex;justify-content:space-between;align-items:center}
  .brand{font-size:21px;font-weight:800;letter-spacing:5px}.dt{font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;border:1.5px solid rgba(255,255,255,.45);border-radius:6px;padding:5px 12px}
  .bd{padding:24px 34px}.meta{color:#646B78;font-size:11px;margin-bottom:16px}
  table{width:100%;border-collapse:collapse}td{padding:8px 6px;border-bottom:1px solid #F2F2F0;vertical-align:top}td.k{width:180px;color:#919EAB;font-size:9px;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
  .sig{margin-top:42px;display:flex;gap:40px}.sig div{flex:1;border-top:1px solid #1D1D1D;padding-top:6px;font-size:10.5px;color:#919EAB}</style></head><body>
  <div class="head"><div class="brand">${esc(brand)}</div><div class="dt">${esc(title)}</div></div>
  <div class="bd"><div class="meta">Job ${esc(job.ref)} · ${esc(job.name || "")} · Customer: ${esc(client ? client.name : "—")} · ${objs} item(s)</div>
  <table>${bodyRows}</table>
  <div class="sig"><div>Released by</div><div>Received by / signature</div><div>Date</div></div>
  </div></body></html>`);
  w.document.close();
}


export function printWorkTicket(job, client, task, assigneeName, brandName) {
  const w = window.open("", "_blank"); if (!w) return;
  const brand = brandName || "ARTECO";
  w.document.write(`<!doctype html><html><head><title>Work Ticket — ${esc(job.ref)}</title>
  <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box}body{font-family:'Inter','Helvetica Neue',Arial,sans-serif;color:#1D1D1D;max-width:620px;margin:24px auto;font-size:13px;line-height:1.5}
  .head{background:#1D1D1D;color:#fff;padding:18px 30px;border-bottom:3px solid #F0FD63;display:flex;justify-content:space-between;align-items:center}
  .brand{font-size:20px;font-weight:800;letter-spacing:5px}.dt{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;border:1.5px solid rgba(255,255,255,.45);border-radius:6px;padding:5px 11px}
  .bd{padding:24px 30px}.big{font-size:18px;font-weight:700;margin:0 0 16px}
  table{width:100%;border-collapse:collapse}td{padding:8px 6px;border-bottom:1px solid #F2F2F0;vertical-align:top}td.k{width:150px;color:#919EAB;font-size:9px;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
  .sig{margin-top:40px;display:flex;gap:34px}.sig div{flex:1;border-top:1px solid #1D1D1D;padding-top:6px;font-size:10px;color:#919EAB}</style></head><body>
  <div class="head"><div class="brand">${esc(brand)}</div><div class="dt">Work Ticket</div></div>
  <div class="bd"><p class="big">${esc(task.label)}</p>
  <table>
    <tr><td class="k">Job</td><td>${esc(job.ref)} · ${esc(job.name || "")}</td></tr>
    <tr><td class="k">Customer</td><td>${esc(client ? client.name : "—")}</td></tr>
    <tr><td class="k">Assigned to</td><td>${esc(assigneeName || "Unassigned")}</td></tr>
    <tr><td class="k">Classification</td><td>${esc([job.jobType, job.movement, job.mode].filter(Boolean).join(" · "))}</td></tr>
    ${task.note ? `<tr><td class="k">Instructions</td><td>${esc(task.note)}</td></tr>` : ""}
  </table>
  <div class="sig"><div>Issued by</div><div>Completed by / signature</div><div>Date</div></div>
  </div></body></html>`);
  w.document.close();
}


export function opsTemplate(job) {
  const t = job.jobType, m = job.mode || "Air";
  const steps = ["Confirm scope & customer instructions"];
  if (t !== "Import") steps.push("Schedule collection & notify crew");
  steps.push("Prepare packing materials & crates", "Pack / crate & condition-check items");
  if (t === "Export") steps.push("Export customs documentation"); else if (t === "Import") steps.push("Import customs clearance");
  steps.push("Book freight (" + m + ")", "Issue " + (DOC_BY_MODE[m] ? DOC_BY_MODE[m].abbr : "transport") + " draft", "Dispatch / hand over to carrier");
  if (t !== "Export") steps.push("Receive & inbound condition check");
  steps.push("Delivery & final condition report", "Close job & file documents");
  return steps.map(label => ({ id: uid(), label, done: false }));
}


export function workflowTemplate(job, objects, team) {
  const t = job.jobType, mv = job.movement || "", m = job.mode || "Air";
  const isImport = t === "Import", isLocal = t === "Local", isExport = t === "Export";
  const objs = (job.objectIds || []).map(id => (objects || []).find(o => o.id === id)).filter(Boolean);
  const abbr = DOC_BY_MODE[m] ? DOC_BY_MODE[m].abbr : "transport doc";
  const carrierWord = m === "Air" ? "airline" : m === "Sea" ? "shipping line" : "carrier";
  const gateway = m === "Air" ? "airport" : m === "Sea" ? "seaport" : "depot";
  const lc = mv.toLowerCase();
  const originCollect = !isImport && (lc.startsWith("door") || isLocal && (lc.includes("local") || lc.includes("collection")));
  const finalDeliver = isImport ? (lc.includes("door") || lc.includes("inbound")) : isLocal ? true : false;
  // auto-assign by responsible function, with sensible fallbacks
  const fb = { "Field crew": ["Field crew", "Handler", "Packer", "Driver"], Operations: ["Operations", "Coordinator"], Coordinator: ["Coordinator", "Operations"], Sales: ["Sales", "Operations"], Finance: ["Finance", "Operations"], Driver: ["Driver", "Field crew"], Packer: ["Packer", "Handler"], Handler: ["Handler", "Packer"] };
  const pick = (role) => { const order = fb[role] || [role]; for (const f of order) { const mem = (team || []).find(x => x.func === f); if (mem) return mem.id; } return ""; };
  const mk = (key, label, tasks) => ({ key, label, tasks: tasks.filter(Boolean).map(x => ({ id: uid(), label: x.l, role: x.r || "Operations", assignee: pick(x.r || "Operations"), done: false, note: "", objectId: x.o || null })) });
  const T = (l, r, o) => ({ l, r, o });
  const stages = [];

  // 1 — Booking & file setup (all job types)
  stages.push(mk("booking", "Booking & file setup", [
    T("Confirm scope, dates & special instructions with client", "Sales"),
    T("Open job file & assign job coordinator", "Operations"),
    T("Confirm commercial terms & insurance cover", "Finance"),
    isExport && T("Send order confirmation to client", "Sales"),
  ]));

  if (isExport) {
    // 2 — Crating & materials
    stages.push(mk("crating", "Crating & materials", [
      T("Assess packing specification per object", "Packer"),
      T("Order bespoke crates from carpenter (if required)", "Operations"),
      T("Prepare packing materials & consumables", "Packer"),
    ]));
    // 3 — Collection
    if (originCollect) stages.push(mk("collection", "Collection to warehouse", [
      T("Schedule collection slot with client", "Coordinator"),
      T("Assign truck & crew for collection", "Driver"),
      T("Collect items & transport to warehouse", "Field crew"),
      T("Inbound condition check & log location", "Handler"),
    ]));
    // 4 — Warehouse prep (per object)
    stages.push(mk("warehouse", "Warehouse preparation", [
      ...objs.map(o => T(`Pack & crate — ${o.title}`, "Packer", o.id)),
      T("Condition-report each object before close", "Handler"),
      T("Weigh & measure crates; confirm chargeable weight", "Operations"),
    ]));
    // 5 — Overseas agent & pre-alert
    stages.push(mk("agent", "Overseas agent & pre-alert", [
      T("Confirm destination/receiving agent & contacts", "Operations"),
      T("Send pre-alert with packing list & dimensions to agent", "Operations"),
    ]));
    // 6 — Freight booking
    stages.push(mk("freight", `${m} freight booking`, [
      T(`Request rates & book ${m === "Air" ? "air" : m === "Sea" ? "sea" : "road"} freight`, "Operations"),
      T(`Obtain booking confirmation from ${carrierWord}`, "Operations"),
    ]));
    // 7 — Documentation & customs
    stages.push(mk("customs", "Documentation & export customs", [
      T("Prepare commercial invoice & packing list", "Operations"),
      T("Lodge export customs declaration", "Operations"),
      T("Obtain export permit / customs release", "Finance"),
      T(`Prepare ${abbr} instructions`, "Operations"),
    ]));
    // 8 — Dispatch to gateway
    stages.push(mk("dispatch", `Dispatch to ${gateway}`, [
      T("Schedule truck & crew for dispatch", "Coordinator"),
      T("Load crates & secure for transport", "Field crew"),
      T(`Deliver crates to ${carrierWord} / cargo terminal`, "Driver"),
      T("Hand over & obtain receipt", "Field crew"),
    ]));
    // 9 — Carrier handover & departure
    stages.push(mk("departure", "Handover & departure", [
      T(`Confirm uplift / sailing with ${carrierWord}`, "Operations"),
      T(`Send departure pre-alert & documents to agent`, "Operations"),
    ]));
    // 10 — Delivery & POD (only if door-to-door, via agent)
    if (lc.includes("door-to-door")) stages.push(mk("pod", "Delivery & proof of delivery", [
      T("Agent confirms customs clearance at destination", "Operations"),
      T("Agent delivers & installs at consignee", "Operations"),
      T("Collect proof of delivery (POD) from overseas agent", "Operations"),
    ]));
    // 11 — Close & invoice
    stages.push(mk("close", "Close & invoice", [
      T("Final condition report & file all documents", "Operations"),
      T("Raise invoice & reconcile costs", "Finance"),
      T("Close job", "Operations"),
    ]));
  } else if (isImport) {
    stages.push(mk("prealert", "Origin pre-alert & export", [
      T("Instruct origin agent to collect, pack & export", "Operations"),
      T("Receive pre-alert, packing list & documents from agent", "Operations"),
      T("Confirm freight routing & ETA", "Operations"),
    ]));
    stages.push(mk("freight", `${m} freight & tracking`, [
      T(`Track ${m === "Air" ? "air" : m === "Sea" ? "ocean" : "road"} freight to ${gateway}`, "Operations"),
      T(`Receive ${abbr} & arrival notice`, "Operations"),
    ]));
    stages.push(mk("customs", "Arrival & import customs", [
      T("Lodge import declaration & duties", "Operations"),
      T("Pay duties / obtain customs clearance", "Finance"),
      T("Obtain release from customs / port", "Operations"),
    ]));
    stages.push(mk("collection", `Collect from ${gateway} to warehouse`, [
      T("Assign truck & crew for collection", "Driver"),
      T(`Collect cleared cargo from ${gateway}`, "Field crew"),
      T("Transport to warehouse & log location", "Driver"),
    ]));
    stages.push(mk("warehouse", "Inbound check & unpack", [
      ...objs.map(o => T(`Unpack & condition-check — ${o.title}`, "Handler", o.id)),
      T("Inbound condition report & flag any damage", "Handler"),
    ]));
    if (finalDeliver) stages.push(mk("delivery", "Delivery & installation", [
      T("Schedule delivery slot with client", "Coordinator"),
      T("Assign crew & vehicle for delivery", "Driver"),
      T("Deliver & install at client", "Field crew"),
    ]));
    stages.push(mk("close", "Sign-off & close", [
      T("Client sign-off & proof of delivery", "Operations"),
      T("Raise invoice & reconcile costs", "Finance"),
      T("File documents & close job", "Operations"),
    ]));
  } else {
    // LOCAL
    stages.push(mk("crating", "Preparation", [
      T("Assess handling & packing needs", "Packer"),
      T("Prepare materials / soft-pack or case", "Packer"),
    ]));
    if (originCollect) stages.push(mk("collection", "Collection", [
      T("Schedule collection slot", "Coordinator"),
      T("Assign truck & crew", "Driver"),
      T("Collect & transport to warehouse", "Field crew"),
    ]));
    stages.push(mk("warehouse", "Warehouse handling", [
      ...objs.map(o => T(`Handle & condition-check — ${o.title}`, "Handler", o.id)),
      T("Stage for delivery", "Handler"),
    ]));
    stages.push(mk("delivery", "Delivery & installation", [
      T("Schedule delivery slot with client", "Coordinator"),
      T("Assign crew & vehicle", "Driver"),
      T("Deliver & install at destination", "Field crew"),
      T("Condition check & client sign-off", "Handler"),
    ]));
    stages.push(mk("close", "Close & invoice", [
      T("File documents", "Operations"),
      T("Raise invoice", "Finance"),
      T("Close job", "Operations"),
    ]));
  }
  return stages;
}


export function startOfWeek(d) { const x = new Date(d); const day = (x.getDay() + 6) % 7; x.setDate(x.getDate() - day); x.setHours(0, 0, 0, 0); return x; }
function ymd(d) { return new Date(d).toISOString().slice(0, 10); }


export function ymd(d) { return new Date(d).toISOString().slice(0, 10); }
function DispatchView({ jobs, team, fleet, equipment, clientById, role, onSaveJob, onOpenJob, onNotify }) {
  const [mode, setMode] = useState("day"); // day | week  (day by default)
  const [anchor, setAnchor] = useState(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; });
  const teamById = Object.fromEntries(team.map(t => [t.id, t]));
  const fleetById = Object.fromEntries(fleet.map(t => [t.id, t]));
  const equipById = Object.fromEntries((equipment || []).map(t => [t.id, t]));
  const live = jobs.filter(j => j.status === "Confirmed");

  // events from collections/deliveries
  const events = [];
  live.forEach(j => {
    (j.collections || []).forEach(c => { if (c.date) events.push({ id: c.id, kind: "Collection", label: c.label || "Collection", date: c.date, time: c.time || "", job: j }); });
    (j.deliveries || []).forEach(c => { if (c.date) events.push({ id: c.id, kind: "Delivery", label: c.label || "Delivery", date: c.date, time: c.time || "", job: j }); });
  });

  const days = mode === "week" ? Array.from({ length: 7 }, (_, i) => { const d = startOfWeek(anchor); d.setDate(d.getDate() + i); return d; }) : [new Date(anchor)];
  const visibleDays = days.map(ymd);
  const evFor = (d) => events.filter(e => e.date === ymd(d)).sort((a, b) => a.kind.localeCompare(b.kind));
  const shift = (n) => { const d = new Date(anchor); d.setDate(d.getDate() + n * (mode === "week" ? 7 : 1)); setAnchor(d); };
  const today = ymd(new Date());
  const rangeLabel = mode === "week"
    ? `${days[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${days[6].toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
    : new Date(anchor).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // jobs active on a given day (have an event that day)
  const jobsOnDay = (dy) => { const ids = new Set(); events.forEach(e => { if (e.date === dy) ids.add(e.job.id); }); return live.filter(j => ids.has(j.id)); };

  // ---- resource allocation across the visible range ----
  // For each resource, which days is it committed and to which jobs (clash if >1 job same day)
  const buildAlloc = (type, idsOf, nameOf, byId) => {
    const store = {};
    live.forEach(j => { const ids = idsOf(j); if (!ids || !ids.length) return;
      const jobDays = (j.collections || []).concat(j.deliveries || []).filter(e => e.date && visibleDays.includes(e.date)).map(e => e.date);
      if (!jobDays.length) return;
      ids.forEach(id => { const r = store[id] || (store[id] = { id, type, byDay: {} }); jobDays.forEach(d => { (r.byDay[d] = r.byDay[d] || new Set()).add(j.id); }); });
    });
    return Object.values(store).map(r => {
      const dayCount = visibleDays.filter(d => r.byDay[d] && r.byDay[d].size).length;
      const clashes = visibleDays.filter(d => r.byDay[d] && r.byDay[d].size > 1);
      const m = byId[r.id];
      return { ...r, name: m ? (m.name || m.type) : "—", sub: m ? (m.role || m.func || m.type || "") : "", dayCount, clashes };
    }).sort((a, b) => b.clashes.length - a.clashes.length || b.dayCount - a.dayCount);
  };
  const crewAlloc = buildAlloc("team", j => (j.crew || {}).team, null, teamById);
  const fleetAlloc = buildAlloc("fleet", j => (j.crew || {}).fleet, null, fleetById);
  const equipAlloc = buildAlloc("equipment", j => (j.crew || {}).equipment, null, equipById);

  // ---- utilisation stats over the visible range ----
  const slots = visibleDays.length; // available "resource-days" denominator basis
  const util = (alloc, total) => { const committedDays = alloc.reduce((s, r) => s + r.dayCount, 0); const denom = total * slots; return denom ? Math.round(committedDays / denom * 100) : 0; };
  const crewUtil = util(crewAlloc, team.length || 1);
  const fleetUtil = util(fleetAlloc, fleet.length || 1);
  const clashTotal = [...crewAlloc, ...fleetAlloc, ...equipAlloc].reduce((s, r) => s + r.clashes.length, 0);
  const idleCrew = team.filter(t => !crewAlloc.some(r => r.id === t.id));
  const idleFleet = fleet.filter(f => !fleetAlloc.some(r => r.id === f.id));

  const unscheduled = live.filter(j => !(j.collections || []).concat(j.deliveries || []).some(e => e.date));

  const [note, setNote] = useState(0);
  const [drawer, setDrawer] = useState(null); // { jobId, reqId }
  // collect all dated request lines from live jobs that fall in the visible range (or have no date)
  const allReqLines = [];
  live.forEach(j => jobRequests(j).forEach(r => { allReqLines.push({ job: j, req: r }); }));
  const reqLinesInRange = allReqLines.filter(({ req }) => !req.date || visibleDays.includes(req.date)).sort((a, b) => (a.req.date || "9999").localeCompare(b.req.date || "9999") || (a.req.time || "").localeCompare(b.req.time || ""));
  const saveReqLine = (jobId, reqId, patch) => { const j = jobs.find(x => x.id === jobId); if (!j) return; const reqs = jobRequests(j).map(r => r.id === reqId ? { ...r, ...patch } : r); if (onSaveJob) onSaveJob(jobId, { resourceRequests: reqs }); };
  const drawerJob = drawer && jobs.find(j => j.id === drawer.jobId);
  const drawerReq = drawerJob && jobRequests(drawerJob).find(r => r.id === drawer.reqId);
  const notifyRange = () => { let n = 0; days.forEach(d => { evFor(d).forEach(e => { const crew = e.job.crew || {}; (crew.team || []).forEach(id => { const m = teamById[id]; if (m && onNotify) { onNotify({ teamId: id, teamName: m.name, jobId: e.job.id, jobRef: e.job.ref, label: `${e.kind} ${fmtDate(e.date)} — ${e.label}` }); n++; } }); }); }); return n; };

  // ---- day timeline: resources (rows) against the day's jobs ----
  const dayKey = ymd(anchor);
  const dayJobs = jobsOnDay(dayKey);
  const resRowsForDay = (alloc, byId, typeLabel, icon) => alloc.filter(r => r.byDay[dayKey] && r.byDay[dayKey].size).map(r => ({ ...r, jobIds: [...r.byDay[dayKey]], typeLabel, icon }));

  return (
    <div className="dash">
      <div className="disp-bar">
        <div className="disp-nav">
          <button className="icon-btn-sm" onClick={() => shift(-1)} title="Previous"><ArrowLeft size={16} /></button>
          <button className="btn btn-sm btn-ghost" onClick={() => { const d = new Date(); d.setHours(0, 0, 0, 0); setAnchor(d); }}>Today</button>
          <button className="icon-btn-sm" onClick={() => shift(1)} title="Next"><ArrowRight size={16} /></button>
          <span className="disp-range">{rangeLabel}</span>
        </div>
        <div className="spacer" />
        <div className="seg">{[["day", "Day"], ["week", "Week"]].map(([v, l]) => <button key={v} className={"seg-btn" + (mode === v ? " on" : "")} onClick={() => setMode(v)}>{l}</button>)}</div>
        <button className="btn btn-primary btn-sm" onClick={() => setNote(notifyRange())} title="Notify assigned crew of this period's slots"><Bell size={14} />Notify crew</button>
      </div>
      {note > 0 && <div className="disp-noted">Sent {note} schedule notification{note > 1 ? "s" : ""} to assigned crew.</div>}

      {/* utilisation stats */}
      <div className="stat-row">
        <Stat icon={CalendarDays} label={mode === "day" ? "Movements today" : "Movements this week"} value={days.reduce((s, d) => s + evFor(d).length, 0)} accent />
        <Stat icon={Users} label="Crew utilisation" value={crewUtil + "%"} />
        <Stat icon={Truck} label="Fleet utilisation" value={fleetUtil + "%"} />
        <Stat icon={AlertTriangle} label="Scheduling clashes" value={clashTotal} small />
      </div>

      {mode === "day" ? (
        <>
          <section className="panel">
            <div className="panel-head"><h2>Day schedule</h2><span className="muted">{dayJobs.length} job{dayJobs.length !== 1 ? "s" : ""} · {evFor(anchor).length} movement{evFor(anchor).length !== 1 ? "s" : ""}</span></div>
            {(() => {
              const START_H = 6, END_H = 24, ROW_H = 64; // 6 AM → midnight, taller rows
              const hours = Array.from({ length: END_H - START_H + 1 }, (_, i) => START_H + i);
              const dayEvs = evFor(anchor);
              const hasTime = (e) => e.time && /^\d{1,2}:\d{2}$/.test(e.time);
              const timed = dayEvs.filter(hasTime).sort((a, b) => a.time.localeCompare(b.time));
              const untimed = dayEvs.filter(e => !hasTime(e));
              const topFor = (t) => { const [h, m] = t.split(":").map(Number); return (h - START_H) * ROW_H + (m / 60) * ROW_H; };
              // lay timed events into columns so overlaps sit side-by-side
              const placed = timed.map(e => ({ e, top: topFor(e.time), col: 0, cols: 1 }));
              placed.forEach((p, i) => { let col = 0; for (let j = 0; j < i; j++) { const q = placed[j]; if (Math.abs(q.top - p.top) < ROW_H - 6 && q.col === col) col++; } p.col = col; });
              const maxCol = placed.reduce((m, p) => Math.max(m, p.col), 0) + 1;
              placed.forEach(p => { p.cols = maxCol; });
              const nowD = new Date(); const isToday = ymd(anchor) === today; const nowTop = (nowD.getHours() - START_H) * ROW_H + (nowD.getMinutes() / 60) * ROW_H;
              return (
                <div className="tgrid-wrap">
                  {untimed.length > 0 && <div className="tgrid-unscheduled"><span className="vp-label">No set time</span>{untimed.map(e => <button className={"tg-ev ev-" + e.kind.toLowerCase()} key={e.id} onClick={() => onOpenJob(e.job.id)}><span className="tg-ev-k">{e.kind}</span> {e.label} <span className="muted">· {e.job.ref}</span></button>)}</div>}
                  <div className="tgrid" style={{ height: (hours.length - 1) * ROW_H + 12 }}>
                    {hours.map((h, i) => <div className="tg-row" key={h} style={{ top: i * ROW_H, height: ROW_H }}><span className="tg-hour">{h === 24 ? "12 AM" : h === 12 ? "12 PM" : h > 12 ? (h - 12) + " PM" : h + " AM"}</span></div>)}
                    {isToday && nowD.getHours() >= START_H && nowD.getHours() < END_H && <div className="tg-now" style={{ top: nowTop }}><span className="tg-now-dot" /><span className="tg-now-lbl">{nowD.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span></div>}
                    {placed.map(({ e, top, col, cols }) => { const crew = e.job.crew || {}; const cl = clientById[e.job.clientId]; const crewN = (crew.team || []).length, fleetN = (crew.fleet || []).length; const w = 100 / cols;
                      return (
                        <button className={"tg-ev-block ev-" + e.kind.toLowerCase()} key={e.id} style={{ top: top + 2, minHeight: ROW_H - 6, left: `calc(${col * w}% + 4px)`, width: `calc(${w}% - 8px)` }} onClick={() => onOpenJob(e.job.id)} title={e.label}>
                          <div className="tg-ev-time"><Clock size={10} />{e.time} · {e.kind}</div>
                          <div className="tg-ev-title">{e.label}{cl ? <span className="muted"> · {cl.name}</span> : null}</div>
                          <div className="tg-ev-ref mono">{e.job.ref}</div>
                          <div className="tg-ev-res">
                            {(crew.team || []).map(id => teamById[id] && <span className="res-chip" key={id}><Users size={10} />{teamById[id].name}</span>)}
                            {(crew.fleet || []).map(id => fleetById[id] && <span className="res-chip res-fleet" key={id}><Truck size={10} />{fleetById[id].name || fleetById[id].type}</span>)}
                            {(crew.equipment || []).map(id => equipById[id] && <span className="res-chip res-eq" key={id}><Wrench size={10} />{equipById[id].name}</span>)}
                            {!crewN && !fleetN && <span className="res-chip res-none">Unassigned — allocate crew</span>}
                          </div>
                        </button>
                      ); })}
                    {dayEvs.length === 0 && <div className="tg-empty">Nothing scheduled for this day. Use the arrows to change day, or add timed collection/delivery slots on a job.</div>}
                  </div>
                </div>
              );
            })()}
          </section>
          <section className="panel">
            <div className="panel-head"><h2>Resources allocated this day</h2></div>
            {[...resRowsForDay(crewAlloc, teamById, "Crew"), ...resRowsForDay(fleetAlloc, fleetById, "Fleet"), ...resRowsForDay(equipAlloc, equipById, "Equipment")].length === 0
              ? <div className="vp-sub">No resources allocated for this day.</div>
              : <div className="alloc-grid">
                {resRowsForDay(crewAlloc, teamById, "Crew").map(r => <div className="alloc-row" key={"t" + r.id}><span className="alloc-ico"><Users size={13} /></span><span className="alloc-name">{r.name}<span className="muted sm"> · {r.sub}</span></span>{r.byDay[dayKey].size > 1 ? <span className="clash-tag">{r.byDay[dayKey].size} jobs</span> : <span className="muted sm">{r.jobIds.length ? jobs.find(j => j.id === r.jobIds[0])?.ref : ""}</span>}</div>)}
                {resRowsForDay(fleetAlloc, fleetById, "Fleet").map(r => <div className="alloc-row" key={"f" + r.id}><span className="alloc-ico"><Truck size={13} /></span><span className="alloc-name">{r.name}</span>{r.byDay[dayKey].size > 1 ? <span className="clash-tag">{r.byDay[dayKey].size} jobs</span> : <span className="muted sm">{r.jobIds.length ? jobs.find(j => j.id === r.jobIds[0])?.ref : ""}</span>}</div>)}
                {resRowsForDay(equipAlloc, equipById, "Equipment").map(r => <div className="alloc-row" key={"e" + r.id}><span className="alloc-ico"><Wrench size={13} /></span><span className="alloc-name">{r.name}</span></div>)}
              </div>}
          </section>
          <section className="panel">
            <div className="panel-head"><h2>Requests to fulfil</h2><span className="muted">{reqLinesInRange.length}</span></div>
            {reqLinesInRange.length === 0 ? <div className="vp-sub">No resource requests in this period. Operators raise dated requests from a job's Crew &amp; dispatch tab.</div>
              : <div className="table-wrap"><table className="data-table">
                <thead><tr><th>When</th><th>Job · task</th><th>Requested</th><th>Status</th><th className="ta-r"></th></tr></thead>
                <tbody>{reqLinesInRange.map(({ job: j, req: r }) => {
                  const total = reqCount(r), got = reqAllocCount(r); const parts = reqParts(r); const done = total > 0 && got >= total;
                  return (
                    <tr key={j.id + r.id}>
                      <td className="cell-sub">{r.date ? fmtDate(r.date) : "—"}{r.time ? <div className="muted sm">{r.time}</div> : null}</td>
                      <td className="cell-title">{j.ref}<div className="cell-sub">{r.label || r.slotKind || "Resources"}{clientById[j.clientId] ? " · " + clientById[j.clientId].name : ""}</div></td>
                      <td className="cell-sub">{parts.length ? parts.join(", ") : <span className="muted">none specified</span>}</td>
                      <td><Pill label={r.status || "Requested"} tone={REQ_STATUS_TONE[r.status || "Requested"]} /> <span className="muted sm">{got}/{total || 0}</span></td>
                      <td className="ta-r">{canAllocate(role) ? <button className="btn btn-sm btn-primary" onClick={() => setDrawer({ jobId: j.id, reqId: r.id })}>Allocate</button> : <button className="btn btn-sm btn-ghost" onClick={() => onOpenJob(j.id)}>View</button>}</td>
                    </tr>
                  );
                })}</tbody>
              </table></div>}
          </section>
        </>
      ) : (
        <div className="cal cal-week">
          {days.map(d => { const evs = evFor(d); const isToday = ymd(d) === today; return (
            <div className={"cal-day" + (isToday ? " today" : "")} key={ymd(d)}>
              <div className="cal-day-head"><span className="cal-dow">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span><span className="cal-date">{d.getDate()}</span></div>
              <div className="cal-events">
                {evs.length === 0 ? <div className="cal-empty">—</div> : evs.map(e => { const crew = e.job.crew || {}; const crewN = (crew.team || []).length; const fleetN = (crew.fleet || []).length; return (
                  <button className={"cal-ev ev-" + e.kind.toLowerCase()} key={e.id} onClick={() => onOpenJob(e.job.id)} title={e.job.ref + " · " + e.label}>
                    <span className="cal-ev-kind">{e.kind}</span>
                    <span className="cal-ev-label">{e.label}</span>
                    <span className="cal-ev-meta">{e.job.ref}{(crewN || fleetN) ? ` · ${crewN ? crewN + " crew" : ""}${fleetN ? " " + fleetN + " veh" : ""}` : " · unassigned"}</span>
                  </button>
                ); })}
              </div>
            </div>
          ); })}
        </div>
      )}

      {/* resources list with usage / availability */}
      <div className="dash-cols">
        <section className="panel">
          <div className="panel-head"><h2>Resources · usage this {mode}</h2><span className="muted">{team.length + fleet.length} total</span></div>
          <div className="table-wrap"><table className="data-table">
            <thead><tr><th>Resource</th><th>Type</th><th>Status</th><th className="ta-r">Days committed</th><th>Availability</th></tr></thead>
            <tbody>
              {team.map(t => { const a = crewAlloc.find(r => r.id === t.id); const dc = a ? a.dayCount : 0; const cl = a ? a.clashes.length : 0; return (
                <tr key={"t" + t.id}>
                  <td className="cell-title">{t.name}<div className="cell-sub">{t.role}</div></td>
                  <td><Pill label="Crew" tone="storage" /></td>
                  <td className="cell-sub">{t.status || "—"}</td>
                  <td className="ta-r mono">{dc}/{slots}</td>
                  <td>{cl ? <span className="clash-tag">{cl} clash{cl > 1 ? "es" : ""}</span> : dc === 0 ? <span className="avail-tag free">Fully available</span> : dc >= slots ? <span className="avail-tag full">Fully booked</span> : <span className="avail-tag part">{slots - dc} day{slots - dc > 1 ? "s" : ""} free</span>}</td>
                </tr>
              ); })}
              {fleet.map(f => { const a = fleetAlloc.find(r => r.id === f.id); const dc = a ? a.dayCount : 0; const cl = a ? a.clashes.length : 0; return (
                <tr key={"f" + f.id}>
                  <td className="cell-title">{f.name || f.type}<div className="cell-sub">{f.type}</div></td>
                  <td><Pill label="Fleet" tone="loan" /></td>
                  <td className="cell-sub">{f.status || "—"}</td>
                  <td className="ta-r mono">{dc}/{slots}</td>
                  <td>{cl ? <span className="clash-tag">{cl} clash{cl > 1 ? "es" : ""}</span> : dc === 0 ? <span className="avail-tag free">Fully available</span> : dc >= slots ? <span className="avail-tag full">Fully booked</span> : <span className="avail-tag part">{slots - dc} day{slots - dc > 1 ? "s" : ""} free</span>}</td>
                </tr>
              ); })}
            </tbody>
          </table></div>
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Idle &amp; needs scheduling</h2></div>
          <div className="vp-label">Unallocated crew · this {mode}</div>
          {idleCrew.length === 0 ? <div className="vp-sub">All crew have assignments.</div> : <div className="idle-chips">{idleCrew.map(t => <span className="idle-chip" key={t.id}><Users size={11} />{t.name}</span>)}</div>}
          <div className="vp-label" style={{ marginTop: 14 }}>Unallocated fleet</div>
          {idleFleet.length === 0 ? <div className="vp-sub">All vehicles in use.</div> : <div className="idle-chips">{idleFleet.map(f => <span className="idle-chip res-fleet" key={f.id}><Truck size={11} />{f.name || f.type}</span>)}</div>}
          <div className="vp-label" style={{ marginTop: 14 }}>Jobs needing a slot</div>
          {unscheduled.length === 0 ? <div className="vp-sub">Every active job has a scheduled slot.</div>
            : <div className="idle-jobs">{unscheduled.slice(0, 6).map(j => <div className="idle-job" key={j.id} onClick={() => onOpenJob(j.id)}><span className="mono sm">{j.ref}</span><span className="cell-sub">{j.name}</span></div>)}</div>}
        </section>
      </div>

      {drawer && drawerReq && (() => {
        const r = drawerReq; const j = drawerJob; const alloc = r.alloc || { team: [], fleet: [], equipment: [], subs: [] };
        const toggle = (g, id) => { const arr = alloc[g] || []; const next = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]; const na = { ...alloc, [g]: next }; const status = r.status === "Confirmed" ? "Confirmed" : (reqAllocCount({ alloc: na }) > 0 ? "Allocated" : "Requested"); saveReqLine(j.id, r.id, { alloc: na, status }); };
        const addSub = () => { const name = window.prompt("Subcontractor name?"); if (!name) return; const sr = window.prompt("Role / service? (optional)") || ""; const na = { ...alloc, subs: [...(alloc.subs || []), { name, role: sr }] }; saveReqLine(j.id, r.id, { alloc: na, status: r.status === "Confirmed" ? "Confirmed" : "Allocated" }); };
        const delSub = (i) => { const na = { ...alloc, subs: (alloc.subs || []).filter((_, ix) => ix !== i) }; saveReqLine(j.id, r.id, { alloc: na }); };
        const total = reqCount(r), got = reqAllocCount(r); const parts = reqParts(r);
        const confirm = () => { saveReqLine(j.id, r.id, { status: "Confirmed" }); if (onNotify) (alloc.team || []).forEach(id => { const m = team.find(x => x.id === id); if (m) onNotify({ teamId: id, teamName: m.name, jobId: j.id, jobRef: j.ref, label: `${r.label || r.slotKind || "Assignment"} ${r.date ? fmtDate(r.date) : ""}${r.time ? " " + r.time : ""}` }); }); };
        return (
          <div className="drawer-overlay" onClick={() => setDrawer(null)}>
            <div className="drawer" onClick={e => e.stopPropagation()}>
              <div className="drawer-head">
                <div><div className="drawer-title">Allocate resources</div><div className="muted sm">{j.ref} · {r.label || r.slotKind || "Request"}{r.date ? " · " + fmtDate(r.date) : ""}{r.time ? " " + r.time : ""}</div></div>
                <button className="icon-btn" onClick={() => setDrawer(null)}><X size={18} /></button>
              </div>
              <div className="drawer-body">
                <div className="drawer-req"><span className="vp-label">Requested</span> {parts.length ? parts.join(", ") : <span className="muted">none specified</span>}{r.notes ? <div className="muted sm" style={{ marginTop: 6 }}>{r.notes}</div> : null}</div>
                <div className="drawer-prog"><span className={"avail-tag " + (total > 0 && got >= total ? "free" : "part")}>{got}/{total || 0} allocated</span> <Pill label={r.status || "Requested"} tone={REQ_STATUS_TONE[r.status || "Requested"]} /></div>
                <div className="pb-head">Crew</div>
                <div className="cock-chips">{team.map(t => { const on = (alloc.team || []).includes(t.id); return <button key={t.id} className={"cock-chip" + (on ? " on" : "")} onClick={() => toggle("team", t.id)}>{on ? <Check size={12} /> : <Plus size={12} />}{t.name} · {t.role}</button>; })}</div>
                <div className="pb-head">Fleet</div>
                <div className="cock-chips">{fleet.map(f => { const on = (alloc.fleet || []).includes(f.id); return <button key={f.id} className={"cock-chip" + (on ? " on" : "")} onClick={() => toggle("fleet", f.id)}>{on ? <Check size={12} /> : <Plus size={12} />}{f.name || f.type}</button>; })}</div>
                <div className="pb-head">Equipment</div>
                <div className="cock-chips">{(equipment || []).map(eq => { const on = (alloc.equipment || []).includes(eq.id); return <button key={eq.id} className={"cock-chip" + (on ? " on" : "")} onClick={() => toggle("equipment", eq.id)}>{on ? <Check size={12} /> : <Plus size={12} />}{eq.name}</button>; })}</div>
                <div className="pb-head">Subcontractors</div>
                <div className="sub-list">
                  {(alloc.subs || []).map((sb, i) => <div className="sub-row" key={i}><Building2 size={14} /><span>{sb.name}{sb.role ? " · " + sb.role : ""}</span><button className="icon-btn-sm" onClick={() => delSub(i)}><Trash2 size={13} /></button></div>)}
                  <button className="btn btn-sm btn-ghost" onClick={addSub}><Plus size={13} />Add subcontractor</button>
                </div>
              </div>
              <div className="drawer-foot">
                <button className="btn btn-ghost" onClick={() => setDrawer(null)}>Close</button>
                <div className="spacer" />
                {r.status === "Confirmed"
                  ? <button className="btn btn-ghost" onClick={() => saveReqLine(j.id, r.id, { status: "Allocated" })}>Unconfirm</button>
                  : <button className="btn btn-primary" disabled={got === 0} onClick={confirm}><Check size={15} />Confirm &amp; notify crew</button>}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}


export const DOC_BY_MODE = { Air: { label: "Air Waybill", abbr: "AWB" }, Sea: { label: "Bill of Lading", abbr: "B/L" }, Road: { label: "CMR Consignment Note", abbr: "CMR" } };

export const REQ_STATUS = ["Requested", "Allocated", "Confirmed"];

export const REQ_STATUS_TONE = { Requested: "loan", Allocated: "storage", Confirmed: "consv" };

export function reqCount(r) { return ["crew", "fleet", "equipment"].reduce((s, g) => s + Object.values((r && r[g]) || {}).reduce((a, n) => a + (Number(n) || 0), 0), 0); }
function reqAllocCount(r) { const a = (r && r.alloc) || {}; return (a.team || []).length + (a.fleet || []).length + (a.equipment || []).length + (a.subs || []).length; }


export function reqAllocCount(r) { const a = (r && r.alloc) || {}; return (a.team || []).length + (a.fleet || []).length + (a.equipment || []).length + (a.subs || []).length; }
function reqParts(r) { const out = []; ["crew", "fleet", "equipment"].forEach(g => Object.entries((r && r[g]) || {}).forEach(([k, n]) => { if (n) out.push(`${n}× ${k}`); })); return out; }


export function reqParts(r) { const out = []; ["crew", "fleet", "equipment"].forEach(g => Object.entries((r && r[g]) || {}).forEach(([k, n]) => { if (n) out.push(`${n}× ${k}`); })); return out; }
function reqLabel(r, jobsEvLabel) { return r.label || (r.slotKind ? r.slotKind : "Resource request"); }


export function reqLabel(r, jobsEvLabel) { return r.label || (r.slotKind ? r.slotKind : "Resource request"); }
// migrate a legacy single resourceRequest bundle into the new array form


export function jobRequests(job) {
  if (Array.isArray(job.resourceRequests)) return job.resourceRequests;
  const legacy = job.resourceRequest;
  if (legacy && reqCount(legacy)) return [{ id: "legacy", date: job.startDate || "", label: "Job resources", crew: legacy.crew || {}, fleet: legacy.fleet || {}, equipment: legacy.equipment || {}, notes: legacy.notes || "", status: (job.crew && ((job.crew.team || []).length || (job.crew.fleet || []).length)) ? "Allocated" : "Requested", alloc: { team: (job.crew || {}).team || [], fleet: (job.crew || {}).fleet || [], equipment: (job.crew || {}).equipment || [], subs: job.subcontractors || [] } }];
  return [];
}


