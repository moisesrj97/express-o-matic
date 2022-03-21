import { appendFileSync, writeFileSync } from 'fs';

const main = (moduleType, useTypeScript) => {
  const fileExtension = useTypeScript ? 'ts' : 'js';

  if (moduleType === 'ES6 Modules' || useTypeScript) {
    appendFileSync(
      `src/e2e.test.${fileExtension}`,
      `import { app, server } from './index${useTypeScript ? '' : '.js'}';
import request from 'supertest';


`
    );
  } else {
    appendFileSync(
      `src/e2e.test.${fileExtension}`,
      `const { app, server } = require('./index.js');
const request = require('supertest');

`
    );
  }
  appendFileSync(
    `src/e2e.test.${fileExtension}`,
    `describe('Given the express application', () => {
  afterEach(() => {
    server.close();
  });
  describe('When GET /', () => {
    test('It returns Hello World', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toBe('Hello World!');
    });
  });
});
`
  );
};

export default main;
