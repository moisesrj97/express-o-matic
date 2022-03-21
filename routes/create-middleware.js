import inquirer from 'inquirer';
import processResourceName from '../helpers/utils/process-resource-name.js';

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  appendFileSync,
} from 'fs';
import chalk from 'chalk';

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

  if (dependencies.hasOwnProperty('jest')) {
    if (moduleType === 'module') {
      appendFileSync(
        `middlewares/${kebabCaseResourceName}.middleware.test.js`,
        `import { ${camelCaseResourceName}Middleware } from './${kebabCaseResourceName}.middleware.js';\n\n`
      );
    } else {
      appendFileSync(
        `middlewares/${kebabCaseResourceName}.middleware.test.js`,
        `const { ${camelCaseResourceName}Middleware } = require('./${kebabCaseResourceName}.middleware.js');\n\n`
      );
    }
    appendFileSync(
      `middlewares/${kebabCaseResourceName}.middleware.test.js`,
      `describe('Given the controller', () => {
  let req;
  let res;
  let next;
  beforeEach(() => {
      req = { params: {} };
      res = {};
      res.send = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.status = jest.fn().mockReturnValue(res);
      next = jest.fn();
  });

  describe('When it is called is called', () => {
    test('It should return data', () => {
      res = {status: () => res, send: jest.fn()};

      ${camelCaseResourceName}Middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});

`
    );
  }

  console.log(chalk.blueBright('Middleware created and ready!'));
};

export default main;
