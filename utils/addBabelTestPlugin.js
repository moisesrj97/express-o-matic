const { readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');

const main = () => {
  const json = JSON.parse(readFileSync('package.json'));

  json.babel = {
    env: { test: { plugins: ['@babel/plugin-transform-modules-commonjs'] } },
  };

  writeFileSync('package.json', JSON.stringify(json, null, 2));

  execSync(`npm i @babel/plugin-transform-modules-commonjs`, {
    stdio: 'inherit',
  });
};

module.exports = main;
