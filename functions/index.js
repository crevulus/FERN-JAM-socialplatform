const functions = require('firebase-functions');
const express = require('express');
const firebase = require('firebase');

const { getAllMentions, postMention } = require('./routes/mentions');
const { signup, login } = require('./routes/users');
const firebaseAuth = require('./util/auth');

const app = express();


exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// mention routes
app.get('/mentions', getAllMentions);
app.post('/mentions', firebaseAuth, postMention);

// User routes
app.post('/signup', signup);
app.post('/login', login);

// exports function that handles HTTP events
// specifies zone and saves few hundred ms of latency
exports.api = functions.region('europe-west3').https.onRequest(app);