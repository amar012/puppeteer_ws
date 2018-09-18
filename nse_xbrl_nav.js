const puppeteer = require('puppeteer');
const fs = require('fs');

const CHROME_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

// user-agent as per firefox.61 request headers : Mozilla/5.0 (Windows NT 10.0; …) Gecko/20100101 Firefox/61.0
// Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0
const FIREFOX_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0';

const base_url = 'https://www.nseindia.com/corporate/xbrl/';

(async () => {
	const browser = await puppeteer.launch({headless: true, timeout: 120000});
	const page = await browser.newPage();
	await page.setUserAgent(FIREFOX_USER_AGENT);
	await page.setDefaultNavigationTimeout(120000);

	try {
		console.log(`Waiting page to goto : ${base_url}INDAS_39069_35587_14082018110128_WEB.xml` );
		const res= await page.goto(`${base_url}INDAS_39069_35587_14082018110128_WEB.xml`)
		console.log('Page goto completed');

		console.log(`response text :${await res.text()}`);
		// await page.waitFor(30000);
	} 
	catch(e) {
		await console.log('In the catch block');
		await console.log('Error :' + e);
	}
	finally {
		await console.log('In the finally block');
		if ( page != undefined && page != null && page.isClosed() == false ) { await page.close(); }
		if ( browser != undefined && browser != null ) { await browser.close(); }
		await console.log('Exiting finally');
	}
})();