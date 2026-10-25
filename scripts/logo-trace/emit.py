import json
d=json.load(open('./.logo-work/logo.json')); p=d['parts']; g=d['geo']
pl=lambda pts:"M"+" L".join(f"{x:g} {y:g}" for x,y in pts)
x,y,w,h,r=g['windowRect']
cx,cy=x+w/2,y+h/2
win=f"M{x+r} {y} H{x+w-r} A{r} {r} 0 0 1 {x+w} {y+r} V{y+h-r} A{r} {r} 0 0 1 {x+w-r} {y+h} H{x+r} A{r} {r} 0 0 1 {x} {y+h-r} V{y+r} A{r} {r} 0 0 1 {x+r} {y} Z M{cx:g} {y} V{y+h} M{x} {cy:g} H{x+w}"
gx,gy,gw,gh,gr=g['glass']
out=f'''// Generated from docs/current-logo.png (traced, then recolored per BRAND_FINAL §3).
// Coordinates are in the source PNG's space (2000 px wide, top band cropped at y=448).
// Do not hand-edit the traced paths; adjust colors and motion in Logo.tsx / logo.css.

/** Traced filled shapes. */
export const LOGO_FILLS = {{
  roof: "{p['roof']}",
  innerRoof: "{p['innerRoof']}",
  window: "{p['window']}",
  figureA: "{p['figure']}",
  hands: "{p['hands']}",
  nameDark: "{p['nameDark']}",
  nameAnd: "{p['nameAnd']}",
  homeCare: "{p['homeCare']}",
  llc: "{p['llc']}",
}} as const;

/** Measured centerlines (stroked lines and draw-in reveal masks). */
export const LOGO_LINES = {{
  heartbeatLeft: "{pl(g['hbL'])}",
  heartbeatRight: "{pl(g['hbR'])}",
  bar: "{pl(g['bar'])}",
  roofReveal: "{pl(g['roofLine'])}",
  innerRoofReveal: "{pl(g['innerLine'])}",
  windowReveal: "{win}",
}} as const;

export const LOGO_GLASS = {{ x: {gx}, y: {gy}, width: {gw}, height: {gh}, rx: {gr} }} as const;

export type LogoFillKey = keyof typeof LOGO_FILLS;
'''
open('./components/brand/logo-paths.ts','w').write(out)
print(len(out))
