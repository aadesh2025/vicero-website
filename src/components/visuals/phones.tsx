import { ArrowLeft, Camera, Check, Phone as PhoneIcon, Video } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LogoMark } from "../logo";

function Phone({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <div role="img" aria-label={label} className={cn("relative mx-auto w-[268px] rounded-[38px] border-[7px] border-ink bg-ink shadow-[0_40px_60px_-30px_rgb(13_14_18/0.5)]", className)}>
      <div className="absolute left-1/2 top-1.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-ink" aria-hidden="true" />
      <div aria-hidden="true" className="h-[520px] overflow-hidden rounded-[31px] bg-white text-[#111]">{children}</div>
    </div>
  );
}

/* ── WhatsApp ───────────────────────────────────────────────────────────── */
function WaBubble({ me, children, time, source }: { me?: boolean; children: ReactNode; time: string; source?: string }) {
  return (
    <div className={cn("max-w-[84%]", me ? "ml-auto" : "mr-auto")}>
      <div className={cn("rounded-lg px-2.5 py-1.5 text-[11.5px] leading-snug shadow-[0_1px_0.5px_rgb(0_0_0/0.13)]", me ? "rounded-tr-none bg-[#d9fdd3]" : "rounded-tl-none bg-white")}>
        {children}
        {source && <p className="mt-1 text-[9.5px] font-semibold text-[#4a5a64]">From {source}</p>}
        <p className="mt-0.5 flex items-center justify-end gap-0.5 text-[9px] text-[#4a5a64]">{time}{me && <Check className="h-2.5 w-2.5 text-[#53bdeb]" />}</p>
      </div>
    </div>
  );
}

export function WhatsAppPhone({ className }: { className?: string }) {
  return (
    <Phone className={className} label="A WhatsApp chat: a customer asks about a walnut console and delivery, and Vicero answers from the catalogue and shipping policy">
      <div className="flex h-full flex-col" style={{ background: "#efeae2" }}>
        <div className="flex items-center gap-2 bg-[#075e54] px-3 pb-2.5 pt-7 text-white">
          <ArrowLeft className="h-4 w-4" />
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white"><LogoMark size={16} /></span>
          <div className="min-w-0 flex-1 leading-tight"><p className="text-[12px] font-semibold">Lumen Home</p><p className="text-[9.5px] text-white/75">Business account</p></div>
          <Video className="h-4 w-4" /><PhoneIcon className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 space-y-2 overflow-hidden p-3">
          <p className="mx-auto w-fit rounded-md bg-[#e1f2fb] px-2 py-0.5 text-[9.5px] text-[#54656f]">Today</p>
          <WaBubble me time="10:12">Hi! Do you have the walnut console in stock?</WaBubble>
          <WaBubble time="10:12" source="catalogue-2026.pdf">Yes, the Walnut Console (120 cm) is in stock at our Chennai warehouse. It&apos;s ₹18,900.</WaBubble>
          <WaBubble me time="10:13">Can you deliver to Coimbatore?</WaBubble>
          <WaBubble time="10:13" source="shipping-policy.md">Yes. Orders to Coimbatore arrive in 3–4 business days, and shipping is free above ₹999.</WaBubble>
          <WaBubble me time="10:14">Great, how do I pay?</WaBubble>
          <WaBubble time="10:14">I can send a secure payment link right here.</WaBubble>
          <div className="mr-auto flex gap-1.5"><span className="rounded-full bg-white px-3 py-1 text-[10.5px] font-semibold text-[#027eb5] shadow-sm">Send the link</span><span className="rounded-full bg-white px-3 py-1 text-[10.5px] font-semibold text-[#027eb5] shadow-sm">Talk to a person</span></div>
        </div>
        <div className="flex items-center gap-2 bg-[#f0f2f5] px-2.5 py-2"><span className="flex-1 rounded-full bg-white px-3 py-1.5 text-[11px] text-[#4a5a64]">Message</span></div>
      </div>
    </Phone>
  );
}

