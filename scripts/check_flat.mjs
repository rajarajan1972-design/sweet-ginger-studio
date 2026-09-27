import puppeteer from 'puppeteer-core';

async function testFlat() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1280, height: 850 }
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Click 'Flat Garment' button
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Flat Garment')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  // T-Shirt Jet Black
  const blackSwatch = await page.$('button[title="Jet Black"]');
  if (blackSwatch) await blackSwatch.click();
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'public/browser_checks/flat_tshirt_black.png' });

  // T-Shirt Crimson
  const crimsonSwatch = await page.$('button[title="Royal Crimson"]');
  if (crimsonSwatch) await crimsonSwatch.click();
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'public/browser_checks/flat_tshirt_crimson.png' });

  // Hoodie Crimson
  const hoodieTab = await page.$('button ::-p-text(Hoodies & Fleece)');
  if (hoodieTab) await hoodieTab.click();
  await new Promise(r => setTimeout(r, 800));
  const hoodieCard = await page.$('::-p-text(Sweet Ginger Heavy Fleece)');
  if (hoodieCard) await hoodieCard.click();
  await new Promise(r => setTimeout(r, 800));
  if (crimsonSwatch) await crimsonSwatch.click();
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'public/browser_checks/flat_hoodie_crimson.png' });

  // Cap Black
  const capTab = await page.$('button ::-p-text(Caps & Accessories)');
  if (capTab) await capTab.click();
  await new Promise(r => setTimeout(r, 800));
  const capCard = await page.$('::-p-text(Ginger Prints Heritage Cotton Dad Cap)');
  if (capCard) await capCard.click();
  await new Promise(r => setTimeout(r, 800));
  if (blackSwatch) await blackSwatch.click();
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'public/browser_checks/flat_cap_black.png' });

  await browser.close();
  console.log('Saved flat screenshots successfully!');
}

testFlat();
