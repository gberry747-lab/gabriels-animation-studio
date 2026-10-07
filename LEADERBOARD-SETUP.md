# Online leaderboard - DONE 7 October 2026 (store-grade, free)

**Status: live.** Firebase project `gabriels-animation-studio` (project number 137118924480) is owned by mindtheshop247@gmail.com. Anonymous sign-in is on (auto clean-up off on purpose), the Realtime Database is in us-central1 with the rules below published, Analytics and Gemini are off, and a web app "Gabriels Animation Studio web" is registered. The address and Web API key are already in `index.html`. The steps below are kept for reference, or for rebuilding the project from scratch.

# How it was set up

The game already has everything it needs: players pick a name the first time they open it, every finished game sends its best score, and holding any game button for a second shows that game's Top 10. Right now the leaderboard runs in **local-only mode** (scores stay on the device) because it has nowhere to send them. It goes live the moment a database address is pasted into `index.html`.

Players are signed in **anonymously** through Firebase Authentication (no email, no password, a random user id per device) and the rules only let a player write their own score row. That is the setup an app store expects.

The database is a **Firebase Realtime Database** on Google's free plan. It costs nothing at this size (the free plan allows 1 GB stored and 10 GB a month downloaded; a score row is about 60 bytes). Gregory's Google account owns it. No Firebase code is added to the game; it talks to the database with plain web requests, so no analytics or tracking library is loaded.

## 1. Create the project

1. Go to https://console.firebase.google.com and sign in with gberry747@gmail.com.
2. **Add project**, name it `gabriels-animation-studio`.
3. When asked about Google Analytics, turn it **off**. (This keeps the game free of tracking, which matters for a kids' game.)
4. Create the project.

## 2. Turn on anonymous sign-in

1. In the left menu open **Build > Authentication**, then **Get started**.
2. On the **Sign-in method** tab choose **Anonymous**, switch it on, **Save**.

## 3. Create the database

1. Open **Build > Realtime Database**, then **Create Database**.
2. Location: United States. Start in **locked mode** (the rules below replace it).
3. Open the **Rules** tab, replace everything with this, and press **Publish**:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "scores": {
      "$game": {
        ".read": true,
        ".indexOn": ["score"],
        "$player": {
          ".write": "auth != null && auth.uid == $player",
          ".validate": "newData.hasChildren(['name','score','at']) && $game.matches(/^[a-zA-Z]{3,12}$/)",
          "name": {".validate": "newData.isString() && newData.val().length >= 3 && newData.val().length <= 12"},
          "score": {".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100000"},
          "at": {".validate": "newData.isNumber()"},
          "$other": {".validate": false}
        }
      }
    }
  }
}
```

These rules mean: anyone can read the Top 10 lists; a signed-in player can write only the row named after their own user id; a row must be exactly a name, a number and a time stamp; nothing else can be stored anywhere.

4. On the **Data** tab, copy the database address shown at the top. It looks like `https://gabriels-animation-studio-default-rtdb.firebaseio.com`.

## 4. Copy the Web API key

Click the gear next to **Project Overview** > **Project settings**. On the **General** tab copy the **Web API Key**. (It is safe to publish; it only identifies the project. The rules above are what protect the data.)

## 5. Paste the address and key into the game

In `index.html`, find this line (search for `const LB=`):

```js
const LB={url:'',apiKey:'',timeout:6000};
```

and put the address (no slash at the end) and the key inside the quotes:

```js
const LB={url:'https://gabriels-animation-studio-default-rtdb.firebaseio.com',apiKey:'AIza...',timeout:6000};
```

Then run `node test/run.js`, commit and push. GitHub Pages updates within a minute. Scores that players earned while offline, or before the switch-on, are queued on their devices and upload the next time they finish a game or open a leaderboard.

## How it behaves

- **Online**: hold a game button, the Top 10 loads from the database, your row is highlighted, and if you are not in the Top 10 it shows your best under the list.
- **Offline**: it shows the Top 10 from the last time it was online, with how long ago that was, plus your best on this device. New scores wait in a queue and upload when the connection comes back.
- **No name yet**: scores stay on the device. The 👤 button at the top opens the name picker any time; names are 3 to 12 letters or numbers, a small word filter blocks the obvious bad ones, and the picker suggests a made-up name so nobody uses a real one.
- **Sign-in**: the first time a score is sent, the game creates an anonymous Firebase user for that device and keeps the refresh token in the browser. Each player can write only their own row, one per game (their best), so nobody can fill a board or overwrite someone else. A bad row can still be deleted in the Firebase Data tab.
- **Clearing the browser** (or a new device) makes a new anonymous user, so the old row stays on the board under the old name until deleted. That is normal for anonymous leaderboards.

## Privacy note for the store listing later

The leaderboard stores: a made-up player name, a score, a time stamp, and an anonymous Firebase user id. No email, no real name, no location, no device details. Firebase Authentication records the anonymous user and its sign-in time; Google Analytics is off. This paragraph can go straight into the privacy policy.
