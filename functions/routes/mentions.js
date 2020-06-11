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