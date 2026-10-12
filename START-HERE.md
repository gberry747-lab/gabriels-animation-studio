**Gabriel's Animation Studio**

The entire game is in `index.html`. There is nothing to install or build. For the iPad, use the hosted address:
https://gberry747-lab.github.io/gabriels-animation-studio/

**Install it as an app (works with no internet)**

- On the iPad: open the address above in **Safari**, tap **Share**, then **Add to Home Screen**, then **Add**. An "Animation Studio" icon (a red stick figure) appears on the Home Screen and opens full-screen like a real app.
- Open it once while online. After that it works with no Wi-Fi at all: in the car, on a plane, anywhere. Drawing, Power Moves, Gear Up and every single-device game work offline.
- Needs internet: the online Top-10 leaderboards (scores made offline are kept and sent the next time it is online) and Online VS.
- Updates arrive by themselves: whenever the app opens online it loads the newest version. If a change does not show, close the app fully and open it again.
- Note: on iPad the Home Screen app keeps its own save, separate from Safari. Heroes and progress saved in Safari do not move into the app, so play from the app from now on.
- How it works (for developers): `manifest.webmanifest` + `icons/` make it installable; `sw.js` is a service worker that caches the game (network first, cache when offline). Bump `VERSION` in `sw.js` only if you add new files to its `APP_FILES` list.

**Drawing and dressing up**

- Draw a stick figure with a round head, a body, two arms and two legs. A finger, Apple Pencil or mouse works. Leave a little space between the figure and any scenery so the game can tell them apart.
- Tap **Walk**, **Dance**, **Fly** or another movement. Tap it again, or tap the picture, to go back to drawing.
- **Outfit and Morph**: pick a hat, cape, top and weapon. They attach to the figure's head, shoulders, body and hand and move with every animation and in every game. **Morph into character** turns the drawing into a filled-in cartoon hero (it keeps the drawing's colours; tap again to go back to plain lines).
- **Scene** opens a picker with 18 backgrounds, including House, Castle, Jungle, Volcano, Desert, Candy Land, Spooky Forest, Moon, Mars, Beach, Stadium and Rainbow Sky.
- **My heroes** saves the current drawing (with its outfit and morph) under a name. Saved heroes can be loaded again later and can fight each other in VS Fight.

**Music**

- Tap the **🎵** button (top right, also in games) to open Music. The built-in **Elevator Groove** plays by default from the first tap: an original, jazzy elevator jam written for the game so it stays free to share.
- **My song** plays any audio file from this device. Tap "Pick a song file" and choose a song from the Files app (or iCloud Drive). The song is kept on the device only and comes back next time. Use it for a real track you own, for example a bought copy of the DOORS Elevator Jam: the actual recording cannot be built into the game because it is copyrighted.
- **Music off**, and a Soft / Normal / Loud volume. The Sound button still controls the sound effects separately.

**Games**

- Mini games (green buttons): Jump & Run, Endless Dash, Star Catch, Sky Flap, Bubble Pop, Meteor Dodge, Cloud Bounce, Goal Kick. Outfits and morph show in all of them.
- **VS Fight (2 players)**: both players on one iPad or one keyboard. Pick a hero for each side (your drawing, a saved hero, or one of four robot fighters). Player 1 uses the left buttons, Player 2 the right buttons. Best of three rounds, 60 seconds each. Move, jump, punch, kick, block.
- **VS Computer**: same fight against a robot at Easy, Normal or Hard.
- Outfits change the fight: sword, axe and hammer reach further and hit harder (hammer is slow), wand, blaster and bow shoot instead of punching, a shield blocks everything, armour or a helmet takes less damage, a cape gives a double jump and a glide, the ninja top is faster.
- **Monster Brawl**: four waves of monsters and a boss. Punch, kick, jump over the big ones.
- **Space Quest**: ten worlds, Earth, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and the Sun. Each world has its own gravity and hazard (low gravity on the Moon, heat geysers on Mercury, acid rain on Venus, dust devils on Mars, lightning and no ground on Jupiter, falling ice on Saturn, slippery ice on Uranus, wind on Neptune, solar flares on the Sun). Collect five fuel cells, hop on the monsters, and reach the rocket to blast off to the next world. Reaching the rocket unlocks the next world; progress is saved.
- **House Hunt**: walk through eight rooms (garage, living room, kitchen, backyard, bedroom, bathroom, playroom, basement) and find eight hidden things. Doors are at the edges of a room; use the Up and Down buttons at the stairs. Best time is saved.
- **Online VS (beta)**: play a friend on another iPad or computer. One player taps Host and gets a four-letter code, the other taps Join and types it. It uses a free public matchmaking helper, so it can sometimes fail to connect; if it does, try again or play on one screen. Your drawing is sent only to the friend you play with.

**Slingshot Siege (new, 60 levels)**

- The big orange button in Games. Fling your own drawn hero from a slingshot at wobbly towers and knock out every monster. Drag back anywhere on the left half of the picture, aim with the dotted line, and let go.
- 5 worlds with 12 levels each: Backyard (wood and glass), Castle (tough stone), Jungle (towers up on stumps), Moon (low gravity, heroes fly far) and Volcano (TNT crates explode). Level 12 of every world is a 👑 boss fort. Beating a boss opens the next world.
- Stars: 3 stars for using 2 or fewer heroes than you were given (or clearing it with one hero), 2 stars with one hero to spare, 1 star otherwise. Replay levels any time to improve.
- Stars unlock powers: 💣 Boom at 5 stars, ⚡ Dash at 14, 🦘 Hop at 26, 🪨 Heavy at 40. Pick a power with the buttons at the top left, fling, then tap the screen in the air to use it. Each power works once per level.
- Total stars go on the Top 10 leaderboard (hold the button for a second to see it). Progress saves on the device.
- Keyboard: arrow keys aim (up and down change the angle, left and right the strength), F fires or uses the power, G picks a power.
- For developers: physics is Matter.js 0.20.0 (MIT) in `vendor/matter.min.js`. Levels come from a fixed recipe and seed, so level 7 is always the same. `node tools/sling-probe.js` checks that every level stands still before the first shot; `node tools/sling-solve.js <world 0-4>` plays every level by trying shots and proves each is beatable with plain heroes (all 60 were, most with heroes to spare).

