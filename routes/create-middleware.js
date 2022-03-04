import inquirer from 'inquirer';
import processResourceName from '../helpers/process-resource-name.js';

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const main = async () => {
  let { middlewareName } = await inquirer.prompt([
    { type: 'input', message: 'Middleware name:', name: 'middlewareName' },
  ]);

  let { kebabCaseResourceName, camelCaseResourceName } =
    processResourceName(middlewareName);

  // Check module type and testing
  const moduleType = JSON.parse(readFileSync('package.json')).type;
  const dependencies = JSON.parse(readFileSync('package.json')).dependencies;

  if (!existsSync('middlewares')) {
    mkdirSync('middlewares');
  }

  if (moduleType === 'module') {
    writeFileSync(
      `middlewares/${kebabCaseResourceName}.middleware.js`,
      `export const ${camelCaseResourceName}Middleware = (req, res, next) => {
  try {
    //Do something
    next();
  } catch (err) {
    next(err);
  }
};

`
    );
  } else {
    writeFileSync(
      `middlewares/${kebabCaseResourceName}.middleware.js`,
      `const ${camelCaseResourceName}Middleware = (req, res, next) => {
  try {
    //Do something
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = ${camelCaseResourceName};
`
    );
  }
};

export default main;
