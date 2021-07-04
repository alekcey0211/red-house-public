import { getSelfId } from '.';
import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { getNumber, getObject } from '../../utils/papyrusArgs';
import { getForm } from '../game';

export const getKeywords = (mp: Mp, self: PapyrusObject): PapyrusObject[] => {
  const selfId = getSelfId(mp, self.desc);
  const data = mp.lookupEspmRecordById(selfId);
  const kwda = data.record?.fields.find((x) => x.type === 'KWDA')?.data;
  const keywords: PapyrusObject[] = [];
  if (kwda) {
    const dataView = new DataView(kwda.buffer);
    for (let i = 0; i < dataView.byteLength; i += 4) {
      keywords.push({
        desc: mp.getDescFromId(dataView.getUint32(i, true)),
        type: 'espm',
      });
    }
  }
  return keywords;
};

export const getNumKeywords = (mp: Mp, self: PapyrusObject): number | undefined => {
  const selfId = getSelfId(mp, self.desc);
  const data = mp.lookupEspmRecordById(selfId);
  const ksiz = data.record?.fields.find((x) => x.type === 'KSIZ')?.data;
  if (ksiz) {
    const dataView = new DataView(ksiz.buffer);
    return dataView.getUint32(0, true);
  }
  return;
};

export const getNthKeyword = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): PapyrusObject | undefined => {
  const selfId = getSelfId(mp, self.desc);
  const data = mp.lookupEspmRecordById(selfId);
  const index = getNumber(args, 0) - 1;
  const kwda = data.record?.fields.find((x) => x.type === 'KWDA')?.data;
  if (kwda) {
    let dataView = new DataView(kwda.buffer);
    return {
      desc: mp.getDescFromId(dataView.getUint32(index * 4, true)),
      type: 'espm',
    };
  }
  return;
};

export const hasKeyword = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): boolean => {
  const selfId = getSelfId(mp, self.desc);
  const keyword = getObject(args, 0);
  const keywordId = mp.getIdFromDesc(keyword.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const kwda = espmRecord.record?.fields.find((x) => x.type === 'KWDA')?.data;
  if (kwda) {
    const dataView = new DataView(kwda.buffer);
    for (let i = 0; i < dataView.byteLength; i += 4) {
      if (dataView.getUint32(i, true) === keywordId) return true;
    }
  }
  return false;
};

// Дефолтный hasKeyword не всегда возвращает нужное значение из-за того, что не всегда читает передаваемый keyword
// + проблемы с присваиванием Keyword
export const hasKeywordEx = (mp: Mp, self: null, args: PapyrusValue[]): boolean => {
  const form = getForm(mp, null, [getNumber(args, 0)]);
  const keyword = getForm(mp, null, [getNumber(args, 1)]);
  if (!form || !keyword) return false;
  return hasKeyword(mp, form, [keyword]);
};
