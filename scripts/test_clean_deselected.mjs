import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox'],
    defaultViewport: { width: 1280, height: 850 }
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  
  // Select Royal Navy
  const navySwatch = await page.$('button[title="Royal Navy"]');
  if (navySwatch) await navySwatch.click();
  await new Promise(r => setTimeout(r, 500));

  // Go to text tab and add text
  const textTab = await page.$('button ::-p-text(2. Text)');
  if (textTab) await textTab.click();
  await new Promise(r => setTimeout(r, 600));

  const addTextBtn = await page.$('button ::-p-text(Add Text)');
  if (addTextBtn) await addTextBtn.click();
  await new Promise(r => setTimeout(r, 600));

  // Change font color to Pure White
  const whiteBtn = await page.$('button[title="Pure White"]');
  if (whiteBtn) await whiteBtn.click();
  await new Promise(r => setTimeout(r, 500));

  // Click on background header or empty area to deselect
  await page.mouse.click(200, 40);
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'public/browser_checks/clean_mockup_deselected.png' });
  await browser.close();
  console.log('Saved clean_mockup_deselected.png');
}

run().catch(console.error);
