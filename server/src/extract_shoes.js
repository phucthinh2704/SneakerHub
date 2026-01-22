const fs = require('fs');

// Dán toàn bộ mảng JSON của bạn vào đây
const products = require('./product.json'); // hoặc copy trực tiếp vào biến

let output = '';

products.forEach(product => {
  const colors = product.variants.map(v => v.color).join(', ');
  output += `${product.name}: ${colors}\n`;
});

fs.writeFileSync('shoes_colors.txt', output, 'utf8');

console.log('Đã xuất file shoes_colors.txt thành công!');
