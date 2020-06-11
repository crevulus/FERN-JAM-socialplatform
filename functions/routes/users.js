const { db, admin } = require('../util/admin');
const firebase = require('firebase');

// needed to generate new private key from settings -> service accounts
const serviceAccount = require('../serviceAccountKey.json');

const { validateSignupData, validateLoginData, } = require('../util/validators');

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

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

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
}

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token })
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/wrong-password' || 'auth/user-not-found') {
        return res.status(403).json({ general: 'Wrong credentials' })
      }
      return res.status(500).json({ error: err.code });
    })
};