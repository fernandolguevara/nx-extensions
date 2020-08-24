const { appRootPath } = require('@nrwl/workspace/src/utils/app-root');
const { execSync } = require('child_process');
const { copySync, removeSync } = require('fs-extra');
const { getPublishableLibNames, tmpProjPath } = require('./utils');

console.log('\nUpdating local plugins...');

const publishableLibNames = getPublishableLibNames();

execSync(`yarn nx run-many --target build --projects ${publishableLibNames}`);

removeSync(`${appRootPath}/node_modules/@nxext`);

copySync(`${appRootPath}/dist/packages`, `${appRootPath}/node_modules/@nxext`);

console.log('\nUpdate complete.');
