import "server-only";
import { codeToHtml } from "shiki";

export type Lang = "bash" | "javascript" | "python" | "json" | "html" | "text";

/** Server-side syntax highlighting. The code window is dark in both themes, so one theme is enough. */
export async function highlight(code: string, lang: Lang): Promise<string> {
  return codeToHtml(code, { lang, theme: "github-dark-default" });
}
