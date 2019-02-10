An example project for the [react-admin-firebase](https://github.com/benwinding/react-admin-firebase) package.

# Get started

You need to add the private Firebase connection file: `src/FIREBASE_CONFIG.js` with the following format from firebase:

``` js
export const config = {
  apiKey: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  authDomain: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  databaseURL: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  projectId: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  storageBucket: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
  messagingSenderId: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
};
```

Don't forget to add the `export` infront of the configuration that Firebase gives you!

Then just run `npm run start`