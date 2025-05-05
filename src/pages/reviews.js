import React, { useEffect, useState } from 'react';
import styles from '../styles/Page Styles/Reviews.module.css';
import Meta from '@/components/Page Components/Meta'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const { i18n } = useTranslation();
  const { t } = useTranslation('common');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
      const response = await fetch(`/api/reviews?locale=${i18n.language}`);
      const data = await response.json();
      setReviews(data.reviews);
    } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
  
    fetchReviews();
  }, [i18n.language]);

  return (
<>
  <Meta title={t("reviews.metaTitle")} />

  <div className={styles.reviewSection}>
    <h2 className={styles.sectionTitle}>{t("reviews.heading")}</h2>

    <div className={styles.reviewGrid}>
      {reviews.map((review, index) => (
        <div key={index} className={`${styles.reviewCard} ${styles[`card${index % 5}`]}`}>
          <h3 className={styles.name}>{review.name}</h3>
          <p className={styles.text}>&ldquo;{review.review}&rdquo;</p>
          <p className={styles.date}>{review.date}</p>
          <div className={styles.rating}>
            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
          </div>
        </div>
      ))}
    </div>

    <p className={styles.moreReviewsText}>{t("reviews.moreText")}</p>

    <a
      href="https://search.google.com/local/reviews?placeid=ChIJF91uqn7dq0ARxnEmywQWheI"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button className={styles.googleReviewButton}>
        <img
          src="Images/Reviews/GoogleLogo.png"
          alt="Google Reviews"
          className={styles.googleReviewLogo}
        />
        {t("reviews.readMore")}
      </button>
    </a>

    <a
      href="https://search.google.com/local/writereview?placeid=ChIJF91uqn7dq0ARxnEmywQWheI"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button className={styles.leaveReviewButton}>
        <img
          src="Images/Reviews/5Stars.png"
          alt="Leave a review"
          className={styles.googleReviewLogo}
        />
        {t("reviews.leaveReview")}
      </button>
    </a>
  </div>
</>
  );

};

export default Reviews;
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}