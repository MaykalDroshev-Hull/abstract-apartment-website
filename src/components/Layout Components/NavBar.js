import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/Component Styles/NavBar.module.css";

/**
 * A navigation bar component for the website.
 * Includes responsive design with separate menus for desktop and mobile.
 */
const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggles the mobile menu visibility
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className={styles.header}>
      {/* Contact Info Section */}
      <div className={styles.contactSection}>
        <div className={styles.contactDetails}>
          <div className={styles.contactItem}>
            <FontAwesomeIcon icon={faPhone} className={styles.icon} />
            <a href="tel:+359889301414">+359889301414</a>
          </div>
          <div className={styles.contactItem}>
            <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
            <a href="mailto:abstract_apartment@abv.bg">abstract_apartment@abv.bg</a>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className={styles.navBar}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/"><img src="/Images/Logo_Bulgarian.png" alt="Logo" className={styles.logoImage} /></Link>
        </div>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <Link href="/">Начало</Link>
          <Link href="/about">Детайли</Link>
          <Link href="/services">Галерия</Link>
          <Link href="/AvailableDates">Налични Дати</Link>
          <Link href="/PriceList">Ценоразпис</Link>
          <Link href="/contact">Контакти</Link>
          <Link href="/reviews">Ревюта</Link>
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
            <Link href="/" onClick={toggleMenu}>
              Начало
            </Link>
            <Link href="/about" onClick={toggleMenu}>
              Детайли
            </Link>
            <Link href="/services" onClick={toggleMenu}>
              Галерия
            </Link>
            <Link href="/contact" onClick={toggleMenu}>
              Налични Дати
            </Link>
            <Link href="/PriceList" onClick={toggleMenu}>
              Ценоразпис
            </Link>
            <Link href="/contact" onClick={toggleMenu}>
              Контакти
            </Link>
            <Link href="/reviews" onClick={toggleMenu}>
              Ревюта
            </Link>
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
