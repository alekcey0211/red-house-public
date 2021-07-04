import { Ctx } from '../types/ctx';
import { Mp, PapyrusValue } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import { getNumber, getObject } from '../utils/papyrusArgs';
import { propertyExist } from './multiplayer/functions';

function globalVariableUpdate(ctx: Ctx<Record<string, number>, number>, formId: number) {
  if (!ctx.refr) return;

  const ac = ctx.sp.Actor.from(ctx.refr);
  if (!ac) return;

  if (ctx.value && ctx.state['lastGlobal' + formId + 'Value'] !== ctx.value) {
    let val: number = ctx.value;
    val = val < 0 ? 0 : val;

    const formGlobal = ctx.sp.Game.getFormEx(formId);
    ctx.sp.GlobalVariable.from(formGlobal)?.setValue(val <= 0 ? 1 : val);

    ctx.state['lastGlobal' + formId + 'Value'] = val;
  }
}

const checkGlobalProp = (mp: Mp, acId: number, key: string, formId: number) => {
  if (!propertyExist(mp, acId, key)) {
    mp.makeProperty(key, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: false,
      updateOwner: new FunctionInfo(globalVariableUpdate).getText({ formId }),
      updateNeighbor: '',
    });
  }
};

const getValue = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
  const ac = getObject(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const formId = getNumber(args, 1);
  const propKey = 'global' + formId;

  checkGlobalProp(mp, acId, propKey, formId);

  if (propertyExist(mp, acId, propKey)) {
    return mp.get(acId, propKey);
  }
  return;
};

const setValue = (mp: Mp, self: null, args: PapyrusValue[]): void => {
  const ac = getObject(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const formId = getNumber(args, 1);
  const value = getNumber(args, 2);
  const propKey = 'global' + formId;

  checkGlobalProp(mp, acId, propKey, formId);

  if (propertyExist(mp, acId, propKey)) {
    mp.set(acId, propKey, value);
  }
};

export const register = (mp: Mp): void => {
  mp.registerPapyrusFunction('global', 'GlobalVariableEx', 'GetValue', (self, args) => getValue(mp, self, args));
  mp.registerPapyrusFunction('global', 'GlobalVariableEx', 'SetValue', (self, args) => setValue(mp, self, args));
};
