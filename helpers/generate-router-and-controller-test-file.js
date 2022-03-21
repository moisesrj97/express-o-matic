import { appendFileSync } from 'fs';

const main = (
  dependencies,
  dbExtract,
  moduleType,
  kebabCaseResourceName,
  capitalizedResourceName,
  useTypescript
) => {
  const fileExtension = useTypescript ? 'ts' : 'js';
  if (dependencies.hasOwnProperty('jest')) {
    // Controller
    if (moduleType === 'ES6 Modules' || useTypescript) {
      appendFileSync(
        `src/controllers/${kebabCaseResourceName}.controller.test.${fileExtension}`,
        `import {
  getAll${capitalizedResourceName}s, 
  get${capitalizedResourceName}, 
  create${capitalizedResourceName}, 
  update${capitalizedResourceName}, 
  delete${capitalizedResourceName},
} from '../controllers/${kebabCaseResourceName}.controller${
          useTypescript ? '' : '.js'
        }';
${
  dbExtract
    ? `
import {
  getAll${capitalizedResourceName}sDB, 
  get${capitalizedResourceName}DB, 
  create${capitalizedResourceName}DB, 
  update${capitalizedResourceName}DB, 
  delete${capitalizedResourceName}DB,
} from '../db/${kebabCaseResourceName}.db${useTypescript ? '' : '.js'}';

`
    : ''
}
${
  dbExtract
    ? `jest.mock("../db/${kebabCaseResourceName}.db${
        useTypescript ? '' : '.js'
      }")`
    : ''
}


`
      );
    } else {
      appendFileSync(
        `src/controllers/${kebabCaseResourceName}.controller.test.js`,
        `const {
  getAll${capitalizedResourceName}s, 
  get${capitalizedResourceName}, 
  create${capitalizedResourceName}, 
  update${capitalizedResourceName}, 
  delete${capitalizedResourceName},
} = require ('../controllers/${kebabCaseResourceName}.controller.js');
${
  dbExtract
    ? `
const {
  getAll${capitalizedResourceName}sDB, 
  get${capitalizedResourceName}DB, 
  create${capitalizedResourceName}DB, 
  update${capitalizedResourceName}DB, 
  delete${capitalizedResourceName}DB,
} = require ('../db/${kebabCaseResourceName}.db.js');

`
    : ''
}
${dbExtract ? `jest.mock("../db/${kebabCaseResourceName}.db.js")` : ''}


`
      );
    }

    appendFileSync(
      `src/controllers/${kebabCaseResourceName}.controller.test.${fileExtension}`,
      `describe('Given the controller', () => {
  let req${useTypescript ? ': any' : ''};
  let res${useTypescript ? ': any' : ''};
  let next${useTypescript ? ': any' : ''};

  ${
    dbExtract && useTypescript
      ? `
  
  const mockedGetAll${capitalizedResourceName}sDB = getAll${capitalizedResourceName}sDB as jest.MockedFunction<typeof getAll${capitalizedResourceName}sDB>;
  const mockedGet${capitalizedResourceName}DB = get${capitalizedResourceName}DB as jest.MockedFunction<typeof get${capitalizedResourceName}DB>;
  const mockedCreate${capitalizedResourceName}DB = create${capitalizedResourceName}DB as jest.MockedFunction<typeof create${capitalizedResourceName}DB>;
  const mockedUpdate${capitalizedResourceName}DB = update${capitalizedResourceName}DB as jest.MockedFunction<typeof update${capitalizedResourceName}DB>;
  const mockedDelete${capitalizedResourceName}DB = delete${capitalizedResourceName}DB as jest.MockedFunction<typeof delete${capitalizedResourceName}DB>;
`
      : ''
  }
  beforeEach(() => {
      req = { params: {} };
      res = {};
      res.send = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.status = jest.fn().mockReturnValue(res);
      next = jest.fn();
      ${
        dbExtract && useTypescript
          ? `
      mockedGetAll${capitalizedResourceName}sDB.mockResolvedValue("This route get all ${capitalizedResourceName}s");
      mockedGet${capitalizedResourceName}DB.mockResolvedValue("This route get ${capitalizedResourceName} with id " + 1);
      mockedCreate${capitalizedResourceName}DB.mockResolvedValue("This route create a ${capitalizedResourceName} with value " + JSON.stringify({test: "test"}));
      mockedUpdate${capitalizedResourceName}DB.mockResolvedValue("This route update ${capitalizedResourceName} with id " + 1+ " and value " + JSON.stringify({test: "test"}));
      mockedDelete${capitalizedResourceName}DB.mockResolvedValue("This route delete ${capitalizedResourceName} with id " + 1);
      
      `
          : ''
      }
      ${
        dbExtract && !useTypescript
          ? `
      getAll${capitalizedResourceName}sDB.mockResolvedValue("This route get all ${capitalizedResourceName}s");
      get${capitalizedResourceName}DB.mockResolvedValue("This route get ${capitalizedResourceName} with id " + 1);
      create${capitalizedResourceName}DB.mockResolvedValue("This route create a ${capitalizedResourceName} with value " + JSON.stringify({test: "test"}));
      update${capitalizedResourceName}DB.mockResolvedValue("This route update ${capitalizedResourceName} with id " + 1+ " and value " + JSON.stringify({test: "test"}));
      delete${capitalizedResourceName}DB.mockResolvedValue("This route delete ${capitalizedResourceName} with id " + 1);
      
      `
          : ''
      }
  });

  describe('When getAll is called', () => {
    test('It should return data', ${dbExtract ? 'async ' : ''}() => {
      res = {status: () => res, send: jest.fn()};

      ${dbExtract ? 'await ' : ''}getAll${capitalizedResourceName}s(req, res);
      expect(res.send).toHaveBeenCalledWith("This route get all ${capitalizedResourceName}s");
    });
  });

  describe('When get is called', () => {
    test('It should return data', ${dbExtract ? 'async ' : ''}() => {
      req = {params: {id: 1}};
      res = {status: () => res, send: jest.fn()};

      ${dbExtract ? 'await ' : ''}get${capitalizedResourceName}(req, res);
      expect(res.send).toHaveBeenCalledWith("This route get ${capitalizedResourceName} with id " + 1);
    });
  });

  describe('When create is called', () => {
    test('It should return data', ${dbExtract ? 'async ' : ''}() => {
      req = {body: {test: "test"}};
      res = {status: () => res, send: jest.fn()};

      ${dbExtract ? 'await ' : ''}create${capitalizedResourceName}(req, res);
      expect(res.send).toHaveBeenCalledWith("This route create a ${capitalizedResourceName} with value " + JSON.stringify({test: "test"}));
    });
  });

  describe('When update is called', () => {
    test('It should return data', ${dbExtract ? 'async ' : ''}() => {
      req = {params: {id: 1}, body: {test: "test"}};
      res = {status: () => res, send: jest.fn()};

      ${dbExtract ? 'await ' : ''}update${capitalizedResourceName}(req, res);
      expect(res.send).toHaveBeenCalledWith("This route update ${capitalizedResourceName} with id " + 1+ " and value " + JSON.stringify({test: "test"}));
    });
  });

  describe('When delete is called', () => {
    test('It should return data', ${dbExtract ? 'async ' : ''}() => {
      req = {params: {id: 1}};
      res = {status: () => res, send: jest.fn()};

      ${dbExtract ? 'await ' : ''}delete${capitalizedResourceName}(req, res);
      expect(res.send).toHaveBeenCalledWith("This route delete ${capitalizedResourceName} with id " + 1);
    });
  });
});
        
`
    );

    if (dbExtract) {
      // DB
      if (moduleType === 'ES6 Modules' || useTypescript) {
        appendFileSync(
          `src/db/${kebabCaseResourceName}.db.test.${fileExtension}`,
          `import {
  getAll${capitalizedResourceName}sDB, 
  get${capitalizedResourceName}DB, 
  create${capitalizedResourceName}DB, 
  update${capitalizedResourceName}DB, 
  delete${capitalizedResourceName}DB,
} from '../db/${kebabCaseResourceName}.db${useTypescript ? '' : '.js'}';


`
        );
      } else {
        appendFileSync(
          `src/db/${kebabCaseResourceName}.db.test.js`,
          `const {
  getAll${capitalizedResourceName}sDB, 
  get${capitalizedResourceName}DB, 
  create${capitalizedResourceName}DB, 
  update${capitalizedResourceName}DB, 
  delete${capitalizedResourceName}DB,
} = require ('../db/${kebabCaseResourceName}.db.js');


`
        );
      }
      appendFileSync(
        `src/db/${kebabCaseResourceName}.db.test.${fileExtension}`,
        `describe('Given the db connection', () => {
  describe('When getAll is called', () => {
    test('It should return data',${dbExtract ? ' async' : ''} () => {
      expect(${
        dbExtract ? 'await ' : ''
      }getAll${capitalizedResourceName}sDB()).toBe("This route get all ${capitalizedResourceName}s");
    });
  });
  describe('When get is called', () => {
    test('It should return data',${dbExtract ? ' async' : ''} () => {
      expect(${
        dbExtract ? 'await ' : ''
      }get${capitalizedResourceName}DB(1)).toBe("This route get ${capitalizedResourceName} with id " + 1);
    });
  });
  describe('When create is called', () => {
    test('It should return data',${dbExtract ? ' async' : ''} () => {
      expect(${
        dbExtract ? 'await ' : ''
      }create${capitalizedResourceName}DB({test: "test"})).toBe("This route create a ${capitalizedResourceName} with value " + JSON.stringify({test: "test"}));
    });
  });
  describe('When update is called', () => {
    test('It should return data',${dbExtract ? ' async' : ''} () => {
      expect(${
        dbExtract ? 'await ' : ''
      }update${capitalizedResourceName}DB(1, {test: "test"})).toBe("This route update ${capitalizedResourceName} with id " + 1+ " and value " + JSON.stringify({test: "test"}));
    });
  });
  describe('When delete is called', () => {
    test('It should return data',${dbExtract ? ' async' : ''} () => {
      expect(${
        dbExtract ? 'await ' : ''
      }delete${capitalizedResourceName}DB(1)).toBe("This route delete ${capitalizedResourceName} with id " + 1);
    });
  });
});
        
`
      );
    }
  }

  if (
    dependencies.hasOwnProperty('jest') ||
    dependencies.hasOwnProperty('supertest')
  ) {
    if (moduleType === 'ES6 Modules' || useTypescript) {
      appendFileSync(
        `src/routes/${kebabCaseResourceName}.router.test.${fileExtension}`,
        `import { app, server } from '../index${useTypescript ? '' : '.js'}';
import request from 'supertest';


`
      );
    } else {
      appendFileSync(
        `src/routes/${kebabCaseResourceName}.router.test.js`,
        `const { app, server } = require('../index.js');
const request = require('supertest');

`
      );
    }
    appendFileSync(
      `src/routes/${kebabCaseResourceName}.router.test.${fileExtension}`,
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
