/**
 * Pre-paint script (SPEC §0.9): applies Comfort Controls and the logo-intro flag before first
 * paint so nothing flashes. Keep it tiny and dependency-free — it's inlined in <head>.
 */
export const COMFORT_KEY = "dawson.comfort.v1";
export const LOGO_INTRO_KEY = "dd:logo-intro";

export const HEAD_SCRIPT = `(function(){var d=document.documentElement;try{var c=JSON.parse(localStorage.getItem("${COMFORT_KEY}")||"{}");if(c.textScale)d.style.setProperty("--text-scale",String(c.textScale));if(c.contrast==="high")d.dataset.contrast="high";if(c.motion==="reduce")d.dataset.motion="reduce";}catch(e){}var r=d.dataset.motion==="reduce"||window.matchMedia("(prefers-reduced-motion: reduce)").matches;try{if(!r&&!sessionStorage.getItem("${LOGO_INTRO_KEY}")){sessionStorage.setItem("${LOGO_INTRO_KEY}","1");d.dataset.logoIntro="play";setTimeout(function(){delete d.dataset.logoIntro;},3000);}}catch(e){}})();`;
