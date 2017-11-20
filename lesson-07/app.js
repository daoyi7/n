const fibonacci = (n) => {
  if (typeof n !== 'number') {
    throw new Error('n should be a Number');
  }
  if (n < 0) {
    throw new Error('n should >= 0');
  }
  if (n > 10) {
    throw new Error('n should <= 10');
  }
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }

  return fibonacci(n-1) + fibonacci(n-2);
}

exports.fibonacci = fibonacci

if(require.main === module) {
  // 如果直接执行当前文件 (app.js) 则进入此处
  // 如果当前文件 (app.js) 被其他文件 require 则不执行

  let n = Number(process.argv[2])
  console.log('fibonacci(' + n + ') is', fibonacci(n))
}