**Backyard Defense (new, 30 levels)**

- The green button in Games. Slimes march across 5 lanes toward the clubhouse (HQ). Tap a guard card at the top, then tap a square (or drag the card onto a square). Every guard is your own hero wearing different gear.
- Guards: ⚡ Power Pal (makes extra energy), 🏹 Archer, 🛡️ Shield Guard (very tough, slimes get stuck on it), ⚔️ Knight (hits up close), ❄️ Frost Wizard (slows slimes), 🔨 Hammer Hero (hits every slime nearby), 🔫 Blaster Ace (fast shots). New guards unlock as you clear levels. ↩️ takes a guard back for a little energy.
- Energy builds up by itself; Power Pals add more. Popping slimes gives a little too.
- A slime that reaches the clubhouse costs a heart. Lose all 3 and the level is lost. Finish with 3 hearts for 3 stars.
- 5 places with 6 levels each: Backyard, Park, Beach (faster slimes), Snow Fort (slower but tougher), Night Camp (toughest). Level 6 of each place ends with a 👑 King Slime, and beating it opens the next place.
- For developers: `node tools/defense-bot.js` has a robot play all 30 levels. It must win them all, and doing nothing must lose them all. A robot that never uses Power Pals wins only about a third, so strategy matters.

**Hero Kart (new, 5 roads)**

- Drive your hero over endless hills. Hold ⚡ Go (or the right side of the picture, or the right arrow key) and 🛑 Brake (left). In the air, Go leans back and Brake leans forward. Landing on your head ends the drive.
- Battery drains while you drive; grab 🔋 battery cells to refill it. They get further apart the further you go. Coins on the road go straight into your wallet.
- Garage (in the Hero Kart menu): spend coins on ⚙️ Engine, 🛞 Tires (grip on sand and snow), 🔋 Battery and 🌀 Springs, 5 levels each.
- Stars at 300 m, 1000 m and 2500 m. Reaching 600 m opens the next road: Green Hills, Desert Dunes, Snowy Peaks, Moon Base (low gravity), Volcano Road.
- For developers: `node tools/kart-bot.js` drives every road with no upgrades, level 3 and maxed. A plain kart reaches about 300 m (one star, not enough to open the next road), level 3 about 2,300 to 3,400 m, and maxed about 5,700 m. A test checks no road ever gets steeper than 36 degrees.

**Coins and the Gear Shop**

- Every game pays coins when it ends: about 4 to 12 for most games, more for winning, and the most for stars in Slingshot Siege and Backyard Defense (plus a bonus the first time a level is cleared).
- 🛒 Gear Shop (in Games and in Gear Up) sells 17 new items: skins (Candy, Shadow, Diamond, Neon, Dragon), capes (Lightning, Royal, Candy, Diamond), weapons (Fire sword, Ice sword, Star staff), hats (Unicorn horn, Headphones, Flame hair) and tops (Jersey, Knight armor). Each card shows your own hero wearing it. Prices run 60 to 300 coins.
- Bought items appear in the Gear Up rows and work in every game. All the original gear stays free.
- Coins and bought items save on the device (in the same save as game progress).

**Keeping it original (important before selling it)**

- Game rules and genres cannot be copyrighted, but characters, art, names, sounds and signature details can. Never copy names, characters, art or music from famous games, and never use their names in the game, the store listing or ads.
- Slingshot Siege and Backyard Defense use your own hero, original slime monsters, original names and our own art. Backyard Defense deliberately has no plants, zombies, collectable sun, lawn mowers, seed packets or gravestones; Slingshot Siege has no birds or pigs. Keep it that way, and get a quick check from an intellectual-property lawyer before listing it for sale.

**Controls**

- On screen: the big buttons under the picture. Tapping the picture jumps in the running games and in Space Quest.
- Keyboard, single player: arrows or W A S D to move, Space or Up to jump, F or J punch, G or K kick, H or L block. Escape goes back to drawing.
- Keyboard, two players: Player 1 is W A S D with F G H; Player 2 is the arrow keys with J K L.

**Saving**

Drawing, outfit, morph, saved heroes, best scores and Space Quest progress save automatically in the same browser on the same device. Clearing browser website data removes them. A drawing made on a Mac does not automatically appear on the iPad, and the Home Screen app has its own save, separate from Safari.

**Updating the hosted game**

Replace `index.html` in the GitHub repository (or push from the local clone) and keep the filename and web address the same. GitHub Pages republishes within a few minutes. Before publishing, run `node test/run.js` (24 headless logic checks; needs Node 18 or newer, no packages).

**What was checked**

The headless checks cover rig detection on a stick figure, all ten movements, the fight poses, outfits and morph on every hat and weapon, all 18 scenes and their thumbnails, all eight mini games with outfits on, the hero library (save, build, thumbnail, load), the four robot fighters, VS Computer and two-player fights to a result, the round timer, Monster Brawl (a scripted player wins wave 1 by punching; all waves and the boss; the loss path), all ten Space Quest worlds (generation, play, the full Earth-to-Sun chain, losing all hearts), House Hunt (every room, doors, stairs, all eight items), save and reload, the setup dialogs, and applying an online snapshot as the guest. Real iPad and Safari were also used for manual play-testing of the visuals.
