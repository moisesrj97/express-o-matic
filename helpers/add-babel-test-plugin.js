import { readFileSync, writeFileSync } from 'fs';
import { babelPluginName } from './CONSTANTS.js';

const main = () => {
  const json = JSON.parse(readFileSync('package.json'));

  json.babel = {
    env: { test: { plugins: [babelPluginName] } },
  };

  writeFileSync('package.json', JSON.stringify(json, null, 2));
};

export default main;
