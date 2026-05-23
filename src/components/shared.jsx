// ARTECO shared domain components
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
import { Modal, L } from "./ui.jsx";

const { uid, fmtMoney, fmtDate, fmtDateTime, humanBytes, callAI, fileToDataUrl, toB64,
        DOC_KINDS, DOC_KIND_TONE, COMM_DIRS, makeEntry, volM3, objVolM3,
        estimateCrate, estimateCrateWeight, chargeableKg, crateCBM, volWeight,
        crateTotals, fmtVol } = H;
const { ARTECO_PARTY, CATEGORIES, MODES, SERVICE_BY, SERVICES, SERVICES_BY_GROUP, SERVICE_GROUPS,
        VOL_WEIGHT_PER_CBM } = C;

export function DocFolder({ files, onChange, label }) {
  const list = files || [];
  return (
    <div className="doc-folder">
      <div className="doc-folder-head"><h3>Document folder{label ? ` \u00b7 ${label}` : ""}</h3><span className="muted">{list.length} document(s)</span><div className="spacer" /><label className="btn btn-sm btn-ghost"><FileUp size={13} />Upload<input type="file" hidden onChange={e => { const file = e.target.files[0]; if (!file) return; fileToDataUrl(file).then(url => onChange([makeEntry({ kind: "Document", title: file.name, body: "", url }), ...list])); e.target.value = ""; }} /></label></div>
      {list.length === 0 ? <div className="muted" style={{padding:"18px 0",textAlign:"center",fontSize:13}}>No documents attached yet. Upload files or generate documents to build this file\u2019s record.</div>
      : <div className="doc-list">{list.map((fl, i) => <div key={i} className="doc-item"><FileText size={14} /><div className="doc-meta"><span className="doc-title">{fl.title || "Untitled"}</span><span className="muted sm">{fl.kind || "Document"}{fl.at ? " \u00b7 " + fmtDateTime(fl.at) : ""}</span></div>{fl.url && <div className="doc-acts"><button type="button" className="btn btn-sm btn-ghost" onClick={() => window.open(fl.url, "_blank")}><Eye size={13} />Preview</button><button type="button" className="btn btn-sm btn-ghost" onClick={() => { const a = document.createElement("a"); a.href = fl.url; a.download = fl.title || "document"; a.click(); }}>Download</button></div>}</div>)}</div>}
      <div className="doc-activity"><span className="muted" style={{fontSize:12}}>Activity & communications log \u2014 placeholder for future email integration.</span></div>
    </div>
  );
}


