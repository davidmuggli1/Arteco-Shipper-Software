// ARTECO helpers, formatters, and AI utilities
import { VOL_WEIGHT_PER_CBM } from "./constants.js";

export const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
export const fmtMoney = (v, ccy = "AED") => (v == null || v === "") ? "—" : new Intl.NumberFormat("en-AE", { style: "currency", currency: ccy || "AED", maximumFractionDigits: 0 }).format(Number(v));
export const fmtDate = (iso) => { if (!iso) return "—"; const d = new Date(iso); return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); };
export const fmtDateTime = (iso) => { if (!iso) return "—"; const d = new Date(iso); return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " · " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); };
export const volM3 = (h, w, d) => (h && w && d) ? (Number(h) * Number(w) * Number(d)) / 1e6 : 0;
export const fmtVol = (m3) => m3 ? `${m3.toFixed(2)} m³` : "—";
export const CM_PER_IN = 2.54;
export const isFlatCat = (c) => c === "Painting" || c === "Work on Paper" || c === "Photograph";
export const toCm = (v, unit) => (v == null || v === "") ? null : (unit === "in" ? Number(v) * CM_PER_IN : Number(v));
export const convLen = (v, from, to) => (v == null || v === "") ? "" : (from === to ? Number(v) : (from === "cm" ? Number(v) / CM_PER_IN : Number(v) * CM_PER_IN));
export const round1 = (n) => (n == null || n === "") ? "" : Math.round(Number(n) * 10) / 10;
/* effective storage footprint of a loose object: the frame envelope when framed, else the artwork; converted to cm */
export const objDimsCm = (o) => {
  const useFrame = !!o.framed && (o.fh || o.fw || o.fd);
  const h = toCm(useFrame ? o.fh : o.h, o.dimUnit), w = toCm(useFrame ? o.fw : o.w, o.dimUnit), d = toCm(useFrame ? o.fd : o.d, o.dimUnit);
  return { h, w, d, useFrame };
};
export const objVolM3 = (o) => { const { h, w, d } = objDimsCm(o); return volM3(h, w, d); };
export const daysUntil = (iso) => { if (!iso) return null; const d = new Date(iso); if (isNaN(d)) return null; return Math.ceil((d - new Date()) / 86400000); };
export const inCustody = (o) => o.custody === "In custody" || o.custody == null;
export const isStocked = (o) => inCustody(o) && o.status === "In stock";

export const STATUS_META = {
  "In stock": { key: "storage" }, "In transit": { key: "transit" }, "Out": { key: "neutral" },
};
export const statusFromLocType = (t) => t === "In Transit" ? "In transit" : (t === "Conservation Studio" || t === "Exhibition Venue" || t === "Client Site") ? "Out" : "In stock";

export async function loadCol(key, fb) { try { if (typeof window === "undefined" || !window.storage) return fb; const r = await window.storage.get(key); return r && r.value ? JSON.parse(r.value) : fb; } catch { return fb; } }
export async function saveCol(key, data) { try { if (typeof window === "undefined" || !window.storage) return; await window.storage.set(key, JSON.stringify(data)); } catch (e) { console.warn("save fail", key, e); } }

/* image downsampling — keeps the pilot within browser storage limits */
export function processImage(file, maxFull = 1800, maxThumb = 420) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const make = (max, q) => {
          let { width: w, height: h } = img;
          const scale = Math.min(1, max / Math.max(w, h));
          w = Math.round(w * scale); h = Math.round(h * scale);
          const c = document.createElement("canvas"); c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, 0, 0, w, h);
          return c.toDataURL("image/jpeg", q);
        };
        try { resolve({ id: uid(), name: file.name, full: make(maxFull, 0.85), thumb: make(maxThumb, 0.7), primary: false, caption: "" }); }
        catch (e) { reject(e); }
      };
      img.onerror = reject; img.src = r.result;
    };
    r.onerror = reject; r.readAsDataURL(file);
  });
}

/* ----------------------------- seed -------------------------------------- */

export async function callAI(system, content, maxTokens = 1500, retries = 3) {
  const url = (typeof window !== "undefined" && window.__ARTECO_API_URL__) || "https://api.anthropic.com/v1/messages";
  let lastErr = null;
  for (let i = 0; i < retries; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system, messages: [{ role: "user", content }] }) });
      if (res.status === 429) { lastErr = new Error("Rate limited — retrying…"); continue; }
      if (!res.ok) { const t = await res.text(); lastErr = new Error(t || `HTTP ${res.status}`); continue; }
      const data = await res.json();
      if (data.error) { lastErr = new Error(data.error.message || "API error"); if (/rate/i.test(data.error.message)) continue; throw lastErr; }
      const txt = (data.content || []).map(b => b.text || "").join("").trim();
      const clean = txt.replace(/```json/gi, "").replace(/```/g, "").trim();
      const a = clean.indexOf("{"), b2 = clean.indexOf("[");
      const start = (a >= 0 && (b2 < 0 || a < b2)) ? a : b2;
      const end = clean.lastIndexOf(start === a ? "}" : "]");
      return JSON.parse(start >= 0 ? clean.slice(start, end + 1) : clean);
    } catch (ex) { if (ex === lastErr) throw ex; lastErr = ex; }
  }
  throw lastErr || new Error("AI call failed after retries");
}


export function fileToDataUrl(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file); }); }
function toB64(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(file); }); }


export function toB64(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(file); }); }
const humanBytes = (n) => { if (!n && n !== 0) return ""; if (n < 1024) return n + " B"; if (n < 1048576) return (n / 1024).toFixed(0) + " KB"; return (n / 1048576).toFixed(1) + " MB"; };


export function makeEntry(e) { return { id: uid(), at: new Date().toISOString(), ...e }; }


export const DOC_KINDS = ["Document", "Email", "Call", "Note", "System"];
export const DOC_KIND_TONE = { Document: "loan", Email: "storage", Call: "consv", Note: "neutral", System: "prov" };
export const COMM_DIRS = ["Inbound", "Outbound", "Internal"];
export const humanBytes = (n) => { if (!n && n !== 0) return ""; if (n < 1024) return n + " B"; if (n < 1048576) return (n / 1024).toFixed(0) + " KB"; return (n / 1048576).toFixed(1) + " MB"; };
