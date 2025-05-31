import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Page Styles/Payment.module.css";
import { differenceInCalendarDays, eachDayOfInterval, format, parseISO } from "date-fns";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { enUS, bg } from 'date-fns/locale';
import Meta from '@/components/Page Components/Meta'


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PRICES_BY_MONTH = {
  4: 110, // May
  5: 130, // June
  6: 160, // July
  7: 160, // August
  8: 130, // September
  9: 100, // October
};

function calculatePaymentDetails(checkInStr, checkOutStr, dateLocale) {
  if (!checkInStr || !checkOutStr) return null;

  const checkIn = parseISO(checkInStr);
  const checkOut = parseISO(checkOutStr);
  const nights = differenceInCalendarDays(checkOut, checkIn);

  if (nights <= 0) return null;

  const dates = eachDayOfInterval({ start: checkIn, end: checkOut });
  dates.pop(); // Remove checkout day

  const prices = dates.map(date => {
    const month = date.getMonth();
    const price = PRICES_BY_MONTH[month] || 0;
    return { date, price };
  });

  let discount = 0;
  let discountedDate = null;

  if (nights >= 8) {
    const cheapestNight = prices.reduce((min, curr) => (curr.price < min.price ? curr : min), prices[0]);
    discount = cheapestNight.price;
    discountedDate = cheapestNight.date;
  }

  const total = prices.reduce((sum, p) => sum + p.price, 0) - discount;
  const deposit = total * 0.3;

  return {
    nights: prices.length,
    total,
    deposit,
    discount,
    discountedDate,
    perNight: prices.map(p => ({
      label: format(p.date, 'dd MMM', { locale: dateLocale }),
      price: p.price,
      isDiscounted: discountedDate && format(p.date, 'yyyy-MM-dd') === format(discountedDate, 'yyyy-MM-dd')
    })),
  };
}

const Payment = () => {
  const { t, i18n } = useTranslation('common');
  const dateLocale = i18n.language === 'bg' ? bg : enUS;

  const router = useRouter();
  const { checkIn, checkOut, guests, cancelled } = router.query;

  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [telephone, setTelephone] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const details = calculatePaymentDetails(checkIn, checkOut, dateLocale);
      setPaymentDetails(details);
    }
  }, [router.isReady, checkIn, checkOut, dateLocale]);

  const handleCheckout = async () => {
    setLoading(true);

    const stripe = await stripePromise;

    if (!paymentDetails) {
      alert("Missing or invalid dates");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkIn,
        checkOut,
        guests,
        amount: Math.round(paymentDetails.deposit * 100),
        firstName,
        lastName,
        telephone
      }),
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }

    setLoading(false);
  };

  return (
    <>
          <Meta title={t('metaTitle')} />
    <div className={styles.container}>
      <h1>{t('bookingPage.title')}</h1>
      {cancelled && (
        <div className={styles.cancelNotice}>
          <p>{t('bookingPage.cancelNotice')}</p>
        </div>
      )}
      {!cancelled && (
        <>
          <div className={styles.summary}>
            <p><strong>{t('bookingPage.checkin')}:</strong> {checkIn}</p>
            <p><strong>{t('bookingPage.checkout')}:</strong> {checkOut}</p>
            <p><strong>{t('bookingPage.guests')}:</strong> {guests}</p>

            {paymentDetails && (
              <>
                <p><strong>{t('bookingPage.totalNights')}:</strong> {paymentDetails.nights}</p>
                <div className={styles.breakdown}>
                  {paymentDetails.perNight.map((night, index) => (
                    <div key={index} className={`${styles.breakdownItem} ${night.isDiscounted ? styles.discounted : ''}`}>
                      <span>{night.label}</span>
                      <span>
                        {night.isDiscounted
                          ? t('bookingPage.freeNight', { price: night.price })
                          : t('bookingPage.nightPrice', { price: night.price })}
                      </span>
                    </div>
                  ))}
                </div>

                {paymentDetails.discount > 0 && (
                  <p className={styles.discountInfo}>
                    {t('bookingPage.longStayDiscount', { discount: paymentDetails.discount })}
                  </p>
                )}

                <p><strong>{t('bookingPage.total')}:</strong> €{paymentDetails.total.toFixed(2)}</p>
                <p><strong>{t('bookingPage.deposit')}:</strong> €{paymentDetails.deposit.toFixed(2)}</p>
              </>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="firstName">{t('bookingPage.firstName')}</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">{t('bookingPage.lastName')}</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="telephone">{t('bookingPage.phone')}</label>
            <input
              id="telephone"
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <button
            className={styles.payButton}
            onClick={handleCheckout}
            disabled={loading || !firstName || !lastName || !telephone}
          >
            {loading ? t('bookingPage.loading') : t('bookingPage.pay')}
          </button>
        </>
      )}
    </div></>
  );
};

export default Payment;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
