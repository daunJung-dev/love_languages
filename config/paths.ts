import path from 'path';
import fs from 'fs';
import url from 'url';

// Make sure any symlinks in the project folder are resolved:
const appDirectory: string = fs.realpathSync(
  process.cwd(),
);
const resolveApp = (
  relativePath: string,
): string => path.resolve(appDirectory, relativePath);

const envPublicUrl: string = process.env.PUBLIC_URL;

function ensureSlash(
  inputPath: string,
  needsSlash: boolean,
): string {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(
      0,
      inputPath.length - 1,
    );
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  }
  return inputPath;
}

const getPublicUrl = (
  appPackageJson: string,
): string => envPublicUrl
  || require(appPackageJson).homepage;

function getServedPath(appPackageJson: string) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl
    || (publicUrl
      ? new url.URL(publicUrl).pathname
      : '/');
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (
  resolveFn: (pathString: string) => string,
  filePath: string,
) => {
  const extension = moduleFileExtensions.find(
    (extension) => fs.existsSync(
      resolveFn(`${filePath}.${extension}`),
    ),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }
  return resolveFn(`${filePath}.js`);
};

export default {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(
    resolveApp('package.json'),
  ),
  servedPath: getServedPath(
    resolveApp('package.json'),
  ),
};
