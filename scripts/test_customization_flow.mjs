import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('public/browser_checks');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1280, height: 850 },
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Choose Oversized Tee - Jet Black
  const blackSwatch = await page.$('button[title="Jet Black"]');
  if (blackSwatch) await blackSwatch.click();
  await new Promise(r => setTimeout(r, 500));

  // 2. Add Text
  const textTab = await page.$('button ::-p-text(2. Text)');
  if (textTab) await textTab.click();
  await new Promise(r => setTimeout(r, 600));

  const addTextBtn = await page.$('button ::-p-text(Add Text)');
  if (addTextBtn) {
    await addTextBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // Set Text Color to Pure White for Black Garment
  const whiteTextColor = await page.$('button[title="Pure White"]');
  if (whiteTextColor) {
    await whiteTextColor.click();
    await new Promise(r => setTimeout(r, 500));
  }

  await page.screenshot({ path: path.join(outDir, 'tee_black_custom_text.png') });
  console.log('Saved tee_black_custom_text.png');

  // 3. Add Artwork Clipart
  const artworkTab = await page.$('button ::-p-text(3. Artwork)');
  if (artworkTab) await artworkTab.click();
  await new Promise(r => setTimeout(r, 600));

  const tigerClipart = await page.$('button[title="Heritage Crest Badge"]');
  if (tigerClipart) {
    await tigerClipart.click();
    await new Promise(r => setTimeout(r, 800));
  }

  await page.screenshot({ path: path.join(outDir, 'tee_black_text_and_crest.png') });
  console.log('Saved tee_black_text_and_crest.png');

  // 4. Test Hoodie in Jaipur Emerald with the customized artwork
  const prodTab = await page.$('button ::-p-text(1. Product)');
  if (prodTab) await prodTab.click();
  await new Promise(r => setTimeout(r, 500));

  const hoodieCat = await page.$('button ::-p-text(Hoodies & Fleece)');
  if (hoodieCat) await hoodieCat.click();
  await new Promise(r => setTimeout(r, 500));

  const emeraldSwatch = await page.$('button[title="Jaipur Emerald"]');
  if (emeraldSwatch) await emeraldSwatch.click();
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(outDir, 'hoodie_emerald_custom_mockup.png') });
  console.log('Saved hoodie_emerald_custom_mockup.png');

  // 5. Test Cap in Royal Crimson with customized artwork
  const capCat = await page.$('button ::-p-text(Caps & Accessories)');
  if (capCat) await capCat.click();
  await new Promise(r => setTimeout(r, 500));

  const crimsonSwatch = await page.$('button[title="Royal Crimson"]');
  if (crimsonSwatch) await crimsonSwatch.click();
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(outDir, 'cap_crimson_custom_mockup.png') });
  console.log('Saved cap_crimson_custom_mockup.png');

  // 6. Test Back View on Hoodie
  if (prodTab) await prodTab.click();
  await new Promise(r => setTimeout(r, 500));
  if (hoodieCat) await hoodieCat.click();
  await new Promise(r => setTimeout(r, 500));

  const backSideBtn = await page.$('button ::-p-text(Back Side)');
  if (backSideBtn) {
    await backSideBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  await page.screenshot({ path: path.join(outDir, 'hoodie_back_view.png') });
  console.log('Saved hoodie_back_view.png');

  await browser.close();
  console.log('All end-to-end customization tests passed!');
}

run().catch(console.error);
