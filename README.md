# ghostspeak-editor

The Urban Baker街區編輯器: a web editor for Ghostspeak walking-tour scenarios
(actions, locations, sounds, images, beacons and broadcasts), which publishes
them to the Ghostspeak server for the Urban Baker app.

Built with react-admin 5, React 18 and Vite, storing data in Firebase through
[react-admin-firebase](https://github.com/benwinding/react-admin-firebase).

# Get started

You need to add the private Firebase connection file: `src/FIREBASE_CONFIG.js` with the following format from firebase:

```js
export const firebaseConfig = {
  apiKey: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  authDomain: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  databaseURL: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  projectId: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  storageBucket: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  messagingSenderId: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
};
```

Don't forget to add the `export` infront of the configuration that Firebase gives you!

The Ghostspeak server address defaults to `https://ghostspeak.floraland.tw`. To
use another one, serve an `appConfigs.js` next to `index.html` that sets
`window.appConfigs = { api_url: "https://..." };`.

Then just run `npm install` and `npm start` (Node 20.19+ or 22.12+ is required; the dev server listens on port 4444).

`npm run build` writes the production bundle to `build/`.
