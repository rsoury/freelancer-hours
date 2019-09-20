const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const _snakeCase = require("lodash.snakecase");
const pino = require("pino")();
const pinoExpress = require("pino-express");

const { getClient } = require("./utils/get-client");
const { base } = require("./utils/airtable");

const isProd = process.env.NODE_ENV === "production";

const app = express();

// add middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(pinoExpress(pino));
app.disable("x-powered-by");

/**
  1. Get all records
  2. Find the appropriate one based on the request query params
  3. Obtain remaining hours.
*/
app.get("/:client", async (req, res, next) => {
	try {
		req.log.info(req.params.client);
		const client = await getClient(req.params.client);

		if (client) {
			const fields = Object.entries(client.fields).reduce(
				(accumulator, [key, value]) => {
					accumulator[_snakeCase(key)] = value;
					return accumulator;
				},
				{}
			);
			console.log({
				action: "get-client",
				body: fields,
				client
			});

			return res.status(200).send(fields);
		}

		return next();
	} catch (e) {
		return next(e);
	}
});

/**
  1. Handle preflight request
  2. Parse body
  3. Get client
  4. Create top up with reference to client.
*/
app.post("/:client/top-up", async (req, res, next) => {
	try {
		const client = await getClient(req.params.client);

		const params = {
			...req.body
		};
		if (client) {
			params.Client = [client.id];

			const record = await new Promise((resolve, reject) => {
				base("Top Ups").create(params, (err, record) => {
					if (err) {
						return reject(err);
					}
					return resolve(record);
				});
			});

			return res.status(200).send({
				id: record.getId()
			});
		}

		return next();
	} catch (e) {
		return next(e);
	}
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	req.log.error(err);
	res.status(err.status || 500);
	res.json(
		isProd
			? {
					object: "error",
					type: err.status,
					message: err.message
			  }
			: {
					object: "error",
					type: err.status,
					message: err.message,
					trace: err
			  }
	);
});

module.exports.handler = serverless(app);
