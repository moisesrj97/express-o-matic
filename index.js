#!/usr/bin/env node

const inquirer = require('inquirer');

const { existsSync, mkdirSync, appendFileSync, readFileSync } = require('fs');

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

      let camelCaseResourceName = '';
      let kebabCaseResourceName = '';
      let capitalizedResourceName = '';

      // Generate camelCase and kebabCase resource name
      if (resourceName.match(/[A-Z]+/)) {
        console.log('Resource name has uppercases');
        camelCaseResourceName = resourceName;
        kebabCaseResourceName = resourceName
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase();
        capitalizedResourceName =
          camelCaseResourceName.charAt(0).toUpperCase() +
          camelCaseResourceName.slice(1);
      } else {
        console.log('Resource name has no uppercases');
        kebabCaseResourceName = resourceName;
        camelCaseResourceName = resourceName.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase()
        );
        capitalizedResourceName =
          camelCaseResourceName.charAt(0).toUpperCase() +
          camelCaseResourceName.slice(1);
      }

      // Check module type
      const moduleType = JSON.parse(readFileSync('package.json')).type;

      // Check if routes folder exists and create it if not
      if (!existsSync('routes')) {
        mkdirSync('routes');
      }

      // Import controllers conditionals on module type for router file
      if (moduleType === 'module') {
        appendFileSync(
          `routes/${kebabCaseResourceName}.router.js`,
          `import express from 'express';\nimport { getAll${capitalizedResourceName}s, get${capitalizedResourceName}, create${capitalizedResourceName}, update${capitalizedResourceName}, delete${capitalizedResourceName} } from '../controllers/${kebabCaseResourceName}.controller.js'\n\n`
        );
      } else {
        appendFileSync(
          `routes/${kebabCaseResourceName}.router.js`,
          `const express = require('express');\nconst { getAll${capitalizedResourceName}s, get${capitalizedResourceName}, create${capitalizedResourceName}, update${capitalizedResourceName}, delete${capitalizedResourceName} } = require('../controllers/${kebabCaseResourceName}.controller.js');\n\n`
        );
      }

      // Create router file content
      appendFileSync(
        `routes/${kebabCaseResourceName}.router.js`,
        `const router = express.Router();\n\n`
      );
      appendFileSync(
        `routes/${kebabCaseResourceName}.router.js`,
        `router\n  .get('/', getAll${capitalizedResourceName}s)\n  .get('/:id', get${capitalizedResourceName})\n  .post('/', create${capitalizedResourceName})\n  .put('/:id', update${capitalizedResourceName})\n  .delete('/:id', delete${capitalizedResourceName});\n\n`
      );
      if (moduleType === 'module') {
        appendFileSync(
          `routes/${kebabCaseResourceName}.router.js`,
          `export default router;\n\n`
        );
      } else {
        appendFileSync(
          `routes/${kebabCaseResourceName}.router.js`,
          `module.exports = router;\n\n`
        );
      }

      // Check if controllers folder exists and create it if not
      if (!existsSync('controllers')) {
        mkdirSync('controllers');
      }

      if (!dbExtract) {
        // Create controller file content
        if (moduleType === 'module') {
          // Get all
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `export const getAll${capitalizedResourceName}s = (req, res) => res.status(200).send("This route get all ${capitalizedResourceName}s");\n\n`
          );
          // Get by id
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `export const get${capitalizedResourceName} = (req, res) => res.status(200).send("This route get ${capitalizedResourceName} with id " + req.params.id);\n\n`
          );
          // Create
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `export const create${capitalizedResourceName} = (req, res) => res.status(200).send("This route create a ${capitalizedResourceName} with value " + JSON.stringify(req.body));\n\n`
          );
          // Update
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `export const update${capitalizedResourceName} = (req, res) => res.status(200).send("This route update ${capitalizedResourceName} with id " + req.params.id + " and value " + JSON.stringify(req.body));\n\n`
          );
          // Delete
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `export const delete${capitalizedResourceName} = (req, res) => res.status(200).send("This route delete ${capitalizedResourceName} with id " + req.params.id);\n\n`
          );
        } else {
          // Get all
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const getAll${capitalizedResourceName}s = (req, res) => res.status(200).send("This route get all ${capitalizedResourceName}s");\n\n`
          );
          // Get by id
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const get${capitalizedResourceName} = (req, res) => res.status(200).send("This route get ${capitalizedResourceName} with id " + req.params.id);\n\n`
          );
          // Create
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const create${capitalizedResourceName} = (req, res) => res.status(200).send("This route create a ${capitalizedResourceName} with value " + JSON.stringify(req.body));\n\n`
          );
          // Update
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const update${capitalizedResourceName} = (req, res) => res.status(200).send("This route update ${capitalizedResourceName} with id " + req.params.id + " and value " + JSON.stringify(req.body));\n\n`
          );
          // Delete
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const delete${capitalizedResourceName} = (req, res) => res.status(200).send("This route delete ${capitalizedResourceName} with id " + req.params.id);\n\n`
          );
          // Export
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `module.exports = {\n  getAll${capitalizedResourceName}s,\n  get${capitalizedResourceName},\n  create${capitalizedResourceName},\n  update${capitalizedResourceName},\n  delete${capitalizedResourceName}\n};\n\n`
          );
        }
      } else {
        // Check if db folder exists and create it if not
        if (!existsSync('db')) {
          mkdirSync('db');
        }

        if (moduleType === 'module') {
          // Create db file content
          // Get all
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `export const getAll${capitalizedResourceName}sDB = () => "This route get all ${capitalizedResourceName}s";\n\n`
          );
          // Get by id
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `export const get${capitalizedResourceName}DB = (id) =>  "This route get ${capitalizedResourceName} with id " + id;\n\n`
          );
          // Create
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `export const create${capitalizedResourceName}DB = (new${capitalizedResourceName}) =>  "This route create a ${capitalizedResourceName} with value " + JSON.stringify(new${capitalizedResourceName});\n\n`
          );
          // Update
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `export const update${capitalizedResourceName}DB = (id, updated${capitalizedResourceName}) => "This route updated${capitalizedResourceName} with id " + id + " and new value " + JSON.stringify(updated${capitalizedResourceName});\n\n`
          );
          // Delete
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `export const delete${capitalizedResourceName}DB = (id) =>  "This route delete ${capitalizedResourceName} with id " + id;\n\n`
          );
        } else {
          // Create db file content
          // Get all
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `const getAll${capitalizedResourceName}sDB = () =>  "This route get all ${capitalizedResourceName}s";\n\n`
          );
          // Get by id
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `const get${capitalizedResourceName}DB = (id) =>  "This route get ${capitalizedResourceName} with id " + id;\n\n`
          );
          // Create
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `const create${capitalizedResourceName}DB = (new${capitalizedResourceName}) =>  "This route create a ${capitalizedResourceName} with value " + JSON.stringify(new${capitalizedResourceName});\n\n`
          );
          // Update
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `const update${capitalizedResourceName}DB = (id, updated${capitalizedResourceName}) => "This route updated${capitalizedResourceName} with id " + id + " and new value " + JSON.stringify(updated${capitalizedResourceName});\n\n`
          );
          // Delete
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `const delete${capitalizedResourceName}DB = (id) =>  "This route delete ${capitalizedResourceName} with id " + id;\n\n`
          );
          // Exports
          appendFileSync(
            `db/${kebabCaseResourceName}.db.js`,
            `module.exports = {\n  getAll${capitalizedResourceName}sDB,\n  get${capitalizedResourceName}DB,\n  create${capitalizedResourceName}DB,\n  update${capitalizedResourceName}DB,\n  delete${capitalizedResourceName}DB\n};\n\n`
          );
        }

        // Create controller
        if (moduleType === 'module') {
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `import { getAll${capitalizedResourceName}sDB, get${capitalizedResourceName}DB, create${capitalizedResourceName}DB, update${capitalizedResourceName}DB, delete${capitalizedResourceName}DB } from "../db/${kebabCaseResourceName}.db.js";\n\n`
          );
        } else {
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const { getAll${capitalizedResourceName}sDB, get${capitalizedResourceName}DB, create${capitalizedResourceName}DB, update${capitalizedResourceName}DB, delete${capitalizedResourceName}DB } = require("../db/${kebabCaseResourceName}.db.js");\n\n`
          );
        }

        if (moduleType === 'module') {
          // Create controller file content
          // Get all
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `export const getAll${capitalizedResourceName}s = (req, res) => getAll${capitalizedResourceName}sDB().then((data) => res.status(200).send(data));\n\n`
          );
          // Get by id
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `export const get${capitalizedResourceName} = (req, res) => get${capitalizedResourceName}DB(req.params.id).then((data) => res.status(200).send(data));\n\n`
          );
          // Create
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `export const create${capitalizedResourceName} = (req, res) => create${capitalizedResourceName}DB(req.body).then((data) => res.status(201).send(data));\n\n`
          );
          // Update
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `export const update${capitalizedResourceName} = (req, res) => update${capitalizedResourceName}DB(req.params.id, req.body).then((data) => res.status(200).send(data));\n\n`
          );
          // Delete
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `export const delete${capitalizedResourceName} = (req, res) => delete${capitalizedResourceName}DB(req.params.id).then(() => res.status(204).send());\n\n`
          );
        } else {
          // Create controller file content
          // Get all
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const getAll${capitalizedResourceName}s = (req, res) => getAll${capitalizedResourceName}sDB().then((data) => res.status(200).send(data));\n\n`
          );
          // Get by id
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const get${capitalizedResourceName} = (req, res) => get${capitalizedResourceName}DB(req.params.id).then((data) => res.status(200).send(data));\n\n`
          );
          // Create
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const create${capitalizedResourceName} = (req, res) => create${capitalizedResourceName}DB(req.body).then((data) => res.status(201).send(data));\n\n`
          );
          // Update
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const update${capitalizedResourceName} = (req, res) => update${capitalizedResourceName}DB(req.params.id, req.body).then((data) => res.status(200).send(data));\n\n`
          );
          // Delete
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `const delete${capitalizedResourceName} = (req, res) => delete${capitalizedResourceName}DB(req.params.id).then(() => res.status(204).send());\n\n`
          );
          // Export
          appendFileSync(
            `controllers/${kebabCaseResourceName}.controller.js`,
            `module.exports = {\n  getAll${capitalizedResourceName}s,\n  get${capitalizedResourceName},\n  create${capitalizedResourceName},\n  update${capitalizedResourceName},\n  delete${capitalizedResourceName}\n};\n\n`
          );
        }
      }
      break;
    default:
      console.log('Invalid mode');
  }
}

if (require.main === module) {
  main();
}
