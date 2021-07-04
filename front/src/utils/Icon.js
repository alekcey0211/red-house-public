import icons from './icons'
import { FormType } from '../types/formtype'
import { WeaponType } from '../types/weapontype'

const iconWeaponTypes = {
  [WeaponType.Fists]: icons.tabs.weapons,
  [WeaponType.Swords]: icons.items.sword,
  [WeaponType.Daggers]: icons.tabs.weapons,
  [WeaponType.WarAxes]: icons.items.axe,
  [WeaponType.Maces]: icons.items.mace,
  [WeaponType.Greatswords]: icons.items.sword,
  [WeaponType.BattleaxesANDWarhammers]: icons.items.axe,
  [WeaponType.Bows]: icons.items.bow,
  [WeaponType.Staff]: icons.tabs.weapons,
  [WeaponType.Crossbows]: icons.items.crossbow
}

const iconTypes = {
  // TODO: Вернуть, когда разберутся с иконками.
  // [FormType.kFormType_Weapon]: type => {
  //   return iconWeaponTypes[type]
  // },
  [FormType.kFormType_Weapon]: icons.tabs.weapons,
  [FormType.kFormType_Armor]: icons.tabs.armor,
  [FormType.FkFormType_Eat]: icons.tabs.eat,
  [FormType.kFormType_Potion]: icons.tabs.alchemy,
  [FormType.kFormType_ScrollItem]: icons.tabs.scrolls,
  [FormType.kFormType_Ingredient]: icons.tabs.ingredients,
  [FormType.kFormType_Book]: icons.tabs.books,
  [FormType.kFormType_MaterialType]: icons.tabs.materials,
  [FormType.kFormType_Misc]: icons.tabs.materials,
}

const getIcon = (category, type = null) => {
  return iconTypes[category]
  // return type !== null ? iconTypes[category](type) : iconTypes[category]
}

export default getIcon