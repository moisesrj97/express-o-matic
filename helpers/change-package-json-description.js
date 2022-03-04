const fs = require('fs');

const main = () => {
  const json = JSON.parse(fs.readFileSync('package.json'));

  json.description = 'Express-o-matic generated express app';

  fs.writeFileSync('package.json', JSON.stringify(json, null, 2));
};

module.exports = main;
