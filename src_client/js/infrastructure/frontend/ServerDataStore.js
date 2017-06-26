const queryString = require('query-string');

/*
	Stores the server's data
	url pathes are hardcoded here
	this is also where client data and server status could be stored if needed (for example)
 */
export default class ServerDataStore {

	constructor() {
		this.clientData = null; // if any client specific data (token etc.) that comes from the server, store it here
		this.lastTicketData = null; // storing the current or last raw ticket as recieved from the server

		// query string data
		this.queryData = null;

		// status
		this.status = {};
		this.status.errCode = null;
		this.status.errMessage = null;
		this.status.errType = null;
		this.status.balance = null;

		// api
		this.host_url = ""; // fetched from the query string. an example "http://localhost:3005"
		this.notify_url = "/notify";
		this.getGameOutcome_url = "/getOutcome";

	}

	/*
		initiate query string & data
	 */
	init() {
		this.queryData = queryString.parse(location.search);
		this.resolvePath();
		this.initClientData();
	}

	/*
		resolve the api pathes accordint to the host_url received from the query string
	 */
	resolvePath() {
		this.host_url = this.queryData.host_url;
		this.notify_url = this.host_url + this.notify_url;
		this.getGameOutcome_url = this.host_url + this.getGameOutcome_url;
	}

	/*
		example of usage
	 */
	initClientData() {
		this.clientData = {
			clientToken: this.queryData.clientToken,
			clientId: this.queryData.clientToken
		};
	}

}