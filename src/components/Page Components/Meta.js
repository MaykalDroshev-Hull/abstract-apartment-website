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
  const defaultKeywords = 'Car detailing, Auto detailing, Car cleaning, Car polishing, Paint correction, Ceramic coating, Car wash, Mobile detailing, Interior detailing, Exterior detailing, Waxing, Buffing, Upholstery Cleaning, Headlight Restoration, Detailing Packages, Detailing Services, Car Care Tips, Detailing Supplies, Detailing Equipment';
  const defaultDescription = `Асеа-м Детайлинг предлага професионални услуги за автомобилно детайлинг, които ще помогнат на вашия автомобил да изглежда на най-високото си ниво. Ние предлагаме различни пакети, които отговарят на вашите нужди, включително вътрешно и външно почистване, корекция на боята, керамично покритие и още. Свържете се с нас днес, за да насрочите час.`;

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
