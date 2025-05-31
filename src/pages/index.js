import Meta from '@/components/Page Components/Meta'
import styles from '../styles/Page Styles/Index.module.css'
import BookingBar from '@/components/Layout Components/BookingBar';
import { useRouter } from "next/router";
import { useEffect, useState } from "react"; // Add useState + useEffect
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

/**
 * Home component that renders the homepage of the website.
 * @returns {JSX.Element} The JSX element to be rendered.
 */
const Home = () => {
  const router = useRouter();
  const { checkin } = router.query;

  const [checkinDate, setCheckinDate] = useState("");
  const { t } = useTranslation('common');

  useEffect(() => {
    if (checkin) {
      setCheckinDate(checkin);
    }
  }, [checkin]);


  return (
    <>
      <Meta title={t('metaTitle')} />
      <div className={styles.heroSection}>
        <img src="/Images/index/DEMO-hero-image.jpg" alt="Luxury Car Detailing" className={styles.heroImage} />
        <div className={styles.overlayContent}>
          <div className={styles.slogan}>
            <h1>{t('slogan.title')}</h1>
            <p>{t('slogan.subtitle')}</p>
            <br /><br /><br />
            <BookingBar prefillCheckin={checkinDate} />
          </div>
        </div>
      </div>

      <div className={styles.whyChooseUsHeader}>
        <h1>{t('whyUs.title')}</h1>
      </div>

      <div className={styles.whyChooseUs}>
        <div className={styles.textBlock}>
          <h3>{t('whyUs.card1.title')}</h3>
          <p>
            {t('whyUs.card1.text').split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>

          <img src="/Images/Gallery/LivingArea1.jpg" alt="Quality Service" className={styles.whyChooseImage} />
        </div>
      </div>
    </>
  );
};

export default Home;
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}