import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '../../styles/Component Styles/ServicesCarousel.module.css';

/**
 * A customizable image carousel component.
 * @param {Object} props - Component props.
 * @param {Array} props.images - Array of image objects with `src` and `alt` attributes.
 * @returns {JSX.Element} The ServiceCarousel component.
 */
const ServiceCarousel = ({ images }) => {
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
    <div className={styles.container}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div className={styles.image} key={index}>
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ServiceCarousel;
