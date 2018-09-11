async function printPageContent(page) {
	await page.content()
			.then( cont => { 
				console.log('page content of : ' + page.url() + '\n');
				console.log(cont + '\n\n');
				})
				.catch( e => console.log('Error in "page.content()" of "printPageContent()" : ' + e + '\n'));
}

async function getPageContent(page) {
	await page.content()
			.then( cont => cont)
			.catch( e => console.log('Error in "page.content()" of "gettPageContent()" : ' + e + '\n'));
}

async function printReqDetails(req) { 
		console.log('request : ' + req.url() + '\n');
		console.log('request type : ' + req.resourceType() + '\n');
}

async function printReqRespDetails(req) {
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
}	

module.exports = {
			printPageContent,
			getPageContent,
			printReqDetails,
			printReqRespDetails
		  }