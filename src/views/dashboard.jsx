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

export function MainDashboard({ objects, packages, movements, quotes, projects, tasks, invoices, clients, team, fleet, equipment, locById, onNav }) {
  const custodial = objects.filter(inCustody);
  const stocked = custodial.filter(o => o.status === "In stock");
  const storedValue = stocked.reduce((s, o) => s + (Number(o.value) || 0), 0);
  const storedVol = packages.filter(k => k.status === "In stock").reduce((s, k) => s + volM3(k.h, k.w, k.d), 0) + stocked.filter(o => !o.packageId).reduce((s, o) => s + objVolM3(o), 0);
  const openQuotes = quotes.filter(q => q.status === "Estimating" || q.status === "Sent");
  const openQuotesVal = openQuotes.reduce((s, q) => s + quoteTotal(q), 0);
  const activeProjects = projects.filter(p => p.status === "Confirmed");
  const openTasks = tasks.filter(t => t.status !== "Done").length;
  const receivable = invoices.filter(i => i.status === "Sent" || i.status === "Overdue");
  const receivableVal = receivable.reduce((s, i) => s + (i.amount || 0), 0);
  const overdue = invoices.filter(i => i.status === "Overdue");
  const paidVal = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + (i.amount || 0), 0);
  const draftVal = invoices.filter(i => i.status === "Draft").reduce((s, i) => s + (i.amount || 0), 0);
  const teamAvail = team.filter(t => t.status === "Available").length;
  const fleetAvail = fleet.filter(f => f.status === "Available").length;
  const facs = Object.values(locById).filter(l => l.capacity && l.type !== "In Transit");
  const totCap = facs.reduce((s, l) => s + l.capacity, 0);
  const utilPct = totCap ? Math.round((storedVol / totCap) * 100) : 0;
  const qStatuses = QUOTE_STATUS.map(st => ({ st, n: quotes.filter(q => q.status === st).length })).filter(x => x.n > 0);
  const qMax = qStatuses.reduce((m, x) => Math.max(m, x.n), 1);
  const recent = [...movements].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 6);
  const subjOf = (m) => m.subjectType === "Package" ? "Package" : (objects.find(x => x.id === (m.objectId || m.subjectId))?.title || "—");
  const clientName = (id) => clients.find(c => c.id === id)?.name || "—";
  const alerts = [];
  const pushC = (ref, label, expiry) => { const du = daysUntil(expiry); if (du == null || du > 30) return; alerts.push({ ref, label, when: du < 0 ? `${Math.abs(du)}d over` : `${du}d`, level: du < 0 ? "expired" : "soon" }); };
  objects.forEach(o => pushC(o.ref, `Customs · ${o.title}`, o.customsExpiry));
  packages.forEach(k => pushC(k.ref, `Customs · ${k.type}`, k.customsExpiry));
  overdue.forEach(i => alerts.push({ ref: i.ref, label: `Invoice overdue · ${clientName(i.clientId)}`, when: fmtMoney(i.amount, i.currency), level: "expired" }));
  tasks.filter(t => { const du = daysUntil(t.due); return du != null && du < 0 && t.status !== "Done"; }).forEach(t => alerts.push({ ref: t.type, label: `Task overdue · ${t.title}`, when: "late", level: "expired" }));

  return (
    <div className="dash">
      <div className="flow">
        <FlowTile k="Commercial" icon={FileText} value={openQuotes.length} label="Open quotations" sub={fmtMoney(openQuotesVal)} onClick={() => onNav("quotes")} />
        <span className="flow-arrow"><ArrowRight size={18} /></span>
        <FlowTile k="Operations" icon={Layers} value={activeProjects.length} label="Active jobs" sub={`${openTasks} open tasks`} onClick={() => onNav("jobs")} />
        <span className="flow-arrow"><ArrowRight size={18} /></span>
        <FlowTile k="Custody" icon={Package} value={stocked.length} label="Objects in stock" sub={fmtVol(storedVol)} onClick={() => onNav("objects")} />
        <span className="flow-arrow"><ArrowRight size={18} /></span>
        <FlowTile k="Finance" icon={Banknote} value={fmtMoney(receivableVal)} label="Receivables" sub={`${overdue.length} overdue`} onClick={() => onNav("invoices")} />
      </div>

      <div className="stat-row">
        <Stat icon={ShieldCheck} label="Objects in custody" value={custodial.length} accent />
        <Stat icon={Banknote} label="Stored value" value={fmtMoney(storedValue)} small />
        <Stat icon={Gauge} label="Storage utilisation" value={utilPct + "%"} />
        <Stat icon={Users} label="Team available" value={`${teamAvail}/${team.length}`} />
      </div>

      <div className="dash-2col">
        <div className="dash-main">
          <section className="panel">
            <div className="panel-head"><h2>Commercial pipeline</h2><button className="link-btn" onClick={() => onNav("quotes")}>Quotations →</button></div>
            <div className="cat-list">
              {qStatuses.length === 0 && <div className="t-empty">No quotations yet.</div>}
              {qStatuses.map(x => (<div className="cat-row" key={x.st}><span className="cat-name">{x.st}</span><div className="cat-track"><div className="cat-fill" style={{ width: `${Math.round((x.n / qMax) * 100)}%` }} /></div><span className="cat-n">{x.n}</span></div>))}
            </div>
          </section>
          <section className="panel">
            <div className="panel-head"><h2>Active jobs</h2><button className="link-btn" onClick={() => onNav("jobs")}>All jobs →</button></div>
            <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Reference</th><th>Project</th><th>Customer</th><th>Status</th><th>Due</th></tr></thead>
              <tbody>
                {activeProjects.slice(0, 5).map(j => <tr key={j.id} onClick={() => onNav("jobs")} style={{cursor:"pointer"}}><td className="mono">{j.ref}</td><td className="cell-title">{j.name}</td><td>{clientName(j.clientId)}</td><td><Pill label={j.status} tone={JSTATUS_TONE[j.status] || PSTATUS_TONE[j.status]} /></td><td className="cell-sub">{fmtDate(j.dueDate)}</td></tr>)}
                {activeProjects.length === 0 && <tr><td colSpan={5} className="empty-row">No active projects.</td></tr>}
              </tbody>
            </table></div>
          </section>
          <section className="panel">
            <div className="panel-head"><h2>Recent activity</h2><button className="link-btn" onClick={() => onNav("movements")}>Movement log →</button></div>
            <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Date</th><th>Type</th><th>Subject</th><th>Handled by</th></tr></thead>
              <tbody>
                {recent.map(m => <tr key={m.id} className="no-hover"><td className="mono">{fmtDate(m.date)}</td><td><span className="dot" />{m.type}</td><td>{subjOf(m)}</td><td className="cell-sub">{m.handledBy || "—"}</td></tr>)}
                {recent.length === 0 && <tr><td colSpan={4} className="empty-row">No movements yet.</td></tr>}
              </tbody>
            </table></div>
          </section>
        </div>
        <aside className="dash-rail">
          <section className="panel panel-dark rail-card">
            <div className="panel-head"><h2>Receivables</h2></div>
            <div className="vp-label">Outstanding</div>
            <div className="big-value">{fmtMoney(receivableVal)}</div>
            <div className="rail-insured"><span className="vp-label">Overdue</span><span className="vp-num">{fmtMoney(overdue.reduce((s, i) => s + i.amount, 0))}</span></div>
            <div className="rail-insured"><span className="vp-label">Paid to date</span><span className="vp-num">{fmtMoney(paidVal)}</span></div>
            <div className="vp-sub">{draftVal ? `${fmtMoney(draftVal)} in draft invoices` : "No draft invoices"}</div>
          </section>
          <section className="panel panel-dark rail-card">
            <div className="panel-head"><h2>Resources</h2></div>
            <div className="rail-insured"><span className="vp-label">Team available</span><span className="vp-num">{teamAvail} / {team.length}</span></div>
            <div className="rail-insured"><span className="vp-label">Fleet available</span><span className="vp-num">{fleetAvail} / {fleet.length}</span></div>
            <div className="rail-insured"><span className="vp-label">Equipment lines</span><span className="vp-num">{equipment.length}</span></div>
            <div className="vp-sub">Storage utilisation {utilPct}% across {facs.length} facilities</div>
          </section>
          <section className="panel panel-dark rail-card rail-grow">
            <div className="panel-head"><h2>Needs attention</h2><span className="muted">{alerts.length}</span></div>
            {alerts.length === 0 && <div className="vp-sub">Nothing urgent — all clear.</div>}
            <div className="rail-alerts">
              {alerts.slice(0, 7).map((a, i) => <div className="ra-row" key={i}><span className={"ra-dot " + a.level} /><div className="ra-main"><span className="ra-ref mono">{a.ref}</span><span className="ra-lbl">{a.label}</span></div><span className={"ra-when " + a.level}>{a.when}</span></div>)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}


export function Dashboard({ objects, packages, movements, locById, pkgById, onOpen }) {
  const [tab, setTab] = useState("overview");
  const custodial = objects.filter(inCustody);
  const stocked = custodial.filter(o => o.status === "In stock");
  const notInStock = custodial.length - stocked.length;
  const storedValue = stocked.reduce((s, o) => s + (Number(o.value) || 0), 0);
  const insuredValue = stocked.filter(o => o.insuredByUs).reduce((s, o) => s + (Number(o.value) || 0), 0);
  const storedVol = packages.filter(k => k.status === "In stock").reduce((s, k) => s + volM3(k.h, k.w, k.d), 0) + stocked.filter(o => !o.packageId).reduce((s, o) => s + objVolM3(o), 0);

  const offStock = STATUSES.filter(s => s !== "In stock").map(s => ({ s, n: custodial.filter(o => o.status === s).length })).filter(x => x.n > 0);
  const recent = [...movements].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  const alertItems = [];
  const push = (ref, label, expiry, customsRef) => { const du = daysUntil(expiry); if (du == null) return; if (du < 0) alertItems.push({ ref, label, du, expiry, customsRef, level: "expired" }); else if (du <= 30) alertItems.push({ ref, label, du, expiry, customsRef, level: "soon" }); };
  objects.forEach(o => push(o.ref, o.title, o.customsExpiry, o.customsRef));
  packages.forEach(k => push(k.ref, `${k.type} ${k.ref}`, k.customsExpiry, k.customsRef));
  alertItems.sort((a, b) => a.du - b.du);

  // composition donut
  const comp = [
    { label: "In stock", n: stocked.length, c: "var(--gold)" },
    { label: "In transit", n: custodial.filter(o => o.status === "In transit").length, c: "#919EAB" },
    { label: "Out", n: custodial.filter(o => o.status === "Out").length, c: "rgba(255,255,255,.22)" },
  ].filter(x => x.n > 0);
  const totalC = comp.reduce((s, x) => s + x.n, 0) || 1;
  let acc = 0;
  const stops = comp.map(x => { const a0 = acc / totalC * 360; acc += x.n; return `${x.c} ${a0}deg ${acc / totalC * 360}deg`; }).join(",");
  const donutBg = comp.length ? `conic-gradient(${stops})` : "rgba(255,255,255,.1)";

  // facility utilisation
  const usedAt = (id) => packages.filter(k => k.locationId === id && k.status === "In stock").reduce((s, k) => s + volM3(k.h, k.w, k.d), 0) + stocked.filter(o => o.locationId === id && !o.packageId).reduce((s, o) => s + objVolM3(o), 0);
  const facilities = Object.values(locById).filter(l => l.capacity && l.type !== "In Transit").map(l => { const used = usedAt(l.id); return { l, used, pct: Math.min(100, Math.round((used / l.capacity) * 100)) }; }).sort((a, b) => b.pct - a.pct);

  const subjOf = (m) => m.subjectType === "Package" ? `Package ${pkgById[m.subjectId]?.ref || ""}` : (objects.find(x => x.id === (m.objectId || m.subjectId))?.title || "—");

  const insuredPct = storedValue ? Math.round((insuredValue / storedValue) * 100) : 0;
  const insuredCount = stocked.filter(o => o.insuredByUs).length;
  const inStockPct = custodial.length ? Math.round((stocked.length / custodial.length) * 100) : 0;

  const byCat = CATEGORIES.map(c => ({ c, n: custodial.filter(o => o.category === c).length })).filter(x => x.n > 0).sort((a, b) => b.n - a.n);
  const catMax = byCat.reduce((m, x) => Math.max(m, x.n), 1);
  const artistMap = {};
  custodial.forEach(o => { const a = o.artist || "Unattributed"; if (!artistMap[a]) artistMap[a] = { artist: a, n: 0, value: 0 }; artistMap[a].n++; artistMap[a].value += Number(o.value) || 0; });
  const topArtists = Object.values(artistMap).sort((a, b) => b.value - a.value || b.n - a.n).slice(0, 5);


  return (
    <div className="dash">
      <div className="seg seg-tabs dash-tabs">
        <button className={"seg-btn" + (tab === "overview" ? " on" : "")} onClick={() => setTab("overview")}>Overview</button>
        <button className={"seg-btn" + (tab === "activity" ? " on" : "")} onClick={() => setTab("activity")}>Activity</button>
        <button className={"seg-btn" + (tab === "alerts" ? " on" : "")} onClick={() => setTab("alerts")}>Alerts{alertItems.length > 0 ? ` · ${alertItems.length}` : ""}</button>
      </div>

      {tab === "overview" && <>
        <div className="dash-2col">
          <div className="dash-main">
            <div className="stat-row stat-row-3">
              <Stat icon={ShieldCheck} label="Objects in stock" value={stocked.length} accent />
              <Stat icon={Boxes} label="Packages in store" value={packages.filter(k => k.status === "In stock").length} />
              <Stat icon={Gauge} label="Stored volume" value={fmtVol(storedVol)} small />
            </div>

            <div className="metric-row">
              <MetricCard tone="grey" label="Insurance cover" value={insuredPct} suffix="%"
                subA="Of stored value carried by us" subB={`${fmtMoney(insuredValue)} insured through us`}
                extra={`${insuredCount} of ${stocked.length} objects in stock are on our policy`} />
              <MetricCard tone="lime" label="On-site availability" value={inStockPct} suffix="%"
                subA="Objects in custody currently on site" subB={`${stocked.length} of ${custodial.length} in custody`}
                extra={notInStock > 0 ? `${notInStock} away in transit, on loan or at a conservator` : "Everything in custody is on site"} />
            </div>

            <div className="asset-2col panel-grow">
              <section className="panel">
                <div className="panel-head"><h2>Collection by category</h2><span className="muted">{byCat.length} types</span></div>
                <div className="cat-list">
                  {byCat.length === 0 && <div className="t-empty">No objects yet.</div>}
                  {byCat.map(x => (
                    <div className="cat-row" key={x.c}>
                      <span className="cat-name">{x.c}</span>
                      <div className="cat-track"><div className="cat-fill" style={{ width: `${Math.round((x.n / catMax) * 100)}%` }} /></div>
                      <span className="cat-n">{x.n}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="panel">
                <div className="panel-head"><h2>Top artists</h2><span className="muted">by declared value</span></div>
                <div className="artist-list">
                  {topArtists.length === 0 && <div className="t-empty">No objects yet.</div>}
                  {topArtists.map((a, i) => (
                    <div className="artist-row" key={a.artist}>
                      <span className="artist-rank">{i + 1}</span>
                      <div className="artist-main"><span className="artist-name">{a.artist}</span><span className="artist-sub">{a.n} work{a.n === 1 ? "" : "s"} in custody</span></div>
                      <span className="artist-val mono">{fmtMoney(a.value)}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className="dash-rail">
            <section className="panel panel-dark rail-card">
              <div className="panel-head"><h2>Value in store</h2></div>
              <div className="vp-label">Total stored value</div>
              <div className="big-value">{fmtMoney(storedValue)}</div>
              <div className="rail-insured"><span className="vp-label">Insured through us</span><span className="vp-num">{fmtMoney(insuredValue)}</span></div>
              <div className="vp-sub">{insuredPct}% of stored value carried by us</div>
            </section>

            <section className="panel panel-dark rail-card">
              <div className="panel-head"><h2>Stock composition</h2></div>
              <div className="donut-wrap">
                <div className="donut" style={{ background: donutBg }}><div className="donut-hole"><div className="donut-n">{stocked.length}</div><div className="donut-l">in stock</div></div></div>
                <div className="donut-legend">{comp.map(x => <div className="dl-row" key={x.label}><span className="dl-dot" style={{ background: x.c }} /><span className="dl-label">{x.label}</span><span className="dl-n">{x.n}</span></div>)}</div>
              </div>
            </section>

            <section className="panel panel-dark rail-card">
              <div className="panel-head"><h2>Storage utilisation</h2></div>
              <div className="util-mini">
                {facilities.length === 0 && <div className="vp-sub">No capacity set on facilities yet.</div>}
                {facilities.map(({ l, used, pct }) => (
                  <div className="um-row" key={l.id}>
                    <div className="um-top"><span className="um-name">{l.name.split(" — ")[0]}</span><span className="um-pct">{pct}%</span></div>
                    <div className="um-track"><div className="um-fill" style={{ width: `${pct}%` }} /></div>
                    <div className="um-sub">{fmtVol(used)} / {l.capacity} m³</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel panel-dark rail-card rail-grow">
              <div className="panel-head"><h2>Customs &amp; carnet</h2><span className="muted">{alertItems.length}</span></div>
              {alertItems.length === 0 && <div className="vp-sub">Nothing expiring within 30 days — all clear.</div>}
              <div className="rail-alerts">
                {alertItems.slice(0, 6).map((a, i) => (
                  <div className="ra-row" key={i}>
                    <span className={"ra-dot " + a.level} />
                    <div className="ra-main"><span className="ra-ref mono">{a.ref}</span><span className="ra-lbl">{a.label}</span></div>
                    <span className={"ra-when " + a.level}>{a.level === "expired" ? `${Math.abs(a.du)}d over` : `${a.du}d`}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </>}

      {tab === "activity" && (
        <section className="panel">
          <div className="panel-head"><h2>Activity — chain of custody</h2><span className="muted">{recent.length}</span></div>
          <table className="mini-table"><tbody>
            {recent.slice(0, 30).map(m => (
              <tr key={m.id}><td className="t-date">{fmtDate(m.date)}</td><td className="t-type"><span className="dot" />{m.type}</td><td className="t-obj">{subjOf(m)}</td><td className="t-route">{locById[m.fromId]?.name?.split(" — ")[0] || "—"} → {locById[m.toId]?.name?.split(" — ")[0] || "—"}</td><td className="t-by">{m.handledBy}</td></tr>
            ))}
            {recent.length === 0 && <tr><td className="t-empty">No movements logged yet.</td></tr>}
          </tbody></table>
        </section>
      )}

      {tab === "alerts" && (
        <section className="panel alert-panel">
          <div className="panel-head"><h2><AlertTriangle size={15} className="ic-amber" />Customs &amp; carnet attention</h2><span className="muted">{alertItems.length}</span></div>
          <div className="alert-list">
            {alertItems.length === 0 && <div className="vp-sub" style={{ color: "var(--ink3)" }}>Nothing expiring within 30 days. All clear.</div>}
            {alertItems.map((a, i) => (
              <div className={"alert-row " + a.level} key={i}><span className="alert-dot" /><div className="alert-main"><span className="alert-ref mono">{a.ref}</span> — {a.label}{a.customsRef ? <span className="alert-cref"> · {a.customsRef}</span> : null}</div><div className="alert-when">{a.level === "expired" ? `Expired ${Math.abs(a.du)}d ago` : `${a.du}d`}</div></div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


