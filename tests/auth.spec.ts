import { chromium } from 'playwright';
import { test } from '@playwright/test';

test('logbook automation', async () => {
    test.setTimeout(0)

    const context = await chromium.launchPersistentContext('./user_data', {
        headless: false
    });

    const page = context.pages()[0] || await context.newPage();

    await page.goto('https://siakad.unej.ac.id/merdekabelajar/outboundnonpt_mhs_detail#');

    await page.waitForSelector('a.card.bg-danger[href="/Kuliah/Transkrip"]', { timeout: 120_000 });

    console.log('Login detected! Saving auth state...');
    await context.storageState({ path: 'auth_state.json' });
    await context.close();
});