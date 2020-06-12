const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
  let userToken
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    userToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token')
    return res.status(403).json({ error: 'Unauthorized' });
  }

  admin
    .auth()
    .verifyIdToken(userToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get()
    })
    .then(data => {
      // getting userHandle prop from db and attaching it to our user
      req.user.userHandle = data.docs[0].data().userHandle;
      req.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch(err => res.json(err));
}