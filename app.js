const { App } = require("@slack/bolt");
const bigquery = require("./bigQuery");

require("dotenv").config();

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	socketMode: true,
	appToken: process.env.SLACK_APP_TOKEN,
});

app.message("hello", async ({ message, say }) => {
	try {
		await say("Hey there");
	} catch (error) {
		console.log(error);
	}
});

function sendMessage() {
	app.client.chat.postMessage({
		channel: "slack-integration",
		text: "This is a test message!",
	});
}

(async () => {
	// Start your app
	await app.start(process.env.PORT || 3000);

	console.log("⚡️ Bolt app is running!");

	sendMessage();
})();