export function CustomerLookupModal({ clients, onSelect, onClose }) {
  const [q, setQ] = useState("");
  const filtered = q.trim() ? clients.filter(c => [c.name, c.ref, c.city, c.country, c.contact, c.address].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase())) : clients;
  return (
    <Modal title="Customer lookup" wide onClose={onClose}>
      <div className="clm-search"><Search size={16} /><input placeholder="Search by name, ID, city, or contact…" value={q} onChange={e => setQ(e.target.value)} autoFocus /></div>
      <div className="table-wrap" style={{maxHeight:420,overflow:"auto"}}>
        <table className="data-table">
          <thead><tr><th>ID</th><th>Account</th><th>Entity</th><th>Type</th><th>Location</th><th>Contact</th><th></th></tr></thead>
          <tbody>{filtered.length === 0 ? <tr><td colSpan={7} className="muted ta-c" style={{padding:20}}>No customers match your search.</td></tr> : filtered.map(c => {
            const loc = [c.city, c.country].filter(Boolean).join(", ") || c.address || "—";
            return (
              <tr key={c.id} className="clm-row" onClick={() => onSelect(c)} style={{cursor:"pointer"}}>
                <td className="mono cell-sub">{c.ref || "—"}</td>
                <td className="cell-title">{c.name}</td>
                <td><span className={"entity-tag et-" + (c.entityType === "Individual" ? "ind" : "co")}>{c.entityType || "Company"}</span></td>
                <td className="cell-sub">{c.type}</td>
                <td className="cell-sub">{loc}</td>
                <td className="cell-sub">{c.contact || ((c.contacts || [])[0] || {}).name || "—"}</td>
                <td className="ta-r"><button type="button" className="btn btn-sm btn-primary" onClick={e => { e.stopPropagation(); onSelect(c); }}>Select</button></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </Modal>
  );
}


export function PartyCard({ title, sub, party, onChange, clients, billTo }) {
  const p = party || {};
  const [lookupOpen, setLookupOpen] = useState(false);
  const set = (k) => (e) => onChange({ ...p, [k]: e.target.value });
  const fillFrom = (c) => onChange({ name: c.name, street: c.street || c.address || "", zip: c.zip || "", city: c.city || "", country: c.country || "", contact: c.contact || ((c.contacts || [])[0] || {}).name || "", phone: c.phone || ((c.contacts || [])[0] || {}).phone || "" });
  return (
    <div className="party-col">
      <div className="party-h">
        <div className="party-h-l"><span>{title}</span><span className="party-sub">{sub}</span></div>
        <div className="party-fills">
          <button className="party-fill party-fill-lookup" type="button" onClick={() => setLookupOpen(true)}>Lookup</button>
          {billTo && <button className="party-fill" type="button" onClick={() => fillFrom(billTo)}>Use customer</button>}
          <button className="party-fill" type="button" onClick={() => onChange({ ...ARTECO_PARTY })}>Use ARTECO</button>
        </div>
      </div>
      <L label="Name"><input value={p.name || ""} onChange={set("name")} placeholder="Company / person" /></L>
      <L label="Street"><input value={p.street != null ? p.street : (p.address || "")} onChange={set("street")} placeholder="Street & number" /></L>
      <div className="form-grid form-grid-2">
        <L label="ZIP / postcode"><input value={p.zip || ""} onChange={set("zip")} /></L>
        <L label="City"><input value={p.city || ""} onChange={set("city")} /></L>
      </div>
      <L label="Country"><input value={p.country || ""} onChange={set("country")} /></L>
      <div className="form-grid form-grid-2">
        <L label="Contact"><input value={p.contact || ""} onChange={set("contact")} placeholder="Contact name" /></L>
        <L label="Phone"><input value={p.phone || ""} onChange={set("phone")} /></L>
      </div>
      {lookupOpen && <CustomerLookupModal clients={clients} onSelect={c => { fillFrom(c); setLookupOpen(false); }} onClose={() => setLookupOpen(false)} />}
    </div>
  );
}


export function CrateCalc({ crates, mode, objects, clientId, onChange }) {
  const [aiBusy, setAiBusy] = useState("");
  const set = (id, patch) => onChange(crates.map(c => c.id === id ? { ...c, ...patch } : c));
  const add = (seed) => onChange([...crates, { id: uid(), label: "", l: "", w: "", h: "", weight: "", qty: 1, fromObjectId: "", ...seed }]);
  const del = (id) => onChange(crates.filter(c => c.id !== id));
  const fromObject = (o) => { const est = estimateCrate({ w: o.fw || o.w, h: o.fh || o.h, d: o.fd || o.d, flat: o.flat }); add({ label: o.title, l: est.l, w: est.w, h: est.h, weight: estimateCrateWeight(est.l, est.w, est.h, o.weight), fromObjectId: o.id }); };
  const autoEstimate = (c) => { const est = estimateCrate({ w: c.l, h: c.w, d: c.h, flat: false }); set(c.id, { ...est, weight: c.weight || estimateCrateWeight(est.l, est.w, est.h, 0) }); };
  const aiEstimate = async (c) => {
    setAiBusy(c.id);
    try {
      const sys = `You are a fine-art crating estimator. Estimate a sensible export packing crate. Reply ONLY as compact JSON with keys l, w, h (cm) and weight (gross kg). No prose.`;
      const j = await callAI(sys, [{ type: "text", text: `Item: "${c.label || "artwork"}". Estimate crate now.` }], 200);
      set(c.id, { l: Math.round(j.l), w: Math.round(j.w), h: Math.round(j.h), weight: Math.round(j.weight) });
    } catch (e) { const est = estimateCrate({ w: c.l || 100, h: c.w || 100, d: c.h, flat: true }); set(c.id, { ...est, weight: estimateCrateWeight(est.l, est.w, est.h, 0) }); }
    setAiBusy("");
  };
  const [paste, setPaste] = useState("");
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [intakeBusy, setIntakeBusy] = useState(false);
  const t = crateTotals(crates);
  const chg = chargeableKg(t.cbm, t.gross, mode);
  const custObjs = [...objects].sort((a, b) => (a.clientId === clientId ? 0 : 1) - (b.clientId === clientId ? 0 : 1) || (a.title || "").localeCompare(b.title || ""));
  const aiIntake = async () => {
    if (!paste.trim()) return;
    setIntakeBusy(true);
    try {
      const sys = `You are a fine-art logistics estimator. Extract each artwork/item and estimate a sensible export crate. Reply ONLY as a compact JSON array of objects with keys: label (string), l (crate cm), w (cm), h (cm), weight (gross kg), qty (count). No prose.`;
      const items = await callAI(sys, [{ type: "text", text: "Artwork list:\n" + paste + "\n\nExtract and estimate now." }], 1000);
      const arr = Array.isArray(items) ? items : [];
      const rows = arr.map(it => ({ id: uid(), label: it.label || "Item", l: Math.round(it.l) || "", w: Math.round(it.w) || "", h: Math.round(it.h) || "", weight: Math.round(it.weight) || "", qty: it.qty || 1, fromObjectId: "" }));
      if (rows.length) onChange([...crates, ...rows]);
      setPaste(""); setIntakeOpen(false);
    } catch (e) { /* leave text for retry */ }
    setIntakeBusy(false);
  };
  return (
    <div className="calc">
      <div className="ln-head"><span className="muted sm">Crates &amp; items — sized for freight</span>
        <div className="calc-add">
          <button className={"btn btn-sm" + (intakeOpen ? " btn-primary" : " btn-ghost")} onClick={() => setIntakeOpen(o => !o)}><Sparkles size={13} />AI intake</button>
          <select value="" onChange={e => { const o = custObjs.find(x => x.id === e.target.value); if (o) fromObject(o); }}><option value="">+ From inventory…</option>{custObjs.map(o => <option key={o.id} value={o.id}>{o.title}{o.artist ? " — " + o.artist : ""}{o.clientId !== clientId ? "  · other account" : ""}</option>)}</select>
          <button className="btn btn-sm btn-ghost" onClick={() => add({})}><Plus size={13} />Add crate</button>
        </div>
      </div>
      {intakeOpen && (
        <div className="calc-intake">
          <textarea value={paste} onChange={e => setPaste(e.target.value)} placeholder={"Paste an email or item list — e.g.\nUntitled landscape, oil on canvas, 120 x 90 cm\nBronze figure 'Dawn', approx 45cm h, 12kg\n…"} rows={4} />
          <div className="calc-intake-foot">
            <label className="btn btn-sm btn-ghost"><FileUp size={13} />Upload file<input type="file" hidden onChange={async e => {
              const file = e.target.files && e.target.files[0]; if (!file) return; e.target.value = "";
              const lower = file.name.toLowerCase(); setIntakeBusy(true);
              try {
                let content = [];
                if (/\.(csv|tsv|txt|eml)$/.test(lower)) { const txt = await file.text(); setPaste(txt); setIntakeBusy(false); return; }
                else if (/\.xlsx?$/.test(lower)) { const ab = await file.arrayBuffer(); const wb = XLSX.read(ab, { type: "array" }); const txt = wb.SheetNames.map(n => `--- ${n} ---\n${XLSX.utils.sheet_to_csv(wb.Sheets[n])}`).join("\n\n"); setPaste(txt); setIntakeBusy(false); return; }
                else if (lower.endsWith(".pdf")) content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: await toB64(file) } });
                else if (/\.(png|jpe?g|gif|webp)$/.test(lower)) content.push({ type: "image", source: { type: "base64", media_type: file.type || "image/png", data: await toB64(file) } });
                else { setIntakeBusy(false); return; }
                content.push({ type: "text", text: "Extract each artwork/item and estimate export crate dimensions. Reply ONLY as compact JSON array of objects with keys: label, l, w, h (cm), weight (kg), qty. No prose." });
                const items = await callAI("You are a fine-art logistics estimator.", content, 1000);
                const rows = (Array.isArray(items) ? items : []).map(it => ({ id: uid(), label: it.label || "Item", l: Math.round(it.l) || "", w: Math.round(it.w) || "", h: Math.round(it.h) || "", weight: Math.round(it.weight) || "", qty: it.qty || 1, fromObjectId: "" }));
                if (rows.length) onChange([...crates, ...rows]);
                setIntakeOpen(false);
              } catch (ex) { /* leave open for retry */ }
              setIntakeBusy(false);
            }} /></label>
            <span className="muted sm">Paste text or upload a PDF / Excel / image of the artwork list.</span>
            <div className="spacer" />
            <button className="btn btn-sm btn-primary" onClick={aiIntake} disabled={intakeBusy || !paste.trim()}>{intakeBusy ? "Reading…" : "Extract crates"}</button>
          </div>
        </div>
      )}
      {crates.length === 0 && <div className="ln-empty">Add a crate, or pull an object from the collection to auto-size and weigh it.</div>}
      {crates.length > 0 && (
        <div className="calc-table">
          <div className="calc-hrow"><span>Item</span><span>L</span><span>W</span><span>H</span><span>Qty</span><span>Gross kg</span><span>CBM</span><span>Chg. kg</span><span></span></div>
          {crates.map(c => {
            const cbm = crateCBM(c.l, c.w, c.h); const lineChg = chargeableKg(cbm * (Number(c.qty) || 1), (Number(c.weight) || 0) * (Number(c.qty) || 1), mode);
            return (
              <div className="calc-row" key={c.id}>
                <input className="calc-label" value={c.label} onChange={e => set(c.id, { label: e.target.value })} placeholder="Crate / item" />
                <input className="calc-n" type="number" value={c.l} onChange={e => set(c.id, { l: e.target.value })} />
                <input className="calc-n" type="number" value={c.w} onChange={e => set(c.id, { w: e.target.value })} />
                <input className="calc-n" type="number" value={c.h} onChange={e => set(c.id, { h: e.target.value })} />
                <input className="calc-n" type="number" value={c.qty} onChange={e => set(c.id, { qty: e.target.value })} />
                <input className="calc-n calc-wide" type="number" value={c.weight} onChange={e => set(c.id, { weight: e.target.value })} />
                <span className="calc-out mono">{cbm ? (cbm * (Number(c.qty) || 1)).toFixed(2) : "—"}</span>
                <span className="calc-out mono">{cbm ? Math.round(lineChg) : "—"}</span>
                <span className="calc-acts">
                  <button title="Auto-estimate crate from these item dims" onClick={() => autoEstimate(c)}><Sparkles size={12} /></button>
                  <button title="AI estimate from description" onClick={() => aiEstimate(c)} disabled={aiBusy === c.id}>{aiBusy === c.id ? "…" : <Gauge size={12} />}</button>
                  <button title="Remove" onClick={() => del(c.id)}><Trash2 size={12} /></button>
                </span>
              </div>
            );
          })}
          <div className="calc-totals">
            <span>{t.count} crate{t.count === 1 ? "" : "s"}</span>
            <span>Volume <b className="mono">{t.cbm.toFixed(2)} m³</b></span>
            <span>Gross <b className="mono">{Math.round(t.gross)} kg</b></span>
            <span>Chargeable ({mode}) <b className="mono val-lime">{Math.round(chg)} kg</b></span>
          </div>
        </div>
      )}
      <div className="calc-hint">Chargeable weight uses the airline rule — Air ÷6000 (≈167 kg/m³), Road ÷3000, Sea by W/M — taking the greater of gross and volumetric weight. Drives freight and handling line quantities.</div>
    </div>
  );
}


