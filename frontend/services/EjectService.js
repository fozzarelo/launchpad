/* @flow */

import type { Pad } from '../types';

let downloader;

export async function download(pad: Pad, currentCode: string): Promise<any> {
  if (!downloader) {
    await new Promise(resolve => {
      (require: any).ensure(
        [
          'jszip',
          'to-snake-case',
          'file-saver',
          './eject/dotBabelrc',
          './eject/packageDotJson',
          './eject/serverDotJs',
          './eject/readmeDotMd',
        ],
        () => {
          downloader = makeDownloader({
            JSZip: require('jszip'),
            toSnakeCase: require('to-snake-case'),
            saveAs: require('file-saver').saveAs,
            dotBabelrc: require('./eject/dotBabelrc').default,
            packageDotJson: require('./eject/packageDotJson').default,
            serverDotJs: require('./eject/serverDotJs').default,
            readmeDotMd: require('./eject/readmeDotMd').default,
          });
          resolve();
        },
      );
    });
  }

  return downloader(pad, currentCode);
}

function makeDownloader({
  JSZip,
  toSnakeCase,
  saveAs,
  dotBabelrc,
  packageDotJson,
  serverDotJs,
  readmeDotMd,
}) {
  return async (pad: Pad, currentCode: string) => {
    const projectName = pad.title
      ? toSnakeCase(pad.title)
      : 'unnamed_launchpad_project';

    const padContext = pad.context || [];
    const padDependencies = pad.dependencies || [];

    // generate and write title, description and dependencies into pacakge.json
    const generatedDependencies = padDependencies
      .map(el => `    "${el.name}": "^${el.version || ''}",`)
      .join('\n');
    const finalPackageDotJson = packageDotJson
      .replace('{{name}}', projectName)
      .replace('{{description}}', pad.description ? pad.description : '')
      .replace(
        '{{dependencies}}',
        generatedDependencies ? generatedDependencies : '',
      );

    // set up the default query for graphiql and print a useful error for missing secrets

    const printMissingSecretWarning = key => {
      return `console.warn('WARNING: process.env.${key} is not defined. Check README.md for more information');`;
    };

    const checkSecretsCode = padContext
      .map(
        el =>
          `if (typeof process.env.${
            el.key
          } === 'undefined') {\n  ${printMissingSecretWarning(el.key)}\n}`,
      )
      .join('\n');

    const finalServerDotJs = serverDotJs
      .replace(
        '{{checkSecretsCode}}',
        padContext.length > 0 ? checkSecretsCode : '',
      )
      .replace('{{defaultQuery}}', pad.defaultQuery ? pad.defaultQuery : '');

    // add name + description in readme.md, provide instructions for secrets
    const secretsExports = padContext
      .map(el => `export ${el.key}=<your value here>`)
      .join('\n');

    const secretsInstructions =
      '### App secrets\n\n' +
      'This pad contains some secret keys which you will need to provide as environment ' +
      'variables in order to run it locally (the secret values have been removed for your security). ' +
      'Secret values are often used for things like database passwords and private cryptographic keys.\n\n' +
      'Here is a list of the secrets in this project for which you will need to provide values: ' +
      padContext.map(el => el.key).join(', ') +
      '.\n\n' +
      'You can set them by exporting them as environment variables in your shell: \n\n' +
      '```sh\n' +
      secretsExports +
      '\n' +
      '```';

    const finalReadmeDotMd = readmeDotMd
      .replace(/{{padId}}/g, pad.id)
      .replace('{{name}}', pad.title ? pad.title : 'Unnamed Launchpad Project')
      .replace('{{description}}', pad.description ? pad.description : '')
      .replace('{{secretsExports}}', padContext.length ? secretsExports : '')
      .replace(
        '{{secretsInstructions}}',
        padContext.length ? secretsInstructions : '',
      );

    const zip = new JSZip();

    const bundle = zip.folder(projectName);
    bundle.file('README.md', finalReadmeDotMd, { unixPermissions: '644' });
    bundle.file('package.json', finalPackageDotJson, {
      unixPermissions: '644',
    });
    bundle.file('.babelrc', dotBabelrc, { unixPermissions: '644' });
    const src = bundle.folder('src');
    src.file('schema.js', currentCode, { unixPermissions: '644' }); // XXX this may be out of sync with the saved code.
    src.file('server.js', finalServerDotJs, { unixPermissions: '644' });

    return await zip.generateAsync({ type: 'blob' }).then(function(content) {
      saveAs(content, projectName);
    });
  };
}
