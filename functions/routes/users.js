const { db, admin } = require("../util/admin");
const firebase = require("firebase");
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

// needed to generate new private key from settings -> service accounts
const serviceAccount = require("../serviceAccountKey.json");

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require("../util/validators");

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
  measurementId: "G-TJTVK7512W",
});

// had to extract to use later in URL
const storageBucket = "socialplatform-e0690.appspot.com";

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  const noImage = "blank-profile-picture.png";

  let userToken, userId;

  db.doc(`/users/${newUser.userHandle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ userHandle: "This handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      // firebase method
      return data.user.getIdToken();
    })
    .then((token) => {
      userToken = token;
      const userCred = {
        userHandle: newUser.userHandle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${noImage}?alt=media`,
        userId,
      };
      // creates document in db
      return db.doc(`/users/${newUser.userHandle}`).set(userCred);
    })
    .then(() => {
      return res.status(201).json({ userToken });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email already in use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong. Please try again." });
      }
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password" || "auth/user-not-found") {
        return res.status(403).json({ general: "Wrong credentials" });
      }
      return res.status(500).json({ error: err.code });
    });
};

let imageName;
let imageForUpload = {};

exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.userHandle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Deatils added to user" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getAuthUser = (req, res) => {
  let resData = {};
  db.doc(`/users/${req.user.userHandle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        resData.credentials = doc.data();
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.userHandle)
          .get();
      }
    })
    .then((data) => {
      resData.likes = [];
      data.forEach((doc) => {
        resData.likes.push(doc.data());
      });
      return res.json(resData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.uploadProfilePhoto = (req, res) => {
  const busboy = new BusBoy({ headers: req.headers });
  // busyboy takes 5 args
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "wrong file type" });
    }
    // get ext from any filename
    const imageExt = filename.split(".")[filename.split(".").length - 1];
    imageName = `${Math.round(Math.random() * 100000)}.${imageExt}`;
    const filepath = path.join(os.tmpdir(), imageName); // tmpdir b/c not an actual server but a cloud fn
    imageForUpload = {
      filepath,
      mimetype,
    };
    file.pipe(fs.createWriteStream(filepath)); // creates file
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket(storageBucket)
      .upload(imageForUpload.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageForUpload.mimetype,
          },
        },
      })
      .then(() => {
        // adding alt=media shows on browser rather than downloading
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${imageName}?alt=media`;
        // access to req obj because it's been through firebaseAuth process
        return db.doc(`/users/${req.user.userHandle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Image uploaded" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

// testing gitignore
