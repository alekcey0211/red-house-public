import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { getNumber, getObject } from '../../utils/papyrusArgs';

export const setPosition = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const selfId = mp.getIdFromDesc(self.desc);
	const [x, y, z] = [getNumber(args, 0), getNumber(args, 1), getNumber(args, 2)];
	mp.set(selfId, 'pos', [x, y, z]);
};

export const getPosition = (mp: Mp, self: PapyrusObject): [number, number, number] =>
	mp.get<[number, number, number]>(mp.getIdFromDesc(self.desc), 'pos') ?? [0, 0, 0];
export const getPositionX = (mp: Mp, self: PapyrusObject): number => getPosition(mp, self)[0];
export const getPositionY = (mp: Mp, self: PapyrusObject): number => getPosition(mp, self)[1];
export const getPositionZ = (mp: Mp, self: PapyrusObject): number => getPosition(mp, self)[2];

// Достает позицию из esp, а не текущую.
export const getEspPosition = (mp: Mp, placeId: number): [number, number, number] => {
	const espmRecord = mp.lookupEspmRecordById(placeId);
	const data = espmRecord.record?.fields.find((x) => x.type === 'DATA')?.data;
	if (data) {
		const dataView = new DataView(data.buffer);
		const posX: number = dataView.getFloat32(4, true);
		const posY: number = dataView.getFloat32(8, true);
		const posZ: number = dataView.getFloat32(12, true);
		return [posX, posY, posZ];
	}
	return [0, 0, 0];
};

export const setAngle = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const selfId = mp.getIdFromDesc(self.desc);
	const [x, y, z] = [getNumber(args, 0), getNumber(args, 1), getNumber(args, 2)];
	mp.set(selfId, 'angle', [x, y, z]);
};
export const getAngle = (mp: Mp, self: PapyrusObject): [number, number, number] =>
	mp.get<[number, number, number]>(mp.getIdFromDesc(self.desc), 'angle') ?? [0, 0, 0];
export const getAngleX = (mp: Mp, self: PapyrusObject): number => getAngle(mp, self)[0];
export const getAngleY = (mp: Mp, self: PapyrusObject): number => getAngle(mp, self)[1];
export const getAngleZ = (mp: Mp, self: PapyrusObject): number => getAngle(mp, self)[2];

export const getDistance = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): number => {
	const target = getObject(args, 0);
	const selfPosition = getPosition(mp, self);
	const targetCoord = getPosition(mp, target);

	return Math.sqrt(
		(selfPosition[0] - targetCoord[0]) ** 2 +
			(selfPosition[1] - targetCoord[1]) ** 2 +
			(selfPosition[2] - targetCoord[2]) ** 2
	);
};

// Если это сработает, то это реально странно
// По-любому нужна будет переделка, чтобы было более читаемо
export const teleportToLinkedDoorMarker = (mp: Mp, self: null, args: PapyrusValue[]): void => {
	const objectToTeleportId = mp.getIdFromDesc(getObject(args, 1).desc);
	const door = getObject(args, 0);
	const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(door.desc));
	const xtel = espmRecord.record?.fields.find((x) => x.type === 'XTEL')?.data;
	if (xtel) {
		const dataView = new DataView(xtel.buffer);
		const linkedDoorId = dataView.getUint32(0, true);

		const cell = mp.get(linkedDoorId, 'worldOrCellDesc');

		const [posX, posY, posZ] = [
			dataView.getFloat32(4, true),
			dataView.getFloat32(8, true),
			dataView.getFloat32(12, true),
		];
		const [angleX, angleY, angleZ] = [
			dataView.getFloat32(16, true),
			dataView.getFloat32(20, true),
			dataView.getFloat32(24, true),
		];

		mp.set(objectToTeleportId, 'worldOrCellDesc', cell);
		mp.set(objectToTeleportId, 'pos', [posX, posY, posZ]);
		mp.set(objectToTeleportId, 'angle', [angleX, angleY, angleZ]);
	}
};

//
export const getLinkedDoorId = (mp: Mp, self: null, args: PapyrusValue[]): number => {
	const target = getObject(args, 0);
	const targetId = mp.getIdFromDesc(target.desc);
	const espmRecord = mp.lookupEspmRecordById(targetId);
	const xtel = espmRecord.record?.fields.find((x) => x.type === 'XTEL')?.data;

	if (!xtel) return 0;

	const dataView = new DataView(xtel.buffer);
	const linkedDoorId = dataView.getUint32(0, true);

	return linkedDoorId;
};

export const getLinkedCellId = (mp: Mp, self: null, args: PapyrusValue[]): number => {
	const target = getObject(args, 0);
	const targetId = mp.getIdFromDesc(target.desc);
	const espmRecord = mp.lookupEspmRecordById(targetId);
	const xtel = espmRecord.record?.fields.find((x) => x.type === 'XTEL')?.data;

	if (!xtel) return 0;

	const dataView = new DataView(xtel.buffer);
	const linkedDoorId = dataView.getUint32(0, true);
	const linkedCellId = mp.getIdFromDesc(mp.get(linkedDoorId, 'worldOrCellDesc'));

	return linkedCellId;
};

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('method', 'ObjectReference', 'SetPosition', (self, args) => setPosition(mp, self, args));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetPositionX', (self) => getPositionX(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetPositionY', (self) => getPositionY(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetPositionZ', (self) => getPositionZ(mp, self));

	mp.registerPapyrusFunction('method', 'ObjectReference', 'SetAngle', (self, args) => setAngle(mp, self, args));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetAngleX', (self) => getAngleX(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetAngleY', (self) => getAngleY(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetAngleZ', (self) => getAngleZ(mp, self));

	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'TeleportToLinkedDoorMarker', (self, args) =>
		teleportToLinkedDoorMarker(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedDoorId', (self, args) =>
		getLinkedDoorId(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedCellId', (self, args) =>
		getLinkedCellId(mp, self, args)
	);
};
