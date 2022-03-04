import { existsSync, mkdirSync, appendFileSync } from 'fs';

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

  // Check if database connection extraction is enabled
  if (!dbExtract) {
    // If it is not enabled, controllers will handle all the logic
    // Create controller file content
    if (moduleType === 'module') {
      // If module type is ES6, use ES6 syntax for exports
      appendFileSync(
        `controllers/${kebabCaseResourceName}.controller.js`,
        `export const getAll${capitalizedResourceName}s = (req, res) => {
  res
    .status(200)
    .send("This route get all ${capitalizedResourceName}s");
};

export const get${capitalizedResourceName} = (req, res) => {
  res
    .status(200)
    .send("This route get ${capitalizedResourceName} with id " + req.params.id);
};

export const create${capitalizedResourceName} = (req, res) => {
  res
    .status(200)
    .send("This route create a ${capitalizedResourceName} with value " + JSON.stringify(req.body));
};

export const update${capitalizedResourceName} = (req, res) => {
  res
    .status(200)
    .send("This route update ${capitalizedResourceName} with id " + req.params.id + " and value " + JSON.stringify(req.body));
};

const delete${capitalizedResourceName} = (req, res) => {
  res
    .status(200)
    .send("This route delete ${capitalizedResourceName} with id " + req.params.id);
};

`
      );
    } else {
      // If module type is commonjs, use commonjs syntax for exports
      appendFileSync(
        `controllers/${kebabCaseResourceName}.controller.js`,
        `const getAll${capitalizedResourceName}s = (req, res) => {
  res
    .status(200)
    .send("This route get all ${capitalizedResourceName}s");
};

const get${capitalizedResourceName} = (req, res) => {
  res
    .status(200)
    .send("This route get ${capitalizedResourceName} with id " + req.params.id);
};

const create${capitalizedResourceName} = (req, res) => {
  res
    .status(200)
    .send("This route create a ${capitalizedResourceName} with value " + JSON.stringify(req.body));
};

const update${capitalizedResourceName} = (req, res) => {
  res
    .status(200)
    .send("This route update ${capitalizedResourceName} with id " + req.params.id + " and value " + JSON.stringify(req.body));
};

const delete${capitalizedResourceName} = (req, res) => {
  res
    .status(200)
    .send("This route delete ${capitalizedResourceName} with id " + req.params.id);
};

module.exports = {
  getAll${capitalizedResourceName}s,
  get${capitalizedResourceName},
  create${capitalizedResourceName},
  update${capitalizedResourceName},
  delete${capitalizedResourceName},
};

`
      );
    }
  } else {
    // If db base connection file is enabled, db files will handle
    // the connection and return info to the controllers

    // Check if db folder exists and create it if not
    if (!existsSync('db')) {
      mkdirSync('db');
    }

    if (moduleType === 'module') {
      // Create db file content with es6 exports
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `export const getAll${capitalizedResourceName}sDB = async () => {
  return "This route get all ${capitalizedResourceName}s";
};

export const get${capitalizedResourceName}DB = async (id) => {
  return "This route get ${capitalizedResourceName} with id " + id;
};

export const create${capitalizedResourceName}DB = async (new${capitalizedResourceName}) => {
  return "This route create a ${capitalizedResourceName} with value " + JSON.stringify(new${capitalizedResourceName});
};

export const update${capitalizedResourceName}DB = async (id, updated${capitalizedResourceName}) => {
  return "This route updated${capitalizedResourceName} with id " + id + " and new value " + JSON.stringify(updated${capitalizedResourceName});
};

export const delete${capitalizedResourceName}DB = async (id) => {
  return "This route delete ${capitalizedResourceName} with id " + id;
};
`
      );
    } else {
      // Create db file content with commonjs exports
      appendFileSync(
        `db/${kebabCaseResourceName}.db.js`,
        `const getAll${capitalizedResourceName}sDB = async () => {
  return "This route get all ${capitalizedResourceName}s";
};

const get${capitalizedResourceName}DB = async (id) => {
  return "This route get ${capitalizedResourceName} with id " + id;
};

const create${capitalizedResourceName}DB = async (new${capitalizedResourceName}) => {
  return "This route create a ${capitalizedResourceName} with value " + JSON.stringify(new${capitalizedResourceName});
};

const update${capitalizedResourceName}DB = async (id, updated${capitalizedResourceName}) => {
  return "This route updated${capitalizedResourceName} with id " + id + " and new value " + JSON.stringify(updated${capitalizedResourceName});
};

const delete${capitalizedResourceName}DB = async (id) => {
  return "This route delete ${capitalizedResourceName} with id " + id;
};

module.exports = {
  getAll${capitalizedResourceName}sDB,
  get${capitalizedResourceName}DB,
  create${capitalizedResourceName}DB,
  update${capitalizedResourceName}DB,
  delete${capitalizedResourceName}DB,
};

`
      );
    }

    // Create controller file
    // Imports depending of module type
    if (moduleType === 'module') {
      appendFileSync(
        `controllers/${kebabCaseResourceName}.controller.js`,
        `import {
  getAll${capitalizedResourceName}sDB,
  get${capitalizedResourceName}DB, 
  create${capitalizedResourceName}DB, 
  update${capitalizedResourceName}DB, 
  delete${capitalizedResourceName}DB, 
} from "../db/${kebabCaseResourceName}.db.js";\n\n`
      );
    } else {
      appendFileSync(
        `controllers/${kebabCaseResourceName}.controller.js`,
        `const { 
  getAll${capitalizedResourceName}sDB,
  get${capitalizedResourceName}DB, 
  create${capitalizedResourceName}DB, 
  update${capitalizedResourceName}DB, 
  delete${capitalizedResourceName}DB, 
} = require("../db/${kebabCaseResourceName}.db.js");\n\n`
      );
    }

    if (moduleType === 'module') {
      // Create controller file content with es6 exports
      appendFileSync(
        `controllers/${kebabCaseResourceName}.controller.js`,
        `export const getAll${capitalizedResourceName}s = (req, res) => {
  getAll${capitalizedResourceName}sDB()
    .then((data) => res.status(200).send(data));
};

export const get${capitalizedResourceName} = (req, res) => {
  get${capitalizedResourceName}DB(req.params.id)
    .then((data) => res.status(200).send(data));
};

export const create${capitalizedResourceName} = (req, res) => {
  create${capitalizedResourceName}DB(req.body)
    .then((data) => res.status(201).send(data));
};

export const update${capitalizedResourceName} = (req, res) => {
  update${capitalizedResourceName}DB(req.params.id, req.body)
    .then((data) => res.status(200).send(data));
};

export const delete${capitalizedResourceName} = (req, res) => {
  delete${capitalizedResourceName}DB(req.params.id)
    .then(() => res.status(204).send());
};

`
      );
    } else {
      // Create controller file content with commonjs exports
      appendFileSync(
        `controllers/${kebabCaseResourceName}.controller.js`,
        `const getAll${capitalizedResourceName}s = (req, res) => {
  getAll${capitalizedResourceName}sDB().then((data) => res.status(200).send(data));
};

const get${capitalizedResourceName} = (req, res) => {
  get${capitalizedResourceName}DB(req.params.id).then((data) => res.status(200).send(data));
};

const create${capitalizedResourceName} = (req, res) => {
  create${capitalizedResourceName}DB(req.body).then((data) => res.status(201).send(data));
};

const update${capitalizedResourceName} = (req, res) => {
  update${capitalizedResourceName}DB(req.params.id, req.body).then((data) => res.status(200).send(data));
};

const delete${capitalizedResourceName} = (req, res) => {
  delete${capitalizedResourceName}DB(req.params.id).then(() => res.status(204).send());
};

module.exports = {
  getAll${capitalizedResourceName}s,
  get${capitalizedResourceName},
  create${capitalizedResourceName},
  update${capitalizedResourceName},
  delete${capitalizedResourceName},
};

`
      );
    }
  }
};

export default main;
