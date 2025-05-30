import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/Component Styles/NavBar.module.css";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

/**
 * A navigation bar component for the website.
 * Includes responsive design with separate menus for desktop and mobile.
 */
const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggles the mobile menu visibility
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  return (
    <div className={styles.header}>
      {/* Contact Info Section */}
      <div className={styles.contactSection}>
        <div className={styles.contactDetails}>
          <div className={styles.contactItem}>
            <FontAwesomeIcon icon={faPhone} className={styles.icon} />
            <a href="tel:+359886790681">+359886790681 - {t('contact.niki')}</a>
          </div>
          <div className={styles.contactItem}>
            <FontAwesomeIcon icon={faPhone} className={styles.icon} />
            <a href="tel:+359884535509">+359884535509 - {t('contact.kika')}</a>
          </div>
          <div className={styles.contactItem}>
            <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
            <a href="mailto:abstract.apartments@gmail.com">abstract.apartments@gmail.com</a>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className={styles.navBar}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/"><img src={isEnglish ? "/Images/Logo.png" : "/Images/Logo_Bulgarian.png"} alt="Logo" className={styles.logoImage} /></Link>
        </div>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <Link href="/" locale={i18n.language}>{t('nav.home')}</Link>
          <Link href="/about" locale={i18n.language}>{t('nav.details')}</Link>
          <Link href="/services" locale={i18n.language}>{t('nav.gallery')}</Link>
          <Link href="/AvailableDates" locale={i18n.language}>{t('nav.dates')}</Link>
          <Link href="/PriceList" locale={i18n.language}>{t('nav.pricelist')}</Link>
          <Link href="/contact" locale={i18n.language}>{t('nav.contact')}</Link>
          <Link href="/reviews" locale={i18n.language}>{t('nav.reviews')}</Link>

          <button
            onClick={() =>
              router.push(router.pathname, router.asPath, {
                locale: locale === 'en' ? 'bg' : 'en',
              })
            }
            className={styles.langButton}
          >
            {locale === 'en' ? '🇧🇬 BG' : '🇬🇧 EN'}
          </button>

        </div>

        {/* Mobile Menu */}
        <div className={styles.mobileMenu}>
          <div className={styles.hamburgerMenu} onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </div>
          <div
            className={`${styles.mobileNavLinks} ${menuOpen ? styles.showMobileMenu : ""
              }`}
          >
            <Link href="/" locale={i18n.language} onClick={toggleMenu}>
              {t('nav.home')}
            </Link>
            <Link href="/about" locale={i18n.language} onClick={toggleMenu}>
              {t('nav.details')}
            </Link>
            <Link href="/services" locale={i18n.language} onClick={toggleMenu}>
              {t('nav.gallery')}
            </Link>
            <Link href="/AvailableDates" locale={i18n.language} onClick={toggleMenu}>
              {t('nav.dates')}
            </Link>
            <Link href="/PriceList" locale={i18n.language} onClick={toggleMenu}>
              {t('nav.pricelist')}
            </Link>
            <Link href="/contact" locale={i18n.language} onClick={toggleMenu}>
              {t('nav.contact')}
            </Link>
            <Link href="/reviews" locale={i18n.language} onClick={toggleMenu}>
              {t('nav.reviews')}
            </Link>
            <button
              onClick={() => {
                router.push(router.pathname, router.asPath, {
                  locale: locale === 'en' ? 'bg' : 'en',
                });
                toggleMenu();
              }}              className={styles.langButton}
            >
              {locale === 'en' ? '🇧🇬 BG' : '🇬🇧 EN'}
            </button>

            {/* <button onClick={toggleLanguage} className={styles.langButton}>
              {language === 'EN' ? 'BG' : 'EN'}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
