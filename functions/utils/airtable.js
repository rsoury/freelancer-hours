const Airtable = require("airtable");
const axios = require("axios");
const axiosRetry = require("axios-retry");

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
if (!apiKey) {
	console.log("Airtable API Key not loaded.");
	process.exit();
}
const endpointUrl = "https://api.airtable.com";
Airtable.configure({
	endpointUrl,
	apiKey
});
const base = Airtable.base(baseId);

const request = axios.create({
	baseURL: `${endpointUrl}/v0/${baseId}`,
	headers: {
		Authorization: `Bearer ${apiKey}`
	}
});

axiosRetry(request, {
	retries: 2
});

module.exports.request = request;
module.exports.base = base;
