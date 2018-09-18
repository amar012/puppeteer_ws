const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');

const xml_dir = './xbrl_folder/';
// const file_name = '20MICRONS_01_Apr_2018_To_30_Jun_2018_INDAS_38042_32504_08082018025203_WEB.xml';
// const file_name ='3MINDIA_01_Apr_2017_To_31_Mar_2018_INDAS_36362_13427_30052018072914_WEB.xml';
const file_name = 'ABCAPITAL_01_Apr_2018_To_30_Jun_2018_INDAS_38470_33887_10082018080541_WEB.xml';
// the following is not a proper xml file, though teh extension of xml is given
// const file_name = '5PAISA_01_Apr_2017_To_31_Mar_2018_NONINDAS_34617_16368_29062018043218_WEB.xml';
const file_path = `${xml_dir}${file_name}`;

// List of tags to get info from
const rootTag = 'xbrli:xbrl';

// General Info tags
const symbolTag = 'in-bse-fin:Symbol';
const startDateTag = 'in-bse-fin:DateOfStartOfReportingPeriod';
const endDateTag =  'in-bse-fin:DateOfEndOfReportingPeriod';
const auditedTag = 'in-bse-fin:WhetherResultsAreAuditedOrUnaudited';
const segmentsTag = 'in-bse-fin:IsCompanyReportingMultisegmentOrSingleSegment';
const stadaloneTag = 'in-bse-fin:NatureOfReportStandaloneConsolidated';

// P&L A/c info
const revenueTag = 'in-bse-fin:RevenueFromOperations';
const otherIncomeTag = 'in-bse-fin:OtherIncome';
const incomeTag = 'in-bse-fin:Income';
const costOfMaterialsTag = 'in-bse-fin:CostOfMaterialsConsumed';
const inventoryChangeTag = 'in-bse-fin:ChangesInInventoriesOfFinishedGoodsWorkInProgressAndStockInTrade';
const purStockInTradeTag = 'in-bse-fin:PurchasesOfStockInTrade';
const empCostTag = 'in-bse-fin:EmployeeBenefitExpense';
const finCostTag = 'in-bse-fin:FinanceCosts';
const depreciationTag = 'in-bse-fin:DepreciationDepletionAndAmortisationExpense';
const otherExpTag = 'in-bse-fin:OtherExpenses';
const expTag = 'in-bse-fin:Expenses';
const profBeforeTaxTag = 'in-bse-fin:ProfitBeforeTax';
const taxExpTag = 'in-bse-fin:TaxExpense';
const profLossTag = 'in-bse-fin:ProfitLossForPeriod';

// Balance Sheet info
const paidUpCapTag = 'in-bse-fin:PaidUpValueOfEquityShareCapital';
const faceShareFaceValueTag = 'in-bse-fin:FaceValueOfEquityShareCapital';
const basicEarningsPerShareTag = 'in-bse-fin:BasicEarningsLossPerShareFromContinuingOperations';
const debtEqRatioTag = 'in-bse-fin:DebtEquityRatio';
const debtServiceCoverageRatioTag = 'in-bse-fin:DebtServiceCoverageRatio';
const intServiceCoverageRatioTag = 'in-bse-fin:InterestServiceCoverageRatio';

// Business Segments info
const reportableSegmentsTag = 'in-bse-fin:DescriptionOfReportableSegment'; // this is an array


