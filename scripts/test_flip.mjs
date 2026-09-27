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

  // 1. Select Desert Sand Color (matching user screenshot)
  const sandSwatch = await page.$('button[title="Desert Sand"]');
  if (sandSwatch) await sandSwatch.click();
  await new Promise(r => setTimeout(r, 600));

  // Screenshot Front Side
  await page.screenshot({ path: path.join(outDir, 'tshirt_sand_front_flip.png') });
  console.log('Saved tshirt_sand_front_flip.png');

  // Click Back Side
  const backSideBtn = await page.$('button ::-p-text(Back Side)');
  if (backSideBtn) await backSideBtn.click();
  await new Promise(r => setTimeout(r, 800));

  // Screenshot Back Side
  await page.screenshot({ path: path.join(outDir, 'tshirt_sand_back_flip.png') });
  console.log('Saved tshirt_sand_back_flip.png');

  // Click Front Side again to verify toggle
  const frontSideBtn = await page.$('button ::-p-text(Front Side)');
  if (frontSideBtn) await frontSideBtn.click();
  await new Promise(r => setTimeout(r, 600));

  // 2. Test Dad Cap flipping
  const capTab = await page.$('button ::-p-text(Caps & Accessories)');
  if (capTab) await capTab.click();
  await new Promise(r => setTimeout(r, 600));

  const crimsonSwatch = await page.$('button[title="Royal Crimson"]');
  if (crimsonSwatch) await crimsonSwatch.click();
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(outDir, 'cap_crimson_front_flip.png') });
  console.log('Saved cap_crimson_front_flip.png');

  if (backSideBtn) await backSideBtn.click();
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(outDir, 'cap_crimson_back_flip.png') });
  console.log('Saved cap_crimson_back_flip.png');

  // 3. Test Hoodie flipping
  const hoodieTab = await page.$('button ::-p-text(Hoodies & Fleece)');
  if (hoodieTab) await hoodieTab.click();
  await new Promise(r => setTimeout(r, 600));

  const emeraldSwatch = await page.$('button[title="Jaipur Emerald"]');
  if (emeraldSwatch) await emeraldSwatch.click();
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(outDir, 'hoodie_emerald_back_flip.png') });
  console.log('Saved hoodie_emerald_back_flip.png');

  if (frontSideBtn) await frontSideBtn.click();
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(outDir, 'hoodie_emerald_front_flip.png') });
  console.log('Saved hoodie_emerald_front_flip.png');

  await browser.close();
  console.log('ALL FRONT/BACK FLIPPING TESTS COMPLETED!');
}

run().catch(console.error);
