import numpy as np, potrace, json, re
from scipy import ndimage as nd
m=np.load('./.logo-work/masks.npy'); green,gray,light,dark=m
H,W=green.shape
def trace(mask,turd=10,opt=0.6):
    bm=potrace.Bitmap(~mask)
    path=bm.trace(turdsize=turd,alphamax=1.0,opticurve=True,opttolerance=opt)
    f=lambda p:f"{p.x:.0f} {p.y:.0f}"
    d=[]
    for c in path:
        d.append("M"+f(c.start_point))
        for s in c.segments:
            if s.is_corner: d.append("L"+f(s.c)+"L"+f(s.end_point))
            else: d.append("C"+f(s.c1)+" "+f(s.c2)+" "+f(s.end_point))
        d.append("Z")
    s="".join(d)
    s=re.sub(r' -',' -',s)
    return s
def comps(mask):
    lab,n=nd.label(mask); objs=nd.find_objects(lab); sizes=nd.sum(mask,lab,range(1,n+1))
    return lab,objs,sizes
def region(mask,x0,x1,y0,y1):
    r=np.zeros_like(mask); r[y0:y1,x0:x1]=mask[y0:y1,x0:x1]; return r
def bigonly(mask,minsize):
    lab,objs,sizes=comps(mask)
    return np.isin(lab,[i+1 for i,s in enumerate(sizes) if s>=minsize])
fringe=nd.binary_dilation(green,iterations=6)
lightc=light & ~fringe
greenc=nd.binary_closing(bigonly(green,500),iterations=2)
parts={}
parts['roof']=trace(bigonly(region(lightc,700,1440,20,360),2000))
grayc=bigonly(nd.binary_opening(gray,iterations=1),3000)
parts['innerRoof']=trace(region(grayc,840,1250,90,270) & ~region(grayc,940,1150,222,410))
parts['window']=trace(region(grayc,940,1150,220,410))
parts['figure']=trace(greenc,turd=40,opt=0.8)
hands=region(lightc,480,1520,340,800)
hands=bigonly(hands,60)
parts['hands']=trace(hands,turd=12,opt=0.5)
# wordmark
dk=bigonly(dark,100)
parts['nameDark']=trace(region(dk,212,1786,800,940),turd=6,opt=0.3)
parts['nameAnd']=trace(bigonly(region(lightc,830,1160,800,940),100),turd=6,opt=0.3)
parts['homeCare']=trace(bigonly(region(lightc,440,1545,965,1070),100),turd=6,opt=0.3)
llcm=region(light,1545,1660,1020,1075); parts['llc']=trace(llcm & bigonly(llcm,20),turd=2,opt=0.2)
geo={
 'hbL':[[52,917.5],[110,917],[122,882],[140,1007],[157,789],[175,967],[189,866],[208,913],[216,913]],
 'hbR':[[1780,914.5],[1803,914],[1816,879],[1834,1003],[1851,788],[1869,964],[1884,862],[1898,909],[1946,909.5]],
 'bar':[[232,950.5],[1765,950.5]],
 'roofLine':[[730,312],[1046,58],[1420,345]],
 'innerLine':[[850,268],[1046,104],[1242,268]],
 'windowRect':[959,232,170,164,20],
 'glass':[966,239,156,150,12],
}
json.dump({'parts':parts,'geo':geo,'size':[W,H]},open('./.logo-work/logo.json','w'))
for k,v in parts.items(): print(k,len(v))
