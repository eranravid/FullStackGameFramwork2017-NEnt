import ButtonComponent from "./components/ButtonComponent.js";
import TextComponent from "./components/TextComponent.js";

/*
	main inteface to interact with the graphic user interface
	all of the components properties such as position and static strings are in the game config file
 */
export default class UI_Manager {

	constructor(game, config) {

		this.game = game;
		this.config = config;
		this.canvas = this.game.canvas;
		this.ctx = this.game.ctx;

		// is locked flag
		this.uiLocked = false;

		// components
		this.button = null;
		this.winTypeTextComponent = null;
		this.bonusTextComponent = null;
		this.errorsTextComponent = null;

		// events
		this.onButtonClicked = null;

	}

	/*
		initiate components
	 */
	init() {

		this.button = new ButtonComponent(this.game, this.canvas, this.ctx);
		this.button.setClickCallBack(() => {
			this.buttonClicked();
		});
		this.button.init(this.config.buttonProperties);

		this.winTypeTextComponent = new TextComponent(this.canvas, this.ctx);
		this.winTypeTextComponent.init(this.config.winTypeTextProperties);

		this.bonusTextComponent = new TextComponent(this.canvas, this.ctx);
		this.bonusTextComponent.init(this.config.bonusTextProperties);

		this.errorsTextComponent = new TextComponent(this.canvas, this.ctx);
		this.errorsTextComponent.init(this.config.errorTextProperties);
	}

	/*
		show the bonus welcome message in a text component
	 */
	showBonusWelcomeMessage(message) {
		this.bonusTextComponent.updateText(message);
	}

	/*
		hide the bonus welcome message text component
	 */
	hideBonusWelcomeMessage() {
		this.bonusTextComponent.updateText("");
	}

	/*
		show error message in a text component
	 */
	showErrorMessage(message) {
		this.errorsTextComponent.updateText(message);
	}

	/*
		hide error message
	*/
	hideErrorMessage() {
		this.errorsTextComponent.updateText("");
	}

	/*
		play button click hendler, won't fire the call back if locked
	 */
	buttonClicked() {
		if (this.onButtonClicked) {
			this.onButtonClicked();
		}
	}

	/*
		lock ui components
	 */
	lockUI() {
		this.uiLocked = true;
		this.button.lockButton();
	}

	/*
		unlock ui components
	 */
	unlockUI() {
		this.uiLocked = false;
		this.button.unlockButton();
	}

	/*
		shows the play button and unlock it
	 */
	showButton() {
		this.button.visible = true;
		this.button.unlockButton();
	}

	/*
		hide the play button and lock it
	 */
	hideButton() {
		this.button.visible = false;
		this.button.lockButton();
	}

	/*
		render ui components
	 */
	render() {
		this.button.render();
		this.winTypeTextComponent.render();
		this.bonusTextComponent.render();
		this.errorsTextComponent.render();
	}

}