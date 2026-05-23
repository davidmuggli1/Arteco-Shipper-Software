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

export function ObjectsView({ objects, clientById, locById, pkgById, search, setSearch, fStatus, setFStatus, fCat, setFCat, fCustody, setFCustody, onSelect, onNew, onTab }) {
  const filtered = objects.filter(o => {
    const q = search.toLowerCase();
    const hit = !q || [o.title, o.artist, o.ref, clientById[o.clientId]?.name].some(v => (v || "").toLowerCase().includes(q));
    const cu = !fCustody || (o.custody || "In custody") === fCustody;
    return hit && cu && (!fStatus || o.status === fStatus) && (!fCat || o.category === fCat);
  });
  return (
    <div>
      <div className="seg seg-tabs"><button className="seg-btn on">Objects</button><button className="seg-btn" onClick={() => onTab("packages")}>Packages</button></div>
      <div className="toolbar">
        <div className="search"><Search size={16} strokeWidth={1.7} /><input placeholder="Search title, artist, reference, account…" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select value={fCustody} onChange={e => setFCustody(e.target.value)}><option value="">All custody</option>{CUSTODY.map(c => <option key={c}>{c}</option>)}</select>
        <select value={fStatus} onChange={e => setFStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        <select value={fCat} onChange={e => setFCat(e.target.value)}><option value="">All categories</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        <button className="btn btn-primary" onClick={onNew}><Plus size={16} strokeWidth={2} />Register object</button>
      </div>
      <section className="panel">
      <div className="panel-head"><h2>All objects</h2><span className="muted">{filtered.length} of {objects.length}</span></div>
      <div className="table-wrap"><table className="data-table">
        <thead><tr><th></th><th>Object</th><th>Reference</th><th>Account</th><th>Package</th><th>Location</th><th>State</th><th className="ta-r">Declared value</th><th></th></tr></thead>
        <tbody>
          {filtered.map(o => (
            <tr key={o.id} onClick={() => onSelect(o.id)} className={o.custody === "Provisional" ? "row-prov" : ""} style={{cursor:"pointer"}}>
              <td><Thumb src={o.thumb} size={42} /></td>
              <td><div className="cell-title">{o.title}</div><div className="cell-sub">{o.artist}{o.year ? ` · ${o.year}` : ""}</div></td>
              <td className="mono cell-sub">{o.ref}</td>
              <td>{clientById[o.clientId]?.name || "—"}</td>
              <td className="cell-sub">{o.packageId ? <span className="pkg-cell"><Boxes size={12} /> {pkgById[o.packageId]?.type}</span> : (o.custody === "Provisional" ? "—" : <span className="loose-pill">Loose</span>)}</td>
              <td className="cell-sub">{o.locationId ? locById[o.locationId]?.name : (o.custody === "Provisional" ? "not received" : "—")}</td>
              <td><StateChip object={o} /></td>
              <td className="ta-r mono val-lime">{fmtMoney(o.value, o.ccy)}</td>
              <td className="ta-r"><Eye size={15} className="row-eye" /></td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={9} className="empty-row">No objects match your filters.</td></tr>}
        </tbody>
      </table></div>
      </section>
    </div>
  );
}


export function ObjectDetail({ object: o, objects, clientById, locById, pkgById, movements, loadImages, onImages, onOpenObject, onOpenPackage, onClose, onEdit, onMove, onConfirm, onReport }) {
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [light, setLight] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [provOpen, setProvOpen] = useState(false);
  useEffect(() => { let on = true; loadImages().then(im => { if (on) setImages(im || []); }); return () => { on = false; }; }, [o.id]);

  const addFiles = async (files) => {
    setBusy(true);
    try {
      const arr = [];
      for (const f of Array.from(files)) { if (f.type.startsWith("image/")) arr.push(await processImage(f)); }
      const next = [...images, ...arr];
      if (!next.some(i => i.primary) && next.length) next[0].primary = true;
      setImages(next); await onImages(next);
    } catch (e) { console.warn(e); }
    setBusy(false);
  };
  const setPrimary = async (id) => { const next = images.map(i => ({ ...i, primary: i.id === id })); setImages(next); await onImages(next); };
  const delImg = async (id) => { const next = images.filter(i => i.id !== id); if (next.length && !next.some(i => i.primary)) next[0].primary = true; setImages(next); await onImages(next); };

  const sorted = [...movements].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const [vu, setVu] = useState(o.dimUnit || "cm");
  const du = daysUntil(o.customsExpiry);
  const prov = o.custody === "Provisional";
  const pkg = o.packageId ? pkgById[o.packageId] : null;
  const siblings = pkg ? (objects || []).filter(x => x.packageId === pkg.id && x.id !== o.id) : [];
  const dShow = (v) => { const c = convLen(v, o.dimUnit || "cm", vu); return c === "" ? null : round1(c); };
  const dimStr = (h, w, d) => { const parts = [dShow(h), dShow(w)]; if (!o.flat || (d != null && d !== "")) parts.push(dShow(d)); const vals = parts.filter(x => x != null && x !== ""); return vals.length ? `${vals.join(" × ")} ${vu}` : "—"; };
  const artDims = dimStr(o.h, o.w, o.d);
  const frameDims = o.framed && (o.fh || o.fw || o.fd) ? dimStr(o.fh, o.fw, o.fd) : null;
  const looseVol = !pkg && !prov ? objVolM3(o) : 0;


  const shown = images.find(i => i.id === activeId) || images.find(i => i.primary) || images[0] || null;

  return (
    <div className="cat-overlay" onClick={onClose}>
      <div className="cat-drawer" onClick={e => e.stopPropagation()}>
        <div className="cat-stage">
          <button className="cat-close-m" onClick={onClose}><X size={18} /></button>
          <div className="cat-stage-img" onClick={() => shown && setLight(shown)}>
            {shown ? <img src={shown.full} alt={o.title} /> : <div className="cat-noimg"><img className="cat-noimg-logo" src={ARTECO_LOGO} alt="ARTECO" /><span>No image on file yet</span></div>}
          </div>
          <div className="cat-filmstrip">
            {images.map(im => (
              <button className={"cat-thumb" + (im.id === (shown && shown.id) ? " on" : "") + (im.primary ? " primary" : "")} key={im.id} onClick={() => setActiveId(im.id)}>
                <img src={im.thumb} alt={im.name} />
                <span className="cat-thumb-acts" onClick={e => e.stopPropagation()}>
                  <button title="Set as primary" onClick={() => setPrimary(im.id)}><Star size={12} fill={im.primary ? "currentColor" : "none"} /></button>
                  <button title="Remove" onClick={() => delImg(im.id)}><Trash2 size={12} /></button>
                </span>
              </button>
            ))}
            <label className="cat-add">{busy ? <span className="mini-spin" /> : <><FileUp size={16} /><span>Add</span></>}<input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => addFiles(e.target.files)} /></label>
          </div>
        </div>

        <div className="cat-info">
          <button className="icon-btn cat-close" onClick={onClose}><X size={18} /></button>
          <div className="cat-head">
            <span className="cat-ref mono">{o.ref}</span>
            <h2 className="cat-title">{o.title}</h2>
            <div className="cat-artist">{o.artist}{o.year ? ` · ${o.year}` : ""}</div>
            <div className="cat-chips">
              <StateChip object={o} />
              {o.category && <span className="cat-cat">{o.category}</span>}
              {o.insuredByUs && <span className="cat-ins"><ShieldCheck size={12} /> Insured by us</span>}
            </div>
          </div>

          <div className="cat-actions">
            {prov ? <><button className="btn btn-primary" onClick={onConfirm}><CheckCircle2 size={14} />Confirm into custody</button><button className="btn btn-ghost" onClick={onEdit}><Edit3 size={14} />Edit</button></>
              : <><button className="btn btn-primary" onClick={onMove}><ArrowLeftRight size={14} />Move</button><button className="btn btn-ghost" onClick={onEdit}><Edit3 size={14} />Edit</button><button className="btn btn-ghost" onClick={onReport}><Printer size={14} />Report</button></>}
          </div>

          {prov && <div className="prov-note"><FileText size={14} /> Captured at quotation stage. Not physically in care &amp; custody — excluded from stock and stored volume until confirmed.</div>}

          <div className="dl-group">
            <h4>The work</h4>
            <div className="dl">
              <DRow k="Medium" v={o.medium || "—"} />
              <DRow k={o.flat ? "Artwork (H × W)" : "Dimensions (L × W × H)"} v={<>{artDims} <span className="unit-toggle"><button className={vu === "cm" ? "on" : ""} onClick={() => setVu("cm")}>cm</button><button className={vu === "in" ? "on" : ""} onClick={() => setVu("in")}>in</button></span></>} />
              <DRow k="Form" v={o.flat ? "Flat / 2D" : "Three-dimensional"} />
              <DRow k="Framing" v={o.framed ? (o.glazed ? "Framed · behind glass" : "Framed") : "Unframed"} />
              {frameDims && <DRow k="Frame size (H × W × D)" v={frameDims} />}
              <DRow k="Weight" v={o.weight ? `${o.weight} ${o.wUnit}` : "—"} />
              <DRow k="Edition" v={o.edition || "—"} />
              <DRow k="Condition" v={o.condition || "—"} />
            </div>
          </div>

          <div className="dl-group">
            <h4>Custody &amp; location</h4>
            <div className="dl">
              <DRow k="Account" v={clientById[o.clientId]?.name || "—"} />
              <DRow k="Packaging" v={pkg ? <button className="dl-link" onClick={() => onOpenPackage(pkg.id)}>{pkg.type} · <span className="mono">{pkg.ref}</span> <ChevronRight size={12} /></button> : (prov ? "—" : "Loose (uncrated)")} />
              <DRow k="Location" v={o.locationId ? locById[o.locationId]?.name : (prov ? "Not yet received" : "—")} />
              {!pkg && !prov && <DRow k="Storage volume" v={looseVol ? `${fmtVol(looseVol)}${o.framed && frameDims ? " (from frame)" : ""}` : "—"} />}
              <DRow k="Registered" v={fmtDate(o.createdAt)} />
            </div>
          </div>

          <div className="dl-group">
            <button className="dl-collapse" onClick={() => setProvOpen(v => !v)}>
              <h4>Provenance{(o.provenance || []).length ? ` · ${o.provenance.length}` : ""}</h4>
              {provOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
            {provOpen && ((o.provenance || []).length
              ? <ol className="prov-list">{o.provenance.map((e, i) => <li key={i}><span className="prov-year">{e.year}</span><span className="prov-note">{e.note}</span></li>)}</ol>
              : <div className="dl-note">No provenance recorded yet.</div>)}
          </div>

          <div className="dl-group">
            <h4>Customs</h4>
            <div className="dl">
              <DRow k="Status" v={o.customs} />
              <DRow k="Reference" v={o.customsRef || "—"} />
              <DRow k="Carnet / TA expiry" v={o.customsExpiry ? `${fmtDate(o.customsExpiry)}${du != null ? (du < 0 ? " — expired" : ` — ${du}d`) : ""}` : "—"} />
            </div>
          </div>

          {o.conditionNote && <div className="dl-group"><h4>Condition note</h4><p className="dl-note">{o.conditionNote}</p></div>}
          {o.tags?.length > 0 && <div className="dl-group"><h4>Tags</h4><div className="tags">{o.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div></div>}

          {o.components?.length > 0 && (
            <div className="dl-group"><h4>Components ({o.components.length})</h4>
              <div className="comp-list">{o.components.map(c => <div className="comp-item" key={c.id}><div><div className="comp-name">{c.name}</div>{c.note && <div className="comp-note">{c.note}</div>}</div><Chip status={c.status || "In stock"} /></div>)}</div>
            </div>
          )}

          <div className="dl-group">
            <h4>Chain of custody</h4>
            <div className="timeline">
              {sorted.length === 0 && <div className="empty">No movements recorded yet.</div>}
              {sorted.map(m => (<div className="tl-item" key={m.id}><div className="tl-dot" /><div className="tl-content">
                <div className="tl-top"><span className="tl-type">{m.type}{m.subjectType === "Package" ? " (via package)" : ""}</span><span className="tl-date">{fmtDate(m.date)}</span></div>
                <div className="tl-route">{locById[m.fromId]?.name || "—"} → {locById[m.toId]?.name || "—"}</div>
                <div className="tl-meta">Handled by {m.handledBy || "—"}{m.conditionChecked && <span className="tl-cond"><ShieldCheck size={12} /> condition checked</span>}{m.ref && <span className="tl-ref">{m.ref}</span>}</div>
                {m.note && <div className="tl-note">{m.note}</div>}
              </div></div>))}
            </div>
          </div>

          <div className="dl-group">
            <h4>Valuation</h4>
            <div className="dl">
              <DRow k="Declared value" v={<span className="dl-amount">{fmtMoney(o.value, o.ccy)}</span>} />
              <DRow k="Insurance" v={o.insuredByUs ? "Insured through us" : "Not insured by us"} />
            </div>
          </div>
        </div>
      </div>
      {light && <div className="lightbox" onClick={() => setLight(null)}><img src={light.full} alt={light.name} /><button className="lb-close" onClick={() => setLight(null)}><X size={22} /></button></div>}
    </div>
  );
}


export function ObjectForm({ initial, clients, locations, packages, nextRef, onClose, onSave }) {
  const [f, setF] = useState({ category: "Painting", status: "In stock", custody: "In custody", customs: "Free Zone", condition: "Excellent", ccy: "AED", dimUnit: "cm", wUnit: "kg", framed: false, glazed: false, fh: "", fw: "", fd: "", packageId: null, ...initial, flat: initial.flat != null ? initial.flat : isFlatCat(initial.category || "Painting"), tags: (initial.tags || []).join(", ") });
  const [comps, setComps] = useState(initial.components || []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const changeUnit = (u) => setF(prev => prev.dimUnit === u ? prev : { ...prev, dimUnit: u, h: round1(convLen(prev.h, prev.dimUnit, u)), w: round1(convLen(prev.w, prev.dimUnit, u)), d: round1(convLen(prev.d, prev.dimUnit, u)), fh: round1(convLen(prev.fh, prev.dimUnit, u)), fw: round1(convLen(prev.fw, prev.dimUnit, u)), fd: round1(convLen(prev.fd, prev.dimUnit, u)) });
  const prov = f.custody === "Provisional";
  const submit = () => { if (!f.title) return; onSave({ ...f, packageId: prov ? null : (f.packageId || null), locationId: prov ? null : f.locationId, value: f.value === "" ? null : Number(f.value), tags: (f.tags || "").split(",").map(t => t.trim()).filter(Boolean), components: comps }); };
  return (
    <Modal title={f.id ? `Edit ${f.ref}` : "Register new object"} wide onClose={onClose}>
      <div className="form-grid">
        <L label="Reference"><input value={f.ref || nextRef} onChange={set("ref")} className="mono" /></L>
        <L label="Custody state"><select value={f.custody} onChange={set("custody")}>{CUSTODY.map(c => <option key={c}>{c}</option>)}</select></L>
        <L label="Title *"><input value={f.title || ""} onChange={set("title")} /></L>
        <L label="Artist / Maker"><input value={f.artist || ""} onChange={set("artist")} /></L>
        <L label="Year / Period"><input value={f.year || ""} onChange={set("year")} /></L>
        <L label="Category"><select value={f.category} onChange={set("category")}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></L>
        <L label="Medium"><input value={f.medium || ""} onChange={set("medium")} /></L>
        <L label="Edition"><input value={f.edition || ""} onChange={set("edition")} placeholder="e.g. 2/6" /></L>
        <L label="Account"><select value={f.clientId || ""} onChange={set("clientId")}><option value="">—</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></L>
        <div className="form-section gridfull">Dimensions</div>
        <L label="Form & units" full><div className="seg seg-inline">
          <button type="button" className={"seg-btn" + (f.flat ? " on" : "")} onClick={() => setF({ ...f, flat: true })}>Flat / 2D</button>
          <button type="button" className={"seg-btn" + (!f.flat ? " on" : "")} onClick={() => setF({ ...f, flat: false })}>Three-dimensional</button>
          <span className="seg-div" />
          <button type="button" className={"seg-btn" + (f.dimUnit === "cm" ? " on" : "")} onClick={() => changeUnit("cm")}>cm</button>
          <button type="button" className={"seg-btn" + (f.dimUnit === "in" ? " on" : "")} onClick={() => changeUnit("in")}>inches</button>
        </div></L>
        <L label={f.flat ? "Height" : "Length"}><div className="dim"><input type="number" value={f.h ?? ""} onChange={set("h")} /><span>{f.dimUnit}</span></div></L>
        <L label="Width"><div className="dim"><input type="number" value={f.w ?? ""} onChange={set("w")} /><span>{f.dimUnit}</span></div></L>
        <L label={f.flat ? "Depth (stretcher)" : "Height"}><div className="dim"><input type="number" value={f.d ?? ""} onChange={set("d")} /><span>{f.dimUnit}</span></div></L>
        <L label="Weight"><div className="dim"><input type="number" value={f.weight ?? ""} onChange={set("weight")} /><span>{f.wUnit}</span></div></L>
        <L label="Framing"><label className="check"><input type="checkbox" checked={!!f.framed} onChange={e => setF({ ...f, framed: e.target.checked })} /> Framed</label></L>
        {f.framed
          ? <L label="Glazing"><label className="check"><input type="checkbox" checked={!!f.glazed} onChange={e => setF({ ...f, glazed: e.target.checked })} /> Behind glass</label></L>
          : <L label="Glazing"><span className="muted-inline">—</span></L>}
        {f.framed && <>
          <div className="form-note gridfull">Frame dimensions — the outer envelope, usually larger than the artwork. Used to compute storage volume while the piece is loose (uncrated).</div>
          <L label="Frame height"><div className="dim"><input type="number" value={f.fh ?? ""} onChange={set("fh")} /><span>{f.dimUnit}</span></div></L>
          <L label="Frame width"><div className="dim"><input type="number" value={f.fw ?? ""} onChange={set("fw")} /><span>{f.dimUnit}</span></div></L>
          <L label="Frame depth"><div className="dim"><input type="number" value={f.fd ?? ""} onChange={set("fd")} /><span>{f.dimUnit}</span></div></L>
        </>}
        <div className="form-section gridfull">Custody &amp; status</div>
        <L label="Declared value"><div className="dim"><input type="number" value={f.value ?? ""} onChange={set("value")} /><span>{f.ccy}</span></div></L>
        <L label="Insurance"><label className="check"><input type="checkbox" checked={!!f.insuredByUs} onChange={e => setF({ ...f, insuredByUs: e.target.checked })} /> Insured through us</label></L>
        {!prov && <>
          <L label="Package"><select value={f.packageId || ""} onChange={e => setF({ ...f, packageId: e.target.value || null })}><option value="">Loose (uncrated)</option>{packages.map(k => <option key={k.id} value={k.id}>{k.ref} — {k.type}</option>)}</select></L>
          <L label="Status"><select value={f.status} onChange={set("status")}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></L>
          <L label="Location"><select value={f.locationId || ""} onChange={set("locationId")}><option value="">—</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></L>
        </>}
        <L label="Customs status"><select value={f.customs} onChange={set("customs")}>{CUSTOMS.map(c => <option key={c}>{c}</option>)}</select></L>
        <L label="Customs reference"><input value={f.customsRef || ""} onChange={set("customsRef")} /></L>
        <L label="Carnet / TA expiry"><input type="date" value={f.customsExpiry || ""} onChange={set("customsExpiry")} /></L>
        <L label="Condition"><select value={f.condition} onChange={set("condition")}>{["Excellent", "Good", "Fair", "Poor", "Under treatment"].map(c => <option key={c}>{c}</option>)}</select></L>
        <L label="Condition note" full><input value={f.conditionNote || ""} onChange={set("conditionNote")} /></L>
        <L label="Tags (comma-separated)" full><input value={f.tags || ""} onChange={set("tags")} placeholder="high-value, fragile, loan" /></L>
      </div>
      {prov && <div className="prov-note"><FileText size={14} /> Provisional records have no location or package until they are confirmed into custody.</div>}
      <div className="comp-editor">
        <div className="ce-head"><Layers size={14} /> Components <button className="link-btn" onClick={() => setComps([...comps, { id: uid(), name: "", status: "In stock", note: "" }])}>+ add</button></div>
        {comps.map(c => (
          <div className="ce-row" key={c.id}>
            <input placeholder="Component name" value={c.name} onChange={e => setComps(comps.map(x => x.id === c.id ? { ...x, name: e.target.value } : x))} />
            <input placeholder="Note" value={c.note} onChange={e => setComps(comps.map(x => x.id === c.id ? { ...x, note: e.target.value } : x))} />
            <button className="icon-btn sm" onClick={() => setComps(comps.filter(x => x.id !== c.id))}><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
      <ModalFoot onClose={onClose} onSave={submit} saveLabel={f.id ? "Save changes" : "Register object"} />
    </Modal>
  );
}


export function PackagesView({ packages, objects, clientById, locById, spaceById, focusId, onNew, onEdit, onMove, onLabel, onSelectObj, onTab }) {
  const pathOf = (id) => { const parts = []; let cur = spaceById[id]; let g = 0; while (cur && g++ < 8) { parts.unshift(cur.name); cur = cur.parentId ? spaceById[cur.parentId] : null; } return parts.join(" › "); };
  useEffect(() => { if (focusId) { const el = document.getElementById("pkgcard-" + focusId); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); } }, [focusId]);
  return (
    <div>
      <div className="seg seg-tabs"><button className="seg-btn" onClick={() => onTab("objects")}>Objects</button><button className="seg-btn on">Packages</button></div>
      <div className="toolbar"><div className="pkg-intro">Packages are part of object management — group objects into crates and cases here, or assign an object's package on its own record.</div><div className="spacer" /><button className="btn btn-primary" onClick={onNew}><Plus size={16} />New package</button></div>
      <div className="card-grid">
        {packages.map(k => {
          const contents = objects.filter(o => o.packageId === k.id);
          const v = volM3(k.h, k.w, k.d); const du = daysUntil(k.customsExpiry);
          return (
            <div className={"card pkg-card" + (k.id === focusId ? " card-focus" : "")} id={"pkgcard-" + k.id} key={k.id}>
              <div className="card-head"><span className="pkg-ref mono">{k.ref}</span><div className="pkg-acts"><button className="icon-btn sm" title="Print label" onClick={() => onLabel(k)}><QrCode size={14} /></button><button className="icon-btn sm" onClick={() => onEdit(k)}><Edit3 size={13} /></button></div></div>
              <div className="card-title">{k.type}</div>
              <div className="pkg-meta"><Chip status={k.status} /><span className="pkg-vol">{fmtVol(v)}</span></div>
              <div className="card-sub">{clientById[k.clientId]?.name || "—"} · {locById[k.locationId]?.name || "—"}</div>
              {k.positionId && spaceById[k.positionId] && <div className="pkg-pos"><LayoutGrid size={11} /> {pathOf(k.positionId)}</div>}
              {k.customsExpiry && <div className={"pkg-carnet " + (du < 0 ? "expired" : du <= 30 ? "soon" : "")}>{k.customs} {k.customsRef}{du != null ? (du < 0 ? " · expired" : ` · ${du}d`) : ""}</div>}
              <div className="pkg-contents">
                <div className="cc-head"><Boxes size={13} /> Objects inside: {contents.length}</div>
                {contents.map(o => <button key={o.id} className="cc-item" onClick={() => onSelectObj(o.id)}>{o.title} <span className="mono">{o.ref}</span></button>)}
                {contents.length === 0 && <div className="cc-empty">Empty — volume still occupies the account</div>}
              </div>
              <button className="btn btn-ghost pkg-move" onClick={() => onMove(k)}><ArrowLeftRight size={13} />Move package</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export function PackageForm({ initial, clients, locations, spaces, onClose, onSave }) {
  const [f, setF] = useState({ type: "Crate", status: "In stock", customs: "Free Zone", positionId: null, ...initial });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const v = volM3(f.h, f.w, f.d);
  const byId = Object.fromEntries((spaces || []).map(s => [s.id, s]));
  const pathOf = (id) => { const parts = []; let cur = byId[id]; let guard = 0; while (cur && guard++ < 8) { parts.unshift(cur.name); cur = cur.parentId ? byId[cur.parentId] : null; } return parts.join(" › "); };
  const slots = (spaces || []).filter(s => s.kind === "module" || s.kind === "receive" || s.kind === "release");
  return (
    <Modal title={f.id ? `Edit ${f.ref}` : "New package"} onClose={onClose}>
      <div className="form-grid">
        <L label="Reference"><input className="mono" value={f.ref || ""} onChange={set("ref")} placeholder="PKG-…" /></L>
        <L label="Type"><select value={f.type} onChange={set("type")}>{PACKAGE_TYPES.map(t => <option key={t}>{t}</option>)}</select></L>
        <L label="Account"><select value={f.clientId || ""} onChange={set("clientId")}><option value="">—</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></L>
        <L label="Location"><select value={f.locationId || ""} onChange={set("locationId")}><option value="">—</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></L>
        <L label="Position (mapped slot)" full><select value={f.positionId || ""} onChange={e => setF({ ...f, positionId: e.target.value || null })}><option value="">Unassigned</option>{slots.map(m => <option key={m.id} value={m.id}>{pathOf(m.id)}</option>)}{slots.length === 0 && <option disabled>No slots mapped yet — see Locations</option>}</select></L>
        <L label="Height"><div className="dim"><input type="number" value={f.h ?? ""} onChange={set("h")} /><span>cm</span></div></L>
        <L label="Width"><div className="dim"><input type="number" value={f.w ?? ""} onChange={set("w")} /><span>cm</span></div></L>
        <L label="Depth"><div className="dim"><input type="number" value={f.d ?? ""} onChange={set("d")} /><span>cm</span></div></L>
        <L label="Volume"><div className="readout">{fmtVol(v)}</div></L>
        <L label="Status"><select value={f.status} onChange={set("status")}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></L>
        <L label="Customs status"><select value={f.customs} onChange={set("customs")}>{CUSTOMS.map(c => <option key={c}>{c}</option>)}</select></L>
        <L label="Customs / carnet ref"><input value={f.customsRef || ""} onChange={set("customsRef")} /></L>
        <L label="Carnet / TA expiry"><input type="date" value={f.customsExpiry || ""} onChange={set("customsExpiry")} /></L>
        <L label="Notes" full><input value={f.notes || ""} onChange={set("notes")} /></L>
      </div>
      <ModalFoot onClose={onClose} onSave={() => f.ref && f.clientId && onSave(f)} saveLabel={f.id ? "Save changes" : "Create package"} />
    </Modal>
  );
}


export function MovementsView({ movements, objects, packages, locById, onNew }) {
  const [tab, setTab] = useState("all");
  const objById = Object.fromEntries(objects.map(o => [o.id, o]));
  const pkgById = Object.fromEntries(packages.map(k => [k.id, k]));
  const sorted = [...movements].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const subjLabel = (m) => m.subjectType === "Package" ? `Package ${pkgById[m.subjectId]?.ref || ""}` : m.subjectType === "Component" ? `Component · ${objById[m.objectId]?.title || ""}` : (objById[m.subjectId]?.title || "—");

  const isCons = (t) => t === "To Conservator" || t === "From Conservator";
  const matchTab = (m) => tab === "all" ? true : tab === "Conservation" ? isCons(m.type) : m.type === tab;
  const filtered = sorted.filter(matchTab);
  const now = Date.now();
  const last30 = movements.filter(m => { const d = new Date(m.date); return !isNaN(d) && (now - d.getTime()) <= 30 * 864e5; }).length;
  const countType = (t) => movements.filter(m => m.type === t).length;
  const tabs = [["all", "All"], ["Intake", "Intake"], ["Internal Move", "Internal"], ["Outbound", "Outbound"], ["Conservation", "Conservation"], ["Return", "Return"]];

  return (
    <div className="dash">
      <div className="stat-row">
        <Stat icon={ArrowLeftRight} label="Total movements" value={movements.length} accent />
        <Stat icon={ClipboardCheck} label="Intakes logged" value={countType("Intake")} />
        <Stat icon={Truck} label="Outbound" value={countType("Outbound")} />
        <Stat icon={Clock} label="Last 30 days" value={last30} />
      </div>

      <div className="toolbar">
        <div className="seg seg-tabs">{tabs.map(([v, lbl]) => <button key={v} className={"seg-btn" + (tab === v ? " on" : "")} onClick={() => setTab(v)}>{lbl}</button>)}</div>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={onNew}><Plus size={16} />Record movement</button>
      </div>

      <section className="panel">
        <div className="panel-head"><h2>Chain of custody</h2><span className="muted">{filtered.length}</span></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Date</th><th>Type</th><th>Subject</th><th>From</th><th>To</th><th>Handled by</th><th>Job ref</th><th>Cond.</th></tr></thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="no-hover"><td className="mono">{fmtDate(m.date)}</td><td><span className="dot" />{m.type}</td>
                <td><span className="subj-type">{m.subjectType}</span> {subjLabel(m)}</td><td className="cell-sub">{locById[m.fromId]?.name || "—"}</td><td className="cell-sub">{locById[m.toId]?.name || "—"}</td>
                <td>{m.handledBy}</td><td className="mono">{m.ref || "—"}</td><td>{m.conditionChecked ? <span className="ok"><ShieldCheck size={13} /></span> : <span className="muted">—</span>}</td></tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="empty-row">No movements in this view.</td></tr>}
          </tbody>
        </table></div>
      </section>
    </div>
  );
}


export function MovementForm({ initial, objects, packages, locations, pkgById, onClose, onSave }) {
  const [f, setF] = useState({ subjectType: "Object", subjectId: "", objectId: "", type: "Internal Move", date: new Date().toISOString().slice(0, 10), fromId: "", toId: "", toContainerId: "", cascade: true, handledBy: "", conditionChecked: true, note: "", ref: "", ...initial });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const subjObj = objects.find(o => o.id === f.subjectId);
  const subjComps = f.subjectType === "Component" ? (objects.find(o => o.id === f.objectId)?.components || []) : [];
  const custodial = objects.filter(inCustody);
  const valid = f.subjectType === "Package" ? (f.subjectId && f.toId) : f.subjectType === "Object" ? (f.subjectId && (f.toId || f.toContainerId)) : (f.objectId && f.subjectId);
  return (
    <Modal title="Record movement" wide onClose={onClose}>
      <div className="seg">{["Object", "Package", "Component"].map(s => <button key={s} className={"seg-btn" + (f.subjectType === s ? " on" : "")} onClick={() => setF({ ...f, subjectType: s, subjectId: "", objectId: "", toContainerId: "" })}>{s}</button>)}</div>
      <div className="form-grid">
        {f.subjectType === "Package" && <>
          <L label="Package *"><select value={f.subjectId} onChange={e => { const k = pkgById[e.target.value]; setF({ ...f, subjectId: e.target.value, fromId: k?.locationId || "" }); }}><option value="">—</option>{packages.map(k => <option key={k.id} value={k.id}>{k.ref} — {k.type}</option>)}</select></L>
          <L label="Move to location *"><select value={f.toId} onChange={set("toId")}><option value="">—</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></L>
          <L label="Contents"><label className="check"><input type="checkbox" checked={f.cascade} onChange={e => setF({ ...f, cascade: e.target.checked })} /> Move all contained objects with it</label></L>
        </>}
        {f.subjectType === "Object" && <>
          <L label="Object *"><select value={f.subjectId} onChange={e => { const o = objects.find(x => x.id === e.target.value); setF({ ...f, subjectId: e.target.value, fromId: o?.locationId || "", fromContainerId: o?.packageId || "" }); }}><option value="">—</option>{custodial.map(o => <option key={o.id} value={o.id}>{o.ref} — {o.title}</option>)}</select></L>
          <L label="Into package"><select value={f.toContainerId} onChange={set("toContainerId")}><option value="">Keep current{subjObj?.packageId ? ` (${pkgById[subjObj.packageId]?.ref})` : ""}</option><option value="LOOSE">Remove from package (loose)</option>{packages.map(k => <option key={k.id} value={k.id}>{k.ref} — {k.type}</option>)}</select></L>
          <L label="Move to location"><select value={f.toId} onChange={set("toId")}><option value="">{f.toContainerId && f.toContainerId !== "LOOSE" ? "Follow package's location" : "—"}</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></L>
        </>}
        {f.subjectType === "Component" && <>
          <L label="Parent object *"><select value={f.objectId} onChange={e => setF({ ...f, objectId: e.target.value, subjectId: "" })}><option value="">—</option>{objects.filter(o => o.components?.length).map(o => <option key={o.id} value={o.id}>{o.ref} — {o.title}</option>)}</select></L>
          <L label="Component *"><select value={f.subjectId} onChange={set("subjectId")}><option value="">—</option>{subjComps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></L>
          <L label="Move to location"><select value={f.toId} onChange={set("toId")}><option value="">—</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></L>
        </>}
        <L label="Type"><select value={f.type} onChange={set("type")}>{MOVE_TYPES.map(t => <option key={t}>{t}</option>)}</select></L>
        <L label="Date"><input type="date" value={f.date} onChange={set("date")} /></L>
        <L label="Handled by"><input value={f.handledBy} onChange={set("handledBy")} placeholder="Staff name" /></L>
        <L label="Job / project ref"><input value={f.ref} onChange={set("ref")} placeholder="JOB-2025-…" /></L>
        <L label="Condition checked"><label className="check"><input type="checkbox" checked={f.conditionChecked} onChange={e => setF({ ...f, conditionChecked: e.target.checked })} /> Condition verified this leg</label></L>
        <L label="Note" full><input value={f.note} onChange={set("note")} /></L>
      </div>
      {f.subjectType === "Object" && f.toContainerId === "LOOSE" && <div className="note-callout"><Gauge size={14} /> Removing this object leaves its package in place — the account's stored volume is unchanged.</div>}
      <ModalFoot onClose={onClose} onSave={() => valid && onSave(f)} saveLabel="Log movement" />
    </Modal>
  );
}


export function ConfirmIntakeForm({ object, locations, packages, onClose, onSave }) {
  const [f, setF] = useState({ locationId: "", packageId: "", date: new Date().toISOString().slice(0, 10), handledBy: "", ref: "", note: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title="Confirm into care & custody" onClose={onClose}>
      <div className="confirm-head"><CheckCircle2 size={18} className="ic-gold" /><div>{object?.title} <span className="mono">{object?.ref}</span><div className="muted">Quotation booked — receive this object physically and log the intake.</div></div></div>
      <div className="form-grid">
        <L label="Location *"><select value={f.locationId} onChange={set("locationId")}><option value="">—</option>{locations.filter(l => l.type !== "In Transit").map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></L>
        <L label="Package"><select value={f.packageId} onChange={set("packageId")}><option value="">Loose (uncrated)</option>{packages.map(k => <option key={k.id} value={k.id}>{k.ref} — {k.type}</option>)}</select></L>
        <L label="Date"><input type="date" value={f.date} onChange={set("date")} /></L>
        <L label="Received by"><input value={f.handledBy} onChange={set("handledBy")} /></L>
        <L label="Job ref"><input value={f.ref} onChange={set("ref")} placeholder="JOB-2025-…" /></L>
        <L label="Note" full><input value={f.note} onChange={set("note")} /></L>
      </div>
      <ModalFoot onClose={onClose} onSave={() => f.locationId && onSave(f)} saveLabel="Confirm intake" />
    </Modal>
  );
}


export function storageCharge(a) {
  const r = Number(a.rate) || 0;
  if (a.basis === "Volume (m³)") return (Number(a.volume) || 0) * r;
  if (a.basis === "Area (m²)") return (Number(a.area) || 0) * r;
  if (a.basis === "Pallet/position") return (Number(a.positions) || 0) * r;
  return r; // Fixed
}


export function storageBasisLabel(a) {
  const r = fmtMoney(a.rate, a.currency);
  if (a.basis === "Volume (m³)") return `${(Number(a.volume) || 0).toFixed(1)} m³ × ${r}`;
  if (a.basis === "Area (m²)") return `${Number(a.area) || 0} m² × ${r}`;
  if (a.basis === "Pallet/position") return `${Number(a.positions) || 0} pos × ${r}`;
  return "Fixed " + r;
}


export function StorageAccountsView({ accounts, clients, locations, objects, packages, onNew, onEdit, onSave }) {
  const [tab, setTab] = useState("Active");
  const clientById = Object.fromEntries(clients.map(c => [c.id, c]));
  const locById = Object.fromEntries(locations.map(l => [l.id, l]));
  const tabs = ["Active", "On hold", "Closed", "All"];
  const shown = accounts.filter(a => tab === "All" ? true : a.status === tab);
  // per-period revenue by currency (active only)
  const rev = {};
  accounts.filter(a => a.status === "Active").forEach(a => { const c = a.currency || "AED"; const per = storageCharge(a); const ins = a.insuranceIncluded ? 0 : 0; rev[c] = (rev[c] || 0) + per; });
  const revRows = Object.entries(rev).map(([ccy, amt]) => ({ ccy, amt }));
  const primary = revRows[0] || { ccy: "AED", amt: 0 };
  const monthlyEquiv = (a) => storageCharge(a) * (periodsPerYear(a.freq) / 12);
  return (
    <div className="dash">
      <div className="toolbar"><div className="seg seg-tabs">{tabs.map(t => <button key={t} className={"seg-btn" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>{t}</button>)}</div><div className="spacer" /><button className="btn btn-primary" onClick={onNew}><Plus size={16} />Register storage account</button></div>
      <div className="stat-row">
        <Stat icon={Receipt} label="Active accounts" value={accounts.filter(a => a.status === "Active").length} accent />
        <Stat icon={Banknote} label="Recurring / period" value={fmtMoney(primary.amt, primary.ccy)} small />
        <Stat icon={Gauge} label="Monthly-equiv." value={fmtMoney(accounts.filter(a => a.status === "Active").reduce((s, a) => s + monthlyEquiv(a), 0), primary.ccy)} small />
        <Stat icon={Users} label="Linked customers" value={new Set(accounts.filter(a => a.clientId).map(a => a.clientId)).size} />
      </div>
      <div className="explainer"><Receipt size={16} /><div><strong>Each storage account belongs to a customer but is managed separately.</strong> A customer must exist before an account can be opened; the account then carries its own ID and its own tariff — basis (volume, area, pallet position or fixed), rate and frequency — run here, independent of that customer's commercial terms.</div></div>
      <section className="panel">
        <div className="panel-head"><h2>Storage accounts</h2><span className="muted">{shown.length}</span></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Ref</th><th>Account</th><th>Linked customer</th><th>Basis</th><th>Tariff</th><th>Frequency</th><th className="ta-r">Per period</th><th>Status</th></tr></thead>
          <tbody>{shown.length === 0 ? <tr><td colSpan={8} className="empty-row">No storage accounts in this view. Register one to begin.</td></tr>
            : shown.map(a => { const cl = clientById[a.clientId]; return (
              <tr key={a.id} onClick={() => onEdit(a)} style={{cursor:"pointer"}}>
                <td className="mono sm">{a.ref}</td>
                <td className="cell-title">{a.name}{a.locationId && locById[a.locationId] ? <div className="cell-sub">{locById[a.locationId].name}</div> : null}</td>
                <td className="cell-sub">{cl ? cl.name : <span className="muted">— unlinked —</span>}</td>
                <td><span className="tariff-tag">{a.basis}</span></td>
                <td className="cell-sub">{storageBasisLabel(a)}</td>
                <td className="cell-sub">{a.freq}</td>
                <td className="ta-r mono strong">{fmtMoney(storageCharge(a), a.currency)}<div className="cell-sub">/ {(a.freq || "").toLowerCase()}</div></td>
                <td><Pill label={a.status} tone={SASTATUS_TONE[a.status]} /></td>
              </tr>
            ); })}</tbody>
        </table></div>
      </section>
    </div>
  );
}


export function StorageAccountForm({ initial, clients, locations, accounts, onSave, onClose }) {
  const nextRef = () => { const n = accounts.reduce((m, a) => { const num = parseInt(String(a.ref || "").replace(/\D/g, ""), 10); return isNaN(num) ? m : Math.max(m, num); }, 0) + 1; return "STO-" + String(n).padStart(3, "0"); };
  const [f, setF] = useState(() => ({ ref: nextRef(), name: "", clientId: "", status: "Active", basis: "Volume (m³)", rate: 0, freq: "Monthly", currency: "AED", volume: 0, area: 0, positions: 0, insuranceIncluded: true, insuranceRatePct: 0, locationId: "", startDate: new Date().toISOString().slice(0, 10), notes: "", quickVol: "", quickWeight: "", ...initial }));
  const set = (k, v) => setF({ ...f, [k]: v });
  const valid = f.name.trim() && f.basis && f.freq && f.clientId;
  return (
    <Modal title={f.id ? `Edit ${f.ref}` : "Register storage account"} onClose={onClose} wide>
      <div className="form-grid">
        <L label="Reference"><input value={f.ref} onChange={e => set("ref", e.target.value)} /></L>
        <L label="Account name"><input value={f.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Haas Collection — climate vault" /></L>
        <L label="Customer (required)"><select value={f.clientId} onChange={e => set("clientId", e.target.value)}><option value="">— select a customer —</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></L>
        <L label="Status"><select value={f.status} onChange={e => set("status", e.target.value)}>{SACCT_STATUS.map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Location"><select value={f.locationId} onChange={e => set("locationId", e.target.value)}><option value="">— unassigned —</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></L>
        <L label="Start date"><input type="date" value={f.startDate} onChange={e => set("startDate", e.target.value)} /></L>
      </div>
      <div className="est-h"><span className="est-h-no">$</span>Billing parameters</div>
      <div className="form-grid">
        <L label="Billing basis"><select value={f.basis} onChange={e => set("basis", e.target.value)}>{STORAGE_BASIS.map(x => <option key={x}>{x}</option>)}</select></L>
        <L label="Rate (per unit)"><input type="number" value={f.rate} onChange={e => set("rate", e.target.value)} /></L>
        <L label="Currency"><input value={f.currency} onChange={e => set("currency", e.target.value)} /></L>
        <L label="Frequency"><select value={f.freq} onChange={e => set("freq", e.target.value)}>{STORAGE_FREQ.map(x => <option key={x}>{x}</option>)}</select></L>
        {f.basis === "Volume (m³)" && <L label="Volume (m³)"><input type="number" value={f.volume} onChange={e => set("volume", e.target.value)} /></L>}
        {f.basis === "Area (m²)" && <L label="Area (m²)"><input type="number" value={f.area} onChange={e => set("area", e.target.value)} /></L>}
        {f.basis === "Pallet/position" && <L label="Positions"><input type="number" value={f.positions} onChange={e => set("positions", e.target.value)} /></L>}
      </div>
      <div className="form-grid">
        <L label="Insurance included"><select value={f.insuranceIncluded ? "yes" : "no"} onChange={e => set("insuranceIncluded", e.target.value === "yes")}><option value="yes">Included in tariff</option><option value="no">Billed separately</option></select></L>
        {!f.insuranceIncluded && <L label="Insurance rate (% of value / period)"><input type="number" step="0.01" value={f.insuranceRatePct} onChange={e => set("insuranceRatePct", e.target.value)} /></L>}
        <L label="Notes" full><textarea rows={2} value={f.notes} onChange={e => set("notes", e.target.value)} /></L>
      </div>
      {!f.clientId && <div className="sacct-warn">A storage account must be linked to an existing customer. {clients.length === 0 ? "Create a customer first under CRM → Customers." : "Select the customer this account belongs to above."}</div>}
      <div className="sacct-preview">Account ID: <strong>{f.ref}</strong> · Charge: <strong>{fmtMoney(storageCharge(f), f.currency)}</strong> / {f.freq.toLowerCase()} <span className="muted">· {storageBasisLabel(f)}</span></div>
      <ModalFoot onClose={onClose} onSave={() => valid && onSave(f)} saveLabel={f.id ? "Save changes" : "Register account"} />
    </Modal>
  );
}


export function StorageView({ clients, locations, packages, objects }) {
  const accountRows = clients.map(c => {
    const pkgs = packages.filter(k => k.clientId === c.id && k.status === "In stock");
    const loose = objects.filter(o => o.clientId === c.id && isStocked(o) && !o.packageId);
    const vol = pkgs.reduce((s, k) => s + volM3(k.h, k.w, k.d), 0) + loose.reduce((s, o) => s + objVolM3(o), 0);
    const stockedHere = objects.filter(o => o.clientId === c.id && isStocked(o));
    const storedVal = stockedHere.reduce((s, o) => s + (Number(o.value) || 0), 0);
    const insuredVal = stockedHere.filter(o => o.insuredByUs).reduce((s, o) => s + (Number(o.value) || 0), 0);
    let storage = 0, basis = "";
    if (c.billingModel === "Volume") { storage = vol * (c.rate || 0); basis = `${vol.toFixed(2)} m³ × ${fmtMoney(c.rate, c.currency)}`; }
    else if (c.billingModel === "Area") { storage = (c.areaAllocated || 0) * (c.rate || 0); basis = `${c.areaAllocated || 0} m² × ${fmtMoney(c.rate, c.currency)}`; }
    else { storage = c.rate || 0; basis = "Fixed lump sum"; }
    const annualIns = c.insuranceIncluded ? 0 : insuredVal * ((c.insuranceRatePct || 0) / 100);
    const insPerPeriod = annualIns / periodsPerYear(c.ratePeriod);
    return { c, vol, storedVal, insuredVal, storage, basis, insPerPeriod, total: storage + insPerPeriod };
  });

  const locRows = locations.filter(l => l.type !== "In Transit").map(l => {
    const used = packages.filter(k => k.locationId === l.id && k.status === "In stock").reduce((s, k) => s + volM3(k.h, k.w, k.d), 0) + objects.filter(o => o.locationId === l.id && isStocked(o) && !o.packageId).reduce((s, o) => s + objVolM3(o), 0);
    const util = l.capacity ? Math.min(100, (used / l.capacity) * 100) : null;
    return { l, used, util };
  });

  const totalVol = locRows.reduce((s, r) => s + r.used, 0);
  const pkgInStore = packages.filter(k => k.status === "In stock").length;
  const revByCcy = {};
  accountRows.forEach(r => { const c = r.c.currency || "AED"; revByCcy[c] = (revByCcy[c] || 0) + r.total; });
  const ccyRows = Object.entries(revByCcy).map(([ccy, amt]) => ({ ccy, amt })).sort((a, b) => b.amt - a.amt);
  const primary = ccyRows[0] || { ccy: "AED", amt: 0 };
  const facPct = (r) => r.util != null ? Math.round(r.util) : null;
  const utilFacilities = locRows.filter(r => r.l.capacity).sort((a, b) => (b.util || 0) - (a.util || 0));

  return (
    <div className="dash">
      <div className="stat-row">
        <Stat icon={Users} label="Accounts on tariff" value={accountRows.length} accent />
        <Stat icon={Boxes} label="Packages in store" value={pkgInStore} />
        <Stat icon={Gauge} label="Total stored volume" value={fmtVol(totalVol)} small />
        <Stat icon={Receipt} label="Revenue / period" value={fmtMoney(primary.amt, primary.ccy)} small />
      </div>

      <div className="explainer"><Gauge size={16} /><div><strong>Volume is measured at the package layer.</strong> Stored volume per account = the volume of that account's packages plus any loose (uncrated) objects in custody. Removing an object from a package does not reduce stored volume — the package still occupies the warehouse. Charges below are computed from each account's tariff and feed the future quote-to-invoice module.</div></div>

      <section className="panel">
        <div className="panel-head"><h2>Storage charges by account</h2><span className="muted">{accountRows.length}</span></div>
            <table className="data-table inline-table">
              <thead><tr><th>Account</th><th>Tariff</th><th className="ta-r">Stored value</th><th className="ta-r">Insured by us</th><th className="ta-r">Storage</th><th className="ta-r">Insurance</th><th className="ta-r">Per period</th></tr></thead>
              <tbody>{accountRows.map(r => (
                <tr key={r.c.id} className="no-hover">
                  <td className="cell-title">{r.c.name}<div className="cell-sub">{r.basis}</div></td>
                  <td><span className="tariff-tag">{r.c.billingModel}</span> <span className="cell-sub">/ {r.c.ratePeriod}</span></td>
                  <td className="ta-r mono">{fmtMoney(r.storedVal, r.c.currency)}</td>
                  <td className="ta-r mono">{r.insuredVal ? fmtMoney(r.insuredVal, r.c.currency) : <span className="cell-sub">none</span>}</td>
                  <td className="ta-r mono">{fmtMoney(r.storage, r.c.currency)}</td>
                  <td className="ta-r mono">{r.c.insuranceIncluded ? <span className="cell-sub">included</span> : fmtMoney(r.insPerPeriod, r.c.currency)}</td>
                  <td className="ta-r mono strong">{fmtMoney(r.total, r.c.currency)}<div className="cell-sub">/ {r.c.ratePeriod.toLowerCase()}</div></td>
                </tr>
              ))}</tbody>
            </table>
      </section>

      <div className="storage-rail">
          <section className="panel panel-dark rail-card">
            <div className="panel-head"><h2>Recurring revenue</h2></div>
            <div className="vp-label">Per period · {primary.ccy}</div>
            <div className="big-value">{fmtMoney(primary.amt, primary.ccy)}</div>
            {ccyRows.length > 1 && <div className="rev-ccy-list">{ccyRows.slice(1).map(r => (
              <div className="rail-insured" key={r.ccy}><span className="vp-label">{r.ccy}</span><span className="vp-num">{fmtMoney(r.amt, r.ccy)}</span></div>
            ))}</div>}
            <div className="vp-sub">{accountRows.length} account{accountRows.length === 1 ? "" : "s"} across {ccyRows.length} currenc{ccyRows.length === 1 ? "y" : "ies"}</div>
          </section>

          <section className="panel panel-dark rail-card">
            <div className="panel-head"><h2>Facility utilisation</h2></div>
            <div className="util-mini">
              {utilFacilities.length === 0 && <div className="vp-sub">No capacity set on facilities yet.</div>}
              {utilFacilities.map(r => (
                <div className="um-row" key={r.l.id}>
                  <div className="um-top"><span className="um-name">{r.l.name.split(" — ")[0]}</span><span className="um-pct">{facPct(r)}%</span></div>
                  <div className="um-track"><div className="um-fill" style={{ width: `${facPct(r)}%` }} /></div>
                  <div className="um-sub">{fmtVol(r.used)} / {r.l.capacity} m³</div>
                </div>
              ))}
            </div>
          </section>
      </div>
    </div>
  );
}


export function IntakeView({ clients, locations, packages, onCreate }) {
  const [stage, setStage] = useState("drop");
  const [drafts, setDrafts] = useState([]);
  const [err, setErr] = useState("");
  const [pasted, setPasted] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [assignClient, setAssignClient] = useState("");
  const [assignLoc, setAssignLoc] = useState("");
  const [assignPkg, setAssignPkg] = useState("");
  const [custody, setCustody] = useState("Provisional");
  const [createdN, setCreatedN] = useState(0);

  const run = async ({ text, fileData, mediaType, kind, name }) => {
    setStage("working"); setErr(""); setSourceName(name || "pasted text");
    try {
      const sys = "You are an inventory data-extraction assistant for an art logistics firm. Read the provided source (a messy spreadsheet export, a PDF packing/inventory list, or an email) and extract individual artwork/object records. Return ONLY a JSON array, no prose and no markdown code fences. Each element must have: title, artist, year, category, medium, h, w, d, weight, value, ccy, edition, condition, customsRef, notes. 'category' must be one of: Painting, Sculpture, Work on Paper, Photograph, Furniture, Antiquity, Decorative Art, Installation, Other. h/w/d are dimensions in centimetres as numbers (null if unknown). weight in kg or null. value numeric or null. ccy is a 3-letter code (default AED). Map non-standard or messy column headings sensibly. Extract every distinct object you can identify.";
      const content = [];
      if (fileData) content.push({ type: kind === "image" ? "image" : "document", source: { type: "base64", media_type: mediaType, data: fileData } });
      content.push({ type: "text", text: (text ? "Source data:\n" + text + "\n\n" : "") + "Extract the inventory records as a JSON array now." });
      const arr = await callAI(sys, content, 1000);
      setDrafts((Array.isArray(arr) ? arr : []).map(r => ({ ...r, _id: uid(), _on: true }))); setStage("review");
    } catch (ex) { setErr("Couldn't extract records — " + (ex.message || ex) + ". Try a clearer source, or paste the list as text."); setStage("drop"); }
  };
  const toB64 = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(file); });
  const onFile = async (file) => {
    if (!file) return; const lower = file.name.toLowerCase();
    try {
      if (/\.(csv|tsv|txt)$/.test(lower)) run({ text: await file.text(), name: file.name });
      else if (/\.(xlsx|xls)$/.test(lower)) { const wb = XLSX.read(await file.arrayBuffer(), { type: "array" }); run({ text: wb.SheetNames.map(n => XLSX.utils.sheet_to_csv(wb.Sheets[n])).join("\n"), name: file.name }); }
      else if (lower.endsWith(".pdf")) run({ fileData: await toB64(file), mediaType: "application/pdf", kind: "doc", name: file.name });
      else if (/\.(png|jpe?g|gif|webp)$/.test(lower)) run({ fileData: await toB64(file), mediaType: file.type || "image/png", kind: "image", name: file.name });
      else setErr("Unsupported file type. Use PDF, Excel, CSV, an image, or paste text.");
    } catch (ex) { setErr("Couldn't read the file — " + (ex.message || ex)); }
  };
  const create = () => { setCreatedN(onCreate(drafts.filter(d => d._on), assignClient, assignLoc, assignPkg || null, custody)); setStage("done"); };
  const reset = () => { setStage("drop"); setDrafts([]); setErr(""); setPasted(""); setCreatedN(0); setAssignPkg(""); };

  if (stage === "working") return <div className="intake-center"><div className="spinner" /><div className="intake-status">Reading <strong>{sourceName}</strong> and drafting inventory records…</div></div>;
  if (stage === "done") return <div className="intake-center"><div className="done-ic"><Check size={26} /></div><h2 className="done-h">{createdN} object{createdN === 1 ? "" : "s"} created</h2><p className="muted">Added as {custody === "Provisional" ? "provisional (quotation-stage) records" : "in-custody records"} to {clients.find(c => c.id === assignClient)?.name || "the account"}. Review under Objects.</p><button className="btn btn-primary" onClick={reset}>Intake another source</button></div>;

  if (stage === "review") return (
    <div>
      <div className="review-bar">
        <div className="rb-left"><Sparkles size={16} /> <strong>{drafts.length}</strong> records extracted from {sourceName}</div>
        <div className="rb-right">
          <select value={custody} onChange={e => setCustody(e.target.value)}><option value="Provisional">Provisional (quote)</option><option value="In custody">In custody (received)</option></select>
          <select value={assignClient} onChange={e => setAssignClient(e.target.value)}><option value="">Account…</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select value={assignLoc} onChange={e => setAssignLoc(e.target.value)} disabled={custody === "Provisional"}><option value="">Location…</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
          <select value={assignPkg} onChange={e => setAssignPkg(e.target.value)} disabled={custody === "Provisional"}><option value="">Loose</option>{packages.map(k => <option key={k.id} value={k.id}>{k.ref}</option>)}</select>
          <button className="btn btn-primary" disabled={!assignClient || (custody === "In custody" && !assignLoc) || !drafts.some(d => d._on)} onClick={create}><Check size={15} />Create {drafts.filter(d => d._on).length}</button>
        </div>
      </div>
      <section className="panel">
      <div className="panel-head"><h2>Extracted records</h2><span className="muted">{drafts.filter(d => d._on).length} of {drafts.length} selected</span></div>
      <div className="table-wrap"><table className="data-table draft-table">
        <thead><tr><th>Use</th><th>Title</th><th>Artist</th><th>Category</th><th>Medium</th><th>H×W×D</th><th className="ta-r">Value</th><th></th></tr></thead>
        <tbody>{drafts.map(d => (
          <tr key={d._id} className={"no-hover" + (d._on ? "" : " off")}>
            <td><input type="checkbox" checked={d._on} onChange={e => setDrafts(drafts.map(x => x._id === d._id ? { ...x, _on: e.target.checked } : x))} /></td>
            <td><input className="cell-input" value={d.title || ""} onChange={e => setDrafts(drafts.map(x => x._id === d._id ? { ...x, title: e.target.value } : x))} /></td>
            <td><input className="cell-input" value={d.artist || ""} onChange={e => setDrafts(drafts.map(x => x._id === d._id ? { ...x, artist: e.target.value } : x))} /></td>
            <td><select className="cell-input" value={CATEGORIES.includes(d.category) ? d.category : "Other"} onChange={e => setDrafts(drafts.map(x => x._id === d._id ? { ...x, category: e.target.value } : x))}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></td>
            <td className="cell-sub">{d.medium || "—"}</td><td className="mono cell-sub">{[d.h, d.w, d.d].filter(Boolean).join("×") || "—"}</td>
            <td className="ta-r mono">{d.value ? fmtMoney(d.value, d.ccy) : "—"}</td>
            <td className="ta-r"><button className="icon-btn sm" onClick={() => setDrafts(drafts.filter(x => x._id !== d._id))}><Trash2 size={13} /></button></td>
          </tr>
        ))}</tbody>
      </table></div>
      </section>
      <div className="result-count"><button className="link-btn" onClick={reset}>Cancel and start over</button></div>
    </div>
  );

  return (
    <div>
      <div className="intake-hero">
        <TopoArt className="topo-dark" />
        <div className="intake-hero-body">
          <span className="intake-badge"><Sparkles size={13} /> AI-powered intake</span>
          <h1 className="intake-hero-h">From a messy email to a structured record — in seconds.</h1>
          <p className="intake-hero-p">Drop a PDF packing list, an Excel export, a scanned consignment note or a client email. Claude reads it, maps it to your inventory schema and drafts every object for review. You approve before anything is created.</p>
          <div className="intake-points">
            <span className="ipoint"><FileUp size={14} />PDF · Excel · CSV · images · text</span>
            <span className="ipoint"><Eye size={14} />Review &amp; edit every field first</span>
            <span className="ipoint"><Check size={14} />Provisional quote or in-custody</span>
          </div>
        </div>
      </div>
      <div className="intake-grid">
        <label className="dropzone" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}>
          <input type="file" accept=".pdf,.csv,.tsv,.txt,.xlsx,.xls,image/*" style={{ display: "none" }} onChange={e => onFile(e.target.files[0])} />
          <FileUp size={30} strokeWidth={1.4} /><div className="dz-title">Drop a file or click to upload</div><div className="dz-sub">PDF inventory lists · Excel / CSV exports · scanned images · client emails</div>
        </label>
        <div className="paste-box">
          <div className="pb-head">…or paste a list / email</div>
          <textarea value={pasted} onChange={e => setPasted(e.target.value)} placeholder={"e.g.\nUntitled landscape, oil on canvas, 80x100cm, AED 25,000\nBronze figure 'Dawn', 1968, ed. 2/8, 45cm h\n…"} />
          <button className="btn btn-primary" disabled={!pasted.trim()} onClick={() => run({ text: pasted, name: "pasted text" })}><Sparkles size={15} />Extract records</button>
        </div>
      </div>
      {err && <div className="intake-err"><AlertTriangle size={15} />{err}</div>}
      <div className="intake-foot">Claude reads the source, maps messy columns to your schema, and proposes draft records. You then choose whether to create them as <strong>provisional</strong> (quotation stage — not yet in custody) or <strong>in custody</strong>. Nothing is created until you approve. Large databases are best processed in batches.</div>
    </div>
  );
}


export function FacilityMap({ locations }) {
  const withGeo = locations.filter(l => l.lat != null && l.lng != null);
  if (!withGeo.length) return null;
  const cities = {};
  withGeo.forEach(l => { const c = l.city || "Other"; if (!cities[c]) cities[c] = { city: c, items: [] }; cities[c].items.push(l); });
  const list = Object.values(cities).map(c => { const n = c.items.length; return { ...c, lat: c.items.reduce((s, x) => s + x.lat, 0) / n, lng: c.items.reduce((s, x) => s + x.lng, 0) / n }; });
  const W = 760, H = 300, L0 = -12, L1 = 64, T0 = 12, T1 = 56;
  const px = (lng) => ((lng - L0) / (L1 - L0)) * W;
  const py = (lat) => ((T1 - lat) / (T1 - T0)) * H;
  return (
    <section className="panel">
      <div className="panel-head"><h2>Facilities map</h2><span className="muted">{list.length} location{list.length === 1 ? "" : "s"} · schematic</span></div>
      <div className="geo-wrap">
        <svg className="geo-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <rect x={0} y={0} width={W} height={H} className="geo-bg" />
          {[20, 30, 40, 50].map(lat => <line key={"la" + lat} x1={0} y1={py(lat)} x2={W} y2={py(lat)} className="geo-grid" />)}
          {[0, 20, 40, 60].map(lng => <line key={"lo" + lng} x1={px(lng)} y1={0} x2={px(lng)} y2={H} className="geo-grid" />)}
          {list.map(c => { const x = px(c.lng), y = py(c.lat); return (
            <g key={c.city}>
              <circle cx={x} cy={y} r={24} className="geo-halo" />
              <circle cx={x} cy={y} r={13} className="geo-pin" />
              <text x={x} y={y + 4} className="geo-count" textAnchor="middle">{c.items.length}</text>
              <text x={x} y={y - 22} className="geo-label" textAnchor="middle">{c.city}</text>
            </g>
          ); })}
        </svg>
      </div>
      <div className="geo-legend">
        {list.map(c => (
          <div className="geo-leg-city" key={c.city}>
            <span className="geo-leg-dot" /><strong>{c.city}</strong>
            <span className="geo-leg-items">{c.items.map(i => i.name.split(" — ")[0]).join(" · ")}</span>
          </div>
        ))}
      </div>
    </section>
  );
}


export function LocationsView({ locations, packages, objects, spaces, onSave, onAddSpace, onEditSpace, onDeleteSpace }) {
  const [form, setForm] = useState(null);
  const used = (id) => packages.filter(k => k.locationId === id).reduce((s, k) => s + volM3(k.h, k.w, k.d), 0) + objects.filter(o => o.locationId === id && inCustody(o) && !o.packageId).reduce((s, o) => s + objVolM3(o), 0);
  const count = (id) => packages.filter(k => k.locationId === id).length;
  const storeLocs = locations.filter(l => l.type !== "In Transit");
  const totalCap = storeLocs.reduce((s, l) => s + (Number(l.capacity) || 0), 0);
  const totalUsed = storeLocs.reduce((s, l) => s + used(l.id), 0);
  const utilPct = totalCap ? Math.round((totalUsed / totalCap) * 100) : 0;
  return (
    <div>
      <div className="stat-row">
        <Stat icon={MapPin} label="Facilities & venues" value={locations.length} accent />
        <Stat icon={Gauge} label="Total capacity" value={totalCap ? `${totalCap} m³` : "—"} small />
        <Stat icon={Boxes} label="Volume in use" value={fmtVol(totalUsed)} small />
        <Stat icon={Layers} label="Utilisation" value={`${utilPct}%`} />
      </div>
      <div className="sec-head"><h2 className="sec-title">Facilities &amp; venues</h2><button className="btn btn-primary" onClick={() => setForm({ bonded: false, climate: false, type: "Climate Store", capacity: 0 })}><Plus size={16} />Add location</button></div>
      <div className="card-grid">
        {locations.map(l => (
          <div className="card" key={l.id}>
            <div className="card-head"><MapPin size={16} strokeWidth={1.7} /><button className="icon-btn sm" onClick={() => setForm(l)}><Edit3 size={13} /></button></div>
            <div className="card-title">{l.name}</div><div className="card-type">{l.type}</div>
            <div className="card-flags">{l.bonded && <span className="flag flag-bond">Bonded</span>}{l.climate && <span className="flag flag-clim">Climate</span>}{l.capacity ? <span className="flag flag-cap">{l.capacity} m³</span> : null}</div>
            <div className="card-foot"><Boxes size={14} /> {count(l.id)} package{count(l.id) === 1 ? "" : "s"} · {fmtVol(used(l.id))}</div>
          </div>
        ))}
      </div>
      <div className="sec-head sec-head-mt"><h2 className="sec-title">Facilities map</h2></div>
      <FacilityMap locations={locations} />
      <div className="sec-head sec-head-mt"><h2 className="sec-title">Storage map</h2></div>
      <MappingView spaces={spaces} packages={packages} onAdd={onAddSpace} onEdit={onEditSpace} onDelete={onDeleteSpace} />
      {form && <LocationForm initial={form} onClose={() => setForm(null)} onSave={(d) => { onSave(d); setForm(null); }} />}
    </div>
  );
}


export function LocationForm({ initial, onClose, onSave }) {
  const [f, setF] = useState(initial);
  return (
    <Modal title={f.id ? "Edit location" : "Add location"} onClose={onClose}>
      <div className="form-grid">
        <L label="Name" full><input value={f.name || ""} onChange={e => setF({ ...f, name: e.target.value })} /></L>
        <L label="Type"><select value={f.type} onChange={e => setF({ ...f, type: e.target.value })}>{LOC_TYPES.map(t => <option key={t}>{t}</option>)}</select></L>
        <L label="Capacity (m³)"><input type="number" value={f.capacity ?? 0} onChange={e => setF({ ...f, capacity: Number(e.target.value) })} /></L>
        <L label="Bonded"><label className="check"><input type="checkbox" checked={!!f.bonded} onChange={e => setF({ ...f, bonded: e.target.checked })} /> Bonded facility</label></L>
        <L label="Climate"><label className="check"><input type="checkbox" checked={!!f.climate} onChange={e => setF({ ...f, climate: e.target.checked })} /> Climate-controlled</label></L>
        <L label="Notes" full><input value={f.notes || ""} onChange={e => setF({ ...f, notes: e.target.value })} /></L>
      </div>
      <ModalFoot onClose={onClose} onSave={() => f.name && onSave(f)} />
    </Modal>
  );
}


export function MappingView({ spaces, packages, onAdd, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(() => new Set(spaces.filter(s => s.kind !== "module").map(s => s.id)));
  const [form, setForm] = useState(null);
  const childrenOf = (pid) => spaces.filter(s => s.parentId === pid);
  const countIn = (node) => packages.filter(p => p.positionId === node.id).length + childrenOf(node.id).reduce((a, c) => a + countIn(c), 0);
  const toggle = (id) => setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const roots = spaces.filter(s => s.parentId == null);

  const renderNode = (node, depth) => {
    const kids = childrenOf(node.id);
    const open = expanded.has(node.id);
    const childKinds = SPACE_CHILDREN[node.kind] || [];
    const n = countIn(node);
    return (
      <div key={node.id}>
        <div className={"tree-row tk-" + node.kind} style={{ paddingLeft: depth * 22 + 10 }}>
          {kids.length > 0 ? <button className="tree-tw" onClick={() => toggle(node.id)} aria-label="toggle">{open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button> : <span className="tree-tw" />}
          <span className={"tree-kind k-" + node.kind}>{SPACE_LABEL[node.kind]}</span>
          <span className="tree-name">{node.name}</span>
          {node.note && <span className="tree-note">{node.note}</span>}
          <span className="tree-count">{(SPACE_CHILDREN[node.kind] || []).length === 0 ? (n ? `${n} pkg` : "empty") : `${n} pkg`}</span>
          <span className="tree-acts">
            {childKinds.length > 0 && <button className="icon-btn sm" title="Add inside" onClick={() => setForm({ mode: "add", kinds: childKinds, kind: childKinds[0], parentId: node.id })}><Plus size={13} /></button>}
            <button className="icon-btn sm" title="Edit" onClick={() => setForm({ mode: "edit", node })}><Edit3 size={12} /></button>
            <button className="icon-btn sm" title="Delete" onClick={() => { if (window.confirm(`Delete "${node.name}"${kids.length ? " and everything inside it" : ""}? Packages here become unassigned.`)) onDelete(node.id); }}><Trash2 size={12} /></button>
          </span>
        </div>
        {open && kids.map(k => renderNode(k, depth + 1))}
      </div>
    );
  };

  return (
    <div>
      <div className="explainer"><LayoutGrid size={16} /><div><strong>Map the space inside each facility.</strong> A warehouse holds zones / areas, receiving and release areas; zones hold racks and modules. Packages are allocated to a module so you always know exactly where something sits. Counts show how many packages occupy each level.</div></div>
      <div className="toolbar"><div className="spacer" /><button className="btn btn-primary" onClick={() => setForm({ mode: "add", kinds: ["warehouse"], kind: "warehouse", parentId: null })}><Plus size={16} />Add warehouse</button></div>
      <div className="panel tree-panel">
        {roots.length === 0 ? <div className="empty">No spaces mapped yet. Add a warehouse to begin.</div> : roots.map(r => renderNode(r, 0))}
      </div>
      {form && <SpaceForm form={form} onClose={() => setForm(null)} onSave={(d) => { form.mode === "add" ? onAdd({ kind: d.kind, parentId: form.parentId, name: d.name, note: d.note }) : onEdit({ ...form.node, name: d.name, note: d.note }); setForm(null); }} />}
    </div>
  );
}


export function SpaceForm({ form, onClose, onSave }) {
  const editing = form.mode === "edit";
  const [f, setF] = useState({ name: form.node?.name || "", note: form.node?.note || "", kind: editing ? form.node.kind : form.kind });
  const kinds = form.kinds || [f.kind];
  return (
    <Modal title={editing ? "Edit " + SPACE_LABEL[form.node.kind].toLowerCase() : "Add space"} onClose={onClose}>
      <div className="form-grid">
        {!editing && kinds.length > 1 && <L label="Type" full><select value={f.kind} onChange={e => setF({ ...f, kind: e.target.value })}>{kinds.map(k => <option key={k} value={k}>{SPACE_LABEL[k]}</option>)}</select></L>}
        <L label="Name" full><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder={f.kind === "module" ? "e.g. A1-01" : SPACE_LABEL[f.kind]} /></L>
        <L label="Note" full><input value={f.note} onChange={e => setF({ ...f, note: e.target.value })} /></L>
      </div>
      <ModalFoot onClose={onClose} onSave={() => f.name && onSave(f)} saveLabel={editing ? "Save changes" : "Add"} />
    </Modal>
  );
}


