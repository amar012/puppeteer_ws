const puppeteer = require('puppeteer');
const  {getPageContent, 
	printPageContent,
	printReqDetails,
	printReqRespDetails } = require('./pup_analysis_funcs');

const CHROME_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

// user-agent as per firefox.61 request headers : Mozilla/5.0 (Windows NT 10.0; …) Gecko/20100101 Firefox/61.0
// Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0
const FIREFOX_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0';

// get last 3 months financial results data from nse with following url
const URL='https://www.nseindia.com/corporates/corpInfo/equities/getFinancialResults.jsp?symbol=&industry=&period=&broadcastPeriod=Last%203%20Months';

puppeteer.launch({headless: true, timeout: 180000})
						.then(async browser => {
							const page = await browser.newPage();
							await page.setUserAgent(FIREFOX_USER_AGENT);
							await page.goto(URL, {tiemout: 180000});

							await printPageContent(page);
							await page.on('request', printReqDetails);
							await page.on('requestfinished', printReqRespDetails);

							await page.on('requestfailed', req => console.log('request failed: ' + req.url() + ' - ' + req.failure().errorText) + '\n');

							await page.waitFor(60000)
										.then(async () => {
											await page.close().catch(e => console.log('Error in "page.close()" :' + e + '\n'));
											await browser.close().catch(e => console.log('Error in "browser.close()" :' + e + '\n'));
										})
										.catch(e => console.log('Error in "page.waitFor()" :' + e + '\n'));
							
						})
						.catch(async e => { 
								console.log('Error in "puppeteer.launch()" :' + e + '\n')
								await browser.close().catch(e => console.log('Error in overall catch block "browser.close()" :' + e + '\n'));
								});

