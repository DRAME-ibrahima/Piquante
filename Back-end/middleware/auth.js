const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjYwMGI4MTI4YzY1OWQ0YmZiNGE1MzEiLCJpYXQiOjE2NTE1MDg4NDksImV4cCI6MTY1MTU5NTI0OX0.6R04l6uzY8I9p2y56-Mrm9Wrr4yKTt1b44grWmZ4bRQ'
    );
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      res.status(403).json({ message: 'unauthorized request' })
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
