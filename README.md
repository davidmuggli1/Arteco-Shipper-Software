# ARTECO — Art Logistics Software

A working pilot of the ARTECO operating system: commercial pipeline (leads, quotations,
the full estimate engine with volume/chargeable-weight + margin), the operator job cockpit
(classification-driven workflows, crew assignment, freight documents, work tickets),
warehouse & inventory, resources, finance, and admin/settings.

Single React component, no backend required for the core app. Data persists in your browser
(localStorage). The optional AI features (object intake, AI crate estimate) call Claude and
need an API endpoint — see "AI features" below. Everything else runs without it.

## Run locally
```bash
npm install
npm run dev
```
Open the printed URL (usually http://localhost:5173).

## Get a shareable link

### Option A — CodeSandbox / StackBlitz (fastest, no account math)
1. Go to https://codesandbox.io  ->  Create  ->  Import, or just drag this folder in.
   (StackBlitz: https://stackblitz.com  ->  New  ->  Vite + React, then replace files.)
2. It installs and gives you a live URL you can send to anyone.

### Option B — Vercel (clean custom URL, free)
1. Push this folder to a GitHub repo.
2. https://vercel.com  ->  New Project  ->  import the repo  ->  Deploy.
   Framework preset: **Vite**. Build: `npm run build`. Output: `dist`.
3. You get e.g. `arteco-demo.vercel.app`. Optional: add password protection in project settings.

### Option C — Netlify (free)
1. Push to GitHub (or drag the folder into https://app.netlify.com/drop after `npm run build`).
2. Build command `npm run build`, publish directory `dist`.

## AI features (optional)
The intake/estimate AI buttons POST to an endpoint that talks to Claude. By default the app
calls `/api/messages`. To enable them, set an environment variable at build/deploy time:

```
VITE_API_URL=https://your-proxy.example.com/v1/messages
```

That endpoint must accept the Anthropic Messages API body and attach your `x-api-key`
server-side (never put the key in this frontend). If you don't set it, the AI buttons simply
do nothing and the rest of the app works normally.

## Notes
- This is a pilot/demo: browser-local storage, no real multi-user login (the role and
  "viewing as" switches are stand-ins for auth).
- Built as a single component in `src/App.jsx`.
