const { existsSync, mkdirSync, appendFileSync } = require('fs');

const main = (moduleType, kebabCaseResourceName, capitalizedResourceName) => {
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
};

module.exports = main;
