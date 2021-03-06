/**
 *	check if array is equal
 * @param arr1 first array
 * @param arr2 second array
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isArrayEqual = (arr1: any, arr2: any): boolean => {
	const type = Object.prototype.toString.call(arr1);

	if (type !== Object.prototype.toString.call(arr2)) return false;

	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

	const valueLen = type === '[object Array]' ? arr1.length : Object.keys(arr1).length;
	const otherLen = type === '[object Array]' ? arr2.length : Object.keys(arr2).length;

	if (valueLen !== otherLen) return false;

	const compare = (item1: any, item2: any) => {
		const itemType = Object.prototype.toString.call(item1);
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isArrayEqual(item1, item2)) return false;
		} else {
			if (itemType !== Object.prototype.toString.call(item2)) return false;
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else if (item1 !== item2) return false;
		}
	};
	if (type === '[object Array]') {
		for (let i = 0; i < valueLen; i++) {
			if (compare(arr1[i], arr2[i]) === false) return false;
		}
	} else {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in arr1) {
			// eslint-disable-next-line no-prototype-builtins
			if (arr1.hasOwnProperty(key)) {
				if (compare(arr1[key], arr2[key]) === false) return false;
			}
		}
	}

	return true;
};

/**
 * get random number in range
 * @param min min range (inclusive)
 * @param max max range (inclusive)
 */
export const randomInRange = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Check if point in polygon
 * @param x x coordinate of point
 * @param y y coordinate of point
 * @param xp all x coordinate of polygon
 * @param yp all y coordinate of polygon
 */
const cacheInPoly: { [key: string]: boolean } = {};
export const inPoly = (x: number, y: number, xp: number[], yp: number[]): boolean => {
	const index = x.toString() + y.toString() + xp.join('') + yp.join('');
	if (cacheInPoly[index]) {
		return cacheInPoly[index];
	}
	const npol = xp.length;
	let j = npol - 1;
	let c = false;
	for (let i = 0; i < npol; i++) {
		if (
			((yp[i] <= y && y < yp[j]) || (yp[j] <= y && y < yp[i])) &&
			x > ((xp[j] - xp[i]) * (y - yp[i])) / (yp[j] - yp[i]) + xp[i]
		) {
			c = !c;
		}
		j = i;
	}
	cacheInPoly[index] = c;
	return c;
};

export const uint8arrayToStringMethod = (myUint8Arr: Uint8Array): string => {
	return String.fromCharCode.apply(null, [...myUint8Arr]);
};

export const uint8 = (buffer: ArrayBufferLike, offset: number = 0): number => new DataView(buffer).getUint8(offset);
export const uint16 = (buffer: ArrayBufferLike, offset: number = 0): number =>
	new DataView(buffer).getUint16(offset, true);
export const uint32 = (buffer: ArrayBufferLike, offset: number = 0): number =>
	new DataView(buffer).getUint32(offset, true);
export const int32 = (buffer: ArrayBufferLike, offset: number = 0): number =>
	new DataView(buffer).getInt32(offset, true);
export const float32 = (buffer: ArrayBufferLike, offset: number = 0): number =>
	new DataView(buffer).getFloat32(offset, true);
