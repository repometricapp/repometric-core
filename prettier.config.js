/** @type {import("prettier").Config} */
module.exports = {
  /**
   * JavaScript / TypeScript
   */
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',

  /**
   * Formatting
   */
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  /**
   * JSX / TSX
   */
  jsxSingleQuote: false,
  bracketSpacing: true,

  /**
   * Markdown
   */
  proseWrap: 'always',

  /**
   * CSS
   */
  singleAttributePerLine: false,

  /**
   * Line endings
   * Avoids issues across operating systems.
   */
  endOfLine: 'lf',
};
