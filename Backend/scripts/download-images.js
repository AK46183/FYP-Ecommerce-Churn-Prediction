// Naye products ki remote images download karke apne frontend folder mein rakhta hai,
// aur Backend/data/catalog.json ke image paths local kar deta hai.
// Chalao (Backend folder se):  node scripts/download-images.js
const fs = require('fs');
const path = require('path');

const CATALOG = path.join(__dirname, '..', 'data', 'catalog.json');
const IMG_ROOT = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', 'products-nobg');
const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');
const catDir = { skinCare: 'skincare', sunCare: 'suncare' };

(async () => {
  const items = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const todo = items.filter((p) => /^https?:\/\//.test(p.image || ''));
  console.log(`${todo.length} images download honi hain...`);
  let ok = 0, fail = 0, i = 0;

  async function worker() {
    while (i < todo.length) {
      const p = todo[i++];
      try {
        const ext = (path.extname(new URL(p.image).pathname) || '.jpg').toLowerCase();
        const rel = `${catDir[p.category] || slug(p.category)}/${slug(p.subCategory)}/${p.sku}${ext}`;
        const dest = path.join(IMG_ROOT, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const res = await fetch(p.image);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
        p.image = `/images/products-nobg/${rel}`;
        ok++;
      } catch (e) {
        fail++;
        console.log(`✘ ${p.sku}: ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));

  fs.writeFileSync(CATALOG, JSON.stringify(items));
  console.log(`✔ ${ok} download hui, ${fail} fail (fail walon ka link remote hi rahega)`);
})();
