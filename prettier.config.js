/** @type {import('prettier').Config} */
module.exports = {
  printWidth: 100, // 每行最大长度，超出换行
  tabWidth: 2, // 缩进空格数
  useTabs: false, // 使用空格而不是 Tab
  semi: true, // 行尾添加分号
  singleQuote: true, // 使用单引号
  quoteProps: 'as-needed', // 仅在必要时给对象 key 加引号
  jsxSingleQuote: false, // JSX 中使用双引号
  trailingComma: 'none', // 不加尾逗号
  bracketSpacing: true, // 花括号内加空格：{ foo: bar }
  bracketSameLine: false, // JSX 的 > 不同行
  arrowParens: 'avoid', // 箭头函数参数一个时不加括号
  proseWrap: 'preserve', // markdown 原样换行
  endOfLine: 'lf' // 使用 LF 换行符（Unix 风格）
};
