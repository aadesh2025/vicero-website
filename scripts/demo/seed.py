"""Step 2 of 3. Loads the demo workspace (made by setup.mjs) with a month of realistic activity.

    <saas venv python> scripts/demo/seed.py

Writes straight to the local Vicero dev database, and ONLY for the throwaway organisation named
in scripts/demo/.state.json: a team, contacts and CRM records, about 2,000 conversations over 30
days across WhatsApp, the web widget and Instagram, their messages (with token and cost figures),
and hand-offs for the inbox. Everything is invented. The database URL is read from the SaaS .env
and never printed.
"""

from __future__ import annotations

import asyncio
import datetime as dt
import json
import pathlib
import random
import re
import uuid

import asyncpg

HERE = pathlib.Path(__file__).parent
STATE = json.loads((HERE / ".state.json").read_text())
ENV = pathlib.Path(r"E:\AUROZEN AGENCY\own_chatbot\.env").read_text()
DSN = re.search(r"^DATABASE_URL=(.+)$", ENV, re.M).group(1).strip().replace("+asyncpg", "")

ORG = uuid.UUID(STATE["orgId"])
AGENTS = {k: uuid.UUID(v) for k, v in STATE["agents"].items()}
R = random.Random(2026)
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
NOW = dt.datetime.now(dt.timezone.utc)
TARGET = 3800

FIRST = ["Aarav", "Priya", "Rohan", "Sana", "Diego", "Meera", "Tom", "Divya", "Karthik", "Ananya", "Vikram", "Lakshmi", "Arjun", "Fatima", "Nikhil", "Kavya", "Rahul", "Sneha", "Imran", "Pooja", "Siddharth", "Nisha", "Harish", "Tanvi", "Manoj", "Ishita", "Suresh", "Deepa", "Varun", "Anita", "Gautam", "Revathi", "Mohan", "Shreya", "Adil", "Janani", "Ravi", "Zoya", "Prakash", "Aditi"]
LAST = ["Mehta", "Nair", "Gupta", "Khan", "Alvarez", "Pillai", "Becker", "Raman", "Natarajan", "Iyer", "Desai", "Krishnan", "Sharma", "Shaikh", "Reddy", "Menon", "Verma", "Das", "Ali", "Patel", "Rao", "Kapoor", "Bhat", "Joshi", "Naidu", "Fernandes", "Subramanian", "Chopra", "Banerjee", "Agarwal"]
CITIES = [("Chennai", "2-3"), ("Bengaluru", "2-3"), ("Mumbai", "2-3"), ("Hyderabad", "2-3"), ("Delhi", "2-3"), ("Coimbatore", "3-4"), ("Kochi", "3-4"), ("Pune", "2-3"), ("Madurai", "4-6"), ("Jaipur", "4-6"), ("Lucknow", "4-6")]
ITEMS = [("Walnut Console", "18,900"), ("Oak 6-seater dining set", "42,500"), ("Ash queen bed", "36,200"), ("Linen 3-seater sofa", "54,800"), ("Walnut bookshelf", "14,300"), ("Oak coffee table", "9,400")]
TEAM = [("Rhea Shah", "operator"), ("Imran Khan", "admin"), ("Divya Raman", "editor"), ("Arun Prakash", "viewer")]
HOUR_W = [3, 2, 1, 1, 2, 5, 12, 28, 52, 70, 78, 74, 66, 60, 68, 76, 82, 74, 60, 50, 40, 28, 14, 7]
CHANNEL_W = [("whatsapp", 52), ("widget", 31), ("instagram", 17)]
AGENT_W = [("support", 82), ("booking", 14), ("sales", 4)]
DOC_FOR = {"ship": "shipping-policy.md", "ret": "returns-and-refunds.md", "war": "warranty-terms.pdf", "show": "showroom-and-hours.md", "faq": "faq.csv", "cat": "catalogue-2026.pdf"}


def pick(pairs):
    total = sum(w for _, w in pairs)
    x = R.uniform(0, total)
    for v, w in pairs:
        x -= w
        if x <= 0:
            return v
    return pairs[-1][0]


