const { execSync } = require('child_process');

const main = (dependencies) => {
  console.log('Installing dependencies...');
  execSync(`npm i express ${dependencies.join(' ')}`, { stdio: 'inherit' });
};

module.exports = main;
