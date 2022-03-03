const { execSync } = require('child_process');

const main = (dependencies) => {
  execSync(`npm i express ${dependencies.join(' ')}`, { stdio: 'inherit' });
};

module.exports = main;