/* ── Instagram ──────────────────────────────────────────────────────────── */
export function InstagramPhone({ className }: { className?: string }) {
  return (
    <Phone className={className} label="An Instagram direct message: a customer asks the price of an oak dining set and the showroom hours, and Vicero replies">
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center gap-2 border-b border-[#efefef] px-3 pb-2.5 pt-7">
          <ArrowLeft className="h-4 w-4" />
          <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "linear-gradient(45deg,#f58529,#dd2a7b,#8134af)" }}><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white"><LogoMark size={14} /></span></span>
          <div className="min-w-0 flex-1 leading-tight"><p className="text-[12px] font-semibold">lumenhome.in</p><p className="text-[9.5px] text-[#737373]">Replies in seconds</p></div>
          <Camera className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-2 overflow-hidden p-3">
          <div className="ml-auto w-[150px] overflow-hidden rounded-xl border border-[#dbdbdb]">
            <div className="h-[86px]" style={{ background: "linear-gradient(135deg,#c9a77c,#8a6a43)" }} />
            <p className="px-2 py-1.5 text-[10px] text-[#737373]">Replied to your story</p>
          </div>
          <div className="ml-auto max-w-[80%] rounded-2xl px-3 py-1.5 text-[11.5px] text-white" style={{ background: "linear-gradient(135deg,#7638fa,#d300c5)" }}>Love the oak dining set! What&apos;s the price?</div>
          <div className="mr-auto max-w-[82%] rounded-2xl bg-[#efefef] px-3 py-1.5 text-[11.5px] leading-snug">The Oak 6-seater is ₹42,500 with free delivery. Would you like to see it in the showroom?</div>
          <p className="mr-auto text-[9.5px] text-[#737373]">Source: catalogue-2026.pdf</p>
          <div className="ml-auto max-w-[80%] rounded-2xl px-3 py-1.5 text-[11.5px] text-white" style={{ background: "linear-gradient(135deg,#7638fa,#d300c5)" }}>Is it open on Sunday?</div>
          <div className="mr-auto max-w-[82%] rounded-2xl bg-[#efefef] px-3 py-1.5 text-[11.5px] leading-snug">We&apos;re open Monday to Saturday, 10am to 7pm. I can book you a visit for Saturday if you like.</div>
          <p className="mr-auto text-[9.5px] text-[#737373]">Source: showroom-and-hours.md</p>
        </div>
        <div className="m-3 rounded-full border border-[#dbdbdb] px-3 py-1.5 text-[11px] text-[#737373]">Message…</div>
      </div>
    </Phone>
  );
}

/* ── Website widget on a site ───────────────────────────────────────────── */
export function WidgetOnSite({ className }: { className?: string }) {
  return (
    <div role="img" aria-label="A furniture shop website with the Vicero chat widget open: a visitor asks about warranty and gets an answer from the warranty document" className={cn("overflow-hidden rounded-lg border border-border-strong bg-surface shadow-[0_30px_60px_-30px_rgb(13_14_18/0.35)]", className)}>
      <div aria-hidden="true">
        <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2">
          <span className="flex gap-1"><i className="h-2 w-2 rounded-full bg-border-strong" /><i className="h-2 w-2 rounded-full bg-border-strong" /><i className="h-2 w-2 rounded-full bg-border-strong" /></span>
          <span className="mx-auto rounded-full border border-border bg-surface px-3 py-0.5 text-[10px] text-faint">lumenhome.in/walnut-console</span>
        </div>
        <div className="relative h-[330px] bg-bg p-5">
          <div className="flex items-center justify-between"><span className="font-display text-sm font-bold">Lumen Home</span><span className="flex gap-3 text-[10px] text-faint"><i>Living</i><i>Dining</i><i>Bedroom</i><i>Cart (1)</i></span></div>
          <div className="mt-5 grid grid-cols-[1.1fr_1fr] gap-5">
            <div className="h-[170px] rounded-md" style={{ background: "linear-gradient(135deg,#c9a77c,#8a6a43)" }} />
            <div className="space-y-2">
              <p className="font-display text-lg font-bold leading-tight">Walnut Console, 120 cm</p>
              <p className="text-sm font-semibold">₹ 18,900</p>
              <div className="h-2 w-4/5 rounded bg-surface-3" /><div className="h-2 w-3/5 rounded bg-surface-3" />
              <span className="mt-2 inline-block rounded-md bg-ink px-3 py-1.5 text-[10px] font-semibold text-white">Add to cart</span>
            </div>
          </div>
          <div className="absolute bottom-3 right-3 w-[190px] overflow-hidden rounded-xl border border-border-strong bg-surface shadow-[0_20px_40px_-18px_rgb(13_14_18/0.5)]">
            <div className="flex items-center gap-2 bg-accent-strong px-3 py-2 text-on-accent"><LogoMark size={14} className="invert" /><p className="text-[11px] font-semibold">Lumen Home assistant</p></div>
            <div className="space-y-1.5 p-2.5">
              <div className="ml-auto w-fit max-w-[88%] rounded-lg rounded-br-sm bg-surface-3 px-2 py-1 text-[10px]">Does this have a warranty?</div>
              <div className="max-w-[92%] rounded-lg rounded-bl-sm bg-accent-soft px-2 py-1 text-[10px] leading-snug">Yes: 2 years on the frame and 1 year on fabric and finish.</div>
              <p className="flex items-center gap-1 text-[9px] text-faint"><span className="rounded-sm bg-hl px-1 font-semibold text-ink">Source</span>warranty-terms.pdf</p>
            </div>
          </div>
          <span className="absolute -bottom-0 right-3 hidden" />
        </div>
      </div>
    </div>
  );
}

