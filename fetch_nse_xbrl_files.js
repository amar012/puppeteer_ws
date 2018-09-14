const puppeteer = require('puppeteer');
const fs = require('fs');

const CHROME_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

// user-agent as per firefox.61 request headers : Mozilla/5.0 (Windows NT 10.0; …) Gecko/20100101 Firefox/61.0
// Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0
const FIREFOX_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0';

const base_url = 'https://www.nseindia.com/corporate/xbrl/';
let x = 0;

const data_json = fs.readFileSync('./NSE_fin_results_6651_last3mons.json', 'utf8', (err, data) => {  
    							if (err){
        							console.log(err);
    							} else {
								return data;
							}	
						});

const obj = eval('(' + data_json + ')'); //now it's an object

puppeteer.launch({headless: true, timeout: 180000})
				.then(async function (browser) {
					const page = await browser.newPage();
					await page.setUserAgent(FIREFOX_USER_AGENT);

					// console.log('Entered "then" in "puppeteer.launch()"');
					for (const k of obj.rows) {
						// console.log('Entered "for" in "obj.rows"');
						if (k.xbrl != '-') {
							// console.log('Entered "if k.xbrl"');
							const y = x += 1;
							const toDate = k.ToDate.replace(/-/g, '_');
							const fromDate = k.FromDate.replace(/-/g, '_');
							const symbol = k.Symbol;
							const xbrl = k.xbrl;
							const xml_filename = symbol + '_' + fromDate + '_To_' +  toDate + '_' + xbrl;
							const xml_file_path = './xbrl_folder/' + xml_filename;
							const url = base_url + xbrl;
							// console.log(xml_filename);
							
							await page.goto(url, {tiemout: 180000});

							// const xml_str = await page.$eval('#collapsible0 > div.expanded', el => el.innerText);
							const xml_str = await page.$eval('body', el => el.innerText);
							// console.log('xml_str :\n' + xml_str); 
							await fs.writeFile(xml_file_path, xml_str, 'utf8', function (e,d) { console.log( y + '- written file :' + xml_filename + ' to disk')});	

							x += 1;
							await page.waitFor(500)
									.then(async () => {
											console.log('waited for half a second');
									})
									.catch(e => console.log('Error in "page.waitFor()" :' + e + '\n'));
							
						}
					}
					await page.waitFor(30000)
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

// console.log('total xbrl files :' + x);