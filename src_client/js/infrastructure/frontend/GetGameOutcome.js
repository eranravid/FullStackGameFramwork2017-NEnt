/*
	helper call to handle server outcome api
 */
export default class GetGameOutcome {

	constructor() {
		this.url = "";
	}

	/*
		initiate the url path of the outcome api
	 */
	init(url) {
		this.url = url;
	}

	/*
		return a promis with the data received from the api
	 */
	getOutcome() {
		return new Promise((resolve, reject) => {
			// get call to the host api url
			fetch(this.url)
				.then(result => {
					if (result.status !== 200) { // something is not connected right if not getting status 200
						console.error(`GetGameOutcome => Looks like there was a problem. Status Code: ${result.status}`);
						reject(result);
					}
					result.json().then((data) => { // return data as json to call back
						resolve(data);
					});
				})
				.catch(e => {
					console.error(`GetGameOutcome fetch error: ${e}`);
					reject(e);
				});
		});
	}

}