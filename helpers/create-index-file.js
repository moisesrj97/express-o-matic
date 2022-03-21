import { appendFileSync, existsSync, mkdirSync } from 'fs';

const main = (moduleType, middleWare, useTypeScript) => {
  const fileExtension = useTypeScript ? 'ts' : 'js';

  console.log('Creating index file...');

  if (!existsSync('src')) {
    mkdirSync('src');
  }

  if (moduleType === 'ES6 Modules' || useTypeScript) {
    // Create imports conditional on module type
    appendFileSync(
      `src/index.${fileExtension}`,
      `import express${
        useTypeScript
          ? ', { Request, Response, ErrorRequestHandler, NextFunction }'
          : ''
      } from 'express';\n`
    );
    middleWare.forEach((e) => {
      appendFileSync(
        `src/index.${fileExtension}`,
        `import ${e} from '${e}';\n`
      );
    });
  } else {
    appendFileSync(
      `src/index.${fileExtension}`,
      "const express = require('express');\n"
    );
    middleWare.forEach((e) => {
      appendFileSync(
        `src/index.${fileExtension}`,
        `const ${e} = require('${e}');\n`
      );
    });
  }

  // Create express app
  if (moduleType === 'ES6 Modules' || useTypeScript) {
    appendFileSync(
      `src/index.${fileExtension}`,
      `\nexport const app = express();\n\n`
    );
  } else {
    appendFileSync(
      `src/index.${fileExtension}`,
      `\nconst app = express();\n\n`
    );
  }

  appendFileSync(`src/index.${fileExtension}`, 'app.use(express.json());\n');
  middleWare.forEach((e) => {
    switch (e) {
      case 'morgan':
        appendFileSync(
          `src/index.${fileExtension}`,
          `app.use(morgan('dev'));\n`
        );
        break;
      default:
        appendFileSync(`src/index.${fileExtension}`, `app.use(${e}());\n`);
    }
  });
  appendFileSync(
    `src/index.${fileExtension}`,
    `
app.get("/", (req${useTypeScript ? ': Request' : ''}, res${
      useTypeScript ? ': Response' : ''
    }) => {
  res.status(200).send("Hello World!");
});
`
  );
  appendFileSync(
    `src/index.${fileExtension}`,
    `
app.use("/", (error${useTypeScript ? ': ErrorRequestHandler' : ''}, req${
      useTypeScript ? ': Request' : ''
    }, res${useTypeScript ? ': Response' : ''}, next${
      useTypeScript ? ': NextFunction' : ''
    }) => {
  res.status(500).send(error);
});

`
  );
  appendFileSync(
    `src/index.${fileExtension}`,
    'const port = process.env.PORT || 3000;\n\n'
  );
  if (moduleType === 'ES6 Modules' || useTypeScript) {
    appendFileSync(
      `src/index.${fileExtension}`,
      'export const server = app.listen(port, () => console.log(`Server running on port ${port}`));\n'
    );
  } else {
    appendFileSync(
      `src/index.${fileExtension}`,
      'const server = app.listen(port, () => console.log(`Server running on port ${port}`));\n\nmodule.exports = {app, server};\n\n'
    );
  }
};

export default main;
