import { useDisclosure } from '@chakra-ui/react'
import Meta from '@/components/Page Components/Meta'
import styles from '../styles/Page Styles/Index.module.css'
import buttonStyles from '../styles/Component Styles/FlowButton.module.css'
import Link from "next/link";
import BookingBar from '@/components/Layout Components/BookingBar';
import PageTitle from "@/components/Page Components/PageTitle";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"; // Add useState + useEffect

/**
 * Home component that renders the homepage of the website.
 * @returns {JSX.Element} The JSX element to be rendered.
 */
const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const { checkin } = router.query;

  const [checkinDate, setCheckinDate] = useState("");

  useEffect(() => {
    if (checkin) {
      setCheckinDate(checkin);
    }
  }, [checkin]);


  return (
    <>
<Meta title="Апартамент Абстракт" />
      <div className={styles.heroSection}>
        <img
          src="/Images/index/DEMO-hero-image.jpg"
          alt="Luxury Car Detailing"
          className={styles.heroImage}
        />
        <div className={styles.overlayContent}>
          <div className={styles.slogan}>
            <h1>Комфорт. Стил. Уют –</h1>
            <p>Защото Вашият престой заслужава най-доброто.</p>
            <br /><br /><br />
            <BookingBar prefillCheckin={checkinDate} /> {/* Pass the date here */}
          </div>
        </div>
      </div>
      <div className={styles.whyChooseUsHeader}>
        <h1>Защо нас?</h1>
      </div>
      {/* Why Choose Us Section */}
      <div className={styles.whyChooseUs}>

        <div className={styles.textBlock}>
          <h3>Висококачествено обслужване</h3>
          <p>
  Нашият луксозен вила в Паралия, Кавала, е идеалното място за вашата лятна почивка. Предлагаме просторен и комфортен апартамент, който може да побере до 6 души (4+2). Със два двойни легла и разтегателен диван, ще се почувствате като у дома си.
  <br /><br />
  Осигуряваме всички необходими удобства за безпроблемен престой — климатик, безжичен интернет и модерна кухня. Планирайте своето безгрижно лято в Гърция с нас!
</p>
          <img src="/Images/index/Why-us-1.png" alt="Quality Service" className={styles.whyChooseImage} />
        </div>
        <div className={styles.textBlock}>
        <h3>Висококачествено обслужване</h3>
          <p>
  Нашият луксозен вила в Паралия, Кавала, е идеалното място за вашата лятна почивка. Предлагаме просторен и комфортен апартамент, който може да побере до 6 души (4+2). Със два двойни легла и разтегателен диван, ще се почувствате като у дома си.
  <br /><br />
  Осигуряваме всички необходими удобства за безпроблемен престой — климатик, безжичен интернет и модерна кухня. Планирайте своето безгрижно лято в Гърция с нас!
</p>
          <img src="/Images/index/Why-us-2.png" alt="Trusted Professionals" className={styles.whyChooseImage} />
        </div>
      </div>
    </>
  );
};

export default Home;
