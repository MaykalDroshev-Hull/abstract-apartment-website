// components/LanguageSwitch.js
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Component Styles/LanguageSwitch.module.css';

const LanguageSwitch = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const isEnglish = currentLang === 'en';

  const toggleLanguage = () => {
    const newLanguage = isEnglish ? 'bg' : 'en';
    const newPath = router.asPath.replace(`/${currentLang}`, `/${newLanguage}`);
    i18n.changeLanguage(newLanguage);

    // Use router.push with reload option
    router.push(newPath, undefined, { scroll: false }).then(() => {
      router.reload(); // Reloads the page after navigating
    });
  };

  return (
    <button onClick={toggleLanguage} className={styles.switch}>
      <FontAwesomeIcon icon={faGlobe} className={styles.icon} />
      <span>{isEnglish ? 'EN' : 'BG'}</span>
    </button>
  );
};

export default LanguageSwitch;
