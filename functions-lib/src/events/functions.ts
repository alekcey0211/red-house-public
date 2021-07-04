import { Ctx } from '../types/ctx';
import { EquipEvent, HitEvent } from '../types/skyrimPlatform';

export const onLoad = (ctx: Ctx) => {
  ctx.sp.once('update', () => {
    ctx.sp.Utility.wait(0.3).then(() => {
      ctx.sendEvent();
    });
  });
};

export const onCellChange = (ctx: Ctx) => {
  ctx.sp.on('update', () => {
    const ac = ctx.sp.Game.getPlayer();
    if (ac?.getFormID() !== 0x14) return;

    const currentCell = ac.getParentCell();

    if (currentCell && ctx.state.currentCell !== currentCell?.getFormID()) {
      if (ctx.state.currentCell !== undefined) {
        ctx.sendEvent({
          prevCell: ctx.state.currentCell,
          currentCell: currentCell?.getFormID(),
        });
      }
      ctx.state.currentCell = currentCell?.getFormID();
    }
  });
};

export const onHit = (ctx: Ctx, isHitStatic: boolean) => {
  ctx.sp.on('hit', (event: any) => {
    const e = event as HitEvent;
    const baseId = e.agressor?.getBaseObject()?.getFormID();
    if (e.agressor?.getFormID() !== 0x14 && baseId === 7) return;

    const targetActor = ctx.sp.Actor.from(e.target);
    if (!!targetActor === isHitStatic) return;
    if (e.source && ctx.sp.Spell.from(e.source)) return;

    const target = ctx.getFormIdInServerFormat(e.target?.getFormID());
    const agressor = ctx.getFormIdInServerFormat(e.agressor?.getFormID());

    ctx.sendEvent({
      isPowerAttack: e.isPowerAttack,
      isSneakAttack: e.isSneakAttack,
      isBashAttack: e.isBashAttack,
      isHitBlocked: e.isHitBlocked,
      target,
      agressor,
    });
  });
};

export const onEquip = (ctx: Ctx) => {
  ctx.sp.on('equip', (event: any) => {
    const e: EquipEvent = event as EquipEvent;
    const target = ctx.getFormIdInServerFormat(e.baseObj?.getFormID());
    const actor = ctx.getFormIdInServerFormat(e.actor.getFormID());
    ctx.sendEvent({
      actor,
      target,
      player: ctx.sp.Game.getPlayer()?.getFormID(),
    });
  });
};

export const onInput = (ctx: Ctx<{ keys: number }>) => {
  ctx.sp.on('update', () => {
    const keys = ctx.sp.Input.getNumKeysPressed();
    if (ctx.state.keys !== keys) {
      if (ctx.state.keys !== undefined && keys) {
        const keycodes = [];
        for (let i = 0; i < keys; i++) {
          keycodes.push(ctx.sp.Input.getNthKeyPressed(i));
        }
        ctx.sendEvent(keycodes);
      }
      ctx.state.keys = keys;
    }
  });
};

export const onAnimationEvent = (ctx: Ctx<{ prevAnimation: string }>) => {
  const next = ctx.sp.storage._api_onAnimationEvent as { callback: any };
  ctx.sp.storage._api_onAnimationEvent = {
    callback(...args: any) {
      const [serversideFormId, animEventName] = args;
      // ctx.sp.printConsole(serversideFormId);
      ctx.sendEvent({
        current: animEventName,
        previous: ctx.state.prevAnimation,
      });
      ctx.state.prevAnimation = animEventName;
      if (typeof next.callback === 'function') {
        next.callback(...args);
      }
    },
  };
};

export const onUiMenuToggle = (ctx: Ctx<{ lastMenuState: boolean }, boolean>) => {
  const badMenus = [
    'BarterMenu',
    'Book Menu',
    'ContainerMenu',
    // 'Crafting Menu',
    'GiftMenu',
    'InventoryMenu',
    'Journal Menu',
    'Lockpicking Menu',
    'Loading Menu',
    'MapMenu',
    'RaceSex Menu',
    'StatsMenu',
    'TweenMenu',
    'Console',
    'Loading Menu',
    'Main Menu',
  ];

  const allMenu = [
    'BarterMenu',
    'Book Menu',
    'Console',
    'Console Native UI Menu',
    'ContainerMenu',
    'Crafting Menu',
    'Credits Menu',
    'Cursor Menu',
    'Debug Text Menu',
    'Dialogue Menu',
    'Fader Menu',
    'FavoritesMenu',
    'GiftMenu',
    'HUD Menu',
    'InventoryMenu',
    'Journal Menu',
    'Kinect Menu',
    'LevelUp Menu',
    'Loading Menu',
    'Main Menu',
    'Lockpicking Menu',
    'MagicMenu',
    'MapMenu',
    'MessageBoxMenu',
    'Mist Menu',
    'Overlay Interaction Menu',
    'Overlay Menu',
    'Quantity Menu',
    'RaceSex Menu',
    'Sleep/Wait Menu',
    'StatsMenu',
    'TitleSequence Menu',
    'Top Menu',
    'Training Menu',
    'Tutorial Menu',
    'TweenMenu',
  ];

  ctx.sp.on('update', () => {
    const isMenuOpen = badMenus.findIndex((menu) => ctx.sp.Ui.isMenuOpen(menu)) >= 0;
    if (ctx.state.lastMenuState !== isMenuOpen) {
      if (ctx.state.lastMenuState !== undefined && isMenuOpen !== undefined) {
        ctx.sendEvent(isMenuOpen);
      }
      ctx.state.lastMenuState = isMenuOpen;
    }
  });
};

export const onEffectStart = (ctx: Ctx) => {
  ctx.sp.on('effectStart', (event: any) => {
    if (event.caster?.getFormID() !== 0x14) return;

    const target = ctx.getFormIdInServerFormat(event.target?.getFormID());
    const caster = ctx.getFormIdInServerFormat(event.caster?.getFormID());

    ctx.sendEvent({
      caster,
      target,
      effect: event.effect?.getFormID(),
      mag: event.activeEffect?.getMagnitude(),
    });
  });
};

export const onCurrentCrosshairChange = (ctx: Ctx) => {
  ctx.sp.on('update', () => {
    const ref = ctx.sp.Game.getCurrentCrosshairRef();
    const refId = ref?.getFormID();
    if (ctx.state.lastCrosshairRef !== refId) {
      ctx.sendEvent({
        CrosshairRefId: refId,
      });
      ctx.state.lastCrosshairRef = refId;
    }
  });
};
