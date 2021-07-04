import icons from '../icons';
import { FormType } from '/types/formtype'

const defaultState = {
  inventoryTabs: [
    {
      name: 'favorite',
      icon: icons.tabs.favorite,
      isActivate: true
    },
    {
      name: FormType.FkFormType_All,
      icon: icons.tabs.all,
      isActivate: true
    },
    {
      name: FormType.kFormType_Weapon,
      icon: icons.tabs.weapons,
      isActivate: true
    },
    {
      name: FormType.kFormType_Armor,
      icon: icons.tabs.armor,
      isActivate: true
    },
    {
      name: FormType.kFormType_Potion,
      icon: icons.tabs.alchemy,
      isActivate: true
    },
    {
      name: FormType.kFormType_ScrollItem,
      icon: icons.tabs.scrolls,
      isActivate: true
    },
    {
      name: FormType.FkFormType_Eat,
      icon: icons.tabs.eat,
      isActivate: true
    },
    {
      name: FormType.kFormType_Ingredient,
      icon: icons.tabs.ingredients,
      isActivate: true
    },
    {
      name: FormType.kFormType_Book,
      icon: icons.tabs.books,
      isActivate: true
    },
    {
      name: FormType.kFormType_MaterialType,
      icon: icons.tabs.materials,
      isActivate: true
    },

  ],
  inventoryList: [
    // {
    //   id: 0x1321,
    //   name: 'Орихалковый меч',
    //   category: FormType.kFormType_Weapon,
    //   icon: icons.tabs.weapons,
    //   count: 4
    // },
    // {
    //   id: 0x12453,
    //   name: 'Стальной меч',
    //   category: FormType.kFormType_Weapon,
    //   icon: icons.tabs.weapons,
    //   count: 10
    // },
    // {
    //   id: 0x122336,
    //   name: 'Эбонитовый меч',
    //   category: FormType.kFormType_Weapon,
    //   icon: icons.tabs.weapons,
    //   count: 3
    // },
    // {
    //   id: 0x12456343,
    //   name: 'Железный меч',
    //   category: FormType.kFormType_Weapon,
    //   icon: icons.tabs.weapons,
    //   count: 11
    // }
  ],
  suggestionPlayer:
  {
    playerName: '',
    coast: 0,
    suggestionList: [] // Список предметов текущего игрока на трейд
  },
  suggestionPerson:
  {
    personName: '',
    coast: 0,
    suggestionList: [] // Список предметов второго игрока на трейд
  },
  activatePlayer: false, // Активировал ли текущий игрок замок
  activatePerson: false, // Активировал ли второй игрок замок
  playerSubmit: false,   // Подтвердил ли текущий игрок обмен
  personSubmit: false    // Подтвердил ли второй игрой обмен
};

export default defaultState;

