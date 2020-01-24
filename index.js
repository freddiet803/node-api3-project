// code away!
require('dotenv').config();

const server = require('./server.js');

const port = process.env.PORT;

server.get('/', (req, res) => {
  res.status(200).json({ api: 'Api is up and running' });
});
server.listen(port, () => {
  console.log('Server listening on Port 5000');
});
