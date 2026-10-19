// LoginPage.js
import React from "react";
import { Login, LoginForm } from "react-admin";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { firebaseConfig } from "./FIREBASE_CONFIG";

// firebaseui needs the compat API; this wraps the app react-admin-firebase created
firebase.initializeApp(firebaseConfig);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "#/",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  // Optional callbacks in order to get Access Token from Google,Facebook,... etc
  callbacks: {
    signInSuccessWithAuthResult: (result) => {
      const credential = result.credential;
      // The signed-in user info.
      const user = result.user;
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const accessToken = credential.accessToken;
      console.log("login data", { result, user, accessToken });
      localStorage.setItem("uid", user.uid);
      return true;
    },
  },
};

const SignInScreen = () => (
  <StyledFirebaseAuth firebaseAuth={firebase.auth()} uiConfig={uiConfig} />
);

const CustomLoginForm = () => {
  return (
    <div>
      <LoginForm />
      <SignInScreen />
    </div>
  );
};

const CustomLoginPage = () => {
  React.useEffect(() => {
    localStorage.removeItem("uid");
    localStorage.removeItem("scenario");
    localStorage.removeItem("scenarioName");
    console.log("effect happened");
  });
  return (
    <Login>
      <CustomLoginForm />
    </Login>
  );
};

export default CustomLoginPage;
