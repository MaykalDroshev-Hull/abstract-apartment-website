/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    locales: ['bg', 'en'],
    defaultLocale: 'bg',
    localeDetection: false 
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
