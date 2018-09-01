const puppeteer = require('puppeteer');

// default config used when puppeteer is launched
const def_config = {
			devtools: true,
			userDataDir: __dirname + '/user_dir',
			headless: false,
		    }
puppeteer.defaultArgs(def_config);

const URL = 'https://github.com';
// https://www.nseindia.com/corporates/corpInfo/equities/getFinancialResults.jsp?symbol=&industry=&period=&broadcastPeriod=Latest%20Announced
// https://www.nseindia.com/corporates/json/IndustryList.json

/* this is the url for getting the xbrl results page. so this is to be used as the main url url
	https://www.nseindia.com/corporates/corpInfo/equities/FinancialResults.html?radio_btn=&param=
	when the next button is clicked the following url fetches the results
	https://www.nseindia.com/corporates/corpInfo/equities/getFinancialResults.jsp?start=20&limit=20&symbol=&industry=&period=&broadcastPeriod=Latest%20Announced
	when we click the next button again the following url fetches the results
	https://www.nseindia.com/corporates/corpInfo/equities/getFinancialResults.jsp?start=40&limit=20&symbol=&industry=&period=&broadcastPeriod=Latest%20Announced
*/
async function run() {
	const browser = await puppeteer.launch({
						  headless: false,
						  devtools: true
						});
	const page = await browser.newPage();
	console.log('opening page: ' + URL, "\n");
	await page.goto(URL);
	console.log('opened page: ' + URL, "\n");

	// await get_members(browser.browserContexts(), "browser.contexts");
	//await get_members(browser.pages(), "browser.pages");

	// event listening to
	browser.on('targetcreated', async () => { 
		console.log('target created\n');

		await browser.pages()
			    .then(pgs => console.log("The number of 'browser.pages()' is :", pgs.length, "\n"))
			    //.then(pgs => get_members(pgs, "browser.pages"))
			    .catch(err => console.log('Error in "browser.pages" :', err, "\n"));

		// await get_members(await browser.targets(), "browser.targets");
		console.log("The length of 'browser.targets' array is :", await browser.targets().length, "\n");

		const targets = await browser.targets();
		for (let tgt of targets) {
			console.log("target url is :", await tgt.url(), "\n");
			const tgt_type = await tgt.type();
			console.log("target type is :", tgt_type, "\n");
			
			if (tgt_type === 'page') {
				console.log("the target page is the following:\n");
				await tgt.page()
					.then(pg =>  pg.content())
					.then(content => console.log("the HTML content of ","'", tgt.url(),"'", " is : \n", content, "\n"))
					.catch(err => console.log('Error in "tgt.page()" : ', err, "\n"));
			}

			if (await tgt.opener() != null) {
				console.log("the url of the opener of this target :", await tgt.opener().url, "\n");
			} else {
				console.log("there is no opener of this target\n");
			}
		}
	
	});
	browser.on('targetchanged', async () => { 
		console.log('target changed\n');

		await browser.pages()
			    .then(pgs => console.log("The number of 'browser.pages()' is :", pgs.length, "\n"))
			    //.then(pgs => get_members(pgs, "browser.pages"))
			    .catch(err => console.log('Error in "browser.pages" :', err, "\n"));

		// await get_members(await browser.targets(), "browser.targets");
		console.log("The length of 'browser.targets' array is :", await browser.targets().length, "\n");

		const targets = await browser.targets();
		for (let tgt of targets) {
			console.log("target url is :", await tgt.url(), "\n");
			const tgt_type = await tgt.type();
			console.log("target type is :", tgt_type, "\n");
			if (tgt_type == 'page') {
				console.log("the target page is the following:\n");	
				await tgt.page()
					.then(pg =>  pg.content())
					.then(content => console.log("the HTML content of ","'", tgt.url(),"'", " is : \n", content, "\n"))
					.catch(err => console.log('Error in "tgt.page()" : ', err, "\n"));
			}

			if (await tgt.opener() != null) {
				console.log("the url of the opener of this target :", await tgt.opener().url, "\n");
			} else {
				console.log("there is no opener of this target\n");
			}
		}

	});
	browser.on('targetdestroyed', () => console.log('target destroyed\n'));

	// await get_members(browser.browserContexts(), "browser.contexts");
	await browser.pages()
			    .then(pgs => console.log("The number of 'browser.pages()' is :", pgs.length, "\n"))
			    //.then(pgs => get_members(pgs, "browser.pages"))
			    .catch(err => console.log('Error in "browser.pages" :', err));
	//await get_members(await browser.targets(), "browser.targets");
	console.log("The length of 'browser.targets' array is :", await browser.targets().length, "\n");

	/* This needs to be uncommented after above portion is working properly
		const targets = await browser.targets();
		for (let tgt of targets) {
			console.log("target url is :", await tgt.url(), "\n");
			const tgt_type = await tgt.type();
			console.log("target type is :", tgt_type, "\n");
			
			if (await tgt.opener() != null) {
				console.log("the url of the opener of this target :", await tgt.opener().url, "\n");
			} else {
				console.log("there is no opener of this target\n");
			}
			
			
			if (tgt_type === 'page') {
				console.log("the target page is the following:\n");
				await tgt.page()
					.then(pg =>  pg.content())
					.then(content => console.log("the HTML content of ","'", tgt.url(),"'", " is :\n", content))
					.catch(err => console.log('Error in "tgt.page()" : ', err));
			}
		}
	*/
	await page.waitFor(2400000);
	console.log('Closing the browser');
	await browser.close();

	
}

function get_members(ar, arname) {
	if (! Array.isArray(ar)) {
		console.log("The argument given is not an 'Array'\n");
		return;
	}

	console.log("the array", '"', arname, '"', "contains following memebers\n");
	for (mem of ar) {
		
		// console.log(mem.toString());
		console.log(mem);
	}
}	


run();
