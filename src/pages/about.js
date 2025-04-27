import Meta from "@/components/Page Components/Meta";
import PageTitle from "@/components/Page Components/PageTitle";
import styles from '../styles/Page Styles/About.module.css';
import AboutCarousel from "@/components/Page Components/AboutCarousel";

import { 
  Users, BedDouble, UtensilsCrossed, Snowflake, ShowerHead, WashingMachine,
  Home, Flame, Tv, Wifi, Flag 
} from 'lucide-react'; // <--- import icons from Lucide

const About = () => {
  return (
    <>
      <Meta title="Детайли" />
      <PageTitle title="Детайли" />

      <div className={styles.aboutContainer}>
        <AboutCarousel />

        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Капацитет и удобства</h2>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}><Users className={styles.featureIcon} />Капацитет: 6 човека</li>
            <li className={styles.featureItem}><BedDouble className={styles.featureIcon} />2 спални + 1 диван, който се разтяга за 2ма</li>
            <li className={styles.featureItem}><UtensilsCrossed className={styles.featureIcon} />Хол с кухненски блок – оборудвана кухня</li>
            <li className={styles.featureItem}><BedDouble className={styles.featureIcon} />2 спални</li>
            <li className={styles.featureItem}><Snowflake className={styles.featureIcon} />Климатици</li>
            <li className={styles.featureItem}><ShowerHead className={styles.featureIcon} />Баня с тоалетна – лична</li>
            <li className={styles.featureItem}><WashingMachine className={styles.featureIcon} />Пералня</li>
            <li className={styles.featureItem}><Home className={styles.featureIcon} />Всяка спалня е с тераса</li>
            <li className={styles.featureItem}><Flame className={styles.featureIcon} />Голяма тераса с барбекю/камина към хола</li>
            <li className={styles.featureItem}><Tv className={styles.featureIcon} />Телевизор във всяка стая</li>
            <li className={styles.featureItem}><Tv className={styles.featureIcon} />Смарт телевизор в хола</li>
            <li className={styles.featureItem}><Wifi className={styles.featureIcon} />WiFi</li>
            <li className={styles.featureItem}><Flag className={styles.featureIcon} />Българска телевизия</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default About;
