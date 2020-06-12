const { db } = require('../util/admin');

exports.getAllMentions = (req, res) => {
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
    .catch(err => res.json(err));
};

exports.postMention = (req, res) => {
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
      console.error(err);
      return res.status(500).json({ error: 'You done goofed' });
    });
};

exports.getMention = (req, res) => {
  let mentionData = {};
  db
    .doc(`/mentions/${req.params.mentionId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Mention not found' });
      }
      mentionData = doc.data();
      mentionData.mentionId = doc.id;
      return db.collection('comments').orderBy('createdAt', 'asc').where('mentionId', '==', req.params.mentionId).get();
    })
    .then((data) => {
      mentionData.comments = [];
      data.forEach((doc) => {
        mentionData.comments.push(doc.data());
      });
      return res.json(mentionData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}

exports.commentOnMention = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ error: 'Cannot post empty comments' })
  }
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    mentionId: req.params.mentionId,
    userHandle: req.user.userHandle,
    userImage: req.user.imageUrl
  }
  db.doc(`/mentions/${req.params.mentionId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Mention not found' });
      }
      // adds new document. Takes JSON.
      return db.collection('comments').add(newComment);
    })
    // if reached here: doc created successfully
    .then(() => {
      return res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}