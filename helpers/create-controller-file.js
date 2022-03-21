import { existsSync, mkdirSync, appendFileSync } from 'fs';

const main = (
  dbExtract,
  moduleType,
  kebabCaseResourceName,
  capitalizedResourceName,
  useTypescript
) => {
  // Check if controllers folder exists and create it if not
  if (!existsSync('src')) {
    mkdirSync('src');
  }

  if (!existsSync('src/controllers')) {
    mkdirSync('src/controllers');
  }

  if (useTypescript) {
    appendFileSync(
      `src/controllers/${kebabCaseResourceName}.controller.js`,
      `import { Request, Response } from 'express';`
    );
  }

  // Check if database connection extraction is enabled
  if (!dbExtract) {
    // If it is not enabled, controllers will handle all the logic
    // Create controller file content
    if (moduleType === 'module' || useTypescript) {
      // If module type is ES6, use ES6 syntax for exports
      appendFileSync(
        `src/controllers/${kebabCaseResourceName}.controller.js`,
        `export const getAll${capitalizedResourceName}s = (req${
          useTypescript ? ': Request' : ''
        }, res${useTypescript ? ': Response' : ''}) => {
  res
    .status(200)
    .send("This route get all ${capitalizedResourceName}s");
};

export const get${capitalizedResourceName} = (req${
          useTypescript ? ': Request' : ''
        }, res${useTypescript ? ': Response' : ''}) => {
  res
    .status(200)
    .send("This route get ${capitalizedResourceName} with id " + req.params.id);
};

export const create${capitalizedResourceName} = (req${
          useTypescript ? ': Request' : ''
        }, res${useTypescript ? ': Response' : ''}) => {
  res
    .status(200)
    .send("This route create a ${capitalizedResourceName} with value " + JSON.stringify(req.body));
};

export const update${capitalizedResourceName} = (req${
          useTypescript ? ': Request' : ''
        }, res${useTypescript ? ': Response' : ''}) => {
  res
    .status(200)
    .send("This route update ${capitalizedResourceName} with id " + req.params.id + " and value " + JSON.stringify(req.body));
};

export const delete${capitalizedResourceName} = (req${
          useTypescript ? ': Request' : ''
        }, res${useTypescript ? ': Response' : ''}) => {
  res
    .status(200)
    .send("This route delete ${capitalizedResourceName} with id " + req.params.id);
};

`
      );
    } else {
      // If module type is commonjs, use commonjs syntax for exports
      appendFileSync(
        `src/controllers/${kebabCaseResourceName}.controller.js`,
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
    if (!existsSync('src')) {
      mkdirSync('src');
    }

    if (!existsSync('src/db')) {
      mkdirSync('src/db');
    }

    if (moduleType === 'module') {
      // Create db file content with es6 exports
      appendFileSync(
        `src/db/${kebabCaseResourceName}.db.js`,
        `export const getAll${capitalizedResourceName}sDB = async ()${
          useTypescript ? 'string' : ''
        } => {
  return "This route get all ${capitalizedResourceName}s";
};

export const get${capitalizedResourceName}DB = async (id)${
          useTypescript ? 'string' : ''
        } => {
  return "This route get ${capitalizedResourceName} with id " + id;
};

export const create${capitalizedResourceName}DB = async (new${capitalizedResourceName})${
          useTypescript ? 'string' : ''
        } => {
  return "This route create a ${capitalizedResourceName} with value " + JSON.stringify(new${capitalizedResourceName});
};

export const update${capitalizedResourceName}DB = async (id, updated${capitalizedResourceName})${
          useTypescript ? 'string' : ''
        } => {
  return "This route update ${capitalizedResourceName} with id " + id + " and value " + JSON.stringify(updated${capitalizedResourceName});
};

export const delete${capitalizedResourceName}DB = async (id)${
          useTypescript ? 'string' : ''
        } => {
  return "This route delete ${capitalizedResourceName} with id " + id;
};
`
      );
    } else {
      // Create db file content with commonjs exports
      appendFileSync(
        `src/db/${kebabCaseResourceName}.db.js`,
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
  return "This route update ${capitalizedResourceName} with id " + id + " and value " + JSON.stringify(updated${capitalizedResourceName});
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
    if (moduleType === 'module' || useTypescript) {
      appendFileSync(
        `src/controllers/${kebabCaseResourceName}.controller.js`,
        `import {
  getAll${capitalizedResourceName}sDB,
  get${capitalizedResourceName}DB, 
  create${capitalizedResourceName}DB, 
  update${capitalizedResourceName}DB, 
  delete${capitalizedResourceName}DB, 
} from "../db/${kebabCaseResourceName}.db${useTypescript ? '' : '.js'}";\n\n`
      );
    } else {
      appendFileSync(
        `src/controllers/${kebabCaseResourceName}.controller.js`,
        `const { 
  getAll${capitalizedResourceName}sDB,
  get${capitalizedResourceName}DB, 
  create${capitalizedResourceName}DB, 
  update${capitalizedResourceName}DB, 
  delete${capitalizedResourceName}DB, 
} = require("../db/${kebabCaseResourceName}.db.js");\n\n`
      );
    }

    if (moduleType === 'module' || useTypescript) {
      // Create controller file content with es6 exports
      appendFileSync(
        `src/controllers/${kebabCaseResourceName}.controller.js`,
        `export const getAll${capitalizedResourceName}s = (req${
          useTypescript ? ': Request' : ''
        }, res${useTypescript ? ': Response' : ''}) => {
  getAll${capitalizedResourceName}sDB()
    .then((data) => res.status(200).send(data));
};

export const get${capitalizedResourceName} = (req${
          useTypescript ? ': Request' : ''
        }, res${useTypescript ? ': Response' : ''}) => {
  get${capitalizedResourceName}DB(req.params.id)
    .then((data) => res.status(200).send(data));
};

export const create${capitalizedResourceName} = (req${
          useTypescript ? ': Request' : ''
        }, res${useTypescript ? ': Response' : ''}) => {
  create${capitalizedResourceName}DB(req.body)
    .then((data) => res.status(200).send(data));
};

export const update${capitalizedResourceName} = (req${
          useTypescript ? ': Request' : ''
        }, res${useTypescript ? ': Response' : ''}) => {
  update${capitalizedResourceName}DB(req.params.id, req.body)
    .then((data) => res.status(200).send(data));
};

export const delete${capitalizedResourceName} = (req${
          useTypescript ? ': Request' : ''
        }, res${useTypescript ? ': Response' : ''}) => {
  delete${capitalizedResourceName}DB(req.params.id)
    .then(() => res.status(200).send("This route delete ${capitalizedResourceName} with id " + req.params.id));
};

`
      );
    } else {
      // Create controller file content with commonjs exports
      appendFileSync(
        `src/controllers/${kebabCaseResourceName}.controller.js`,
        `const getAll${capitalizedResourceName}s = (req, res) => {
  getAll${capitalizedResourceName}sDB().then((data) => res.status(200).send(data));
};

const get${capitalizedResourceName} = (req, res) => {
  get${capitalizedResourceName}DB(req.params.id).then((data) => res.status(200).send(data));
};

const create${capitalizedResourceName} = (req, res) => {
  create${capitalizedResourceName}DB(req.body).then((data) => res.status(200).send(data));
};

const update${capitalizedResourceName} = (req, res) => {
  update${capitalizedResourceName}DB(req.params.id, req.body).then((data) => res.status(200).send(data));
};

const delete${capitalizedResourceName} = (req, res) => {
  delete${capitalizedResourceName}DB(req.params.id).then(() => res.status(200).send("This route delete ${capitalizedResourceName} with id " + req.params.id));
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
