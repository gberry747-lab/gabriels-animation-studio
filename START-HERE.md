**Gabriel's Animation Studio**

The entire game is in `index.html`. There is nothing to install or build. For the iPad, use the hosted address:
https://gberry747-lab.github.io/gabriels-animation-studio/

**Install it as an app (works with no internet)**

- On the iPad: open the address above in **Safari**, tap **Share**, then **Add to Home Screen**, then **Add**. A "Gabriel's Animation Studio" icon (a red stick figure) appears on the Home Screen and opens full-screen like a real app.
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

- Tap the **🎵** button (top right, also in games) to open the Music picker. Tap a song to hear it straight away; the button shows which one is playing, and your choice is remembered.
- 7 built-in songs, all original and made by the game's own synth (nothing to license): 🎹 Elevator Groove, 🦸 Hero March, 🚀 Space Bleeps, 🏖️ Beach Bounce, 🎃 Spooky Hop, 🌙 Chill Clouds, ⚡ Turbo Chase.
- **My song** plays any audio file from this device (pick it from the Files app or iCloud Drive). It stays on the device only. Use it for a real song you own; real songs cannot be built into the game because they are copyrighted.
- **Music off**, and a Soft / Normal / Loud volume. The Sound button still controls the sound effects separately. Beat Run pauses the music while its own beat plays.

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
- Towers are built from real physics blocks: a hit shoves and topples them, glass shatters, wood breaks on big crashes, stone mostly falls over, and broken blocks split into tumbling pieces.
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
- Battery drains while you drive; grab 🔋 battery cells to refill it. They get a little further apart the further you go. Coins on the road go straight into your wallet.
- Every road ends at a 🏁 finish line at 2500 m ("Road complete!").
- Garage (in the Hero Kart menu): spend coins on ⚙️ Engine, 🛞 Tires (grip on sand and snow), 🔋 Battery and 🌀 Springs, 5 levels each.
- Stars at 300 m and 1000 m, and the third star for reaching the finish. Reaching 600 m opens the next road: Green Hills, Desert Dunes, Snowy Peaks, Moon Base (low gravity), Volcano Road.
- For developers: `node tools/kart-bot.js` drives every road with no upgrades, level 3 and maxed. A plain kart reaches about 2,250 m (two stars), and one upgrade level is enough to reach the finish on every road (about 60 to 90 seconds a run). A test checks no road ever gets steeper than 36 degrees.

**Gem Quest (new, 30 levels)**

- Match-3 puzzle. Swap two neighbouring power stones (drag one, or tap two) to line up 3 or more of a kind. 4 in a row makes a Line Stone (clears a row or column), an L or T makes a Bomb Stone (clears around it), 5 in a row makes a Star Stone (swap it with any stone to clear every stone of that colour). Swapping two special stones together sets off a big combo.
- Each level has a goal: reach a score, crack all the ❄️ ice, or collect a number of one colour, before the moves run out. Moves left at the end give more stars.
- Your hero stands next to the board and charges up as you match. When the meter is full, tap the hero for a free Hero Blast that clears the best 3 by 3 spot.
- If nothing moves for a few seconds, a possible swap glows as a hint. If no swaps are possible, the board shuffles itself.
- 3 worlds of 10 levels: Crystal Cave, Coral Reef, Sky Castle (later boards have holes).
- For developers: `node tools/gems-bot.js [games per level]` has a greedy robot play every level on different random boards. It wins about 94% overall, every level at least 8 out of 12.

**Beat Run (new, 18 songs)**

- Your hero runs by themselves while the game plays a beat. Jump ON the beat when the glowing ▲ on the ground reaches your hero: a quick tap jumps over slimes, holding makes a big jump over tall boxes and gaps (those markers say HOLD). Tap the picture, the Jump button, Space or the up arrow.
- 3 hearts per song; finishing with all 3 gives 3 stars. Jumping exactly on the beat scores PERFECT. Collect ♪ notes for points.
- 3 places of 6 songs that get faster: Sunny Park (92 bpm), Ocean Pier, Space Station (up to 136 bpm). The beat and tune are made by the game's own synth, so there is no music to license. The Groove background music pauses while a song plays.
- For developers: `node tools/beat-bot.js` checks a robot jumping exactly on the beat keeps all 3 hearts on every song, and that not jumping always loses. Jumping up to about 0.2 of a beat early or 0.15 late still clears everything.

**Draw Path (new, 24 puzzles)**

- A pet is lost. Draw ramps and bridges with your finger (ink is limited, shown top left), press ▶ GO, and your hero rolls to the rescue in a bubble. Reach the basket to rescue the pet; grab the 💎 gems on the way (all 3 = 3 stars).
- Spikes pop the bubble and you cannot draw inside the red striped no-ink zones. ↶ Undo removes the last line, ✖ Clear removes them all. If the hero falls or gets stuck, your lines stay so you can fix them. After 3 tries a dotted hint appears.
- Lines are smoothed when you lift your finger, so a wobbly hand still makes a good ramp.
- 3 worlds of 8: Meadow (puppy), Rocky Canyon (kitten, spiky pillars), Cloud Kingdom (bunny, no-ink zones).
- For developers: `node tools/path-gen.js` makes the levels and writes them into index.html. It keeps a layout only if doing nothing loses, a straight line loses (after level 2), and a wobbly, smoothed hand-drawn line wins at least 4 times out of 5 with all 3 gems reachable. Tests replay every saved solution.

