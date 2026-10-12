# Original background music for the videos (no licensing needed): a bouncy chiptune-style loop.
# Usage: python3 music.py out.wav seconds [bpm] [seed] [style: tour|promo]
import math, random, struct, sys, wave
out, secs = sys.argv[1], float(sys.argv[2])
bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 112
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 7
style = sys.argv[5] if len(sys.argv) > 5 else 'tour'
R = 32000; n = int(secs * R); buf = [0.0] * n; rnd = random.Random(seed)
beat = 60 / bpm; step = beat / 2
def note(f, t0, dur, vol, kind='square'):
    a, b = int(t0 * R), min(n, int((t0 + dur) * R))
    for i in range(a, b):
        t = (i - a) / R; env = min(1, t * 80) * max(0, 1 - t / dur) ** 1.5
        ph = (f * t) % 1
        v = (1 if ph < .5 else -1) * .5 if kind == 'square' else (4 * abs(ph - .5) - 1) if kind == 'tri' else math.sin(2 * math.pi * f * t)
        buf[i] += v * vol * env
def kick(t0):
    a = int(t0 * R)
    for i in range(a, min(n, a + int(.18 * R))):
        t = (i - a) / R; f = 50 + 110 * math.exp(-t * 30); buf[i] += math.sin(2 * math.pi * f * t) * .55 * math.exp(-t * 14)
def hat(t0, vol=.08):
    a = int(t0 * R)
    for i in range(a, min(n, a + int(.04 * R))):
        t = (i - a) / R; buf[i] += (rnd.random() * 2 - 1) * vol * math.exp(-t * 90)
def clap(t0):
    a = int(t0 * R)
    for i in range(a, min(n, a + int(.12 * R))):
        t = (i - a) / R; buf[i] += (rnd.random() * 2 - 1) * .18 * math.exp(-t * 28)
root = 261.63; scale = [0, 2, 4, 7, 9, 12, 14, 16]
chords = [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]]   # C, Am, F, G
hz = lambda semi: root * 2 ** (semi / 12)
mel = [rnd.choice(scale) for _ in range(16)]
t, bar = 0.0, 0
while t < secs:
    ch = chords[bar % 4]
    for b in range(4):
        tb = t + b * beat
        kick(tb) if b % 2 == 0 or style == 'promo' else None
        if b % 2 == 1: clap(tb)
        hat(tb + step, .07); hat(tb, .04)
        note(hz(ch[0] - 24), tb, beat * .9, .16, 'tri')
    for k in range(8):
        arp = ch[k % 3] + (12 if k >= 4 else 0)
        note(hz(arp), t + k * step, step * .8, .045, 'square')
    if bar % 8 >= 2:
        for k in range(8):
            m = mel[(bar * 8 + k) % 16]
            if (k + bar) % 3 != 2: note(hz(m + 12), t + k * step, step * .9, .05, 'tri')
    t += 4 * beat; bar += 1
fade = int(1.5 * R)
for i in range(n):
    if i < int(.3 * R): buf[i] *= i / (.3 * R)
    if i > n - fade: buf[i] *= (n - i) / fade
peak = max(1e-9, max(abs(x) for x in buf)); g = .8 / peak
with wave.open(out, 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(R)
    w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, x * g)) * 32767)) for x in buf))
print('wrote', out, round(secs, 1), 's')
