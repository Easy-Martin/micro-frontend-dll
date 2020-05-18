// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.GENERATE_SOURCEMAP = 'false';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.

const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const config = require('../webpack.dll.config');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

// These sizes are pretty large. We'll warn for bundles exceeding them.

// Process CLI arguments

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.

build(config)
  .then(
    ({ warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log('\nSearch for the ' + chalk.underline(chalk.yellow('keywords')) + ' to learn more about each warning.');
        console.log('To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n');
      }

      console.log(chalk.green('Compiled successfully.\n'));
      console.log();
    },
    (err) => {
      console.error(err)
      console.log(chalk.red('Failed to compile.\n'));
      process.exit(1);
    }
  )
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Create the production build and print the deployment instructions.
function build() {
  console.log('Creating an production dll build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }));
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (process.env.CI && (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') && messages.warnings.length) {
        console.log(chalk.yellow('\nTreating warnings as errors because process.env.CI = true.\n' + 'Most CI servers set it automatically.\n'));
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      const resolveArgs = {
        stats,
        warnings: messages.warnings,
      };

      return resolve(resolveArgs);
    });
  });
}
