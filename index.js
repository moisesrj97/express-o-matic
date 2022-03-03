#!/usr/bin/env node

const inquirer = require('inquirer');
const { execSync } = require('child_process');

const createProject = require('./utils/createProject.js');
const addBabelTestPlugin = require('./utils/addBabelTestPlugin.js');
const setModuleType = require('./utils/setModuleType.js');
const installDependencies = require('./utils/installDependencies.js');

const { babelPluginName } = require('./utils/CONSTANTS.js');

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
      // Collect inquirer questions
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

      let babelPlugin = '';
      if (testingTools.length > 0 && moduleType === 'ES6 Modules') {
        babelPlugin = '@babel/plugin-transform-modules-commonjs';
      }

      // Install dependencies
      console.log('Module type:', moduleType);
      console.log('Dependencies to be installed:');
      console.log(
        [...middleWare, ...testingTools, babelPlugin]
          .map((e) => '- ' + e)
          .join('\n')
      );

      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to proceed? (Y/n)',
          default: true,
        },
      ]);

      if (proceed) {
        // Create package.json with description
        createProject();

        // Define package.json module type
        if (moduleType === 'CommonJS') {
          setModuleType('commonjs');
        } else {
          setModuleType('module');
        }

        if (testingTools.length > 0) {
          execSync('npm set-script test jest');
        }

        execSync('npm set-script start "node index.js"');

        // Configure testing if es6 modules selected and test utils selected
        if (testingTools.length > 0 && moduleType === 'ES6 Modules') {
          addBabelTestPlugin();
        }

        // Install dependencies
        installDependencies([...middleWare, ...testingTools, babelPlugin]);
      } else {
        console.log('Aborting...');
      }

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
