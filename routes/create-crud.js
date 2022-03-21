import inquirer from 'inquirer';

import { readFileSync } from 'fs';

import processResourceName from '../helpers/utils/process-resource-name.js';
import createRouterFile from '../helpers/create-router-file.js';
import createControllerFile from '../helpers/create-controller-file.js';
import generateRouterAndControllerTestFile from '../helpers/generate-router-and-controller-test-file.js';
import chalk from 'chalk';

const main = async () => {
  // Ask for the resource name
  let { resourceName, dbExtract } = await inquirer.prompt([
    { type: 'input', message: 'Resource name:', name: 'resourceName' },
    {
      type: 'confirm',
      message: 'Dou you want to extract db operations to new file?:',
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

  // Generate router and controller test file
  generateRouterAndControllerTestFile(
    dependencies,
    dbExtract,
    moduleType,
    kebabCaseResourceName,
    capitalizedResourceName
  );

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
