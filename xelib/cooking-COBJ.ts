import { wrapper as xelib } from 'xelib';

export const getCookingCOBJ = () =>
	xelib
		.GetRecords(0, 'COBJ')
		.filter((x) => xelib.GetUIntValue(x, 'BNAM') === 0xa5cb3)
		.map((x) => +`0x${xelib.GetHexFormID(x)}`);

export const getCOBJ = () => xelib.GetRecords(0, 'COBJ').map((x) => +`0x${xelib.GetHexFormID(x)}`);
