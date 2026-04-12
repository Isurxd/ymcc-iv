const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'YMCC_VII_Web_Blueprint_Updated.md');

try {
  let text = fs.readFileSync(filePath, 'utf8');

  const replacements = {
    '- [ ] Setup **Socket.io Server**': '- [✅] Setup **Socket.io Server**',
    '- [ ] Desain event schema WebSocket': '- [✅] Desain event schema WebSocket',
    '- [ ] Halaman **Master Control**': '- [✅] Halaman **Master Control**',
    '- [ ] Integrasi **Socket.io emit**': '- [✅] Integrasi **Socket.io emit**',
    '- [ ] Halaman **Videotron Display**': '- [✅] Halaman **Videotron Display**',
    '- [ ] Halaman **Cheat Monitor**': '- [✅] Halaman **Cheat Monitor**',
    '- [ ] Halaman **Exam Center**': '- [✅] Halaman **Exam Center**',
    '- [ ] Komponen **Timer** real-time': '- [✅] Komponen **Timer** real-time',
    '- [ ] Implementasi **Proctoring**:': '- [✅] Implementasi **Proctoring**:',
    '- [ ] Sistem **auto-lock** saat peserta': '- [✅] Sistem **auto-lock** saat peserta',
    '- [ ] Log anomali dikirim ke server': '- [✅] Log anomali dikirim ke server',
    '- [ ] Leaderboard display di **Videotron**': '- [✅] Leaderboard display di **Videotron**'
  };

  for (const [search, replace] of Object.entries(replacements)) {
    text = text.replace(search, replace);
  }

  // Update original file structure since the user will check it.
  fs.writeFileSync(path.join(__dirname, 'YMCC_VII_Web_Blueprint (1).md'), text, 'utf8');
  console.log('Successfully synced Phase 3 progress into the original blueprint!');
} catch (e) {
  console.error('Error updating blueprint:', e.message);
}
