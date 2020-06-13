const functions = require("firebase-functions");
const express = require("express");
const firebase = require("firebase");
const { db } = require("./util/admin");

const {
  getAllMentions,
  postMention,
  getMention,
  commentOnMention,
  likeMention,
  deleteMention,
} = require("./routes/mentions");
const {
  signup,
  login,
  uploadProfilePhoto,
  addUserDetails,
  getAuthUser,
} = require("./routes/users");
const firebaseAuth = require("./util/auth");

const app = express();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// mention routes
app.get("/mentions", getAllMentions);
app.post("/mentions", firebaseAuth, postMention);
app.get("/mentions/:mentionId", getMention);
app.post("/mentions/:mentionId/comment", firebaseAuth, commentOnMention);
app.get("/mentions/:mentionId/like", firebaseAuth, likeMention);
app.delete("/mentions/:mentionId", firebaseAuth, deleteMention);

// User routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", firebaseAuth, uploadProfilePhoto);
app.post("/user", firebaseAuth, addUserDetails);
app.get("/user", firebaseAuth, getAuthUser);

// exports function that handles HTTP events
// specifies zone and saves few hundred ms of latency
exports.api = functions.region("europe-west3").https.onRequest(app);

exports.onUserImageChange = functions
  .region("europe-west3")
  .firestore.document(`/users/{userId}`)
  // snapshot has two values: before and after.
  .onUpdate((change) => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      // writes batches; commited with .commit()
      const batch = db.batch();
      return db
        .collection("mentions")
        .where("userHandle", "==", change.before.data().userHandle)
        .get()
        .then((data) => {
          // forEach document this user has created
          data.forEach((doc) => {
            const mention = db.doc(`/mentions/${doc.id}`);
            batch.update(mention, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onMentionDeleted = functions
  .region("europe-west3")
  .firestore.document(`/users/{mentionId}`)
  .onDelete((snapshot, context) => {
    const mentionId = context.params.mentionId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("mentionId", "==", mentionId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("mentionId", "==", mentionId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
