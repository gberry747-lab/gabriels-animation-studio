# Builds the promo videos: vertical 9:16 (TikTok / Reels / Shorts), 16:9 (YouTube) and 4:5 (Instagram / Facebook feed).
import json, os, subprocess, sys, urllib.parse as up
V = os.path.dirname(os.path.abspath(__file__)); P = V + '/promo'; G = P + '/games'; OUT = P + '/build'; os.makedirs(OUT, exist_ok=True)
URL = 'http://localhost:8766/'
def run(cmd): subprocess.run(cmd, check=True)
def ff(*a): run(['ffmpeg', '-loglevel', 'error', '-y', *a])
enc = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30']

# 1. normalise the game recordings to 1280x720 30fps
segs = {s['name']: s for s in json.load(open(G + '/segments.json'))}
for name in segs:
    out = f'{OUT}/g_{name}.mp4'
    if not os.path.exists(out):
        ff('-f', 'concat', '-safe', '0', '-i', f'{G}/{name}/list.txt', '-vf', 'crop=1184:663:58:77,scale=1280:720,fps=30', *enc, out)
hook = P + '/hook_raw.mp4'

FORMATS = {
 'vertical': dict(w=1080, h=1920, game=(1080, 608, 656), hook=(1080, 1296, 380), top=170, bottom=1330, big=104, stick=70, endT=120, endHW=520),
 'youtube':  dict(w=1920, h=1080, game=(1920, 1080, 0), hook=(1920, 1080, 0), top=40, bottom=860, big=96, stick=64, endT=110, endHW=330),
 'feed':     dict(w=1080, h=1350, game=(1080, 608, 371), hook=(940, 1128, 190), top=40, bottom=1010, big=84, stick=60, endT=100, endHW=380),
}
# clip list: (source, start, source seconds, speed, overlay items)
def big(text, where='top'): return ('big', text, where)
def stk(text, bg, where='bottom', rot=-3): return ('sticker', text, where, bg, rot)
CLIPS = [
 ('hook', 0.0, 2.9, 1.0, [big('What if your <b>DRAWING</b>...')]),
 ('hook', 2.9, 2.5, 1.0, [big('...became a <i>VIDEO GAME HERO?</i>')]),
 ('hook', 8.4, 4.5, 1.5, [big('Give it <b>gear</b>, then <i>MORPH</i> it! ✨')]),
 ('hook', 12.9, 4.0, 1.35, [big('Now it\'s <b>YOUR</b> game!')]),
 ('sling', 1.6, 3.6, 1.3, [big('<b>7</b> big adventures'), stk('🎯 Slingshot Siege', '#ffd98a')]),
 ('defense', 7.0, 6.0, 2.4, [stk('🛡️ Backyard Defense', '#bfe8a8', rot=3)]),
 ('kart', 2.0, 3.0, 1.0, [stk('🏎️ Hero Kart', '#ffd0d0')]),
 ('gems', 3.0, 4.2, 1.6, [stk('💎 Gem Quest', '#e2d4ff', rot=3)]),
 ('beat', 4.0, 3.0, 1.0, [stk('🎵 Beat Run', '#ffe0f0')]),
 ('path', 0.9, 6.0, 2.2, [stk('✏️ Draw Path', '#fff3c4', rot=3)]),
 ('pals', 3.0, 4.5, 1.6, [stk('🐾 Monster Pals', '#d4f5e0')]),
]
END_SECS = 4.5

def overlay_jobs(fmt, F):
    jobs = []
    for i, (_, _, _, _, items) in enumerate(CLIPS):
        its = []
        for it in items:
            y = F['top'] if it[2] == 'top' else F['bottom']
            if it[0] == 'big': its.append(dict(kind='big', text=it[1], y=y, size=F['big']))
            else: its.append(dict(kind='sticker', text=it[1], y=y, size=F['stick'], bg=it[3], rot=it[4]))
        jobs.append(dict(out=f'{OUT}/{fmt}_ov{i}.png', w=F['w'], h=F['h'], transparent=True, url=URL + 'zz-overlay.html?' + up.urlencode(dict(w=F['w'], h=F['h'], items=json.dumps(its)))))
    jobs.append(dict(out=f'{OUT}/{fmt}_end.png', w=F['w'], h=F['h'], url=URL + 'zz-end.html?' + up.urlencode(dict(w=F['w'], h=F['h'], t=F['endT'], hw=F['endHW']))))
    return jobs

