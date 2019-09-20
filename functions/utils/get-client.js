/**
 * Function that retrieves client from Airtable based on the provided name.
 */

const _startCase = require("lodash.startcase");
const { request } = require("./airtable");

const getClients = () =>
	request
		.get("/Clients?maxRecords=1000&view=Grid%20view")
		.then(({ data }) => data)
		.then(({ records }) => records);

const getClient = async c => {
	const clients = await getClients();
	const client = clients.find(
		client => client.fields.Name === _startCase(c).trim()
	);
	return client;
};

module.exports.getClients = getClients;
module.exports.getClient = getClient;
