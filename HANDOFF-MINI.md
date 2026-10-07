# Hand-off: make the Mac Mini the home of Gabriel's games (started 2026-10-07 on the laptop)

Gregory wants all the games to live on the Mini. The laptop session got as far as pushing everything to GitHub; the Mini could not be reached reliably over Tailscale from the laptop (heavy packet loss on the Mini's wifi), so the Mini-side steps are still open.

## State of the game right now
- Repo: https://github.com/gberry747-lab/gabriels-animation-studio - latest commit 501b57b, all pushed. Live at https://gberry747-lab.github.io/gabriels-animation-studio/
- Online leaderboard LIVE on Firebase project `gabriels-animation-studio` (mindtheshop247@gmail.com). Config already in `index.html`. Details in `LEADERBOARD-SETUP.md`.
- 50 headless checks: `node test/run.js`.
- iCloud copy: `Claude Code/Game Designs/Gabriel's Games/` (index.html, zip, what's-new, setup guides).

## To do ON THE MINI (Claude session there, or by hand)
1. `zsh ~/gabriels-animation-studio/tools/setup-mini.sh` after a first clone:
   `git clone https://github.com/gberry747-lab/gabriels-animation-studio.git ~/gabriels-animation-studio`
   (if GitHub resets the download, try again; it is a 400 KB repo). The script switches the remote to SSH, makes a key `~/.ssh/mini_to_github`, installs Node via Homebrew if Homebrew exists, runs the tests.
2. Give the Mini push access: add the printed public key as a **deploy key with write access** at
   https://github.com/gberry747-lab/gabriels-animation-studio/settings/keys (title `mac-mini`). From a machine with `gh`: `gh repo deploy-key add ~/.ssh/mini_to_github.pub -R gberry747-lab/gabriels-animation-studio --allow-write -t mac-mini`.
3. If there is no Homebrew on the Mini, install Node LTS from https://nodejs.org (the .pkg) so `node test/run.js` works before every push.
4. Optional: a `.claude/launch.json` on the Mini with a "game" server (`python3 -m http.server 8766 --directory ~/gabriels-animation-studio`) for browser checks.
5. Update the memory note `personal/project_gabriel_animation_studio_game.md`: the Mini is the home clone; laptop clone `~/gabriels-animation-studio` becomes secondary (always `git fetch` first, see macs/feedback_git_fetch_before_work).

## Known traps
- The Mini's user is `gregoryeberry` (Tailscale 100.100.208.87); the Studio's is `GregoryBerry` (100.85.18.68).
- The Mini has git and python3 but, as of 10/7, no node, no gh, no GitHub SSH key.
- Firebase console for the game = Chrome on the Mini (signed in as mindtheshop247). The laptop's Chrome is gberry747 and cannot see the project.

## Done on the Mini - 7 October 2026 (Claude session on the Mini)

1. Cloned to `~/gabriels-animation-studio`; `tools/setup-mini.sh` ran clean. Node v24.21.0 was already on the Mini (Homebrew). 50 tests pass.
2. Deploy key `mac-mini` (read-write) added to the repo with `gh` (the Mini DOES have `gh`, logged in as gberry747-lab; the trap list above was wrong on that).
3. The key is wired through a dedicated SSH alias `github.com-gabriel` and the remote is `git@github.com-gabriel:gberry747-lab/gabriels-animation-studio.git`. The script's original `grep -q "Host github.com"` matched the Mini's existing `github.com-shc` style aliases and skipped the config, so push failed on the first run; the script now checks for its own alias. Push from the Mini verified.
4. `.claude/launch.json` on the Mini: server "game" on http://localhost:8766.
5. Memory note `personal/project_gabriel_animation_studio_game.md` written: the Mini is the home clone, the laptop clone is secondary (fetch first).

The laptop clone must `git fetch` before any further work.