def build(fmt):
    F = FORMATS[fmt]; W, H = F['w'], F['h']
    jobs = overlay_jobs(fmt, F); json.dump(jobs, open(f'{OUT}/{fmt}_jobs.json', 'w'))
    run(['node', V + '/cards.mjs', f'{OUT}/{fmt}_jobs.json'])
    from PIL import Image
    g = Image.new('RGB', (W, H)); px = g.load(); stops = [(0, (255, 217, 138)), (.55, (255, 138, 92)), (1, (224, 85, 154))]
    for y in range(H):
        f = y / (H - 1); a, b = next((stops[i], stops[i + 1]) for i in range(len(stops) - 1) if stops[i][0] <= f <= stops[i + 1][0]); k = (f - a[0]) / (b[0] - a[0])
        c = tuple(int(a[1][j] + (b[1][j] - a[1][j]) * k) for j in range(3))
        for x in range(W): px[x, y] = c
    g.save(f'{OUT}/{fmt}_bg.png')
    parts = []
    for i, (src, start, dur, sp, _) in enumerate(CLIPS):
        srcf = hook if src == 'hook' else f'{OUT}/g_{src}.mp4'; out = f'{OUT}/{fmt}_c{i}.mp4'; secs = round(dur / sp, 3)
        if src == 'hook':
            fw, fh, fy = F['hook']
            crop = 'crop=1000:562:140:4,colorkey=0xfffefa:0.06:0.04,' if fmt == 'youtube' else 'crop=600:706:340:7,colorkey=0xfffefa:0.06:0.04,'
            graph = f"[1]scale={W}:{H}[bg];[0]setpts=(PTS-STARTPTS)/{sp},fps=30,{crop}scale={fw}:{fh}[fg];[bg][fg]overlay=(W-w)/2:{fy}[m];[m][2]overlay=0:0,format=yuv420p"
            ff('-ss', str(start), '-t', str(dur), '-i', srcf, '-loop', '1', '-i', f'{OUT}/{fmt}_bg.png', '-i', f'{OUT}/{fmt}_ov{i}.png', '-filter_complex', graph, '-t', str(secs), *enc, out)
        else:
            fw, fh, fy = F['game']
            if fmt == 'youtube':
                graph = f"[0]setpts=(PTS-STARTPTS)/{sp},fps=30,scale={W}:{H}[m];[m][1]overlay=0:0,format=yuv420p"
            else:
                graph = f"[0]setpts=(PTS-STARTPTS)/{sp},fps=30,split[a][b];[a]scale=-2:{H},crop={W}:{H},boxblur=24:2,eq=brightness=-0.12[bg];[b]scale={fw}:{fh}[fg];[bg][fg]overlay=0:{fy}[m];[m][1]overlay=0:0,format=yuv420p"
            ff('-ss', str(start), '-t', str(dur), '-i', srcf, '-i', f'{OUT}/{fmt}_ov{i}.png', '-filter_complex', graph, '-t', str(secs), *enc, out)
        parts.append(out)
    end = f'{OUT}/{fmt}_cend.mp4'
    ff('-loop', '1', '-t', str(END_SECS), '-i', f'{OUT}/{fmt}_end.png', '-vf', f'scale={W}:{H},zoompan=z=\'min(zoom+0.0009,1.06)\':d=1:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s={W}x{H}:fps=30,fade=t=in:st=0:d=0.3', *enc, end)
    parts.append(end)
    lst = f'{OUT}/{fmt}_list.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    vid = f'{OUT}/{fmt}_video.mp4'
    ff('-f', 'concat', '-safe', '0', '-i', lst, '-vf', 'settb=AVTB,setpts=N/30/TB,fps=30', *enc, vid)
    secs = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vid], capture_output=True, text=True).stdout)
    run(['python3', V + '/music.py', f'{OUT}/{fmt}_music.wav', str(secs), '124', '21', 'promo'])
    final = f'{P}/Gabriels Animation Studio - promo {fmt}.mp4'
    ff('-i', vid, '-i', f'{OUT}/{fmt}_music.wav', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final)
    print(fmt, round(secs, 1), 's ->', final)

for fmt in (sys.argv[1:] or FORMATS):
    build(fmt)
