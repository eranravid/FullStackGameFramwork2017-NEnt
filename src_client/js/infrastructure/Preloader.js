import Server_Facade from "./frontend/Server_Facade.js";
import AssetsManager from "./game_engine/AssetsManager.js";
import TextComponent from "./ui/components/TextComponent.js";

/*
	This class is initiated by main
	It will create the canvas & context
	It will try to make connection with the server
	If succeeded, start preloading assets 
	When done, initiate the game
 */
export default class Preloader {

	constructor(config) {

		this.config = config;

		// refrence to the html canvas & context
		this.canvas = document.getElementById('gameCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.config.gameWidth;
		this.canvas.height = this.config.gameHeight;

		// server
		this.server = new Server_Facade();

		// assets manager
		this.assetsManager = new AssetsManager();

		// text component to show server errors
		this.errorsTextComponent = new TextComponent(this.canvas, this.ctx);
		this.errorsTextComponent.init(this.config.errorTextProperties);
	}

	start() {
		return new Promise((resolve, reject) => {

			// draw preloader
			this.drawScreen();

			// initiliaze server
			this.server.init();
			this.server.notify().then(() => {
				// loading assets
				this.assetsManager.loadSprites(this.config.assetsManifest).then(() => {
					resolve({
						canvas: this.canvas,
						ctx: this.ctx,
						server: this.server,
						assetsManager: this.assetsManager
					});
					this.finishLoading();
				}).catch((reason) => {
					console.error('assets loading issue');
					this.errorsTextComponent.updateText('assets loading issue');
				});
			}).catch((reason) => {
				console.log('server issue, make sure server is up and host_url points to it');
				this.errorsTextComponent.updateText('server issue, make sure server is up and host_url points to it');
			});



		});
	}

	/*
		update function that draw the preloading screen
	 */
	drawScreen() {

		if (!this.ctx) return;

		// draw background
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = this.config.preloaderBGColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.errorsTextComponent.render();

		// request new frame
		requestAnimFrame(() => {
			this.drawScreen();
		});
	}

	/*
		destroy method
	 */
	finishLoading() {
		delete this.config;
		delete this.canvas;
		delete this.ctx;
		delete this.server;
		delete this.assetsManager;
	}

}

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();