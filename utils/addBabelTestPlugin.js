const { readFileSync, writeFileSync } = require('fs');

const main = () => {
  const json = JSON.parse(readFileSync('package.json'));

  json.babel = {
    env: { test: { plugins: ['@babel/plugin-transform-modules-commonjs'] } },
  };

  writeFileSync('package.json', JSON.stringify(json, null, 2));

  return '@babel/plugin-transform-modules-commonjs';
};

module.exports = main;
