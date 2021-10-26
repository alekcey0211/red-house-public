const isScroll = (t: number): boolean => t === 23;
const isArmor = (t: number): boolean => t === 26;
const isBook = (t: number): boolean => t === 27;
const isContainer = (t: number): boolean => t === 28;
const isDoor = (t: number): boolean => t === 29;
const isIngredient = (t: number): boolean => t === 30;
const isLight = (t: number): boolean => t === 31;
const isMisc = (t: number): boolean => t === 32;
const isMovableStatic = (t: number): boolean => t === 36;
const isTree = (t: number): boolean => t === 38;
const isFlora = (t: number): boolean => t === 39;
const isWeapon = (t: number): boolean => t === 41;
const isAmmo = (t: number): boolean => t === 42;
const isNpc = (t: number): boolean => t === 43;
const isPotion = (t: number): boolean => t === 46;
const isSoulGem = (t: number): boolean => t === 52;
const isIngredientSource = (t: number): boolean => isFlora(t) || isTree(t);
const isItem = (t: number): boolean =>
	isAmmo(t) ||
	isArmor(t) ||
	isBook(t) ||
	isIngredient(t) ||
	isLight(t) ||
	isPotion(t) ||
	isScroll(t) ||
	isSoulGem(t) ||
	isWeapon(t) ||
	isMisc(t);
