import * as crc32 from 'crc-32';
import * as path from 'path';
import * as fs from 'fs';
import { Settings } from './settings';

interface ManifestModEntry {
	filename: string;
	crc32: number;
	size: number;
}

interface Manifest {
	versionMajor: number;
	mods: Array<ManifestModEntry>;
	loadOrder: Array<string>;
}

const getBsaNameByEspmName = (espmName: string) => {
	if (espmName.endsWith('.esp') || espmName.endsWith('.esm')) {
		const nameNoExt = espmName.split('.').slice(0, -1).join('.');
		return `${nameNoExt}.bsa`;
	}
	throw new Error(`'${espmName}' is not a valid esp or esm name`);
};

const getIniNameByEspmName = (espmName: string) => {
	if (espmName.endsWith('.esp') || espmName.endsWith('.esm')) {
		const nameNoExt = espmName.split('.').slice(0, -1).join('.');
		return `${nameNoExt}.ini`;
	}
	throw new Error(`'${espmName}' is not a valid esp or esm name`);
};

export const generateManifest = (settings: Settings): void => {
	const manifest: Manifest = {
		mods: [],
		versionMajor: 1,
		loadOrder: settings.loadOrder.map((x) => path.basename(x)),
	};

	settings.loadOrder.forEach((loadOrderElement) => {
		const espmName = path.isAbsolute(loadOrderElement) ? path.basename(loadOrderElement) : loadOrderElement;

		const espmPath = path.isAbsolute(loadOrderElement) ? loadOrderElement : path.join(settings.dataDir, espmName);

		const buf: Uint8Array = fs.readFileSync(espmPath);
		manifest.mods.push({
			crc32: crc32.buf(buf),
			filename: espmName,
			size: buf.length,
		});

		const bsaName = getBsaNameByEspmName(espmName);
		const bsaPath = path.join(settings.dataDir, bsaName);
		if (fs.existsSync(bsaPath)) {
			const bsaBuf: Uint8Array = fs.readFileSync(bsaPath);
			manifest.mods.push({
				crc32: crc32.buf(bsaBuf),
				filename: bsaName,
				size: bsaBuf.length,
			});
		}

		const iniName = getIniNameByEspmName(espmName);
		const iniPath = path.join(settings.dataDir, iniName);
		if (fs.existsSync(iniPath)) {
			const IniBuf: Uint8Array = fs.readFileSync(iniPath);
			manifest.mods.push({
				crc32: crc32.buf(IniBuf),
				filename: iniName,
				size: IniBuf.length,
			});
		}
	});

	const manifestPath = path.join(settings.dataDir, 'manifest.json');
	fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
};
