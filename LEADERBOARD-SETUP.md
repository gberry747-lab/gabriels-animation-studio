# Switching on the online leaderboard (about 10 minutes, free)

The game already has everything it needs: players pick a name the first time they open it, every finished game sends its best score, and holding any game button for a second shows that game's Top 10. Right now the leaderboard runs in **local-only mode** (scores stay on the device) because it has nowhere to send them. It goes live the moment a database address is pasted into `index.html`.

The database is a **Firebase Realtime Database** on Google's free plan. It costs nothing at this size (the free plan allows 1 GB stored and 10 GB a month downloaded; a score row is about 60 bytes). Gregory's Google account owns it. No Firebase code is added to the game; it talks to the database with plain web requests, so no analytics or tracking library is loaded.

## 1. Create the project

1. Go to https://console.firebase.google.com and sign in with gberry747@gmail.com.
2. **Add project**, name it `gabriels-animation-studio`.
3. When asked about Google Analytics, turn it **off**. (This keeps the game free of tracking, which matters for a kids' game.)
4. Create the project.

## 2. Create the database

1. In the left menu open **Build > Realtime Database**, then **Create Database**.
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
          ".write": "newData.hasChildren(['name','score','at']) && newData.child('name').isString() && newData.child('name').val().length >= 3 && newData.child('name').val().length <= 12 && newData.child('score').isNumber() && newData.child('score').val() >= 0 && newData.child('score').val() <= 100000 && newData.child('at').isNumber()",
          ".validate": "newData.hasChildren(['name','score','at'])"
        }
      }
    }
  }
}
```

These rules mean: anyone can read the Top 10 lists, anyone can write a score row that has exactly a name, a number and a time, and nothing else can be stored. Rows that break the shape are rejected by Google before they land.

4. On the **Data** tab, copy the database address shown at the top. It looks like `https://gabriels-animation-studio-default-rtdb.firebaseio.com`.

## 3. Paste the address into the game

In `index.html`, find this line (search for `const LB=`):

```js
const LB={url:'',timeout:6000};
```

and put the address inside the quotes, with no slash at the end:

```js
const LB={url:'https://gabriels-animation-studio-default-rtdb.firebaseio.com',timeout:6000};
```

Then run `node test/run.js`, commit and push. GitHub Pages updates within a minute. Scores that players earned while offline, or before the switch-on, are queued on their devices and upload the next time they finish a game or open a leaderboard.

## How it behaves

- **Online**: hold a game button, the Top 10 loads from the database, your row is highlighted, and if you are not in the Top 10 it shows your best under the list.
- **Offline**: it shows the Top 10 from the last time it was online, with how long ago that was, plus your best on this device. New scores wait in a queue and upload when the connection comes back.
- **No name yet**: scores stay on the device. The 👤 button at the top opens the name picker any time; names are 3 to 12 letters or numbers, a small word filter blocks the obvious bad ones, and the picker suggests a made-up name so nobody uses a real one.
- **Ties and cheats**: each device holds one row per game (its best), so a player cannot fill the board. Because there is no login, a determined person could post a fake score with a web request; if that ever happens, delete the row in the Firebase Data tab. That is acceptable for a family-and-friends leaderboard. If the game is ever sold in a store, add Firebase Anonymous Auth and tighten the rules to `auth.uid == $player`.

## Privacy note for the store listing later

The leaderboard stores: a made-up player name, a score, a time stamp, and a random device id. No email, no real name, no location, no device details. This sentence can go straight into the privacy policy.
