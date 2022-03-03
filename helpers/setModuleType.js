const { writeFileSync, readFileSync } = require('fs');

const main = (type) => {
  const json = JSON.parse(readFileSync('package.json'));
  json.type = type;
  writeFileSync('package.json', JSON.stringify(json, null, 2));
};

module.exports = main;