**Monster Pals (new, 25 pals)**

- Visit a place (Garden, Beach, Snowy Hill, Volcano, Starry Sky) to meet a slime pal, then win its friendship in one of three mini-games: Snack Toss (tap where the pal will be to throw its favourite snack; feed it 3 times), Copy Dance (repeat its moves with the arrow buttons; 3 rounds) or Peekaboo (tap it when it peeks out of a bush; 5 tickles, 3 misses and it gets shy).
- Every friend goes in the 📖 Pal Book. Meeting a friend again raises its friendship up to 3 hearts. New places open at 3, 7, 12 and 17 pals. ⭐⭐⭐ pals are rare and a bit harder.
- Make any friend your Buddy: your Buddy adds 10% bonus coins (at least 1) to every game.
- Pals do not need a drawing, so this game works even before you draw a hero.
- For developers: `node tools/pals-bot.js` plays every pal in every mini-game. A careful player always wins, a kid aiming at where the pal is now wins about 80% of Snack Tosses, and random tapping almost never works.

**Endless Dash upgrades (new)**

- Bought with coins in the 🛒 Gear Shop (bottom section) and always on once owned: 🚀 Rocket Start (zoom ahead safely for the first 3 seconds), 🫧 Bubble Shield (blocks one bump each run), 🧲 Star Magnet (pulls nearby stars to you), 🎒 Jetpack (two extra boosts in the air, so up to 4 jumps).
- Endless Dash now pays coins by how far you get (4 coins plus 1 for every 25 points of score).

**🎬 How to play (guided demos)**

- Every big adventure (Slingshot Siege, Backyard Defense, Hero Kart, Gem Quest, Beat Run, Draw Path, Monster Pals) has a 🎬 How to play button at the top of its menu. It plays a real level by itself with big captions and a pointing finger showing each step, then offers "Let's play".
- Taps are ignored during a demo except ✖ Skip (bottom right). Nothing a demo does is kept: stars, coins, pals and the leaderboard are exactly as they were.
- For developers: the demos are scripts in `TUTORIALS` (index.html). Tests run every demo and check it really plays (the slingshot shot clears the level, the path rescues the puppy, and so on) and leaves progress untouched.

**Fits every iPad**

- During a game the picture shrinks automatically so the title bar, picture, message and buttons always fit on screen, in portrait or landscape, with or without Safari's toolbars.

**Seasonal events (switch on by the iPad's date)**

| Season | Dates | Game |
|---|---|---|
| 🎆 New Year's | Dec 31 to Jan 10 | Countdown Party (rhythm run with fireworks and a countdown) |
| 💘 Valentine's Day | Feb 1 to 15 | Heart Match (match-3 with heart stones) |
| ☘️ St. Patrick's Day | Mar 1 to 18 | Catch the Leprechaun (tap him when he peeks out) |
| 🐣 Spring | Mar 19 to Apr 30 | Egg Guard (guard the spring eggs from slimes) |
| 🎇 4th of July | Jun 20 to Jul 10 | Firework Fling (slingshot at firework crates) |
| 🏖️ Summer | Jul 11 to Sep 5 | Beach Buggy (drive along the shore) |
| 🎃 Halloween | Oct 1 to Nov 2 | Pumpkin Smash (slingshot at pumpkin towers) |
| 🦃 Thanksgiving | Nov 3 to 30 | Turkey Trail (draw a path to a lost turkey) |
| 🎄 Christmas | Dec 1 to 30 | Sleigh Ride (deliver presents by sleigh) |

- During a season the app takes on the season's colours, the drawing page has falling decorations (leaves, snow, hearts, clovers...), and a banner in Games opens the seasonal game. 📅 Seasons shows every event and when it comes back.
- Each seasonal game has 3 to 8 levels. Finishing half of them earns the first seasonal gear item, finishing them all earns the second (18 items in all, such as the 🎃 Pumpkin head, 🎅 Santa hat and ✨ Sparkler). Seasonal gear is free, never sold, and kept forever.
- To preview a season outside its dates, add `?season=christmas` (or any season id) to the address.
- For developers: `node tools/season-check.js` plays every level of every seasonal game with a robot suited to it (all can be won). Thanksgiving's puzzles come from `tools/path-gen.js`.

**Coins and the Gear Shop**

- Every game pays coins when it ends (plus 10% with a Monster Pals Buddy): about 4 to 12 for most games, more for winning, and the most for stars in Slingshot Siege and Backyard Defense (plus a bonus the first time a level is cleared).
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
