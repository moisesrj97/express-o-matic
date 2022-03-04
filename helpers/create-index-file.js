import { appendFileSync } from 'fs';

const main = (moduleType, middleWare) => {
  console.log('Creating index.js file...');
  if (moduleType === 'ES6 Modules') {
    // Create imports conditional on module type
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
  if (moduleType === 'ES6 Modules') {
    appendFileSync('index.js', `\nexport const app = express();\n\n`);
  } else {
    appendFileSync('index.js', `\nconst app = express();\n\n`);
  }

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
    `
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});
`
  );
  appendFileSync(
    'index.js',
    `
app.use("/", (error, req, res, next) => {
  res.status(500).send(error);
});

`
  );
  appendFileSync('index.js', 'const port = process.env.PORT || 3000;\n\n');
  if (moduleType === 'ES6 Modules') {
    appendFileSync(
      'index.js',
      'export const server = app.listen(port, () => console.log(`Server running on port ${port}`));\n'
    );
  } else {
    appendFileSync(
      'index.js',
      'const server = app.listen(port, () => console.log(`Server running on port ${port}`));\n\nmodule.exports = {app, server};\n\n'
    );
  }
};

export default main;
