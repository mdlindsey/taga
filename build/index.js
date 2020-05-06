// ------------ Copy app.yaml to storybook-static ---------------- //
const fs = require('fs-extra');
const path = require('path');
fs.copySync(path.resolve(__dirname,'./app.yaml'), './storybook-static/app.yaml');