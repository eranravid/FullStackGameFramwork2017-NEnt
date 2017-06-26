import Preloader from "./infrastructure/Preloader.js";
import Game_2 from "./games/Game_2/Game_2.js";
import config from "./games/Game_2/config.js";
import gameVersion from "./games/Game_2/version.js";
import frameworkVersion from "./infrastructure/framework_version.js";

(function() {

	console.log("%cstarting " + gameVersion + " on " + frameworkVersion, "color:white; background:green");

	// initiating config & preloader
	var configObj = new config();
	var preloader = new Preloader(configObj);
	preloader.start().then(({
		canvas,
		ctx,
		server,
		assetsManager
	}) => { // if everything is loaded initiate game
		var slotGame = new Game_2(canvas, ctx, server, configObj, assetsManager);
		slotGame.initGame();
	});

})();