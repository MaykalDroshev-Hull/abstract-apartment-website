import React, { useEffect, useState } from 'react';
import styles from '../styles/Page Styles/Reviews.module.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        setReviews(data.reviews); // Display the first 15 reviews
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className={styles.reviewSection}>
      <h2 className={styles.sectionTitle}>Какво казват нашите гости</h2>
      <div className={styles.reviewGrid}>
        {reviews.map((review, index) => (
          <div key={index} className={`${styles.reviewCard} ${styles[`card${index % 5}`]}`}>
            <h3 className={styles.name}>{review.name}</h3>
            <p className={styles.text}>&ldquo;{review.review}&rdquo;</p>
            <p className={styles.date}>{review.date}</p>
            {/* Display star rating */}
            <div className={styles.rating}>
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
          </div>
        ))}
      </div>

      {/* "И още много" text */}
      <p className={styles.moreReviewsText}>И още много...</p>

      {/* Google Review Button */}
      <a href="https://search.google.com/local/reviews?placeid=ChIJF91uqn7dq0ARxnEmywQWheI" target="_blank" rel="noopener noreferrer">
        <button className={styles.googleReviewButton}>
          <img
            src="Images\Reviews\GoogleLogo.png"
            alt="Google Reviews"
            className={styles.googleReviewLogo}
          />
          Прочетете повече отзиви в Google
        </button>
      </a>
      {/* Leave a Review Button */}
      <a href="https://search.google.com/local/writereview?placeid=ChIJF91uqn7dq0ARxnEmywQWheI" target="_blank" rel="noopener noreferrer">
        <button className={styles.leaveReviewButton}>
        <img
            src="Images\Reviews\5Stars.png"
            alt="Google Reviews"
            className={styles.googleReviewLogo}
          />
          Оставете вашия отзив
        </button>
      </a>
    </div>
  );

};

export default Reviews;
