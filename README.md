# Gabriel's Animation Studio

Draw a stick figure, dress it up, morph it into a real character, then make it walk, dance or fly and play with it:
**Slingshot Siege** (60 physics levels across 5 worlds, with stars and unlockable powers), **Backyard Defense** (30 lane-defence levels where your hero in different gear guards the clubhouse), **Hero Kart** (drive over endless hills and upgrade your kart), **Gem Quest** (30 match-3 levels with power stones), **Beat Run** (18 rhythm songs), **Draw Path** (24 draw-a-ramp physics puzzles), **Monster Pals** (befriend and collect 25 slime pals), a coin-powered **Gear Shop** (with Endless Dash upgrades), 🎬 How to play demos for every big game, eight mini games, a two-player VS Fight (or fight the computer), Monster Brawl, a Space Quest from Earth to the Sun, Sky Pilot (fly a plane), Hoop Shot (basketball),
a House Hunt through eight rooms, and a beta online VS mode with room codes.
Built for iPad (finger or Apple Pencil) and works on any computer too.

**Play it here:** https://gberry747-lab.github.io/gabriels-animation-studio/

The whole game is one file, `index.html`, plus the Matter.js physics library in `vendor/`. No install, no build, no accounts.
Drawings, saved heroes, best scores, Space Quest progress and your own music file are saved in the browser on the device.
7 built-in original songs to pick from in the 🎵 Music panel (Elevator Groove plays by default), or play your own song file.

See `START-HERE.md` for how to play and how to update the hosted copy.

**Install as an offline app:** open the link in Safari on the iPad, tap Share, then **Add to Home Screen**. Open it once online; after that it works with no internet (only the online leaderboards and Online VS need a connection). See `START-HERE.md`.

Developer check: `node test/run.js` runs 96 headless logic checks (no packages needed).
