import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('public/browser_checks');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching Chrome from:', chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1280, height: 850 },
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Ensure Real Model View is active
  const modelViewBtn = await page.$('button ::-p-text(Real Model View)');
  if (modelViewBtn) {
    await modelViewBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // 1. Check Hoodie with Black, Crimson, Emerald, Amber, Navy
  console.log('Testing Hoodie...');
  const hoodieTab = await page.$('button ::-p-text(Hoodies & Fleece)');
  if (hoodieTab) {
    await hoodieTab.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Select Hoodie product card
  const hoodieCard = await page.$('::-p-text(Sweet Ginger Heavy Fleece)');
  if (hoodieCard) {
    await hoodieCard.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Test colors
  const colorsToTest = ['Jet Black', 'Royal Crimson', 'Jaipur Emerald', 'Jaipur Amber Gold', 'Royal Navy', 'Bright White'];
  for (const cname of colorsToTest) {
    const swatch = await page.$(`button[title="${cname}"]`);
    if (swatch) {
      await swatch.click();
      await new Promise(r => setTimeout(r, 1000));
      const cleanName = cname.toLowerCase().replace(/\s+/g, '_');
      await page.screenshot({ path: path.join(outDir, `hoodie_${cleanName}.png`) });
      console.log(`Captured screenshot for Hoodie - ${cname}`);
    }
  }

  // 2. Check Caps & Accessories
  console.log('Testing Cap...');
  const capsTab = await page.$('button ::-p-text(Caps & Accessories)');
  if (capsTab) {
    await capsTab.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  const capCard = await page.$('::-p-text(Ginger Prints Heritage Cotton Dad Cap)');
  if (capCard) {
    await capCard.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  for (const cname of colorsToTest) {
    const swatch = await page.$(`button[title="${cname}"]`);
    if (swatch) {
      await swatch.click();
      await new Promise(r => setTimeout(r, 1000));
      const cleanName = cname.toLowerCase().replace(/\s+/g, '_');
      await page.screenshot({ path: path.join(outDir, `cap_${cleanName}.png`) });
      console.log(`Captured screenshot for Cap - ${cname}`);
    }
  }

  // 3. Check T-Shirts
  console.log('Testing T-Shirts...');
  const tshirtTab = await page.$('button ::-p-text(T-Shirts & Polos)');
  if (tshirtTab) {
    await tshirtTab.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  const tshirtCard = await page.$('::-p-text(Sweet Ginger Heavyweight Oversized Tee)');
  if (tshirtCard) {
    await tshirtCard.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  for (const cname of colorsToTest) {
    const swatch = await page.$(`button[title="${cname}"]`);
    if (swatch) {
      await swatch.click();
      await new Promise(r => setTimeout(r, 1000));
      const cleanName = cname.toLowerCase().replace(/\s+/g, '_');
      await page.screenshot({ path: path.join(outDir, `tshirt_${cleanName}.png`) });
      console.log(`Captured screenshot for T-Shirt - ${cname}`);
    }
  }

  await browser.close();
  console.log('Browser tests completed successfully!');
}

run().catch(err => {
  console.error('Browser check failed:', err);
  process.exit(1);
});
