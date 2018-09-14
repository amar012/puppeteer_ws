const puppeteer = require('puppeteer');
const fs = require('fs');
// const wstream = fs.createWriteStream('myOutput.json');

const CHROME_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

// user-agent as per firefox.61 request headers : Mozilla/5.0 (Windows NT 10.0; …) Gecko/20100101 Firefox/61.0
// Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0
const FIREFOX_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0';

// get last 3 months financial results data from nse with following url
const URL='https://www.nseindia.com/corporates/corpInfo/equities/getFinancialResults.jsp?start=1&limit=6651&symbol=&industry=&period=&broadcastPeriod=Last%203%20Months';

puppeteer.launch({headless: true, timeout: 180000})
						.then(async browser => {
							const page = await browser.newPage();
							await page.setUserAgent(FIREFOX_USER_AGENT);
							await page.goto(URL, {tiemout: 180000});

							const body_inner_text = await page.$eval('body', body => body.innerText); // get text between <body> tags
							
							const body_obj = eval('(' + body_inner_text + ')'); // convert string to object
							const company_meta_data = body_obj.rows; // company data is in rows array of the body_obj
							const company_meta_data_json = JSON.stringify(company_meta_data); // now convert the object to json to save to disk

							// console.log('company_meta_data :\n' + company_meta_data);
							// console.log('company_meta_data_json :\n' + company_meta_data_json);
							await fs.writeFile('./company_meta_data.json', company_meta_data_json, 'utf8', () => console.log('written file to disk'));
							
							// wstream.on('finish', function () {
  									// console.log('file has been written');
							// });
							// let i = 0;
							// for (obj in body_obj.rows) {
								// i +=1;
								// console.log(obj);
							// }
							// console.log('number of objs :' + i);
							// await wstream.end();

							// const body_obj_from_json = JSON.parse(body_obj_json); // when it is read back from disk parse it back to object
							// otherwsie its only going to be a string. Straight away using JSON.stringify without using 'eval' is not going
							// to work i.e the result is going to be a string only and not an object. So eval has to be used first.
							
							/*
							reading back the file from disk
								fs.readFile('./company_meta_data.json', 'utf8', function readFileCallback(err, data){
    															if (err){
        															console.log(err);
    															} else {
    															obj = JSON.parse(data); //now it an object
															}
													});
							*/

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

