import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import styles from '../../styles/Component Styles/ImageCarousel.module.css'

/**
 * A component that displays a carousel of images with autoplay and no navigation arrows or dots.
 * @returns {JSX.Element} The ImageCarousel component.
 */
const AboutCarousel = () => {
  //Settings for the image carousel 
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <div className={styles.container}>
        <Slider {...settings}>
          <div className={styles.image}>
            <img src='/Images/About Slider Images/Slider_Image_1.jpg' alt='Slider Image 1' />
          </div>
          <div className={styles.image}>
            <img src='/Images/About Slider Images/Slider_Image_2.jpg' alt='Slider Image 2' />
          </div>
          <div className={styles.image}>
            <img src='/Images/About Slider Images/Slider_Image_4.jpg' alt='Slider Image 4' />
          </div>
          <div className={styles.image}>
            <img src='/Images/About Slider Images/Slider_Image_3.jpg' alt='Slider Image 3' />
          </div>
        </Slider>
      </div>
    </>
  );
};

export default AboutCarousel

