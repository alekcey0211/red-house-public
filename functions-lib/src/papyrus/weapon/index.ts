import { Mp, PapyrusObject } from '../../types/mp';
import { uint16 } from '../../utils/helper';
import { WeaponType } from './type';

export const getWeaponType = (mp: Mp, self: PapyrusObject) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const data = mp.lookupEspmRecordById(selfId);
  const kwda = data.record?.fields.find((x) => x.type === 'KWDA')?.data;
  const keywords: number[] = [];
  if (kwda) {
    const dataView = new DataView(kwda.buffer);
    for (let i = 0; i < dataView.byteLength; i += 4) {
      keywords.push(dataView.getUint32(i, true));
    }
    if (keywords.includes(0x1e711)) {
      return WeaponType.Swords;
    } else if (keywords.includes(0x6d931)) {
      return WeaponType.Greatswords;
    } else if (keywords.includes(0x1e713)) {
      return WeaponType.Daggers;
    } else if (keywords.includes(0x6d932) || keywords.includes(0x6d930)) {
      return WeaponType.BattleaxesANDWarhammers;
    } else if (keywords.includes(0x1e714)) {
      return WeaponType.Maces;
    } else if (keywords.includes(0x1e712)) {
      return WeaponType.WarAxes;
    } else if (keywords.includes(0x1e715)) {
      return WeaponType.Bows;
    } else if (keywords.includes(0x1e716)) {
      return WeaponType.Staff;
    } else if (keywords.includes(-1)) {
      // TODO: find crossbow keyword ID
      return WeaponType.Crossbows;
    }
  }
};

export const getBaseDamage = (mp: Mp, self: PapyrusObject): number | undefined => {
  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);

  const data = espmRecord.record?.fields.find((x) => x.type === 'DATA')?.data;
  if (!data) return;

  const damage = uint16(data.buffer, 8);

  return damage;
};

export const register = (mp: Mp): void => {
  mp.registerPapyrusFunction('method', 'Weapon', 'GetWeaponType', (self) => getWeaponType(mp, self));
  mp.registerPapyrusFunction('method', 'Weapon', 'GetBaseDamage', (self) => getBaseDamage(mp, self));
};
