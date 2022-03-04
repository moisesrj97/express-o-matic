import { execSync } from 'child_process';
import inquirer from 'inquirer';

import createProject from '../helpers/create-project.js';
import addBabelTestPlugin from '../helpers/add-babel-test-plugin.js';
import setModuleType from '../helpers/set-module-type.js';
import installDependencies from '../helpers/install-dependencies.js';
import createIndexFile from '../helpers/create-index-file.js';
import createGitRepo from '../helpers/create-git-repo.js';

import { babelPluginName } from '../helpers/CONSTANTS.js';
import { appendFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';

const main = async () => {
  // Collect inquirer questions
  const { moduleType, middleWare, testingTools, repo } = await inquirer.prompt([
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
    {
      type: 'confirm',
      name: 'repo',
      message: 'Do you create a git repository? (Y/n)',
      default: true,
    },
  ]);

  let babelPlugin = '';
  if (testingTools.length > 0 && moduleType === 'ES6 Modules') {
    babelPlugin = babelPluginName;
  }

  // Install dependencies
  console.log(chalk.blueBright('Module type:'), moduleType);
  console.log(chalk.blueBright('Dependencies to be installed:'));
  console.log(
    [...middleWare, ...testingTools, babelPlugin]
      .filter((e) => e !== '')
      .map((e) => '- ' + e)
      .join('\n')
  );
  console.log(chalk.blueBright('Repository:'), repo);

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

    // Create index.js file
    createIndexFile(moduleType, middleWare);

    // Create e2e test if tests

    if (testingTools.includes('supertest')) {
      if (moduleType === 'ES6 Modules') {
        appendFileSync(
          'e2e.test.js',
          `import { app, server } from './index.js';
import request from 'supertest';


`
        );
      } else {
        appendFileSync(
          'e2e.test.js',
          `const { app, server } = require('./index.js');
const request = require('supertest');

`
        );
      }
      appendFileSync(
        'e2e.test.js',
        `describe('Given the express application', () => {
  afterEach(() => {
    server.close();
  });
  describe('When GET /', () => {
    test('It returns Hello World', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toBe('Hello World!');
    });
  });
});
`
      );
    }

    // Create git repository
    if (repo) {
      createGitRepo();
    }

    // Final greeting
    console.log('\n\n');
    console.log(chalk.blueBright('Your express app is ready!'));
    console.log('\n');
    console.log(
      'Run ',
      chalk.greenBright('npm start'),
      ' to start the server\n\n'
    );
  } else {
    console.log(chalk.redBright('Aborting... See you!\n\n'));
  }
};

export default main;
