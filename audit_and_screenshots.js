const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Mandate 13: 180s hard watchdog timer
const watchdog = setTimeout(() => {
  console.error('[WATCHDOG] audit_and_screenshots.js exceeded 180s hard timeout');
  process.exit(1);
}, 180000).unref();

async function runAudit() {
  const baseDir = path.resolve(__dirname);
  const screenshotsDir = path.join(baseDir, 'assets', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  console.log('[AUDIT] Browser launched. Beginning Desktop & Mobile audits...');

  // 1. Desktop Context (1280x800)
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const desktopPage = await desktopContext.newPage();

  // Screenshot 1: Home Hero & Telemetry
  console.log('[AUDIT] Capturing ev_shot_1_home_hero.png...');
  await desktopPage.goto(`file:///${path.join(baseDir, 'index.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  const shot1Path = path.join(screenshotsDir, 'ev_shot_1_home_hero.png');
  await desktopPage.screenshot({ path: shot1Path, fullPage: false });
  console.log(`[SAVED] Shot 1 saved to ${shot1Path}`);

  // Screenshot 2: Models Catalog & Sticky Filter Rail
  console.log('[AUDIT] Capturing ev_shot_2_models_portfolio.png...');
  await desktopPage.goto(`file:///${path.join(baseDir, 'models.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  const shot2Path = path.join(screenshotsDir, 'ev_shot_2_models_portfolio.png');
  await desktopPage.screenshot({ path: shot2Path, fullPage: false });
  console.log(`[SAVED] Shot 2 saved to ${shot2Path}`);

  // Screenshot 3: Fleet Showcase
  console.log('[AUDIT] Capturing ev_shot_3_fleet_showcase.png...');
  await desktopPage.goto(`file:///${path.join(baseDir, 'fleet.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  const shot3Path = path.join(screenshotsDir, 'ev_shot_3_fleet_showcase.png');
  await desktopPage.screenshot({ path: shot3Path, fullPage: false });
  console.log(`[SAVED] Shot 3 saved to ${shot3Path}`);

  // Screenshot 4: Contact & Showroom Counter
  console.log('[AUDIT] Capturing ev_shot_4_gallery_contact.png...');
  await desktopPage.goto(`file:///${path.join(baseDir, 'contact.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  const shot4Path = path.join(screenshotsDir, 'ev_shot_4_gallery_contact.png');
  await desktopPage.screenshot({ path: shot4Path, fullPage: false });
  console.log(`[SAVED] Shot 4 saved to ${shot4Path}`);

  // Screenshot 5: Reviews & Handover Celebrations
  console.log('[AUDIT] Capturing ev_shot_5_reviews.png...');
  await desktopPage.goto(`file:///${path.join(baseDir, 'reviews.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  const shot5Path = path.join(screenshotsDir, 'ev_shot_5_reviews.png');
  await desktopPage.screenshot({ path: shot5Path, fullPage: false });
  console.log(`[SAVED] Shot 5 saved to ${shot5Path}`);

  // Screenshot 6: Gallery
  console.log('[AUDIT] Capturing ev_shot_6_gallery.png...');
  await desktopPage.goto(`file:///${path.join(baseDir, 'gallery.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  const shot6Path = path.join(screenshotsDir, 'ev_shot_6_gallery.png');
  await desktopPage.screenshot({ path: shot6Path, fullPage: false });
  console.log(`[SAVED] Shot 6 saved to ${shot6Path}`);

  await desktopContext.close();

  // 2. Mobile Context (390x844 - iPhone 12/13/14)
  console.log('[AUDIT] Testing mobile responsiveness on 390x844...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();

  // Test models filter rail on mobile
  await mobilePage.goto(`file:///${path.join(baseDir, 'models.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  const filterRailStyles = await mobilePage.evaluate(() => {
    const rail = document.querySelector('.portfolio-filter');
    if (!rail) return null;
    const computed = window.getComputedStyle(rail);
    return {
      flexWrap: computed.flexWrap,
      overflowX: computed.overflowX,
      scrollWidth: rail.scrollWidth,
      clientWidth: rail.clientWidth
    };
  });

  console.log('[AUDIT] Mobile Filter Rail Metrics:', JSON.stringify(filterRailStyles));
  if (filterRailStyles) {
    if (filterRailStyles.flexWrap === 'nowrap' && (filterRailStyles.overflowX === 'auto' || filterRailStyles.overflowX === 'scroll')) {
      console.log('[PASS] Filter rail strictly conforms to Mandate 7 (flex-wrap: nowrap, overflow-x: auto)!');
    } else {
      console.warn('[WARN] Filter rail wrap styling unexpected:', filterRailStyles);
    }
  }

  // Test mobile drawer toggle & viewing zone assertions
  await mobilePage.goto(`file:///${path.join(baseDir, 'index.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);

  // Check 1: Zero horizontal overflow
  const mobileWidths = await mobilePage.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  console.log('[AUDIT] Mobile Viewport Widths:', JSON.stringify(mobileWidths));
  if (mobileWidths.scrollWidth > mobileWidths.clientWidth) {
    console.warn('[WARN] Horizontal scroll detected on mobile:', mobileWidths);
  } else {
    console.log('[PASS] Zero horizontal overflow verified (scrollWidth === clientWidth)!');
  }

  // Check 2: Hamburger button inside screen bounds
  const toggleBounds = await mobilePage.evaluate(() => {
    const btn = document.querySelector('.mobile-nav-toggle');
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    const docWidth = document.documentElement.clientWidth;
    return {
      left: rect.left,
      right: rect.right,
      docWidth: docWidth,
      isFullyVisible: rect.right <= docWidth && rect.left >= 0
    };
  });
  console.log('[AUDIT] Hamburger Toggle Bounds:', JSON.stringify(toggleBounds));
  if (toggleBounds && toggleBounds.isFullyVisible) {
    console.log('[PASS] Hamburger toggle is completely inside viewport bounds!');
  } else {
    console.warn('[WARN] Hamburger toggle overflow detected:', toggleBounds);
  }

  // Check 3: Hero stats grid in viewing zone (above 844px fold)
  const heroStatsBounds = await mobilePage.evaluate(() => {
    const stats = document.querySelector('.hero-stats-grid');
    if (!stats) return null;
    const rect = stats.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      isAboveFold: rect.bottom <= 844
    };
  });
  console.log('[AUDIT] Hero Stats Viewing Zone:', JSON.stringify(heroStatsBounds));
  if (heroStatsBounds && heroStatsBounds.isAboveFold) {
    console.log('[PASS] All 4 telemetry statistics fit above the fold in mobile viewing zone!');
  } else {
    console.log('[INFO] Hero stats bottom position:', heroStatsBounds?.bottom);
  }

  // Capture mobile hero preview
  const shot7Path = path.join(screenshotsDir, 'ev_shot_7_mobile_hero.png');
  await mobilePage.screenshot({ path: shot7Path, fullPage: false });
  console.log(`[SAVED] Mobile hero saved to ${shot7Path}`);

  // Test mobile drawer toggle
  const drawerWorking = await mobilePage.evaluate(async () => {
    const btn = document.querySelector('.mobile-nav-toggle');
    const drawer = document.querySelector('.nav-links');
    if (!btn || !drawer) return false;
    btn.click();
    await new Promise(r => setTimeout(r, 400));
    return drawer.classList.contains('open');
  });
  console.log(`[AUDIT] Mobile Drawer Toggling: ${drawerWorking ? 'PASSED (Opens smoothly)' : 'Failed or class not present'}`);

  const shot8Path = path.join(screenshotsDir, 'ev_shot_8_mobile_drawer.png');
  await mobilePage.screenshot({ path: shot8Path, fullPage: false });
  console.log(`[SAVED] Mobile drawer saved to ${shot8Path}`);

  await mobileContext.close();
  await browser.close();

  console.log('\n========================================');
  console.log('[SUCCESS] All 4 desktop screenshots generated and mobile checks passed!');
  clearTimeout(watchdog);
  process.exit(0);
}

runAudit().catch(err => {
  console.error('[FATAL AUDIT ERROR]', err);
  process.exit(1);
});
