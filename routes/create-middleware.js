import inquirer from 'inquirer';
import processResourceName from '../helpers/utils/process-resource-name.js';

import { readFileSync, mkdirSync, existsSync, appendFileSync } from 'fs';
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

  const useTypescript = dependencies.typescript;
  const fileExtension = useTypescript ? 'ts' : 'js';

  if (!existsSync('src')) {
    mkdirSync('src');
  }

  if (!existsSync('src/middlewares')) {
    mkdirSync('src/middlewares');
  }

  if (useTypescript) {
    appendFileSync(
      `src/middlewares/${kebabCaseResourceName}.middleware.${fileExtension}`,
      `import { Request, Response, NextFunction } from 'express';
      
      `
    );
  }

  if (moduleType === 'module' || useTypescript) {
    appendFileSync(
      `src/middlewares/${kebabCaseResourceName}.middleware.${fileExtension}`,
      `export const ${camelCaseResourceName}Middleware = (req${
        useTypescript ? ': Request' : ''
      }, res${useTypescript ? ': Response' : ''}, next${
        useTypescript ? ': NextFunction' : ''
      }) => {
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
    appendFileSync(
      `src/middlewares/${kebabCaseResourceName}.middleware.${fileExtension}`,
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
    if (moduleType === 'module' || useTypescript) {
      appendFileSync(
        `src/middlewares/${kebabCaseResourceName}.middleware.test.${fileExtension}`,
        `import { ${camelCaseResourceName}Middleware } from './${kebabCaseResourceName}.middleware${
          useTypescript ? '' : '.js'
        }';\n\n`
      );
    } else {
      appendFileSync(
        `src/middlewares/${kebabCaseResourceName}.middleware.test.${fileExtension}`,
        `const { ${camelCaseResourceName}Middleware } = require('./${kebabCaseResourceName}.middleware.js');\n\n`
      );
    }
    appendFileSync(
      `src/middlewares/${kebabCaseResourceName}.middleware.test.${fileExtension}`,
      `describe('Given the controller', () => {
  let req${useTypescript ? ': any' : ''};
  let res${useTypescript ? ': any' : ''};
  let next${useTypescript ? ': any' : ''};
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
