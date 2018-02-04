const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      File = require('./fileManagement');

function App(filename) {

  let file = new File(filename);

  app.use(express.static('static', {"maxAge": "1d"}));

  app.post('/email', bodyParser.json(), (req, res, next) => {
    console.log(`Request for registering received: ${JSON.stringify(req.body)}`);
    file.write(req.body.email).then(() => console.log(`${req.body.email} written`));
    res.status(200).send(req.body.email);
    next();
  });

  return app;
}

module.exports = App;
