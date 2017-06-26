/*
	Class to use as the assets storage
	In this example, loading, storing and servering sprite images
 */
export default class AssetsManager {

	constructor() {
		this.sprites = [];

		this.onLoadFinish = null;
	}

	/*
		load sprite images given a manifest
		manifest must be an array
		each item in the array is an object containing id and a relative path to the image
	 */
	loadSprites(manifest) {
		return new Promise((resolve, reject) => {
			if (!Array.isArray(manifest)) {
				reject('manifest must be an array');
			}

			var loadedCount = 0;
			var loadNumber = manifest.length;
			for (let i in manifest) {
				let item = manifest[i];

				if (!item.id || !item.path) {
					reject('item in manifest must be an object that have an id and an path');
				}

				let sprite = new Image();
				sprite.onload = () => {
					loadedCount++;
					if (loadedCount === loadNumber) {
						resolve();
					}
				}
				sprite.onerror = function() {
					reject('item could not be loaded');
				};
				sprite.id = item.id;
				sprite.src = item.path;
				this.sprites.push(sprite);
			}
		});
	}

	/*
		serve a sprite from storage
	 */
	getSprite(id) {
		if (!id) {
			throw new Error('must search for sprite by id');
		}
		return this.sprites.filter((val) => {
			return val.id === id;
		})[0];
	}


}