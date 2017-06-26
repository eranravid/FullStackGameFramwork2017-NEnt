export default class config {

	constructor() {

		// define the game (canvas) width & height
		this.gameWidth = 950;
		this.gameHeight = 500;

		// the number of colomns and rows in the slot machine matrix
		this.cols = 3;
		this.rows = 1;

		// define the starting position (x,y)(top,left) 
		// of where to start draw symbols on the main game screen
		// the game in turn draw symbols automatically
		this.symbolsLeftStartPosition = 60;
		this.symbolsTopStartPosition = 150;
		this.symbolsPadding = 80;

		// game && preloader background color
		this.gameBGColor = "#113171";
		this.preloaderBGColor = "#313131";

		// define the symbol asset mapping as they are presented in the assets folder
		// the symbols indexes are corolate to the matrix given from server
		// for example [0,1,2] matrix coming from the server will show symbols -
		// 'symbol_0, symbol_1, symbol_2' accordingly
		this.symbolMap = [
			'Symbol_0',
			'Symbol_1',
			'Symbol_2',
			'Symbol_3',
			'Symbol_4',
			'Symbol_5'
		];

		// mapping the win type indexes and the massage they show
		this.winTypes = [
			"No Win",
			"Normal Win",
			"Big Win!"
		];

		// === ui ===
		this.buttonProperties = {
			spriteID: "button",
			x: this.gameWidth / 2,
			y: this.gameHeight - 100,
			anchor: {
				x: 0.5,
				y: 0.5
			}
		};

		this.winTypeTextProperties = {
			text: "Good Luck!",
			textStyle: {
				font: "30px Comic Sans MS",
				fillStyle: "red",
				textAlign: "center"
			},
			x: this.gameWidth / 2,
			y: 100
		};

		this.bonusTextProperties = {
			text: "",
			textStyle: {
				font: "30px Comic Sans MS",
				fillStyle: "red",
				textAlign: "center"
			},
			x: this.gameWidth / 2,
			y: 400
		};

		this.errorTextProperties = {
			text: "",
			textStyle: {
				font: "18px Comic Sans MS",
				fillStyle: "red",
				textAlign: "center"
			},
			x: this.gameWidth / 2,
			y: 475
		};

		// === bonus ===
		this.bonusBGColor = "#A37313";
		// start bonus
		this.bonusWelcomeMessage = "Congratulation, you won a bonus game!"; // welcome intro message for bonus
		this.bonusWelcomeCountdownMessage = "Your bonus game will start in.."; // message to show in intro count down
		this.bonusWelcomeCountdownTime = 3; // time in seconds to start bonus
		// end bonus
		this.bonusEndMessage = "Congratulation, you won "; // end message for bonus
		this.bonusEndCountdownMessage = "Return to main game in.."; // message to show in outro count down
		this.bonusendCountdownTime = 3; // time in seconds to end bonus

		// bonus title text component
		this.titleTextProperties = {
			text: "Bonus Game",
			textStyle: {
				font: "30px Comic Sans MS",
				fillStyle: "blue",
				textAlign: "center"
			},
			x: this.gameWidth / 2,
			y: 80
		};

		// bonus desc text component
		this.descTextProperties = {
			text: "Choose one of three bonus items",
			textStyle: {
				font: "30px Comic Sans MS",
				fillStyle: "blue",
				textAlign: "center"
			},
			x: this.gameWidth / 2,
			y: 120
		};

		// bonus outro message text component
		this.outroTextProperties = {
			text: "",
			textStyle: {
				font: "30px Comic Sans MS",
				fillStyle: "blue",
				textAlign: "center"
			},
			x: this.gameWidth / 2,
			y: 400
		};

		// the bonus items properties which are essentially buttons components
		this.bonusItemsProperties = [{
			spriteID: "symb3",
			x: this.gameWidth / 6,
			y: this.gameHeight / 2,
			anchor: {
				x: 0.5,
				y: 0.5
			}
		}, {
			spriteID: "symb3",
			x: this.gameWidth / 2,
			y: this.gameHeight / 2,
			anchor: {
				x: 0.5,
				y: 0.5
			}
		}, {
			spriteID: "symb3",
			x: this.gameWidth / 6 * 5,
			y: this.gameHeight / 2,
			anchor: {
				x: 0.5,
				y: 0.5
			}
		}];

		// bonus items that shows after revealing all bonus items
		// text are dynamically allocated with ticket's multipliers
		this.bonusItemsTextsProperties = [{
			text: "",
			textStyle: {
				font: "30px Comic Sans MS",
				fillStyle: "blue",
				textAlign: "center"
			},
			x: this.gameWidth / 6,
			y: this.gameHeight / 2,
		}, {
			text: "",
			textStyle: {
				font: "30px Comic Sans MS",
				fillStyle: "blue",
				textAlign: "center"
			},
			x: this.gameWidth / 2,
			y: this.gameHeight / 2,
		}, {
			text: "",
			textStyle: {
				font: "30px Comic Sans MS",
				fillStyle: "blue",
				textAlign: "center"
			},
			x: this.gameWidth / 6 * 5,
			y: this.gameHeight / 2,
		}];

		// === assets manifest ===
		// used by preloader to load all assets
		this.assetsManifest = [{
			id: 'button',
			path: './assets/images/button.png'
		}, {
			id: 'symb0',
			path: './assets/images/Symbol_0.png'
		}, {
			id: 'symb1',
			path: './assets/images/Symbol_1.png'
		}, {
			id: 'symb2',
			path: './assets/images/Symbol_2.png'
		}, {
			id: 'symb3',
			path: './assets/images/Symbol_3.png'
		}, {
			id: 'symb4',
			path: './assets/images/Symbol_4.png'
		}, {
			id: 'symb5',
			path: './assets/images/Symbol_5.png'
		}];


	}

}