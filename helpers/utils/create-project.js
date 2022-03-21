import { execSync } from 'child_process';
import changePackageJsonDescription from '../change-package-json-description.js';

const main = () => {
  // Initialize the npm project
  execSync('npm init -y');

  // Add the express-o-matic package.json description
  changePackageJsonDescription();
};

export default main;
