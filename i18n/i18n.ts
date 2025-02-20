import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './translations/en';
import fr from './translations/fr';

const i18n = new I18n({
  en,
  fr,
});

// Set initial locale
i18n.locale = Localization.locale;
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Add translation change listener
i18n.onChange = () => {
  // This will be called when translations change
  console.log('Language changed to:', i18n.locale);
};

export default i18n;