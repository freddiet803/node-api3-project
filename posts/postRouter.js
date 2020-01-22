const express = require('express');
const db = require('./postDb.js');

const router = express.Router();
router.use(validatePostId);
router.get('/', (req, res) => {
  // do your magic!
  db.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'Could not get posts from database' });
    });
});

router.get('/:id', (req, res) => {
  // do your magic!
  const id = req.params.id;

  db.getById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'The post could not be deleted' });
    });
});

router.delete('/:id', (req, res) => {
  // do your magic!
  const id = req.params.id;

  db.remove(id)
    .then(post => {
      if (post) {
        res.status(200).json({ message: `Post with id of ${id} was deleted` });
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'The post could not be deleted' });
    });
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  const upPost = req.body;

  db.getById(id)
    .then(post => {
      if (post) {
        if (upPost.text) {
          db.update(id, upPost)
            .then(updatedPost => {
              res.status(201).json(updatedPost);
            })
            .catch(err => {
              res
                .status(500)
                .json({ message: 'The post could not be updated' });
            });
        } else {
          res
            .status(404)
            .json({ message: 'Please provide text and id fields' });
        }
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'The resource could not be updated ' });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  //   validatePost validates the body on a request to create a new post
  // if the request body is missing, cancel the request and respond with status 400 and { message: "missing post data" }
  // if the request body is missing the required text field, cancel the request and respond with status 400 and { message: "missing required text field" }
  if (!req.body) {
    res.status(400).json({ message: 'Missing post data, from middleware' });
  } else {
    if (!req.body.text) {
      res
        .status(400)
        .json({ message: 'missing required text field, from middleware' });
    } else {
      next();
    }
  }
}

module.exports = router;
