const fs = require('fs');

function File(filename) {
  this.filename = filename;

  this.write = function(data) {
    return new Promise((resolve, reject) => {
      fs.appendFile(this.filename, data + ';\n', 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  this.read = function() {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
}

module.exports = File;
