**Gabriel's Animation Studio**

The entire game is in `index.html`. There is nothing to install or build. For the iPad, use the hosted address:
https://gberry747-lab.github.io/gabriels-animation-studio/

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

**Controls**

- On screen: the big buttons under the picture. Tapping the picture jumps in the running games and in Space Quest.
- Keyboard, single player: arrows or W A S D to move, Space or Up to jump, F or J punch, G or K kick, H or L block. Escape goes back to drawing.
- Keyboard, two players: Player 1 is W A S D with F G H; Player 2 is the arrow keys with J K L.

**Saving**

Drawing, outfit, morph, saved heroes, best scores and Space Quest progress save automatically in the same browser on the same device. Clearing browser website data removes them. A drawing made on a Mac does not automatically appear on the iPad.

**Updating the hosted game**

Replace `index.html` in the GitHub repository (or push from the local clone) and keep the filename and web address the same. GitHub Pages republishes within a few minutes. Before publishing, run `node test/run.js` (24 headless logic checks; needs Node 18 or newer, no packages).

**What was checked**

The headless checks cover rig detection on a stick figure, all ten movements, the fight poses, outfits and morph on every hat and weapon, all 18 scenes and their thumbnails, all eight mini games with outfits on, the hero library (save, build, thumbnail, load), the four robot fighters, VS Computer and two-player fights to a result, the round timer, Monster Brawl (a scripted player wins wave 1 by punching; all waves and the boss; the loss path), all ten Space Quest worlds (generation, play, the full Earth-to-Sun chain, losing all hearts), House Hunt (every room, doors, stairs, all eight items), save and reload, the setup dialogs, and applying an online snapshot as the guest. Real iPad and Safari were also used for manual play-testing of the visuals.
