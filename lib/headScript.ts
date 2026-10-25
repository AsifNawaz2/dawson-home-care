/**
 * Pre-paint script (SPEC §0.9): applies Comfort Controls and the intro flags before first paint so
 * nothing flashes. Keep it tiny and dependency-free — it's inlined in <head>.
 *
 * Intros play once per browser session (BUILD_DECISIONS answer 9):
 *  - landing on Home → the designed intro video (html[data-home-intro="play"], or "still" when
 *    motion is reduced). It also uses up the logo draw-in, so that never plays this session.
 *    The video is started here, as soon as the parser reaches it, so it doesn't wait for React;
 *    scrolling is locked until components/home/HomeIntro.tsx takes over (16 s failsafe). An Escape
 *    pressed before React is ready is remembered (html[data-hi-esc]) and ends the intro on mount.
 *  - landing anywhere else → the BRAND_FINAL §3.3A logo draw-in (html[data-logo-intro="play"]).
 *
 * Office open/closed (html[data-office]) is decided here too, so after-hours lines
 * (<WhenClosed>) are laid out before first paint and nothing shifts when React takes over.
 * Same rule as lib/officeHours.ts: Mon–Fri 08:00–16:59 America/New_York, minus confirmed holidays.
 */
import { hours } from "@/content/site.config";
export const COMFORT_KEY = "dawson.comfort.v1";
export const LOGO_INTRO_KEY = "dd:logo-intro";
export const HOME_INTRO_KEY = "dd:home-intro";
/** /reveal-notes logo A/B toggle: overrides NEXT_PUBLIC_LOGO_FIGURE for this tab only. */
export const LOGO_FIGURE_KEY = "dd:logo-figure";

const HOLIDAYS = JSON.stringify(
  hours.holidays.confirmed ? hours.holidays.value.map((h) => h.date) : [],
);
const OFFICE = `try{var P={};new Intl.DateTimeFormat("en-US",{timeZone:"${hours.timeZone}",year:"numeric",month:"2-digit",day:"2-digit",weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date()).forEach(function(x){P[x.type]=x.value});var wd=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(P.weekday),mn=+P.hour*60+ +P.minute;d.dataset.office=wd>=1&&wd<=5&&mn>=480&&mn<1020&&${HOLIDAYS}.indexOf(P.year+"-"+P.month+"-"+P.day)<0?"open":"closed";}catch(e){}`;

export const HEAD_SCRIPT = `(function(){var d=document.documentElement;${OFFICE}try{var c=JSON.parse(localStorage.getItem("${COMFORT_KEY}")||"{}");if(c.textScale)d.style.setProperty("--text-scale",String(c.textScale));if(c.contrast==="high")d.dataset.contrast="high";if(c.motion==="reduce")d.dataset.motion="reduce";}catch(e){}try{var f=sessionStorage.getItem("${LOGO_FIGURE_KEY}");if(f==="a"||f==="b")d.dataset.logoFigure=f;}catch(e){}var r=d.dataset.motion==="reduce"||window.matchMedia("(prefers-reduced-motion: reduce)").matches;try{var s=sessionStorage,h=window.innerHeight;if(location.pathname==="/"&&!s.getItem("${HOME_INTRO_KEY}")){s.setItem("${HOME_INTRO_KEY}","1");s.setItem("${LOGO_INTRO_KEY}","1");d.dataset.homeIntro=r||h<200||h>2000?"still":"play";if(d.dataset.homeIntro==="play"){d.style.overflow="hidden";d.dataset.hiLock="";addEventListener("keydown",function k(e){if(e.key==="Escape"){d.dataset.hiEsc="";removeEventListener("keydown",k)}});var o=new MutationObserver(function(){var v=document.getElementById("home-intro-video");if(v){o.disconnect();v.muted=true;var p=v.play();if(p&&p.catch)p.catch(function(){});}});o.observe(d,{childList:true,subtree:true});setTimeout(function(){o.disconnect();if(!d.dataset.hiChrome){d.style.overflow="";delete d.dataset.hiLock;}},16000);}}else if(!r&&!s.getItem("${LOGO_INTRO_KEY}")){s.setItem("${LOGO_INTRO_KEY}","1");d.dataset.logoIntro="play";setTimeout(function(){delete d.dataset.logoIntro;},3000);}}catch(e){}})();`;
