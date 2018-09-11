const puppeteer = require('puppeteer');

const CHROME_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

// user-agent as per firefox.61 request headers : Mozilla/5.0 (Windows NT 10.0; …) Gecko/20100101 Firefox/61.0
// Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0
const FIREFOX_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0';

const URL='https://github.com';

puppeteer.launch({headless: true, timeout: 60000})
						.then(async browser => {
							const page = await browser.newPage();
							await page.setUserAgent(FIREFOX_USER_AGENT);
							await page.goto(URL);

							await page.content()
									.then( cont => { 
										console.log('page content of : ' + page.url() + '\n');
										console.log(cont + '\n\n');
									})
									.catch( e => console.log('Error in "page.content()" ' + e + '\n'));

							await page.on('request', req => { 
									console.log('request : ' + req.url() + '\n');
									console.log('request type : ' + req.resourceType() + '\n');
								});

							await page.on('requestfinished', async req => { 
												await console.log('request successful: ' + req.url() + '\n');
												
												const res = await req.response();
												if (res != null) {
													res.text()
														.then(body => { 
															if (body != '') {
																console.log('response body text:\n');
																console.log(body + '\n');
															} else {
																console.log('The request: ' + req.url() + ' has no body text\n');
															}

														})
														.catch(e => console.log('Error in "res.text()" :' + e + '\n'));
												} else {
													console.log('The request: ' + req.url() + ' is null\n');
												}
												
												const res_headers =  res.headers();
												console.log('The request response headers are :\n');
												for (const k in res_headers) {
													console.log(k + ' -> ' + res_headers[k]);
												}
												console.log('\n');
											});

							await page.on('requestfailed', req => console.log('request failed: ' + req.url() + ' - ' + req.failure().errorText) + '\n');

							await page.waitFor(60000)
										.then(async () => {
											await page.close().catch(e => console.log('Error in "page.close()" :' + e + '\n'));
											await browser.close().catch(e => console.log('Error in "browser.close()" :' + e + '\n'));
										})
										.catch(e => console.log('Error in "page.waitFor()" :' + e + '\n'));
							
						})
						.catch(e => console.log('Error in "puppeteer.launch()" :' + e + '\n'));

