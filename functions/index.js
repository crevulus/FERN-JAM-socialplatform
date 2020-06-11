const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const serviceAccount = require('./serviceAccountKey.json');

// needed to generate new private key from settings -> service accounts
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialplatform-e0690.firebaseio.com"
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getMentions = functions.https.onRequest((req, res) => {
  admin.firestore().collection('mentions').get()
    .then(data => {
      let mentions = [];
      // data = document reference, not data itself
      data.forEach((doc) => {
        mentions.push(doc.data());
      });
      return res.json(mentions);
    })
    .catch(err => console.error(err));
});

exports.postMentions = functions.https.onRequest((req, res) => {
  //create req obj
  const newMention = {
    // body is a porperty in the req body
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };
  // persist in db
  admin.firestore().collection('mentions').add(newMention)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch(err => {
      res.status(500).json({ error: 'You done goofed' });
      console.error(err);
    });
});