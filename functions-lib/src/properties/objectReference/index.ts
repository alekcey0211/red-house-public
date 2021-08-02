import { statePropFactory } from '../../papyrus/multiplayer/functions';
import { Ctx } from '../../types/ctx';
import { Mp } from '../../types/mp';
import { FunctionInfo } from '../../utils/functionInfo';

function displayNameUpdate(ctx: Ctx<{ lastDislpayName: string }, string>) {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastDislpayName !== ctx.value) {
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    ref.setDisplayName(ctx.value, false);
    ctx.state.lastDislpayName = ctx.value;
  }
}

const setObjectDamageStage = (ctx: Ctx<{ lastObjectDamageStage: number }, number>) => {
  if (!ctx.refr) return;
  if (ctx.value !== undefined && ctx.state.lastObjectDamageStage !== ctx.value) {
    const stage = ctx.value;
    const obj = ctx.refr;

    const objectStage = obj.getCurrentDestructionStage();
    if (!objectStage) return;

    const currentStage = objectStage < 0 ? 0 : objectStage;
    const damage = 100;
    if (stage < currentStage) {
      obj.clearDestruction();
      for (let i = 0; i < stage; i++) {
        obj.damageObject(damage);
      }
    } else {
      for (let i = 0; i < stage - currentStage; i++) {
        obj.damageObject(damage);
      }
    }
    ctx.state.lastObjectDamageStage = ctx.value;
  }
};

const setOpenState = (ctx: Ctx<{ lastOpenState: boolean | undefined }, boolean | undefined>) => {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastOpenState !== ctx.value) {
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    ctx.sp.printConsole(ref.getFormID(), ctx.value);
    ref.setOpen(ctx.value);
    ctx.state.lastOpenState = ctx.value;
  }
};

const activeShader = (
  ctx: Ctx<{ lastActiveShaderExecN: number | undefined }, { n: number; id: number; duration?: number } | undefined>
) => {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastActiveShaderExecN !== ctx.value.n) {
    ctx.state.lastActiveShaderExecN = ctx.value.n;
    if (!ctx.value.n || !ctx.value.id) return;
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    const effForm = ctx.sp.Game.getFormEx(ctx.value.id);
    if (!effForm) return;
    const eff = ctx.sp.EffectShader.from(effForm);
    if (!eff) return;
    // ctx.sp.printConsole(Date.now(), JSON.stringify(ctx.value));
    eff.play(ref, ctx.value.duration ?? 0);
  }
};
const activeVisualEffect = (
  ctx: Ctx<
    { lastActiveVisualEffectExecN: number | undefined },
    { n: number; id: number; facingRefId: number; duration?: number } | undefined
  >
) => {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastActiveVisualEffectExecN !== ctx.value.n) {
    ctx.state.lastActiveVisualEffectExecN = ctx.value.n;
    if (!ctx.value.n || !ctx.value.id) return;
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    const effForm = ctx.sp.Game.getFormEx(ctx.value.id);
    if (!effForm) return;
    const eff = ctx.sp.VisualEffect.from(effForm);
    if (!eff) return;
    // ctx.sp.printConsole(Date.now(), JSON.stringify(ctx.value));
    eff.play(ref, ctx.value.duration ?? 0, ref);
  }
};
const ALCHequipped = (
  ctx: Ctx<{ lastALCHequippedExecN: number | undefined }, { n: number; id: number } | undefined>
) => {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastALCHequippedExecN !== ctx.value.n) {
    ctx.state.lastALCHequippedExecN = ctx.value.n;
    if (!ctx.value.n || !ctx.value.id) return;
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    const item = ctx.sp.Game.getFormEx(ctx.value.id);
    ctx.sp.printConsole(Date.now(), ctx.getFormIdInServerFormat(ac.getFormID()).toString(16));
    ac.equipItem(item, false, true);
  }
};

export const register = (mp: Mp): void => {
  mp.makeProperty('displayName', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new FunctionInfo(displayNameUpdate).tryCatch(),
    updateNeighbor: new FunctionInfo(displayNameUpdate).tryCatch(),
  });
  mp.makeProperty('currentDestructionStage', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new FunctionInfo(setObjectDamageStage).tryCatch(),
    updateNeighbor: new FunctionInfo(setObjectDamageStage).tryCatch(),
  });
  statePropFactory(mp, 'cellDesc');
  mp.makeProperty('openState', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new FunctionInfo(setOpenState).tryCatch(),
    updateNeighbor: new FunctionInfo(setOpenState).tryCatch(),
  });
  mp.makeProperty('activeShader', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new FunctionInfo(activeShader).tryCatch(),
    updateNeighbor: new FunctionInfo(activeShader).tryCatch(),
  });
  mp.makeProperty('activeVisualEffect', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new FunctionInfo(activeVisualEffect).tryCatch(),
    updateNeighbor: new FunctionInfo(activeVisualEffect).tryCatch(),
  });
  mp.makeProperty('ALCHequipped', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new FunctionInfo(ALCHequipped).tryCatch(),
    updateNeighbor: new FunctionInfo(ALCHequipped).tryCatch(),
  });
};
