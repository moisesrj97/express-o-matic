import { execSync } from 'child_process';

const main = (dependencies) => {
  console.log('Installing dependencies...');
  execSync(`npm i express ${dependencies.join(' ')}`, { stdio: 'inherit' });
  execSync(`npm i -D nodemon`, { stdio: 'inherit' });
};

export default main;
