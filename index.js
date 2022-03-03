#!/usr/bin/env node

const inquirer = require('inquirer');
const { execSync } = require('child_process');
const { writeFileSync, readFileSync } = require('fs');

const changePackageJsonDescription = require('./utils/changePackageJsonDescription.js');
const addBabelTestPlugin = require('./utils/addBabelTestPlugin.js');
const setModuleType = require('./utils/setModuleType.js');
const installDependencies = require('./utils/installDependencies.js');

async function main() {
  console.log('Welcome to express-o-matic!');
  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      message: 'What do you want to do?',
      name: 'mode',
      choices: [
        'Create an express app',
        'Create a CRUD route for my express app',
      ],
    },
  ]);

  switch (mode) {
    case 'Create an express app':
      const { moduleType, middleWare, testingTools } = await inquirer.prompt([
        {
          type: 'list',
          name: 'moduleType',
          message: 'What type of module do you want to use?',
          choices: ['CommonJS', 'ES6 Modules'],
        },
        {
          type: 'checkbox',
          name: 'middleWare',
          message: 'What middleware do you want to use?',
          choices: ['morgan', 'cors', 'helmet'],
        },
        {
          type: 'checkbox',
          name: 'testingTools',
          message: 'What testing tools do you want to use?',
          choices: ['jest', 'supertest'],
        },
      ]);
      // Initialize the npm project
      execSync('npm init -y');

      // Add the express-o-matic package.json description
      changePackageJsonDescription();

      console.log(moduleType, middleWare, testingTools);

      // Define package.json module type
      if (moduleType === 'CommonJS') {
        setModuleType('commonjs');
      } else {
        setModuleType('module');
      }

      // Configure testing if es6 modules selected and test utils selected
      if (testingTools.length > 0 && moduleType === 'ES6 Modules') {
        addBabelTestPlugin();
      }

      // Install dependencies
      installDependencies([...middleWare, ...testingTools]);

      break;
    case 'Create a CRUD route for my express app':
      console.log('Creating a CRUD route for my express app...');
      break;
    default:
      console.log('Invalid mode');
  }
}

if (require.main === module) {
  main();
}
