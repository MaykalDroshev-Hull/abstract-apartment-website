import React, { useState } from 'react';
import Slider from 'react-slick';
import Meta from '@/components/Page Components/Meta';
import PageTitle from '@/components/Page Components/PageTitle';
import styles from '../styles/Page Styles/Services.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';



const Gallery = () => {

  const { t } = useTranslation();

  const [selectedRoom, setSelectedRoom] = useState([t('gallery.outside')]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryData = {
    [t('gallery.outside')]: ["ApartmentFromOutside.jpg", "MainDoor.jpg"],
    [t('gallery.bathroom')]: ["Bathroom.jpg"],
    [t('gallery.bedroom1')]: ["Bedroom1.jpg", "Bedroom1_1.jpg", "Bedroom1_2.jpg", "Bedroom1_3.jpg", "Bedroom1_4.jpg"],
    [t('gallery.bedroom2')]: ["Bedroom2.jpg", "Bedroom2_2.jpg", "Bedroom2_3.jpg"],
    [t('gallery.livingRoom')]: ["LivingArea1.jpg", "LivingAreaTable.jpg", "LivingRoom2.jpg", "LivingRoom4.jpg", "LivingRoom5.jpg", "LivingRoom7.jpg", "LivingRoom8.jpg", "LivingRoom9.jpg"],
    [t('gallery.kitchen')]: ["KitchenArea.jpg", "KitchenAreaCloser1.jpg"],
    [t('gallery.terrace')]: ["BigTerrace.jpg", "BigTerrace2.jpg", "BigTerrace3.jpg", "BigTerrace5.jpg", "BigTerrace6.jpg", "BigTerrace8.jpg", "BigTerrace9.jpg", "SmallTerrace.jpg", "SmallTerrace2.jpg"],
    [t('gallery.garage')]: ["Garage.jpg", "ElectricalAndInfoCloser.jpg"],
  };

  const images = galleryData[selectedRoom];

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };

  return (
    <>
      <Meta title={t("gallery.gallery")} />
      <PageTitle title={t("gallery.gallery")} />

      <div className={styles.tabContainer}>
        {galleryData && Object.keys(galleryData).length > 0 ? (
          Object.keys(galleryData).map((room) => (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className={`${styles.tabButton} ${selectedRoom === room ? styles.active : ''}`}
            >
              {room}
            </button>
          ))
        ) : (
          <button className={styles.tabButton} disabled>
            {t('gallery.outside')}
          </button>
        )}
      </div>

      <div className={styles.sliderContainer}>
        <Slider {...settings}>
          {galleryData[selectedRoom].map((filename, index) => (
            <div key={index} className={styles.slide}>
              <img
                src={`/Images/Gallery/${filename}`}
                alt={`${selectedRoom} ${index + 1}`}
                className={styles.image}
                onClick={() => setLightboxOpen(true)}
              />
            </div>
          ))}
        </Slider>
      </div>
      {lightboxOpen && (
        <Lightbox
          mainSrc={`/Images/Gallery/${images[lightboxIndex]}`}
          nextSrc={`/Images/Gallery/${images[(lightboxIndex + 1) % images.length]}`}
          prevSrc={`/Images/Gallery/${images[(lightboxIndex + images.length - 1) % images.length]}`}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex((lightboxIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % images.length)
          }
        />
      )}
    </>
  );
};

export default Gallery;
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}