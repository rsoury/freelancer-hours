const path = require("path");
const _set = require("lodash.set");
const _get = require("lodash.get");
const { getPaths, edit } = require("@rescripts/utilities");
const postcssFlexibility = require("postcss-flexibility");

const mw = fn => Object.assign(fn, { isMiddleware: true });

const isPostcssLoader = inQuestion =>
	inQuestion &&
	inQuestion.loader &&
	inQuestion.loader.includes("postcss-loader");

const addAlias = mw(config => {
	const alias = _get(config, "resolve.alias");
	if (typeof alias !== "undefined") {
		config = _set(
			config,
			"resolve.alias",
			Object.assign({}, alias, {
				"@": path.resolve(__dirname, "./src")
			})
		);
	}
	// console.log(require("util").inspect(config, false, null, true));
	// process.exit(1);
	return config;
});

module.exports = [["use-babel-config", ".babelrc.js"], addAlias];
