// console.log(bigquery);

// function getData() {
// 	bigquery.getDatasets(function (err, datasets) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			// datasets is an array of Dataset objects.
// 			console.log(
// 				datasets[0].getTables(function (err, tables) {
// 					let result = [];

// 					for (let key in tables) {
// 						result.push(tables[key].id);
// 					}
// 					console.log(result);
// 					// res.send(result);
// 				})
// 			);
// 		}
// 	});
// }

// getData();

// async function getTablesQuery(schemaName = "arvindmill") {
// 	try {
// 		const dataSet = await this.bigquery.dataset(schemaName);
// 		if (!dataSet) {
// 			return [];
// 		}
// 		const [tables] = await this.bigquery.dataset(schemaName).getTables();
// 		console.log(tables);
// 	} catch (e) {
// 		if (e.toString().indexOf("Not found")) {
// 			return [];
// 		}
// 		throw e;
// 	}
// }

// getTablesQuery();

// module.exports = getTablesQuery;
