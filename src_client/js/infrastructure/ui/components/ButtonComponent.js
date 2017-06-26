export default class ButtonComponent {

	/*
		Simple Button component
		Button uses a sprite as it render type
		position x and y are resolved with an anchor point
	 */
	constructor(game, canvas, ctx) {

		this.game = game;
		this.canvas = canvas;
		this.ctx = ctx;

		this.button = null;
		this.onclick = null;

		this.buttonLocked = false;

		this.position = {
			x: 0,
			y: 0
		};

		this.anchor = {
			x: 0,
			y: 0
		};

		this.width = 0;
		this.height = 0;
		this.x = 0;
		this.y = 0;

		this.visible = false;

	}

	/*
		init properties
		spriteID: as it is refered in the assets manager (via config probably)
		x: x position
		y: y position
		anchor: sprite's anchor.x and anchor.y
	 */
	init(properties) {
		this.button = this.game.assetsManager.getSprite(properties.spriteID);
		this.width = this.button.width;
		this.height = this.button.height;
		this.clickHandler = (event) => {
			if (this.buttonLocked) return;
			this.resolveClick(this.windowToCanvas(event.x, event.y));
		};
		this.canvas.addEventListener('click', this.clickHandler, false);
		this.x = properties.x;
		this.y = properties.y;
		this.anchor = properties.anchor;

		this.visible = true;

		this.resolvePosition();
	}

	/*
		check if the click on the canvas is in the range of our sprite object
	 */
	resolveClick(clickPos) {
		// check button region
		// since mosy buttons are circle, we can calculate a hit according to its diameter. if not, override this function
		let xy = {
			x: this.x,
			y: this.y
		};
		let distance = this.pointsDistance(xy, clickPos);
		if (distance <= this.button.width / 2) {
			if (this.onclick) {
				this.onclick(this);
			}
		}
	}

	/*
		set a button click callback event
	 */
	setClickCallBack(cb) {
		this.onclick = cb;
	}

	/*
		lock the button from being clicked
	 */
	lockButton() {
		this.buttonLocked = true;
	}

	/*
		unlock the button from being clicked
	 */
	unlockButton() {
		this.buttonLocked = false;
	}

	/*
		helper function to translate window to canvas cordinations
	 */
	windowToCanvas(x, y) {
		let r = this.canvas.getBoundingClientRect();
		return {
			x: x - r.left * (this.canvas.width / r.width),
			y: y - r.top * (this.canvas.height / r.height)
		};
	};

	/*
		helper function to get distance between two points
		each point object must have x & y properties
	 */
	pointsDistance(p1, p2) {
		let a = p1.x - p2.x;
		let b = p1.y - p2.y;
		return Math.sqrt(a * a + b * b);
	}

	/*
		resolve the final x,y position of the button according to it's anchor point
	 */
	resolvePosition() {
		this.position.x = this.x - (this.anchor.x * this.width);
		this.position.y = this.y - (this.anchor.y * this.height);
	}

	/*
		render the component if visible
	 */
	render() {
		if (!this.visible || !this.ctx) return;
		this.ctx.drawImage(
			this.button,
			this.position.x,
			this.position.y
		);
	}

	/*
		destroy the component
	 */
	destroy() {
		this.canvas.removeEventListener('click', this.clickHandler);
		delete this.canvas;
		delete this.ctx;
		delete this.game;

		delete this.button;
		delete this.onclick;

		delete this.buttonLocked;

		delete this.position;

		delete this.anchor;

		delete this.width;
		delete this.height;
		delete this.x;
		delete this.y;

		delete this.visible;
	}

}