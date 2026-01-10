/** @type {import("prettier").Config} */
module.exports = {
  // Always use semicolons
  semi: true,

  // Prefer single quotes where possible
  singleQuote: true,

  // Add trailing commas where valid in ES5
  trailingComma: 'es5',

  // Wrap markdown prose to improve readability
  proseWrap: 'always',

  // Maximum line length before wrapping
  printWidth: 100,

  // Number of spaces per indentation level
  tabWidth: 2,

  // Always include parentheses around arrow function parameters
  arrowParens: 'always',
};
