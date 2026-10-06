import "server-only";
import type { Endpoint, Snippet } from "@/components/dev/api-playground";
import type { WebhookEvent } from "@/components/dev/event-explorer";
import { highlight, type Lang } from "./highlight";

const HOST = "https://YOUR_API_HOST";
const KEY = "YOUR_API_KEY";

async function snip(lang: Lang, label: string, raw: string): Promise<Snippet> {
  return { lang: label.toLowerCase(), label, raw, html: await highlight(raw, lang) };
}

type Req = { method: "GET" | "POST"; path: string; body?: unknown; auth?: boolean };

/** Three equivalent requests for one endpoint. */
async function requests({ method, path, body, auth = true }: Req): Promise<Snippet[]> {
  const url = `${HOST}${path}`;
  const json = body === undefined ? undefined : JSON.stringify(body, null, 2);
  const headers = auth ? [`Authorization: Bearer ${KEY}`] : [];
  if (json) headers.push("Content-Type: application/json");

  const curl = [
    `curl ${method === "GET" ? "" : "-X POST "}${url}`.replace("  ", " "),
    ...headers.map((h) => `  -H "${h}"`),
    ...(json ? [`  -d '${json.replace(/\n\s*/g, " ")}'`] : []),
  ].join(" \\\n");

  const jsHeaders = [auth ? `Authorization: "Bearer ${KEY}"` : null, json ? `"Content-Type": "application/json"` : null].filter(Boolean).join(",\n    ");
  const js = [
    `const response = await fetch("${url}", {`,
    ...(method === "POST" ? [`  method: "POST",`] : []),
    ...(jsHeaders ? [`  headers: {\n    ${jsHeaders},\n  },`] : []),
    ...(json ? [`  body: JSON.stringify(${json.replace(/\n/g, "\n  ")}),`] : []),
    `});`,
    `const data = await response.json();`,
  ].join("\n");

  const pyHeaders = [auth ? `"Authorization": "Bearer ${KEY}"` : null].filter(Boolean).join(", ");
  const py = [
    `import requests`,
    ``,
    `response = requests.${method.toLowerCase()}(`,
    `    "${url}",`,
    ...(pyHeaders ? [`    headers={${pyHeaders}},`] : []),
    ...(json ? [`    json=${json.replace(/\n/g, "\n    ").replace(/true/g, "True").replace(/false/g, "False").replace(/null/g, "None")},`] : []),
    `)`,
    `data = response.json()`,
  ].join("\n");

  return Promise.all([snip("bash", "cURL", curl), snip("javascript", "JavaScript", js), snip("python", "Python", py)]);
}

async function resp(status: string, label: string, raw: string, lang: Lang = "json") {
  return { status, label, raw, html: await highlight(raw, lang) };
}

