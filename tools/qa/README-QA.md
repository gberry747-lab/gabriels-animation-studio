# QA harness for the kids' drawing game (single file: index.html)

Folder: tools/qa in this repo (call it QA below). One-time setup: `cd tools/qa && npm init -y && npm install playwright@1.64.1` (Chromium comes with it; node_modules is git-ignored). The OpenRouter helpers need `~/.local/bin/ask` and `~/.config/openrouter/key` on this Mac.
Used on 2026-10-29 by a 10-agent QA swarm (one agent per game group + a verifier per patch); the patch format below is how their fixes were applied to main one group at a time.

## Serve your worktree and play it headlessly
    QA/serve.sh "$PWD" <PORT>        # static server in the background; prints the url. Use the PORT you were given.
    node -e '
      const {launch}=require("QA/play.js");            // use the absolute path
      (async()=>{const api=await launch({url:"http://localhost:<PORT>/index.html",out:"QA/shots/<key>/before"});
        console.log(await api.start("brawl"));        // data-game value or button id
        await api.shot("start");
        await api.hold("ArrowRight",600); await api.press("KeyF"); await api.wait(500); await api.shot("punch");
        await api.drag(400,300,700,300,400);           // finger steering, GAME coords 1280x720
        await api.tap(640,400);                        // tap on the picture (GAME coords)
        await api.pad("Punch");                        // press an on-screen button by text
        console.log(await api.state());               // playing, title, pads, hearts, score, message, result{title,text} or null, modalOpen/modalText
        console.log("errors:",api.errors);            // console errors + uncaught exceptions
        await api.close();})();'

Game ids: legacy (data-game): platform dash catch flap pop dodge bounce goal. Big games (button id): vs2 vscpu brawl quest house plane hoops sling defense kart gems beat path pals notes.
start(id) also clicks the first enabled card/Play button if a picker modal opens (pass {pickFirst:false} to handle the modal yourself with api.clickText('...') / api.closeModal()).
Keyboard: ArrowLeft/ArrowRight move, ArrowUp or Space jump, ArrowDown down, KeyF = a (punch/fire/shoot), KeyG = b (kick), KeyH = c (block/shield). 2-player: WASD+FGH vs arrows+JKL.
The page runs with a seeded stick-figure drawing and player name "Tester". A real browser test is still the truth: the harness is headless Chromium 1024x768; also try viewport {width:844,height:390} (phone sideways) and {width:390,height:844} by passing viewport to launch().
Game logic is NOT reachable from page.evaluate (the script is wrapped). Observe through the DOM/HUD/screenshots, or drive the headless test harness: `node -e 'const h=require("./test/run.js");const t=h.boot();...'` exposes window.__t hooks (startModGame, inputDown/inputUp, game, step frames with h.step(n)) - read test/run.js for examples.

## Headless unit checks
    node test/run.js         # 106 checks, ~40 s. Must stay green. "Endless Dash upgrades ... shield did not block" is flaky; rerun once before believing it.

## OpenRouter second opinions (standing rule: use them, then apply your own judgment)
    QA/askcode.sh <file-with-the-code-region> "<question>"     # cheap model code review; the child's name is redacted for you
    QA/askvision.py -p "<question>" shot1.png shot2.png          # vision model looks at IN-GAME screenshots
Never send the home screen (it shows the app title with the child's name) and never type the child's name into a prompt. Extract the game's code region to a temp file first (sed -n 'A,Bp' index.html > /tmp/x.js).

## Patch format (REQUIRED deliverable): QA/patches/<key>.py
Exact-string replacements, each asserted unique, so it applies to the current main regardless of what other agents change:
    import io,sys
    P=sys.argv[1] if len(sys.argv)>1 else 'index.html'
    s=io.open(P,encoding='utf-8').read()
    def rep(old,new,count=1):
        global s
        n=s.count(old); assert n==count,(n,count,old[:90]); s=s.replace(old,new)
    rep("<exact old text>","<new text>")
    io.open(P,'w',encoding='utf-8').write(s); print('patched',P)
Keep old strings as short as possible while still unique (they must still match after other agents' patches, so avoid spanning code that is not yours). Test it twice: on your worktree copy (python3 -I QA/patches/<key>.py index.html) and on a clean copy (git show HEAD:index.html > /tmp/orig-<key>.html; python3 -I QA/patches/<key>.py /tmp/orig-<key>.html). Extra unit checks go in a second script QA/patches/<key>-tests.py that inserts before the line containing `check('scenes still fine after everything'` in test/run.js.

## House rules for this app
- Audience: a 9-year-old boy with anxiety. Failure must be gentle and encouraging, never shaming. Bright, colourful, emoji on buttons, few choices on screen at once, boy-friendly action names (Power, Gear, Battle, Quest). Respect prefers-reduced-motion.
- One file, no new libraries, no network calls, keep it working offline. New top-level consts must sit above the init line `load();initControls();initPart2();` (TDZ).
- Do not restyle shared brand elements (header, palette, logo). Keep changes local to your games. Do not break the full-screen play layout (body.playing, fitStage, .game-top overlay) or the finger steering (TS, tsStart/tsMove/tsEnd, padKeys).
- Do not commit. Do not edit files other than index.html (and test/run.js only via the -tests.py patch).
