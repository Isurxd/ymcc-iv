const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'YMCC_VII_Web_Blueprint (1).md');
const destPath = path.join(__dirname, 'YMCC_VII_Web_Blueprint_Updated.md');

try {
  let text = fs.readFileSync(srcPath, 'utf8');

  // Merch Shop Replacements
  text = text.replace('- [ ] Halaman **Merch Shop**', '- [✅] Halaman **Merch Shop**');
  text = text.replace('- [ ] Komponen **Product Card**', '- [✅] Komponen **Product Card**');
  text = text.replace('- [ ] Fitur **Keranjang Belanja**', '- [✅] Fitur **Keranjang Belanja**');
  text = text.replace('- [ ] Halaman **Checkout**', '- [✅] Halaman **Checkout**');
  text = text.replace('- [ ] Integrasi **Payment Gateway**', '- [✅] Integrasi **Payment Gateway**');
  text = text.replace('- [ ] Halaman **Konfirmasi Order**', '- [✅] Halaman **Konfirmasi Order**');
  
  // Fundraising Replacements
  text = text.replace('- [ ] Halaman **Order Management**', '- [✅] Halaman **Order Management**');
  text = text.replace('- [ ] Aksi update status pesanan (Diproses, Dikirim, Selesai)', '- [✅] Aksi update status pesanan (Diproses, Dikirim, Selesai)');
  text = text.replace('- [ ] Logika **stock validation**', '- [✅] Logika **stock validation**');
  text = text.replace('- [ ] Halaman **Financial Report**', '- [✅] Halaman **Financial Report**');

  fs.writeFileSync(destPath, text, 'utf8');
  console.log('Successfully updated blueprint to YMCC_VII_Web_Blueprint_Updated.md');
} catch (e) {
  console.error('Error updating blueprint:', e.message);
}
