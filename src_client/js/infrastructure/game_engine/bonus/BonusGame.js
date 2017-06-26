import ButtonComponent from "../../ui/components/ButtonComponent.js";
import TextComponent from "../../ui/components/TextComponent.js";
import BonusTicket from "./BonusTicket.js";

/*
	Bonus game object
	feel free to extend it in the game specific directory
	or use the config file to make static changes
	main functionality:
	having a ticket from the server, present 3 options to the player to choose from.
	after it choose on, reveal all 3 options and indicate the one it chose
	return to main game after 3 seconds delay
 */
export default class Bonus {

	constructor(game, canvas, ctx, config) {

		this.game = game;
		this.canvas = canvas;
		this.ctx = ctx;
		this.config = config;

		this.ticket = null;
		this.bonusItemsNumber = this.config.bonusItemsProperties.length;
		this.startFinished = false;
		this.clickedItem = null;

		this.titleText = null;
		this.descText = null;
		this.outroText = null;
		this.bonusItems = [];
		this.bonusItemsTexts = [];

		// events
		this.onFinish = null;

	}

	/*
		initiate the bonus game with the bonus ticket
	 */
	init(ticket) {
		this.ticket = ticket;
		this.initTexts();
		this.initBonusItems();
	}

	/*
		initiate text components
	 */
	initTexts() {
		this.titleText = new TextComponent(this.canvas, this.ctx);
		this.titleText.init(this.config.titleTextProperties);

		this.descText = new TextComponent(this.canvas, this.ctx);
		this.descText.init(this.config.descTextProperties);

		this.outroText = new TextComponent(this.canvas, this.ctx);
		this.outroText.init(this.config.outroTextProperties);

		for (let i = 0; i < this.bonusItemsNumber; i++) {
			let itemTextComp = new TextComponent(this.canvas, this.ctx);
			itemTextComp.init(this.config.bonusItemsTextsProperties[i]);
			this.bonusItemsTexts.push(itemTextComp);
		}
	}

	/*
		initiate bonus items, which actually are button components
	 */
	initBonusItems() {
		for (let i = 0; i < this.bonusItemsNumber; i++) {
			let item = new ButtonComponent(this.game, this.canvas, this.ctx);
			item.setClickCallBack((item) => {
				this.itemclicked(item);
			});
			item.init(this.config.bonusItemsProperties[i]);
			item.bonusItemIndex = i;
			this.bonusItems.push(item);
		}
	}

	/*
		item click handler
	 */
	itemclicked(item) {
		if (this.startFinished) return;
		this.clickedItem = item;
		this.revealAllMultipliers(item.bonusItemIndex);
		this.startFinish();
	}

	/*
		reveal all other multiplier options
	 */
	revealAllMultipliers(winItemIndex) {
		let losingMultipliers = this.ticket.loseMultipliers.concat();
		for (let i = 0; i < this.bonusItems.length; i++) {

			let item = this.bonusItems[i];
			let multiplierTxtComp = this.bonusItemsTexts[i];

			// check if current index is winning item
			// take the win multiplier if the item is the one that was clicked
			// take and pop if it's a lose multiplier
			let multiplierText = winItemIndex === i ? this.ticket.winMultiplier : losingMultipliers.pop();
			// update the text multiplier
			multiplierTxtComp.updateText(multiplierText);
			multiplierTxtComp.x = item.x;
			multiplierTxtComp.y = item.y;

			// remove the item visibility
			item.visible = false;
		}
	}

	/*
		start finishing sequence of the bonus game
		show winning multiplay and start a resuming count down
	 */
	startFinish() {
		this.startFinished = true;
		this.outroText.updateText(this.config.bonusEndMessage + this.ticket.winMultiplier);
		var c = this.config.bonusendCountdownTime;
		var finisIntervalID = setInterval(() => {
			if (c <= 0) {
				clearInterval(finisIntervalID);
				this.endBonusGame();
				return;
			}
			this.outroText.updateText(this.config.bonusEndCountdownMessage + c);
			c--;
		}, 1000);
	}

	/*
		end the bonus game and call the finish call back
		destroying this object is done from outside
	 */
	endBonusGame() {
		if (this.onFinish) {
			this.onFinish();
		}
	}

	/*
		rendering bonus game elements
	 */
	render() {
		// background
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = this.config.bonusBGColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// text components
		this.titleText.render();
		this.descText.render();
		this.outroText.render();

		// bonus items and multiplier texts
		for (let itemText in this.bonusItemsTexts) {
			this.bonusItemsTexts[itemText].render();
		}

		for (let item in this.bonusItems) {
			this.bonusItems[item].render();
		}

		// winning indication
		if (this.startFinished) {
			this.ctx.beginPath();
			this.ctx.arc(this.clickedItem.x, this.clickedItem.y - 10, 50, 0, 2 * Math.PI);
			this.ctx.lineWidth = 5;
			this.ctx.strokeStyle = '#003300';
			this.ctx.stroke();
		}
	}

	/*
		destroying this object is done from outside
	 */
	destroy() {
		delete this.game;
		delete this.canvas;
		delete this.ctx;
		delete this.config;

		delete this.ticket;
		delete this.bonusItemsNumber;
		delete this.startFinished;
		delete this.clickedItem;

		this.titleText.destroy();
		delete this.titleText;

		this.descText.destroy();
		delete this.descText;

		this.outroText.destroy();
		delete this.outroText;

		for (let i in this.bonusItems) {
			this.bonusItems[i].destroy();
		}
		delete this.bonusItems;

		for (let i in this.bonusItemsTexts) {
			this.bonusItemsTexts[i].destroy();
		}
		delete this.bonusItemsTexts;

		delete this.onFinish;
	}

}