import type { Config } from "tailwindcss";

const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;
const meaning = (n: string) => ({ DEFAULT: rgb(`--${n}`), text: rgb(`--${n}-text`), soft: rgb(`--${n}-soft`) });

// Same token names as apps/web so the site and the product read as one brand.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: rgb("--bg"),
        hl: rgb("--hl"),
        ink: "#0D0E12",
        sidebar: rgb("--sidebar"),
        surface: { DEFAULT: rgb("--surface"), 2: rgb("--surface-2"), 3: rgb("--surface-3") },
        border: { DEFAULT: rgb("--border"), strong: rgb("--border-strong") },
        text: rgb("--text"),
        muted: rgb("--muted"),
        faint: rgb("--faint"),
        accent: { DEFAULT: rgb("--accent"), 2: rgb("--accent-2"), soft: rgb("--accent-soft"), strong: rgb("--accent-strong") },
        "on-accent": rgb("--on-accent"),
        glow: rgb("--glow"),
        ai: meaning("ai"),
        success: meaning("success"),
        warn: meaning("warn"),
        error: meaning("error"),
        info: meaning("info"),
        ring: rgb("--ring"),
        ch: {
          widget: meaning("ch-widget"),
          whatsapp: meaning("ch-whatsapp"),
          instagram: meaning("ch-instagram"),
          facebook: meaning("ch-facebook"),
          telegram: meaning("ch-telegram"),
          email: meaning("ch-email"),
          slack: meaning("ch-slack"),
          discord: meaning("ch-discord"),
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: { card: "12px", lg: "10px", md: "8px", sm: "6px" },
      boxShadow: {
        card: "0 1px 2px 0 rgb(var(--shadow) / var(--shadow-1)), 0 1px 3px 0 rgb(var(--shadow) / var(--shadow-2))",
        pop: "0 24px 60px -20px rgb(var(--shadow) / 0.25), 0 4px 12px -4px rgb(var(--shadow) / 0.08)",
        "accent-glow": "0 0 0 1px rgb(var(--accent) / 0.45), 0 8px 28px -8px rgb(var(--accent) / 0.5)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "caret-blink": { "0%,70%,100%": { opacity: "1" }, "20%,50%": { opacity: "0.2" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        dash: { to: { strokeDashoffset: "-24" } },
        sweep: { from: { backgroundSize: "0% 100%" }, to: { backgroundSize: "100% 100%" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "caret-blink": "caret-blink 1.1s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        dash: "dash 1.2s linear infinite",
        sweep: "sweep 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both",
      },
    },
  },
  plugins: [],
};
export default config;
