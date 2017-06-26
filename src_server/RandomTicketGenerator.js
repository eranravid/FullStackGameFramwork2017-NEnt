RandomBonusGenerator = require("./RandomBonusGenerator.js");

/*
	This class will generate a random ticket matrix
	It can also check for the winning type
 */
module.exports = class RandomTicketGenerator {

	constructor() {
		this.rbg = new RandomBonusGenerator();
		this.matrixCols = 1; // the number of columns we use for this game matrix
		this.matrixRows = 3; // the number of rows we use for this game matrix
		this.maxSymbolIndex = 5; // the total number of possible different symbols we use for this game matrix
	}

	/*
		returns a json representing a outcome ticket for the slot game
		a ticket consists of 
		matrix - an array representing the symbols indexes in order
		winType - 3 winning types:
			0 - no win
			1 - small win
			2 - big win
		isBonus - indicates a bonus in this round
	 */
	getTicket() {

		let randomMatrix = this.getRandomMatrixArray(this.matrixCols, this.matrixRows);
		let randomWinType = this.getWinType(randomMatrix);
		let randomBonus = this.rbg.getRandomBonus();

		let ticketObj = {
			matrix: randomMatrix,
			winType: randomWinType,
			isBonus: randomBonus
		};

		if (randomBonus) {
			ticketObj.bonusTicket = this.rbg.getBonusTicket();
		}

		return ticketObj;
	}

	/*
		creates the matrix array using random integers representing each symbol index
	 */
	getRandomMatrixArray(cols, rows) {
		// TODO : add some check for rows and cols size
		let matrix = [];
		for (let i = 0; i < cols; i++) {
			matrix.push([]);
			for (let j = 0; j < rows; j++) {
				matrix[i].push(this.getRandomIntegerBetween(0, this.maxSymbolIndex - 1));
			}
		}
		return matrix;
	}

	/*
		returns an integer between two given numbers
	 */
	getRandomIntegerBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	/*
		returns the win type according to a given matrix
		win type rules are:
		1 small win - 2 same indexes in a row in the same column 
		2 big win - 3 or more of the same indexes in a row in the same column 
		0 no win - no other win type condition met 
	 */
	getWinType(matrix) {
		let winType = 0;
		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[i].length; j++) {
				let count = this.countInArray(matrix[i], matrix[i][j]);
				if (winType < 1 && count > 1) winType = 1;
				if (winType < 2 && count > 2) winType = 2;
			}
		}
		return winType;
	}

	/*
		count the number of elements in the array
	 */
	countInArray(array, what) {
		if (!Array.isArray(array)) return new Error("must count in type Array");
		return array.filter(item => item == what).length;
	}

}