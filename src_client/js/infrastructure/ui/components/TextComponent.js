export default class TextComponent {


	/*
		Simple Text component
		Text component uses text style and has position and visibility properties
	 */
	constructor(canvas, ctx) {

		this.canvas;
		this.ctx = ctx;

		this.text = "";
		this.textStyle = {
			font: "30px Comic Sans MS",
			fillStyle: "red",
			textAlign: "center"
		};

		this.x = 0;
		this.y = 0;

		this.visible = false;
	}

	/*
		init properties - usually done from the config file
		text: defualt text string, can be dynamically changed
		textStyle: css styled text
		x: x position
		y: y position
	 */
	init(properties) {
		this.text = properties.text || this.text;
		this.textStyle = properties.textStyle;
		this.x = properties.x || this.x;
		this.y = properties.y || this.y;

		this.visible = true;
	}

	/*
		update the text of the component
	 */
	updateText(text) {
		this.text = text;
	}

	/*
		render component if visible
	 */
	render() {
		if (!this.visible || !this.ctx) return;
		this.ctx.font = this.textStyle.font;
		this.ctx.fillStyle = this.textStyle.fillStyle;
		this.ctx.textAlign = this.textStyle.textAlign;
		this.ctx.fillText(this.text, this.x, this.y);
	}

	/*
		destroy component
	 */
	destroy() {
		delete this.canvas;
		delete this.ctx;

		delete this.text;
		delete this.textStyle;

		delete this.x;
		delete this.y;

		delete this.visible;
	}

}