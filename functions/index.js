const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const firebase = require('firebase');

const serviceAccount = require('./serviceAccountKey.json');

// needed to generate new private key from settings -> service accounts
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

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

app.get('/mentions', (req, res) => {
  admin
    .firestore()
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
  admin
    .firestore()
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
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      res.status(201).json({ message: `user ${data.user.uid} signed up!` })
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code })
    });
});

// exports function that handles HTTP events
// specifies zone and saves few hundred ms of latency
exports.api = functions.region('europe-west3').https.onRequest(app);