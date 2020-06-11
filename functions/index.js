const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const firebase = require('firebase');

const serviceAccount = require('./serviceAccountKey.json');

// needed to generate new private key from settings -> service accounts
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialplatform-e0690.firebaseio.com"
});

// extra fields from auth -> add a web app
firebase.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyBziX82UX7YauDGPkY-xKI7ApJG8wv0IWw",
  authDomain: "socialplatform-e0690.firebaseapp.com",
  databaseURL: "https://socialplatform-e0690.firebaseio.com",
  projectId: "socialplatform-e0690",
  storageBucket: "socialplatform-e0690.appspot.com",
  messagingSenderId: "425080293451",
  appId: "1:425080293451:web:5120a1ab9245233684a5ce",
  measurementId: "G-TJTVK7512W"
});

const app = express();
const db = admin.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

app.get('/mentions', (req, res) => {
  db
    .collection('mentions')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let mentions = [];
      // data = document reference, not data itself
      data.forEach((doc) => {
        mentions.push({
          screamId: doc.id,
          // could use spread operator with newer node versions
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(mentions);
    })
    .catch(err => console.error(err));
});

app.post('/mentions', (req, res) => {
  //create req obj
  const newMention = {
    // body is a porperty in the req body
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };
  // persist in db
  db
    .collection('mentions')
    .add(newMention)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch(err => {
      res.status(500).json({ error: 'You done goofed' });
      console.error(err);
    });
});

//Signup route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle
  };

  let userToken, userId;

  db.doc(`/users/${newUser.userHandle}`).get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: 'This handle is already taken' })
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      // firebase method
      return data.user.getIdToken();
    })
    .then(token => {
      userToken = token;
      const userCred = {
        userHandle: newUser.userHandle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      // creates document in db
      return db.doc(`/users/${newUser.userHandle}`).set(userCred);
    })
    .then(() => {
      return res.status(201).json({ userToken });
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email already in use' });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

// exports function that handles HTTP events
// specifies zone and saves few hundred ms of latency
exports.api = functions.region('europe-west3').https.onRequest(app);