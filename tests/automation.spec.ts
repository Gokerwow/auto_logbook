import { test, expect } from '@playwright/test';
import axios from 'axios';
import * as cheerio from 'cheerio'
import { chromium } from 'playwright';

// MASUKKAN ID GDOCS KE TEMPATNYA
const docsLink = 'https://docs.google.com/document/d/ID_GDOCS_KAU/export?format=html'
// const docsLink = 'https://docs.google.com/document/d/1vLm9QZYKi1gdMB8RVzPCHnSzn2KmKWXxFppHydBMCgY/export?format=html'

interface LogbookEntry {
    tanggal: string;
    uraian_kerja: string;
    bukti_kerja: string;
}

const payload: LogbookEntry[] = []

test('logbook automation', async () => {
    test.setTimeout(0);
    const browser = await chromium.launch({ headless: false });

    const context = await browser.newContext({ storageState: 'auth_state.json' });
    const page = await context.newPage();
    await page.goto('https://siakad.unej.ac.id/merdekabelajar/outboundnonpt_mhs_detail#tab_logbook');

    await main()

    for (const entry of payload) {
        await page.waitForSelector('#kt_content_container', { state: 'visible' });

        await page.getByRole('link', { name: 'Logbook', exact: true }).click();
        await page.waitForSelector('#tab_logbook', { state: 'visible' });
        
        await page.getByRole('link', { name: 'Tambah Logbook', exact: true }).click();
        await page.waitForSelector('#modal-tambah-logbook', { state: 'visible' });

        await page.$eval('input[name="logbook[tanggal]"]', (el: any, targetDate) => {
            if (el._flatpickr) {
                el._flatpickr.setDate(targetDate, true);
            }
        }, entry.tanggal);
        await page.fill('textarea[name="logbook[deskripsi]"]', entry.uraian_kerja);
        await page.fill('input[name="logbook[link]"]', entry.bukti_kerja);
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }),
            page.click('.btn-submit-logbook')
        ]);
    }

    // await page.pause()
    await context.close()
})

async function main() {
    const response = await axios.get(docsLink, { responseType: 'text' })
    const $ = cheerio.load(response.data)

    $('table').eq(2).find('tr').slice(1).each((index, element) => {
        const data: LogbookEntry = {
            tanggal: '',
            uraian_kerja: '',
            bukti_kerja: '',
        }
        const el = $(element)
        const cells = el.find('td');
        const cellCount = cells.length;
        const cellsToProcess = cellCount == 5 ? el.find('td').slice(1) : el.find('td');

        cellsToProcess.each((index, element) => {
            const el = $(element)

            if (index == 0) {
                data.tanggal = formatDateToISO(el.text())
            } else if (index == 1) {
                data.uraian_kerja = el.text()
            } else if (index == 2) {
                const linksArray = el.find('a').map((i, el) => {
                    return $(el).attr('href');
                }).get();

                const stitchedLinks = linksArray.join(' ');
                data.bukti_kerja = stitchedLinks
            }
        })

        payload.push(data)
    })
    console.log(payload)

    
}

function formatDateToISO(dateString: string): string {
    const months: Record<string, string> = {
        'Januari': '01',
        'Februari': '02',
        'Maret': '03',
        'April': '04',
        'Mei': '05',
        'Juni': '06',
        'Juli': '07',
        'Agustus': '08',
        'September': '09',
        'Oktober': '10',
        'November': '11',
        'Desember': '12'
    };

    const parts = dateString.split(',')[1].trim().split(' ');
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]];
    const year = parts[2];

    return `${year}-${month}-${day}`;
}