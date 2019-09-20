import axios from "axios";
import _memoize from "lodash.memoize";
import Path from "path-parser";

const functionsUrl = process.env.REACT_APP_FUNCTIONS_URL;
const path = new Path("/:client");
const { client } = path.test(window.location.pathname) || {};
const request = axios.create({
	baseURL: functionsUrl || `http://localhost:9000`,
	params: {
		client
	}
});

const _getClient = () => request.get(`/${client}`).then(({ data }) => data);
export const getClient = _memoize(_getClient);

export const requestTopUp = ({ email, numberOfHours, total }) =>
	request
		.post(`/${client}/top-up`, {
			"Invoice Email": email,
			"Number of Hours": numberOfHours,
			Total: parseFloat(total)
		})
		.then(({ data }) => data);
