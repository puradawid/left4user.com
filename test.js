const puppeteer = require('puppeteer'),
  App = require('./app'),
  app = App('emails.txt');
  File = require('./fileManagement');

// Purely technical functions

function runAppAndPerform(callback, fixedPort) {
  fixedPort = fixedPort || 8000;
  let server = app.listen(fixedPort, () => {
    console.log(`Starting listening on port ${fixedPort}`);
    callback(fixedPort).then(() => {
      server.close();
      console.log(`Closing server listening on ${fixedPort}`);
    });
  });
}

function browse(performBrowsing) {
  var processBrowser;
  return puppeteer.launch().then((browser) => {
    processBrowser = browser;
    let result = performBrowsing(browser);
    if (result instanceof Promise) {
      return result;
    } else {
      return Promise.reject(new Error("Function passed is not returning final promise"));
    }
  }).then(() => processBrowser.close())
  .catch((exception) => {
    console.log(exception);
    processBrowser.close();
    process.exit(-1);
  });
}

// Methods needed for testing

function findBothElements(page) {
 let textPromise = page.$('input[type=text]'),
     buttonPromise = page.$('input[type=submit]');
 return Promise.all([textPromise, buttonPromise]);
}

function typeAndSubmit([text, button], email) {
  return text.type(email)
     .then(() => button.click());
}

function checkIfThereIsRightResponse(response) {
  let responseCode = response.status();
  return new Promise((resolve, reject) => {
     if (responseCode == 200) {
       resolve(true);
     } else {
       reject(new Error("Response code is " + responseCode + " rather than 200"));
     }
  });
}

function registerEmail(email, page) {
  return findBothElements(page)
    .then((context) => typeAndSubmit(context, email));
}

function readFileAndFindMyEmail(email) {
  return new Promise((resolve, reject) => {
    let f = new File('emails.txt');
    return f.read().then(data => {
      if (data.includes(email)) {
        resolve();
      } else {
        reject(new Error("There is no email"));
      }
    }).catch(reject);
  });
}

function openPage(browser, port) {
    return browser.newPage()
    .then((newPage) => {
      return Promise.all([newPage.goto(`http://localhost:${port}`),
                         Promise.resolve(newPage)]);
    }).catch((exception) => {
      return Promise.reject(exception);});
}

function registerEmailSimpleScenario(browser, port) {
    return openPage(browser, port)
    .then(([response, page]) =>
      Promise.all([
        checkIfThereIsRightResponse(response),
        Promise.resolve(page)
      ])
    ).then(([_, page]) => 
      registerEmail('random@random.com', page)
    ).then(() =>
      readFileAndFindMyEmail('random@random.com')
    ).catch((exception) => {
      return Promise.reject(exception);});
}

// Glue code

runAppAndPerform((port) => {
  return browse((browser) =>
    registerEmailSimpleScenario(browser, port)
  );
});

