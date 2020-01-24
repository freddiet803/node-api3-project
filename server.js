const express = require('express');
const cors = require('cors');
const server = express();
const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');
server.use(express.json());
server.use(cors());
server.use(logger);

server.use('/posts', postRouter);
server.use('/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} ${req.get(
      'Origin'
    )}`
  );
  next();
}

module.exports = server;
