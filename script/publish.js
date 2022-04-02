// 这个文件也不用了用 changeset 了 好用 简单
import { prompt } from 'enquirer';
import minimist from 'minimist';
import semver from 'semver';
import fs from 'fs/promises';
import path from 'path';
import { execa } from 'execa';
import chalk from 'chalk';

const args = minimist(process.argv.slice(2));

const isDryRun = args.dry; // --dry

async function getPackages() {
  const packagesDir = path.resolve(__dirname, '../packages');
  const packages = await fs
    .readdir(packagesDir);
  const promiseArray = [];
  packages.forEach((item) => {
    const packageDir = path.resolve(__dirname, `../packages/${item}/package.json`);
    promiseArray.push(fs.readFile(packageDir, {
      encoding: 'utf-8',
    }).then((str) => {
      const pkgJson = JSON.parse(str);
      pkgJson.dir = item;
      return pkgJson;
    }).catch((e) => console.error(e)));
  });
  const pkgs = await Promise.all(promiseArray);
  return pkgs;
}

const run = (bin, rargs, opts = {}) => execa(bin, rargs, { stdio: 'inherit', ...opts });
const dryRun = async (bin, rargs, opts = {}) => console.log(chalk.blue(`[dryrun] ${bin} ${rargs.join(' ')}`), opts);
const runIfNotDry = isDryRun ? dryRun : run;
const step = (msg) => console.log(chalk.cyan(msg));

const versionIncrements = [
  'patch',
  'minor',
  'major',
];

async function main() {
  const pkgs = await getPackages();
  const pkgNames = [];
  const pkgMap = {};
  pkgs.forEach((item) => {
    pkgNames.push(item.name);
    pkgMap[item.name] = item;
  });
  const { pkgName } = await prompt({
    type: 'select',
    name: 'pkgName',
    message: 'Select packages',
    choices: pkgNames,
  });
  const { dir, version: currentVersion } = pkgMap[pkgName];

  const inc = (i) => semver.inc(currentVersion, i);
  async function publickPakcage(version) {
    const packageDir = path.resolve(__dirname, `../packages/${dir}`);
    await runIfNotDry('npm', ['set', 'registry', 'https://registry.npmjs.org/']);
    await runIfNotDry('npm', ['version', version], { cwd: packageDir });
    await runIfNotDry('pnpm', ['publish', '--access', 'public', '--filter', pkgName, '-no-git-checks']);
  }

  const { release } = await prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map((i) => `${i} (${inc(i)})`).concat(['custom']),
  });

  let targetVersion = currentVersion;
  if (release === 'custom') {
    targetVersion = (await prompt({
      type: 'input',
      name: 'version',
      message: 'Input custom version',
      initial: currentVersion,
    })).version;
  } else {
    // eslint-disable-next-line prefer-destructuring
    targetVersion = release.match(/\((.*)\)/)[1];
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }
  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!yes) {
    return;
  }

  step(`\nBuild ${pkgName} package`);

  await run('pnpm', ['run', `build:${dir}`]);

  step(`\nPublish ${pkgName} package`);

  await publickPakcage(targetVersion);
}

main();
