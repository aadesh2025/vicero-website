import { CHANNELS } from "@/lib/site";
import { LogoMark } from "../logo";
import { ChannelPicker } from "../channel-picker";
import { ChannelChip } from "../ui";

/** Eight channels on an ellipse, each joined to the agent by a moving dashed line. Decorative. */
const W = 760;
const H = 420;
const CX = W / 2;
const CY = H / 2;
const RX = 300;
const RY = 158;

export function ChannelHub() {
  const pts = CHANNELS.map((c, i) => {
    const a = (i / CHANNELS.length) * Math.PI * 2 - Math.PI / 2;
    return { ...c, x: CX + Math.cos(a) * RX, y: CY + Math.sin(a) * RY };
  });
  return (
    <>
      <div role="img" aria-label="Eight channels (website, WhatsApp, Instagram, Messenger, Telegram, Slack, Discord and email) connected to one Vicero agent" className="relative mx-auto hidden w-full max-w-[760px] sm:block" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" style={{ stroke: "rgb(var(--border))" }} strokeDasharray="2 6" />
          {pts.map((p) => (
            <line key={p.id} x1={p.x} y1={p.y} x2={CX} y2={CY} style={{ stroke: "rgb(var(--accent))" }} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="5 6" className="animate-dash" />
          ))}
        </svg>
        <div className="absolute flex h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-border-strong bg-surface shadow-[0_20px_40px_-20px_rgb(61_59_255/0.5)]" style={{ left: "50%", top: "50%" }}>
          <LogoMark size={34} />
          <span className="mt-1 text-[11px] font-bold">One agent</span>
        </div>
        {pts.map((p) => (
          <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}>
            <ChannelChip id={p.id} label={p.label} className="bg-surface" />
          </div>
        ))}
      </div>
      <div className="sm:hidden"><ChannelPicker /></div>
    </>
  );
}
