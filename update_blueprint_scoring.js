const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'YMCC_VII_Web_Blueprint (1).md');

try {
  let text = fs.readFileSync(filePath, 'utf8');

  const replacements = {
    '- [ ] Halaman **Live Leaderboard** di Portal Peserta': '- [✅] Halaman **Live Leaderboard** di Portal Peserta',
    '- [ ] Update otomatis via WebSocket saat Scoring Center diisi': '- [✅] Update otomatis via WebSocket saat Scoring Center diisi',
    '- [ ] Halaman **Scoring Center** — form input nilai per pos/kategori': '- [✅] Halaman **Scoring Center** — form input nilai per pos/kategori',
    '- [ ] Validasi input nilai (range, format)': '- [✅] Validasi input nilai (range, format)',
    '- [ ] Trigger update leaderboard setelah nilai di-submit': '- [✅] Trigger update leaderboard setelah nilai di-submit'
  };

  for (const [search, replace] of Object.entries(replacements)) {
    text = text.replace(search, replace);
  }

  fs.writeFileSync(filePath, text, 'utf8');
  console.log('Successfully synced Scoring and Leaderboard progress into the original blueprint!');
} catch (e) {
  console.error('Error updating blueprint:', e.message);
}
