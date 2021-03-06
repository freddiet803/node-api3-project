const express = require('express');
const db = require('./userDb.js');
const postDB = require('../posts/postDb.js');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  const newUser = req.body;
  if (newUser.name) {
    db.insert(newUser)
      .then(user => {
        res
          .status(201)
          .json({ user: user, message: 'user successfully created' });
      })
      .catch(err => {
        res.status(500).json({ errorMessage: 'User could not be created' });
      });
  } else {
    res.status(404).json({ message: 'need a user name in the text field' });
  }
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!//**************************************************************************************** */
  const id = req.params.id;
  const newPost = req.body;
  newPost.user_id = id;

  db.getById(id)
    .then(user => {
      if (user) {
        if (newPost.text && newPost.user_id) {
          postDB
            .insert(newPost)
            .then(addedPost => {
              res.status(201).json({
                added: addedPost,
                message: `added new post to database for ${user.name} `
              });
            })
            .catch(err => {
              res.status(500).json({ errorMessage: 'post could not be added' });
            });
        } else {
          res.status(404).json({ message: 'Please provide text for the post' });
        }
      } else {
        res.status(404).json({ message: 'User does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'could not post to database' });
    });
});

router.get('/', (req, res) => {
  // do your magic!
  db.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'Could not retrieve users from database' });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  db.getById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'user with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: 'Could not perform action get user from database'
      });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const userId = req.params.id;
  db.getUserPosts(userId)
    .then(userPost => {
      if (userPost.length > 0) {
        res.status(200).json(userPost);
      } else {
        res
          .status(404)
          .json({ message: 'user has no post or user doesnt exist' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'could not perfrom get user posts' });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;

  db.getById(id)
    .then(user => {
      if (user) {
        db.remove(id)
          .then(deletedUser => {
            res.status(200).json({
              deleted: deletedUser,
              message: `user ${id}, ${user.name} successfully deleted`
            });
          })
          .catch(err => {
            res.status(500).json({ errorMessage: 'User could not be deleted' });
          });
      } else {
        res
          .status(404)
          .json({ message: 'User with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'error performing delete user' });
    });
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  const contents = req.body;
  db.getById(id)
    .then(user => {
      if (user) {
        if (contents.name) {
          db.update(id, contents)
            .then(updatedUser => {
              res.status(201).json(updatedUser);
            })
            .catch(err => {
              res
                .status(500)
                .json({ errorMessage: 'user could not be updated' });
            });
        } else {
          res.status(400).json({ message: 'must have a name property' });
        }
      } else {
        res.status(404).json({ message: 'user does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'Could not update user' });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const theUser = req.params.id;
  db.getById(theUser)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: 'invalide user id, from middleware' });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'error' });
    });
}

function validateUser(req, res, next) {
  // do your magic!
  const user = req.body;

  if (!user) {
    res.status(400).json({ message: 'missing user data, from middleware' });
  } else if (!user.name) {
    res
      .status(400)
      .json({ message: 'missing required name field, from middleware' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  const post = req.body;

  if (!post) {
    res.status(400).json({ message: 'missing post data' });
  } else if (!post.text) {
    res
      .status(400)
      .json({ message: 'missing required text field, from middleware' });
  } else {
    next();
  }
}

module.exports = router;
