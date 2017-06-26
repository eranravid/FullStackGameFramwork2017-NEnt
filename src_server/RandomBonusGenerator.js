/*
	This class will generate a random ticket matrix
	It can also check for the winning type
 */
module.exports = class RandomBonusGenerator {

	constructor() {
		this.bonusPossibility = 15; // number in percentage (0-100) representing the possibility to get a bonus round
		this.minBonusMultiplier = 10; // the minimum value of bonus multiplier randomization
		this.maxBonusMultiplier = 75; // the maxmimum value of bonus multiplier randomization
	}

	/*
	return boolean representing a random posibility of a bonus
 */
	getRandomBonus() {
		return (Math.random() < this.bonusPossibility / 100);
	}

	/*
		returns a random bonus multipler
		multiply value is between minBonusMultiplier & maxBonusMultiplier
		it then multiplied again by the luck restrict factor
	 */
	getRandomBonusMultiplier(min, max, luck) {
		return Math.floor(this.getRandomIntegerBetween(min, max) * luck);
	}

	/*
		returns an object represeting a bonus ticket
		bonus ticket consist of three win multiplier options
		one winning option
		two more losing options (decoy)
		multiply value is between minBonusMultiplier & maxBonusMultiplier
	 */
	getBonusTicket() {
		return {
			winMultiplier: this.getRandomBonusMultiplier(this.minBonusMultiplier, this.maxBonusMultiplier, 1),
			loseMultiplier: [
				this.getRandomBonusMultiplier(this.minBonusMultiplier, this.maxBonusMultiplier, 0.5),
				this.getRandomBonusMultiplier(this.minBonusMultiplier, this.maxBonusMultiplier, 1.5)
			]
		}
	}

	/*
		returns an integer between two given numbers
	 */
	getRandomIntegerBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

}