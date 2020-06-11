const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getMentions = functions.https.onRequest((req, res) => {
  admin.firestore().collection('mentions').get()
    .then(data => {
      let mentions = [];
      // data = reference to data docs, not data itself
      data.forEach((doc) => {
        mentions.push(doc.data());
      });
      return res.json(mentions);
    })
    .catch(err => new Error(err));
});