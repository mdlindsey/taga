// ------------ Copy app.yaml to storybook-static ---------------- //
const fs = require('fs-extra');
const mv = require('./moveDir');

try {
  // Throws error but seems to succeed...
  mv('./storybook-static', './storybook-static/www');
} catch(e) {
  console.log(e);
}

const path = require('path');
fs.copySync(
    path.resolve(__dirname,'./storybook.app.yaml'), 
    './storybook-static/app.yaml'
);