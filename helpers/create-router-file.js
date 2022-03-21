import { existsSync, mkdirSync, appendFileSync } from 'fs';

const main = (
  moduleType,
  kebabCaseResourceName,
  capitalizedResourceName,
  useTypescript
) => {
  // Check if routes folder exists and create it if not
  if (!existsSync('src')) {
    mkdirSync('src');
  }

  if (!existsSync('src/routes')) {
    mkdirSync('src/routes');
  }

  // Import controllers conditionals on module type for router file
  if (moduleType === 'module' || useTypescript) {
    appendFileSync(
      `src/routes/${kebabCaseResourceName}.router.js`,
      `import express from 'express';
import { 
  getAll${capitalizedResourceName}s, 
  get${capitalizedResourceName}, 
  create${capitalizedResourceName}, 
  update${capitalizedResourceName}, 
  delete${capitalizedResourceName} 
} from '../controllers/${kebabCaseResourceName}.controller${
        useTypescript ? '' : '.js'
      }'

`
    );
  } else {
    appendFileSync(
      `src/routes/${kebabCaseResourceName}.router.js`,
      `const express = require('express');
   
const { 
  getAll${capitalizedResourceName}s, 
  get${capitalizedResourceName}, 
  create${capitalizedResourceName}, 
  update${capitalizedResourceName}, 
  delete${capitalizedResourceName} 
} = require('../controllers/${kebabCaseResourceName}.controller.js');

`
    );
  }

  // Create router file content
  appendFileSync(
    `src/routes/${kebabCaseResourceName}.router.js`,
    `const router = express.Router();\n\n`
  );
  appendFileSync(
    `src/routes/${kebabCaseResourceName}.router.js`,
    `router
  .get('/', getAll${capitalizedResourceName}s)
  .get('/:id', get${capitalizedResourceName})
  .post('/', create${capitalizedResourceName})
  .put('/:id', update${capitalizedResourceName})
  .delete('/:id', delete${capitalizedResourceName});
  
`
  );
  if (moduleType === 'module') {
    appendFileSync(
      `src/routes/${kebabCaseResourceName}.router.js`,
      `export default router;\n\n`
    );
  } else {
    appendFileSync(
      `src/routes/${kebabCaseResourceName}.router.js`,
      `module.exports = router;\n\n`
    );
  }
};

export default main;