( async () => {
	await fs.readFile( file_path, async (err, data) => {
		if (err) throw err;
		const parser = new xml2js.Parser();
		await parser.parseString(data, async (e, xml) => {
			// without util.inspect the console.log of an object will be printed as "[object Object]" rather than printing members of object
			// console.log(util.inspect(xml, false, null));

			if (typeof xml[`${rootTag}`] === "undefined") {
				console.log('This is not an xbrl file.\nExiting');
				return;
			}
			await printBasicInfo(xml);
			await printProfitLossInfo(xml);
			await printBalanceSheetInfo(xml);
			await printBusinessSegmentsInfo(xml);

			console.log('\n----------Done----------');
		})
	})

	function printBasicInfo(xml) {
		const tagsArray =[ `${symbolTag}`,`${startDateTag}`,`${endDateTag}`,`${auditedTag}`,`${segmentsTag}`,`${stadaloneTag}` ];

		const descArray =[ 'Symbol', 'Start Date', 'End Date', 'Whether Audited','Segments','Whether Standalone' ];
		console.log(`\n---------Basic Information of ${xml[`${rootTag}`][`${symbolTag}`]['0']['_']}----------\n`);
		for (let i =0; i < tagsArray.length; i++) {
			if (typeof xml[`${rootTag}`][tagsArray[i]] !== "undefined") { console.log('\t' + descArray[i] + ' -> ' + xml[`${rootTag}`][tagsArray[i]]['0']['_']); }
			// else { console.log(`\t The tag <${tagsArray[i]}> is not present in the given xml document`); }
			else { console.log(`\t There is no data relating to "${descArray[i]}" for this company`); }
		}
	}

	function printProfitLossInfo(xml) {
		const tagsArray =[ `${revenueTag}`,`${otherIncomeTag}`,`${incomeTag}`,`${costOfMaterialsTag}`,`${inventoryChangeTag}`,`${purStockInTradeTag}`,
				   `${empCostTag}`,`${finCostTag}`,`${depreciationTag}`,`${otherExpTag}`,`${expTag}`,`${profBeforeTaxTag}`,`${taxExpTag}`,`${profLossTag}`];
		const descArray =[ 'Revenue', 'Other Income', 'Income', 'Cost of Materials Consumed','Change In Inventory','Purchase of Stock-in-Trade',
				   'Employee Benefit Cost', 'Finance Cost', 'Depreciation', 'Other Expenses', 'Total Expenses', 'Profit//Loss Before Tax',
				   'Tax', 'Prfit//Loss'  ];
		console.log(`\n---------Profit And Loss Account Information of ${xml[`${rootTag}`][`${symbolTag}`]['0']['_']}----------\n`);
		for (let i =0; i < tagsArray.length; i++) {
			if (typeof xml[`${rootTag}`][tagsArray[i]] !== "undefined") { console.log('\t' + descArray[i] + ' -> ' + xml[`${rootTag}`][tagsArray[i]]['0']['_']); }
			// else { console.log(`\t The tag <${tagsArray[i]}> is not present in the given xml document`); }
			else { console.log(`\t There is no data relating to "${descArray[i]}" for this company`); }
		}
	}

	function printBalanceSheetInfo(xml) {
		const tagsArray =[ `${paidUpCapTag}`,`${faceShareFaceValueTag}`,`${basicEarningsPerShareTag}`,`${debtEqRatioTag}`,
				   `${debtServiceCoverageRatioTag}`,`${intServiceCoverageRatioTag}` ];
		const descArray =[ 'Paid Up Capital', 'Face Value of Share', 'Basic Earnings per Share','Debt Equity Ratio','Debt Service Coverage Ratio',
				   'Interest Service Coverage Ratio' ];
		console.log(`\n---------Balance Sheet Information of ${xml[`${rootTag}`][`${symbolTag}`]['0']['_']}----------\n`);
		for (let i =0; i < tagsArray.length; i++) {
			// console.log(xml[`${rootTag}`][i]['0']['_']);
			// console.log(descArray[i] + ' -> ' + xml[`${rootTag}`][tagsArray[i]]['0']['_']);
			if (typeof xml[`${rootTag}`][tagsArray[i]] !== "undefined") { console.log('\t' + descArray[i] + ' -> ' + xml[`${rootTag}`][tagsArray[i]]['0']['_']); }
			// else { console.log(`\t The tag <${tagsArray[i]}> is not present in the given xml document`); }
			else { console.log(`\t There is no data relating to "${descArray[i]}" for this company`); }
		}
	}

	function printBusinessSegmentsInfo(xml) {
		const businessSegments = xml[`${rootTag}`][`${reportableSegmentsTag}`];
		console.log(`\n---------Business Segments of ${xml[`${rootTag}`][`${symbolTag}`]['0']['_']}----------\n`);

		if (typeof businessSegments !== "undefined") {
			for (let i =0; i < businessSegments.length; i++) {
				console.log(`\t ${i+1} - ` + businessSegments[i]['_']);
			}
		} else {
			// console.log(`\t The tag <${rootTag}${reportableSegmentsTag}> is not present in the given xml document`);
			console.log(`\t There are no "Business Segments" for this company`);
		}
		// console.log(xml[`${rootTag}`][`${reportableSegmentsTag}`]);
	}
})();