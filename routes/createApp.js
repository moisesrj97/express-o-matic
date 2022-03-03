const { execSync } = require('child_process');

const createProject = require('../utils/createProject.js');
const addBabelTestPlugin = require('../utils/addBabelTestPlugin.js');
const setModuleType = require('../utils/setModuleType.js');
const installDependencies = require('../utils/installDependencies.js');

const { babelPluginName } = require('../utils/CONSTANTS.js');
const inquirer = require('inquirer');
const { writeFileSync, appendFileSync } = require('fs');

const main = async () => {
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
    // Create imports conditional on module type
    console.log('Creating index.js file...');

    if (moduleType === 'ES6 Modules') {
      appendFileSync('index.js', "import express from 'express';\n");
      middleWare.forEach((e) => {
        appendFileSync('index.js', `import ${e} from '${e}';\n`);
      });
    } else {
      appendFileSync('index.js', "const express = require('express');\n");
      middleWare.forEach((e) => {
        appendFileSync('index.js', `const ${e} = require('${e}');\n`);
      });
    }

    // Create express app
    appendFileSync('index.js', `const app = express();\n\n`);
    appendFileSync('index.js', 'app.use(express.json());\n');
    middleWare.forEach((e) => {
      switch (e) {
        case 'morgan':
          appendFileSync('index.js', `app.use(morgan('dev'));\n`);
          break;
        default:
          appendFileSync('index.js', `app.use(${e}());\n`);
      }
    });
    appendFileSync(
      'index.js',
      '\napp.get("/", (res, req) => {\n  res.status(200).send("Hello World!");\n});\n\n'
    );
    appendFileSync('index.js', 'const port = process.env.PORT || 3000;\n\n');
    appendFileSync(
      'index.js',
      'app.listen(port, () => console.log(`Server running on port ${port}`));\n'
    );
  } else {
    console.log('Aborting...');
  }
};

module.exports = main;
