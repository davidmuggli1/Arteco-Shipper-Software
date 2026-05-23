// ARTECO global styles
import { useState } from "react";

export default function Style() {
  return <style>{`
  .arteco-root{
    --navy:#1D1D1D;--navy2:#2C2C2C;--bg:#F3F3F1;--panel:#FFFFFF;
    --ink:#1D1D1D;--ink2:#646B78;--ink3:#919EAB;--line:#E8E8E8;--line2:#F2F2F0;
    --ox:#646B00;--ox2:#F0FD63;--gold:#F0FD63;--gold2:#646B00;
    --st-storage:#3F7A30;--bg-storage:#E9F2E0;--st-transit:#8A6A12;--bg-transit:#F4EDCD;
    --st-loan:#3A5A86;--bg-loan:#E6ECF4;--st-consv:#6E4566;--bg-consv:#EFE5EC;--st-neutral:#5E636C;--bg-neutral:#ECEDE8;
    --st-prov:#6E6400;--bg-prov:#F5F1CE;
    font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:var(--bg);min-height:100vh;-webkit-font-smoothing:antialiased;}
  .arteco-root *{box-sizing:border-box;}
  .boot{padding:80px;text-align:center;color:var(--ink3);font-size:14px;}
  .shell{display:flex;min-height:100vh;}
  .ic-amber{vertical-align:-2px;margin-right:6px;color:var(--st-transit);}
  .ic-gold{color:var(--gold2);}
  .sidebar{width:248px;flex-shrink:0;background:var(--navy);color:#C7CAD0;display:flex;flex-direction:column;padding:24px 16px;position:sticky;top:0;height:100vh;z-index:50;transition:width .2s ease,padding .2s ease;}
  .collapse-btn{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border:none;background:rgba(255,255,255,.06);color:rgba(255,255,255,.7);border-radius:6px;cursor:pointer;margin:0 0 10px auto;transition:.15s;}
  .collapse-btn:hover{color:var(--gold);background:rgba(255,255,255,.11);}
  .sidebar.collapsed{width:68px;padding:24px 10px;}
  .sidebar.collapsed .collapse-btn{margin:0 auto 12px;}
  .sidebar.collapsed .brand{justify-content:center;padding:0 0 18px;}
  .sidebar.collapsed .brand-text{display:none;}
  .sidebar.collapsed .nav-item{justify-content:center;padding:11px 0;border-left-color:transparent;}
  .sidebar.collapsed .nav-item.active{border-left-color:transparent;background:rgba(240,253,99,.18);}
  .sidebar.collapsed .nav-item span,.sidebar.collapsed .nav-tag{display:none;}
  .sidebar.collapsed .nav-foot{display:none;}
  .brand{display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:0 8px 22px;border-bottom:1px solid rgba(255,255,255,.1);}
  .brand-logo{width:100%;max-width:110px;height:auto;display:block;}
  .brand-logo-custom{max-width:160px;max-height:48px;width:auto;object-fit:contain;}
  .ws-chip{display:flex;align-items:center;gap:10px;width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:11px;padding:9px 10px;cursor:pointer;text-align:left;font-family:inherit;transition:.15s;}
  .ws-chip:hover{background:rgba(255,255,255,.09);}
  .ws-avatar{width:30px;height:30px;border-radius:8px;background:var(--gold);color:#1D1D1D;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .ws-text{display:flex;flex-direction:column;line-height:1.25;}
  .ws-name{font-size:12.5px;font-weight:600;color:#fff;}
  .ws-sub{font-size:10.5px;color:rgba(255,255,255,.5);}
  .sidebar.collapsed .ws-text{display:none;}.sidebar.collapsed .ws-chip{justify-content:center;}
  .set-note{font-size:12.5px;color:var(--ink3);margin:0 0 14px;line-height:1.55;}
  .logo-preview{background:var(--navy);border-radius:12px;padding:28px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;}
  .logo-preview img{max-width:230px;max-height:64px;width:auto;height:auto;object-fit:contain;}
  .set-actions{display:flex;gap:10px;align-items:center;}.set-actions label.btn{cursor:pointer;}
  .sidebar.collapsed .brand-logo,.sidebar.collapsed .brand-sub{display:none;}
  .brand-mark{font-family:'Inter',system-ui,sans-serif;font-size:22px;font-weight:500;letter-spacing:.5px;width:46px;height:46px;border:1px solid rgba(240,253,99,.5);display:flex;align-items:center;justify-content:center;border-radius:12px;color:#F4F5F6;}
  .brand-mark span{color:var(--gold);margin:0 1px;}
  .brand-name{font-family:'Inter',system-ui,sans-serif;font-size:15px;font-weight:500;color:#F4F5F6;}
  .brand-sub{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-top:2px;}
  .nav{display:flex;flex-direction:column;gap:2px;margin-top:20px;flex:1;}
  .nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border:none;background:none;color:rgba(255,255,255,.72);font-size:13.5px;font-family:inherit;border-radius:5px;cursor:pointer;text-align:left;transition:all .15s;border-left:2px solid transparent;}
  .nav-item:hover{background:rgba(255,255,255,.06);color:#F4F5F6;}
  .nav-item.active{background:rgba(240,253,99,.14);color:#fff;border-left-color:var(--gold);}
  .nav-item.active svg{color:var(--gold);}
  .nav-tag{margin-left:auto;font-size:9px;font-weight:700;letter-spacing:.05em;background:var(--gold);color:var(--navy);padding:2px 6px;border-radius:3px;}
  .nav-foot{padding:12px 8px 0;border-top:1px solid rgba(255,255,255,.1);}
  .pill-module{display:inline-block;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(240,253,99,.45);padding:3px 8px;border-radius:3px;}
  .foot-note{font-size:10.5px;color:rgba(255,255,255,.45);margin-top:8px;}
  .main{flex:1;min-width:0;display:flex;flex-direction:column;}
  .topbar{padding:30px 38px 22px;border-bottom:1px solid var(--line);background:var(--panel);display:flex;align-items:flex-start;justify-content:space-between;gap:20px;}
  .tb-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}
  .tb-icon{position:relative;width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:var(--panel);color:var(--ink2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.15s;}
  .tb-icon:hover{background:var(--bg);color:var(--ink);}
  .tb-badge{position:absolute;top:-3px;right:-3px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:#C0392B;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid var(--panel);}
  .tb-notif{position:relative;}
  .tb-pop-back{position:fixed;inset:0;z-index:40;}
  .tb-pop{position:absolute;right:0;top:48px;width:340px;background:var(--panel);border:1px solid var(--line);border-radius:14px;box-shadow:0 12px 34px rgba(0,0,0,.16);padding:14px 16px;z-index:41;}
  .tb-pop-head{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600;color:var(--ink);margin-bottom:8px;}
  .tb-pop-empty{font-size:12.5px;color:var(--ink3);padding:8px 0;}
  .tb-pop-foot{margin-top:8px;width:100%;text-align:left;background:none;border:none;border-top:1px solid var(--line2);padding:10px 0 2px;font-family:inherit;font-size:12px;font-weight:600;color:var(--gold2);cursor:pointer;}
  .topbar h1{font-family:'Inter',system-ui,sans-serif;font-size:26px;font-weight:500;margin:0;letter-spacing:-.01em;color:var(--navy);}
  .topbar p{margin:5px 0 0;color:var(--ink3);font-size:13px;}
  .content{padding:30px 38px 60px;}
  .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:18px;}
  .stat{position:relative;overflow:hidden;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px;box-shadow:0 1px 2px rgba(12,28,52,.04);}
  .stat > *:not(.topo){position:relative;z-index:1;}
  .stat-accent{background:var(--gold);color:#1D1D1D;border-color:var(--gold);}
  .stat-icon{width:34px;height:34px;border-radius:10px;background:rgba(145,158,171,.16);display:flex;align-items:center;justify-content:center;color:var(--ink2);margin-bottom:14px;}
  .stat-accent .stat-icon{background:rgba(0,0,0,.12);color:#1D1D1D;}
  .stat-value{font-family:'Inter',system-ui,sans-serif;font-size:30px;font-weight:700;line-height:1;letter-spacing:-.02em;}
  .stat-value-sm{font-size:21px;}
  .stat-label{font-size:12px;color:var(--ink2);font-weight:600;margin-top:8px;line-height:1.3;}
  .stat-accent .stat-label{color:rgba(29,29,29,.6);}
  .dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
  .panel{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px 22px;margin-bottom:18px;box-shadow:0 1px 2px rgba(12,28,52,.04);}
  .panel-dark{background:var(--navy);border-color:var(--navy);color:#fff;}
  .panel-dark .panel-head h2{color:#fff;}
  .panel-dark .vp-label,.panel-dark .vp-sub,.panel-dark .ms-l{color:rgba(255,255,255,.55);}
  .panel-dark .big-value,.panel-dark .ms-n{color:#fff;}
  .panel-dark .vp-num{color:var(--gold);}
  .panel-dark .mini-split{border-top-color:rgba(255,255,255,.12);}
  .panel-dark .mini-table td{color:rgba(255,255,255,.82);border-color:rgba(255,255,255,.08);}
  .panel-dark .t-date,.panel-dark .t-by,.panel-dark .t-route{color:rgba(255,255,255,.5);}
  .panel-dark .mini-table .dot{background:var(--gold);}
  .dash-tabs{margin-bottom:20px;}
  .panel-link{background:none;border:none;font-family:inherit;font-size:12px;font-weight:600;color:var(--gold2);cursor:pointer;}
  .dash-2col{display:grid;grid-template-columns:1fr 340px;gap:18px;align-items:stretch;}
  .dash-main{min-width:0;display:flex;flex-direction:column;gap:18px;}
  .dash-main > *{margin-bottom:0;}
  .panel-grow{flex:1;}
  .dash-rail{display:flex;flex-direction:column;gap:16px;}
  .rail-card{margin-bottom:0;}
  .rail-grow{flex:1;display:flex;flex-direction:column;}
  .stat-row-3{grid-template-columns:repeat(3,1fr);}
  .rail-alerts{display:flex;flex-direction:column;gap:2px;margin-top:4px;overflow:auto;}
  .ra-row{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.07);}
  .ra-row:last-child{border-bottom:none;}
  .ra-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;background:var(--gold);}
  .ra-dot.soon{background:#E7C14B;}.ra-dot.expired{background:#E06A5A;}
  .ra-main{flex:1;min-width:0;display:flex;flex-direction:column;}
  .ra-ref{font-size:11px;color:rgba(255,255,255,.55);}
  .ra-lbl{font-size:12.5px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ra-when{font-size:11.5px;font-weight:700;color:rgba(255,255,255,.6);white-space:nowrap;}
  .ra-when.soon{color:#E7C14B;}.ra-when.expired{color:#E06A5A;}
  .rail-insured{display:flex;justify-content:space-between;align-items:baseline;margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.12);}
  .t-empty{color:var(--ink3);padding:14px 8px;font-size:12.5px;}
  .donut-wrap{display:flex;align-items:center;gap:18px;margin-top:6px;}
  .donut{width:108px;height:108px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
  .donut-hole{width:72px;height:72px;border-radius:50%;background:var(--navy);display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .donut-n{font-size:24px;font-weight:700;color:#fff;line-height:1;}
  .donut-l{font-size:10px;color:rgba(255,255,255,.5);margin-top:2px;}
  .donut-legend{flex:1;display:flex;flex-direction:column;gap:8px;}
  .dl-row{display:flex;align-items:center;gap:8px;font-size:12px;}
  .dl-dot{width:9px;height:9px;border-radius:3px;flex-shrink:0;}
  .dl-label{color:rgba(255,255,255,.75);flex:1;}.dl-n{color:#fff;font-weight:600;font-variant-numeric:tabular-nums;}
  .util-mini{display:flex;flex-direction:column;gap:14px;margin-top:4px;}
  .um-top{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;}
  .um-name{color:rgba(255,255,255,.82);}.um-pct{color:var(--gold);font-weight:700;}
  .um-track{height:7px;background:rgba(255,255,255,.12);border-radius:4px;overflow:hidden;}
  .um-fill{height:100%;background:var(--gold);border-radius:4px;}
  .um-sub{font-size:10.5px;color:rgba(255,255,255,.45);margin-top:4px;}
  @media(max-width:1080px){.dash-2col{grid-template-columns:1fr;}}

  /* topographic line art */
  .topo{position:absolute;top:8px;right:6px;width:118px;height:84px;pointer-events:none;}
  .topo path{fill:none;stroke-width:1;vector-effect:non-scaling-stroke;}
  .topo-light path{stroke:rgba(145,158,171,.30);}
  .topo-dark path{stroke:rgba(255,255,255,.16);}
  .topo-olive path{stroke:rgba(100,107,0,.28);}

  /* big colour-block metric cards */
  .metric-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;}
  .metric{position:relative;overflow:hidden;border-radius:16px;padding:24px 26px 22px;min-height:228px;display:flex;flex-direction:column;}
  .metric > *:not(.topo){position:relative;z-index:1;}
  .metric-grey{background:var(--ink3);color:#16181B;}
  .metric-lime{background:var(--gold);color:#1D1D1D;}
  .metric-label{font-size:15px;font-weight:600;letter-spacing:-.01em;}
  .metric-value{font-family:'Inter',system-ui,sans-serif;font-size:54px;font-weight:800;line-height:1;letter-spacing:-.03em;margin-top:14px;}
  .metric-suffix{font-size:24px;font-weight:600;margin-left:4px;letter-spacing:0;}
  .metric-foot{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-top:auto;padding-top:18px;}
  .metric-subs{font-size:12.5px;line-height:1.5;}
  .metric-grey .metric-subs{color:rgba(22,24,27,.66);}
  .metric-lime .metric-subs{color:rgba(29,29,29,.62);}
  .metric-extra{margin-top:6px;font-weight:600;color:inherit;opacity:.92;}
  .metric-chev{flex-shrink:0;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:transparent;transition:.15s;}
  .metric-grey .metric-chev{border:1px solid rgba(22,24,27,.4);color:#16181B;}
  .metric-grey .metric-chev:hover{background:rgba(22,24,27,.1);}
  .metric-lime .metric-chev{border:1px solid rgba(29,29,29,.4);color:#1D1D1D;}
  .metric-lime .metric-chev:hover{background:rgba(29,29,29,.08);}
  .metric-chev .chev-up{transform:rotate(180deg);transition:.2s;}
  .metric-chev svg{transition:.2s;}

  /* storage & billing summary row (under the table) */
  .storage-rail{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px;}
  .storage-rail .rail-card{margin-bottom:0;}
  .asset-2col{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px;}
  .cat-list{display:flex;flex-direction:column;gap:11px;}
  .cat-row{display:flex;align-items:center;gap:12px;}
  .cat-name{font-size:13px;color:var(--ink);width:128px;flex-shrink:0;}
  .cat-track{flex:1;height:8px;background:rgba(145,158,171,.18);border-radius:5px;overflow:hidden;}
  .cat-fill{height:100%;background:linear-gradient(90deg,var(--gold2),var(--ox));border-radius:5px;}
  .cat-n{font-size:13px;font-weight:700;color:var(--ink);width:28px;text-align:right;font-variant-numeric:tabular-nums;}
  .artist-list{display:flex;flex-direction:column;}
  .artist-row{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--line2);}
  .artist-row:last-child{border-bottom:none;}
  .artist-rank{width:22px;height:22px;border-radius:50%;background:rgba(145,158,171,.16);color:var(--ink2);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .artist-main{flex:1;min-width:0;display:flex;flex-direction:column;}
  .artist-name{font-size:13.5px;font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .artist-sub{font-size:11.5px;color:var(--ink3);}
  .artist-val{font-size:13px;color:var(--ink);white-space:nowrap;}
  @media(max-width:860px){.metric-row{grid-template-columns:1fr;}.storage-rail{grid-template-columns:1fr;}.asset-2col{grid-template-columns:1fr;}}
  .panel-wide{grid-column:1 / -1;}
  .panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
  .panel-head h2{font-family:'Inter',system-ui,sans-serif;font-size:16px;font-weight:500;margin:0;color:var(--navy);display:flex;align-items:center;}
  .muted{color:var(--ink3);font-size:12px;}
  .big-value{font-family:'Inter',system-ui,sans-serif;font-size:30px;font-weight:700;letter-spacing:-.02em;color:var(--navy);}
  .mini-split{display:flex;gap:24px;margin-top:18px;padding-top:16px;border-top:1px solid var(--line2);}
  .ms-n{font-family:'Inter',system-ui,sans-serif;font-size:20px;color:var(--navy);}.ms-l{font-size:11px;color:var(--ink3);}
  .bars{display:flex;flex-direction:column;gap:11px;}
  .bar-row{display:grid;grid-template-columns:140px 1fr 28px;align-items:center;gap:12px;}
  .bar-track{height:8px;background:var(--line2);border-radius:4px;overflow:hidden;}
  .bar-fill{height:100%;background:linear-gradient(90deg,var(--navy),var(--gold));border-radius:4px;}
  .bar-n{font-family:'Inter',system-ui,sans-serif;font-size:14px;text-align:right;color:var(--navy);}
  .alert-panel{border-color:var(--line);}
  .alert-list,.att-list{display:flex;flex-direction:column;gap:0;}
  .alert-row{display:flex;align-items:center;gap:11px;padding:10px 4px;font-size:12.5px;border-bottom:1px solid var(--line2);}
  .alert-row:last-child{border-bottom:none;}
  .alert-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;background:#C99A12;}
  .alert-row.expired .alert-dot{background:#C0392B;}
  .alert-main{flex:1;color:var(--ink2);}.alert-ref{font-weight:600;color:var(--ink);}.alert-cref{color:var(--ink3);}.alert-when{font-weight:600;white-space:nowrap;font-size:11.5px;color:var(--ink3);}
  .alert-row.expired .alert-when{color:#C0392B;}
  .att-item{display:flex;align-items:center;gap:12px;padding:11px 12px;border:1px solid var(--line2);border-radius:6px;background:var(--bg);cursor:pointer;font-family:inherit;text-align:left;transition:.15s;}
  .att-item:hover{border-color:var(--gold);background:#fff;}.att-main{flex:1;min-width:0;}.att-title{font-size:13.5px;font-weight:500;}.att-sub{font-size:11.5px;color:var(--ink3);margin-top:1px;}
  .mini-table{width:100%;border-collapse:collapse;font-size:12.5px;}
  .mini-table td{padding:9px 8px;border-bottom:1px solid var(--line2);color:var(--ink2);}.mini-table tr:last-child td{border-bottom:none;}
  .t-date{color:var(--ink3);white-space:nowrap;width:90px;}.t-type{white-space:nowrap;}.t-obj{color:var(--ink);font-weight:500;}.t-route{color:var(--ink3);}.t-by{text-align:right;color:var(--ink3);white-space:nowrap;}
  .dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--gold);margin-right:7px;vertical-align:middle;}
  .toolbar{display:flex;gap:10px;align-items:center;margin-bottom:18px;flex-wrap:wrap;}
  .search{display:flex;align-items:center;gap:8px;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:0 12px;flex:1;min-width:240px;color:var(--ink3);}
  .search input{border:none;background:none;outline:none;padding:10px 0;font-family:inherit;font-size:13.5px;width:100%;color:var(--ink);}
  .toolbar select{padding:9px 12px;border:1px solid var(--line);border-radius:6px;background:var(--panel);font-size:13px;color:var(--ink);outline:none;cursor:pointer;font-family:inherit;}
  .spacer{flex:1;}
  .btn{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:9px;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;border:1px solid transparent;transition:.15s;}
  .btn-primary{background:var(--navy);color:#fff;}.btn-primary:hover{background:var(--navy2);}
  .btn-primary:disabled{background:var(--line);color:var(--ink3);cursor:not-allowed;}
  .btn-ghost{background:var(--panel);border-color:var(--line);color:var(--ink2);}.btn-ghost:hover{border-color:var(--ink3);}
  .icon-btn{background:none;border:none;cursor:pointer;color:var(--ink3);padding:6px;border-radius:5px;display:flex;}
  .icon-btn:hover{background:var(--line2);color:var(--ink);}.icon-btn.sm{padding:5px;}
  .link-btn{background:none;border:none;color:var(--gold2);font-family:inherit;font-size:12px;cursor:pointer;text-decoration:underline;}
  .table-wrap{background:var(--panel);border:1px solid var(--line);border-radius:8px;overflow:hidden;box-shadow:0 1px 2px rgba(12,28,52,.04);}
  .panel .table-wrap{border:none;border-radius:0;box-shadow:none;background:transparent;overflow-x:auto;margin:0 -6px;}
  .panel .table-wrap .data-table thead th:first-child{padding-left:16px;border-top-left-radius:8px;border-bottom-left-radius:8px;}
  .panel .table-wrap .data-table thead th:last-child{border-top-right-radius:8px;border-bottom-right-radius:8px;}
  .panel .table-wrap .data-table tbody td:first-child{padding-left:6px;}
  .inline-table{border:none;box-shadow:none;}
  .data-table{width:100%;border-collapse:collapse;font-size:13px;}
  .data-table thead th{text-align:left;padding:12px 16px;font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:#fff;font-weight:600;border-bottom:none;background:var(--navy);}
  .data-table tbody td{padding:11px 16px;border-bottom:1px solid var(--line2);color:var(--ink2);vertical-align:middle;}
  .data-table tbody tr{cursor:pointer;transition:background .12s;}
  .data-table tbody tr:hover:not(.no-hover){background:var(--bg);box-shadow:inset 3px 0 0 var(--gold);}
  .data-table .val-lime{color:var(--gold2);font-weight:600;}
  .data-table tbody tr.no-hover{cursor:default;}
  .data-table tbody tr:last-child td{border-bottom:none;}
  .row-prov{background:repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(240,253,99,.04) 8px,rgba(240,253,99,.04) 16px);}
  .cell-title{font-weight:500;color:var(--ink);}.cell-sub{font-size:11.5px;color:var(--ink3);}
  .strong{color:var(--ink);font-weight:600;}
  .mono{font-variant-numeric:tabular-nums;font-feature-settings:"tnum";letter-spacing:.01em;}
  .loose{color:var(--ink3);font-style:italic;}.ta-r{text-align:right;}.row-eye{color:var(--line);}
  .data-table tr:hover .row-eye{color:var(--gold2);}
  .empty-row,.empty{text-align:center;color:var(--ink3);padding:28px;font-size:13px;}
  .result-count{color:var(--ink3);font-size:12px;margin-top:12px;text-align:right;}
  .ok{color:var(--st-storage);display:inline-flex;align-items:center;gap:4px;}
  .subj-type{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--gold2);border:1px solid var(--line);padding:1px 5px;border-radius:3px;margin-right:6px;}
  .tariff-tag{font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;font-weight:600;color:var(--navy);background:var(--bg-neutral);padding:2px 7px;border-radius:4px;}
  .thumb{border-radius:5px;overflow:hidden;background:var(--bg-neutral);display:flex;align-items:center;justify-content:center;color:var(--ink3);flex-shrink:0;}
  .thumb img{width:100%;height:100%;object-fit:cover;}
  .chip{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:500;white-space:nowrap;}
  .chip-storage{background:var(--bg-storage);color:var(--st-storage);}.chip-transit{background:var(--bg-transit);color:var(--st-transit);}
  .chip-loan{background:var(--bg-loan);color:var(--st-loan);}.chip-consv{background:var(--bg-consv);color:var(--st-consv);}.chip-neutral{background:var(--bg-neutral);color:var(--st-neutral);}
  .chip-won{background:rgba(46,139,87,.14);color:#1f6b47;}
  .chip-lost{background:rgba(200,60,60,.12);color:#b3261e;}
  .chip-prov{background:var(--bg-prov);color:var(--st-prov);border:1px dashed var(--ox2);}
  .card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
  .card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;box-shadow:0 1px 2px rgba(12,28,52,.04);}
  .card-head{display:flex;justify-content:space-between;align-items:center;color:var(--gold);margin-bottom:12px;}
  .card-title{font-family:'Inter',system-ui,sans-serif;font-size:16px;font-weight:500;line-height:1.25;color:var(--navy);}
  .card-type{font-size:12px;color:var(--ink3);margin-top:3px;}.card-sub{font-size:12px;color:var(--ink3);margin-top:8px;}
  .card-flags{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0;}
  .flag{font-size:10.5px;padding:3px 8px;border-radius:4px;font-weight:500;}
  .flag-bond{background:var(--bg-transit);color:var(--st-transit);}.flag-clim{background:var(--bg-loan);color:var(--st-loan);}.flag-cap{background:var(--bg-neutral);color:var(--ink2);}
  .card-foot{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--ink2);padding-top:12px;border-top:1px solid var(--line2);margin-top:6px;}
  .pkg-card{display:flex;flex-direction:column;}
  .pkg-ref{font-size:14px;font-weight:600;color:var(--navy);letter-spacing:.02em;}.pkg-acts{display:flex;gap:2px;}
  .pkg-meta{display:flex;align-items:center;justify-content:space-between;margin:8px 0;}.pkg-vol{font-family:'Inter',system-ui,sans-serif;font-size:15px;color:var(--navy);}
  .pkg-carnet{font-size:11px;margin-top:6px;color:var(--ink3);}.pkg-carnet.soon{color:var(--st-transit);font-weight:600;}.pkg-carnet.expired{color:#9B3B2E;font-weight:600;}
  .pkg-contents{margin-top:12px;border-top:1px solid var(--line2);padding-top:10px;flex:1;}
  .cc-head{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink2);font-weight:500;margin-bottom:6px;}
  .cc-item{display:block;width:100%;text-align:left;background:var(--bg);border:1px solid var(--line2);border-radius:5px;padding:6px 9px;font-size:12px;color:var(--ink2);font-family:inherit;cursor:pointer;margin-bottom:4px;}
  .cc-item:hover{border-color:var(--gold);}.cc-item .mono{color:var(--ink3);font-size:11px;}.cc-empty{font-size:11.5px;color:var(--ink3);font-style:italic;}
  .pkg-move{margin-top:12px;justify-content:center;}
  .drawer-overlay{position:fixed;inset:0;background:rgba(12,28,52,.42);backdrop-filter:blur(2px);display:flex;justify-content:flex-end;z-index:50;}
  .drawer{width:560px;max-width:95vw;background:var(--bg);height:100%;overflow-y:auto;box-shadow:-12px 0 40px rgba(0,0,0,.22);animation:slideIn .22s ease;}
  @keyframes slideIn{from{transform:translateX(30px);opacity:.6;}to{transform:none;opacity:1;}}
  .drawer-head{display:flex;justify-content:space-between;align-items:flex-start;padding:26px 28px 18px;border-bottom:1px solid var(--line);background:var(--panel);}
  .drawer-ref{font-size:11.5px;color:var(--gold2);letter-spacing:.04em;}
  .drawer-head h2{font-family:'Inter',system-ui,sans-serif;font-size:23px;font-weight:500;margin:6px 0 3px;line-height:1.15;color:var(--navy);}
  .drawer-artist{color:var(--ink3);font-size:13px;}
  .gallery{display:flex;gap:10px;padding:18px 28px;background:var(--panel);border-bottom:1px solid var(--line);flex-wrap:wrap;}
  .gal-item{position:relative;width:96px;height:96px;border-radius:6px;overflow:hidden;cursor:pointer;border:1px solid var(--line);}
  .gal-item.primary{border:2px solid var(--gold);}
  .gal-item img{width:100%;height:100%;object-fit:cover;}
  .gal-acts{position:absolute;top:4px;right:4px;display:flex;gap:3px;opacity:0;transition:.15s;}
  .gal-item:hover .gal-acts{opacity:1;}
  .gal-acts button{background:rgba(12,28,52,.78);color:#fff;border:none;border-radius:4px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
  .gal-add{width:96px;height:96px;border:1.5px dashed var(--line);border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:var(--ink3);cursor:pointer;font-size:11px;transition:.15s;}
  .gal-add:hover{border-color:var(--gold);color:var(--gold2);}
  .mini-spin{width:18px;height:18px;border:2px solid var(--line);border-top-color:var(--gold);border-radius:50%;animation:spin .8s linear infinite;}
  .lightbox{position:fixed;inset:0;background:rgba(12,28,52,.9);display:flex;align-items:center;justify-content:center;z-index:80;padding:40px;}
  .lightbox img{max-width:92%;max-height:92%;border-radius:6px;box-shadow:0 12px 50px rgba(0,0,0,.5);}
  .lb-close{position:absolute;top:24px;right:28px;background:none;border:none;color:#fff;cursor:pointer;}
  .drawer-actions{display:flex;align-items:center;gap:8px;padding:16px 28px;border-bottom:1px solid var(--line2);flex-wrap:wrap;background:var(--panel);}
  .prov-note{display:flex;align-items:center;gap:8px;margin:14px 28px 0;background:var(--bg-prov);color:var(--st-prov);font-size:12.5px;padding:10px 12px;border-radius:6px;border:1px dashed var(--ox2);}
  .pkg-banner{display:flex;align-items:flex-start;gap:10px;margin:14px 28px 0;background:var(--bg-storage);color:var(--st-storage);padding:11px 13px;border-radius:6px;}
  .pkg-banner.loose{background:var(--bg-neutral);color:var(--ink2);}
  .pkg-banner svg{flex-shrink:0;margin-top:1px;}
  .pkgb-main{flex:1;min-width:0;}
  .pkgb-line{font-size:13px;color:var(--ink);}
  .pkgb-line .mono{color:var(--ink2);}
  .pkgb-sibs{font-size:11.5px;color:var(--ink3);margin-top:3px;}
  .linklike{background:none;border:none;padding:0;font-family:inherit;font-size:11.5px;color:var(--gold2);cursor:pointer;text-decoration:underline;}
  .pkg-cell{display:inline-flex;align-items:center;gap:5px;color:var(--ink2);}
  .pkg-cell svg{color:var(--gold2);flex-shrink:0;}
  .loose-pill{display:inline-block;font-size:10.5px;padding:2px 8px;border-radius:20px;background:var(--bg-neutral);color:var(--st-neutral);border:1px solid var(--line);}
  .pkg-banner-btn{width:calc(100% - 56px);text-align:left;border:none;cursor:pointer;font-family:inherit;transition:background .15s;}
  .pkg-banner-btn:hover{background:var(--bg-loan);}
  .pkgb-chev{margin-left:auto;flex-shrink:0;color:var(--gold2);align-self:center;}
  .card-focus{box-shadow:0 0 0 2px var(--gold2),0 6px 20px rgba(0,0,0,.10);}
  .drawer-body{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line2);padding:1px;margin-top:14px;}
  .field2{background:var(--bg);padding:14px 28px;}.field2.full{grid-column:1 / -1;}
  .field2 label{display:block;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink3);margin-bottom:4px;}
  .field2-val{font-size:13.5px;color:var(--ink);}
  .tags{display:flex;gap:6px;flex-wrap:wrap;}.tag{background:var(--bg-neutral);color:var(--ink2);font-size:11px;padding:3px 9px;border-radius:4px;}
  .drawer-section{padding:22px 28px 30px;}
  .drawer-section h3{display:flex;align-items:center;gap:8px;font-family:'Inter',system-ui,sans-serif;font-size:15px;font-weight:500;margin:0 0 16px;color:var(--navy);}
  .drawer-section h3 svg{color:var(--gold);}
  /* catalog detail drawer */
  .cat-overlay{position:fixed;inset:0;background:rgba(20,22,25,.55);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;z-index:60;padding:24px;}
  .cat-drawer{width:min(1180px,96vw);height:min(880px,92vh);background:var(--panel);border-radius:18px;overflow:hidden;display:flex;box-shadow:0 30px 90px rgba(0,0,0,.42);}
  .cat-stage{position:relative;flex:0 0 53%;background:var(--panel);display:flex;flex-direction:column;padding:30px;overflow:hidden;border-right:1px solid var(--line);}
  .cat-stage .topo{width:62%;max-width:340px;height:auto;top:auto;bottom:-14px;left:-24px;right:auto;}
  .cat-stage .topo path{stroke:rgba(100,107,0,.09);}
  .cat-stage-img{flex:1;display:flex;align-items:center;justify-content:center;cursor:zoom-in;position:relative;z-index:1;min-height:0;}
  .cat-stage-img img{max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 14px 40px rgba(0,0,0,.22);border-radius:2px;background:#fff;}
  .cat-noimg{display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--ink3);font-size:12.5px;}
  .cat-filmstrip{position:relative;z-index:1;display:flex;gap:10px;margin-top:18px;overflow-x:auto;padding-bottom:4px;}
  .cat-thumb{position:relative;flex:0 0 auto;width:62px;height:62px;border-radius:8px;overflow:hidden;border:2px solid var(--line);background:#fff;cursor:pointer;padding:0;}
  .cat-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
  .cat-thumb.on{border-color:var(--gold2);}
  .cat-thumb.primary::after{content:"★";position:absolute;top:1px;left:4px;color:var(--gold);font-size:11px;text-shadow:0 1px 2px #000;}
  .cat-thumb-acts{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:flex-end;gap:1px;padding:3px;opacity:0;transition:.15s;background:linear-gradient(to top,rgba(0,0,0,.65),transparent 60%);}
  .cat-thumb:hover .cat-thumb-acts{opacity:1;}
  .cat-thumb-acts button{background:none;border:none;color:#fff;cursor:pointer;padding:2px;display:flex;}
  .cat-add{flex:0 0 auto;width:62px;height:62px;border-radius:8px;border:1.5px dashed var(--ink3);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--ink2);font-size:9px;cursor:pointer;background:rgba(255,255,255,.5);}
  .cat-add:hover{border-color:var(--gold2);color:var(--gold2);}
  .cat-info{flex:1;min-width:0;overflow-y:auto;padding:30px 32px;position:relative;background:var(--panel);}
  .dl-hero{display:flex;flex-direction:column;gap:3px;background:linear-gradient(135deg, rgba(240,253,99,.20), rgba(240,253,99,.07));border:1px solid rgba(100,107,0,.22);border-radius:14px;padding:16px 20px;margin:18px 0 22px;}
  .dlh-k{font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--gold2);font-weight:700;}
  .dlh-v{font-family:'Inter',system-ui,sans-serif;font-size:30px;font-weight:800;letter-spacing:-.02em;color:var(--ink);line-height:1.05;}
  .dlh-sub{font-size:12.5px;color:var(--ink2);}
  .dl-group{margin-bottom:22px;}
  .dl-group h4{font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink);font-weight:800;margin:0 0 9px;}
  .dl{display:flex;flex-direction:column;}
  .dl-row{display:flex;justify-content:space-between;align-items:baseline;gap:18px;padding:9px 2px;border-bottom:1px solid var(--line2);}
  .dl-row:last-child{border-bottom:none;}
  .dl-k{font-size:12.5px;color:var(--ink3);flex-shrink:0;}
  .dl-v{font-size:13.5px;color:var(--ink);text-align:right;}
  .dl-note{font-size:13px;color:var(--ink2);line-height:1.6;margin:2px 0 0;}
  .dl-link{background:none;border:none;padding:0;font:inherit;font-size:13.5px;color:var(--gold2);cursor:pointer;display:inline-flex;align-items:center;gap:3px;}
  .dl-link:hover{text-decoration:underline;}
  .dl-link svg{opacity:.6;}
  .dl-amount{font-weight:600;color:var(--ink);}
  .dl-collapse{display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:none;padding:0;cursor:pointer;color:var(--ink);}
  .dl-collapse h4{margin:0;}
  .dl-collapse svg{color:var(--ink3);}
  .dl-collapse:hover svg{color:var(--ink);}
  .prov-list{list-style:none;margin:11px 0 0;padding:0;display:flex;flex-direction:column;}
  .prov-list li{display:flex;gap:16px;padding:9px 2px;border-bottom:1px solid var(--line2);font-size:13px;}
  .prov-list li:last-child{border-bottom:none;}
  .prov-year{flex:0 0 70px;color:var(--ink3);font-variant-numeric:tabular-nums;}
  .prov-note{color:var(--ink);line-height:1.45;}
  .cat-close{position:absolute;top:18px;right:18px;}
  .cat-close-m{display:none;}
  .cat-head{margin-bottom:18px;padding-right:42px;}
  .cat-ref{display:inline-block;font-size:11px;color:#fff;background:var(--navy);padding:4px 10px;border-radius:6px;margin-bottom:11px;letter-spacing:.03em;}
  .cat-title{font-family:'Inter',system-ui,sans-serif;font-size:25px;font-weight:700;letter-spacing:-.02em;line-height:1.15;margin:0;color:var(--ink);}
  .cat-artist{font-size:14px;color:var(--ink2);margin-top:5px;}
  .cat-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:15px;align-items:center;}
  .cat-cat{font-size:11.5px;font-weight:600;color:var(--ink2);background:var(--bg-neutral);padding:4px 11px;border-radius:20px;}
  .cat-ins{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;color:var(--gold2);background:rgba(100,107,0,.10);padding:4px 11px;border-radius:20px;}
  .cat-actions{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--line);}
  .cat-spec{display:flex;flex-direction:column;gap:14px;}
  .spec-group{background:var(--bg);border:1px solid var(--line);border-radius:13px;padding:16px 18px;}
  .spec-group h4{display:flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--ink3);font-weight:700;margin:0 0 13px;}
  .spec-group h4::before{content:"";width:12px;height:3px;border-radius:2px;background:var(--gold);}
  .spec-dark{background:var(--navy);border-color:var(--navy);}
  .spec-dark h4{color:rgba(255,255,255,.55);}
  .spec-dark .field2 label{color:rgba(255,255,255,.5);}
  .spec-dark .field2-val{color:#fff;}
  .spec-dark .field2-hero{color:var(--gold);font-size:26px;}
  .cat-noimg-logo{width:56%;max-width:220px;filter:brightness(0);opacity:.13;margin-bottom:6px;}
  .spec-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px 24px;}
  .spec-grid .field2{background:transparent;padding:0;}
  .spec-grid .field2.full{grid-column:1 / -1;}
  .field2-hero{font-family:'Inter',system-ui,sans-serif;font-size:20px;font-weight:700;letter-spacing:-.01em;color:var(--gold2);}
  .spec-note{font-size:13px;color:var(--ink2);line-height:1.6;}
  .cat-info .drawer-section{background:var(--bg);border:1px solid var(--line);border-radius:13px;padding:18px 20px;margin-top:16px;}
  @media(max-width:880px){.cat-drawer{flex-direction:column;height:94vh;width:96vw;}.cat-stage{flex:0 0 auto;height:300px;padding:18px;}.cat-info{padding:24px 22px;}.cat-close{display:none;}.cat-close-m{display:flex;position:absolute;top:14px;right:14px;z-index:2;background:rgba(0,0,0,.45);color:#fff;border:none;border-radius:50%;width:34px;height:34px;align-items:center;justify-content:center;cursor:pointer;}.spec-grid{grid-template-columns:1fr;}}
  .comp-list{display:flex;flex-direction:column;gap:8px;}
  .comp-item{display:flex;justify-content:space-between;align-items:center;background:var(--panel);border:1px solid var(--line2);border-radius:6px;padding:10px 12px;}
  .comp-name{font-size:13px;font-weight:500;}.comp-note{font-size:11.5px;color:var(--ink3);margin-top:2px;}
  .timeline{display:flex;flex-direction:column;}
  .tl-item{display:flex;gap:14px;}
  .tl-dot{width:9px;height:9px;border-radius:50%;background:var(--gold);margin-top:5px;flex-shrink:0;position:relative;}
  .tl-item:not(:last-child) .tl-dot::after{content:"";position:absolute;top:11px;left:4px;width:1px;height:calc(100% + 14px);background:var(--line);}
  .tl-content{padding-bottom:20px;flex:1;}
  .tl-top{display:flex;justify-content:space-between;align-items:baseline;}
  .tl-type{font-weight:600;font-size:13px;}.tl-date{font-size:11.5px;color:var(--ink3);}
  .tl-route{font-size:12.5px;color:var(--ink2);margin:3px 0;}
  .tl-meta{font-size:11.5px;color:var(--ink3);display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
  .tl-cond{display:inline-flex;align-items:center;gap:3px;color:var(--st-storage);}.tl-ref{font-variant-numeric:tabular-nums;color:var(--gold2);}
  .tl-note{font-size:12.5px;color:var(--ink2);margin-top:6px;background:var(--panel);border:1px solid var(--line2);padding:8px 10px;border-radius:5px;}
  .modal-overlay{position:fixed;inset:0;background:rgba(12,28,52,.46);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:60;padding:24px;}
  .modal{background:var(--panel);border-radius:10px;width:560px;max-width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 24px 70px rgba(12,28,52,.4);}
  .modal-wide{width:800px;}
  .modal-head{display:flex;justify-content:space-between;align-items:center;padding:22px 26px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--panel);z-index:1;}
  .modal-head h2{font-family:'Inter',system-ui,sans-serif;font-size:20px;font-weight:500;margin:0;color:var(--navy);}
  .modal-body{padding:24px 26px;}
  .modal-foot{display:flex;justify-content:flex-end;gap:10px;padding:18px 26px;border-top:1px solid var(--line);position:sticky;bottom:0;background:var(--panel);}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .form-section{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--gold2);font-weight:700;margin:22px 0 2px;padding-bottom:6px;border-bottom:1px solid var(--line2);}
  .form-grid .gridfull{grid-column:1/-1;}
  .form-note{grid-column:1/-1;font-size:11.5px;color:var(--ink3);background:var(--bg-neutral);padding:8px 10px;border-radius:6px;margin:2px 0;}
  .seg-inline{margin-bottom:0;flex-wrap:wrap;}
  .seg-div{width:1px;align-self:stretch;background:var(--line);margin:3px 4px;}
  .muted-inline{color:var(--ink3);font-size:13px;}
  .unit-toggle{display:inline-flex;gap:2px;margin-left:8px;vertical-align:middle;}
  .unit-toggle button{border:1px solid var(--line);background:var(--panel);color:var(--ink3);font-family:inherit;font-size:10px;padding:1px 6px;border-radius:4px;cursor:pointer;text-transform:lowercase;}
  .unit-toggle button.on{background:var(--navy);color:#fff;border-color:var(--navy);}
  .fl{display:flex;flex-direction:column;gap:6px;}.fl.full{grid-column:1 / -1;}
  .fl > span{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink3);font-weight:600;}
  .fl input,.fl select{padding:9px 11px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:13.5px;color:var(--ink);outline:none;width:100%;font-family:inherit;}
  .fl input:focus,.fl select:focus{border-color:var(--gold);}
  .dim{display:flex;align-items:center;gap:8px;}.dim input{flex:1;}.dim span{font-size:12px;color:var(--ink3);min-width:30px;}
  .readout{padding:9px 11px;background:var(--bg-neutral);border-radius:6px;font-family:'Inter',system-ui,sans-serif;font-size:15px;color:var(--navy);}
  .check{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink2);text-transform:none;letter-spacing:0;font-weight:400;cursor:pointer;}.check input{width:auto;}
  .confirm-head{display:flex;gap:12px;align-items:flex-start;margin-bottom:18px;font-size:15px;font-family:'Inter',system-ui,sans-serif;color:var(--navy);}
  .confirm-head .mono{color:var(--gold2);font-size:13px;}.confirm-head .muted{font-family:'Inter',sans-serif;margin-top:4px;}
  .seg{display:inline-flex;background:rgba(145,158,171,.14);border-radius:7px;padding:3px;margin-bottom:18px;}
  .seg-btn{border:none;background:none;font-family:inherit;font-size:13px;padding:7px 16px;border-radius:5px;cursor:pointer;color:var(--ink2);}
  .seg-btn.on{background:var(--navy);color:#fff;box-shadow:0 1px 3px rgba(0,0,0,.18);font-weight:600;}
  .seg-btn{transition:.15s;}
  .note-callout{display:flex;align-items:center;gap:8px;margin-top:16px;background:var(--bg-storage);color:var(--st-storage);font-size:12.5px;padding:10px 12px;border-radius:6px;}
  .comp-editor{margin-top:18px;border-top:1px solid var(--line);padding-top:16px;}
  .ce-head{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:var(--ink2);margin-bottom:10px;}
  .ce-row{display:flex;gap:8px;margin-bottom:8px;}
  .ce-row input{flex:1;padding:7px 10px;border:1px solid var(--line);border-radius:5px;font-family:inherit;font-size:12.5px;}
  .explainer{display:flex;gap:12px;align-items:flex-start;background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--gold);border-radius:8px;padding:16px 18px;margin-bottom:18px;font-size:13px;color:var(--ink2);line-height:1.5;}
  .explainer svg{color:var(--gold);flex-shrink:0;margin-top:2px;}
  .util-list{display:flex;flex-direction:column;gap:14px;}
  .util-row{display:grid;grid-template-columns:1fr 200px 44px;align-items:center;gap:14px;}
  .util-name{font-size:13px;color:var(--ink);display:flex;flex-direction:column;}.util-cap{font-size:11px;color:var(--ink3);margin-top:2px;}
  .util-track{height:9px;background:var(--line2);border-radius:5px;overflow:hidden;}.util-track.ghost{opacity:.5;}.util-fill{height:100%;border-radius:5px;}
  .util-pct{font-family:'Inter',system-ui,sans-serif;font-size:14px;text-align:right;color:var(--navy);}
  .intake-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:18px;}
  .geo-wrap{border-radius:12px;overflow:hidden;}
  .geo-svg{width:100%;height:auto;display:block;}
  .geo-bg{fill:var(--navy);}
  .geo-grid{stroke:rgba(255,255,255,.06);stroke-width:1;}
  .geo-halo{fill:rgba(240,253,99,.16);}
  .geo-pin{fill:var(--gold);}
  .geo-count{fill:#1D1D1D;font-size:13px;font-weight:800;font-family:'Inter',system-ui,sans-serif;}
  .geo-label{fill:#fff;font-size:13px;font-weight:600;font-family:'Inter',system-ui,sans-serif;}
  .geo-legend{display:flex;flex-wrap:wrap;gap:18px;margin-top:14px;}
  .geo-leg-city{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink);}
  .geo-leg-dot{width:9px;height:9px;border-radius:50%;background:var(--gold2);flex-shrink:0;}
  .geo-leg-items{color:var(--ink3);}
  .intake-hero{position:relative;overflow:hidden;background:var(--navy);border-radius:16px;padding:30px 32px;margin-bottom:20px;color:#fff;}
  .intake-hero-art{display:none;}
  .intake-hero .topo{width:46%;max-width:460px;height:120%;top:50%;right:-20px;transform:translateY(-50%);}
  .intake-hero .topo path{stroke:rgba(255,255,255,.22);}
  .intake-hero-body{position:relative;z-index:1;max-width:760px;}
  .intake-badge{display:inline-flex;align-items:center;gap:6px;background:var(--gold);color:#1D1D1D;font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:4px 11px;border-radius:20px;}
  .intake-hero-h{font-family:'Inter',system-ui,sans-serif;font-size:27px;font-weight:700;letter-spacing:-.02em;line-height:1.15;margin:14px 0 10px;color:#fff;}
  .intake-hero-p{font-size:13.5px;line-height:1.6;color:rgba(255,255,255,.72);margin:0;}
  .intake-points{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;}
  .ipoint{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;color:rgba(255,255,255,.9);background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);padding:7px 13px;border-radius:9px;}
  .ipoint svg{color:var(--gold);}
  .dropzone{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:var(--panel);border:2px dashed var(--line);border-radius:10px;padding:50px 24px;cursor:pointer;text-align:center;color:var(--ink3);transition:.15s;}
  .dropzone:hover{border-color:var(--gold);background:#fff;color:var(--ink2);}
  .dz-title{font-family:'Inter',system-ui,sans-serif;font-size:17px;color:var(--navy);}.dz-sub{font-size:12px;max-width:280px;}
  .paste-box{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:18px;display:flex;flex-direction:column;}
  .pb-head{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#3E4754;font-weight:700;margin-bottom:10px;}
  .paste-box textarea{flex:1;min-height:150px;border:1px solid var(--line);border-radius:6px;padding:10px;font-family:inherit;font-size:12.5px;resize:vertical;outline:none;margin-bottom:12px;color:var(--ink);}
  .paste-box textarea:focus{border-color:var(--gold);}
  .intake-err{display:flex;align-items:center;gap:8px;margin-top:16px;background:#F6E0DC;color:#9B3B2E;font-size:13px;padding:12px 14px;border-radius:7px;}
  .intake-foot{margin-top:20px;font-size:12px;color:var(--ink3);line-height:1.5;max-width:660px;}
  .intake-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:70px 20px;text-align:center;gap:14px;}
  .spinner{width:38px;height:38px;border:3px solid var(--line);border-top-color:var(--navy);border-radius:50%;animation:spin .8s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .intake-status{font-size:14px;color:var(--ink2);}
  .done-ic{width:56px;height:56px;border-radius:50%;background:var(--bg-storage);color:var(--st-storage);display:flex;align-items:center;justify-content:center;}
  .done-h{font-family:'Inter',system-ui,sans-serif;font-weight:500;margin:0;color:var(--navy);}
  .review-bar{display:flex;justify-content:space-between;align-items:center;gap:16px;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:14px 16px;margin-bottom:16px;flex-wrap:wrap;}
  .rb-left{font-size:13px;color:var(--ink2);display:flex;align-items:center;gap:8px;}.rb-left svg{color:var(--gold);}
  .rb-right{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
  .rb-right select{padding:8px 10px;border:1px solid var(--line);border-radius:6px;font-family:inherit;font-size:12.5px;background:#fff;}
  .rb-right select:disabled{opacity:.45;}
  .draft-table .cell-input{width:100%;border:1px solid transparent;background:transparent;font-family:inherit;font-size:13px;padding:5px 6px;border-radius:4px;color:var(--ink);}
  .draft-table .cell-input:hover{border-color:var(--line2);}.draft-table .cell-input:focus{border-color:var(--gold);background:#fff;outline:none;}
  .draft-table tr.off{opacity:.4;}
  .nav-group{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:rgba(218,210,217,.4);padding:16px 12px 6px;font-weight:600;}
  .sidebar.collapsed .nav-group{text-align:center;padding:14px 0 6px;font-size:0;border-top:1px solid rgba(255,255,255,.08);margin-top:6px;}
  .secondary-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:-4px 0 22px;font-size:12.5px;color:var(--ink3);}
  .sec-label{font-weight:500;}
  .sec-pill{display:inline-flex;align-items:center;gap:6px;color:var(--ink2);}
  .pkg-pos{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--gold2);margin-top:6px;font-variant-numeric:tabular-nums;}
  .tree-panel{padding:8px 6px;}
  .tree-row{display:flex;align-items:center;gap:10px;padding:8px 12px 8px 0;border-bottom:1px solid var(--line2);}
  .tree-row:last-child{border-bottom:none;}
  .tree-tw{width:22px;height:22px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:none;background:none;color:var(--ink3);cursor:pointer;border-radius:4px;}
  .tree-tw:hover{background:var(--line2);color:var(--ink);}
  .tree-kind{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;font-weight:600;padding:2px 7px;border-radius:4px;white-space:nowrap;}
  .k-warehouse{background:var(--navy);color:#fff;}
  .k-zone{background:var(--bg-loan);color:var(--st-loan);}
  .k-rack{background:var(--bg-neutral);color:var(--ink2);}
  .k-module{background:var(--bg-storage);color:var(--st-storage);}
  .k-receive{background:var(--bg-transit);color:var(--st-transit);}
  .k-release{background:var(--bg-consv);color:var(--st-consv);}
  .k-receive{background:var(--bg-loan);color:var(--st-loan);}
  .k-release{background:var(--bg-transit);color:var(--st-transit);}
  .seg-tabs{margin-bottom:16px;}
  .pkg-intro{font-size:12.5px;color:var(--ink3);max-width:560px;}
  .sec-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
  .sec-head-mt{margin-top:34px;padding-top:24px;border-top:1px solid var(--line);}
  .sec-title{font-family:'Inter',system-ui,sans-serif;font-size:19px;font-weight:500;margin:0;color:var(--navy);}
  .value-pair{display:flex;gap:28px;align-items:flex-end;flex-wrap:wrap;}
  .vp-label{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:#3E4754;font-weight:700;margin-bottom:4px;}
  .vp-insured{padding-left:28px;border-left:1px solid var(--line2);}
  .vp-num{font-family:'Inter',system-ui,sans-serif;font-size:22px;color:var(--gold2);}
  .vp-sub{font-size:11.5px;color:var(--ink3);margin-top:2px;}
  .tree-name{font-size:13.5px;font-weight:500;color:var(--ink);}
  .tree-note{font-size:11.5px;color:var(--ink3);}
  .tree-count{margin-left:auto;font-size:11.5px;color:var(--ink3);font-variant-numeric:tabular-nums;white-space:nowrap;}
  .tree-acts{display:flex;gap:1px;flex-shrink:0;}
  .tree-row.tk-warehouse .tree-name{font-family:'Inter',system-ui,sans-serif;font-size:16px;}
  @media(max-width:1080px){.stat-row{grid-template-columns:repeat(2,1fr);}.dash-grid{grid-template-columns:1fr;}.intake-grid{grid-template-columns:1fr;}.util-row{grid-template-columns:1fr 120px 40px;}}
  @media(max-width:720px){.sidebar{display:none;}.content,.topbar{padding-left:18px;padding-right:18px;}.form-grid{grid-template-columns:1fr;}.drawer-body{grid-template-columns:1fr;}}

  /* ---- ERP: shared bits ---- */
  .fl textarea{padding:9px 11px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:13.5px;color:var(--ink);outline:none;width:100%;font-family:inherit;resize:vertical;line-height:1.5;}
  .fl textarea:focus{border-color:var(--gold);}
  .btn-sm{padding:5px 11px;font-size:12px;}
  .warn-tag{display:inline-block;margin-left:7px;font-size:10.5px;font-weight:700;color:var(--st-transit);background:var(--bg-transit);padding:1px 6px;border-radius:5px;vertical-align:middle;}
  .cell-sub2{font-size:11px;color:var(--ink3);margin-top:2px;}
  .muted.sm{font-size:11px;}
  /* ---- Quote line items ---- */
  .ln-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0 8px;}
  .ln-head h4{margin:0;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink);font-weight:800;}
  .est-h{display:flex;align-items:center;gap:9px;background:var(--navy);color:#fff;border-radius:8px;padding:9px 14px;margin:22px 0 12px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;}
  .est-h .est-h-no{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:5px;background:var(--gold);color:var(--navy);font-size:10px;font-weight:800;}
  .ln-head h4{position:relative;padding-left:11px;}
  .ln-head h4::before{content:"";position:absolute;left:0;top:1px;bottom:1px;width:3px;border-radius:2px;background:var(--gold2);}
  .ln-pick{padding:7px 10px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:12.5px;color:var(--ink2);outline:none;font-family:inherit;max-width:260px;}
  .ln-pick:focus{border-color:var(--gold);}
  .ln-list{display:flex;flex-direction:column;gap:7px;}
  .ln-empty{font-size:12.5px;color:var(--ink3);padding:14px;text-align:center;background:var(--bg);border:1px dashed var(--line);border-radius:8px;}
  .ln-row{display:flex;align-items:center;gap:9px;}
  .ln-row input{padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:13px;color:var(--ink);outline:none;font-family:inherit;}
  .ln-row input:focus{border-color:var(--gold);}
  .ln-desc{flex:1;min-width:0;}
  .ln-qty{width:62px;text-align:right;}
  .ln-rate{width:92px;text-align:right;}
  .ln-x{color:var(--ink3);font-size:12px;}
  .ln-amt{width:118px;text-align:right;font-size:13px;color:var(--gold2);font-weight:600;}
  .ln-del{flex:0 0 auto;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);background:#fff;border-radius:6px;color:var(--ink3);cursor:pointer;}
  .ln-del:hover{border-color:var(--st-transit);color:var(--st-transit);}
  .ln-total{display:flex;justify-content:space-between;align-items:baseline;margin-top:6px;padding:11px 13px;background:var(--navy);color:#fff;border-radius:9px;font-weight:700;}
  .ln-total .mono{font-size:16px;color:var(--gold);}
  /* ---- Object picker ---- */
  .obj-pick{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-height:230px;overflow-y:auto;padding:2px;}
  .obj-pick-row{display:flex;align-items:center;gap:10px;padding:7px 9px;border:1px solid var(--line);border-radius:9px;cursor:pointer;background:#fff;}
  .obj-pick-row.on{border-color:var(--gold2);background:rgba(240,253,99,.10);}
  .obj-pick-row img{width:34px;height:34px;border-radius:6px;object-fit:cover;flex:0 0 auto;}
  .obj-pick-noimg{width:34px;height:34px;border-radius:6px;background:var(--bg);flex:0 0 auto;}
  .obj-pick-main{display:flex;flex-direction:column;min-width:0;}
  .obj-pick-title{font-size:13px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .obj-pick-sub{font-size:11px;color:var(--ink3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  /* ---- Operations kanban ---- */
  .ops-hint{font-size:12px;color:var(--ink3);}
  .kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start;}
  .kan-col{background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:12px;min-height:160px;}
  .kan-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px;padding:0 2px;}
  .kan-body{display:flex;flex-direction:column;gap:9px;}
  .kan-empty{font-size:12px;color:var(--ink3);text-align:center;padding:14px 0;}
  .kan-card{background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:11px 12px;cursor:pointer;transition:box-shadow .12s,border-color .12s,transform .12s;}
  .kan-card:hover{border-color:var(--ink3);box-shadow:0 4px 14px rgba(0,0,0,.07);transform:translateY(-1px);}
  .kan-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
  .kan-type{font-size:10px;letter-spacing:.05em;text-transform:uppercase;font-weight:700;color:var(--ink3);}
  .kan-acts{display:flex;gap:4px;opacity:0;transition:opacity .12s;}
  .kan-card:hover .kan-acts{opacity:1;}
  .kan-acts button{width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);background:#fff;border-radius:6px;color:var(--ink3);cursor:pointer;}
  .kan-acts button:hover{border-color:var(--ink3);color:var(--ink);}
  .kan-title{font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.35;margin-bottom:7px;}
  .kan-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:11.5px;color:var(--ink3);}
  .kan-meta .mono{color:var(--gold2);}
  .kan-who{background:var(--bg);border-radius:5px;padding:1px 6px;color:var(--ink2);}
  .kan-due{margin-top:7px;font-size:11px;color:var(--ink3);}
  .kan-due.late{color:var(--st-transit);font-weight:600;}
  @media(max-width:880px){.kanban{grid-template-columns:1fr;}.obj-pick{grid-template-columns:1fr;}}

  /* ---- Sub-navigation (domain sections) ---- */
  .subnav{display:flex;gap:2px;flex-wrap:wrap;background:var(--panel);border-bottom:2px solid var(--line);padding:0 6px;margin:-12px -16px 20px;box-shadow:0 2px 8px rgba(0,0,0,.04);}
  .subnav-tab{display:inline-flex;align-items:center;gap:7px;padding:11px 16px 13px;border:none;background:none;color:var(--ink3);font-size:13.5px;font-weight:500;font-family:inherit;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-2px;white-space:nowrap;transition:color .15s;}
  .subnav-tab:hover{color:var(--ink);background:rgba(0,0,0,.02);}
  .subnav-tab.on{color:var(--ink);font-weight:700;border-bottom-color:var(--gold2);background:rgba(100,107,0,.04);}
  .subnav-tab .nav-tag{font-size:8.5px;font-weight:800;letter-spacing:.06em;background:var(--gold);color:var(--ink);border-radius:4px;padding:1px 4px;}
  /* ---- Command-centre flow strip ---- */
  .flow{display:flex;align-items:stretch;gap:10px;margin-bottom:22px;}
  .flow-tile{flex:1;text-align:left;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px 18px;cursor:pointer;transition:border-color .12s,box-shadow .12s,transform .12s;font-family:inherit;}
  .flow-tile:hover{border-color:var(--ink3);box-shadow:0 6px 18px rgba(0,0,0,.06);transform:translateY(-2px);}
  .flow-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
  .flow-k{font-size:10px;letter-spacing:.08em;text-transform:uppercase;font-weight:800;color:var(--ink2);}
  .flow-ico{width:28px;height:28px;border-radius:8px;background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--ink2);}
  .flow-v{font-size:24px;font-weight:800;color:var(--ink);line-height:1;}
  .flow-l{font-size:13px;color:var(--ink);font-weight:600;margin-top:6px;}
  .flow-s{font-size:11.5px;color:var(--ink3);margin-top:2px;}
  .flow-arrow{display:flex;align-items:center;color:var(--ink3);flex:0 0 auto;}
  @media(max-width:1000px){.flow{flex-wrap:wrap;}.flow-arrow{display:none;}.flow-tile{flex:1 1 44%;}}
  /* ---- misc ---- */
  .link-btn{border:none;background:none;color:var(--gold2);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;padding:0;}
  .link-btn:hover{text-decoration:underline;}
  .who{display:inline-flex;align-items:center;gap:9px;font-weight:500;color:var(--ink);}
  .ini{width:30px;height:30px;border-radius:50%;background:var(--bg);color:var(--ink2);font-size:10.5px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;letter-spacing:.02em;}
  .set-2col{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start;}
  @media(max-width:900px){.set-2col{grid-template-columns:1fr;}}

  /* ---- Quote line items: tariff-aware ---- */
  .ln-descwrap{flex:1;min-width:0;position:relative;display:flex;align-items:center;}
  .ln-unit{position:absolute;right:8px;font-size:10px;color:var(--ink3);background:var(--bg);border-radius:4px;padding:1px 5px;pointer-events:none;}
  .ln-vat{flex:0 0 auto;width:38px;height:30px;border:1px solid var(--line);background:#fff;border-radius:6px;color:var(--ink3);font-size:10px;font-weight:700;letter-spacing:.04em;cursor:pointer;}
  .ln-vat.on{background:var(--ox2);border-color:var(--gold2);color:var(--gold2);}
  .ln-min{margin-left:5px;font-size:9px;font-weight:700;color:var(--st-transit);background:var(--bg-transit);border-radius:4px;padding:1px 4px;vertical-align:middle;letter-spacing:.03em;}
  .ln-sums{margin-top:10px;display:flex;flex-direction:column;gap:0;border-top:1px solid var(--line);padding-top:4px;}
  .ln-sumrow{display:flex;justify-content:space-between;align-items:baseline;padding:5px 13px;font-size:12.5px;color:var(--ink2);}
  .ln-sumrow .mono{color:var(--ink);}

  /* ---- service catalog ---- */
  .gl-code{font-family:'SF Mono',ui-monospace,monospace;font-size:10.5px;letter-spacing:.02em;color:var(--ink2);background:var(--bg);border:1px solid var(--line);border-radius:5px;padding:2px 7px;white-space:nowrap;}
  /* ---- job classification chips ---- */
  .job-chips{display:inline-flex;flex-wrap:wrap;gap:5px;align-items:center;}
  /* ---- collection / delivery address rows ---- */
  .addr-block{margin:6px 0 4px;}
  .addr-row{display:flex;align-items:center;gap:8px;margin-bottom:7px;}
  .addr-row input{padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:12.5px;color:var(--ink);outline:none;font-family:inherit;}
  .addr-row input:focus{border-color:var(--gold);}
  .addr-label{width:150px;flex:0 0 auto;}
  .addr-addr{flex:1;min-width:0;}
  .addr-contact{width:130px;flex:0 0 auto;}
  .addr-date{width:140px;flex:0 0 auto;}
  @media(max-width:880px){.addr-row{flex-wrap:wrap;}.addr-label,.addr-contact,.addr-date{width:100%;}}

  /* ---- quote: customer card ---- */
  .cust-card{display:grid;grid-template-columns:1fr 1fr;gap:4px 22px;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:11px 15px;margin:4px 0 14px;}
  .cust-row{display:flex;gap:8px;font-size:12.5px;}
  .cust-k{color:var(--ink3);min-width:74px;}
  /* ---- quote: volume / chargeable-weight calculator ---- */
  .calc{border:1px solid var(--line);border-radius:11px;padding:12px 14px;margin:6px 0 14px;background:#fff;}
  .calc-add{display:flex;gap:8px;align-items:center;}
  .calc-add select{padding:6px 9px;border:1px solid var(--line);border-radius:6px;font-size:12px;color:var(--ink2);background:#fff;outline:none;font-family:inherit;}
  .calc-table{margin-top:6px;}
  .calc-hrow,.calc-row{display:grid;grid-template-columns:1fr 52px 52px 52px 46px 70px 60px 60px 64px;gap:6px;align-items:center;}
  .calc-hrow{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--ink3);padding:0 2px 5px;}
  .calc-hrow span:not(:first-child),.calc-row .calc-n,.calc-row .calc-out{text-align:right;}
  .calc-row{margin-bottom:6px;}
  .calc-row input{padding:6px 7px;border:1px solid var(--line);border-radius:6px;font-size:12px;color:var(--ink);outline:none;font-family:inherit;width:100%;}
  .calc-row input:focus{border-color:var(--gold);}
  .calc-n{text-align:right;}
  .calc-out{font-size:12px;color:var(--ink2);}
  .calc-acts{display:flex;gap:3px;justify-content:flex-end;}
  .calc-acts button{width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);background:#fff;border-radius:6px;color:var(--ink3);cursor:pointer;}
  .calc-acts button:hover{border-color:var(--gold2);color:var(--gold2);}
  .calc-acts button:disabled{opacity:.5;cursor:default;}
  .calc-totals{display:flex;gap:20px;flex-wrap:wrap;justify-content:flex-end;border-top:1px solid var(--line);margin-top:6px;padding-top:9px;font-size:12px;color:var(--ink2);}
  .calc-totals b{color:var(--ink);margin-left:5px;}
  .calc-hint{font-size:10.5px;color:var(--ink3);margin-top:9px;line-height:1.5;}
  /* ---- quote: configuration bar ---- */
  .cfg-bar{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;margin:4px 0 8px;}
  .cfg-pick{display:flex;flex-direction:column;gap:5px;flex:1;min-width:240px;}
  .cfg-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--gold2);}
  .cfg-pick select{padding:9px 11px;border:1px solid var(--gold2);border-radius:7px;background:rgba(240,253,99,.08);font-size:12.5px;color:var(--ink);outline:none;font-family:inherit;}
  .ln-pickwrap{flex:1;min-width:200px;}
  /* ---- quote: leg-grouped lines ---- */
  .leg-block{margin-bottom:10px;}
  .leg-head{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#fff;background:var(--navy);border-radius:7px;padding:7px 12px;margin-bottom:8px;}
  @media(max-width:880px){.cust-card{grid-template-columns:1fr;}.calc-hrow,.calc-row{grid-template-columns:1fr 44px 44px 44px 56px 56px;}.calc-hrow span:nth-child(7),.calc-hrow span:nth-child(8),.calc-hrow span:nth-child(9),.calc-row .calc-out,.calc-row .calc-acts{display:none;}}

  /* ---- quote: AI intake into calculator ---- */
  .calc-intake{margin:8px 0;border:1px dashed var(--line);border-radius:9px;padding:10px;background:var(--bg);}
  .calc-intake textarea{width:100%;border:1px solid var(--line);border-radius:6px;padding:9px 11px;font-size:12.5px;font-family:inherit;color:var(--ink);outline:none;resize:vertical;line-height:1.5;}
  .calc-intake textarea:focus{border-color:var(--gold);}
  .calc-intake-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:8px;}
  .cust-row.cust-full{grid-column:1 / -1;}
  /* ---- quote: per-line cost & margin ---- */
  .cost-row{display:flex;align-items:center;gap:8px;margin:0 0 6px 0;padding:5px 8px;background:var(--bg);border-radius:6px;font-size:11.5px;}
  .cost-for{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink3);}
  .cost-vendor{padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:11.5px;color:var(--ink2);outline:none;font-family:inherit;max-width:170px;}
  .cost-vendor:focus{border-color:var(--gold);}
  .cost-lbl{color:var(--ink3);text-transform:uppercase;font-size:10px;letter-spacing:.04em;}
  .cost-in{width:90px;text-align:right;padding:5px 8px;border:1px solid var(--line);border-radius:6px;font-size:12px;font-family:inherit;color:var(--ink);outline:none;}
  .cost-in:focus{border-color:var(--gold);}
  .cost-margin{width:96px;text-align:right;color:var(--gold2);font-weight:600;}
  .cost-margin.neg{color:var(--st-transit);}
  .ln-margin{display:flex;justify-content:space-between;font-size:12px;color:var(--ink2);border-top:1px dashed var(--line);margin-top:6px;padding-top:7px;}
  .ln-margin .mono{color:var(--gold2);font-weight:700;}.ln-margin .mono.neg{color:var(--st-transit);}
  /* ---- quote: terms & exclusions editor ---- */
  .terms-cols{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:16px 0 4px;}
  .term-row{display:flex;align-items:center;gap:7px;margin-bottom:6px;}
  .term-row input{flex:1;padding:7px 9px;border:1px solid var(--line);border-radius:6px;font-size:12px;font-family:inherit;color:var(--ink);outline:none;}
  .term-row input:focus{border-color:var(--gold);}
  .set-wide{grid-column:1 / -1;}
  @media(max-width:880px){.terms-cols{grid-template-columns:1fr;}.cost-row{flex-wrap:wrap;}}

  /* ---- full-page estimate ---- */
  .estimate-page{display:flex;flex-direction:column;margin:-4px 0 0;}
  .est-bar{display:flex;align-items:center;gap:14px;padding:12px 4px 14px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:5;}
  .est-bar-title h1{font-size:18px;font-weight:800;margin:0;color:var(--ink);}
  .est-bar-sub{font-size:12px;color:var(--ink3);}
  .est-bar-margin{display:flex;flex-direction:column;align-items:flex-end;padding:4px 14px;background:var(--navy);border-radius:9px;}
  .ebm-k{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:rgba(255,255,255,.6);}
  .ebm-v{font-size:14px;font-weight:700;color:var(--gold);}.ebm-v.neg{color:#F0997B;}
  .est-body{padding:16px 2px 40px;}
  .est-body .form-grid{margin-bottom:14px;}
  /* ---- markup bar ---- */
  .markup-bar{display:flex;align-items:center;gap:9px;flex-wrap:wrap;background:rgba(240,253,99,.10);border:1px solid var(--gold2);border-radius:9px;padding:9px 12px;margin:2px 0 12px;}
  .markup-bar select{padding:6px 9px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:12.5px;color:var(--ink);outline:none;font-family:inherit;}
  .markup-val{width:74px;padding:6px 9px;border:1px solid var(--line);border-radius:6px;font-size:12.5px;text-align:right;outline:none;font-family:inherit;}
  /* ---- cost row extras ---- */
  .cost-basis{padding:5px 6px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:11px;color:var(--ink2);outline:none;font-family:inherit;}
  .cost-mk{padding:5px 8px;border:1px solid var(--gold2);background:rgba(240,253,99,.12);border-radius:6px;font-size:11px;color:var(--gold2);font-weight:600;cursor:pointer;white-space:nowrap;}
  .cost-mk:hover{background:rgba(240,253,99,.28);}
  /* ---- role chip ---- */
  .role-chip{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:1px solid rgba(255,255,255,.12);background:transparent;border-radius:9px;cursor:pointer;margin-bottom:8px;text-align:left;}
  .role-chip:hover{background:rgba(255,255,255,.05);}
  .role-dot{width:9px;height:9px;border-radius:50%;flex:0 0 auto;}
  .role-dot.is-admin{background:var(--gold);}.role-dot.is-op{background:var(--ink3);}
  /* ---- GL label inline edit ---- */
  .gl-label-in{width:100%;max-width:320px;padding:6px 9px;border:1px solid transparent;border-radius:6px;background:transparent;font-size:13px;color:var(--ink);font-family:inherit;outline:none;}
  .gl-label-in:hover{border-color:var(--line);}.gl-label-in:focus{border-color:var(--gold);background:#fff;}

  /* ---- leads: quick add + follow-up banner ---- */
  .quick-add{display:flex;align-items:center;gap:10px;background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:9px 13px;margin-bottom:14px;}
  .quick-add svg{color:var(--gold2);flex:0 0 auto;}
  .quick-add input{flex:1;border:none;background:transparent;font-size:13.5px;color:var(--ink);outline:none;font-family:inherit;}
  .fu-banner{display:flex;align-items:center;gap:11px;background:rgba(240,253,99,.12);border:1px solid var(--gold2);border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:12.5px;color:var(--ink2);}
  .fu-banner svg{color:var(--gold2);flex:0 0 auto;}.fu-banner b{color:var(--ink);}.fu-banner .spacer{flex:1;}
  .row-acts{display:flex;gap:6px;justify-content:flex-end;align-items:center;white-space:nowrap;}
  .icon-btn-sm{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);background:#fff;border-radius:7px;color:var(--ink3);cursor:pointer;}
  .icon-btn-sm:hover{border-color:var(--gold2);color:var(--gold2);}
  /* ---- estimate document — ARTECO house style ---- */
  .qdoc-shell{background:var(--panel);border-radius:14px;width:min(880px,94vw);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.4);}
  .qdoc-bar{flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:11px 16px;border-bottom:1px solid var(--line);font-size:13px;font-weight:600;color:var(--ink);}
  .qdoc-bar .spacer{flex:1;}
  .qdoc-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;padding:26px;background:#e9e9e6;}
  .qdoc{background:#fff;color:var(--ink);max-width:760px;margin:0 auto;padding:0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:1.5;-webkit-font-smoothing:antialiased;box-shadow:0 6px 30px rgba(0,0,0,.14);border-radius:10px;overflow:hidden;}
  .qdoc-head{background:var(--navy);padding:20px 36px;border-bottom:3px solid var(--gold);}
  .qdoc-top{display:flex;justify-content:space-between;align-items:center;}
  .qdoc-logo{height:30px;width:auto;max-width:240px;object-fit:contain;}
  .qdoc-addr{font-size:9.5px;letter-spacing:.04em;color:var(--ink3);margin-top:5px;text-transform:uppercase;}
  .qdoc-doctype{font-size:12px;font-weight:700;letter-spacing:.22em;color:#fff;text-transform:uppercase;border:1.5px solid rgba(255,255,255,.45);border-radius:6px;padding:5px 12px;}
  .qdoc-body{padding:24px 40px 36px;}
  .qdoc-meta{display:flex;justify-content:space-between;margin:0 0 18px;align-items:flex-start;gap:30px;}
  .qdoc-meta .lbl{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);font-weight:700;margin-bottom:3px;}
  .qdoc-meta .who{font-weight:700;font-size:14px;color:var(--ink);}
  .qdoc-metatbl td{padding:2px 0;font-size:11px;color:var(--ink2);}.qdoc-metatbl td.r{text-align:right;padding-left:26px;font-weight:700;color:var(--ink);}
  .qdoc-refrow{display:flex;justify-content:space-between;gap:16px;background:var(--bg);border-radius:8px;padding:10px 14px;font-size:12px;margin-bottom:18px;}
  .qdoc-refrow .lbl{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);font-weight:700;}
  .qdoc-spec{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:9px;overflow:hidden;margin-bottom:8px;}
  .qdoc-spec .sc{background:#fff;padding:9px 12px;}
  .qdoc-spec .sc.wide{grid-column:span 2;}
  .qdoc-spec .k{font-size:8.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-weight:700;margin-bottom:3px;}
  .qdoc-spec .v{font-size:12px;color:var(--ink);font-weight:600;}
  .qdoc-spec .v .dim{display:block;font-weight:500;font-size:11px;color:var(--ink2);}
  .qdoc-h{background:var(--navy);color:#fff;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:8px 13px;border-radius:7px;margin:22px 0 0;}
  .qdoc-items{width:100%;border-collapse:collapse;margin-top:6px;}
  .qdoc-items th{text-align:left;border-bottom:1px solid var(--line);padding:6px;font-size:8.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink3);font-weight:700;}
  .qdoc-items td{padding:5px 6px;border-bottom:1px solid var(--line2);font-size:10.5px;color:var(--ink);}
  .qdoc-items th.amt,.qdoc-items td.amt{text-align:right;white-space:nowrap;width:84px;}
  .qdoc-items th.n,.qdoc-items td.n{width:26px;color:var(--ink3);}
  .qdoc-charges{width:100%;border-collapse:collapse;margin-top:4px;}
  .qdoc-charges th{text-align:left;border-bottom:1px solid var(--line);padding:8px 6px;font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-weight:700;}
  .qdoc-charges th.pd,.qdoc-charges td.pd{text-align:center;width:96px;}
  .qdoc-charges th.amt,.qdoc-charges td.amt{text-align:right;white-space:nowrap;width:122px;}
  .qdoc-charges td{padding:3.5px 6px;border-bottom:1px solid var(--line2);font-size:10.5px;color:var(--ink2);}
  .qdoc-charges td.pd{color:var(--ink3);font-size:10.5px;}
  .qdoc-charges tr.leg td{font-weight:700;color:var(--navy);background:var(--bg);border-bottom:none;padding:6px;text-transform:uppercase;font-size:9.5px;letter-spacing:.05em;}
  .qdoc-charges tr.sub td{font-weight:700;color:var(--ink);border-top:1px solid var(--line);border-bottom:1.5px solid var(--navy);}
  .qdoc-total{display:flex;justify-content:flex-end;align-items:center;gap:16px;margin-top:14px;}
  .qdoc-total .tl{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink2);font-weight:700;}
  .qdoc-total .tv{background:var(--navy);color:var(--gold);font-weight:800;font-size:16px;padding:9px 18px;border-radius:9px;min-width:150px;text-align:right;}
  .qdoc-terms{margin-top:20px;font-size:9.7px;color:var(--ink2);line-height:1.65;}
  .qdoc-terms h4{margin:0 0 5px;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-weight:700;}

  .filter-row{margin-top:-8px;}
  .filter-row .search{flex:0 1 340px;}

  /* ---- row action dropdown ---- */
  .row-menu-wrap{display:inline-flex;}
  .rm-dots{font-size:17px;line-height:1;font-weight:800;letter-spacing:1.5px;}
  .rm-back{position:fixed;inset:0;z-index:80;}
  .rm-pop{position:fixed;z-index:81;transform:translateX(-100%);background:#fff;border:1px solid var(--line);border-radius:10px;box-shadow:0 14px 38px rgba(12,28,52,.18);padding:5px;min-width:172px;display:flex;flex-direction:column;}
  .rm-item{text-align:left;padding:8px 12px;border:none;background:none;font-size:12.5px;color:var(--ink);border-radius:6px;cursor:pointer;font-family:inherit;white-space:nowrap;}
  .rm-item:hover{background:var(--bg);}
  .rm-item.danger{color:var(--st-transit);}
  .status-cell{display:inline-flex;min-width:96px;}

  /* ---- open tabs + back ---- */
  .tabstrip{display:flex;align-items:center;gap:8px;padding:8px 26px 0;background:var(--bg);}
  .tab-back{flex:0 0 auto;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);background:var(--panel);border-radius:8px;color:var(--ink2);cursor:pointer;}
  .tab-back:hover:not(:disabled){border-color:var(--navy);color:var(--navy);}
  .tab-back:disabled{opacity:.4;cursor:default;}
  .tabstrip-tabs{display:flex;gap:4px;overflow-x:auto;flex:1;scrollbar-width:none;}
  .tabstrip-tabs::-webkit-scrollbar{display:none;}
  .tab{display:inline-flex;align-items:center;gap:7px;padding:7px 10px 7px 12px;background:var(--panel);border:1px solid var(--line);border-bottom:none;border-radius:9px 9px 0 0;font-size:12px;color:var(--ink2);cursor:pointer;white-space:nowrap;max-width:200px;}
  .tab svg{flex:0 0 auto;color:var(--ink3);}
  .tab span{overflow:hidden;text-overflow:ellipsis;}
  .tab:hover{color:var(--ink);}
  .tab.active{color:var(--navy);font-weight:600;border-color:transparent;background:var(--panel);box-shadow:inset 0 2px 0 var(--gold);}
  .tab.active svg{color:var(--gold2);}
  .tab-x{flex:0 0 auto;width:16px;height:16px;display:flex;align-items:center;justify-content:center;border:none;background:none;color:var(--ink3);border-radius:4px;cursor:pointer;}
  .tab-x:hover{background:var(--bg);color:var(--st-transit);}

  .tab.pinned{background:var(--panel);}
  .tab-pindot{flex:0 0 auto;border:none;background:none;color:var(--gold2);font-size:9px;line-height:1;cursor:pointer;padding:2px;border-radius:4px;}
  .tab-pindot:hover{background:var(--bg);}
  .tabstrip-hint{flex:0 0 auto;font-size:10.5px;color:var(--ink3);margin-left:auto;padding-left:12px;white-space:nowrap;}
  @media(max-width:760px){.tabstrip-hint{display:none;}}

  /* ---- operator job cockpit ---- */
  .cockpit{display:flex;flex-direction:column;}
  .cock-head{display:flex;align-items:center;gap:14px;padding:4px 2px 14px;border-bottom:1px solid var(--line);}
  .cock-title h1{font-size:18px;font-weight:800;margin:0;color:var(--ink);display:flex;align-items:center;gap:10px;}
  .cock-title span{font-size:12px;color:var(--ink3);}
  .cock-status{padding:8px 11px;border:1px solid var(--line);border-radius:7px;background:#fff;font-size:12.5px;color:var(--ink);outline:none;font-family:inherit;}
  .cock-tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin:0 0 16px;overflow-x:auto;}
  .cock-tab{padding:11px 15px;border:none;background:none;font-size:13px;color:var(--ink2);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;font-family:inherit;}
  .cock-tab:hover{color:var(--ink);}
  .cock-tab.on{color:var(--navy);font-weight:700;border-bottom-color:var(--gold2);}
  .cock-body{padding-bottom:30px;}
  .cock-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px;}
  .cock-card{background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:14px 16px;margin-bottom:12px;}
  .cock-kv{display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink2);padding:3px 0;}
  .cock-kv b{color:var(--ink);}
  .cock-prog{display:flex;flex-direction:column;gap:6px;}
  .cock-prog-bar{height:7px;background:var(--bg);border-radius:4px;overflow:hidden;}
  .cock-prog-bar span{display:block;height:100%;background:var(--gold2);border-radius:4px;}
  .cock-objs{display:flex;flex-direction:column;gap:6px;}
  .cock-obj{display:grid;grid-template-columns:120px 1fr auto;gap:10px;align-items:center;font-size:12.5px;color:var(--ink);padding:6px 0;border-bottom:1px solid var(--line2);}
  .cock-notes{font-size:12.5px;color:var(--ink2);margin:0;line-height:1.55;}
  .cock-2col{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
  .cock-col{background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:14px 16px;}
  .cock-entry{border:1px solid var(--line);border-radius:9px;padding:9px;margin-bottom:9px;display:flex;flex-direction:column;gap:6px;}
  .cock-entry-top{display:flex;gap:6px;align-items:center;}
  .cock-in{flex:1;min-width:0;padding:6px 9px;border:1px solid var(--line);border-radius:6px;font-size:12px;font-family:inherit;color:var(--ink);outline:none;}
  .cock-in:focus{border-color:var(--gold);}
  .cock-sel{padding:6px 8px;border:1px solid var(--line);border-radius:6px;font-size:11.5px;font-family:inherit;background:#fff;color:var(--ink2);outline:none;}
  .cock-date{flex:0 0 140px;}
  .cock-crew-group{margin-bottom:16px;}
  .cock-chips{display:flex;flex-wrap:wrap;gap:7px;}
  .cock-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border:1px solid var(--line);background:#fff;border-radius:20px;font-size:12px;color:var(--ink2);cursor:pointer;font-family:inherit;}
  .cock-chip:hover{border-color:var(--gold2);}
  .cock-chip.on{background:var(--navy);border-color:var(--navy);color:#fff;}
  .cock-chip.on svg{color:var(--gold);}
  .cock-freight .form-grid{margin-bottom:14px;}
  .cock-seed{text-align:center;padding:24px;}
  .cock-ops{display:flex;flex-direction:column;gap:4px;}
  .cock-op{display:flex;align-items:center;gap:10px;padding:7px 6px;border-bottom:1px solid var(--line2);}
  .cock-op.done .cock-op-in{color:var(--ink3);text-decoration:line-through;}
  .cock-check{flex:0 0 auto;border:none;background:none;cursor:pointer;color:var(--gold2);display:flex;align-items:center;padding:0;}
  .cock-circle{display:block;width:16px;height:16px;border:2px solid var(--ink3);border-radius:50%;}
  .cock-op-in{flex:1;border:none;background:none;font-size:13px;color:var(--ink);outline:none;font-family:inherit;padding:3px;}
  .cock-op-in:focus{background:var(--bg);border-radius:5px;}
  @media(max-width:980px){.cock-grid{grid-template-columns:1fr 1fr;}.cock-2col{grid-template-columns:1fr;}}

  /* ---- cockpit: dark headings + workflow diary (aligned to estimate) ---- */
  .cock-h{display:flex;align-items:center;gap:9px;background:var(--navy);color:#fff;border-radius:8px;padding:9px 14px;margin:0 0 12px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;}
  .cock-summary{display:grid;grid-template-columns:1.6fr 1fr;gap:12px;margin-bottom:12px;}
  .cock-sum-main,.cock-next{background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:14px 16px;}
  .cock-sum-line{font-size:13px;color:var(--ink);line-height:1.55;margin:0 0 14px;}
  .cock-next-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;}
  .cock-next-list li{font-size:12.5px;color:var(--ink);display:flex;flex-direction:column;gap:1px;}
  .cock-next-list li .muted{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;}
  .cock-agents{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;}
  .cock-agent{display:flex;flex-direction:column;gap:2px;background:var(--bg);border:1px solid var(--line);border-radius:9px;padding:10px 12px;font-size:12px;color:var(--ink);}
  .cock-agent .muted{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;}
  .cock-col-acts{display:flex;gap:6px;margin-bottom:10px;}
  .wf-stage{border:1px solid var(--line);border-radius:10px;margin-bottom:12px;overflow:hidden;}
  .wf-stage-head{display:flex;align-items:center;gap:10px;background:var(--navy);color:#fff;padding:8px 13px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;}
  .wf-stage-head .muted{color:rgba(255,255,255,.6);}
  .wf-stage-head .spacer{flex:1;}
  .wf-add{border:none;background:rgba(255,255,255,.14);color:#fff;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
  .wf-add:hover{background:rgba(255,255,255,.26);}
  .wf-task{display:flex;align-items:center;gap:9px;padding:8px 12px;border-bottom:1px solid var(--line2);}
  .wf-task:last-child{border-bottom:none;}
  .wf-task.done .wf-task-in{color:var(--ink3);text-decoration:line-through;}
  .wf-task-main{flex:1;min-width:0;display:flex;align-items:center;gap:7px;}
  .wf-task-in{flex:1;min-width:0;border:none;background:none;font-size:13px;color:var(--ink);outline:none;font-family:inherit;padding:3px;}
  .wf-task-in:focus{background:var(--bg);border-radius:5px;}
  .wf-obj{flex:0 0 auto;font-size:10px;font-weight:700;color:var(--gold2);background:rgba(100,107,0,.10);border-radius:5px;padding:2px 7px;font-family:ui-monospace,monospace;}
  .wf-assignee{flex:0 0 auto;max-width:140px;padding:5px 8px;border:1px solid var(--line);border-radius:6px;font-size:11.5px;font-family:inherit;background:#fff;color:var(--ink2);outline:none;}
  .wf-ticket{flex:0 0 auto;border:1px solid var(--line);background:#fff;width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--ink2);cursor:pointer;}
  .wf-ticket:hover{border-color:var(--navy);color:var(--navy);}
  @media(max-width:980px){.cock-summary{grid-template-columns:1fr;}.cock-agents{grid-template-columns:1fr;}.wf-assignee{max-width:110px;}}

  .tb-left{display:flex;align-items:center;gap:12px;}
  .tb-back-btn{flex:0 0 auto;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);background:var(--panel);border-radius:9px;color:var(--ink2);cursor:pointer;}
  .tb-back-btn:hover{border-color:var(--navy);color:var(--navy);}

  .wf-role{flex:0 0 auto;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink2);background:var(--bg);border:1px solid var(--line);border-radius:5px;padding:2px 6px;}
  .wf-assignee.unassigned{color:var(--ink3);border-style:dashed;}

  .alert-row.notif{cursor:pointer;align-items:flex-start;}
  .alert-row.notif:hover{background:var(--bg);}
  .alert-row.notif.unread .alert-dot{background:var(--gold2);}
  .alert-row.notif .alert-main b{color:var(--ink);}

  /* ---- my tasks ---- */
  .mt-as{display:flex;align-items:center;gap:9px;}
  .mt-job{margin-bottom:14px;}
  .mt-job-head{cursor:pointer;}
  .mt-job-head:hover h2{color:var(--navy);}
  .mt-job-head h2{font-size:14px;}
  .mt-job-r{display:flex;align-items:center;gap:12px;}
  .mt-count{font-size:11px;font-weight:700;color:var(--gold2);background:rgba(100,107,0,.10);border-radius:20px;padding:3px 10px;}
  .mt-tasks{display:flex;flex-direction:column;}
  .mt-task{display:flex;align-items:center;gap:11px;padding:10px 16px;border-top:1px solid var(--line2);}
  .mt-task.done .mt-task-label{color:var(--ink3);text-decoration:line-through;}
  .mt-task-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;}
  .mt-task-label{font-size:13px;color:var(--ink);}
  .mt-task-meta{font-size:10.5px;color:var(--ink3);text-transform:uppercase;letter-spacing:.04em;}

  /* ---- documents & communications ---- */
  .docs-actions{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
  .docs-upl{cursor:pointer;}
  .docs-log{background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:11px;margin-bottom:14px;}
  .docs-log-row{display:flex;gap:7px;align-items:center;margin-bottom:7px;}
  .docs-log-row .cock-in{flex:1;}
  .docs-ta{width:100%;border:1px solid var(--line);border-radius:7px;padding:8px 10px;font-size:12.5px;font-family:inherit;color:var(--ink);outline:none;resize:vertical;min-height:38px;background:#fff;}
  .docs-ta:focus{border-color:var(--gold);}
  .docs-tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin-bottom:10px;}
  .docs-tab{padding:8px 13px;border:none;background:none;font-size:12.5px;color:var(--ink2);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;font-family:inherit;}
  .docs-tab.on{color:var(--navy);font-weight:700;border-bottom-color:var(--gold2);}
  .docs-list{display:flex;flex-direction:column;gap:8px;}
  .docs-item{display:flex;gap:11px;align-items:flex-start;border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:#fff;}
  .docs-item.k-system{background:var(--bg);}
  .docs-ico{flex:0 0 auto;width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:var(--bg);color:var(--ink2);}
  .docs-item.k-system .docs-ico{background:#fff;}
  .docs-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
  .docs-title{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--ink);flex-wrap:wrap;}
  .docs-dir{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink2);background:var(--bg);border-radius:5px;padding:2px 6px;}
  .docs-body{font-size:12px;color:var(--ink2);line-height:1.5;white-space:pre-wrap;}
  .docs-item-acts{display:flex;gap:5px;align-items:center;flex:0 0 auto;}

  /* ---- AI request intake ---- */
  .ri-shell{background:var(--panel);border-radius:14px;width:min(820px,95vw);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.4);}
  .ri-bar{flex:0 0 auto;display:flex;align-items:center;gap:9px;padding:12px 16px;border-bottom:1px solid var(--line);font-size:13.5px;font-weight:700;color:var(--ink);}
  .ri-bar .spacer{flex:1;}
  .ri-bar svg{color:var(--gold2);}
  .ri-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;padding:18px;}
  .ri-input p{margin:0 0 12px;font-size:13px;}
  .ri-ta{width:100%;min-height:200px;border:1px solid var(--line);border-radius:10px;padding:12px 14px;font-size:13px;font-family:inherit;color:var(--ink);outline:none;resize:vertical;line-height:1.55;}
  .ri-ta:focus{border-color:var(--gold);}
  .ri-input-acts{display:flex;align-items:center;gap:10px;margin-top:12px;}
  .ri-input-acts .spacer{flex:1;}
  .ri-summary{font-size:13.5px;color:var(--ink);background:var(--bg);border-left:3px solid var(--gold2);border-radius:0 8px 8px 0;padding:10px 13px;margin:0 0 14px;}
  .ri-2col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:6px 0 14px;}
  .ri-2col .cock-in{margin-bottom:7px;}
  .ri-foot,.ri-input-acts{align-items:center;}
  .ri-foot{display:flex;gap:10px;align-items:center;margin-top:16px;padding-top:14px;border-top:1px solid var(--line);}
  .ri-foot .spacer{flex:1;}
  .intake-err{background:rgba(220,80,80,.08);border:1px solid rgba(220,80,80,.3);color:#a23;border-radius:8px;padding:9px 12px;font-size:12.5px;margin-bottom:12px;}
  @media(max-width:760px){.ri-2col{grid-template-columns:1fr;}}

  /* ---- sidebar groups (collapsible, inline items) ---- */
  .nav-group{margin-bottom:2px;}
  .nav-group .nav-caret{margin-left:auto;color:var(--ink3);display:flex;}
  .nav-sub{display:flex;flex-direction:column;gap:1px;margin:1px 0 5px;}
  .nav-subitem{display:flex;align-items:center;gap:9px;width:100%;padding:7px 12px 7px 34px;border:none;background:none;color:rgba(255,255,255,.62);font-size:12.5px;cursor:pointer;border-radius:8px;font-family:inherit;text-align:left;}
  .nav-subitem svg{color:rgba(255,255,255,.4);flex:0 0 auto;}
  .nav-subitem:hover{background:rgba(255,255,255,.05);color:#fff;}
  .nav-subitem.active{background:rgba(240,253,99,.13);color:#fff;font-weight:600;}
  .nav-subitem.active svg{color:var(--gold);}
  .nav-group.dom-active>.nav-item{color:#fff;}
  /* ---- user chip + logout ---- */
  .user-chip{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:1px solid rgba(255,255,255,.12);background:transparent;border-radius:9px;margin-bottom:8px;}
  .user-avatar{flex:0 0 auto;width:30px;height:30px;border-radius:50%;background:var(--gold);color:var(--navy);font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;}
  .user-logout{margin-left:auto;border:none;background:none;color:rgba(255,255,255,.5);cursor:pointer;display:flex;padding:4px;border-radius:6px;}
  .user-logout:hover{background:rgba(255,255,255,.1);color:#fff;}
  /* ---- login ---- */
  .login-wrap{min-height:100vh;display:grid;grid-template-columns:1.1fr .9fr;background:var(--navy);}
  .login-hero{position:relative;overflow:hidden;padding:64px 56px;display:flex;flex-direction:column;justify-content:center;color:#fff;background:radial-gradient(1200px 600px at 0% 0%, rgba(240,253,99,.10), transparent 60%), var(--navy);}
  .login-hero-in{position:relative;z-index:1;}
  .topo-hero{position:absolute;top:18px;right:18px;left:auto;bottom:auto;width:72%;max-width:560px;height:auto;transform:none;pointer-events:none;}
  .topo-hero path{stroke:rgba(240,253,99,.18);stroke-width:1;vector-effect:non-scaling-stroke;fill:none;}
  .login-logo{display:block;align-self:flex-start;height:42px;width:auto;max-width:260px;object-fit:contain;object-position:left center;margin:0 0 34px;}
  .login-h1{font-size:34px;font-weight:800;line-height:1.12;margin:0 0 16px;max-width:14ch;}
  .login-lead{font-size:15px;line-height:1.6;color:rgba(255,255,255,.72);max-width:46ch;margin:0 0 30px;}
  .login-feats{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:11px;}
  .login-feats li{display:flex;align-items:center;gap:11px;font-size:13.5px;color:rgba(255,255,255,.86);}
  .login-feats svg{color:var(--gold);flex:0 0 auto;}
  .login-card{background:var(--bg);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:40px;}
  .login-card-in{width:100%;max-width:340px;}
  .login-card h2{font-size:22px;font-weight:800;margin:0 0 4px;color:var(--ink);}
  .login-field{display:block;margin-top:16px;}
  .login-field span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink3);font-weight:700;margin-bottom:5px;}
  .login-field input{width:100%;padding:11px 13px;border:1px solid var(--line);border-radius:9px;font-size:14px;font-family:inherit;color:var(--ink);outline:none;background:#fff;}
  .login-field input:focus{border-color:var(--navy);}
  .login-btn{width:100%;justify-content:center;margin-top:22px;padding:12px;font-size:14px;}
  .login-demo{margin-top:22px;padding-top:18px;border-top:1px solid var(--line);}
  .login-demo-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
  .login-demo-chip{font-size:11px;border:1px solid var(--line);background:#fff;border-radius:20px;padding:5px 10px;cursor:pointer;color:var(--ink2);font-family:inherit;}
  .login-demo-chip:hover{border-color:var(--navy);color:var(--navy);}
  .login-foot{margin-top:30px;}
  @media(max-width:860px){.login-wrap{grid-template-columns:1fr;}.login-hero{padding:40px 32px;}.login-h1{font-size:26px;}}

  /* ---- operations overview ---- */
  .ops-prog{display:flex;align-items:center;gap:8px;}
  .ops-prog-bar{flex:1;height:6px;background:var(--bg);border-radius:4px;overflow:hidden;}
  .ops-prog-bar span{display:block;height:100%;background:var(--gold2);border-radius:4px;}
  .load-list{display:flex;flex-direction:column;}
  .load-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line2);}
  .load-row:last-child{border-bottom:none;}
  .load-name{font-size:13px;color:var(--ink);}
  .load-n{font-size:12px;font-weight:700;color:var(--gold2);background:rgba(100,107,0,.10);border-radius:20px;padding:2px 10px;}

  .dash-cols{display:grid;grid-template-columns:1.7fr 1fr;gap:18px;}
  @media(max-width:1000px){.dash-cols{grid-template-columns:1fr;}}

  /* ---- dispatch calendar ---- */
  .disp-bar{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;}
  .disp-nav{display:flex;align-items:center;gap:7px;}
  .disp-range{font-size:14px;font-weight:700;color:var(--ink);margin-left:8px;}
  .disp-noted{background:rgba(100,107,0,.10);border:1px solid rgba(100,107,0,.25);color:var(--gold2);border-radius:8px;padding:8px 12px;font-size:12.5px;margin-bottom:12px;}
  .cal{display:grid;gap:8px;margin-bottom:18px;}
  .cal-week{grid-template-columns:repeat(7,1fr);}
  .cal-day{grid-template-columns:1fr;}
  .cal-day{background:var(--panel);border:1px solid var(--line);border-radius:10px;min-height:150px;display:flex;flex-direction:column;overflow:hidden;}
  .cal-day.today{border-color:var(--gold2);box-shadow:inset 0 2px 0 var(--gold);}
  .cal-day-head{display:flex;align-items:baseline;justify-content:space-between;padding:8px 11px;border-bottom:1px solid var(--line2);}
  .cal-dow{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-weight:700;}
  .cal-date{font-size:15px;font-weight:800;color:var(--ink);}
  .cal-day.today .cal-date{color:var(--gold2);}
  .cal-events{padding:7px;display:flex;flex-direction:column;gap:6px;flex:1;}
  .cal-empty{color:var(--line);font-size:13px;text-align:center;padding:14px 0;}
  .cal-ev{text-align:left;border:none;border-radius:7px;padding:7px 8px;cursor:pointer;display:flex;flex-direction:column;gap:1px;font-family:inherit;border-left:3px solid;}
  .cal-ev.ev-collection{background:rgba(31,107,71,.08);border-left-color:#2e8b57;}
  .cal-ev.ev-delivery{background:rgba(100,107,0,.10);border-left-color:var(--gold2);}
  .cal-ev:hover{filter:brightness(.97);}
  .cal-ev-kind{font-size:8.5px;text-transform:uppercase;letter-spacing:.05em;font-weight:700;color:var(--ink2);}
  .cal-ev-label{font-size:12px;font-weight:600;color:var(--ink);line-height:1.2;}
  .cal-ev-meta{font-size:10px;color:var(--ink3);}
  .cal-day .cal-ev-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .clash-tag{font-size:10.5px;font-weight:700;color:#a23;background:rgba(220,80,80,.10);border-radius:5px;padding:2px 8px;}
  @media(max-width:900px){.cal-week{grid-template-columns:1fr;}}

  /* ---- railed sidebar with flyout overlays ---- */
  .sidebar.railed .nav{gap:2px;padding:4px 8px;overflow:visible;}
  .rail-item{position:relative;display:flex;align-items:center;gap:11px;width:100%;padding:9px 11px;border:none;background:none;color:rgba(255,255,255,.66);font-size:13px;cursor:pointer;border-radius:9px;font-family:inherit;text-align:left;}
  .rail-item svg{flex:0 0 auto;color:rgba(255,255,255,.55);}
  .rail-item:hover{background:rgba(255,255,255,.06);color:#fff;}
  .rail-item:hover svg{color:#fff;}
  .rail-item.active{background:rgba(240,253,99,.13);color:#fff;font-weight:600;}
  .rail-item.active svg{color:var(--gold);}
  .rail-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .rail-caret{flex:0 0 auto;color:rgba(255,255,255,.32);display:flex;}
  .rail-item:hover .rail-caret{color:rgba(255,255,255,.6);}
  .rail-fly{position:fixed;left:244px;z-index:1200;min-width:216px;background:rgba(29,29,29,.65);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);border:1px solid rgba(255,255,255,.16);border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.45);padding:7px;display:flex;flex-direction:column;gap:1px;animation:flyIn .12s ease;}
  @keyframes flyIn{from{opacity:0;transform:translateX(-6px);}to{opacity:1;transform:none;}}
  .rail-fly-head{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:rgba(255,255,255,.45);font-weight:700;padding:6px 11px 7px;}
  .rail-fly-item{display:flex;align-items:center;gap:10px;width:100%;padding:9px 11px;border:none;background:none;color:rgba(255,255,255,.82);font-size:13px;cursor:pointer;border-radius:8px;font-family:inherit;text-align:left;white-space:nowrap;}
  .rail-fly-item span{flex:1;color:inherit;}
  .rail-fly-item svg{flex:0 0 auto;color:rgba(255,255,255,.45);}
  .rail-fly-item:hover{background:rgba(255,255,255,.08);color:#fff;}
  .rail-fly-item:hover svg{color:var(--gold);}
  .rail-fly-item.active{background:rgba(240,253,99,.14);color:#fff;font-weight:600;}
  .rail-fly-item.active svg{color:var(--gold);}

  .login-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px;}
  .login-pill{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:rgba(255,255,255,.82);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:7px 13px;}
  .login-pill svg{color:var(--gold);}
  .login-site{display:inline-flex;align-items:center;gap:8px;margin-top:34px;font-size:13px;color:rgba(255,255,255,.6);text-decoration:none;letter-spacing:.02em;}
  .login-site:hover{color:var(--gold);}
  .login-site svg{color:var(--gold);}
  .login-tabs{display:flex;gap:6px;margin-bottom:18px;background:var(--bg);border-radius:10px;padding:4px;}
  .login-tab{flex:1;padding:9px;border:none;background:none;font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer;border-radius:8px;font-family:inherit;}
  .login-tab.on{background:#fff;color:var(--navy);box-shadow:0 1px 4px rgba(0,0,0,.08);}
  .login-foot a{color:inherit;text-decoration:underline;}
  @media(max-width:520px){.login-pills{gap:6px;}}

  .sacct-preview{margin-top:6px;padding:10px 13px;background:var(--bg);border-radius:9px;font-size:13px;color:var(--ink2);}
  .sacct-preview strong{color:var(--ink);}

  .sacct-warn{margin-top:8px;padding:9px 13px;background:rgba(220,80,80,.08);border:1px solid rgba(220,80,80,.3);color:#a23;border-radius:9px;font-size:12.5px;}

  /* ---- dispatch day schedule + resources ---- */
  .day-sched{display:flex;flex-direction:column;gap:9px;}
  .sched-ev{display:flex;gap:13px;align-items:stretch;border:1px solid var(--line);border-radius:11px;padding:12px 14px;cursor:pointer;background:#fff;border-left:4px solid;transition:border-color .12s,box-shadow .12s;}
  .sched-ev:hover{box-shadow:0 4px 14px rgba(0,0,0,.06);}
  .sched-ev.ev-collection{border-left-color:#2e8b57;}
  .sched-ev.ev-delivery{border-left-color:var(--gold2);}
  .sched-ev-l{display:flex;flex-direction:column;gap:3px;min-width:108px;flex:0 0 auto;}
  .sched-kind{font-size:9px;text-transform:uppercase;letter-spacing:.06em;font-weight:700;color:var(--ink2);}
  .sched-ref{font-size:12px;color:var(--ink);}
  .sched-ev-m{flex:1;min-width:0;}
  .sched-title{font-size:13.5px;font-weight:600;color:var(--ink);margin-bottom:7px;}
  .sched-res{display:flex;flex-wrap:wrap;gap:5px;}
  .res-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--ink2);background:rgba(46,139,87,.10);border-radius:20px;padding:3px 9px;}
  .res-chip svg{color:#2e8b57;}
  .res-chip.res-fleet{background:rgba(100,107,0,.10);}
  .res-chip.res-fleet svg{color:var(--gold2);}
  .res-chip.res-eq{background:var(--bg);}
  .res-chip.res-eq svg{color:var(--ink3);}
  .res-chip.res-none{background:rgba(220,80,80,.08);color:#a23;}
  .alloc-list{display:flex;flex-direction:column;}
  .alloc-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--line2);}
  .alloc-row:last-child{border-bottom:none;}
  .alloc-ico{width:26px;height:26px;border-radius:7px;background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--ink2);flex:0 0 auto;}
  .alloc-name{flex:1;font-size:13px;color:var(--ink);}
  .avail-tag{font-size:10.5px;font-weight:700;border-radius:5px;padding:2px 8px;}
  .avail-tag.free{color:#2e8b57;background:rgba(46,139,87,.12);}
  .avail-tag.part{color:var(--gold2);background:rgba(100,107,0,.12);}
  .avail-tag.full{color:var(--ink2);background:var(--bg);}
  .idle-chips{display:flex;flex-wrap:wrap;gap:6px;}
  .idle-chip{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;color:var(--ink2);background:var(--bg);border:1px solid var(--line);border-radius:20px;padding:4px 10px;}
  .idle-chip svg{color:#2e8b57;}
  .idle-chip.res-fleet svg{color:var(--gold2);}
  .idle-jobs{display:flex;flex-direction:column;gap:4px;}
  .idle-job{display:flex;gap:9px;align-items:baseline;padding:6px 8px;border-radius:7px;cursor:pointer;}
  .idle-job:hover{background:var(--bg);}

  /* ---- dispatch day time-grid ---- */
  .tgrid-wrap{display:flex;flex-direction:column;gap:12px;}
  .tgrid-unscheduled{display:flex;flex-wrap:wrap;gap:7px;align-items:center;padding:10px 12px;background:var(--bg);border-radius:9px;}
  .tg-ev{font-size:11.5px;border:1px solid var(--line);background:#fff;border-radius:7px;padding:5px 10px;cursor:pointer;font-family:inherit;color:var(--ink);border-left:3px solid var(--ink3);}
  .tg-ev.ev-collection{border-left-color:#2e8b57;}.tg-ev.ev-delivery{border-left-color:var(--gold2);}
  .tg-ev-k{font-size:8.5px;text-transform:uppercase;letter-spacing:.05em;font-weight:700;color:var(--ink2);}
  .tgrid{position:relative;border:1px solid var(--line);border-radius:11px;background:#fff;margin-left:62px;}
  .tg-row{position:absolute;left:0;right:0;border-top:1px solid var(--line2);}
  .tg-row:first-child{border-top:none;}
  .tg-hour{position:absolute;left:-62px;top:-8px;width:54px;text-align:right;font-size:11px;color:var(--ink3);font-weight:600;}
  .tg-now{position:absolute;left:0;right:0;height:2px;background:#d33;z-index:4;}
  .tg-now-dot{position:absolute;left:-5px;top:-4px;width:10px;height:10px;border-radius:50%;background:#d33;}
  .tg-now-lbl{position:absolute;right:6px;top:-9px;font-size:9.5px;font-weight:700;color:#d33;background:#fff;padding:0 4px;}
  .tg-ev-block{position:absolute;text-align:left;border:none;border-radius:9px;padding:8px 11px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;gap:3px;z-index:2;border-left:4px solid;box-shadow:0 2px 8px rgba(0,0,0,.08);overflow:hidden;}
  .tg-ev-block.ev-collection{background:rgba(46,139,87,.12);border-left-color:#2e8b57;}
  .tg-ev-block.ev-delivery{background:rgba(100,107,0,.14);border-left-color:var(--gold2);}
  .tg-ev-block:hover{filter:brightness(.98);box-shadow:0 5px 16px rgba(0,0,0,.14);z-index:5;}
  .tg-ev-time{display:flex;align-items:center;gap:4px;font-size:10px;text-transform:uppercase;letter-spacing:.04em;font-weight:700;color:var(--ink2);}
  .tg-ev-time svg{color:var(--ink3);}
  .tg-ev-title{font-size:13px;font-weight:700;color:var(--ink);line-height:1.2;}
  .tg-ev-ref{font-size:10px;color:var(--ink3);}
  .tg-ev-res{display:flex;flex-wrap:wrap;gap:4px;margin-top:3px;}
  .tg-empty{position:absolute;top:50%;left:14px;right:14px;text-align:center;transform:translateY(-50%);color:var(--ink3);font-size:13px;}
  .alloc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:2px 22px;}

  /* ---- resource request / allocation ---- */
  .cock-h-sub{font-size:12px;font-weight:500;color:var(--ink3);}
  .rq-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:8px;}
  .rq-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:1px solid var(--line2);}
  .rq-label{font-size:12.5px;color:var(--ink);}
  .rq-num{width:58px;border:1px solid var(--line);border-radius:7px;padding:5px 8px;font-size:13px;font-family:inherit;text-align:center;outline:none;}
  .rq-num:focus{border-color:var(--gold);}
  .alloc-ro-note{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink2);background:var(--bg);border-radius:8px;padding:9px 12px;margin-bottom:12px;}
  .alloc-ro-note svg{color:var(--ink3);flex:0 0 auto;}
  .alloc-ro-note.alloc-can{background:rgba(100,107,0,.10);color:var(--gold2);}
  .alloc-ro-note.alloc-can svg{color:var(--gold2);}
  .cock-chip.ro{cursor:default;opacity:.92;}
  .sub-list{display:flex;flex-direction:column;gap:6px;}
  .sub-row{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--ink);padding:7px 10px;background:var(--bg);border-radius:8px;}
  .sub-row svg:first-child{color:var(--ink3);}
  .sub-row span{flex:1;}
  @media(max-width:820px){.rq-grid{grid-template-columns:1fr;}}

  /* ---- dated request lines + dispatch drawer ---- */
  .rq-lines{display:flex;flex-direction:column;gap:12px;margin-bottom:12px;}
  .rq-line{border:1px solid var(--line);border-radius:11px;padding:12px 14px;background:#fff;}
  .rq-line-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px;}
  .rq-line-when{display:flex;gap:7px;align-items:center;flex-wrap:wrap;}
  .rq-date{width:140px;}.rq-time{width:96px;}.rq-lbl{width:160px;}
  .rq-line-stat{display:flex;align-items:center;gap:8px;}
  .rq-grid-sm{grid-template-columns:repeat(3,1fr);gap:14px;}
  .rq-grid-sm .pb-head{margin-top:0;}
  .rq-alloc-ro{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin-top:8px;padding-top:8px;border-top:1px dashed var(--line);}
  .drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.32);z-index:1300;display:flex;justify-content:flex-end;}
  .drawer{width:min(440px,94vw);background:var(--panel);height:100vh;display:flex;flex-direction:column;box-shadow:-12px 0 40px rgba(0,0,0,.25);animation:drawerIn .16s ease;}
  @keyframes drawerIn{from{transform:translateX(30px);opacity:.6;}to{transform:none;opacity:1;}}
  .drawer-head{flex:0 0 auto;display:flex;align-items:flex-start;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--line);}
  .drawer-title{font-size:15px;font-weight:800;color:var(--ink);}
  .drawer-body{flex:1 1 auto;overflow-y:auto;padding:16px 18px;}
  .drawer-req{background:var(--bg);border-radius:9px;padding:10px 12px;font-size:13px;color:var(--ink);}
  .drawer-prog{display:flex;align-items:center;gap:8px;margin:12px 0 4px;}
  .drawer-foot{flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:14px 18px;border-top:1px solid var(--line);}
  .drawer-foot .spacer{flex:1;}

  /* ---- job cockpit hero (sleek) ---- */
  .job-hero2{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin-bottom:16px;}
  .job-hero2-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:14px;}
  .jh2-head{display:flex;align-items:center;gap:12px;}
  .jh2-movement{font-size:13px;font-weight:600;color:var(--ink2);}
  .jh2-badge{font-size:12px;font-weight:800;letter-spacing:.02em;padding:6px 12px;border-radius:8px;white-space:nowrap;}
  .job-hero2-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:18px;}
  .jh2f{display:flex;flex-direction:column;gap:3px;min-width:0;}
  .jh2f-k{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-weight:700;}
  .jh2f-v{font-size:14px;font-weight:700;color:var(--ink);}
  .jh2f-sub{font-size:11.5px;color:var(--ink3);line-height:1.45;}
  .job-stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
  .job-stat{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:2px;}
  .js-k{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-weight:700;}
  .js-v{font-size:22px;font-weight:800;color:var(--ink);line-height:1.1;}
  .js-v.js-money{font-size:17px;}
  .js-sub{font-size:11px;color:var(--ink3);}
  .ins-on{font-size:14px;font-weight:700;color:var(--gold2);}
  .ins-off{font-size:14px;font-weight:600;color:var(--ink2);}
  /* ---- operations job cards ---- */
  .ops-typetabs{margin-left:auto;}
  .ops-jobs{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px;}
  .ops-job{position:relative;text-align:left;background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 15px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;gap:11px;transition:border-color .12s,box-shadow .12s,transform .12s;}
  .ops-job:hover{border-color:var(--ink3);box-shadow:0 6px 18px rgba(0,0,0,.07);transform:translateY(-2px);}
  .ops-job-badge{align-self:flex-start;font-size:11px;font-weight:800;letter-spacing:.02em;padding:4px 10px;border-radius:7px;white-space:nowrap;}
  .ops-job-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px 14px;}
  .ojf{display:flex;flex-direction:column;gap:1px;min-width:0;}
  .ojf-k{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink3);font-weight:700;}
  .ojf-v{font-size:12.5px;color:var(--ink);font-weight:600;line-height:1.35;}
  .ops-job-foot{display:flex;align-items:center;gap:12px;border-top:1px solid var(--line2);padding-top:10px;}
  .ops-job-next{flex:1;font-size:11.5px;color:var(--ink2);line-height:1.3;}
  .ops-prog-inline{width:120px;flex:0 0 auto;}
  @media(max-width:820px){.job-hero2-grid{grid-template-columns:1fr;}.job-stat-row{grid-template-columns:1fr 1fr;}.ops-jobs{grid-template-columns:1fr;}}

  /* ---- job overview (quote-aligned) ---- */
  .job-topband{display:flex;align-items:center;justify-content:space-between;gap:14px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 18px;margin-bottom:4px;}
  .jtb-l{display:flex;flex-direction:column;gap:2px;min-width:0;}
  .jtb-k{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-weight:700;}
  .jtb-v{font-size:15px;font-weight:700;color:var(--ink);}
  .jtb-sub{font-size:11px;color:var(--ink3);margin-top:1px;}
  .jtb-r{display:flex;align-items:center;gap:10px;flex:0 0 auto;}
  .jtb-badge{font-size:12px;font-weight:800;letter-spacing:.02em;padding:6px 12px;border-radius:8px;white-space:nowrap;}
  .cust-card.cust-card-2{grid-template-columns:1fr 1fr;}
  @media(max-width:820px){.cust-card.cust-card-2{grid-template-columns:1fr;}}

  /* ---- ops table + rail ---- */
  .ops-ref-badge{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;padding:2px 7px;border-radius:5px;}
  .ops-ref-no{color:var(--ink3);margin-top:3px;}
  .ops-route-cell{display:flex;align-items:center;gap:5px;}
  .ops-route-cell svg{color:var(--gold2);flex:0 0 auto;}
  .rail-stat{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.10);}
  .rail-stat:last-child{border-bottom:none;}
  .rs-k{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:rgba(255,255,255,.6);font-weight:600;}
  .rs-v{font-size:22px;font-weight:800;color:#fff;}
  .rs-v.gold{color:var(--gold);}

  /* ---- shipper / consignee parties ---- */
  .party-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:4px 0 14px;}
  .party-col{background:var(--bg);border:1px solid var(--line);border-radius:11px;padding:13px 15px;}
  .party-h{display:flex;flex-direction:column;gap:1px;margin-bottom:8px;position:relative;}
  .party-h>span:first-child{font-size:13px;font-weight:800;color:var(--ink);text-transform:uppercase;letter-spacing:.04em;}
  .party-sub{font-size:10.5px;color:var(--ink3);}
  .party-fill{position:absolute;top:0;right:0;font-size:10.5px;font-weight:700;color:var(--gold2);background:none;border:1px solid var(--line);border-radius:6px;padding:3px 8px;cursor:pointer;font-family:inherit;}
  .party-fill:hover{background:var(--gold-soft,rgba(240,253,99,.18));}
  @media(max-width:820px){.party-grid{grid-template-columns:1fr;}}

  /* ---- estimate parties + classification rail ---- */
  .ship-layout{display:grid;grid-template-columns:1fr 320px;gap:16px;margin-bottom:14px;align-items:start;}
  .ship-rail{background:var(--navy);border-radius:12px;padding:14px 16px;}
  .ship-rail-h{font-size:11px;text-transform:uppercase;letter-spacing:.06em;font-weight:700;color:var(--gold);margin-bottom:10px;}
  .ship-rail .lbl{color:rgba(255,255,255,.6);}
  .ship-rail .fl>span{color:rgba(255,255,255,.55);}
  .ship-rail input,.ship-rail select{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.16);color:#fff;}
  .ship-rail input::placeholder{color:rgba(255,255,255,.35);}
  .ship-rail select option{color:#1d1d1d;}
  .form-grid-2{grid-template-columns:1fr 1fr;}
  @media(max-width:920px){.ship-layout{grid-template-columns:1fr;}}

  /* ---- party cards: white bg + lookup combobox + header row ---- */
  .cust-card{background:#fff;}
  .party-col{background:#fff;}
  .party-h{flex-direction:row;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px;}
  .party-h-l{display:flex;flex-direction:column;gap:1px;min-width:0;}
  .party-h-l>span:first-child{font-weight:700;font-size:13px;color:var(--ink);}
  .party-fills{display:flex;gap:6px;flex-shrink:0;}
  .party-fill{position:static;font-size:10.5px;font-weight:700;color:var(--gold2);background:#fff;border:1px solid var(--line);border-radius:6px;padding:3px 8px;cursor:pointer;font-family:inherit;white-space:nowrap;}
  .party-fill:hover{background:var(--bg);}
  .party-lookup{position:relative;margin-bottom:9px;}
  .party-lookup-ic{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--ink3);pointer-events:none;}
  .party-lookup>input{width:100%;padding:7px 10px 7px 28px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:12.5px;background:#fff;color:var(--ink);box-sizing:border-box;}
  .party-lookup-menu{position:absolute;z-index:40;top:calc(100% + 3px);left:0;right:0;background:#fff;border:1px solid var(--line);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.12);overflow:hidden;}
  .party-lookup-opt{display:flex;flex-direction:column;gap:1px;width:100%;text-align:left;background:none;border:0;border-bottom:1px solid var(--line2);padding:7px 11px;cursor:pointer;font-family:inherit;}
  .party-lookup-opt:last-child{border-bottom:0;}
  .party-lookup-opt:hover{background:var(--bg);}
  .plo-name{font-size:12.5px;font-weight:600;color:var(--ink);}
  .plo-addr{font-size:10.5px;color:var(--ink3);}

  /* ---- classification strip (horizontal, dark) ---- */
  .est-class-strip{display:flex;flex-wrap:wrap;gap:6px 12px;background:var(--navy);border-radius:12px;padding:12px 16px;margin-bottom:14px;align-items:end;}
  .est-class-strip .fl>span{color:rgba(255,255,255,.55) !important;font-size:10px;}
  .est-class-strip input,.est-class-strip select{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.16);color:#fff;font-size:12.5px;padding:5px 7px;min-width:0;}
  .est-class-strip input::placeholder{color:rgba(255,255,255,.35);}
  .est-class-strip select option{color:#1d1d1d;}
  .est-class-strip .fl{flex:1 1 120px;min-width:100px;}
  .ecs-ref{display:flex;flex-direction:column;gap:1px;margin-right:8px;flex:0 0 auto;}
  .ecs-ref-label{font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:rgba(255,255,255,.45);}
  .ecs-ref-no{font-size:16px;font-weight:800;color:var(--gold);}
  /* ---- client select lookup ---- */
  .csel-wrap{display:flex;gap:4px;align-items:stretch;}
  .csel-wrap>select{flex:1;}
  .csel-lookup{position:relative;}
  .csel-btn{background:#fff;border:1px solid var(--line);border-radius:8px;padding:0 8px;cursor:pointer;display:flex;align-items:center;color:var(--ink3);}
  .csel-btn:hover{background:var(--bg);}
  .csel-drop{position:absolute;z-index:50;top:calc(100% + 4px);right:0;width:280px;background:#fff;border:1px solid var(--line);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.12);overflow:hidden;}
  .csel-drop>input{width:100%;padding:8px 11px;border:0;border-bottom:1px solid var(--line2);font-size:12.5px;box-sizing:border-box;outline:none;}
  .csel-opt{display:flex;flex-direction:column;gap:1px;width:100%;text-align:left;background:none;border:0;border-bottom:1px solid var(--line2);padding:7px 11px;cursor:pointer;font-family:inherit;}
  .csel-opt:last-child{border-bottom:0;}
  .csel-opt:hover{background:var(--bg);}
  /* ---- customer card actions ---- */
  .cust-acts{grid-column:1/-1;display:flex;gap:6px;padding-top:4px;border-top:1px solid var(--line2);margin-top:4px;}
  /* ---- volume toggle ---- */
  .est-h{display:flex;align-items:center;gap:16px;}
  .est-h-toggle{margin-left:auto;display:flex;border:1px solid rgba(255,255,255,.25);border-radius:7px;overflow:hidden;}
  .est-h-toggle button{font-family:inherit;font-size:10.5px;font-weight:600;padding:4px 12px;background:none;border:0;color:rgba(255,255,255,.55);cursor:pointer;}
  .est-h-toggle .eht-active{background:rgba(255,255,255,.14);color:#fff;}
  .quick-est{display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;padding:14px 0;}
  .quick-cw{grid-column:1/-1;display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--navy);border-radius:9px;color:#fff;}
  .qcw-k{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:rgba(255,255,255,.55);}
  .qcw-v{font-size:15px;font-weight:700;color:var(--gold);}
  /* ---- topbar nav distinction ---- */
  .topbar{border-bottom:2px solid var(--line);}

  /* ---- lookup button emphasis ---- */
  .party-fill-lookup{background:var(--gold) !important;color:var(--navy) !important;border-color:var(--gold) !important;font-weight:800 !important;}
  .party-fill-lookup:hover{background:var(--gold2) !important;color:#fff !important;}

  /* ---- customer lookup modal ---- */
  .clm-search{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line);margin-bottom:10px;}
  .clm-search input{flex:1;padding:8px 12px;border:1px solid var(--line);border-radius:8px;font-size:13px;font-family:inherit;outline:none;}
  .clm-search input:focus{border-color:var(--gold2);box-shadow:0 0 0 2px rgba(100,107,0,.12);}
  .clm-row:hover td{background:var(--bg);}

  /* ---- ops sub-row (collections + crew side-by-side) ---- */
  .ops-sub-row{display:flex;gap:16px;margin-top:0;}
  .ops-side-card{min-width:220px;max-width:300px;}
  @media(max-width:900px){.ops-sub-row{flex-direction:column;}.ops-side-card{max-width:100%;}}
  /* ---- table consistency fixes ---- */
  .data-table tbody tr{cursor:default;}
  .data-table tbody tr:hover td{background:var(--bg);}
  .empty-row{text-align:center;color:var(--ink3);padding:28px 14px !important;font-size:13px;}

  /* ---- primary contact star ---- */
  .ct-star{background:none;border:none;font-size:16px;color:var(--line);cursor:pointer;padding:0 4px;flex-shrink:0;}
  .ct-star.on{color:var(--gold2);}
  .ct-star:hover{color:var(--gold2);}

  /* ---- document folder ---- */
  .doc-folder{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px 18px;margin-bottom:16px;}
  .doc-folder-head{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
  .doc-folder-head h3{margin:0;font-size:14px;font-weight:700;}
  .doc-list{display:flex;flex-direction:column;gap:4px;}
  .doc-item{display:flex;align-items:flex-start;gap:10px;padding:8px 10px;background:var(--bg);border-radius:8px;}
  .doc-link{cursor:pointer;transition:background .15s;}
  .doc-link:hover{background:var(--line);}
  .doc-acts{display:flex;gap:4px;margin-left:auto;flex-shrink:0;}
  .doc-meta{display:flex;flex-direction:column;gap:1px;}
  .doc-title{font-size:13px;font-weight:600;}
  .doc-activity{margin-top:12px;padding-top:10px;border-top:1px solid var(--line2);}
  `}</style>;
}
