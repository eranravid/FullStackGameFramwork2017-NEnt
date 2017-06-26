import SlotMachineTicket from "./SlotMachineTicket.js";
import BonusGame from "./bonus/BonusGame.js";
import UI_Manager from "../ui/UI_Manager.js";
import Symbol from "./Symbol.js";

const STATUS_IDLE = 0; // game flow status idle - game can start round
const STATUS_PLAYING = 1; // game flow status playing - game cannot start round

/*
	Abstract calss to define a Slot Machine game.
	do not initiate this class - extend this class to make a game instance in the games folder
	use the game instance to extend functionality or change the config file to make static changes such as positioning and text changes.
 */
export default class SlotMachine {

	constructor(canvas, ctx, server, config, assetsManager) {

		// refrence to the html canvas & context
		this.canvas = canvas;
		this.ctx = ctx;

		// server & ui components
		this.server = server; // received from main
		this.ui = null; // initiated in initUI function below

		// config file of specific game
		this.config = config;
		// asset manager
		this.assetsManager = assetsManager;

		// define the game (canvas) width & height
		this.gameWidth = this.config.gameWidth;
		this.gameHeight = this.config.gameHeight;
		this.canvas.width = this.gameWidth;
		this.canvas.height = this.gameHeight;

		// the number of colomns and rows in the slot machine matrix
		this.cols = this.config.cols;
		this.rows = this.config.rows;

		// game flow status
		this.gameStatus = STATUS_IDLE;

		// the current working ticket
		// changed once a new game outcome is received from the server
		this.currentTicket = null;

		// bonus game object reference
		// initiated on a start bonus game call
		// cleared once bonus game is finished and returned to main game
		this.bonusGame = null;

		// the slot machine game symbols - Symbol objects
		this.symbols = [];
		// maping of assets to symbol by indexes
		this.symbolMap = this.config.symbolMap;

	}

	// initiate game elements
	initGame() {
		this.initSymbols();
		this.initUI();
	}

	/*
		initiate ui manager, use the game config file to make static changes to ui
	 */
	initUI() {
		this.ui = new UI_Manager(this, this.config);
		this.ui.onButtonClicked = () => {
			this.playNextRound();
		}
		this.ui.init();

		this.update();
	}

	/*
		initiate symbols sprite in the slot machine matrix
	 */
	initSymbols() {
		for (let i = 0; i < this.cols; i++) {
			let sprite = this.assetsManager.getSprite('symb' + i);
			let symb = new Symbol(
				i,
				sprite,
				this.config.symbolsLeftStartPosition + i * (this.config.symbolsPadding + sprite.width),
				this.config.symbolsTopStartPosition);
			this.symbols.push(symb);
		}
	}

	/*
		start a new round
		starting new round is only possible if game state is on idle
		while playing, right after starting, another round cannot be started
		case could not get response from the server, show error
		game is not stuck, waiting 2 seconds delay to resume and let the player try again
		after main game round finish, 
		if a bonus is given, wait for it to finish before come back to idle
		if no bonus is given, go back to idle
	 */
	playNextRound() {
		if (this.gameStatus !== STATUS_IDLE) return;
		this.gameStatus = STATUS_PLAYING;
		this.ui.lockUI();
		this.server.getGameOutcome().then((ticket) => {
			this.currentTicket = new SlotMachineTicket(ticket);
			this.currentTicket.parseTicket().then((parsedTicket) => {
				this.updateSymbols(parsedTicket.matrix);
				this.updateWinTypeText(parsedTicket.winType);
				let isBonus = this.checkForBonus(parsedTicket);
				if (!isBonus) {
					this.finishRound();
				}
			});
		}).catch((reason) => {
			console.error('server issue, please try again later');
			this.ui.showErrorMessage('server issue, please try again later');
			setTimeout(() => {
				this.ui.hideErrorMessage();
			}, 2000)
			this.finishRound();
		});
	}

	/*
		update the symbol matrix and changing thier sprites
	 */
	updateSymbols(matrix) {
		for (var i = 0; i < this.cols; i++) {
			this.symbols[i].sprite = this.assetsManager.getSprite('symb' + matrix[i]);
		}
	}

	/*
		update the winning type
		the winning type mapping is in the game config file
	 */
	updateWinTypeText(winType) {
		this.ui.winTypeTextComponent.updateText(this.config.winTypes[winType]);
	}

	/*
		check if a bonus should start, if so, start it
		return true or flase
	 */
	checkForBonus(ticket) {
		if (ticket.isBonus === true && ticket.bonusTicket) {
			this.startBonusIntro(ticket.bonusTicket);
			return true;
		}
		return false;
	}

	/*
		start bonus game intro, passing bonus ticket
		show a bonus welcome message
		hide & lock main game ui
		wait x seconds delay to start the bonus
	 */
	startBonusIntro(ticket) {
		this.ui.hideButton();
		this.ui.showBonusWelcomeMessage(this.config.bonusWelcomeMessage);
		var c = this.config.bonusWelcomeCountdownTime;
		var intervalID = setInterval(() => {
			if (c <= 0) {
				clearInterval(intervalID);
				this.ui.hideBonusWelcomeMessage();
				this.startBonusGame(ticket);
				return;
			}
			this.ui.showBonusWelcomeMessage(this.config.bonusWelcomeCountdownMessage + c);
			c--;
		}, 1000);
	}

	/*
		start the bonus game given a bonus ticket
		when bonus is finished, call finishBonusGame function
	 */
	startBonusGame(ticket) {
		this.bonusGame = new BonusGame(this, this.canvas, this.ctx, this.config);
		this.bonusGame.onFinish = () => {
			this.finishBonusGame();
		}
		this.bonusGame.init(ticket);
	}

	/*
		finish bonus call back
		destroy the bonus object and finishing round
		show & unlock main game ui
	 */
	finishBonusGame() {
		this.bonusGame.destroy();
		this.bonusGame = null;
		this.ui.showButton();
		this.finishRound();
	}

	/*
		setting game status back to idle
		unlocking ui
	 */
	finishRound() {
		this.gameStatus = STATUS_IDLE;
		this.ui.unlockUI();
	}

	/*
		main update function
		all other components in the game are updated and rendered throught this function
	 */
	update() {

		let canvas = this.canvas;
		let ctx = this.ctx;

		// draw background
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = this.config.gameBGColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// draw game elements - symbols
		for (var i = 0; i < this.symbols.length; i++) {
			ctx.drawImage(
				this.symbols[i].sprite,
				this.symbols[i].x,
				this.symbols[i].y
			);
		}

		// ui
		this.ui.render();

		// bonus
		if (this.bonusGame) {
			this.bonusGame.render();
		}

		// request new frame
		requestAnimFrame(() => {
			this.update();
		});
	}

}