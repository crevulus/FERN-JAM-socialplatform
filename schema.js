const db = {
  mentions: [
    {
      userHandle: String,
      body: String,
      createdAt: Date,
      likeCount: Number,
      commentCount: Number,
    },
  ],
  users: [
    {
      bio: String,
      createdAt: Date,
      email: String,
      imageUrl: String,
      location: String,
      userHandle: String,
      userId: String,
      website: String,
    },
  ],
  comments: [
    {
      userHandle: String,
      mentionId: String,
      body: String,
      createdAt: Date,
    },
  ],
};

const userDetails = {
  // Redux data
  credentials: {
    userId: "N43KJ5H43KJHREW4J5H3JWMERHB",
    email: "user@email.com",
    handle: "user",
    createdAt: "2019-03-15T10:59:52.798Z",
    imageUrl: "image/dsfsdkfghskdfgs/dgfdhfgdh",
    bio: "Hello, my name is user, nice to meet you",
    website: "https://user.com",
    location: "Lonodn, UK",
  },
  likes: [
    {
      userHandle: "user",
      mentionId: "hh7O5oWfWucVzGbHH2pa",
    },
    {
      userHandle: "user",
      mentionId: "3IOnFoQexRcofs5OhBXO",
    },
  ],
};
