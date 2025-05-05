/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'bg',
    locales: ['bg', 'en'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
