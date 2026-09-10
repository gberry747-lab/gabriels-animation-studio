**Gabriel's Animation Studio**

The entire game is in `index.html`. There is nothing to install or build. Upload this file to your website, or open it in Safari on a Mac to try it first. For the iPad, use a hosted web address.

**Put it on your GitHub account**

1. Sign in to GitHub and create a new public repository named `gabriels-animation-studio`. Turn on **Add README** when creating it.
2. In that repository, choose **Add file > Upload files**. Upload the included `index.html` directly into the repository, then click **Commit changes**. Upload the HTML file itself, not the ZIP or an enclosing folder.
3. Open the repository's **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**. Select **main** and **/ (root)**, then click **Save**.
5. When GitHub finishes publishing, click **Visit site** on that page. Publishing can take up to 10 minutes.
6. Open that address in Safari on Gabriel's iPad. His address will follow the pattern `https://YOUR-USERNAME.github.io/gabriels-animation-studio/`, with YOUR-USERNAME replaced by your GitHub username.

GitHub Pages supports this kind of static HTML game and is available for public repositories on GitHub Free. The game code is public; the game keeps drawings in the player's browser and does not upload them.

Sources: [GitHub Pages setup](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) and [publishing from a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

**Playing**

- Draw a stick figure with a round head, a body, two arms, and two legs. A finger, Apple Pencil, or mouse works. Any size is fine. Leave a little space between the figure and separate scenery so the game can tell them apart.
- Tap **Walk**, **Dance**, **Fly**, or another movement. Tap it again, or tap the picture, to return to drawing.
- Add a hat, cape, or sword after the first animation. The existing figure keeps its shape.
- Tap one of the eight green game buttons. The drawing becomes the player. **Jump & Run** collects 12 stars; **Star Catch** collects 15. **Endless Dash** and **Sky Flap** keep going while hearts remain. **Bubble Pop** uses left/right and Pop to burst 15 bubbles. **Meteor Dodge** is a 30-second dodging challenge. **Cloud Bounce** jumps automatically while he steers onto clouds to reach 10 stars. **Goal Kick** uses one Kick button to score 8 goals when the ball reaches the green patch.
- Use the big arrow and Jump buttons. Running games have a double jump. On a computer, arrow keys move and Space jumps, flaps, pops, or kicks, depending on the game. Escape returns to drawing.
- **Clear** starts fresh; **Undo** can bring the drawing back. The eraser removes a whole drawn line.
- After detecting an Apple Pencil, the paper ignores fingers to prevent palm marks. Reload the page to switch back to finger drawing.

There are six backgrounds, eight pen colors, three pen sizes, ten movements, eight games, sound effects with a mute button, three hearts, and saved best scores for the endless games. Drawing and scores save automatically in the same browser on the same device. Clearing browser website data removes that saved drawing. A Mac drawing does not automatically appear on the iPad.

You can add a Home Screen shortcut from Safari's Share menu using **Add to Home Screen**. The precise Share menu appearance depends on the iPadOS version. [Apple's iPad Safari guide](https://support.apple.com/guide/ipad/bookmark-a-website-ipadc602b75b/ipados).

**What was checked**

The game passed 33 automated logic checks covering original-stroke reconstruction, character and scenery separation, added accessories, all ten animation poses, saving and restoring, all eight games, scoring and win conditions, a complete simulated climb through Cloud Bounce, Goal Kick timing, double jumps, damage protection, flying hitboxes, touch cancellation, and Pencil/palm handling. JavaScript syntax and the standalone HTML package were also checked. These checks use a simulated canvas and input environment. A physical iPad and Safari browser were not tested in this workspace.

The automatic character fitting works best with a clear stick figure. Unusual doodles or scenery touching the figure can move in unexpected ways.

To update the hosted game later, upload a replacement `index.html` into the same repository and commit it. Keep the filename and website address the same.
