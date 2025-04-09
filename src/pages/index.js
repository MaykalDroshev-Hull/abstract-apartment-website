import { useDisclosure } from '@chakra-ui/react'
import Meta from '@/components/Page Components/Meta'
import styles from '../styles/Page Styles/Index.module.css'
import buttonStyles from '../styles/Component Styles/FlowButton.module.css'
import Link from "next/link";

/**
 * Home component that renders the homepage of the website.
 * @returns {JSX.Element} The JSX element to be rendered.
 */
const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Meta />
      

      {/* Full-Width Image Placeholder */}
      {/* <div className={styles.fullWidthImage}>
        <img src="/Images/index/" alt="Full-Width Placeholder" />
      </div> */}
    </>
  );
};

export default Home;
