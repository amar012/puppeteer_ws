const puppeteer = require('puppeteer'); 

async function run() {
	const browser = await puppeteer.launch({
			headless: false,
				});

	const page = await browser.newPage();
	await page.goto("https://github.com");


	console.log("opened github home page.");

}

run();