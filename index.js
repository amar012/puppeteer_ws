const puppeteer = require('puppeteer'); 

async function run() {
	const browser = await puppeteer.launch({
			headless: true,
				});

	let URL = 'https://nseindia.com/corporates/corporateHome.html?id=eqFinResults';

	/*

	"https://nseindia.com/corporates/corpInfo/equities/getFinancialResults.jsp?symbol=&industry=&period=&broadcastPeriod=Latest%20Announced"
	"https://nseindia.com/corporates/json/IndustryList.json"
	"https://nseindia.com/corporates/corpInfo/equities/FinancialResults.html?radio_btn=&param="
	"https://nseindia.com/corporates/whatnew/ipo_showcase.jsp?firstPage=yes"
	"https://nseindia.com/corporates/whatnew/forthcoming_listing.jsp?firstPage=yes"
	"https://nseindia.com/corporates/whatnew/new_listing.jsp?firstPage=yes"
	"https://nseindia.com/live_market/dynaContent/live_watch/get_quote/companySnapshot/getCorporateActions.json"
	"https://nseindia.com/corporates/directLink/latestAnnouncementsCorpHome.jsp"
	"https://nseindia.com/live_market/dynaContent/live_watch/get_quote/companySnapshot/getFinancialResults.json"





	*/

	const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:10.0) Gecko/20100101 Firefox/61.0';

	// github uses ids like 'user[login]' i.e. using special characters and these spl chars like '[' and ']' require to be escaped, which is done 
	// by using the spl char's unicode value and escaping that unicode value with another '\' char in front of it- as done below.
	// const USER_NAME_INPUT_SELECTOR = '#user\\5b login\\5d ';
	// const USER_EMAIL_INPUT_SELECTOR = '#user\\5b email\\5d ';

	// const XBRL_SELECTOR = '#ext-gen115';
	// #ext-gen10
	const XBRL_SELECTOR = "td.ex-grid3-col";

	const page = await browser.newPage();
	page.setCacheEnabled(false);
	page.setUserAgent('Mozilla/5.0');
	page.setViewport({
		height: 768,
		width: 1366
			});
	await page.goto(URL);
	const COOKIES = await page.cookies()
	console.log("cookies length: ",COOKIES.length)

	let cookies = '';
	for (cookie of COOKIES) {
		cookies += "cookie.name = " + cookie.name + '\n' + "cookie.value = " +  cookie.value + '\n' + "cookie.domain = " + cookie.domain + '\n' + "cookie.path = " + cookie.path
	} 
	console.log("Cookies : \n", cookies);

	const PAGE_METRICS = await page.metrics()
	// console.log("Page Metrics length: ",PAGE_METRICS.values.length)

	let page_metrics = '';
	for (var metric in PAGE_METRICS) {
		console.log('\n', metric, " -> ", PAGE_METRICS[metric])
	} 
	
	/* page.mainFrame()
			.waitForSelector(XBRL_SELECTOR)
			.then(() => console.log("wait for", XBRL_SELECTOR, " is successfull"))
			.catch(err => console.log("Error in Selector Promise: ", err));
	*/

	const HTML = await page.$('html');
	const TD_COUNTS = HTML.$$(XBRL_SELECTOR)
						.then(el_handle => console.log("el_handle : ", el_handle))
						.catch(err => console.log("TD_COUNTS error :", err));
						
	/* for (let c of TD_COUNTS) {
		console.log("TD element : ", c);
	}
	*/

	// const XBRL_COUNTS = await page.$$eval(XBRL_SELECTOR, els => els.length);
	// console.log("XBRL elements count: ", XBRL_COUNTS);
	/* await page.content()
			   .then(c => console.log("page content :\n", c))
			   .catch( err => console.log("error in page content :", err));
	*/

	/* await page.waitFor(USER_NAME_INPUT_SELECTOR)
		.then(el => el.type('Amarender'))
		.catch(err => console.log(err));
	*/

	/* await page.waitFor(USER_EMAIL_INPUT_SELECTOR)
		.then(el => el.type('abc@xyz.com'))
		.catch(err => console.log(err));
	*/

	console.log("opened URL: ", URL);
	await page.waitFor(120*1000);
	browser.close();

}

run();