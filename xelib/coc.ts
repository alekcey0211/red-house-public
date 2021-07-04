import { wrapper as xelib } from 'xelib';

export function getCocCoord(
	cocMarkerId: number
): Record<
	string,
	{
		pos: number[];
		angle: number[];
		worldOrCellDesc: string;
	}
> {
	const rec = xelib.GetRecord(0, cocMarkerId);
	const dataKey = 'DATA - Position/Rotation';

	const recObject = xelib.ElementToObject(rec);
	if (!recObject[dataKey]) return;

	const { Position: pos, Rotation: angle } = recObject[dataKey];

	const cellId = +(
		'0x' +
		xelib.GetFileLoadOrder(xelib.GetElementFile(rec)) +
		recObject['Cell'].split(':')[1]
	);
	const recCell = xelib.GetRecord(0, cellId);
	const recCellObject = xelib.ElementToObject(recCell);

	let worldOrCellName = xelib.GetValue(recCell, 'EDID');

	if (recCellObject['Worldspace']) {
		const worldspaceId = +(
			'0x' +
			xelib.GetFileLoadOrder(xelib.GetElementFile(recCell)) +
			recCellObject['Worldspace'].split(':')[1]
		);
		const recWorldspace = xelib.GetRecord(0, worldspaceId);
		worldOrCellName = xelib
			.GetValue(recWorldspace, 'EDID')
			.replace('World', '');
	}

	const worldOrCellDesc: string = (
		recCellObject['Worldspace'] ?? recObject['Cell']
	)
		.split(':')
		.reverse()
		.join(':');

	return {
		[worldOrCellName]: {
			pos: Object.values(pos) as number[],
			angle: Object.values(angle) as number[],
			worldOrCellDesc,
		},
	};
}
