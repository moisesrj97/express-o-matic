const inquirer = require('inquirer');

const { readFileSync } = require('fs');

const processResourceName = require('../helpers/process-resource-name.js');
const createRouterFile = require('../helpers/create-router-file.js');
const createControllerFile = require('../helpers/create-controller-file.js');

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

  // Check if name includes /
  if (resourceName.includes('/')) {
    return console.log('Resource name cannot contain /');
  }

  // Check if resource name is in plural
  if (resourceName[resourceName.length - 1] === 's') {
    resourceName = resourceName.substring(0, resourceName.length - 1);
  }

  // Process resource name
  let {
    camelCaseResourceName,
    kebabCaseResourceName,
    capitalizedResourceName,
  } = processResourceName(resourceName);

  // Check module type
  const moduleType = JSON.parse(readFileSync('package.json')).type;

  // Create router file
  createRouterFile(moduleType, kebabCaseResourceName, capitalizedResourceName);

  // Create controller file
  createControllerFile(
    dbExtract,
    moduleType,
    kebabCaseResourceName,
    capitalizedResourceName
  );

  console.log(
    '\n\nRemember to import the router on index.js and add it to the app.use() method!\n\n'
  );
};

module.exports = main;
