const fs = require('fs');

const main = () => {
  fs.writeFileSync(
    'package.json',
    fs
      .readFileSync('package.json')
      .toString()
      .replace(
        '"description": "",',
        '"description": "Express-o-matic generated express app",'
      )
  );
};

module.exports = main;
