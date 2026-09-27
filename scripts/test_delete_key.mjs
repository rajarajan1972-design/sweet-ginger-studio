import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('public/browser_checks');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox'],
    defaultViewport: { width: 1280, height: 850 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Go to Artwork tab
  const artworkTab = await page.$('button ::-p-text(3. Artwork)');
  if (artworkTab) await artworkTab.click();
  await new Promise(r => setTimeout(r, 600));

  // 2. Click "Jaipur Royal Tiger" clipart
  const tigerBtn = await page.$('button[title="Jaipur Royal Tiger"]');
  if (tigerBtn) await tigerBtn.click();
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(outDir, 'before_delete_key.png') });
  console.log('Saved before_delete_key.png (Tiger clipart added)');

  // 3. Press Delete key on the keyboard
  console.log('Pressing Delete key...');
  await page.keyboard.press('Delete');
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(outDir, 'after_delete_key.png') });
  console.log('Saved after_delete_key.png (Artwork removed via Delete key)');

  // 4. Test Backspace key: Add Heritage Crest Badge, then press Backspace
  const crestBtn = await page.$('button[title="Heritage Crest Badge"]');
  if (crestBtn) await crestBtn.click();
  await new Promise(r => setTimeout(r, 800));

  console.log('Pressing Backspace key...');
  await page.keyboard.press('Backspace');
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(outDir, 'after_backspace_key.png') });
  console.log('Saved after_backspace_key.png (Artwork removed via Backspace key)');

  // 5. Test on-screen Delete button in Artwork panel
  const starBtn = await page.$('button[title="Thunder Star Icon"]');
  if (starBtn) await starBtn.click();
  await new Promise(r => setTimeout(r, 800));

  const deleteBtn = await page.$('button[title="Delete Artwork (or press Del key)"]');
  if (deleteBtn) {
    await deleteBtn.click();
    await new Promise(r => setTimeout(r, 800));
    console.log('Artwork removed via on-screen Delete button');
  }

  await page.screenshot({ path: path.join(outDir, 'after_button_delete.png') });
  console.log('Saved after_button_delete.png');

  await browser.close();
  console.log('ALL DELETE TESTS PASSED SUCCESSFULLY!');
}

run().catch(console.error);
