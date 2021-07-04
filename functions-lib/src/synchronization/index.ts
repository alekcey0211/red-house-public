import { Mp } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import { stateChangeFactory } from './functions';
import { actorValues, Attr, AttrAll } from '../properties/actor/actorValues/attributes';

export type State = 'isSprinting' | 'isWeaponDrawn' | 'isDead' | 'isFlying';
const states: State[] = ['isSprinting', 'isWeaponDrawn', 'isDead', 'isFlying'];

const factory = (stateName: State) => {
  return new FunctionInfo(stateChangeFactory).getText({
    stateName,
    states,
  });
};

const sprintAttr: Attr = 'stamina';
const staminaReduce = 10;

export const register = (mp: Mp): void => {
  mp.makeEventSource('_onSprintStateChange', factory('isSprinting'));

  mp['_onSprintStateChange'] = (pcFormId: number, isSprinting: boolean) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    console.log('isSprinting', isSprinting);
    mp.set(pcFormId, 'isSprinting', isSprinting);
    if (isSprinting) {
      actorValues.set(pcFormId, `mp_${sprintAttr}drain` as AttrAll, 'base', -staminaReduce);
      const damageMod = actorValues.get(pcFormId, sprintAttr, 'damage');
      actorValues.set(pcFormId, sprintAttr, 'damage', damageMod - staminaReduce);
    } else {
      actorValues.set(pcFormId, `mp_${sprintAttr}drain` as AttrAll, 'base', 0);
    }
    console.log('Event _onSprintStateChange: ', Date.now() - start);
  };

  mp.makeEventSource('_onWeaponDrawChange', factory('isWeaponDrawn'));

  mp['_onWeaponDrawChange'] = (pcFormId: number, isWeaponDrawn: boolean) => {
    if (!pcFormId) return console.log('Plz reconnect');
    console.log('isWeaponDrawn', isWeaponDrawn);
    mp.set(pcFormId, 'isWeaponDrawn', isWeaponDrawn);
  };

  mp.makeEventSource('_onDead', factory('isDead'));

  mp['_onDead'] = (pcFormId: number, isDead: boolean) => {
    // if (!pcFormId) return console.log('Plz reconnect');
    if (isDead) {
      console.log(`${pcFormId.toString(16)} died`);
    }
    mp.set(pcFormId, 'isDead', true);
  };

  mp.makeEventSource('_onFly', factory('isFlying'));
  
  mp['_onFly'] = (pcFormId: number, isFlying: boolean) => {
    if (!pcFormId) return console.log('Plz reconnect');
    console.log('isFlying', isFlying);
    mp.set(pcFormId, 'isFlying', isFlying);
  };
};
