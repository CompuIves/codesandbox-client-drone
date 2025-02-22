import isImage from '@codesandbox/common/lib/utils/is-image';

const svgRegex = /\.svg$/;

type regexCasesMap = {
  markdown: RegExp;
  markojs: RegExp;
  yaml: RegExp;
  react: RegExp;
  reason: RegExp;
  sass: RegExp;
  javascript: RegExp;
  typescript: RegExp;
  console: RegExp;
  git: RegExp;
  flow: RegExp;
};

const specialCasesMap = {
  'favicon.ico': 'favicon',
  'yarn.lock': 'yarn',
  'package.json': 'npm',
  'sandbox.config.json': 'codesandbox',
  'now.json': 'now',
  'netlify.toml': 'settings',
  'readme.md': 'readme',
  'contributing.md': 'contributing',
  'tsconfig.json': 'typescript',
  'tslint.json': 'typescript',
  dockerfile: 'docker',
};

const regexCasesMap = {
  markdown: /\.md$/,
  markojs: /\.marko$/,
  yaml: /\.yml$/,
  react: /\.jsx$/,
  reason: /\.re$/,
  sass: /\.scss$/,
  javascript: /\.m?js$/,
  typescript: /\.tsx?$/,
  console: /\.sh$/,
  // STARTS WITH
  git: /^.git/i,
  flow: /^.flow/i,
};

const getKeyByValue = (object: regexCasesMap, value: RegExp) =>
  Object.keys(object).find(key => object[key] === value);

export function getMode(title: string = '') {
  // Remove Ignore
  const removeIgnoreTitle = title.split('ignore')[0].toLowerCase();

  const titleArr = removeIgnoreTitle.split('.');

  // RemoveTitle
  if (removeIgnoreTitle.endsWith('rc')) {
    return titleArr.join('').split('rc')[0];
  }

  // Name Bases
  const keys = Object.keys(specialCasesMap);
  if (keys.includes(removeIgnoreTitle))
    return specialCasesMap[removeIgnoreTitle];

  // TEST BASED
  const regexValues = Object.values(regexCasesMap);
  const match = regexValues.find(value =>
    new RegExp(value).test(removeIgnoreTitle)
  );

  if (match) return getKeyByValue(regexCasesMap, match);

  // Include tests
  if (!removeIgnoreTitle.includes('.')) return 'raw';
  if (
    removeIgnoreTitle.endsWith('.module.ts') ||
    removeIgnoreTitle.endsWith('.component.ts')
  )
    return 'angular';
  if (removeIgnoreTitle.includes('webpack')) return 'webpack';

  if (isImage(removeIgnoreTitle) && !svgRegex.test(removeIgnoreTitle)) {
    return 'image';
  }

  return titleArr[titleArr.length - 1];
}

export default function getType(title: string) {
  return getMode(title);
}
