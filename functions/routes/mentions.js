const { db } = require("../util/admin");

exports.getAllMentions = (req, res) => {
  db.collection("mentions")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let mentions = [];
      // data = document reference, not data itself
      data.forEach((doc) => {
        mentions.push({
          screamId: doc.id,
          // could use spread operator with newer node versions
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(mentions);
    })
    .catch((err) => res.json(err));
};

exports.postMention = (req, res) => {
  //create req obj
  const newMention = {
    // body is a porperty in the req body
    body: req.body.body,
    userHandle: req.body.userHandle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };
  // persist in db
  db.collection("mentions")
    .add(newMention)
    .then((doc) => {
      const resMention = newMention;
      resMention.mentionId = doc.id;
      res.json(resMention);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "You done goofed" });
    });
};

exports.getMention = (req, res) => {
  let mentionData = {};
  db.doc(`/mentions/${req.params.mentionId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Mention not found" });
      }
      mentionData = doc.data();
      mentionData.mentionId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "asc")
        .where("mentionId", "==", req.params.mentionId)
        .get();
    })
    .then((data) => {
      mentionData.comments = [];
      data.forEach((doc) => {
        mentionData.comments.push(doc.data());
      });
      return res.json(mentionData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.commentOnMention = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ error: "Cannot post empty comments" });
  }
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    mentionId: req.params.mentionId,
    userHandle: req.user.userHandle,
    userImage: req.user.imageUrl,
  };
  db.doc(`/mentions/${req.params.mentionId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Mention not found" });
      }
      // adds new document. Takes JSON.
      return db.collection("comments").add(newComment);
    })
    // if reached here: doc created successfully
    .then(() => {
      return res.json(newComment);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.likeMention = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.userHandle)
    .where("mentionId", "==", req.params.mentionId)
    .limit(1);

  const mentionDocument = db.doc(`/mentions/${req.params.mentionId}`);

  let mentionData;

  mentionDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        mentionData = doc.data();
        mentionData.mentionId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Mention not found" });
      }
    })
    .then((data) => {
      // checks if there are documents in the query snapshot
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            mentionId: req.params.mentionId,
            userHandle: req.user.userHandle,
          })
          .then(() => {
            mentionData.likeCount++;
            return mentionDocument.update({ likeCount: mentionData.likeCount });
          })
          .then(() => {
            return res.json(mentionData);
          });
      } else {
        return res.status(400).json({ error: "Mention already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
