import Meta from "@/components/Page Components/Meta";
import PageTitle from "@/components/Page Components/PageTitle";
import styles from '../styles/Page Styles/About.module.css';
import AboutCarousel from "@/components/Page Components/AboutCarousel";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import {
  Users, BedDouble, UtensilsCrossed, Snowflake, ShowerHead, WashingMachine,
  Home, Flame, Tv, Wifi, Flag
} from 'lucide-react'; // <--- import icons from Lucide

const About = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Meta title={t('details.metaTitle')} />
      <PageTitle title={t('details.pageTitle')} />

      <div className={styles.aboutContainer}>
        {/* <AboutCarousel /> */}

        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>{t('details.sectionTitle')}</h2>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}><Users className={styles.featureIcon} />{t('details.capacity')}</li>
            <li className={styles.featureItem}><BedDouble className={styles.featureIcon} />{t('details.beds')}</li>
            <li className={styles.featureItem}><UtensilsCrossed className={styles.featureIcon} />{t('details.kitchen')}</li>
            <li className={styles.featureItem}><BedDouble className={styles.featureIcon} />{t('details.twoBedrooms')}</li>
            <li className={styles.featureItem}><Snowflake className={styles.featureIcon} />{t('details.ac')}</li>
            <li className={styles.featureItem}><ShowerHead className={styles.featureIcon} />{t('details.bathroom')}</li>
            <li className={styles.featureItem}><WashingMachine className={styles.featureIcon} />{t('details.washer')}</li>
            <li className={styles.featureItem}><Home className={styles.featureIcon} />{t('details.balconyBedrooms')}</li>
            <li className={styles.featureItem}><Flame className={styles.featureIcon} />{t('details.terrace')}</li>
            <li className={styles.featureItem}><Tv className={styles.featureIcon} />{t('details.tvEveryRoom')}</li>
            <li className={styles.featureItem}><Tv className={styles.featureIcon} />{t('details.smartTv')}</li>
            <li className={styles.featureItem}><Wifi className={styles.featureIcon} />{t('details.wifi')}</li>
            <li className={styles.featureItem}><Flag className={styles.featureIcon} />{t('details.bgTv')}</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default About;
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])), // 👈 must include 'common'
    },
  };
}