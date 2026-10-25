# Dawson & Dawson Home Care — website rebuild

Private preview of the new website for Dawson and Dawson Home Care LLC (Beaufort, SC). Nothing here is public.

## Preview it (GitHub Codespaces — no typing needed)

1. On the repository page on GitHub, click the green **Code** button → **Codespaces** tab → **Create codespace on** this branch.
2. Wait while it sets itself up (the first time takes a few minutes: it installs everything).
3. The website starts by itself and opens in a new browser tab called **Website preview**. If your browser blocks the pop-up, click **Open in Browser** in the little message that appears in the bottom-right corner, or open the **Ports** tab and click the globe icon next to port 3000.

Every time you reopen the Codespace, the website starts again automatically.

**Reveal notes:** add `/reveal-notes` to the preview address. It lists what's new, the seven fixes, lets you switch the logo between Option A and Option B, and shows everything we still need from you. It isn't linked from the site and won't exist on the live website.

Forms in the preview don't send anything: each request is saved as a file in the Codespace (`.leads/`) so you can see exactly what GoHighLevel will receive.

## For developers

See [CLAUDE.md](CLAUDE.md) for sources of truth, decisions, conventions and commands, and [docs/BUILD_DECISIONS.md](docs/BUILD_DECISIONS.md) for every design decision.
