# Text overlays as transparent PNGs (this ffmpeg has no drawtext).
# Usage: python3 banner.py out.png width height mode title [subtitle]
#   mode top: dark band at the top with title + subtitle; bottom: dark band at the bottom; card: centered big text, no band
import sys
from PIL import Image, ImageDraw, ImageFont
out,w,h,mode,title=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),sys.argv[4],sys.argv[5];sub=sys.argv[6] if len(sys.argv)>6 else ''
F='/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf'
im=Image.new('RGBA',(w,h),(0,0,0,0));d=ImageDraw.Draw(im)
def fit(text,size,maxw):
    while size>14:
        f=ImageFont.truetype(F,size)
        if d.textlength(text,font=f)<=maxw:return f
        size-=2
    return ImageFont.truetype(F,size)
def center(text,y,size,fill,stroke):
    f=fit(text,size,w*.92);tw=d.textlength(text,font=f);d.text(((w-tw)/2,y),text,font=f,fill=fill,stroke_width=stroke,stroke_fill=(41,44,42,255))
s=w/1280
if mode=='top':
    bh=int((118 if sub else 86)*s);d.rectangle([0,0,w,bh],fill=(41,44,42,140));center(title,int(8*s),int(58*s),(255,255,255,255),int(5*s))
    if sub:center(sub,int(72*s),int(30*s),(255,209,102,255),int(3*s))
elif mode=='bottom':
    bh=int((118 if sub else 92)*s);d.rectangle([0,h-bh,w,h],fill=(41,44,42,150));center(title,h-bh+int(12*s),int(44*s),(255,255,255,255),int(4*s))
    if sub:center(sub,h-bh+int(66*s),int(30*s),(255,209,102,255),int(3*s))
else:
    center(title,int(h*.40),int(90*s),(255,255,255,255),int(7*s))
    if sub:center(sub,int(h*.40+110*s),int(42*s),(255,209,102,255),int(4*s))
im.save(out)