export function DocsPanel({ files, onChange, brandName, contextLabel }) {
  const list = Array.isArray(files) ? files : [];
  const [tab, setTab] = useState("all");
  const [commKind, setCommKind] = useState("Email");
  const [commDir, setCommDir] = useState("Inbound");
  const [commTitle, setCommTitle] = useState("");
  const [commBody, setCommBody] = useState("");
  const add = (e) => onChange([makeEntry(e), ...list]);
  const del = (id) => onChange(list.filter(x => x.id !== id));
  const onUpload = async (ev) => {
    const fs = Array.from(ev.target.files || []); if (!fs.length) return;
    const entries = [];
    for (const f of fs) { try { const data = await fileToDataUrl(f); entries.push(makeEntry({ kind: "Document", title: f.name, fileName: f.name, mime: f.type, size: f.size, data })); } catch (e) { console.warn(e); } }
    onChange([...entries, ...list]); ev.target.value = "";
  };
  const logComm = () => { if (!commTitle.trim() && !commBody.trim()) return; add({ kind: commKind, dir: commDir, title: commTitle.trim() || (commKind + " — " + commDir), body: commBody.trim() }); setCommTitle(""); setCommBody(""); };
  const filtered = list.filter(x => tab === "all" ? true : tab === "docs" ? x.kind === "Document" : tab === "comms" ? ["Email", "Call", "Note"].includes(x.kind) : x.kind === "System");
  const counts = { docs: list.filter(x => x.kind === "Document").length, comms: list.filter(x => ["Email", "Call", "Note"].includes(x.kind)).length, sys: list.filter(x => x.kind === "System").length };
  return (
    <div className="docs">
      <div className="cock-h">Documents &amp; communications{contextLabel ? " · " + contextLabel : ""}</div>
      <div className="docs-actions">
        <label className="btn btn-primary docs-upl"><FileUp size={15} />Upload files<input type="file" multiple style={{ display: "none" }} onChange={onUpload} /></label>
        <span className="muted sm">{counts.docs} document(s) · {counts.comms} comm(s){counts.sys ? " · " + counts.sys + " system" : ""}</span>
      </div>
      <div className="docs-log">
        <div className="docs-log-row">
          <select className="cock-sel" value={commKind} onChange={e => setCommKind(e.target.value)}>{["Email", "Call", "Note"].map(k => <option key={k}>{k}</option>)}</select>
          {commKind !== "Note" && <select className="cock-sel" value={commDir} onChange={e => setCommDir(e.target.value)}>{COMM_DIRS.map(d => <option key={d}>{d}</option>)}</select>}
          <input className="cock-in" placeholder="Subject / summary" value={commTitle} onChange={e => setCommTitle(e.target.value)} />
          <button className="btn btn-ghost btn-sm" onClick={logComm}><Plus size={13} />Log</button>
        </div>
        <textarea className="docs-ta" placeholder="Details (optional) — what was said, agreed, requested…" value={commBody} onChange={e => setCommBody(e.target.value)} />
      </div>
      <div className="docs-tabs">
        {[["all", "All"], ["docs", "Documents"], ["comms", "Communications"], ["sys", "System log"]].map(([v, l]) => <button key={v} className={"docs-tab" + (tab === v ? " on" : "")} onClick={() => setTab(v)}>{l}</button>)}
      </div>
      {filtered.length === 0 ? <div className="ln-empty">Nothing filed yet. Upload documents or log a communication above — everything attaches to this {contextLabel ? contextLabel.toLowerCase() : "record"}.</div>
        : <div className="docs-list">{filtered.map(x => (
          <div className={"docs-item k-" + x.kind.toLowerCase()} key={x.id}>
            <span className="docs-ico">{x.kind === "Document" ? <FileText size={15} /> : x.kind === "Email" ? <ArrowLeftRight size={15} /> : x.kind === "Call" ? <Bell size={15} /> : x.kind === "System" ? <Settings size={15} /> : <BookOpen size={15} />}</span>
            <div className="docs-main">
              <div className="docs-title">{x.title}{x.dir && <span className="docs-dir">{x.dir}</span>}<Pill label={x.kind} tone={DOC_KIND_TONE[x.kind]} /></div>
              {x.body && <div className="docs-body">{x.body}</div>}
              {x.fileName && <div className="muted sm">{x.fileName}{x.size ? " · " + humanBytes(x.size) : ""}</div>}
              <div className="muted sm">{fmtDateTime(x.at)}{x.by ? " · " + x.by : ""}</div>
            </div>
            <div className="docs-item-acts">
              {x.data && <a className="icon-btn-sm" href={x.data} download={x.fileName || "file"} title="Download"><ArrowRight size={14} /></a>}
              {x.kind !== "System" && <button className="icon-btn-sm" title="Remove" onClick={() => del(x.id)}><Trash2 size={13} /></button>}
            </div>
          </div>
        ))}</div>}
    </div>
  );
}


