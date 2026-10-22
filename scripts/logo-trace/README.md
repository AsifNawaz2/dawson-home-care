# Logo trace (how `components/brand/logo-paths.ts` was made)

The logo is a faithful rebuild of the client's logo (`docs/current-logo.png`), per
BUILD_DECISIONS §H answer 8 and BRAND_FINAL §3.0 ("the PNG's geometry wins").

1. `seg.py` — splits the PNG into color layers (green figure, gray roof/window, light purple,
   dark purple) and saves boolean masks.
2. `build.py` — traces each part with potrace (filled shapes: roof, inner roof, window, figure,
   hands, lettering) and stores the measured centerlines (heartbeats, underline bar, draw-in
   reveal paths).
3. `emit.py` — writes `components/brand/logo-paths.ts`.

Run from the repo root (Python 3 with `numpy`, `scipy`, `pillow`, `potracer`):

```bash
mkdir -p .logo-work && python3 scripts/logo-trace/seg.py && python3 scripts/logo-trace/build.py && python3 scripts/logo-trace/emit.py
```

Colors, groups and motion are not in the trace — they live in `components/brand/Logo.tsx`,
`components/brand/LogoMotion.tsx` and `styles/globals.css`. You never need to re-run this unless
the client supplies a better source file.
