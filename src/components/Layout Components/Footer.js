import Link from 'next/link'
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa'
import styles from '../../styles/Component Styles/Footer.module.css'

/**
 * The Footer component displays the footer section of the website, including social icons, menu items, and a wave effect container.
 * @returns {JSX.Element} The JSX code for the Footer component.
 */
const Footer = () => {
  return (
    <>
      <div className={styles.footer}>
        <Link href="/"><img className={styles.logo} src='/Images/Logo_Bulgarian.png' alt='logo' /></Link>
        <div className={styles.infoSection}>
          <div className={styles.contactItem}>
            <FaMapMarkerAlt className={styles.infoicon} />
            <a href="https://maps.app.goo.gl/Mazqq96okcJZLMNS9" target="_blank" rel="noopener noreferrer">
              <span>Greece, Kavala, Paralia Ofryniou</span>
            </a>
          </div>    
        </div>
        <div className={styles.socialIcon}>
          <Link href='https://www.facebook.com/profile.php?id=61575061973914'>
            <FaFacebook />
          </Link>
          <Link href='https://www.instagram.com/abstract_apartment'>
            <FaInstagram />
          </Link>
          {/* Phone Link */}
          <Link href='tel:+359889301414'>
            <FaPhone />
          </Link>

          {/* Email Link */}
          <Link href='abstract_apartment@abv.bg'>
            <FaEnvelope />
          </Link>
        </div>
        <div className={styles.menu}>
        <Link href="/">Начало</Link>
          <Link href="/about">Детайли</Link>
          <Link href="/services">Галерия</Link>
          <Link href="/contact">Налични Дати</Link>
          <Link href="/contact">Ценоразпис</Link>
          <Link href="/contact">Контакти</Link>
          <Link href="/reviews">Ревюта</Link>
        </div>
        <p className={styles.p} >Изработка от Майкъл Дрошев</p>
      </div>
    </>
  )
}


export default Footer