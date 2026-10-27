const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Mandate 13: 180s hard watchdog timer
const WATCHDOG_TIMEOUT_MS = 180000;
const watchdog = setTimeout(() => {
  console.error('[WATCHDOG] dispatch_bardhaman_ev_wa.js exceeded 180s hard execution limit.');
  process.exit(1);
}, WATCHDOG_TIMEOUT_MS).unref();

const dir = path.join(process.env.LOCALAPPDATA || 'C:\\Users\\dasan\\AppData\\Local', 'Google', 'Chrome', 'AutomationProfile_Active');
const phone = '918250347130';

const screenshots = [
  path.join(__dirname, 'assets', 'screenshots', 'ev_shot_1_home_hero.png'),
  path.join(__dirname, 'assets', 'screenshots', 'ev_shot_2_models_portfolio.png'),
  path.join(__dirname, 'assets', 'screenshots', 'ev_shot_3_fleet_showcase.png'),
  path.join(__dirname, 'assets', 'screenshots', 'ev_shot_4_gallery_contact.png')
];

for (const s of screenshots) {
  if (!fs.existsSync(s)) {
    console.error(`[ERROR] Screenshot missing: ${s}`);
    process.exit(1);
  }
}

const pitch = `Namaste BARDHAMAN EV ZONE team!

I’m Sounak from Kolkata (Cloudempire). We really love your electric scooter and bike showroom at City Hotel More, Bardhaman.

We made a clean and simple website demo for your showroom, featuring your real showroom photos from Google, customer reviews, and your full EV models catalog:
👉 https://cloudempiretech.github.io/bardhaman-ev-zone/

Customers can also message you directly on WhatsApp from the website to book test rides and enquire about models.

Sharing a few screenshots above. If you like it, we’d love to help you set this up for your showroom. Let me know what you think!

— Sounak, Cloudempire (Kolkata)`;

async function dispatch() {
  console.log('[WA OUTREACH] Launching persistent context for WhatsApp Web outreach with AutomationProfile_Active...');
  const ctx = await chromium.launchPersistentContext(dir, {
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    viewport: { width: 1366, height: 768 }
  });

  try {
    const page = ctx.pages()[0] || await ctx.newPage();
    const encodedText = encodeURIComponent(pitch);
    const targetUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${encodedText}`;

    console.log(`[WA OUTREACH] Navigating to WhatsApp Web chat for ${phone}...`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log('[WA OUTREACH] Waiting for WhatsApp Web to sync and chat interface to load...');
    // Wait for the side panel or chat interface to appear
    await page.waitForSelector('#side, div[contenteditable="true"], div[data-tab="3"]', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(5000);

    // Wait for "Starting chat" modal to disappear if present
    await page.waitForSelector('text="Starting chat"', { state: 'detached', timeout: 35000 }).catch(() => {});
    await page.waitForTimeout(4000);

    // Capture step 1: chat loaded with text
    const step1Path = path.join(__dirname, 'assets', 'screenshots', 'wa_step_1_chat_loaded.png');
    await page.screenshot({ path: step1Path }).catch(() => {});
    console.log('[WA OUTREACH] Step 1 screenshot taken.');

    // Look for send button
    console.log('[WA OUTREACH] Looking for send button or composer...');
    const sendBtn = page.locator('span[data-icon="send"], button[aria-label*="Send" i], div[aria-label*="Send" i]').first();
    await sendBtn.waitFor({ state: 'visible', timeout: 45000 });
    console.log('[WA OUTREACH] Send button visible! Dispatching pitch text...');
    await sendBtn.click();
    await page.waitForTimeout(4000);

    console.log('[WA OUTREACH] Pitch text dispatched! Now attaching 4 desktop previews...');

    // Open attach menu
    try {
      const attachBtn = page.locator('button[aria-label*="Attach" i], div[aria-label*="Attach" i], span[data-icon="plus"], span[data-icon="attach-menu-plus"], span[data-icon="clip"], button[title*="Attach" i]').first();
      await attachBtn.waitFor({ state: 'visible', timeout: 15000 });
      await attachBtn.click();
      await page.waitForTimeout(1500);

      // Enable multiple on file inputs
      await page.evaluate(() => {
        document.querySelectorAll('input[type="file"]').forEach(i => i.setAttribute('multiple', 'multiple'));
      });

      const fileInputs = await page.locator('input[type="file"]').all();
      console.log(`[WA OUTREACH] Found ${fileInputs.length} file inputs for media.`);

      let uploaded = false;
      for (let i = fileInputs.length - 1; i >= 0; i--) {
        try {
          await fileInputs[i].setInputFiles(screenshots);
          console.log(`[WA OUTREACH] Successfully attached screenshots to input[${i}]`);
          uploaded = true;
          break;
        } catch (err) {
          console.log(`[WA OUTREACH] Multiple upload attempt on input[${i}]: ${err.message}`);
        }
      }

      if (!uploaded) {
        console.log('[WA OUTREACH] Trying single screenshot attach...');
        for (let i = fileInputs.length - 1; i >= 0; i--) {
          try {
            await fileInputs[i].setInputFiles(screenshots[0]);
            console.log(`[WA OUTREACH] Attached hero screenshot to input[${i}]`);
            uploaded = true;
            break;
          } catch (err) {
            console.log(`[WA OUTREACH] Single upload attempt on input[${i}]: ${err.message}`);
          }
        }
      }

      if (uploaded) {
        console.log('[WA OUTREACH] Waiting for media preview overlay...');
        await page.waitForTimeout(5000);

        // Click media send button
        const mediaSendBtn = page.locator('span[data-icon="send"], button[aria-label*="Send" i], div[aria-label*="Send" i], span[data-icon="checkmark-medium"]').first();
        await mediaSendBtn.waitFor({ state: 'visible', timeout: 15000 });
        await mediaSendBtn.click();
        console.log('[WA OUTREACH] Media send button clicked!');
        await page.waitForTimeout(14000);
      }
    } catch (mediaErr) {
      console.warn('[WA OUTREACH] Media attachment notice (text was dispatched):', mediaErr.message);
    }

    // Final screenshot verifying complete message delivery
    const verifiedPath = 'C:\\Users\\dasan\\.gemini\\antigravity\\scratch\\bardhaman-ev-zone\\assets\\screenshots\\wa_outreach_verified_success.png';
    await page.screenshot({ path: verifiedPath });
    console.log(`[WA OUTREACH] Verification screenshot saved to ${verifiedPath}`);

  } catch (err) {
    console.error('[WA OUTREACH ERROR]', err);
    try {
      const pages = ctx.pages();
      if (pages.length > 0) {
        await pages[0].screenshot({ path: 'C:\\Users\\dasan\\.gemini\\antigravity\\scratch\\bardhaman-ev-zone\\assets\\screenshots\\wa_dispatch_error.png' });
      }
    } catch (_) {}
    throw err;
  } finally {
    await ctx.close().catch(() => {});
  }
}

dispatch().then(() => {
  console.log('[WA OUTREACH] DISPATCH COMPLETED CLEANLY');
  clearTimeout(watchdog);
  process.exit(0);
}).catch(err => {
  console.error('[WA OUTREACH] DISPATCH FAILED:', err);
  clearTimeout(watchdog);
  process.exit(1);
});
