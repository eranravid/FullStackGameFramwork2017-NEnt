import ServerDataStore from "./ServerDataStore.js";
import GetGameOutcome from "./GetGameOutcome.js";

/*
	server facade - the frontend face
	use this class to call or use the server from any where in the client side
 */
export default class Server_Facade {

	constructor() {

		// server data store hold static parameter of the server
		// such as the api paths and outcome data
		this.sd = new ServerDataStore();
		// helper class to call the outcome api
		this.gg = new GetGameOutcome(this.sd);

	}

	/*
		initiate the server
	 */
	init() {
		// initiate data store
		this.sd.init();
		// initiate get game outcome using the stored url
		this.gg.init(this.sd.getGameOutcome_url);
	}

	/*
		call the server to check if alive
	 */
	notify() {
		return new Promise((resolve, reject) => {
			fetch(this.sd.notify_url)
				.then(result => {
					if (result.status !== 200) { // something is not connected right if not getting status 200
						console.error(`Notify => Looks like there was a problem. Status Code: ${result.status}`);
						reject(result);
					}
					resolve(result);
				})
				.catch(e => {
					console.error(`Notify fetch error: ${e}`);
					reject(e);
				});
		});
	}

	/*
		game object dont get direct access to the GetGameOutcome object
		use this function to call api
		this function returns a promis with the data resolved
	 */
	getGameOutcome() {
		return new Promise((resolve, reject) => {
			this.gg.getOutcome().then((data) => {
				this.sd.lastTicketData = data;
				resolve(data);
			}).catch((reason) => {
				reject(reason);
			});
		});
	}

}