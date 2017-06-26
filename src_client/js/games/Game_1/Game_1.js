import SlotMachine from "../../infrastructure/game_engine/SlotMachine.js";

/*
	This is the enter point of a specific game class
	In this calss on by creating new classes in this directory you can extend the prototype slot game and making skins of the game
 */
export default class Game_1 extends SlotMachine {

	constructor(canvas, ctx, server, config, assetsManager) {
		super(canvas, ctx, server, config, assetsManager);

	}

}