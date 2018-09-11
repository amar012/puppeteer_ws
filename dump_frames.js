const puppeteer = require('puppeteer');

const URL = 'https://www.nseindia.com/corporates/corpInfo/equities/FinancialResults.html?radio_btn=&param=';

puppeteer.launch({
		   headless: false,
		   devtools: true,
		})
		.then(async browser => {
			const page = await browser.newPage();
			await page.goto(URL, {timeout: 180000});
			dump_frames(page.mainFrame(), '  ');

			async function dump_frames(frame, indent) {
				console.log(indent + "The URL of the this frame is : " + indent + indent + frame.url() + "\n");
				console.log(indent + "Number of child frames in " + frame.url() + " is: " + indent + indent + frame.childFrames().length + "\n");

				await frame.content()
						     .then(content => console.log('\t' + "The content of this frame is:\n" + "\t" + "\t" + content + "\n") )
						     .catch(e => console.log("Error in 'frame.content()' :", e));
				

				for (let fr of frame.childFrames()){
					dump_frames(fr, '    ');
				}
			} 
		})
		.catch(e => console.log("Error in 'puppeteer.launch()' :", e));