# Zotero-Cat Design System

The visual + interaction language for **Zotero-Cat** — an open-source Zotero plugin and its bilingual marketing site at [zoterocat.org](https://zoterocat.org).

> Zotero-Cat is a Zotero item-pane assistant for reading, summarizing, reviewing, and discussing research items with user-selected model providers. It follows the interaction style of Codex in VS Code, but keeps the provider configurable.

The product is **independent open source**, **not affiliated with Zotero**, and **bilingual (zh + en)** by default — these three facts shape every design decision in this system.

---

## Sources

This design system was distilled from two repositories the user attached:

| Source                                | Path / URL                                                                                                | What it contributes                                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Plugin (TypeScript / Zotero 9 add-on) | `Zotero-Cat/` &nbsp;·&nbsp; `github.com/qianjindexiaozu/Zotero-Cat`                                       | Item-pane chat UI, preferences pane, runtime tokens (`addon/content/zoteroPane.css`), Fluent localization.      |
| Marketing site (Astro 5, SSG)         | `Zotero-Cat-Web/` &nbsp;·&nbsp; `github.com/qianjindexiaozu/Zotero-Cat-Web` &nbsp;·&nbsp; `zoterocat.org` | Public design tokens (`src/styles/tokens.css`), text-only brand mark, hero GIF / story sections, content rules. |

The original spec lives at `Zotero-Cat-Web/docs/superpowers/specs/2026-05-04-zoterocat-website-design.md` (not pre-loaded — read on demand).

---

## Two products, one voice

| Surface    | Form factor                                            | Audience              | Tone                              |
| ---------- | ------------------------------------------------------ | --------------------- | --------------------------------- |
| **Plugin** | Compact 360px-tall pane inside Zotero's right item bar | Researchers mid-paper | Functional, terse, runtime        |
| **Web**    | Full-bleed marketing + bilingual docs site             | First-time visitors   | Welcoming, narrative, opinionated |

The plugin is **all chat, no chrome**: a streaming message list, a composer, a context preview, and a tiny diagnostics drawer. The marketing site is **all narrative**: a hero with a plugin GIF frame, a feature triad with GIFs, a 4-step quickstart, a provider chip wall, and a "where the name comes from" story block.

---

## Index

```
README.md                  ← you are here
SKILL.md                   ← cross-compatible skill manifest for Claude Code
colors_and_type.css        ← canonical CSS variables — colors, type, spacing, radii, shadows, motion
fonts/                     ← Inter + JetBrains Mono (Google Fonts substitution — see VISUAL FOUNDATIONS)
assets/
  og-default.png           ← OG card raster
  source-tokens.css        ← copy of upstream tokens.css for diffing
preview/                   ← design system cards (registered in the Design System tab)
ui_kits/
  plugin/                  ← Zotero item-pane chat UI recreation
  web/                     ← marketing site (hero / quickstart / feature triad)
```

---

## CONTENT FUNDAMENTALS

The voice is **shy-confident, tools-first, bilingual**. Copy reads like it was written by someone who built the thing themselves, not by a marketing team.

### Tone & person

- **Second person, casual.** "Make your Zotero read, think, talk back." / "让你的 Zotero 会读、会想、会聊。" The product addresses _you_; it never refers to itself in the third person on the marketing surface.
- **Imperative verbs in CTAs.** "Pick a provider", "Paste API Key once", "Start chatting", "5-min start", "Download zotero-cat.xpi". No "Click here", no "Get started for free".
- **Plain in zh, plain in en.** Chinese copy uses everyday language ("不到 5 分钟，你就能开始用") rather than corporate translation Chinese. English copy uses contractions and short sentences ("Disagree with the conclusion? Keep asking.").
- **Self-aware origin story.** The "where the name comes from" section is required canon: a cat downstairs in a dorm + the Linux `cat` command. Lean into it.

### Casing

- **Sentence case everywhere.** Headings, nav, buttons. Never Title Case. `Features`, `Download`, `Guide`, `FAQ`. Even `5-min start`.
- **Compound brand name** is always `Zotero-Cat` (hyphen, capital Z, capital C). Never `Zotero Cat`, `zoterocat` (the domain is the only lowercase exception), or `zotero-cat` (file/CLI exception only).
- **CLI-style references** are allowed only in docs or the origin story. Do not use terminal mocks as product UI.

### Vocabulary — required

- "Item-pane" (Zotero's term, hyphenated)
- "OpenAI-compatible" (never "OpenAI compatible")
- "API Key" (capital A, capital K — matches the plugin's pref label)
- "Provider" (not "vendor", not "service")
- "Streaming" / "stream-first"
- "Reasoning effort" (provider-declared)

### Vocabulary — banned (per `Zotero-Cat-Web/README.md`, strictly enforced)

| ❌ Don't say                                              | ✅ Say instead                                              |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| Prices, "$", "free", "credits", "cheap"                   | Link to the provider's pricing page                         |
| "Best model", "we recommend GPT-4"                        | Direct readers to the live `/models` list inside the plugin |
| "Works in mainland China", "needs a VPN", "blocked in CN" | Nothing — never mention regions                             |
| "Better than [other Zotero plugin]"                       | Don't reference other plugins at all                        |
| "AI-powered", "leverage", "synergy", "boost productivity" | Concrete verbs: read, summarize, discuss                    |

### Emoji & punctuation

- **No emoji** anywhere — not in copy, not in headings, not in commit messages.
- **Arrow glyphs** are allowed and encouraged: `→` after primary CTAs, `↗` after external links.
- **Em dashes** (`—`) are used liberally; en dashes are not. Chinese uses `·` (中点) as a separator in footers and inline lists.
- **The `_` underscore** may appear in code examples, but not as a homepage product motif.

### Examples (verbatim from the codebase)

> Make your Zotero read, think, talk back.
> 让你的 Zotero 会读、会想、会聊。

> Open any PDF, get a summary, key points and open questions in seconds.
> 点开任意 PDF，几秒内拿到中文摘要、要点和疑问。

> Disagree with the conclusion? Keep asking. It carries the paper context across the conversation.
> 不同意它的结论？继续问。它带着这篇文献的上下文跟你聊。

> An independent open-source project, not affiliated with Zotero.
> 一个独立开源项目，与 Zotero 团队无关。

---

## VISUAL FOUNDATIONS

Apple-leaning sensibility — **liquid glass surfaces**, **cool luminous light**, **deep-graphite dark**, one **sky-blue accent**, generous breathing room, restrained motion, soft shadows. Nothing screams.

### Color

Three named brand colors, plus warm neutrals:

| Token              | Hex       | Role                                                                                                    |
| ------------------ | --------- | ------------------------------------------------------------------------------------------------------- |
| `--brand-blue`     | `#5AA3F5` | Primary accent, selected UI, soft CTA tint                                                              |
| `--brand-blue-ink` | `#3D8BFF` | The same accent rendered legibly on the cool-paper light bg — for link text, focus rings, prose accents |
| `--brand-graphite` | `#1A1A1F` | Default ink, deep dark surface                                                                          |
| `--brand-paper`    | `#FFFFFF` | Default light surface used inside translucent glass materials                                           |
| `--brand-signal`   | `#4ECDC4` | Cyan support color — connection-OK states, second-tier accents (use sparingly)                          |

**Rules:**

- One accent at a time. Don't pair `--brand-blue` with `--brand-signal` in the same component.
- Light mode is the default. Use broad cool luminous backgrounds behind translucent surfaces — never flat white walls everywhere.
- Dark mode lifts the blue to `#409CFF` to keep contrast against `#0F0F12`.
- Semantic state colors (`--color-success` `#1F5C23`, `--color-warning` `#8A5A00`, `--color-danger` `#8A1C1C`) are **muted, earthy hex values**, not neon.

### Typography

- **Apple system stack first**, Inter as a web fallback: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Inter', …, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui`. PingFang in front for Chinese.
- **JetBrains Mono** for code and runtime numerics ("1/4", "Step 1").
- **Display tracking** is tight (`-0.02em`) at large sizes; body tracking is normal.
- Hero headlines use `clamp(2.5rem, 5vw + 1rem, 6rem)` — they breathe at desktop, fold gracefully on mobile.
- Body is `1rem` (16px) on the plugin and `1.125rem` (18px) on long-form web — the marketing site reads like a generous magazine, the plugin reads like compact product UI.
- **Line-height nudge for CJK**: `:lang(zh) { --lh-body: 1.8 }`. Always.

### Spacing

8pt grid: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 80 · 128`. The marketing site favors big jumps (24 → 80 → 128); the plugin compresses to (4 → 6 → 8 → 12). Never invent a one-off `14px`.

### Liquid Glass

- Shared surfaces use `--glass-bg`, `--glass-border`, `--glass-highlight`, `--glass-filter`, and `--glass-shadow`.
- Glass should feel like a material: translucent fill, one clean highlight edge, soft depth, and `backdrop-filter: saturate(180%) blur(24px)`.
- Keep the effect restrained. Do not stack glass panels inside glass panels unless the inner panel is an actual interaction surface.
- Page backgrounds use broad cool light bands from `--page-glow`; do not add discrete orbs, bokeh, grain, or decorative blobs.

### Backgrounds

- **No decorative image backgrounds.** GIF placeholders may use a quiet generated fill only while final demo media is pending.
- **No textures, no grain, no noise.** The page is clean and luminous.
- **No full-bleed photography.** GIFs of the actual plugin are the only "imagery"; they live inside `<GifFrame>` cards with a 1px border and the page bg — never full-bleed.
- **No hand-drawn illustrations** in production UI.

### Animation

- **All motion is small and earned.** `cubic-bezier(0.22, 1, 0.36, 1)` is the standard ease (Apple-style).
- Three durations: `--dur-fast: 140ms` (color/opacity), `--dur-base: 220ms` (component), `--dur-slow: 320ms` (page-level fade-up).
- The homepage hero uses a GIF/WebM frame of the plugin UI, not a terminal mock. The plugin has no terminal surface.
- Streaming assistant messages get a `▋` block cursor with `step-end` at 800ms — same aesthetic family.
- **Bouncy springs are forbidden.** No `cubic-bezier(.68,-0.55,…)`-style overshoots.
- All keyframes live behind `@media (prefers-reduced-motion: no-preference)`.

### Hover & press states

- **Hover (links / nav)**: color shifts from `--color-fg-muted` to `--color-fg`. Not opacity.
- **Hover (primary button)**: bg flips from `--color-accent` to `--color-fg`, fg flips to `--color-bg`. The button gets _more_ contrast on hover, not less.
- **Hover (ghost / card)**: border darkens from `--color-border` to `--color-border-strong` or `--color-accent`.
- **Press**: `transform: translateY(1px)` — a one-pixel sink. No scale. No ripple.
- **Focus-visible**: 2px outline in `--color-accent-ink`, 2px offset, `--r-sm` rounded. WCAG 2.2 SC 1.4.11 compliant.

### Borders & dividers

- **Hairlines**, always `1px solid var(--color-border)` (`#E6E5DD` light / `#25252B` dark). The header uses `color-mix(…, 60%, transparent)` to feel even more graphite-paper.
- **No double borders, no inset shadows masquerading as borders, no left-accent-bar cards.**

### Shadows

Three tiers, soft and Apple-ish:

| Token               | Value                                                | Use                                                               |
| ------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| `--shadow-1`        | `0 1px 2px / 0 1px 1px` rgba(20,20,25,0.04)          | Resting cards                                                     |
| `--shadow-2`        | `0 4px 14px -4px / 0 2px 4px` rgba(20,20,25,0.08)    | Hover cards, dropdowns                                            |
| `--shadow-3`        | `0 14px 40px -10px / 0 4px 10px` rgba(20,20,25,0.18) | Modal, popover                                                    |
| `--shadow-terminal` | `0 30px 60px -30px rgba(0,0,0,0.45)`                 | Legacy code-block depth token; do not use for homepage product UI |

Dark mode shadows are heavier-alpha (0.5–0.6) since they're on near-black.

### Transparency & blur

- Header, buttons, cards, GIF frames, callouts, provider chips, and doc panels may use the shared glass material. Keep blur and transparency tokenized.
- `color-mix(in srgb, currentColor X%, transparent)` is the **canonical** way to get tinted neutrals — used heavily in the plugin's CSS so it inherits Zotero's theme.

### Radii

`4 · 6 · 10 · 14 · 20 · 999`. The plugin runs tight (4–6); the marketing site runs softer (10–16). Pills (`999`) only on chips and the provider grid — never on buttons (buttons are `--r-md` 10px).

### Cards

Use the shared liquid glass material: `background: var(--glass-bg)`, `border: 1px solid var(--glass-border)`, `box-shadow: var(--glass-shadow)`, and `backdrop-filter: var(--glass-filter)`. Hover can lift to `--glass-shadow-hover` and strengthen the border. **No colored left-bar accent cards.**

### Layout rules

- Three canonical widths: `--w-prose: 720px` (long-form text), `--w-wide: 1080px` (sub-grids), `--w-hero: 1200px` (the hero strip and most marketing sections).
- Sections separate with `padding: var(--sp-10) var(--sp-3)` (80px vertical, 12px gutter on mobile).
- Site header is `position: sticky; top: 0; z-index: 10`. Footer is the only thing that uses `margin-block-start: var(--sp-12)`.

### Imagery vibe

- **Clean and cool**, not cold. The light mode uses a soft page background with white surfaces.
- **No B&W**, **no grain**, **no duotone**.
- **GIFs of the plugin in action** are the only photographic content. They use the actual product UI on a `--color-bg` background — they look like screenshots, not stock.

---

## Brand Mark

The brand mark is text-only: `Zotero-Cat`. Do not add a favicon, header artwork,
mascot, wordmark SVG, or raster brand export unless the product direction changes
again.

### Inline glyphs

- **Inline UI glyphs** are unicode characters, not SVGs:
  - `→` after primary CTA labels
  - `↗` after external links (`View on GitHub ↗`)
  - `_` only in code examples
  - `▋` as the streaming-message cursor
  - `·` as the inline separator (especially in the footer)
  - `➤` (filled triangle) as the send-message button glyph in the plugin
  - `■` as the stop-message button glyph in the plugin
  - `⧉` as the copy-message button glyph; `✓` for "copied" feedback
- **The theme toggle** is text-only.
- **Traffic-light dots** appear on GIF frames — `#FF5F57 / #FEBC2E / #28C840`. These are macOS-window decoration, not interactive.
- **No emoji as visual shorthand.** None. (And per Content Fundamentals — none in copy either.)
- **No third-party icon system** is loaded.

---

## See also

- `SKILL.md` — for using this folder as an Agent Skill in Claude Code.
- `preview/` — every card registered in the Design System tab.
- `ui_kits/plugin/` and `ui_kits/web/` — high-fidelity recreations of both surfaces for prototyping.
