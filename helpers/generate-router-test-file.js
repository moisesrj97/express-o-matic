import { appendFileSync, writeFileSync } from 'fs';

const main = (
  dependencies,
  dbExtract,
  moduleType,
  kebabCaseResourceName,
  capitalizedResourceName
) => {
  if (dependencies.hasOwnProperty('jest')) {
    writeFileSync(
      `controllers/${kebabCaseResourceName}.controller.test.js`,
      ''
    );
    if (dbExtract) {
      writeFileSync(`db/${kebabCaseResourceName}.db.test.js`, '');
    }
  }

  if (
    dependencies.hasOwnProperty('jest') ||
    dependencies.hasOwnProperty('supertest')
  ) {
    if (moduleType === 'ES6 Modules') {
      appendFileSync(
        `routes/${kebabCaseResourceName}.router.test.js`,
        `import { app, server } from '../index.js';
import request from 'supertest';


`
      );
    } else {
      appendFileSync(
        `routes/${kebabCaseResourceName}.router.test.js`,
        `const { app, server } = require('../index.js');
const request = require('supertest');

`
      );
    }
    appendFileSync(
      `routes/${kebabCaseResourceName}.router.test.js`,
      `describe('Given the express application', () => {
  afterEach(() => {
    server.close();
  });
  describe('When GET /${kebabCaseResourceName}s', () => {
    test('It returns Hello World', async () => {
      const res = await request(app).get('/${kebabCaseResourceName}s');
      expect(res.status).toBe(200);
      expect(res.text).toBe('This route get all ${capitalizedResourceName}s');
    });
  });
  describe('When GET /${kebabCaseResourceName}s/:id', () => {
    test('It returns Hello World', async () => {
      const res = await request(app).get('/${kebabCaseResourceName}s/1');
      expect(res.status).toBe(200);
      expect(res.text).toBe("This route get ${capitalizedResourceName} with id " + 1);
    });
  });
  describe('When POST /${kebabCaseResourceName}s', () => {
    test('It returns Hello World', async () => {
      const res = await request(app)
        .post('/${kebabCaseResourceName}s/')
        .send({test: "test"})
        .set('Accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.text).toBe("This route create a ${capitalizedResourceName} with value " + JSON.stringify({test: "test"}));
    });
  });
  describe('When PUT /${kebabCaseResourceName}s/:id', () => {
    test('It returns Hello World', async () => {
      const res = await request(app)
        .put('/${kebabCaseResourceName}s/1')
        .send({test: "test"})
        .set('Accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.text).toBe("This route update ${capitalizedResourceName} with id " + 1+ " and value " + JSON.stringify({test: "test"}));
    });
  });
  describe('When DELETE /${kebabCaseResourceName}s/:id', () => {
    test('It returns Hello World', async () => {
      const res = await request(app).delete('/${kebabCaseResourceName}s/1');
      expect(res.status).toBe(200);
      expect(res.text).toBe("This route delete ${capitalizedResourceName} with id " + 1);
    });
  });
});
`
    );
  }
};

export default main;
