import { appendFileSync, writeFileSync } from 'fs';

const main = (moduleType) => {
  if (moduleType === 'ES6 Modules') {
    appendFileSync(
      'e2e.test.js',
      `import { app, server } from './index.js';
import request from 'supertest';


`
    );
  } else {
    appendFileSync(
      'e2e.test.js',
      `const { app, server } = require('./index.js');
const request = require('supertest');

`
    );
  }
  appendFileSync(
    'e2e.test.js',
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
