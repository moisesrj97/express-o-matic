const { execSync } = require('child_process');
const changePackageJsonDescription = require('./change-package-json-description.js');

const main = () => {
  // Initialize the npm project
  execSync('npm init -y');

  // Add the express-o-matic package.json description
  changePackageJsonDescription();
};

module.exports = main;
