const { App } = require("@slack/bolt");
// const bigquery = require("./bigQuery");
const { BigQuery } = require("@google-cloud/bigquery");
const { project_id, client_email, private_key } = require("./constants");

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

function sendMessage() {
	app.client.chat.postMessage({
		channel: "internal",
		text: "This is a test message!",
	});
}

(async () => {
	// Start your app
	await app.start(process.env.PORT || 3000);

	console.log("⚡️ Bolt app is running!");

	sendMessage();
})();

app.message("hello", async ({ message, say }) => {
	try {
		await say("Hello there!");
	} catch (error) {
		console.log(error);
	}
});

function getData() {
	bigquery.getDatasets(function (err, datasets) {
		if (err) {
			console.log("error");
			console.log({ err });
		} else {
			// datasets is an array of Dataset objects.
			console.log(
				datasets[0].getTables(function (err, tables) {
					let result = [];

					for (let key in tables) {
						result.push(tables[key].id);
					}
					console.log(result);
					// res.send(result);
				})
			);
		}
	});
}

getData();
