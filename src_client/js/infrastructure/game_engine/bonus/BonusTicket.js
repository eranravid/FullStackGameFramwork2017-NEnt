/*
	Ticket parser for the bonus game
	feed this ticket object with raw data from the server api
	and get a parsed ticket data ready to work with
 */
export default class BonusTicket {

	constructor(ticket) {

		this.rawTicket = ticket;

		this.winMultiplier = null;
		this.loseMultipliers = [];

	}

	/*
		return a promise with the parsed ticket, this
	 */
	parseTicket() {
		return new Promise((resolve, reject) => {
			if (typeof this.rawTicket.winMultiplier !== 'undefined' && this.rawTicket.winMultiplier !== null && typeof this.rawTicket.loseMultiplier !== 'undefined' && this.rawTicket.loseMultiplier !== null) {
				this.winMultiplier = this.rawTicket.winMultiplier;
				this.loseMultipliers = this.rawTicket.loseMultiplier;
				resolve(this);
			} else {
				resolve(null);
			}
		});
	}

}