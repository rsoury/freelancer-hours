const isProd = process.env.NODE_ENV === "production";
// const isTest = process.env.NODE_ENV === "test";

module.exports = {
	presets: ["react-app"],
	plugins: [].concat(isProd ? [] : [])
};
