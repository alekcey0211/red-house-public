import { Mp } from '../types/mp';

interface stringsItem {
  Index: number;
  Text: string;
}

type localization = 'ru-RU' | 'en-US' | 'fr-FR' | 'de-DE' | 'it-IT' | 'ja-JP' | 'pl-PL' | 'es-ES';
type localizationFormat = 'russian' | 'english' | 'french' | 'german' | 'italian' | 'japanese' | 'polish' | 'spanish';

const formatLocalization = (locale: localization): localizationFormat => {
  switch (locale) {
    case 'ru-RU':
      return 'russian';

    case 'en-US':
      return 'english';

    case 'fr-FR':
      return 'french';

    case 'de-DE':
      return 'german';

    case 'it-IT':
      return 'italian';

    case 'ja-JP':
      return 'japanese';

    case 'pl-PL':
      return 'polish';

    case 'es-ES':
      return 'spanish';

    default:
      return 'english';
  }
};

export class StringLocalizationProvider {
  private strings: Record<string, stringsItem[]>;

  constructor(private mp: Mp, private stringsFilePath: string, locale: localization = 'en-US') {
    this.strings = {};
    const regex = new RegExp(`strings.+_${formatLocalization(locale)}\.json`);
    this.mp
      .readDataDirectory()
      .filter((x) => x.match(regex))
      .forEach((x) => {
        const espName = x.replace('strings\\', '').split('_')[0].toLowerCase().trim();
        this.strings[espName] = JSON.parse(this.mp.readDataFile(x));
      });
  }

  getText(espName: string, index: number) {
    if (!this.strings[espName]) return;
    return this.strings[espName].find((x) => x.Index.toString() === index.toString())?.Text;
  }
}
