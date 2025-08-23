import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(2000); // Wait for content to load
    await page.screenshot({ path: 'current-state.png', fullPage: true });
    console.log('Screenshot saved as current-state.png');
  } catch (error) {
    console.error('Error taking screenshot:', error.message);
  } finally {
    await browser.close();
  }
})();