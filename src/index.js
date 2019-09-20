import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "raf/polyfill";
import "url-search-params-polyfill";
import "mdn-polyfills/Node.prototype.append";

import { detect } from "detect-browser";

const browser = detect();
(async () => {
	if (browser.name === "ie") {
		await import("./polyfill.css");
	}
	await import("./render");
})();
