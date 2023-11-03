const { BigQuery } = require("@google-cloud/bigquery");

const bigquery = new BigQuery({
	projectId: "flipkart-390013",
	credentials: {
		client_email: "bigquery-admin@flipkart-390013.iam.gserviceaccount.com",
		private_key:
			"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCn8Auycc8QlZAE\niAKSSCcY1YHHjht+Eo+QCeFKbMzGKJs4DruWo0N+ANdnlP/zklMkXwSqzb0EoKlq\nlZ4zkpnOsqUFzcGJE1zKZQqWffXE6rfY8iUsBKXujfRLr9E7ZWLaHG3bccXU0QsE\nZSEvEjhS9FdUBZHeF1WZtzt+AwYYerbUOdwBLfgOCzfx/YlhF7bZaZfwkTxiflpm\nTBRktjmmXQ3V7kz/Dxb/iOTazM+m095VU/SEemQRtLDf09GE1Pb9KNjzZo+1lCc9\nQwEZQ53NCQmZgNmsYOZmYx/7+oO/L/AmzLtxQLE3ymYUjbyt8PyVblDD14KHpvNY\npmnMYDjVAgMBAAECggEAEufHTVKaEp4frR7pmTGlsxpABqjFCAuLXVX7Zn86izlB\nhg1EiWf+PlZWaXsA2Fj54p+OvTK1i2qRv+WxflFL3tTGFpHr7mQ/XyqCR2BNNVqO\nEU5rKFoqmuEgpg+YIJVgjDjElj5n3LYexSMkWfH1ZMNMfHE3E1cxpAEYYa5x9nnV\nVZSMDEX4YZ4sJvqFL61yXi3m5Jchn6cKcCMDmY5n9tKgukLso8YGpeHQqjhQ3znH\nLooYhZGYkfNm1ky8lgZ1yAONiUs6rlfuApiUKtKownzKNsyJzBrho3S4fNmVOBUN\nqEj6JDg5/AYHVKCbzof7bZ/MS2Vf4SQg/7gqIf6zwQKBgQDY2D3Hy8S2MnzuWBWp\nT5mHdSCJtulTtDc17dbc1BF13q9TTjfb80o6DOoaYLKOiwNj+OeYnY8oknV1m5pD\nWuSJtgpgK433hHtM1EDkUsQJM0z8lZQOE6lBTadxcbeVHpSOfENmHKIAqYzMZinZ\nSqRyenEAF/AWSqKRHuGKuDWBQQKBgQDGQw1c/Lid9EbkzeMvaMPH6kiD5fGi/tfV\ndq5khhGj/xtiWL4NgVcuuAy90/b6zGsDShEL8Po8IPHpjV4bHn7fZ0pqjzVNXqTt\n26i6PhXm6yvVyfXZL1SdSUyWIreoLJTm30zY0u/uHIyUg6tTsd1bWoYpbdAlylHN\nAhj8mh5+lQKBgQC0LjpnofG6UwlsItUc8n9oBvMae1o1qzGVJiO7Kpu3jWmxlvTj\nVqz+v2xmrqKvvuL6VwBZ19H0rH3dU4ZDIWt04kaM0qQMX5D0rgmdrwglfPMjjkaP\ny9Z/5L6VjSA2UEqweqCmYHRciIXt8ZYkb9llJkhvA3UDkNC0NSzDz3zmAQKBgQCG\nKUGVtv5HBNIkap5dqosxcPx5JNUK82Cidpk0NPUjALJLLroM8YVJfApDOnha5pFT\nvH8kkYEDx1dsL9mKiGxaSM82pInxPSZmPspCnVi81k7ncK8ItNqRRNSqk/urtd9d\nC6Y44ySxAGiw5xi8nhOoie1Xg5PivrH0BINcC/6usQKBgCGMW6mZ0vOSVN0hLDcy\ng8GpPYvuMnh6HgZ0dUxMvUlQx1LxYvvPT+BOU7swMm8vbTGAc0K6Rhh07EGJUGlD\nTEiDM+w30OJ1zunEFUONTDgfZNEBn8azE+mE1kCpI9MqEAChuBL9m+FcZ9eaApn4\n41N786IxDO/jiWjyxKr+a2+k\n-----END PRIVATE KEY-----\n",
	},
});

function getData() {
	bigquery.getDatasets(function (err, datasets) {
		if (err) {
			console.log(err);
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

async function getTablesQuery(schemaName = "arvindmill") {
	try {
		const dataSet = await this.bigquery.dataset(schemaName);
		if (!dataSet) {
			console.log("in not ");
			return [];
		}
		const [tables] = await this.bigquery.dataset(schemaName).getTables();
		console.log(tables);
	} catch (e) {
		if (e.toString().indexOf("Not found")) {
			return [];
		}
		throw e;
	}
}

getTablesQuery();

module.exports = bigquery;
