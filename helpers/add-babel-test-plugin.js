const { readFileSync, writeFileSync } = require('fs');
const { babelPluginName } = require('./CONSTANTS');

const main = () => {
  const json = JSON.parse(readFileSync('package.json'));

  json.babel = {
    env: { test: { plugins: [babelPluginName] } },
  };

  writeFileSync('package.json', JSON.stringify(json, null, 2));
};

module.exports = main;