export async function getEndpoints(): Promise<Endpoint[]> {
  const AG = {
    id: "0192f3c0-6b1a-7c52-9f0e-3a8d5c1e7b24",
    name: "Support Concierge",
    slug: "support-concierge",
    description: null,
    status: "published",
    public_key: "pk_live_…",
    is_public: true,
    current_version_id: "0192f3c1-0d4e-7a10-8b63-5e2f9a4c1d07",
    draft_version: 15,
    created_at: "2026-08-12T09:14:03Z",
    updated_at: "2026-10-05T16:41:22Z",
  };
  const KB = "0192f3d2-41c8-7e0b-a5f1-6d90b2c8e413";

  return [
    {
      id: "agents",
      method: "GET",
      path: "/v1/agents",
      title: "List agents",
      auth: "API key",
      note: "Every agent in your workspace, with its public key and the version that is live.",
      requests: await requests({ method: "GET", path: "/v1/agents" }),
      response: await resp("200 OK", "Example response, abridged to one agent.", JSON.stringify([AG], null, 2)),
    },
    {
      id: "documents",
      method: "POST",
      path: "/v1/knowledge/{kb_id}/documents",
      title: "Add a document",
      auth: "API key",
      note: "Add text or a URL to a knowledge base. For files, use the /documents/upload endpoint. Ingestion runs in the background; watch for the document.ready webhook.",
      requests: await requests({
        method: "POST",
        path: `/v1/knowledge/${KB}/documents`,
        body: { source_type: "text", filename: "shipping-policy.md", text: "We ship across India. Metro cities receive orders in 2–3 business days." },
      }),
      response: await resp(
        "201 Created",
        "Example response. status moves to ready once the passages are indexed.",
        JSON.stringify(
          {
            id: "0192f3e4-9a31-7b6d-8c20-14f7d0a95e62",
            knowledge_base_id: KB,
            source_type: "text",
            filename: "shipping-policy.md",
            mime_type: null,
            size_bytes: 78,
            source_url: null,
            status: "pending",
            error_message: null,
            chunk_count: 0,
          },
          null,
          2,
        ),
      ),
    },
    {
      id: "search",
      method: "POST",
      path: "/v1/knowledge/{kb_id}/search",
      title: "Search a knowledge base",
      auth: "API key",
      note: "Run the same retrieval the agent uses and see the passages and scores it would read.",
      requests: await requests({ method: "POST", path: `/v1/knowledge/${KB}/search`, body: { query: "Do you ship to Chennai?", top_k: 3 } }),
      response: await resp(
        "200 OK",
        "Example response, abridged to one citation.",
        JSON.stringify(
          {
            query: "Do you ship to Chennai?",
            citations: [
              {
                chunk_id: "0192f3e4-9c0b-7d11-b3a4-27e8f1c60d95",
                document_id: "0192f3e4-9a31-7b6d-8c20-14f7d0a95e62",
                knowledge_base_id: KB,
                ordinal: 0,
                content: "Metro cities, including Chennai, receive orders in 2–3 business days.",
                score: 0.91,
                metadata: {},
              },
            ],
          },
          null,
          2,
        ),
      ),
    },
    {
      id: "chat",
      method: "POST",
      path: "/v1/public/agents/{public_key}/chat",
      title: "Send a chat message",
      auth: "Public key",
      note: "What the website widget calls. Pass a conversation_id to continue a chat, and set stream to false to get one JSON reply instead of a stream.",
      requests: await requests({
        method: "POST",
        path: "/v1/public/agents/pk_live_…/chat",
        auth: false,
        body: { message: "Do you ship to Chennai?", stream: false, visitor: { id: "visitor-123", name: "Aarav" } },
      }),
      response: await resp(
        "200 OK",
        "With stream left on (the default) the reply arrives as server-sent events of these types.",
        "token       the reply, a few words at a time\ncitations   the passages it used\nconversation  the conversation id\nmessage     the saved message\ndone        the end of the reply",
        "text",
      ),
    },
    {
      id: "webhook",
      method: "POST",
      path: "/v1/webhooks",
      title: "Register a webhook",
      auth: "API key",
      note: "Choose a URL and the events you want. The signing secret is returned once, so store it.",
      requests: await requests({ method: "POST", path: "/v1/webhooks", body: { url: "https://your-app.example/hooks/vicero", events: ["message.created", "handoff.requested"] } }),
      response: await resp(
        "201 Created",
        "Example response. The secret is shown only on creation.",
        JSON.stringify(
          {
            id: "0192f3f7-5e02-7a48-91bd-80c3e6a2f741",
            url: "https://your-app.example/hooks/vicero",
            events: ["message.created", "handoff.requested"],
            enabled: true,
            secret: "whsec_…",
            created_at: "2026-10-06T08:02:11Z",
          },
          null,
          2,
        ),
      ),
    },
  ];
}

const CONV = "0192f401-3b7e-7c19-a6d2-95e4b0f1c836";
const ENV = (event: string, data: unknown) => JSON.stringify({ event, org_id: "0192f2a8-77d3-7f04-b1e9-4c05a3d8e620", data }, null, 2);

const EVENTS: { name: string; when: string; data: unknown }[] = [
  { name: "message.created", when: "a message is added to a conversation, from a visitor, the agent or an operator", data: { conversation_id: CONV, channel: "whatsapp", message: { role: "user", content: "Do you ship to Chennai?" } } },
  { name: "conversation.created", when: "a new conversation starts", data: { conversation_id: CONV, channel: "whatsapp", agent_id: "0192f3c0-6b1a-7c52-9f0e-3a8d5c1e7b24" } },
  { name: "conversation.closed", when: "a conversation is closed", data: { conversation_id: CONV } },
  { name: "handoff.requested", when: "a conversation needs a person", data: { conversation_id: CONV, reason: "customer asked for a person" } },
  { name: "handoff.resolved", when: "a person hands the conversation back", data: { conversation_id: CONV } },
  { name: "document.ready", when: "a document has been indexed and is searchable", data: { document_id: "0192f3e4-9a31-7b6d-8c20-14f7d0a95e62", chunk_count: 6 } },
  { name: "document.failed", when: "ingesting a document failed", data: { document_id: "0192f3e4-9a31-7b6d-8c20-14f7d0a95e62", error: "unsupported file type" } },
  { name: "tool.run", when: "an agent called a tool", data: { tool: "lookup_order", status: "ok", duration_ms: 812 } },
  { name: "usage.threshold", when: "usage crossed a threshold you configured", data: { threshold: 0.8, used: 8000, limit: 10000 } },
];

export async function getEvents(): Promise<WebhookEvent[]> {
  return Promise.all(EVENTS.map(async (e) => ({ name: e.name, when: e.when, raw: ENV(e.name, e.data), html: await highlight(ENV(e.name, e.data), "json") })));
}

export const VERIFY = `import { createHmac, timingSafeEqual } from "node:crypto";

export function verify(rawBody, signature, secret) {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  // Check length first: timingSafeEqual throws when lengths differ.
  return a.length === b.length && timingSafeEqual(a, b);
}`;

export const EMBED = `<script
  src="https://YOUR_WEB_HOST/widget.js"
  data-agent="pk_your_agent_public_key"
></script>`;
