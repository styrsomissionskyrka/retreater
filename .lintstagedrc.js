const path = require('path');

module.exports = {
  '*.{ts,tsx}': [buildEslintCommand],
  '*.{js,ts,jsx,tsx,json,md,yml,html}': ['prettier --write'],
};

function buildEslintCommand(filenames) {
  let files = filenames.map((f) => `--file ${path.relative(process.cwd(), f)}`).join(' ');
  return `next lint --fix ${files}`;
}
