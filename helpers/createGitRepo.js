const { execSync } = require('child_process');
const { writeFileSync } = require('fs');

const gitIgnore = require('../resources/gitIgnore.js');

const main = () => {
  execSync('git init');
  writeFileSync('.gitignore', gitIgnore);
  execSync('git add .');
  execSync('git commit -m "Initial commit"');
};

module.exports = main;
