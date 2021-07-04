import icons from '/utils/icons';
import { FormType } from '/types/formtype'

export const defaultState = {
  settings: {
    craftName: "",
    craftDescription: "",
  //activeCategory: FormType.FkFormType_All,

  },
  inventoryTabs: [
    {
      name: 'favorite',
      icon: icons.tabs.favorite,
      isActivate: false
    },
    {
      name: FormType.FkFormType_All,
      icon: icons.tabs.all,
      isActivate: true
    },
    {
      name: FormType.kFormType_Weapon,
      icon: icons.tabs.weapons,
      isActivate: false
    },
    {
      name: FormType.kFormType_Armor,
      icon: icons.tabs.armor,
      isActivate: false
    },
    {
      name: FormType.kFormType_Potion,
      icon: icons.tabs.alchemy,
      isActivate: false
    },
    {
      name: FormType.kFormType_ScrollItem,
      icon: icons.tabs.scrolls,
      isActivate: false
    },
    {
      name: FormType.FkFormType_Eat,
      icon: icons.tabs.eat,
      isActivate: false
    },
    {
      name: FormType.kFormType_Ingredient,
      icon: icons.tabs.ingredients,
      isActivate: false
    },
    {
      name: FormType.kFormType_Book,
      icon: icons.tabs.books,
      isActivate: false
    },
    {
      name: FormType.kFormType_MaterialType,
      icon: icons.tabs.materials,
      isActivate: false
    }

  ],
  inventoryList: [
    {
      id: 0x12eb7,
      name: 'Лук порей',
      category: FormType.kFormType_Potion,
      icon: icons.tabs.eat,
      count: 10,
    },
    {
      id: 0x12eb8,
      name: 'Помидор',
      category: FormType.kFormType_Potion,
      icon: icons.tabs.eat,
      count: 1,
    },
    {
      id: 0x12eb9,
      name: 'Соль',
      category: FormType.kFormType_Potion,
      icon: icons.tabs.eat,
      count: 20,
    },
    {
      id: 0x13eb8,
      name: 'Картофель',
      category: FormType.kFormType_Potion,
      icon: icons.tabs.eat,
      count: 9,
    },
    {
      id: 0x15eb2,
      name: 'Початый круг эйдарского сыра',
      category: FormType.kFormType_Potion,
      icon: icons.tabs.eat,
      count: 33,
    }
  ],
  craftItems: [
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
  ],
 
}