import numpy as np
from PIL import Image
from scipy import ndimage as nd
im=Image.open('./docs/current-logo.png').convert('RGB')
a=np.asarray(im).astype(int)
Y0=448; a=a[Y0:1556]
R,G,B=a[...,0],a[...,1],a[...,2]
mx=a.max(2); mn=a.min(2)
ink = mn<215
green = ink & (G>R+15) & (G>B+25)
gray = ink & ((mx-mn)<28) & ~green
purple = ink & ~green & ~gray
light = purple & ((R+G+B)/3>95)
dark = purple & ~light
np.save('./.logo-work/masks.npy', np.stack([green,gray,light,dark]))
for name,m in [('green',green),('gray',gray),('light',light),('dark',dark)]:
    Image.fromarray((~m*255).astype('uint8')).save(f'./.logo-work/m_{name}.png')
    ys,xs=np.where(m); print(name, m.sum(), xs.min(),xs.max(), ys.min(),ys.max())