def person(i):
    f, l = FIRST[i % len(FIRST)], LAST[(i * 7 + i // len(FIRST)) % len(LAST)]
    return f"{f} {l}" if l != "S" else f"{f} Natarajan"


def topic(agent):
    """(question, answer, doc key, wants a person) with the details filled in."""
    city, days = R.choice(CITIES)
    item, price = R.choice(ITEMS)
    n = R.randint(4100, 4890)
    day = R.choice(["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
    if agent == "booking":
        return R.choice([
            (f"Can I book a design consultation for {day}?", f"Yes, consultations are free on weekdays between 11am and 5pm. Which time works for you on {day}?", "show", False),
            ("I'd like to visit the showroom this weekend", "Our showroom is open Saturday, 10am to 7pm, and closed on Sunday. I can book you for Saturday. What time suits you?", "show", False),
            (f"Do you have a slot on {day} afternoon?", f"We do. {day} at 2pm and 4pm are open. Shall I reserve one?", "show", False),
        ])
    if agent == "sales":
        return R.choice([
            ("Do you do bulk orders for an office?", "Yes. Orders above Rs 2 lakh get trade pricing and a dedicated contact. I'll pass your details to our team.", "faq", True),
            ("We're furnishing a new clinic. Can you quote for 12 chairs and 4 desks?", "Certainly. I'll connect you with our trade team, who can quote for the full set.", "faq", True),
        ])
    return R.choice([
        (f"Do you ship to {city}?", f"Yes. Orders to {city} arrive in {days} business days, and shipping is free above Rs 999.", "ship", False),
        (f"How long does delivery to {city} take?", f"Delivery to {city} takes {days} business days. Large furniture is scheduled within 5 days of dispatch.", "ship", False),
        (f"Can I change the delivery address for order #{n}?", "You can change the address until the order is packed, usually within 24 hours of payment. Shall I update it now?", "ship", False),
        ("What is your return policy?", "Items can be returned within 14 days of delivery if they are unused and in the original packaging.", "ret", False),
        ("How long do refunds take?", "Refunds reach the original payment method within 3-5 business days after we receive the item.", "ret", False),
        (f"My {item.lower()} arrived damaged", "I'm sorry about that. Items damaged in transit are replaced at no cost. Could you send a photo and your order number? I'm passing this to our team.", "ret", True),
        (f"Is the {item} in stock?", f"Yes, the {item} is in stock at Rs {price}. It ships in {days} business days.", "cat", False),
        (f"Do you have the {item.lower()} in walnut?", "It comes in oak, walnut and ash finishes. Walnut is available now, and ash takes about a week.", "show", False),
        ("Where is your showroom?", "12 Cathedral Road, Chennai. Open Monday to Saturday, 10am to 7pm, with free parking behind the building.", "show", False),
        ("Is the showroom open on Sunday?", "We're closed on Sundays. Monday to Saturday we're open 10am to 7pm.", "show", False),
        ("Do you offer cash on delivery?", "Yes, for orders under Rs 20,000 in metro cities.", "faq", False),
        (f"Can I get a GST invoice for order #{n}?", "Yes. Send me your GSTIN and I'll have the invoice emailed to you.", "faq", False),
        ("Do you assemble the furniture?", "Yes. Assembly is free for sofas, beds and wardrobes.", "faq", False),
        (f"What warranty does the {item.lower()} have?", "Furniture carries 2 years on the frame and 1 year on fabric, finish and fittings.", "war", False),
        (f"Where is my order #{n}?", f"Order #{n} was dispatched and should reach you within 2 business days. I can share the tracking link if you like.", None, False),
        ("My payment failed twice", "I'm sorry about that. I'm bringing in a teammate who can look at the payment with you.", None, True),
        ("I want to talk to a person", "Of course. I'm connecting you with our team now.", None, True),
        (f"Wrong item delivered for order #{n}", "I'm sorry for the mix-up. I'm passing this to our team to arrange the right item and a pick-up.", "ret", True),
    ])


FOLLOW = [
    ("Great, thank you!", "You're welcome. Anything else I can help with?"),
    ("Perfect, how do I pay?", "I can send a secure payment link right here. Shall I?"),
    ("Can you also send the invoice?", "Happy to. I'll email the invoice to the address on your order."),
    ("Ok, and is delivery free?", "Delivery is free above Rs 999, so yes for this order."),
    ("Thanks, that was quick!", "Glad to help."),
]
HUMAN_REPLIES = [
    "Hi {n}, this is {op} from Lumen Home. I've looked at your order and arranged a pick-up for tomorrow.",
    "Hello {n}, {op} here. Sorry for the trouble. I've raised a replacement and it ships on Friday.",
    "Hi {n}, {op} from the team. I've checked the payment and it's now going through. Could you try once more?",
    "Hi {n}, thanks for waiting. I've sent the quote to your email. Do call me if you'd like to adjust it.",
]


def day_plan():
    """Conversations per day, oldest first: a weekly rhythm on an upward trend."""
    raw = []
    for i in range(30):
        d = (NOW - dt.timedelta(days=29 - i)).astimezone(IST)
        dow = d.weekday()  # Mon=0
        factor = {0: 1.12, 1: 1.05, 2: 1.0, 3: 1.04, 4: 1.1, 5: 0.82, 6: 0.66}[dow]
        raw.append((52 + i * 1.35) * factor * R.uniform(0.9, 1.1))
    today_ist = NOW.astimezone(IST)
    raw[-1] *= 0.98  # a normal day, so "today" reads as on par with yesterday
    k = TARGET / sum(raw)
    return [max(8, round(v * k)) for v in raw]


def when(day_index):
    base = (NOW - dt.timedelta(days=29 - day_index)).astimezone(IST).replace(hour=0, minute=0, second=0, microsecond=0)
    for _ in range(50):
        h = pick([(h, w) for h, w in enumerate(HOUR_W)])
        t = base + dt.timedelta(hours=h, minutes=R.randint(0, 59), seconds=R.randint(0, 59))
        if t.astimezone(dt.timezone.utc) < NOW - dt.timedelta(minutes=4):
            return t.astimezone(dt.timezone.utc)
    return NOW - dt.timedelta(minutes=R.randint(5, 90))


async def main():
    con = await asyncpg.connect(DSN)
    try:
        docs = {r["filename"]: r["id"] for r in await con.fetch("select id, filename from documents where knowledge_base_id=$1", uuid.UUID(STATE["kbId"]))}
        owner = await con.fetchval("select user_id from memberships where organization_id=$1 and role='owner' limit 1", ORG)

        # Fresh start for this workspace's synthetic activity (idempotent re-runs).
        await con.execute("delete from handoffs where organization_id=$1", ORG)
        await con.execute("delete from messages where organization_id=$1", ORG)
        await con.execute("delete from conversations where organization_id=$1", ORG)
        await con.execute("delete from contacts where organization_id=$1", ORG)
        await con.execute("delete from crm_contacts where organization_id=$1", ORG)
        await con.execute("delete from usage_records where organization_id=$1", ORG)

        # Team
        team_ids = {}
        for name, role in TEAM:
            email = f"{name.split()[0].lower()}.{STATE['orgId'][:6]}@lumenhome.example"
            uid = uuid.uuid4()
            await con.execute(
                "insert into users (id, email, email_normalized, full_name, is_staff, is_active, email_verified_at, is_system) values ($1,$2,$2,$3,false,true,now(),false) on conflict do nothing",
                uid, email, name,
            )
            uid = await con.fetchval("select id from users where email=$1", email)
            await con.execute(
                "insert into memberships (id, organization_id, user_id, role, status) select $1,$2,$3,$4,'active' where not exists (select 1 from memberships where organization_id=$2 and user_id=$3)",
                uuid.uuid4(), ORG, uid, role,
            )
            team_ids[name] = uid
        operators = [team_ids["Rhea Shah"], team_ids["Imran Khan"], owner]
        op_names = {team_ids["Rhea Shah"]: "Rhea", team_ids["Imran Khan"]: "Imran", owner: "Maya"}

        # People: one CRM record each for the first 70, handles on one or two channels.
        n_people = 380
        people = []
        for i in range(n_people):
            name = person(i)
            ch = pick(CHANNEL_W)
            people.append({"name": name, "channel": ch, "id": str(uuid.uuid4())[:8], "crm": None})
        crm_rows, contact_rows = [], []
        for i, p in enumerate(people):
            crm_id = None
            if i < 80:
                crm_id = uuid.uuid4()
                first, last = p["name"].lower().split()[0], p["name"].lower().split()[-1]
                stage = pick([("new", 22), ("contacted", 26), ("qualified", 20), ("customer", 28), ("lost", 4)])
                order = R.choice([None, "Placed", "Dispatched", "Delivered", "Delivered", "Delivered"])
                labels = R.sample(["VIP", "Repeat buyer", "Bulk enquiry", "Damaged item", "Trade", "Needs follow-up", "Interior designer", "Referral", "Festive sale", "Showroom visit", "Prefers WhatsApp"], R.choice([0, 1, 1, 1, 2]))
                crm_rows.append((crm_id, ORG, p["name"], f"{first}.{last}@{R.choice(['gmail.com', 'outlook.com', 'yahoo.in'])}", f"+91 9{R.randint(100, 999)}{R.randint(10000, 99999)}"[:16], stage, order, labels))
            p["crm"] = crm_id
            p["contact_id"] = uuid.uuid4()
            ext = p["id"] if p["channel"] != "whatsapp" else f"91{R.randint(7000000000, 9999999999)}"
            p["ext"] = ext
            contact_rows.append((p["contact_id"], ORG, p["channel"], ext, p["name"], crm_id))
        await con.executemany("insert into crm_contacts (id, organization_id, display_name, email, phone, lead_stage, order_status, labels) values ($1,$2,$3,$4,$5,$6,$7,$8)", crm_rows)
        await con.executemany("insert into contacts (id, organization_id, channel, external_id, display_name, crm_contact_id) values ($1,$2,$3,$4,$5,$6)", contact_rows)

        # Conversations, messages, hand-offs
        conv_rows, msg_rows, handoff_rows, usage = [], [], [], {}
        counts = day_plan()
        newest_handoffs = []
        for day, n in enumerate(counts):
            for _ in range(n):
                p = R.choice(people)
                agent_key = pick(AGENT_W)
                agent_id = AGENTS[agent_key]
                channel = p["channel"] if R.random() < 0.9 else pick(CHANNEL_W)
                q, a, doc, wants_person = topic(agent_key)
                # Topics that need a person are real but uncommon: keep about a seventh of them.
                for _try in range(8):
                    if not wants_person or R.random() < 0.16:
                        break
                    q, a, doc, wants_person = topic(agent_key)
                t0 = when(day)
                cid = uuid.uuid4()
                turns = [(q, a, doc)]
                if R.random() < 0.38 and not wants_person:
                    fq, fa = R.choice(FOLLOW)
                    turns.append((fq, fa, None))
                ts = t0
                last = ts
                for ti, (uq, ua, udoc) in enumerate(turns):
                    ts = ts + dt.timedelta(seconds=R.randint(20, 240)) if ti else ts
                    msg_rows.append((uuid.uuid4(), cid, ORG, "user", uq, "[]", None, None, 0, 0, 0, None, ts))
                    latency = R.randint(900, 4200)
                    rt = ts + dt.timedelta(milliseconds=latency)
                    paid = R.random() < 0.55
                    provider, model = ("openai", "gpt-4o-mini") if paid else ("groq", "openai/gpt-oss-20b")
                    tp, tc = R.randint(700, 1900), R.randint(40, 170)
                    cost = R.randint(2200, 7600) if paid else 0
                    cites = "[]"
                    if udoc and udoc in docs:
                        cites = json.dumps([{"chunk_id": str(uuid.uuid4()), "document_id": str(docs[udoc]), "knowledge_base_id": STATE["kbId"], "ordinal": 0, "content": ua[:120], "score": round(R.uniform(0.62, 0.94), 2), "metadata": {"filename": udoc}}])
                    msg_rows.append((uuid.uuid4(), cid, ORG, "assistant", ua, cites, provider, model, tp, tc, cost, latency, rt))
                    key = (rt.date(), agent_id, provider, model)
                    u = usage.setdefault(key, [0, 0, 0, 0])
                    u[0] += tp; u[1] += tc; u[2] += 1; u[3] += cost
                    last = rt
                status = "active"
                assigned = None
                attention = None
                age_days = (NOW - t0).days
                if wants_person or R.random() < 0.04:
                    requested_by = R.choice(["user", "user", "system"])
                    reason = R.choice(["keyword", "customer asked for a person", "needs a decision"])
                    created = last + dt.timedelta(seconds=R.randint(5, 40))
                    recent = (NOW - created) < dt.timedelta(hours=26)
                    if recent and len(newest_handoffs) < 14:
                        kind = R.choice(["open", "open", "assigned", "assigned", "resolved"])
                    else:
                        kind = "resolved"
                    op = R.choice(operators)
                    if kind == "resolved":
                        resolved = min(NOW - dt.timedelta(minutes=1), created + dt.timedelta(minutes=R.randint(4, 55)))
                        msg_rows.append((uuid.uuid4(), cid, ORG, "assistant", R.choice(HUMAN_REPLIES).format(n=p["name"].split()[0], op=op_names[op]), "[]", "operator", None, 0, 0, 0, None, min(resolved, created + dt.timedelta(minutes=3))))
                        handoff_rows.append((uuid.uuid4(), ORG, cid, requested_by, reason, "resolved", op, created, resolved))
                        status = "closed" if age_days >= 1 and R.random() < 0.7 else "active"
                        last = max(last, resolved)
                    else:
                        newest_handoffs.append(cid)
                        status = "handoff"
                        attention = R.choice([None, None, "mild", "elevated"])
                        assigned = op if kind == "assigned" else None
                        handoff_rows.append((uuid.uuid4(), ORG, cid, requested_by, reason, kind, assigned, created, None))
                        if kind == "assigned":
                            reply_at = min(NOW - dt.timedelta(minutes=1), created + dt.timedelta(minutes=R.randint(2, 9)))
                            msg_rows.append((uuid.uuid4(), cid, ORG, "assistant", R.choice(HUMAN_REPLIES).format(n=p["name"].split()[0], op=op_names[op]), "[]", "operator", None, 0, 0, 0, None, reply_at))
                            last = max(last, reply_at)
                elif age_days >= 1 and R.random() < 0.55:
                    status = "closed"
                title = q[:80]
                meta = json.dumps({"visitor": {"id": p["ext"], "name": p["name"]}})
                conv_rows.append((cid, ORG, agent_id, channel, p["ext"], status, assigned, title, meta, last, t0, p["contact_id"], attention, t0, last))

        await con.executemany(
            "insert into conversations (id, organization_id, agent_id, channel, channel_user_id, status, assigned_to, title, metadata, last_message_at, last_inbound_at, contact_id, attention_level, created_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,$14,$15)",
            conv_rows,
        )
        await con.executemany(
            "insert into messages (id, conversation_id, organization_id, role, content, citations, provider, model, tokens_prompt, tokens_completion, cost_micros, latency_ms, created_at) values ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10,$11,$12,$13)",
            msg_rows,
        )
        await con.executemany(
            "insert into handoffs (id, organization_id, conversation_id, requested_by, reason, status, assigned_to, created_at, resolved_at, notes, tags) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'[]'::jsonb,'{}')",
            handoff_rows,
        )
        await con.executemany(
            "insert into usage_records (id, organization_id, agent_id, date, provider, model, tokens_prompt, tokens_completion, requests, cost_micros) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
            [(uuid.uuid4(), ORG, k[1], k[0], k[2], k[3], v[0], v[1], v[2], v[3]) for k, v in usage.items()],
        )
        total_msgs = len(msg_rows)
        open_h = sum(1 for h in handoff_rows if h[5] != "resolved")
        print(f"seeded: {len(conv_rows)} conversations, {total_msgs} messages, {len(handoff_rows)} hand-offs ({open_h} open), {len(crm_rows)} CRM contacts, team of {len(TEAM) + 1}")
    finally:
        await con.close()


asyncio.run(main())

