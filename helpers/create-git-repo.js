import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

import gitIgnore from '../resources/git-ignore.js';

const main = () => {
  execSync('git init');
  writeFileSync('.gitignore', gitIgnore);
  execSync('git add .');
  execSync('git commit -m "Initial commit"');
};

export default main;
