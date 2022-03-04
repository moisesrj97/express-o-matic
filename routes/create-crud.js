import inquirer from 'inquirer';

import { appendFile, appendFileSync, readFileSync, writeFileSync } from 'fs';

import processResourceName from '../helpers/process-resource-name.js';
import createRouterFile from '../helpers/create-router-file.js';
import createControllerFile from '../helpers/create-controller-file.js';
import chalk from 'chalk';

const main = async () => {
  // Ask for the resource name
  let { resourceName, dbExtract } = await inquirer.prompt([
    { type: 'input', message: 'Resource name:', name: 'resourceName' },
    {
      type: 'confirm',
      message: 'Dou you want to extract db connection to new file?:',
      name: 'dbExtract',
      default: false,
    },
  ]);

  // Check if resource name is in plural
  if (resourceName[resourceName.length - 1] === 's') {
    resourceName = resourceName.substring(0, resourceName.length - 1);
  }

  // Process resource name
  let { kebabCaseResourceName, capitalizedResourceName } =
    processResourceName(resourceName);

  // Check module type and testing
  const moduleType = JSON.parse(readFileSync('package.json')).type;
  const dependencies = JSON.parse(readFileSync('package.json')).dependencies;

  // Create router file
  createRouterFile(moduleType, kebabCaseResourceName, capitalizedResourceName);

  // Create controller file
  createControllerFile(
    dbExtract,
    moduleType,
    kebabCaseResourceName,
    capitalizedResourceName
  );

  if (dependencies.hasOwnProperty('jest')) {
    writeFileSync(
      `controllers/${kebabCaseResourceName}.controller.test.js`,
      ''
    );
    if (dbExtract) {
      writeFileSync(`db/${kebabCaseResourceName}.db.test.js`, '');
    }
  }

  if (
    dependencies.hasOwnProperty('jest') ||
    dependencies.hasOwnProperty('supertest')
  ) {
    if (moduleType === 'ES6 Modules') {
      appendFileSync(
        `routes/${kebabCaseResourceName}.router.test.js`,
        `import { app, server } from '../index.js';
import request from 'supertest';


`
      );
    } else {
      appendFileSync(
        `routes/${kebabCaseResourceName}.router.test.js`,
        `const { app, server } = require('../index.js');
const request = require('supertest');

`
      );
    }
    appendFileSync(
      `routes/${kebabCaseResourceName}.router.test.js`,
      `describe('Given the express application', () => {
  afterEach(() => {
    server.close();
  });
  describe('When GET /${kebabCaseResourceName}s', () => {
    test('It returns Hello World', async () => {
      const res = await request(app).get('/${kebabCaseResourceName}s');
      expect(res.status).toBe(200);
      expect(res.text).toBe('This route get all ${capitalizedResourceName}s');
    });
  });
  describe('When GET /${kebabCaseResourceName}s/:id', () => {
    test('It returns Hello World', async () => {
      const res = await request(app).get('/${kebabCaseResourceName}s/1');
      expect(res.status).toBe(200);
      expect(res.text).toBe("This route get ${capitalizedResourceName} with id " + 1);
    });
  });
  describe('When POST /${kebabCaseResourceName}s', () => {
    test('It returns Hello World', async () => {
      const res = await request(app)
        .post('/${kebabCaseResourceName}s/')
        .send({test: "test"})
        .set('Accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.text).toBe("This route create a ${capitalizedResourceName} with value " + JSON.stringify({test: "test"}));
    });
  });
  describe('When PUT /${kebabCaseResourceName}s/:id', () => {
    test('It returns Hello World', async () => {
      const res = await request(app)
        .put('/${kebabCaseResourceName}s/1')
        .send({test: "test"})
        .set('Accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.text).toBe("This route update ${capitalizedResourceName} with id " + 1+ " and value " + JSON.stringify({test: "test"}));
    });
  });
  describe('When DELETE /${kebabCaseResourceName}s/:id', () => {
    test('It returns Hello World', async () => {
      const res = await request(app).delete('/${kebabCaseResourceName}s/1');
      expect(res.status).toBe(200);
      expect(res.text).toBe("This route delete ${capitalizedResourceName} with id " + 1);
    });
  });
});
`
    );
  }

  console.log(
    '\n\n',
    chalk.redBright('Remember'),
    'to import the router on',
    chalk.blueBright('index.js'),
    'and add it to the',
    chalk.bold('app.use()'),
    'method!\n\n'
  );
};

export default main;
