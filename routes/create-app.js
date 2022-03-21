import { execSync } from 'child_process';
import inquirer from 'inquirer';

import createProject from '../helpers/utils/create-project.js';
import addBabelTestPlugin from '../helpers/add-babel-test-plugin.js';
import setModuleType from '../helpers/set-module-type.js';
import installDependencies from '../helpers/utils/install-dependencies.js';
import createIndexFile from '../helpers/create-index-file.js';
import createGitRepo from '../helpers/utils/create-git-repo.js';
import generateIndexTest from '../helpers/generate-index-test.js';

import { babelPluginName } from '../helpers/constants/CONSTANTS.js';
import chalk from 'chalk';
import { existsSync, writeFileSync } from 'fs';

const main = async () => {
  // Collect inquirer questions

  const { useTypeScript } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useTypeScript',
      message: 'Do you want to use TypeScript? (Y/n)',
      default: true,
    },
  ]);

  let moduleType;

  if (useTypeScript) {
    moduleType = 'CommonJS';
  } else {
    ({ moduleType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'moduleType',
        message: 'What type of module do you want to use?',
        choices: ['CommonJS', 'ES6 Modules'],
      },
    ]));
  }

  const { middleWare, testingTools, repo } = await inquirer.prompt([
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
  if (
    testingTools.length > 0 &&
    moduleType === 'ES6 Modules' &&
    !useTypeScript
  ) {
    babelPlugin = babelPluginName;
  }

  // Install dependencies
  console.log(chalk.blueBright('Using TypeScript:'), useTypeScript);
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

    if (useTypeScript) {
      execSync('npm set-script build "tsc --project ."');
      execSync('npm set-script start "tsc --project . && node dist/index.js"');
      execSync('npm set-script start:dev "nodemon src/index.ts"');
    } else {
      execSync('npm set-script start "node index.js"');
      execSync('npm set-script start:dev "nodemon index.js"');
    }

    // Configure testing if es6 modules selected and test utils selected
    if (
      testingTools.length > 0 &&
      moduleType === 'ES6 Modules' &&
      !useTypeScript
    ) {
      addBabelTestPlugin();
    }

    const dependenciesArray = [...middleWare, ...testingTools, babelPlugin];

    // Add TS dependencies if selected

    if (useTypeScript) {
      dependenciesArray.push(
        'typescript',
        'ts-node',
        '@types/express',
        '@types/node'
      );

      middleWare.forEach((e) => {
        dependenciesArray.push(`@types/${e}`);
      });
    }

    if (testingTools.includes('jest') && useTypeScript) {
      dependenciesArray.push('@types/jest', 'ts-jest');
      execSync('npx ts-jest config:init');
    }

    if (testingTools.includes('supertest') && useTypeScript) {
      dependenciesArray.push('@types/supertest', 'ts-jest');
      if (!existsSync('jest.config.js')) {
        execSync('npx ts-jest config:init');
      }
    }

    // Install dependencies
    installDependencies(dependenciesArray);

    if (useTypeScript) {
      writeFileSync(
        'tsconfig.json',
        JSON.stringify(
          {
            'compilerOptions': {
              'target': 'es2016',
              'module': 'commonjs',
              'rootDir': './src',
              'moduleResolution': 'node',
              'baseUrl': './src',
              'declaration': true,
              'declarationMap': true,
              'outDir': './dist',
              'removeComments': true,
              'esModuleInterop': true,
              'forceConsistentCasingInFileNames': true,
              'strict': true,
              'skipLibCheck': true,
            },
          },
          null,
          2
        )
      );
    }

    // Create index.js file
    createIndexFile(moduleType, middleWare, useTypeScript);

    // Create e2e test if tests

    if (testingTools.includes('supertest')) {
      generateIndexTest(moduleType, useTypeScript);
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
      chalk.greenBright('npm run start:dev'),
      ' to start the server\n\n'
    );
  } else {
    console.log(chalk.redBright('Aborting... See you!\n\n'));
  }
};

export default main;
