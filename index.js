#!/usr/bin/env node

const inquirer = require('inquirer');

const createApp = require('./routes/create-app.js');

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
      await createApp();
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
