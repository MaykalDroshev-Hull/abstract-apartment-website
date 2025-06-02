import Head from "next/head";

/**
 * Renders a <Head> component with meta tags for SEO.
 * @param {object} props - The props object.
 * @param {string} title - The title of the page.
 * @param {string} keywords - The keywords for the page.
 * @param {string} description - The description of the page.
 * @returns {JSX.Element} A <Head> component with meta tags.
 */
const Meta = ({ title, keywords, description }) => {

  // Set default values if not provided
  const defaultTitle = "Abstract Apartment";
  const defaultKeywords = 'Апартамент под наем, Ваканционен апартамент, Паралия Офринио, Апартамент Гърция, Летен отдих, ... , Vacation rental, Apartment near the beach, Paralia Ofrynio, Summer apartment Greece, Family vacation, Private parking, BBQ, Sea getaway';
  const defaultDescription = 'Добре дошли в Апартамент “Абстракт” – уютен и напълно оборудван ваканционен апартамент само на 2 минути от плажа в Паралия Офринио, Гърция. Насладете се на комфорт с климатик, българска телевизия, голяма тераса, барбекю, частен паркинг и бърз интернет. Идеален за семейна почивка сред морски дарове, гръцко кафе и топло море. Резервирайте сега и усетете уюта на дома край морето!';

  return (
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='keywords' content={keywords || defaultKeywords} />
      <meta name='description' content={description || defaultDescription} />
      <meta charSet='utf-8' />
      <link rel='icon' href='/Logo-Square.png' />
      <link rel="apple-touch-icon" href="/Logo-Square-180x180.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/Logo-Square-32x32.png" />
      <link rel="icon" type="image/png" sizes="48x48" href="/Logo-Square-48x48.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/Logo-Square-96x96.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/Logo-Square-192x192.png" />
      <link rel="apple-touch-icon" type="image/png" sizes="167x167" href="/Logo-Square-167x167.png" />
      <link rel="apple-touch-icon" type="image/png" sizes="180x180" href="/Logo-Square-180x180.png" />
      <title>{title || defaultTitle}</title>
    </Head>
  );
};

export default Meta;
