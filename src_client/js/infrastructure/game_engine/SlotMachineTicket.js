import BonusTicket from "./bonus/BonusTicket.js";

/*
	Ticket parser for the slot machine game
	feed this ticket object with raw data from the server api
	and get a parsed ticket data ready to work with
 */
export default class SlotMachineTicket {

	constructor(ticket) {

		this.rawTicket = ticket;

		this.matrix = null;
		this.winType = null;
		this.isBonus = null;
		this.bonusTicket = null;

	}

	/*
		return a promise with the parsed ticket, this
	 */
	parseTicket() {
		return new Promise((resolve, reject) => {
			this.matrix = this.rawTicket.matrix[0]; // validations
			this.winType = this.rawTicket.winType;
			this.isBonus = this.rawTicket.isBonus;
			if (this.isBonus === true) {
				new BonusTicket(this.rawTicket.bonusTicket).parseTicket().then(parsedTicket =>
					this.bonusTicket = parsedTicket
				);
			}
			resolve(this);
		});
	}

}