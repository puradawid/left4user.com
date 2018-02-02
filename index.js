const express = require('express'),
  app = express();

app.use(express.static('static'));



const envVarPort = process.env.NODEJS_APP_PORT,
port = envVarPort ? envVarPort : 8000;

app.listen(port, () => console.log(`Listening on port ${port}`));
