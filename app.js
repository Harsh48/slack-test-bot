const { App } = require("@slack/bolt");
const { BigQuery } = require("@google-cloud/bigquery");
const { project_id, client_email, private_key } = require("./constants");
const cron = require("node-cron");

require("dotenv").config();

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	socketMode: true,
	appToken: process.env.SLACK_APP_TOKEN,
});

const bigquery = new BigQuery({
	projectId: project_id,
	credentials: {
		client_email: client_email,
		private_key: private_key,
	},
});

app.message("hello", async ({ message, say }) => {
	try {
		await say("Hey there");
	} catch (error) {
		console.log(error);
	}
});

function sendMessage(channel, message) {
	app.client.chat.postMessage({
		channel: channel,
		text: message,
	});
}

(async () => {
	// Start your app
	await app.start(process.env.PORT || 3000);

	console.log("⚡️ App is running!");
})();

const date = new Date();
const yesterday = new Date(date.setDate(date.getDate() - 1));
const sevenDaysAgo = new Date(date.setDate(date.getDate() - 7));
const formattedDate = yesterday.toISOString().split("T")[0];

const sevenDaysAgoFormattedDate = sevenDaysAgo.toISOString();

async function getDataNew(projectId, datasetId, tableId, startDate) {
	const query = `
		SELECT * from \`${projectId}.${datasetId}.${tableId}\`
		WHERE date > '2023-10-08'
	`;

	const options = {
		query: query,
	};

	const [job] = await bigquery.createQueryJob(options);
	console.log(`Job ${job.id} started\n`);

	const rows = await job.getQueryResults();
	// console.log(rows);

	return rows[0];
}

async function getDataKeywordReport(projectId, datasetId, tableId, startDate) {
	const query = `
		SELECT * from \`${projectId}.${datasetId}.${tableId}\`
		WHERE to_date > CAST('2023-10-08' AS DATE)
	`;

	const options = {
		query: query,
	};

	const [job] = await bigquery.createQueryJob(options);
	console.log(`Job ${job.id} started\n`);

	const rows = await job.getQueryResults();
	// console.log(rows);

	return rows[0];
}

async function sendCampaignInefficientNotification() {
	try {
		const campaignData = await getDataNew(
			"flipkart-390013",
			"relaxo",
			"PLA_Consolidated_Daily_Report",
			formattedDate
		);

		const inefficientCampaigns = [];

		for (data of campaignData) {
			const { ad_spend, direct_revenue, indirect_revenue } = data;
			const roas = (direct_revenue + indirect_revenue) / ad_spend;

			if (ad_spend > 10000 && roas < 1) {
				// console.log("Campaign trigger");
				inefficientCampaigns.push(data.campaign_id);
			}
		}

		if (inefficientCampaigns.length > 0) {
			const campaigns = inefficientCampaigns.join(", ");

			sendMessage(
				"campaign-inefficient",
				`Your following Campaigns are not efficient:\n\n ${campaigns}`
			);
		}
	} catch (error) {
		console.log(error);
	}
}

async function sendHighCpcNotification() {
	try {
		const campaignData = await getDataNew(
			"flipkart-390013",
			"relaxo",
			"PLA_Consolidated_Daily_Report",
			formattedDate
		);

		const highCpcCampaigns = [];

		for (data of campaignData) {
			const { ad_spend, clicks } = data;
			const cpc = ad_spend / clicks;

			if (cpc > 100) {
				// high cpc trigger
				highCpcCampaigns.push(data.adgroup_name);
			}
		}

		if (highCpcCampaigns.length > 0) {
			const campaigns = highCpcCampaigns.join(", ");

			sendMessage(
				"high-cpc",
				`Your Cost per Click is getting expensive in the following ad groups:\n\n
					${campaigns}`
			);
		} else {
			sendMessage("high-cpc", "Your campaigns are running as expected!");
		}
	} catch (error) {
		console.log(error);
	}
}

async function sendLowConversionRateNotification() {
	try {
		const campaignData = await getDataKeywordReport(
			"flipkart-390013",
			"relaxo",
			"PCA_Keyword_Report",
			sevenDaysAgoFormattedDate
		);

		const lowConversionRateCampaigns = [];
		// console.log(campaignData);

		// ((direct units+indirect units)/clicks)*100

		for (data of campaignData) {
			const { direct_converted_units, indirect_converted_units, clicks } = data;
			const cr =
				((direct_converted_units + indirect_converted_units) / clicks) * 100;

			if (cr < 1) {
				// low conversion rate trigger
				lowConversionRateCampaigns.push(data.campaign_name);
			}
		}

		if (lowConversionRateCampaigns.length > 0) {
			const campaigns = lowConversionRateCampaigns.join(", ");

			sendMessage(
				"#low-conversion-rate",
				`Your Conv Rate has dropped in the following targeting type:\n\n ${campaigns}`
			);
		} else {
			sendMessage("#low-conversion-rate", "Your campaigns have good CR");
		}
	} catch (error) {
		console.log(error);
	}
}

async function sendNotifications() {
	await sendCampaignInefficientNotification();
	await sendHighCpcNotification();
	await sendLowConversionRateNotification();
}

cron.schedule(
	"* * * * *",
	async () => {
		console.log("cron job running");
		await sendNotifications();
	},
	{
		scheduled: true,
		timezone: "Asia/Kolkata",
	}
);
