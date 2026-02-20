const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  // Add this to prevent circular watch triggers
  watchOptions: {
    ignored: ['**/node_modules/**', '**/dist/**'],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: join(__dirname, './src/main.ts'),
      tsConfig: join(__dirname, './tsconfig.app.json'),
      assets: [join(__dirname, './src/assets')],
      additionalEntryPoints: [
        {
          entryName: 'run.seeder',
          entryPath: join(__dirname, './src/seeds/run.seeder.ts'),
        },
      ],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMap: true,
    }),
  ],
};
