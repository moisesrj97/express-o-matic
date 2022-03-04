#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';

import createApp from './routes/create-app.js';
import createCrud from './routes/create-crud.js';
import createMiddleware from './routes/create-middleware.js';

async function main() {
  console.log(chalk.blueBright('Welcome to express-o-matic!'));

  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      message: 'What do you want to do?',
      name: 'mode',
      choices: [
        'Create an express app',
        'Create a CRUD route for my express app',
        'Create a middleware',
      ],
    },
  ]);

  switch (mode) {
    case 'Create an express app':
      await createApp();
      break;
    case 'Create a CRUD route for my express app':
      await createCrud();
      break;
    case 'Create a middleware':
      await createMiddleware();
      break;
    default:
      console.log('Invalid mode');
  }
}

if (require.main === module) {
  main();
}
