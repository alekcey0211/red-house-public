import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { getObject } from '../../utils/papyrusArgs';
import { uint16 } from '../../utils/helper';

const FLG_Interior = 0x0001;
const FLG_Has_Water = 0x0002;
const FLG_Cant_Travel_From_Here = 0x0004;
const FLG_No_LOD_Water = 0x0008;
const FLG_Public_Area = 0x0020;
const FLG_Hand_Changed = 0x0040;
const FLG_Show_Sky = 0x0080;
const FLG_Use_Sky_Lighting = 0x0100;

const flagExists = (mp: Mp, self: PapyrusObject, flag: number) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);

  const enit = espmRecord.record?.fields.find((x) => x.type === 'DATA')?.data;
  if (!enit) return false;

  const flags = uint16(enit.buffer, 0);
  return !!(flags & flag);
};

export const isInterior = (mp: Mp, self: PapyrusObject): boolean => flagExists(mp, self, FLG_Interior);

export const getLocationId = (mp: Mp, self: null, args: PapyrusValue[]) => {
  const cell = getObject(args, 0)
  const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(cell.desc));
  const xlcn = espmRecord.record?.fields.find((x) => x.type === 'XLCN')?.data;
  if (xlcn) {
    const dataView = new DataView(xlcn.buffer);

    return dataView.getUint32(0, true);
  }
}

export const register = (mp: Mp): void => {
  mp.registerPapyrusFunction('method', 'Cell', 'IsInterior', (self) => isInterior(mp, self));
  mp.registerPapyrusFunction('global', 'CellEx', 'GetLocationId', (self, args) => getLocationId(mp, self, args));
};
