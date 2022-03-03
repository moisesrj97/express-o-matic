const { existsSync, mkdirSync, appendFileSync } = require('fs');

const main = (
  dbExtract,
  moduleType,
  kebabCaseResourceName,
  capitalizedResourceName
) => {
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
        `export const getAll${capitalizedResourceName}sDB = async () => "This route get all ${capitalizedResourceName}s";\n\n`
      );
      // Get by id
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `export const get${capitalizedResourceName}DB = async (id) =>  "This route get ${capitalizedResourceName} with id " + id;\n\n`
      );
      // Create
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `export const create${capitalizedResourceName}DB = async (new${capitalizedResourceName}) =>  "This route create a ${capitalizedResourceName} with value " + JSON.stringify(new${capitalizedResourceName});\n\n`
      );
      // Update
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `export const update${capitalizedResourceName}DB = async (id, updated${capitalizedResourceName}) => "This route updated${capitalizedResourceName} with id " + id + " and new value " + JSON.stringify(updated${capitalizedResourceName});\n\n`
      );
      // Delete
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `export const delete${capitalizedResourceName}DB = async (id) =>  "This route delete ${capitalizedResourceName} with id " + id;\n\n`
      );
    } else {
      // Create db file content
      // Get all
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `const getAll${capitalizedResourceName}sDB = async () => "This route get all ${capitalizedResourceName}s";\n\n`
      );
      // Get by id
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `const get${capitalizedResourceName}DB = async (id) => "This route get ${capitalizedResourceName} with id " + id;\n\n`
      );
      // Create
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `const create${capitalizedResourceName}DB = async (new${capitalizedResourceName}) =>  "This route create a ${capitalizedResourceName} with value " + JSON.stringify(new${capitalizedResourceName});\n\n`
      );
      // Update
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `const update${capitalizedResourceName}DB = async (id, updated${capitalizedResourceName}) => "This route updated${capitalizedResourceName} with id " + id + " and new value " + JSON.stringify(updated${capitalizedResourceName});\n\n`
      );
      // Delete
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `const delete${capitalizedResourceName}DB = async (id) => "This route delete ${capitalizedResourceName} with id " + id;\n\n`
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
};

module.exports = main;
