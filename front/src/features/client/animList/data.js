export default {
  groups: [
    { name: 'Избранное', type: 'group' },
    { name: 'Социальное', type: 'group' },
    { name: 'Позы', type: 'group' },
    { name: 'Музыка и танцы', type: 'group' },
    { name: 'Бой', type: 'group' },
    { name: 'Остальное', type: 'group' }
  ],
  items: [
    {
      code: 'IdleWave',
      codeType: 'idle',
      name: 'Приветствие/махать рукой',
      parents: ['Социальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleSalute',
      codeType: 'idle',
      name: 'Военное приветствие',
      parents: ['Социальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleSilentBow',
      codeType: 'idle',
      name: 'Приветствие с почтением',
      parents: ['Социальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleDialogueMovingTalkC',
      codeType: 'idle',
      name: 'Разговаривать 1',
      parents: ['Социальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleDialogueMovingTalkD',
      codeType: 'idle',
      name: 'Разговаривать 2',
      parents: ['Социальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleApplaud2',
      codeType: 'idle',
      name: 'Апплодировать',
      parents: ['Социальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleApplaud5',
      codeType: 'idle',
      name: 'Восхищённо апплодировать',
      parents: ['Социальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleComeThisWay',
      codeType: 'idle',
      name: 'Позвать к себе',
      parents: ['Социальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleLaugh',
      codeType: 'idle',
      name: 'Смеяться',
      parents: ['Социальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'pa_HugA',
      codeType: 'idle',
      name: 'Обнять',
      parents: ['Социальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleCoffinEnter',
      codeType: 'event',
      name: 'Лежать/спать на спине',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleLayDownEnter',
      codeType: 'event',
      name: 'Лежать с руками за головой',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleSitLedgeEnter',
      codeType: 'event',
      name: 'Сидеть, свесив ноги',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleSitCrossLeggedEnter',
      codeType: 'event',
      name: 'Сидеть в позе лотоса',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleChildSitOnKnees',
      codeType: 'event',
      name: 'Сидеть на коленях',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleOffsetArmsCrossedStart',
      codeType: 'idle',
      name: 'Скрестить руки',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdlePray',
      codeType: 'idle',
      name: 'Молиться',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleRitualSkull1',
      codeType: 'idle',
      name: 'Молиться 2',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleWarmHands',
      codeType: 'idle',
      name: 'Греть руки у костра',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleChildCryingStart',
      codeType: 'event',
      name: 'Плакать',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'OffsetBoundStandingStart',
      codeType: 'event',
      name: 'Стоять связанным',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleEatingStandingStart',
      codeType: 'idle',
      name: 'Есть хлеб',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleDrinkPotion',
      codeType: 'idle',
      name: 'Пить из бутылки',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleMQ201Drink',
      codeType: 'idle',
      name: 'Пить из стакана',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleMQ201ToastStart',
      codeType: 'idle',
      name: 'Поднять тост',
      parents: ['Позы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleLuteStart',
      codeType: 'idle',
      name: 'Играть на лютне',
      parents: ['Музыка и танцы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleDrumStart',
      codeType: 'idle',
      name: 'Играть на барабане',
      parents: ['Музыка и танцы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleFluteStart',
      codeType: 'idle',
      name: 'Играть на флейте',
      parents: ['Музыка и танцы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleCiceroDance1',
      codeType: 'idle',
      name: 'Танец 1',
      parents: ['Музыка и танцы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleCiceroDance2',
      codeType: 'idle',
      name: 'Танец 2',
      parents: ['Музыка и танцы'],
      marked: false,
      type: 'item'
    },
    {
      code: '00Dance01Start',
      codeType: 'idle',
      name: 'Танец из мода (старт)',
      parents: ['Музыка и танцы'],
      marked: false,
      type: 'item'
    },
    {
      code: '00DanceStop',
      codeType: 'idle',
      name: 'Танец из мода (стоп)',
      parents: ['Музыка и танцы'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleCivilWarCheer',
      codeType: 'idle',
      name: 'Боевой клич',
      parents: ['Бой'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleWounded_01',
      codeType: 'idle',
      name: 'Лежать раненным',
      parents: ['Бой'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleWounded_02',
      codeType: 'idle',
      name: 'Сидеть раненным',
      parents: ['Бой'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleInjured',
      codeType: 'idle',
      name: 'Стоять раненным',
      parents: ['Бой'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleCoweringLoose',
      codeType: 'idle',
      name: 'Сесть с руками за головой',
      parents: ['Бой'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleSurrender',
      codeType: 'idle',
      name: 'Сдаюсь',
      parents: ['Бой'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleLockPick',
      codeType: 'idle',
      name: 'Взламывать дверь',
      parents: ['Остальное'],
      marked: false,
      type: 'item'
    },
    {
      code: 'IdleNoteRead',
      codeType: 'idle',
      name: 'Читать письмо',
      parents: ['Остальное'],
      marked: false,
      type: 'item'
    }
  ]
}