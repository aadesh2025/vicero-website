// Step 1 of 3. Builds a realistic demo workspace through the real Vicero API:
// account, three agents, a knowledge base with documents, a workflow, saved replies, an API key and a webhook.
// Writes scripts/demo/.state.json (git-ignored) for the next steps. Prints no secrets.
//
//   node scripts/demo/setup.mjs
//
// Needs the Vicero stack running (API :8000) and a Celery worker so documents get indexed.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API = process.env.DEMO_API_URL ?? "http://localhost:8000";
const PG = process.env.DEMO_PG_CONTAINER ?? "vicero-postgres-1";
const here = path.dirname(fileURLToPath(import.meta.url));

let access = "";
let orgId = "";
const hdr = () => ({ Authorization: `Bearer ${access}`, ...(orgId ? { "X-Org-Id": orgId } : {}), "Content-Type": "application/json" });

async function call(method, url, body, { ok = true } = {}) {
  const res = await fetch(`${API}${url}`, { method, headers: hdr(), body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* not json */ }
  if (!res.ok && ok) throw new Error(`${method} ${url} -> ${res.status} ${text.slice(0, 200)}`);
  return { status: res.status, data };
}

// ── account and workspace ────────────────────────────────────────────────────
const stamp = Date.now();
const email = `maya.${stamp}@example.com`;
const password = `Demo-${stamp}-Pw!`;
const signup = await call("POST", "/v1/auth/signup", { email, password, full_name: "Maya Iyer" });
access = signup.data.access_token;
const refresh = signup.data.refresh_token;
const orgs = await call("GET", "/v1/orgs");
orgId = orgs.data[0].id;
await call("PATCH", `/v1/orgs/${orgId}`, { name: "Lumen Home" });
if (!/^[0-9a-f-]{36}$/.test(orgId)) throw new Error("unexpected org id");
// Lift only this throwaway workspace to the unlimited plan, in the local dev database.
execFileSync("docker", ["exec", PG, "psql", "-U", "vicero", "-d", "vicero", "-c", `update organizations set plan='legacy' where id='${orgId}'`]);

// ── agents ───────────────────────────────────────────────────────────────────
async function makeAgent(name, description) {
  const a = (await call("POST", "/v1/agents", { name })).data;
  await call("PATCH", `/v1/agents/${a.id}`, { description }, { ok: false });
  await call("PATCH", `/v1/agents/${a.id}/versions/${a.draft_version}`, { model_config: { provider: "groq", model: "openai/gpt-oss-20b" } }, { ok: false });
  return a;
}
const support = await makeAgent("Support Concierge", "Answers delivery, returns and product questions on every channel.");
const booking = await makeAgent("Booking Assistant", "Books showroom visits and design consultations.");
const sales = await makeAgent("Sales Qualifier", "Qualifies bulk and trade enquiries before a person follows up.");

// ── knowledge base ───────────────────────────────────────────────────────────
const kb = (await call("POST", "/v1/knowledge", { name: "Store knowledge", description: "Policies, catalogue and FAQs for Lumen Home.", embedding_provider: "fake", embedding_model: "fake" })).data;
const DOCS = [
  ["shipping-policy.md", "# Shipping policy\n\nWe ship across India. Metro cities, including Chennai, Bengaluru, Mumbai, Delhi and Hyderabad, receive orders in 2-3 business days. Other cities take 4-6 business days. Orders above Rs 999 ship free; below that a flat Rs 60 fee applies. Large furniture is delivered by our own fleet and scheduled within 5 days of dispatch; we call to confirm a slot. You can change the delivery address until the order is packed, which usually happens within 24 hours of payment."],
  ["returns-and-refunds.md", "# Returns and refunds\n\nItems can be returned within 14 days of delivery if they are unused and in the original packaging. To start a return, share your order number and a photo. Refunds go to the original payment method within 3-5 business days after we receive the item. Items damaged in transit are replaced at no cost, and we arrange the pick-up. Made-to-order furniture cannot be returned unless it arrives damaged."],
  ["warranty-terms.pdf", "# Warranty\n\nAll furniture carries a 2 year warranty on the frame and a 1 year warranty on fabric, finish and fittings. The warranty covers manufacturing defects. It does not cover damage from misuse, water exposure or unauthorised repairs. To claim, send your order number and photos of the issue; our team inspects within 3 business days."],
  ["showroom-and-hours.md", "# Showroom and hours\n\nOur showroom is at 12 Cathedral Road, Chennai. It is open Monday to Saturday, 10am to 7pm, and closed on Sundays. Free parking is available behind the building. Design consultations are free and can be booked for any weekday between 11am and 5pm. Furniture is available in oak, walnut and ash finishes."],
  ["faq.csv", "Question,Answer\nDo you offer cash on delivery?,Yes for orders under Rs 20000 in metro cities.\nCan I get a GST invoice?,Yes. Add your GSTIN at checkout or message us the order number.\nDo you assemble furniture?,Yes. Assembly is free for sofas, beds and wardrobes.\nDo you do bulk or trade orders?,Yes. Orders above Rs 2 lakh get trade pricing and a dedicated contact."],
  ["catalogue-2026.pdf", "# Catalogue highlights 2026\n\nWalnut Console, 120 cm: Rs 18,900, in stock. Oak 6-seater dining set: Rs 42,500 with free delivery. Ash queen bed with storage: Rs 36,200. Linen 3-seater sofa in four colours: Rs 54,800. Walnut bookshelf, 5 shelves: Rs 14,300. Every item ships with a care guide."],
];
for (const [filename, text] of DOCS) await call("POST", `/v1/knowledge/${kb.id}/documents`, { source_type: "text", filename, text });
for (let i = 0; i < 40; i++) {
  const docs = (await call("GET", `/v1/knowledge/${kb.id}/documents`)).data;
  const list = docs.items ?? docs;
  if (list.length && list.every((d) => !["pending", "queued", "processing"].includes(d.status))) break;
  await new Promise((r) => setTimeout(r, 1500));
}
await call("PATCH", `/v1/agents/${support.id}/versions/${support.draft_version}`, { rag_config: { enabled: true, knowledge_base_ids: [kb.id], top_k: 5, score_threshold: 0, hybrid: true } }, { ok: false });
const pub1 = await call("POST", `/v1/agents/${support.id}/versions/${support.draft_version}/publish`, {}, { ok: false });
await call("POST", `/v1/agents/${booking.id}/versions/${booking.draft_version}/publish`, {}, { ok: false });

// ── workflow ─────────────────────────────────────────────────────────────────
const wf = (await call("POST", `/v1/agents/${support.id}/workflows`, { name: "Refund approval", description: "Asks a manager to approve refunds over Rs 5,000." })).data;
const graph = {
  nodes: [
    { id: "start", type: "start", position: { x: 260, y: 20 } },
    { id: "intent", type: "set_variable", position: { x: 260, y: 130 }, config: { key: "intent", value: "refund" } },
    { id: "check", type: "condition", position: { x: 260, y: 250 }, config: { expression: 'intent == "refund"' } },
    { id: "approve", type: "approval", position: { x: 40, y: 400 }, config: { message: "Refund over Rs 5,000: approve?" } },
    { id: "other", type: "message", position: { x: 480, y: 400 }, config: { content: "Happy to help. What else can I do for you?" } },
    { id: "done", type: "message", position: { x: 40, y: 540 }, config: { content: "Refund approved. It will reach you in 3-5 business days." } },
    { id: "end", type: "end", position: { x: 260, y: 670 } },
  ],
  edges: [
    { source: "start", target: "intent" },
    { source: "intent", target: "check" },
    { source: "check", target: "approve", condition: "true" },
    { source: "check", target: "other", condition: "false" },
    { source: "approve", target: "done", condition: "approved" },
    { source: "approve", target: "end", condition: "rejected" },
    { source: "done", target: "end" },
    { source: "other", target: "end" },
  ],
};
const ver = await call("POST", `/v1/workflows/${wf.id}/versions`, { graph });
await call("POST", `/v1/workflows/${wf.id}/versions/${ver.data.version}/publish`, {}, { ok: false });

// ── saved replies, key, webhook (best effort) ───────────────────────────────
for (const [shortcut, content] of [
  ["/delay", "Sorry for the wait. Your order is on its way and should reach you within 2 business days."],
  ["/invoice", "Happy to send a GST invoice. Could you share your GSTIN and the order number?"],
  ["/visit", "You are welcome at our showroom, 12 Cathedral Road, Monday to Saturday, 10am to 7pm."],
  ["/refund", "I've started your refund. It reaches the original payment method in 3-5 business days."],
]) await call("POST", "/v1/canned-responses", { shortcut, content }, { ok: false });
await call("POST", "/v1/apikeys", { name: "Website backend", scopes: [] }, { ok: false });
await call("POST", "/v1/apikeys", { name: "Zapier", scopes: [] }, { ok: false });
await call("POST", "/v1/webhooks", { url: "https://hooks.lumenhome.example/vicero", events: ["message.created", "handoff.requested", "document.ready"] }, { ok: false });

const state = {
  email, password, access, refresh, orgId,
  agents: { support: support.id, booking: booking.id, sales: sales.id },
  supportPublicKey: pub1.data?.public_key ?? support.public_key,
  kbId: kb.id, workflowId: wf.id,
};
fs.writeFileSync(path.join(here, ".state.json"), JSON.stringify(state, null, 2));
console.log(`setup done: org ${orgId}, 3 agents, 1 knowledge base, 1 workflow`);
