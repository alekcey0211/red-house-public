import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { float32, uint8 } from '../../utils/helper';
import { getObject } from '../../utils/papyrusArgs';
import { conditionAllResult } from './condition';
import { EffectFunctionType, EffectSection, PerkEffectData } from './type';

export const getPerkEffectData = (
  mp: Mp,
  perkId: number,
  subjectId?: number
): (PerkEffectData | undefined)[] | undefined => {
  const perkRec = mp.lookupEspmRecordById(perkId);
  const perkRecFields = perkRec.record?.fields;
  if (!perkRecFields) return;
  const perkDataIndexies: { start: number; end: number }[] = [];
  let start = 0;
  let end = 0;
  perkRecFields.forEach((rec, i) => {
    if (rec.type === 'PRKE') {
      start = i;
    }
    if (rec.type === 'PRKF') {
      end = i;
      perkDataIndexies.push({ start, end });
    }
  });
  return perkDataIndexies.map((index) => {
    const i = index.start;
    const fields = perkRecFields.slice(index.start, index.end + 1);
    const header = fields[0].data;
    if (header[0] === EffectSection.Complex) {
      const effectType = uint8(fields[1].data.buffer, 0);
      const functionType = uint8(fields[1].data.buffer, 1);
      const CondTypeCount = fields.filter((x) => x.type === 'CTDA'); // uint8(fields[1].data.buffer, 2);
      const prks = CondTypeCount.length > 0 ? 1 : 0;
      let conditionResult = CondTypeCount.length === 0;
      let conditionFunction = undefined;
      // TODO: могут возникнуть проблемы, может быть два PRKS между CTDA
      if (CondTypeCount.length > 0) {
        // Mod Attack Damage 0x23
        if (effectType === 0x23 && functionType === EffectFunctionType.MultiplyValue) {
          if (subjectId) {
            conditionResult = conditionAllResult(mp, CondTypeCount, subjectId);
          }
          conditionFunction = (subjectId: number) => {
            return conditionAllResult(mp, CondTypeCount, subjectId);
          };
        }
      }
      const epft = fields.find((x) => x.type === 'EPFT')?.data.buffer;
      const epfd = fields.find((x) => x.type === 'EPFD')?.data.buffer;
      const valueType = epft ? uint8(epft, 0) : 0;
      const effectValue = epfd ? (valueType === 1 ? float32(epfd, 0) : 0) : 0;
      return {
        effectType,
        functionType,
        conditionResult,
        effectValue,
        conditionFunction,
      };
    }
  });
};

export const register = (mp: Mp): void => {};
