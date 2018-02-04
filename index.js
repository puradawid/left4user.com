const App = require('./app');


let store_path = process.env.STORE_PATH || '.',
app = App(store_path + '/emails.txt');

// System set-up
const envVarPort = process.env.NODEJS_APP_PORT,
port = envVarPort ? envVarPort : 8000;

// Running HTTP server
var server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
