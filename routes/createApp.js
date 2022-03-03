const { execSync } = require('child_process');

const createProject = require('../helpers/createProject.js');
const addBabelTestPlugin = require('../helpers/addBabelTestPlugin.js');
const setModuleType = require('../helpers/setModuleType.js');
const installDependencies = require('../helpers/installDependencies.js');
const createIndexFile = require('../helpers/createIndexFile.js');
const createGitRepo = require('../helpers/createGitRepo.js');

const { babelPluginName } = require('../helpers/CONSTANTS.js');
const inquirer = require('inquirer');

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
  console.log('Module type:', moduleType);
  console.log('Dependencies to be installed:');
  console.log(
    [...middleWare, ...testingTools, babelPlugin]
      .filter((e) => e !== '')
      .map((e) => '- ' + e)
      .join('\n')
  );
  console.log('Repository:', repo);

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

    // Create git repository
    if (repo) {
      createGitRepo();
    }

    // Final greeting
    console.log('\n\n');
    console.log('Your express app is ready!');
    console.log('\n');
    console.log("Run 'npm start' to start the server");
  } else {
    console.log('Aborting... See you!');
  }
};

module.exports = main;
